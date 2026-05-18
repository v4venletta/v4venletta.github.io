export type ModifierValue = number | "x2" | "miss" | "bless" | "curse" | "rolling";

export interface AttackModifierCard {
  name: string;
  image: string;
  value?: ModifierValue;
  points?: number;
  xws?: string;
  conditions?: string[];
}

export interface CharacterClass {
  name: string;
  abbr: string;
}

export interface PerkAction {
  type: "add" | "remove";
  cards: string[];
}

export interface Perk {
  name: string;
  actions: PerkAction[];
}

export interface CharacterSheet {
  name: string;
  perks: Perk[];
}
