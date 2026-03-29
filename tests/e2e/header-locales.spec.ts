import { expect, test, type Page } from "@playwright/test";

const localeHeadings = [
  { locale: "th", heading: /รสชาติไทยระดับพรีเมียม/i, menuLabel: "เมนู" },
  { locale: "en", heading: /Modern Thai luxury, delivered with calm precision/i, menuLabel: "Menu" },
  { locale: "ja", heading: /上質なタイ料理を、静かな高級感とともに/i, menuLabel: "メニュー" },
  { locale: "zh", heading: /现代泰式奢享点餐体验/i, menuLabel: "菜单" },
  { locale: "ko", heading: /고급스럽고 현대적인 태국 음식 주문 경험/i, menuLabel: "메뉴" },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });

  expect(hasOverflow).toBeFalsy();
}

test("desktop header remains stable across all locales", async ({ page }) => {
  test.skip(/mobile/.test(test.info().project.name), "Desktop-only header sweep");

  await page.setViewportSize({ width: 1440, height: 900 });

  for (const entry of localeHeadings) {
    await page.goto(`/${entry.locale}`);
    await expect(page.getByRole("heading", { name: entry.heading })).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("header").getByText("Siam Lux").first()).toBeVisible();
    await expect(page.locator("header").getByRole("link", { name: new RegExp(`^${entry.menuLabel}$`) })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test("language switcher updates locale without breaking header layout", async ({ page }) => {
  test.skip(/mobile/.test(test.info().project.name), "Desktop-only locale switching");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/th");

  const header = page.locator("header");
  const switcher = header.getByRole("combobox").first();

  await switcher.click();
  await page.getByRole("option", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { name: /Modern Thai luxury, delivered with calm precision/i })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await switcher.click();
  await page.getByRole("option", { name: "日本語" }).click();
  await expect(page).toHaveURL(/\/ja$/);
  await expect(page.getByRole("heading", { name: /上質なタイ料理を、静かな高級感とともに/i })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("mobile navigation stays tappable and locale-safe", async ({ page }) => {
  test.skip(!/mobile/.test(test.info().project.name), "Mobile-only drawer check");

  for (const entry of localeHeadings) {
    await page.goto(`/${entry.locale}`);
    await expect(page.getByRole("heading", { name: entry.heading })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const menuButton = page.getByRole("button", {
      name: /เปิดเมนูนำทาง|Open navigation|ナビゲーションを開く|打开导航|내비게이션 열기/i,
    });

    await expect(menuButton).toBeVisible();

    const bounds = await menuButton.boundingBox();
    expect(bounds?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(bounds?.height ?? 0).toBeGreaterThanOrEqual(44);

    await menuButton.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("link", { name: new RegExp(`^${entry.menuLabel}$`) }).click();
    await expect(page).toHaveURL(new RegExp(`/${entry.locale}/menu$`));
    await expectNoHorizontalOverflow(page);
  }
});
