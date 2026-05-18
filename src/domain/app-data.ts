import { GameSession, type GameSessionOptions } from "./session.ts";
import type { AttackModifierCard, CharacterSheet } from "./types.ts";

export interface AppData {
  cards: AttackModifierCard[];
  sheets: CharacterSheet[];
}

export function createGameSession(data: AppData, options: Pick<GameSessionOptions, "characterName"> = {}): GameSession {
  return new GameSession({
    characterName: options.characterName,
    cards: data.cards,
    sheets: data.sheets,
  });
}
