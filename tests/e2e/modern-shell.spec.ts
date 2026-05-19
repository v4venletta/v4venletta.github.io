import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.2;
  });
  await page.goto("/");
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

test("draws two cards for advantage-style checks", async ({ page }) => {
  await page.getByTestId("draw-two-cards").click();

  await expect(page.getByTestId("draw-zone").locator("figure")).toHaveCount(2);
  await expect(page.getByTestId("draw-pile-count")).toHaveText("18");
  await expect(page.getByTestId("discard-pile-count")).toHaveText("2");
});

test("expands the discard pile beyond the recent preview", async ({ page }) => {
  for (let drawCount = 0; drawCount < 12; drawCount += 1) {
    await page.getByTestId("draw-card").click();
  }

  await expect(page.getByTestId("discard-pile").locator("img")).toHaveCount(8);

  await page.getByTestId("toggle-discard-pile").click();

  await expect(page.getByTestId("discard-pile").locator("img")).toHaveCount(9);
  await expect(page.getByTestId("toggle-discard-pile")).toHaveAttribute("aria-expanded", "true");
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

test("renders perk symbol tokens as icons", async ({ page }) => {
  const iconPerk = page.getByTestId("perk-5");

  await expect(iconPerk.getByRole("img", { name: "rolling" })).toBeVisible();
  await expect(iconPerk.getByRole("img", { name: "push" })).toBeVisible();
});

test("keeps the mobile draw layout within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Attack modifier deck" })).toBeVisible();

  await page.getByTestId("draw-two-cards").click();

  const layout = await page.evaluate(() => {
    const drawnCards = Array.from(document.querySelectorAll(".drawn-card img")).map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        height: rect.height,
        width: rect.width,
        y: rect.y,
      };
    });

    return {
      clientWidth: document.documentElement.clientWidth,
      drawnCards,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });

  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
  expect(layout.drawnCards).toHaveLength(2);
  for (const card of layout.drawnCards) {
    expect(card.width).toBeGreaterThan(card.height);
  }
  expect(Math.abs(layout.drawnCards[0].y - layout.drawnCards[1].y)).toBeLessThan(1);
});

test("uses a readable single-column perk list on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Attack modifier deck" })).toBeVisible();

  const layout = await page.evaluate(() => {
    const first = document.querySelector('[data-testid="perk-0"]')?.getBoundingClientRect();
    const second = document.querySelector('[data-testid="perk-1"]')?.getBoundingClientRect();

    return {
      clientWidth: document.documentElement.clientWidth,
      first: first && {
        width: first.width,
        x: first.x,
        y: first.y,
      },
      scrollWidth: document.documentElement.scrollWidth,
      second: second && {
        width: second.width,
        x: second.x,
        y: second.y,
      },
    };
  });

  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
  expect(layout.first).not.toBeNull();
  expect(layout.second).not.toBeNull();
  expect(layout.first?.width).toBeGreaterThan(300);
  expect(layout.second?.x).toBe(layout.first?.x);
  expect(layout.second?.y).toBeGreaterThan(layout.first?.y ?? 0);
});
