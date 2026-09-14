import { test, expect } from "@playwright/test";

for (const path of ["/", "/week/1", "/week/1/day/1"]) {
  test(`${path} has no horizontal overflow at 375px`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}
