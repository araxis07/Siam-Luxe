import { expect, test } from "@playwright/test";

test("new service and trust routes are reachable", async ({ page }) => {
  await page.goto("/th/auth");
  await expect(page.getByRole("heading", { name: /สลับระหว่างแขกทั่วไปและสมาชิกประจำของร้าน/i })).toBeVisible();

  await page.goto("/th/compare-branches");
  await expect(page.getByRole("heading", { name: /เทียบสาขาเพื่อเลือกประสบการณ์ที่เหมาะกับแขกแต่ละแบบ/i })).toBeVisible();

  await page.goto("/th/pairings");
  await expect(page.getByRole("heading", { name: /จับคู่เครื่องดื่มกับอาหารไทย/i })).toBeVisible();

  await page.goto("/th/policies");
  await expect(page.getByRole("heading", { name: /หน้ากฎหมายและนโยบายหลัก/i })).toBeVisible();

  await page.goto("/th/trust");
  await expect(page.getByRole("heading", { name: /นโยบายที่แขกควรมองเห็นก่อนสั่งอาหารหรือจองโต๊ะ/i })).toBeVisible();
});

test("checkout supports invoice capture and auth entry points", async ({ page }) => {
  await page.goto("/th/menu");
  await page.getByRole("button", { name: /เพิ่มทันที/i }).first().click();
  await page.getByRole("button", { name: /ชำระเงิน/i }).click();

  await expect(page.getByRole("heading", { name: /ชำระเงิน/i })).toBeVisible();
  await page.getByRole("button", { name: /ขอใบกำกับภาษี/i }).click();

  await expect(page.getByLabel(/อีเมลสำหรับเอกสาร/i)).toBeVisible();
  await page.getByLabel(/ชื่อบริษัท/i).fill("Siam Lux Hospitality Co.");
  await page.getByLabel(/เลขผู้เสียภาษี/i).fill("0105559001234");

  await page.getByRole("link", { name: /เข้าสู่ระบบ/i }).first().click();
  await expect(page).toHaveURL(/\/th\/auth$/);
});
