import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getCharacterClassOptions } from "../../src/domain/index.ts";
import { appData } from "../../src/data/app-data.ts";

const repoRoot = resolve(import.meta.dirname, "../..");

test("normalized attack modifier image paths exist", () => {
  const missingImages = appData.cards
    .map((card) => `images/${card.image}`)
    .filter((imagePath) => !existsSync(resolve(repoRoot, imagePath)));

  assert.deepEqual(missingImages, []);
});

test("normalized class icon paths exist", () => {
  const missingIcons = getCharacterClassOptions()
    .map((option) => option.iconPath.replace(/^\/+/, ""))
    .filter((iconPath) => !existsSync(resolve(repoRoot, iconPath)));

  assert.deepEqual(missingIcons, []);
});
