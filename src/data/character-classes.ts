import type { CharacterClass } from "../domain/types.ts";
import { normalizeCharacterClassData } from "./validation.ts";

export interface CharacterClassData extends CharacterClass {
  iconPath: string;
}

export const characterClassData = normalizeCharacterClassData({
  beasttyrant: { name: "beast tyrant", abbr: "bt", iconPath: "/images/class-icons/beasttyrant.png" },
  berserker: { name: "berserker", abbr: "be", iconPath: "/images/class-icons/berserker.png" },
  bladeswarm: { name: "bladeswarm", abbr: "bs", iconPath: "/images/class-icons/bladeswarm.png" },
  brute: { name: "brute", abbr: "br", iconPath: "/images/class-icons/brute.png" },
  cragheart: { name: "cragheart", abbr: "ch", iconPath: "/images/class-icons/cragheart.png" },
  diviner: { name: "diviner", abbr: "dr", iconPath: "/images/class-icons/diviner.png" },
  doomstalker: { name: "doomstalker", abbr: "ds", iconPath: "/images/class-icons/doomstalker.png" },
  elementalist: { name: "elementalist", abbr: "el", iconPath: "/images/class-icons/elementalist.png" },
  mindthief: { name: "mindthief", abbr: "mt", iconPath: "/images/class-icons/mindthief.png" },
  nightshroud: { name: "nightshroud", abbr: "ns", iconPath: "/images/class-icons/nightshroud.png" },
  plagueherald: { name: "plagueherald", abbr: "ph", iconPath: "/images/class-icons/plagueherald.png" },
  quartermaster: { name: "quartermaster", abbr: "qm", iconPath: "/images/class-icons/quartermaster.png" },
  sawbones: { name: "sawbones", abbr: "sb", iconPath: "/images/class-icons/sawbones.png" },
  scoundrel: { name: "scoundrel", abbr: "sc", iconPath: "/images/class-icons/scoundrel.png" },
  soothsinger: { name: "soothsinger", abbr: "ss", iconPath: "/images/class-icons/soothsinger.png" },
  spellweaver: { name: "spellweaver", abbr: "sw", iconPath: "/images/class-icons/spellweaver.png" },
  summoner: { name: "summoner", abbr: "su", iconPath: "/images/class-icons/summoner.png" },
  sunkeeper: { name: "sunkeeper", abbr: "sk", iconPath: "/images/class-icons/sunkeeper.png" },
  tinkerer: { name: "tinkerer", abbr: "ti", iconPath: "/images/class-icons/tinkerer.png" },
} as const);
