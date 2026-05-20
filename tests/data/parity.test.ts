import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "../..");

test("modern attack modifier JSON stays in sync with the legacy data file", () => {
  assert.deepEqual(loadJson("data/attack-modifiers.json"), loadJson("data/attack-modifiers.js"));
});

test("modern character perks JSON stays in sync with the legacy data file", () => {
  assert.deepEqual(loadJson("data/character-perks-plus.json"), loadJson("data/character-perks+.js"));
});

test("modern catalog JSON files stay in sync with legacy data files", () => {
  for (const file of [
    "character-ability-cards",
    "character-ability-cards-revised",
    "events",
    "items",
    "map-tiles",
    "monster-ability-cards",
    "monster-stat-cards",
    "world-map",
  ]) {
    assert.deepEqual(loadJson(`data/${file}.json`), loadJson(`data/${file}.js`), file);
  }
});

function loadJson(path: string): unknown {
  return JSON.parse(readFileSync(resolve(repoRoot, path), "utf8")) as unknown;
}
