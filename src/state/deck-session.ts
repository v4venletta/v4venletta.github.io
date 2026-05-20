import {
  createGameSession,
  getCharacterClassOptions,
  type AppData,
  type AttackModifierCard,
  type CharacterClassId,
  type CharacterClassOption,
  type DeckStats,
  type GameSession,
  type Perk,
} from "../domain/index.ts";

export interface CharacterSlotSnapshot {
  index: number;
  name: string;
  selectedClassId: CharacterClassId;
  selectedClass: CharacterClassOption;
  stats: DeckStats;
  activePerks: number[];
}

export interface DeckSessionSnapshot {
  activeCharacterIndex: number;
  characters: CharacterSlotSnapshot[];
  selectedClassId: CharacterClassId;
  selectedClass: CharacterClassOption;
  stats: DeckStats;
  lastDrawnCards: AttackModifierCard[];
  discardPile: AttackModifierCard[];
  perks: Perk[];
  activePerks: number[];
  canUndo: boolean;
}

export type DeckSessionAction =
  | "draw"
  | "drawTwo"
  | "shuffle"
  | "bless"
  | "curse"
  | "minusOne"
  | "resetScenario"
  | "resetBaseDeck"
  | "resetCharacter"
  | "undo";

const classOptions = getCharacterClassOptions();
const defaultCharacterCount = 4;
const defaultClassId: CharacterClassId = "brute";

interface SerializedCharacterState {
  selectedClassId: CharacterClassId;
  activePerks: number[];
  drawPile: string[];
  discardPile: string[];
  modPile: string[];
  globalModCards: string[];
  lastDrawnCards: string[];
  shuffleNeeded: boolean;
}

interface SerializedControllerState {
  activeCharacterIndex: number;
  characters: SerializedCharacterState[];
}

export class DeckSessionController {
  readonly classOptions: CharacterClassOption[];
  private readonly cardsByName: Map<string, AttackModifierCard>;
  private readonly history: SerializedControllerState[];
  private readonly sessions: GameSession[];
  private activeCharacterIndex: number;
  private selectedClassIds: CharacterClassId[];

  constructor(data: AppData, selectedClassId: CharacterClassId = defaultClassId, characterCount = defaultCharacterCount) {
    this.classOptions = classOptions;
    this.cardsByName = new Map(data.cards.map((card) => [card.name, card]));
    this.history = [];
    this.sessions = Array.from({ length: characterCount }, (_, index) =>
      createGameSession(data, { characterName: `Character ${index + 1}` }),
    );
    this.activeCharacterIndex = 0;
    this.selectedClassIds = this.sessions.map(() => selectedClassId);

    for (const session of this.sessions) {
      session.selectClassById(selectedClassId);
    }
  }

  selectClass(classId: CharacterClassId): DeckSessionSnapshot {
    return this.withHistory(() => {
      this.selectedClassIds[this.activeCharacterIndex] = classId;
      this.activeSession.selectClassById(classId);
    });
  }

  selectCharacter(index: number): DeckSessionSnapshot {
    if (!this.sessions[index]) {
      throw new Error(`Character index out of range: ${index}`);
    }

    this.activeCharacterIndex = index;
    return this.snapshot;
  }

  run(action: DeckSessionAction): DeckSessionSnapshot {
    if (action === "undo") {
      return this.undo();
    }

    return this.withHistory(() => {
      switch (action) {
        case "draw":
          this.activeSession.drawCard();
          break;
        case "drawTwo":
          this.activeSession.drawCards(2);
          break;
        case "shuffle":
          this.activeSession.shuffle();
          break;
        case "bless":
          this.activeSession.addBless();
          break;
        case "curse":
          this.activeSession.addCurse();
          break;
        case "minusOne":
          this.activeSession.addMinusOne();
          break;
        case "resetScenario":
          this.resetScenario();
          break;
        case "resetBaseDeck":
          this.resetBaseDeck();
          break;
        case "resetCharacter":
          this.resetCharacter();
          break;
      }
    });
  }

  applyPerk(perkIndex: number): DeckSessionSnapshot {
    return this.withHistory(() => {
      this.activeSession.applyPerk(perkIndex);
    });
  }

