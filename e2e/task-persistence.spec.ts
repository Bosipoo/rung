import { test, expect } from "@playwright/test";

test("ticking a unit on a day page persists after reload", async ({ page }) => {
  await page.goto("/week/2/day/1");
  const checkbox = page.getByTestId("unit-2-1-ex-0");

  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  await page.reload();
  await expect(page.getByTestId("unit-2-1-ex-0")).toBeChecked();
});
