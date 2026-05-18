import test from "node:test";
import assert from "node:assert/strict";
import {
  characterClasses,
  getCharacterClass,
  getCharacterClassOptions,
} from "../../src/domain/index.ts";

test("class registry preserves the legacy app class ids and abbreviations", () => {
  assert.equal(Object.keys(characterClasses).length, 19);
  assert.deepEqual(getCharacterClass("brute"), { name: "brute", abbr: "br" });
  assert.deepEqual(getCharacterClass("spellweaver"), { name: "spellweaver", abbr: "sw" });
});

test("class options include UI ids and icon paths for future class selectors", () => {
  const brute = getCharacterClassOptions().find((option) => option.id === "brute");

  assert.deepEqual(brute, {
    id: "brute",
    name: "brute",
    abbr: "br",
    iconPath: "/images/class-icons/brute.png",
  });
});
