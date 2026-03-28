import { expect, test } from "@playwright/test";

test("thai homepage routes guests to key premium frontend flows", async ({ page }) => {
  async function openPrimaryLink(label: string) {
    const desktopLink = page.locator("header").getByRole("link", { name: new RegExp(`^${label}$`) });

    if (await desktopLink.isVisible()) {
      await desktopLink.click();
      return;
    }

    await page.getByRole("button", { name: /เปิดเมนูนำทาง/i }).click();
    await page.getByRole("link", { name: new RegExp(`^${label}$`) }).click();
  }

  await page.goto("/th");

  await expect(page.getByRole("heading", { name: /รสชาติไทยระดับพรีเมียม/i })).toBeVisible();

  await openPrimaryLink("เมนู");
  await expect(page).toHaveURL(/\/th\/menu$/);

  await page.goto("/th");
  await openPrimaryLink("ชุดพิเศษ");
  await expect(page).toHaveURL(/\/th\/specials$/);

  await page.goto("/th");
  await openPrimaryLink("จองโต๊ะ");
  await expect(page).toHaveURL(/\/th\/reservation$/);
});
