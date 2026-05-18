import attackModifierCards from "../../data/attack-modifiers.json" with { type: "json" };
import characterSheets from "../../data/character-perks-plus.json" with { type: "json" };
import type { AppData } from "../domain/app-data.ts";
import { characterClassData } from "./character-classes.ts";
import { normalizeAppData } from "./validation.ts";

export const appData: AppData = normalizeAppData({
  cards: attackModifierCards,
  sheets: characterSheets,
  classes: characterClassData,
});

export {
  normalizeAppData,
  normalizeAttackModifierCards,
  normalizeCharacterClassData,
  normalizeCharacterSheets,
} from "./validation.ts";
