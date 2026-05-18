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

export interface DeckSessionSnapshot {
  selectedClassId: CharacterClassId;
  selectedClass: CharacterClassOption;
  stats: DeckStats;
  lastDrawnCards: AttackModifierCard[];
  discardPile: AttackModifierCard[];
  perks: Perk[];
  activePerks: number[];
}

export type DeckSessionAction =
  | "draw"
  | "shuffle"
  | "bless"
  | "curse"
  | "minusOne";

const classOptions = getCharacterClassOptions();

export class DeckSessionController {
  readonly classOptions: CharacterClassOption[];
  private readonly session: GameSession;
  private selectedClassId: CharacterClassId;

  constructor(data: AppData, selectedClassId: CharacterClassId = "brute") {
    this.classOptions = classOptions;
    this.session = createGameSession(data, { characterName: "modern-shell" });
    this.selectedClassId = selectedClassId;
    this.session.selectClassById(selectedClassId);
  }

  selectClass(classId: CharacterClassId): DeckSessionSnapshot {
    this.selectedClassId = classId;
    this.session.selectClassById(classId);
    return this.snapshot;
  }

  run(action: DeckSessionAction): DeckSessionSnapshot {
    switch (action) {
      case "draw":
        this.session.drawCard();
        break;
      case "shuffle":
        this.session.shuffle();
        break;
      case "bless":
        this.session.addBless();
        break;
      case "curse":
        this.session.addCurse();
        break;
      case "minusOne":
        this.session.addMinusOne();
        break;
    }

    return this.snapshot;
  }

  applyPerk(perkIndex: number): DeckSessionSnapshot {
    this.session.applyPerk(perkIndex);
    return this.snapshot;
  }

  get snapshot(): DeckSessionSnapshot {
    const selectedClass = this.classOptions.find((option) => option.id === this.selectedClassId);

    if (!selectedClass) {
      throw new Error(`Unknown class id: ${this.selectedClassId}`);
    }

    return {
      selectedClassId: this.selectedClassId,
      selectedClass,
      stats: this.session.stats,
      lastDrawnCards: [...this.session.lastDrawnCards],
      discardPile: this.session.discardPile,
      perks: this.session.character.sheet?.perks ?? [],
      activePerks: [...this.session.character.activePerks],
    };
  }
}
