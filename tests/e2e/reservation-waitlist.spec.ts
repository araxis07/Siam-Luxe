import { expect, test } from "@playwright/test";

test("reservation flow switches to waitlist messaging for full seating slots", async ({ page }) => {
  await page.goto("/th/reservation");

  await page.getByTestId("seat-zone-private").click();

  await expect(page.getByText(/รอบนี้เต็มตามรูปแบบที่นั่งที่เลือก/i)).toBeVisible();
});
