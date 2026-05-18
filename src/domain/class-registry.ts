import type { CharacterClass } from "./types.ts";
import { characterClassData, type CharacterClassData } from "../data/character-classes.ts";

export const characterClasses = Object.fromEntries(
  Object.entries(characterClassData).map(([id, characterClass]) => [
    id,
    {
      name: characterClass.name,
      abbr: characterClass.abbr,
    },
  ]),
) as Record<keyof typeof characterClassData, CharacterClass>;

export type CharacterClassId = keyof typeof characterClasses;

export interface CharacterClassOption extends CharacterClass {
  id: CharacterClassId;
  iconPath: string;
}

export function getCharacterClass(id: CharacterClassId): CharacterClass {
  return characterClasses[id];
}

export function getCharacterClassOptions(): CharacterClassOption[] {
  return Object.entries(characterClassData).map(([id, characterClass]) => ({
    id: id as CharacterClassId,
    ...(characterClass as CharacterClassData),
  }));
}
