"use client";

import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import { normalizeSeedGuestName } from "@/lib/user-display";
import { useUserStore } from "@/store/user-store";

function getMemberName(user: {
  email?: string | null;
  user_metadata?: { full_name?: unknown };
}) {
  const fullName = user.user_metadata?.full_name;

  if (typeof fullName === "string" && fullName.trim().length > 0) {
    return fullName;
  }

  if (typeof user.email === "string" && user.email.length > 0) {
    return user.email.split("@")[0];
  }

  return "Siam Lux Guest";
}

function getMemberPhone(user: { user_metadata?: { phone?: unknown } }) {
  const phone = user.user_metadata?.phone;

  return typeof phone === "string" ? phone : "";
}

export function AuthSessionSync() {
  const signInMember = useUserStore((state) => state.signInMember);
  const continueAsGuest = useUserStore((state) => state.continueAsGuest);

  useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      return;
    }

    let mounted = true;

    const syncUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (user) {
        signInMember({
          fullName: normalizeSeedGuestName(getMemberName(user)),
          email: user.email ?? "",
          phone: getMemberPhone(user),
          memberSince: user.created_at?.slice(0, 10),
        });
        return;
      }

      continueAsGuest();
    };

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      const user = session?.user;

      if (user) {
        signInMember({
          fullName: normalizeSeedGuestName(getMemberName(user)),
          email: user.email ?? "",
          phone: getMemberPhone(user),
          memberSince: user.created_at?.slice(0, 10),
        });
        return;
      }

      continueAsGuest();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [continueAsGuest, signInMember]);

  return null;
}
