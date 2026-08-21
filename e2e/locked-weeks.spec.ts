import { test, expect } from "@playwright/test";

test("a locked roadmap tile still opens its week", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href="/week/12"]').click();
  await expect(page).toHaveURL("/week/12");
  await expect(page.locator('[data-testid^="day-"]')).toHaveCount(7);
});

test("a locked future day shows the note and no toggle", async ({ page }) => {
  await page.goto("/week/12/day/1");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Complete earlier weeks first.")).toBeVisible();
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
});
