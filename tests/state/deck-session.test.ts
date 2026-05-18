import test from "node:test";
import assert from "node:assert/strict";
import { DeckSessionController } from "../../src/state/deck-session.ts";
import { loadAppData } from "../support/load-json-data.ts";

test("controller creates a UI snapshot for the default class", () => {
  const controller = createController();

  assert.equal(controller.snapshot.selectedClassId, "brute");
  assert.equal(controller.snapshot.selectedClass.name, "brute");
  assert.equal(controller.snapshot.stats.drawPile, 20);
  assert.equal(controller.snapshot.perks.length > 0, true);
});

test("controller updates snapshot after drawing and shuffling", () => {
  const controller = createController();

  const drawn = controller.run("draw");

  assert.equal(drawn.lastDrawnCards.length, 1);
  assert.equal(drawn.stats.drawPile, 19);
  assert.equal(drawn.stats.discardPile, 1);

  const shuffled = controller.run("shuffle");

  assert.equal(shuffled.lastDrawnCards.length, 0);
  assert.equal(shuffled.stats.drawPile, 20);
  assert.equal(shuffled.stats.discardPile, 0);
});

test("controller exposes scenario modifier actions", () => {
  const controller = createController();

  controller.run("bless");
  controller.run("curse");
  const snapshot = controller.run("minusOne");

  assert.equal(snapshot.stats.drawPile, 23);
  assert.equal(snapshot.stats.globalModifierPile, 32);
});

test("controller changes class and applies active perks", () => {
  const controller = createController();

  const selected = controller.selectClass("spellweaver");

  assert.equal(selected.selectedClassId, "spellweaver");
  assert.equal(selected.stats.modifierPile > 0, true);

  const perked = controller.applyPerk(0);

  assert.deepEqual(perked.activePerks, [0]);
  assert.equal(perked.lastDrawnCards.length, 0);
});

test("controller toggles active perks on and off", () => {
  const controller = createController();

  const enabled = controller.togglePerk(0);

  assert.deepEqual(enabled.activePerks, [0]);
  assert.equal(enabled.stats.drawPile, 18);

  const disabled = controller.togglePerk(0);

  assert.deepEqual(disabled.activePerks, []);
  assert.equal(disabled.stats.drawPile, 20);
});

function createController(): DeckSessionController {
  return new DeckSessionController(loadAppData());
}
