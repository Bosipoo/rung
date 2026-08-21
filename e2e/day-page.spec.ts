import { test, expect } from "@playwright/test";

test("the challenge day renders the drill code with a hidden solution that reveals on click", async ({
  page,
}) => {
  await page.goto("/week/1/day/6");
  await expect(page.locator("pre")).toBeVisible();

  const revealButton = page.getByRole("button", { name: "Reveal solution" });
  await expect(revealButton).toBeVisible();
  await expect(page.getByText("is missing the +")).toHaveCount(0);

  await revealButton.click();
  await expect(page.getByText("is missing the +")).toBeVisible();
});

test("next-day navigation crosses a week boundary", async ({ page }) => {
  await page.goto("/week/3/day/7");
  await page.getByRole("link", { name: /Day 1 \(Week 4\)/ }).click();
  await expect(page).toHaveURL("/week/4/day/1");
});

test("prev-day navigation crosses a week boundary", async ({ page }) => {
  await page.goto("/week/4/day/1");
  await page.getByRole("link", { name: /Day 7 \(Week 3\)/ }).click();
  await expect(page).toHaveURL("/week/3/day/7");
});