  togglePerk(perkIndex: number): DeckSessionSnapshot {
    return this.withHistory(() => {
      const nextPerks = this.activeSession.character.activePerks.includes(perkIndex)
        ? this.activeSession.character.activePerks.filter((activePerk) => activePerk !== perkIndex)
        : [...this.activeSession.character.activePerks, perkIndex];

      this.activeSession.setActivePerks(nextPerks);
    });
  }

  get snapshot(): DeckSessionSnapshot {
    const selectedClassId = this.selectedClassIds[this.activeCharacterIndex];
    const selectedClass = this.getSelectedClass(selectedClassId);
    const session = this.activeSession;

    return {
      activeCharacterIndex: this.activeCharacterIndex,
      characters: this.sessions.map((characterSession, index) => {
        const characterClassId = this.selectedClassIds[index];

        return {
          index,
          name: characterSession.character.name,
          selectedClassId: characterClassId,
          selectedClass: this.getSelectedClass(characterClassId),
          stats: characterSession.stats,
          activePerks: [...characterSession.character.activePerks],
        };
      }),
      selectedClassId,
      selectedClass,
      stats: session.stats,
      lastDrawnCards: [...session.lastDrawnCards],
      discardPile: session.discardPile,
      perks: session.character.sheet?.perks ?? [],
      activePerks: [...session.character.activePerks],
      canUndo: this.history.length > 0,
    };
  }

  private get activeSession(): GameSession {
    return this.sessions[this.activeCharacterIndex];
  }

  private getSelectedClass(classId: CharacterClassId): CharacterClassOption {
    const selectedClass = this.classOptions.find((option) => option.id === classId);

    if (!selectedClass) {
      throw new Error(`Unknown class id: ${classId}`);
    }

    return selectedClass;
  }

  private resetScenario(): void {
    const activePerks = [...this.activeSession.character.activePerks];
    this.activeSession.setActivePerks(activePerks);
  }

  private resetBaseDeck(): void {
    const selectedClassId = this.selectedClassIds[this.activeCharacterIndex];
    this.activeSession.selectClassById(selectedClassId);
  }

  private resetCharacter(): void {
    this.selectedClassIds[this.activeCharacterIndex] = defaultClassId;
    this.activeSession.selectClassById(defaultClassId);
  }

  private undo(): DeckSessionSnapshot {
    const previousState = this.history.pop();

    if (previousState) {
      this.restore(previousState);
    }

    return this.snapshot;
  }

  private withHistory(action: () => void): DeckSessionSnapshot {
    const previousState = this.serialize();

    try {
      action();
      this.history.push(previousState);
      return this.snapshot;
    } catch (error) {
      this.restore(previousState);
      throw error;
    }
  }

  private serialize(): SerializedControllerState {
    return {
      activeCharacterIndex: this.activeCharacterIndex,
      characters: this.sessions.map((session, index) => ({
        selectedClassId: this.selectedClassIds[index],
        activePerks: [...session.character.activePerks],
        drawPile: session.character.deck.drawPile.map((card) => card.name),
        discardPile: session.character.deck.discardPile.map((card) => card.name),
        modPile: session.character.deck.modPile.map((card) => card.name),
        globalModCards: session.character.deck.globalModCards.map((card) => card.name),
        lastDrawnCards: session.lastDrawnCards.map((card) => card.name),
        shuffleNeeded: session.character.deck.shuffleNeeded,
      })),
    };
  }

  private restore(state: SerializedControllerState): void {
    this.activeCharacterIndex = state.activeCharacterIndex;

    state.characters.forEach((characterState, index) => {
      const session = this.sessions[index];

      this.selectedClassIds[index] = characterState.selectedClassId;
      session.selectClassById(characterState.selectedClassId);
      session.character.activePerks = [...characterState.activePerks];
      session.character.deck.drawPile = this.resolveCards(characterState.drawPile);
      session.character.deck.discardPile = this.resolveCards(characterState.discardPile);
      session.character.deck.modPile = this.resolveCards(characterState.modPile);
      session.character.deck.globalModCards = this.resolveCards(characterState.globalModCards);
      session.character.deck.shuffleNeeded = characterState.shuffleNeeded;
      session.lastDrawnCards = this.resolveCards(characterState.lastDrawnCards);
    });
  }

  private resolveCards(cardNames: string[]): AttackModifierCard[] {
    return cardNames.map((cardName) => {
      const card = this.cardsByName.get(cardName);

      if (!card) {
        throw new Error(`Card not found while restoring session: ${cardName}`);
      }

      return card;
    });
  }
}
