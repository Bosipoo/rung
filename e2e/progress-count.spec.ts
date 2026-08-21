import { test, expect } from "@playwright/test";

function completedCount(text: string): number {
  return Number(text.split("/")[0]);
}

test("ticking one lesson row increments the header count by one", async ({ page }) => {
  await page.goto("/");
  const before = completedCount(await page.getByTestId("progress-count").innerText());

  await page.goto("/week/6/day/1");
  await page.locator('[data-testid^="unit-6-1-lesson-"]').first().check();

  await page.goto("/");
  const after = completedCount(await page.getByTestId("progress-count").innerText());

  expect(after).toBe(before + 1);
});
