import { expect, test } from "@playwright/test";

test("guests can switch menu into gallery mode and add a curated set", async ({ page }) => {
  await page.goto("/th/menu");

  await page.getByRole("button", { name: /โหมดแกลเลอรี/i }).click();
  await expect(page.getByText(/ดูรายละเอียด/i).first()).toBeVisible();

  await page.goto("/th/build-a-set");
  await expect(page.getByRole("heading", { name: /ประกอบสำรับไทย/i })).toBeVisible();
  await page.getByTestId("set-main-fire-basil-wagyu").click();
  await page.getByTestId("add-set-to-cart").click();

  await expect(page.getByRole("heading", { name: /ตะกร้า/i })).toBeVisible();
});
