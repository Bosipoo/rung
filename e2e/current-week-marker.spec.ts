import { test, expect } from "@playwright/test";

test("exactly one current-week marker renders on the home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("current-week-marker")).toHaveCount(1);
});
