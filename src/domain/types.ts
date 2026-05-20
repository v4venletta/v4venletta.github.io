export type ModifierValue = number | "x2" | "miss" | "bless" | "curse" | "rolling" | "special";

export interface AttackModifierCard {
  name: string;
  image: string;
  value?: ModifierValue;
  shuffle?: boolean;
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

export interface DeckStats {
  drawPile: number;
  discardPile: number;
  modifierPile: number;
  globalModifierPile: number;
  shuffleNeeded: boolean;
}
