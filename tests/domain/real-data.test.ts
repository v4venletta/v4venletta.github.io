import test from "node:test";
import assert from "node:assert/strict";
import { Character, createDeck } from "../../src/domain/index.ts";
import { loadAttackModifierCards, loadCharacterSheets } from "../support/load-json-data.ts";
import type { CharacterClass } from "../../src/domain/types.ts";

const brute: CharacterClass = {
  name: "brute",
  abbr: "br",
};

test("real attack modifier data builds the expected Brute deck pools", () => {
  const deck = createDeck(loadAttackModifierCards(), brute);

  assert.equal(deck.drawPile.length, 20);
  assert.equal(deck.modPile.length, 22);
  assert.equal(deck.globalModCards.length, 35);
});

test("real Brute perk data can remove base cards", () => {
  const character = new Character("base");

  character.setClass(brute, loadCharacterSheets(), loadAttackModifierCards());
  character.applyPerk(0);

  assert.equal(character.deck.drawPile.length, 18);
  assert.equal(character.deck.drawPile.some((card) => card.name === "am-p-12"), false);
  assert.equal(character.deck.drawPile.some((card) => card.name === "am-p-13"), false);
  assert.deepEqual(character.activePerks, [0]);
});

test("real Brute perk data can replace base cards with class modifier cards", () => {
  const character = new Character("base");

  character.setClass(brute, loadCharacterSheets(), loadAttackModifierCards());
  character.applyPerk(1);

  assert.equal(character.deck.drawPile.length, 20);
  assert.equal(character.deck.modPile.length, 21);
  assert.equal(character.deck.drawPile.some((card) => card.name === "am-p-14"), false);
  assert.equal(character.deck.drawPile.some((card) => card.name === "am-br-13"), true);
  assert.deepEqual(character.activePerks, [1]);
});
