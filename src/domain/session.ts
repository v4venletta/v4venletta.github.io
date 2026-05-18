import { Character } from "./character.ts";
import { getCharacterClass, type CharacterClassId } from "./class-registry.ts";
import type {
  AttackModifierCard,
  CharacterClass,
  CharacterSheet,
  DeckStats,
  ModifierValue,
} from "./types.ts";

export interface GameSessionOptions {
  characterName?: string;
  cards: AttackModifierCard[];
  sheets: CharacterSheet[];
}

export class GameSession {
  readonly cards: AttackModifierCard[];
  readonly sheets: CharacterSheet[];
  readonly character: Character;
  lastDrawnCards: AttackModifierCard[];

  constructor(options: GameSessionOptions) {
    this.cards = [...options.cards];
    this.sheets = [...options.sheets];
    this.character = new Character(options.characterName ?? "base", this.cards);
    this.lastDrawnCards = [];
  }

  selectClass(characterClass: CharacterClass): DeckStats {
    this.character.setClass(characterClass, this.sheets, this.cards);
    this.lastDrawnCards = [];
    return this.stats;
  }

  selectClassById(characterClassId: CharacterClassId): DeckStats {
    return this.selectClass(getCharacterClass(characterClassId));
  }

  drawCard(): AttackModifierCard {
    const card = this.character.deck.draw();
    this.lastDrawnCards = [card];
    return card;
  }

  drawCards(count: number): AttackModifierCard[] {
    const cards = this.character.deck.drawCards(count);
    this.lastDrawnCards = cards;
    return cards;
  }

  shuffle(): DeckStats {
    this.character.deck.shuffleAll();
    this.lastDrawnCards = [];
    return this.stats;
  }

  addBless(): AttackModifierCard {
    return this.addGlobalModifier("bless", "All bless cards are currently in use");
  }

  addCurse(): AttackModifierCard {
    return this.addGlobalModifier("curse", "All curse cards are currently in use");
  }

  addMinusOne(): AttackModifierCard {
    return this.addGlobalModifier(-1, "All -1 cards are currently in use");
  }

  applyPerk(perkIndex: number): DeckStats {
    this.character.applyPerk(perkIndex);
    this.lastDrawnCards = [];
    return this.stats;
  }

  applyPerks(perkIndexes: number[]): DeckStats {
    for (const perkIndex of perkIndexes) {
      this.character.applyPerk(perkIndex);
    }

    this.lastDrawnCards = [];
    return this.stats;
  }

  get stats(): DeckStats {
    return {
      drawPile: this.character.deck.drawPile.length,
      discardPile: this.character.deck.discardPile.length,
      modifierPile: this.character.deck.modPile.length,
      globalModifierPile: this.character.deck.globalModCards.length,
      shuffleNeeded: this.character.deck.shuffleNeeded,
    };
  }

  get discardPile(): AttackModifierCard[] {
    return [...this.character.deck.discardPile];
  }

  private addGlobalModifier(value: ModifierValue, unavailableMessage: string): AttackModifierCard {
    const card = this.character.deck.takeGlobalModCard(value);

    if (!card) {
      throw new Error(unavailableMessage);
    }

    this.character.deck.addCard(card);
    return card;
  }
}
