import { test, expect } from "@playwright/test";

for (const weekNumber of [1, 14, 36]) {
  test(`/week/${weekNumber} returns 200 and renders seven day rows`, async ({ page }) => {
    const response = await page.goto(`/week/${weekNumber}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-testid^="day-"]')).toHaveCount(7);
  });
}
