import { test, expect } from "@playwright/test";

test("ticking every unit on /week/1/day/2 marks that day done in the week strip", async ({ page }) => {
  await page.goto("/week/1/day/2");

  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await checkboxes.nth(i).check();
  }

  await page.goto("/");
  await expect(page.getByTestId("day-strip-2")).toHaveAttribute("data-done", "true");
});
