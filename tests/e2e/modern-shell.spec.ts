import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/modern.html");
  await expect(page.getByRole("heading", { name: "Attack modifier deck" })).toBeVisible();
});

test("selects a class and resets active perks", async ({ page }) => {
  await page.getByTestId("perk-0").getByRole("checkbox").check();
  await expect(page.getByTestId("perk-0").getByRole("checkbox")).toBeChecked();

  await page.getByTestId("class-picker").selectOption("spellweaver");

  await expect(
    page.getByLabel("Draw controls and current card").getByText("spellweaver", { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("perk-0").getByRole("checkbox")).not.toBeChecked();
  await expect(page.getByText("0 active")).toBeVisible();
});

test("draws, shuffles, and updates discard stats", async ({ page }) => {
  await page.getByTestId("draw-card").click();

  await expect(page.getByTestId("draw-pile-count")).toHaveText("19");
  await expect(page.getByTestId("deck-stats")).toContainText("Discard");

  await page.getByTestId("shuffle-deck").click();

  await expect(page.getByTestId("draw-pile-count")).toHaveText("20");
  await expect(page.getByText("No cards discarded.")).toBeVisible();
});

test("automatically shuffles before drawing after a terminal card", async ({ page }) => {
  for (let drawCount = 0; drawCount < 20; drawCount += 1) {
    await page.getByTestId("draw-card").click();

    if ((await page.getByTestId("shuffle-state").textContent())?.includes("Shuffle needed")) {
      break;
    }
  }

  await expect(page.getByTestId("shuffle-state")).toContainText("Shuffle needed");

  await page.getByTestId("draw-card").click();

  await expect(page.getByTestId("shuffle-state")).toContainText("Deck clean");
  await expect(page.getByTestId("draw-pile-count")).toHaveText("19");
  await expect(page.getByTestId("discard-pile-count")).toHaveText("1");
});

test("adds scenario modifiers to the draw pile", async ({ page }) => {
  await page.getByTestId("add-bless").click();
  await page.getByTestId("add-curse").click();
  await page.getByTestId("add-minus-one").click();

  await expect(page.getByTestId("draw-pile-count")).toHaveText("23");
  await expect(page.getByTestId("global-modifier-pile-count")).toHaveText("32");
});

test("toggles perks on and off", async ({ page }) => {
  const firstPerk = page.getByTestId("perk-0").getByRole("checkbox");

  await firstPerk.check();
  await expect(firstPerk).toBeChecked();
  await expect(page.getByText("1 active")).toBeVisible();

  await firstPerk.uncheck();
  await expect(firstPerk).not.toBeChecked();
  await expect(page.getByText("0 active")).toBeVisible();
});
