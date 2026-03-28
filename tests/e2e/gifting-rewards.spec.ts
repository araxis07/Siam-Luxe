import { expect, test } from "@playwright/test";

test("gift cards and rewards flow update the guest account surface", async ({ page }) => {
  await page.goto("/th/gift-cards");

  await page.getByLabel(/ชื่อผู้รับ/i).fill("คุณอรุณ");
  await page.getByLabel(/อีเมลผู้รับ/i).fill("arun@example.com");
  await page.getByTestId("purchase-gift-card").click();

  await page.goto("/th/account");
  await expect(page.getByText(/คุณอรุณ/i)).toBeVisible();

  await page.goto("/th/rewards");
  await page.getByTestId("reward-dessert-flight").click();
  await expect(page.getByText(/เพิ่มเครดิตจากรางวัลแล้ว/i)).toBeVisible();
});
