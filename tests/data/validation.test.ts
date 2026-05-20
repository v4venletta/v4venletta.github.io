import test from "node:test";
import assert from "node:assert/strict";
import { normalizeAppData, normalizeCharacterClassData, normalizeCharacterSheets } from "../../src/data/app-data.ts";

test("normalizeCharacterSheets fills missing perk arrays for placeholder sheets", () => {
  const sheets = normalizeCharacterSheets([{ name: "berserker perks" }]);

  assert.deepEqual(sheets, [{ name: "berserker perks", perks: [] }]);
});

test("normalizeAppData validates perk card references against attack modifier cards", () => {
  assert.throws(
    () =>
      normalizeAppData({
        cards: [{ name: "am-p-01", image: "attack-modifiers/base/player/am-p-01.png", value: 0, conditions: [] }],
        sheets: [
          {
            name: "brute perks",
            perks: [
              {
                name: "Add one card",
                actions: [{ type: "add", cards: ["am-br-01"] }],
              },
            ],
          },
        ],
      }),
    /references unknown card "am-br-01"/,
  );
});

test("normalizeAppData rejects unsupported modifier values", () => {
  assert.throws(
    () =>
      normalizeAppData({
        cards: [{ name: "am-p-01", image: "attack-modifiers/base/player/am-p-01.png", value: "triple", conditions: [] }],
        sheets: [],
      }),
    /unsupported modifier value/,
  );
});

test("normalizeAppData requires complete attack modifier metadata", () => {
  assert.throws(
    () =>
      normalizeAppData({
        cards: [{ name: "am-p-01", image: "attack-modifiers/base/player/am-p-01.png", value: 0 }],
        sheets: [],
      }),
    /missing conditions metadata/,
  );

  assert.throws(
    () =>
      normalizeAppData({
        cards: [{ name: "am-p-01", image: "attack-modifiers/base/player/am-p-01.png", conditions: [] }],
        sheets: [],
      }),
    /missing value metadata/,
  );
});

test("normalizeCharacterClassData rejects duplicate abbreviations", () => {
  assert.throws(
    () =>
      normalizeCharacterClassData({
        brute: { name: "brute", abbr: "br", iconPath: "/images/class-icons/brute.png" },
        other: { name: "other", abbr: "br", iconPath: "/images/class-icons/other.png" },
      }),
    /duplicates another class abbreviation/,
  );
});

test("normalizeAppData validates character sheets against class metadata", () => {
  assert.throws(
    () =>
      normalizeAppData({
        cards: [{ name: "am-br-01", image: "attack-modifiers/BR/am-br-01.png", value: 1, conditions: [] }],
        sheets: [{ name: "unknown perks", perks: [] }],
        classes: {
          brute: { name: "brute", abbr: "br", iconPath: "/images/class-icons/brute.png" },
        },
      }),
    /does not match a known character class/,
  );
});

test("normalizeAppData validates class modifier card prefixes against class metadata", () => {
  assert.throws(
    () =>
      normalizeAppData({
        cards: [{ name: "am-p-01", image: "attack-modifiers/base/player/am-p-01.png", value: 0, conditions: [] }],
        sheets: [{ name: "brute perks", perks: [] }],
        classes: {
          brute: { name: "brute", abbr: "br", iconPath: "/images/class-icons/brute.png" },
        },
      }),
    /has no attack modifier cards for abbreviation "br"/,
  );
});
