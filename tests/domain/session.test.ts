import test from "node:test";
import assert from "node:assert/strict";
import { GameSession } from "../../src/domain/index.ts";
import { loadAttackModifierCards, loadCharacterSheets } from "../support/load-json-data.ts";
import type { CharacterClass } from "../../src/domain/types.ts";

const brute: CharacterClass = {
  name: "brute",
  abbr: "br",
};

test("selectClass prepares a UI-ready active character and deck stats", () => {
  const session = createSession();

  const stats = session.selectClass(brute);

  assert.equal(session.character.characterClass, brute);
  assert.deepEqual(stats, {
    drawPile: 20,
    discardPile: 0,
    modifierPile: 22,
    globalModifierPile: 35,
    shuffleNeeded: false,
  });
});

test("drawCard records the last drawn card and updates discard stats", () => {
  const session = createSession();
  session.selectClass(brute);

  const card = session.drawCard();

  assert.deepEqual(session.lastDrawnCards, [card]);
  assert.equal(session.stats.drawPile, 19);
  assert.equal(session.stats.discardPile, 1);
  assert.equal(session.discardPile[0], card);
});

test("shuffle clears drawn card state, discard pile, and shuffle warning", () => {
  const session = createSession();
  session.selectClass(brute);

  session.drawCard();
  session.character.deck.shuffleNeeded = true;
  const stats = session.shuffle();

  assert.deepEqual(session.lastDrawnCards, []);
  assert.equal(stats.drawPile, 20);
  assert.equal(stats.discardPile, 0);
  assert.equal(stats.shuffleNeeded, false);
});

test("scenario modifier actions take cards from the global pool and add them to draw pile", () => {
  const session = createSession();
  session.selectClass(brute);

  const bless = session.addBless();
  const curse = session.addCurse();
  const minusOne = session.addMinusOne();

  assert.equal(bless.value, "bless");
  assert.equal(curse.value, "curse");
  assert.equal(minusOne.value, -1);
  assert.equal(session.stats.drawPile, 23);
  assert.equal(session.stats.globalModifierPile, 32);
});

test("applyPerks exposes a multi-perk action for future UI checkboxes", () => {
  const session = createSession();
  session.selectClass(brute);

  const stats = session.applyPerks([0, 2]);

  assert.equal(stats.drawPile, 20);
  assert.equal(stats.modifierPile, 20);
  assert.deepEqual(session.character.activePerks, [0, 2]);
  assert.equal(session.character.deck.drawPile.some((card) => card.name === "am-p-12"), false);
  assert.equal(session.character.deck.drawPile.some((card) => card.name === "am-p-13"), false);
  assert.equal(session.character.deck.drawPile.some((card) => card.name === "am-br-09"), true);
  assert.equal(session.character.deck.drawPile.some((card) => card.name === "am-br-10"), true);
});

function createSession(): GameSession {
  return new GameSession({
    cards: loadAttackModifierCards(),
    sheets: loadCharacterSheets(),
  });
}
