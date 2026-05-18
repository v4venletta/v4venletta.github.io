import type { AttackModifierCard, ModifierValue } from "./types.ts";

export class Deck {
  drawPile: AttackModifierCard[];
  discardPile: AttackModifierCard[];
  modPile: AttackModifierCard[];
  globalModCards: AttackModifierCard[];
  shuffleNeeded: boolean;

  constructor(
    baseCards: AttackModifierCard[],
    modCards: AttackModifierCard[] = [],
    globalModCards: AttackModifierCard[] = [],
  ) {
    this.drawPile = [...baseCards];
    this.discardPile = [];
    this.modPile = [...modCards];
    this.globalModCards = [...globalModCards];
    this.shuffleNeeded = false;
    this.shuffle();
  }

  addCard(card: AttackModifierCard): void {
    this.drawPile.push(card);
    this.shuffle();
  }

  addModCardByName(cardName: string): void {
    const index = this.modPile.findIndex((card) => card.name === cardName);

    if (index < 0) {
      throw new Error(`Modifier card not found: ${cardName}`);
    }

    this.drawPile.push(this.modPile[index]);
    this.modPile.splice(index, 1);
    this.shuffle();
  }

  removeCardByName(cardName: string): void {
    const index = this.drawPile.findIndex((card) => card.name === cardName);

    if (index < 0) {
      throw new Error(`Draw pile card not found: ${cardName}`);
    }

    this.removeCardByIndex(index);
  }

  removeCardByIndex(index: number): void {
    const card = this.drawPile[index];

    if (!card) {
      throw new Error(`Draw pile index out of range: ${index}`);
    }

    if (isGlobalModifier(card)) {
      this.returnGlobalModCard(card);
    } else if (!isBaseModifier(card)) {
      this.modPile.push(card);
    }

    this.drawPile.splice(index, 1);
  }

  drawNoDiscard(): AttackModifierCard {
    if (this.drawPile.length < 1) {
      this.shuffleAll();
    }

    const card = this.drawPile.pop();

    if (!card) {
      throw new Error("Cannot draw from an empty deck");
    }

    if (card.value === "x2" || card.value === "miss") {
      this.shuffleNeeded = true;
    }

    return card;
  }

  draw(): AttackModifierCard {
    return this.drawCards()[0];
  }

  drawCards(numCards = 1): AttackModifierCard[] {
    const drawnCards: AttackModifierCard[] = [];
    const cardsToDiscard: AttackModifierCard[] = [];

    do {
      const drawnCard = this.drawNoDiscard();
      drawnCards.push(drawnCard);

      if (drawnCard.value === "bless" || drawnCard.value === "curse") {
        this.returnGlobalModCard(drawnCard);
      } else {
        cardsToDiscard.push(drawnCard);
      }
    } while (drawnCards.length < numCards || allCardsAreRolling(drawnCards));

    this.discardPile = this.discardPile.concat(cardsToDiscard);
    return drawnCards;
  }

  drawAdvantage(): AttackModifierCard[] {
    return this.drawCards(2);
  }

  drawDisadvantage(): AttackModifierCard[] {
    return this.drawCards(2);
  }

  shuffle(): void {
    let m = this.drawPile.length;

    while (m) {
      const i = Math.floor(Math.random() * m--);
      [this.drawPile[m], this.drawPile[i]] = [this.drawPile[i], this.drawPile[m]];
    }
  }

  shuffleAll(): void {
    this.drawPile = this.drawPile.concat(this.discardPile);
    this.discardPile = [];
    this.shuffle();
    this.shuffleNeeded = false;
  }

  get length(): number {
    return this.drawPile.length + this.discardPile.length;
  }

  takeGlobalModCard(cardValue: ModifierValue): AttackModifierCard | undefined {
    const index = this.globalModCards.findIndex((card) => card.value === cardValue);

    if (index < 0) {
      return undefined;
    }

    return this.globalModCards.splice(index, 1)[0];
  }

  returnGlobalModCard(card: AttackModifierCard): void {
    this.globalModCards.push(card);
  }
}

function allCardsAreRolling(cards: AttackModifierCard[]): boolean {
  return cards.length > 0 && cards.every((card) => card.value === "rolling");
}

function isBaseModifier(card: AttackModifierCard): boolean {
  return card.name.startsWith("am-p-") || card.name.startsWith("am-m-");
}

function isGlobalModifier(card: AttackModifierCard): boolean {
  return card.name.startsWith("am-pm-") || card.name.startsWith("am-mm-");
}
