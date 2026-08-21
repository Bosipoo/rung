import { test, expect } from "@playwright/test";

function completedCount(text: string): number {
  return Number(text.split("/")[0]);
}

test("completing a task increases the home page progress count by one", async ({ page }) => {
  await page.goto("/");
  const before = completedCount(await page.getByTestId("progress-count").innerText());

  await page.goto("/week/4");
  await page.getByTestId("task-2").check();

  await page.goto("/");
  const after = completedCount(await page.getByTestId("progress-count").innerText());

  expect(after).toBe(before + 1);
});
