import { fail } from "@/lib/server/http";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  scope: string;
  limit: number;
  windowMs: number;
  key?: string;
};

declare global {
  var __siamLuxRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

function getStore() {
  globalThis.__siamLuxRateLimitStore ??= new Map<string, RateLimitEntry>();
  return globalThis.__siamLuxRateLimitStore;
}

function cleanupExpiredEntries(store: Map<string, RateLimitEntry>, now: number) {
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

function readForwardedAddress(request: Request) {
  const candidates = [
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("cf-connecting-ip"),
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const first = candidate.split(",")[0]?.trim();

    if (first) {
      return first;
    }
  }

  return "anonymous";
}

function buildHeaders(limit: number, remaining: number, resetAt: number) {
  const headers = new Headers();
  headers.set("X-RateLimit-Limit", String(limit));
  headers.set("X-RateLimit-Remaining", String(Math.max(0, remaining)));
  headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
  return headers;
}

export function enforceRateLimit(request: Request, options: RateLimitOptions) {
  const store = getStore();
  const now = Date.now();
  cleanupExpiredEntries(store, now);

  const identity = options.key ?? readForwardedAddress(request);
  const storeKey = `${options.scope}:${identity}`;
  const current = store.get(storeKey);

  if (!current || current.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(storeKey, {
      count: 1,
      resetAt,
    });

    return {
      ok: true as const,
      headers: buildHeaders(options.limit, options.limit - 1, resetAt),
    };
  }

  if (current.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    const headers = buildHeaders(options.limit, 0, current.resetAt);
    headers.set("Retry-After", String(retryAfterSeconds));

    return {
      ok: false as const,
      response: fail(
        "Too many requests. Please try again shortly.",
        429,
        {
          retryAfterSeconds,
        },
        {
          headers,
        },
      ),
      headers,
    };
  }

  current.count += 1;
  store.set(storeKey, current);

  return {
    ok: true as const,
    headers: buildHeaders(options.limit, options.limit - current.count, current.resetAt),
  };
}
