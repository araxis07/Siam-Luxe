import { expect, test } from "@playwright/test";

test("guests can add a dish, open the cart, and reach checkout", async ({ page }) => {
  await page.goto("/th/menu");

  const quickAdd = page.getByRole("button", { name: /เพิ่มทันที/i }).first();
  await expect(quickAdd).toBeVisible();
  await quickAdd.click();

  await expect(page.getByRole("heading", { name: /ตะกร้า/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /ชำระเงิน/i })).toBeVisible();

  await page.getByRole("link", { name: /ชำระเงิน/i }).click();
  await expect(page).toHaveURL(/\/th\/checkout$/);

  await expect(page.getByRole("heading", { name: /ชำระเงิน/i })).toBeVisible();
});
