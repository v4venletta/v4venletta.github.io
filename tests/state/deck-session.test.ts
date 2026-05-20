import test from "node:test";
import assert from "node:assert/strict";
import { DeckSessionController } from "../../src/state/deck-session.ts";
import { loadAppData } from "../support/load-json-data.ts";

test("controller creates a UI snapshot for the default class", () => {
  const controller = createController();

  assert.equal(controller.snapshot.characters.length, 4);
  assert.equal(controller.snapshot.activeCharacterIndex, 0);
  assert.equal(controller.snapshot.selectedClassId, "brute");
  assert.equal(controller.snapshot.selectedClass.name, "brute");
  assert.equal(controller.snapshot.stats.drawPile, 20);
  assert.equal(controller.snapshot.perks.length > 0, true);
  assert.equal(controller.snapshot.canUndo, false);
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

test("controller can draw two cards for advantage-style flows", () => {
  const controller = createController();

  const drawn = controller.run("drawTwo");

  assert.equal(drawn.lastDrawnCards.length, 2);
  assert.equal(drawn.stats.drawPile, 18);
  assert.equal(drawn.stats.discardPile, 2);
});

test("controller exposes scenario modifier actions", () => {
  const controller = createController();

  controller.run("bless");
  controller.run("curse");
  const snapshot = controller.run("minusOne");

  assert.equal(snapshot.stats.drawPile, 23);
  assert.equal(snapshot.stats.globalModifierPile, 32);
});

test("controller supports independent character slots", () => {
  const controller = createController();

  controller.selectClass("spellweaver");
  controller.togglePerk(0);
  const secondCharacter = controller.selectCharacter(1);

  assert.equal(secondCharacter.selectedClassId, "brute");
  assert.deepEqual(secondCharacter.activePerks, []);

  const firstCharacter = controller.selectCharacter(0);

  assert.equal(firstCharacter.selectedClassId, "spellweaver");
  assert.deepEqual(firstCharacter.activePerks, [0]);
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

test("controller can undo the last mutating action", () => {
  const controller = createController();

  controller.run("draw");
  assert.equal(controller.snapshot.stats.drawPile, 19);
  assert.equal(controller.snapshot.canUndo, true);

  const undone = controller.run("undo");

  assert.equal(undone.stats.drawPile, 20);
  assert.equal(undone.stats.discardPile, 0);
  assert.equal(undone.lastDrawnCards.length, 0);
  assert.equal(undone.canUndo, false);
});

test("controller resets scenario modifiers while preserving character perks", () => {
  const controller = createController();

  controller.togglePerk(0);
  controller.run("bless");
  controller.run("curse");
  controller.run("draw");
  const reset = controller.run("resetScenario");

  assert.deepEqual(reset.activePerks, [0]);
  assert.equal(reset.stats.drawPile, 18);
  assert.equal(reset.stats.discardPile, 0);
  assert.equal(reset.stats.globalModifierPile, 35);
  assert.equal(reset.lastDrawnCards.length, 0);
});

test("controller resets the active base deck and active character", () => {
  const controller = createController();

  controller.togglePerk(0);
  controller.run("bless");
  const baseDeck = controller.run("resetBaseDeck");

  assert.equal(baseDeck.selectedClassId, "brute");
  assert.deepEqual(baseDeck.activePerks, []);
  assert.equal(baseDeck.stats.drawPile, 20);
  assert.equal(baseDeck.stats.globalModifierPile, 35);

  controller.selectClass("spellweaver");
  const character = controller.run("resetCharacter");

  assert.equal(character.selectedClassId, "brute");
  assert.deepEqual(character.activePerks, []);
  assert.equal(character.stats.drawPile, 20);
});

function createController(): DeckSessionController {
  return new DeckSessionController(loadAppData());
}
