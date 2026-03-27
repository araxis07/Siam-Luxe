import { expect, test } from "@playwright/test";

test("thai homepage routes guests to key premium frontend flows", async ({ page }) => {
  await page.goto("/th");

  await expect(page.getByRole("heading", { name: /รสชาติไทยระดับพรีเมียม/i })).toBeVisible();

  await page.getByRole("link", { name: /เมนู/i }).click();
  await expect(page).toHaveURL(/\/th\/menu$/);

  await page.goto("/th");
  await page.getByRole("link", { name: /ชุดพิเศษ/i }).click();
  await expect(page).toHaveURL(/\/th\/specials$/);

  await page.goto("/th");
  await page.getByRole("link", { name: /จองโต๊ะ/i }).click();
  await expect(page).toHaveURL(/\/th\/reservation$/);
});
