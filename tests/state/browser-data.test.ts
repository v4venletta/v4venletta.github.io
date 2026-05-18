import test from "node:test";
import assert from "node:assert/strict";
import { loadAppData } from "../../src/browser-data.ts";

test("loadAppData returns normalized bundled app data", async () => {
  const data = await loadAppData();
  const bruteSheet = data.sheets.find((sheet) => sheet.name === "brute perks");

  assert.equal(data.cards.some((card) => card.name === "am-p-01"), true);
  assert.equal(bruteSheet?.perks.length, 15);
});
