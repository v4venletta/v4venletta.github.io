import type { CharacterClass } from "./types.ts";

export const characterClasses = {
  beasttyrant: { name: "beast tyrant", abbr: "bt" },
  berserker: { name: "berserker", abbr: "be" },
  bladeswarm: { name: "bladeswarm", abbr: "bs" },
  brute: { name: "brute", abbr: "br" },
  cragheart: { name: "cragheart", abbr: "ch" },
  diviner: { name: "diviner", abbr: "dr" },
  doomstalker: { name: "doomstalker", abbr: "ds" },
  elementalist: { name: "elementalist", abbr: "el" },
  mindthief: { name: "mindthief", abbr: "mt" },
  nightshroud: { name: "nightshroud", abbr: "ns" },
  plagueherald: { name: "plagueherald", abbr: "ph" },
  quartermaster: { name: "quartermaster", abbr: "qm" },
  sawbones: { name: "sawbones", abbr: "sb" },
  scoundrel: { name: "scoundrel", abbr: "sc" },
  soothsinger: { name: "soothsinger", abbr: "ss" },
  spellweaver: { name: "spellweaver", abbr: "sw" },
  summoner: { name: "summoner", abbr: "su" },
  sunkeeper: { name: "sunkeeper", abbr: "sk" },
  tinkerer: { name: "tinkerer", abbr: "ti" },
} as const satisfies Record<string, CharacterClass>;

export type CharacterClassId = keyof typeof characterClasses;

export interface CharacterClassOption extends CharacterClass {
  id: CharacterClassId;
  iconPath: string;
}

export function getCharacterClass(id: CharacterClassId): CharacterClass {
  return characterClasses[id];
}

export function getCharacterClassOptions(): CharacterClassOption[] {
  return Object.entries(characterClasses).map(([id, characterClass]) => ({
    id: id as CharacterClassId,
    ...characterClass,
    iconPath: `/images/class-icons/${id}.png`,
  }));
}
