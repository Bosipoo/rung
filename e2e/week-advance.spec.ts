import { test, expect } from "@playwright/test";

test("completing week 1 reveals Start week 2, advances the current week, and persists on reload", async ({
  page,
}) => {
  for (const day of [1, 2, 3, 4, 5, 6]) {
    await page.goto(`/week/1/day/${day}`);
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }
  }

  await page.goto("/week/1");
  const startButton = page.getByRole("button", { name: "Start week 2 →" });
  await expect(startButton).toBeVisible();
  await startButton.click();
  await expect(page).toHaveURL("/week/2");

  await page.goto("/");
  await expect(page.getByTestId("header-week")).toContainText("2");
  const marker = page.getByTestId("current-week-marker");
  await expect(marker).toHaveCount(1);
  await expect(marker).toHaveAttribute("href", "/week/2");

  await page.reload();
  await expect(page.getByTestId("header-week")).toContainText("2");
  await expect(page.getByTestId("current-week-marker")).toHaveAttribute("href", "/week/2");
});
