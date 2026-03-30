import { z } from "zod";

import { fail, ok } from "@/lib/server/http";
import { getCurrentUser } from "@/lib/server/auth";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import { readJsonBody } from "@/lib/server/request-body";

const reviewSchema = z.object({
  guest: z.string().min(2),
  region: z.string().min(2),
  dishId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(12),
  locale: z.enum(["th", "en", "ja", "zh", "ko"]).default("th"),
});

export async function GET(request: Request) {
  const { supabase } = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const dishId = searchParams.get("dishId");

  let query = supabase
    .from("reviews")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (dishId) {
    query = query.eq("dish_id", dishId);
  }

  const { data, error } = await query.limit(50);

  if (error) {
    return fail("Unable to load reviews", 500, error.message);
  }

  return ok(
    (data ?? []).map((item) => ({
      id: item.id,
      dishId: item.dish_id,
      guest: item.guest,
      region: item.region,
      body: item.body,
      rating: item.rating,
      locale: item.locale,
    })),
  );
}

export async function POST(request: Request) {
  const limit = enforceRateLimit(request, {
    scope: "reviews-submit",
    limit: 6,
    windowMs: 10 * 60_000,
  });

  if (!limit.ok) {
    return limit.response;
  }

  const { supabase, user } = await getCurrentUser();
  const body = await readJsonBody(request);

  if (!body.ok) {
    return fail("Invalid review payload", 400);
  }

  const parsed = reviewSchema.safeParse(body.data);

  if (!parsed.success) {
    return fail("Invalid review payload", 400, parsed.error.flatten());
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: user?.id ?? null,
      dish_id: parsed.data.dishId,
      guest: parsed.data.guest,
      region: parsed.data.region,
      body: parsed.data.body,
      rating: parsed.data.rating,
      locale: parsed.data.locale,
      is_published: true,
    })
    .select("*")
    .single();

  if (error?.message?.includes("public.reviews")) {
    return fail(
      "Unable to submit review",
      500,
      "Run migration 202603300002_create_transactional_core.sql first.",
    );
  }

  if (error) {
    return fail("Unable to submit review", 500, error.message);
  }

  return ok(
    {
      id: data.id,
      dishId: data.dish_id,
      guest: data.guest,
      region: data.region,
      body: data.body,
      rating: data.rating,
      locale: data.locale,
    },
    {
      headers: limit.headers,
    },
  );
}
