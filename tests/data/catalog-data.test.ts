import test from "node:test";
import assert from "node:assert/strict";
import { catalogData, normalizeCatalogItems } from "../../src/data/catalog-data.ts";

test("catalogData normalizes broader legacy datasets", () => {
  assert.equal(catalogData.items.length, 719);
  assert.equal(catalogData.events.length, 378);
  assert.equal(catalogData.monsterStatCards.length, 108);
  assert.equal(catalogData.monsterAbilityCards.length, 309);
  assert.equal(catalogData.characterAbilityCards.length, 617);
  assert.equal(catalogData.characterAbilityCardsRevised.length, 14);
  assert.equal(catalogData.mapTiles.length, 60);
  assert.equal(catalogData.worldMap.length, 191);
});

test("catalogData validates core catalog item shape", () => {
  assert.throws(
    () => normalizeCatalogItems([{ name: "broken", points: 0, image: "items/broken.png" }], "items"),
    /items\[0\]\.xws must be a string/,
  );
});

test("catalog image paths are normalized relative asset paths", () => {
  for (const [catalogName, items] of Object.entries(catalogData)) {
    for (const item of items) {
      assert.equal(item.image.startsWith("/"), false, `${catalogName} image should be relative: ${item.image}`);
      assert.equal(item.image.includes("\\"), false, `${catalogName} image should use web separators: ${item.image}`);
      assert.match(item.image, /\.png$/, `${catalogName} image should reference a PNG: ${item.image}`);
    }
  }
});
