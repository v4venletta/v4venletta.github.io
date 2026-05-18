import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { AttackModifierCard, CharacterSheet } from "../../src/domain/types.ts";

const repoRoot = resolve(import.meta.dirname, "../..");

export function loadAttackModifierCards(): AttackModifierCard[] {
  return loadJsonFile<AttackModifierCard[]>("data/attack-modifiers.js");
}

export function loadCharacterSheets(): CharacterSheet[] {
  return loadJsonFile<CharacterSheet[]>("data/character-perks+.js");
}

function loadJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(repoRoot, path), "utf8")) as T;
}
