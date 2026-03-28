import { expect, test } from "@playwright/test";

test("menu gallery visual remains stable", async ({ page }) => {
  await page.goto("/th/menu");
  await page.getByRole("button", { name: /โหมดแกลเลอรี/i }).click();
  await expect(page).toHaveScreenshot("menu-gallery.png", { fullPage: true });
});

test("reservation calendar visual remains stable", async ({ page }) => {
  await page.goto("/th/reservation");
  await expect(page).toHaveScreenshot("reservation-calendar.png", { fullPage: true });
});

test("gift card showcase visual remains stable", async ({ page }) => {
  await page.goto("/th/gift-cards");
  await expect(page).toHaveScreenshot("gift-cards.png", { fullPage: true });
});
