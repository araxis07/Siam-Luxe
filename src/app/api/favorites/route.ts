import { z } from "zod";

import { getCurrentUser } from "@/lib/server/auth";
import { fail, ok } from "@/lib/server/http";

const favoriteMutationSchema = z.object({
  dishId: z.string().min(1),
  active: z.boolean(),
});

export async function GET() {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return fail("Unauthorized", 401);
  }

  const { data, error } = await supabase
    .from("favorite_dishes")
    .select("dish_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return fail("Unable to load favorites", 500, error.message);
  }

  return ok((data ?? []).map((item) => item.dish_id));
}

export async function POST(request: Request) {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return fail("Unauthorized", 401);
  }

  const parsed = favoriteMutationSchema.safeParse(await request.json());

  if (!parsed.success) {
    return fail("Invalid favorite payload", 400, parsed.error.flatten());
  }

  const { dishId, active } = parsed.data;

  if (active) {
    const { error } = await supabase.from("favorite_dishes").upsert({
      user_id: user.id,
      dish_id: dishId,
    });

    if (error) {
      return fail("Unable to save favorite", 500, error.message);
    }
  } else {
    const { error } = await supabase
      .from("favorite_dishes")
      .delete()
      .eq("user_id", user.id)
      .eq("dish_id", dishId);

    if (error) {
      return fail("Unable to remove favorite", 500, error.message);
    }
  }

  const { data, error } = await supabase
    .from("favorite_dishes")
    .select("dish_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return fail("Unable to reload favorites", 500, error.message);
  }

  return ok({
    favoriteDishIds: (data ?? []).map((item) => item.dish_id),
  });
}
