import { expect, test } from "@playwright/test";

test("backend health and protected automation routes respond safely", async ({ request }) => {
  const healthResponse = await request.get("/api/health");
  expect(healthResponse.ok()).toBeTruthy();

  const health = (await healthResponse.json()) as {
    status: string;
    runtime: {
      services: {
        supabaseClient: boolean;
      };
    };
  };

  expect(["ready", "degraded", "booting"]).toContain(health.status);
  expect(typeof health.runtime.services.supabaseClient).toBe("boolean");

  const emailCron = await request.post("/api/internal/cron/email-outbox");
  expect(emailCron.status()).toBe(401);

  const reservationCron = await request.post("/api/internal/cron/reservations");
  expect(reservationCron.status()).toBe(401);

  const manualWebhook = await request.post("/api/payments/webhooks/manual", {
    data: {
      reference: "missing",
      status: "paid",
    },
  });
  expect(manualWebhook.status()).toBe(401);
});

test("promo validation throttles repeated requests from the same address", async ({ playwright, baseURL }, testInfo) => {
  test.skip(!process.env.NEXT_PUBLIC_SUPABASE_URL, "Supabase env required for promo validation checks");

  const ip = `203.0.113.${Math.min(250, testInfo.parallelIndex + 10)}`;
  const api = await playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: {
      "x-forwarded-for": ip,
    },
  });

  for (let index = 0; index < 8; index += 1) {
    const response = await api.post("/api/promos/validate", {
      data: {
        code: "INVALID",
        subtotal: 500,
      },
    });

    expect(response.status()).toBe(200);
  }

  const limited = await api.post("/api/promos/validate", {
    data: {
      code: "INVALID",
      subtotal: 500,
    },
  });

  expect(limited.status()).toBe(429);
  expect(limited.headers()["retry-after"]).toBeTruthy();

  await api.dispose();
});
