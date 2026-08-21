import { test, expect } from "@playwright/test";

test("ticking a task on a week page persists after reload", async ({ page }) => {
  await page.goto("/week/2");
  const checkbox = page.getByTestId("task-1");

  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  await page.reload();
  await expect(page.getByTestId("task-1")).toBeChecked();
});
