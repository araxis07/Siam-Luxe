"use client";

export async function readApiError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };

    if (typeof payload.error === "string" && payload.error.trim().length > 0) {
      return payload.error;
    }
  } catch {
    return "Request failed";
  }

  return "Request failed";
}

export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as T;
}
