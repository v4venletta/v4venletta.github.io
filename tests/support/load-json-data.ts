import type { AppData, AttackModifierCard, CharacterSheet } from "../../src/domain/index.ts";
import { appData } from "../../src/data/app-data.ts";

export function loadAttackModifierCards(): AttackModifierCard[] {
  return appData.cards;
}

export function loadCharacterSheets(): CharacterSheet[] {
  return appData.sheets;
}

export function loadAppData(): AppData {
  return appData;
}
