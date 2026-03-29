import { fail, ok } from "@/lib/server/http";
import { getCurrentUser } from "@/lib/server/auth";
import { syncAccountSnapshot } from "@/lib/server/app-data";

export async function PUT(request: Request) {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return fail("Unauthorized", 401);
  }

  const body = await request.json();
  const profile = body?.profile;
  const favoriteDishIds = Array.isArray(body?.favoriteDishIds) ? body.favoriteDishIds : [];

  if (!profile) {
    return fail("Missing profile payload", 400);
  }

  await syncAccountSnapshot(supabase, user.id, {
    ...profile,
    favoriteDishIds,
  });

  return ok({ ok: true });
}

