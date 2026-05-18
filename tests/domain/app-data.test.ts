import test from "node:test";
import assert from "node:assert/strict";
import { createGameSession } from "../../src/domain/index.ts";
import { loadAppData } from "../support/load-json-data.ts";

test("createGameSession initializes a session from centralized app data", () => {
  const session = createGameSession(loadAppData(), { characterName: "campaign character" });

  assert.equal(session.character.name, "campaign character");

  const stats = session.selectClassById("brute");

  assert.equal(stats.drawPile, 20);
  assert.equal(stats.modifierPile, 22);
});
