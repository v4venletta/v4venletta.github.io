import { Deck } from "./deck.ts";
import type { AttackModifierCard, CharacterClass, CharacterSheet } from "./types.ts";

export class Character {
  name: string;
  characterClass?: CharacterClass;
  sheet?: CharacterSheet;
  deck: Deck;
  items: unknown[];
  activePerks: number[];
  xp: number;
  gold: number;

  constructor(name: string, cards: AttackModifierCard[] = []) {
    this.name = name;
    this.deck = createDeck(cards);
    this.items = [];
    this.activePerks = [];
    this.xp = 0;
    this.gold = 0;
  }

  get storageName(): string {
    return `Character(${this.name})`;
  }

  setClass(
    characterClass: CharacterClass,
    sheets: CharacterSheet[],
    cards: AttackModifierCard[],
  ): void {
    this.characterClass = characterClass;
    this.sheet = findCharacterSheet(characterClass, sheets);
    this.deck = createDeck(cards, characterClass);
    this.activePerks = [];
  }

  applyPerk(perkIndex: number): void {
    if (!this.sheet) {
      throw new Error("Cannot apply a perk before selecting a class");
    }

    const perk = this.sheet.perks[perkIndex];

    if (!perk) {
      throw new Error(`Perk index out of range: ${perkIndex}`);
    }

    this.deck.shuffleAll();

    for (const action of perk.actions) {
      for (const card of action.cards) {
        if (action.type === "remove") {
          this.deck.removeCardByName(card);
        } else {
          this.deck.addModCardByName(card);
        }
      }
    }

    if (!this.activePerks.includes(perkIndex)) {
      this.activePerks.push(perkIndex);
    }
  }
}

export function createDeck(
  cards: AttackModifierCard[],
  characterClass?: CharacterClass,
): Deck {
  const baseCards = cards.filter((card) => card.name.startsWith("am-p-"));
  const globalModCards = cards.filter((card) => card.name.startsWith("am-pm-"));
  const modCards = characterClass
    ? cards.filter((card) => card.name.startsWith(`am-${characterClass.abbr}`))
    : [];

  return new Deck(baseCards, modCards, globalModCards);
}

export function findCharacterSheet(
  characterClass: CharacterClass,
  sheets: CharacterSheet[],
): CharacterSheet {
  const sheet = sheets.find((candidate) => candidate.name === `${characterClass.name} perks`);

  if (!sheet) {
    throw new Error(`Character sheet not found: ${characterClass.name}`);
  }

  return sheet;
}
