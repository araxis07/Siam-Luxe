import { expect, test } from "@playwright/test";

test("reservation flow switches to waitlist messaging for full seating slots", async ({ page }) => {
  await page.goto("/th/reservation");

  await page.getByRole("button", { name: /private room/i }).click();

  await expect(page.getByText(/waitlist/i)).toBeVisible();
});
