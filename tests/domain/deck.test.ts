import test from "node:test";
import assert from "node:assert/strict";
import { Deck } from "../../src/domain/deck.ts";
import type { AttackModifierCard } from "../../src/domain/types.ts";

test("draw moves regular cards to the discard pile", () => {
  const deck = new Deck([
    card("am-p-01", 0),
    card("am-p-02", 1),
  ]);

  const drawn = deck.draw();

  assert.equal(deck.discardPile.length, 1);
  assert.equal(deck.discardPile[0], drawn);
  assert.equal(deck.length, 2);
});

test("drawing x2 or miss marks the deck for shuffle", () => {
  const deck = new Deck([card("am-p-01", "x2")]);

  deck.draw();

  assert.equal(deck.shuffleNeeded, true);
});

test("shuffleAll combines discard and draw piles and clears shuffle warning", () => {
  const deck = new Deck([card("am-p-01", "x2"), card("am-p-02", 1)]);

  deck.draw();
  deck.shuffleAll();

  assert.equal(deck.drawPile.length, 2);
  assert.equal(deck.discardPile.length, 0);
  assert.equal(deck.shuffleNeeded, false);
});

test("bless and curse cards return to the global modifier pool instead of discard", () => {
  const bless = card("am-pm-01", "bless");
  const deck = new Deck([], [], []);

  deck.addCard(bless);
  const drawn = deck.draw();

  assert.equal(drawn, bless);
  assert.equal(deck.discardPile.length, 0);
  assert.deepEqual(deck.globalModCards, [bless]);
});

test("takeGlobalModCard removes the first matching global card", () => {
  const bless = card("am-pm-01", "bless");
  const curse = card("am-pm-02", "curse");
  const deck = new Deck([], [], [bless, curse]);

  assert.equal(deck.takeGlobalModCard("bless"), bless);
  assert.deepEqual(deck.globalModCards, [curse]);
});

test("class modifier cards are moved between modifier pile and draw pile by name", () => {
  const classMod = card("am-br-01", 2);
  const deck = new Deck([card("am-p-01", 0)], [classMod]);

  deck.addModCardByName("am-br-01");

  assert.equal(deck.modPile.length, 0);
  assert.equal(deck.drawPile.some((candidate) => candidate.name === "am-br-01"), true);

  deck.removeCardByName("am-br-01");

  assert.equal(deck.modPile[0], classMod);
  assert.equal(deck.drawPile.some((candidate) => candidate.name === "am-br-01"), false);
});

function card(name: string, value: AttackModifierCard["value"]): AttackModifierCard {
  return {
    name,
    value,
    image: `${name}.png`,
  };
}
