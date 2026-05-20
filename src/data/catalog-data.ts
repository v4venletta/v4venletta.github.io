import characterAbilityCards from "../../data/character-ability-cards.json" with { type: "json" };
import characterAbilityCardsRevised from "../../data/character-ability-cards-revised.json" with { type: "json" };
import events from "../../data/events.json" with { type: "json" };
import items from "../../data/items.json" with { type: "json" };
import mapTiles from "../../data/map-tiles.json" with { type: "json" };
import monsterAbilityCards from "../../data/monster-ability-cards.json" with { type: "json" };
import monsterStatCards from "../../data/monster-stat-cards.json" with { type: "json" };
import worldMap from "../../data/world-map.json" with { type: "json" };

export interface CatalogItem {
  name: string;
  points: number;
  image: string;
  xws: string;
}

export interface CatalogData {
  characterAbilityCards: CatalogItem[];
  characterAbilityCardsRevised: CatalogItem[];
  events: CatalogItem[];
  items: CatalogItem[];
  mapTiles: CatalogItem[];
  monsterAbilityCards: CatalogItem[];
  monsterStatCards: CatalogItem[];
  worldMap: CatalogItem[];
}

export const catalogData: CatalogData = {
  characterAbilityCards: normalizeCatalogItems(characterAbilityCards, "character ability cards"),
  characterAbilityCardsRevised: normalizeCatalogItems(
    characterAbilityCardsRevised,
    "revised character ability cards",
  ),
  events: normalizeCatalogItems(events, "events"),
  items: normalizeCatalogItems(items, "items"),
  mapTiles: normalizeCatalogItems(mapTiles, "map tiles"),
  monsterAbilityCards: normalizeCatalogItems(monsterAbilityCards, "monster ability cards"),
  monsterStatCards: normalizeCatalogItems(monsterStatCards, "monster stat cards"),
  worldMap: normalizeCatalogItems(worldMap, "world map"),
};

export function normalizeCatalogItems(input: unknown, label: string): CatalogItem[] {
  if (!Array.isArray(input)) {
    throw new Error(`${label} catalog must be an array`);
  }

  return input.map((item, index) => normalizeCatalogItem(item, `${label}[${index}]`));
}

function normalizeCatalogItem(input: unknown, path: string): CatalogItem {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(`${path} must be an object`);
  }

  const item = input as Record<string, unknown>;

  if (typeof item.name !== "string") {
    throw new Error(`${path}.name must be a string`);
  }

  if (typeof item.points !== "number") {
    throw new Error(`${path}.points must be a number`);
  }

  if (typeof item.image !== "string") {
    throw new Error(`${path}.image must be a string`);
  }

  if (typeof item.xws !== "string") {
    throw new Error(`${path}.xws must be a string`);
  }

  return {
    name: item.name,
    points: item.points,
    image: item.image,
    xws: item.xws,
  };
}
