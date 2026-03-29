import { ok } from "@/lib/server/http";
import { getCurrentUser } from "@/lib/server/auth";
import { getAccountBootstrap } from "@/lib/server/app-data";

function getUserDisplayName(user: { email?: string | null; user_metadata?: { full_name?: unknown } }) {
  if (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim().length > 0) {
    return user.user_metadata.full_name;
  }

  if (typeof user.email === "string" && user.email.length > 0) {
    return user.email.split("@")[0];
  }

  return "Siam Lux Guest";
}

export async function GET() {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return ok({
      authenticated: false,
      profile: null,
      favoriteDishIds: [],
      reservations: [],
      submittedReviews: [],
      orders: [],
      notifications: [],
    });
  }

  const payload = await getAccountBootstrap(supabase, user.id, {
    email: user.email ?? "",
    fullName: getUserDisplayName(user),
    phone: typeof user.user_metadata?.phone === "string" ? user.user_metadata.phone : "",
    memberSince: user.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  });

  return ok(payload);
}

