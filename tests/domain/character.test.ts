import test from "node:test";
import assert from "node:assert/strict";
import { Character, createDeck, findCharacterSheet } from "../../src/domain/character.ts";
import type { AttackModifierCard, CharacterClass, CharacterSheet } from "../../src/domain/types.ts";

const brute: CharacterClass = {
  name: "brute",
  abbr: "br",
};

test("createDeck separates base, class modifier, and global modifier cards", () => {
  const deck = createDeck([
    card("am-p-01", 0),
    card("am-br-01", 1),
    card("am-pm-01", "bless"),
    card("am-m-01", 0),
  ], brute);

  assert.deepEqual(names(deck.drawPile), ["am-p-01"]);
  assert.deepEqual(names(deck.modPile), ["am-br-01"]);
  assert.deepEqual(names(deck.globalModCards), ["am-pm-01"]);
});

test("findCharacterSheet matches the existing '<class> perks' naming convention", () => {
  const sheet = characterSheet();

  assert.equal(findCharacterSheet(brute, [sheet]), sheet);
});

test("setClass loads the matching sheet and class modifier pile", () => {
  const character = new Character("base");
  const cards = [
    card("am-p-01", 0),
    card("am-br-01", 1),
    card("am-pm-01", "bless"),
  ];

  character.setClass(brute, [characterSheet()], cards);

  assert.equal(character.sheet?.name, "brute perks");
  assert.deepEqual(names(character.deck.drawPile), ["am-p-01"]);
  assert.deepEqual(names(character.deck.modPile), ["am-br-01"]);
});

test("applyPerk mutates the deck and records the active perk", () => {
  const character = new Character("base");
  character.setClass(brute, [characterSheet()], [
    card("am-p-01", 0),
    card("am-p-02", -1),
    card("am-br-01", 1),
  ]);

  character.applyPerk(0);

  assert.deepEqual(names(character.deck.drawPile).sort(), ["am-br-01", "am-p-01"]);
  assert.deepEqual(character.activePerks, [0]);
});

function characterSheet(): CharacterSheet {
  return {
    name: "brute perks",
    perks: [
      {
        name: "Replace one -1 card with one +1 card",
        actions: [
          { type: "remove", cards: ["am-p-02"] },
          { type: "add", cards: ["am-br-01"] },
        ],
      },
    ],
  };
}

function card(name: string, value: AttackModifierCard["value"]): AttackModifierCard {
  return {
    name,
    value,
    image: `${name}.png`,
  };
}

function names(cards: AttackModifierCard[]): string[] {
  return cards.map((card) => card.name);
}
