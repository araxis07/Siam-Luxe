import { expect, test } from "@playwright/test";

test("reviews, catering, tracking map, and branch availability are reachable", async ({ page }) => {
  await page.goto("/th/reviews");

  await page.getByLabel(/^ชื่อ$/).fill("ไหม");
  await page.getByLabel(/พื้นที่ของคุณ/i).fill("เชียงใหม่");
  await page.getByRole("button", { name: /ส่งรีวิว/i }).click();
  await expect(page.getByText(/กรุณาเขียนรีวิวอย่างน้อย/i)).toBeVisible();

  await page.getByLabel(/ความเห็น/i).fill("มุม plating สวย รสชาติบาลานซ์ และอยากสั่งซ้ำอีกแน่นอน");
  await page.getByRole("button", { name: /ส่งรีวิว/i }).click();
  await expect(page.getByText(/มุม plating สวย/i)).toBeVisible();

  await page.goto("/th/catering");
  await expect(page.getByRole("heading", { name: /วางแพ็กเกจงานเลี้ยง/i })).toBeVisible();
  await page.getByTestId("add-catering-to-cart").click();
  await expect(page.getByRole("heading", { name: /ตะกร้า/i })).toBeVisible();

  await page.goto("/th/tracking");
  await expect(page.getByText(/แผนที่เส้นทางจำลอง/i)).toBeVisible();

  await page.goto("/th/contact");
  await expect(page.getByText(/ตารางความพร้อมให้บริการ/i).first()).toBeVisible();
});
