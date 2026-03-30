import { NextResponse } from "next/server";

function withDefaultHeaders(init?: ResponseInit) {
  const headers = new Headers(init?.headers);

  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", "no-store");
  }

  if (!headers.has("X-Content-Type-Options")) {
    headers.set("X-Content-Type-Options", "nosniff");
  }

  return {
    ...init,
    headers,
  } satisfies ResponseInit;
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, withDefaultHeaders(init));
}

export function fail(message: string, status = 400, details?: unknown, init?: ResponseInit) {
  return NextResponse.json(
    {
      error: message,
      details: details ?? null,
    },
    withDefaultHeaders({
      ...init,
      status,
    }),
  );
}
