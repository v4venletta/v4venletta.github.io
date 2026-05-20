import type { AppData } from "../domain/app-data.ts";
import type { AttackModifierCard, CharacterSheet, ModifierValue, Perk, PerkAction } from "../domain/types.ts";
import type { CharacterClassData } from "./character-classes.ts";

const modifierValues = new Set<ModifierValue>(["x2", "miss", "bless", "curse", "rolling", "special"]);
const perkActionTypes = new Set<PerkAction["type"]>(["add", "remove"]);

export function normalizeAppData(input: { cards: unknown; sheets: unknown; classes?: Record<string, CharacterClassData> }): AppData {
  const cards = normalizeAttackModifierCards(input.cards);
  const sheets = normalizeCharacterSheets(input.sheets);

  validateAttackModifierMetadata(cards);
  validatePerkCardReferences(sheets, cards);
  if (input.classes) {
    validateClassDataReferences(input.classes, sheets, cards);
  }

  return { cards, sheets };
}

export function normalizeAttackModifierCards(input: unknown): AttackModifierCard[] {
  assertArray(input, "attack modifier data");

  return input.map((card, index) => normalizeAttackModifierCard(card, `attack modifier ${index}`));
}

export function normalizeCharacterSheets(input: unknown): CharacterSheet[] {
  assertArray(input, "character sheet data");

  return input.map((sheet, index) => normalizeCharacterSheet(sheet, `character sheet ${index}`));
}

export function normalizeCharacterClassData<T extends Record<string, CharacterClassData>>(input: T): T {
  assertRecord(input, "character class data");

  const classNames = new Set<string>();
  const abbreviations = new Set<string>();

  for (const [id, characterClass] of Object.entries(input)) {
    const path = `character class ${id}`;
    assertRecord(characterClass, path);
    assertString(characterClass.name, `${path}.name`);
    assertString(characterClass.abbr, `${path}.abbr`);
    assertString(characterClass.iconPath, `${path}.iconPath`);

    if (!/^[a-z][a-z0-9]*$/.test(id)) {
      throw new Error(`${path} id must use lowercase letters and numbers`);
    }

    if (!characterClass.iconPath.startsWith("/images/class-icons/")) {
      throw new Error(`${path}.iconPath must reference /images/class-icons/`);
    }

    if (classNames.has(characterClass.name)) {
      throw new Error(`${path}.name duplicates another class name`);
    }

    if (abbreviations.has(characterClass.abbr)) {
      throw new Error(`${path}.abbr duplicates another class abbreviation`);
    }

    classNames.add(characterClass.name);
    abbreviations.add(characterClass.abbr);
  }

  return input;
}

function normalizeAttackModifierCard(input: unknown, path: string): AttackModifierCard {
  assertRecord(input, path);
  assertString(input.name, `${path}.name`);
  assertString(input.image, `${path}.image`);

  const card: AttackModifierCard = {
    name: input.name,
    image: input.image,
  };

  if (input.value !== undefined) {
    card.value = normalizeModifierValue(input.value, `${path}.value`);
  }

  if (input.shuffle !== undefined) {
    assertBoolean(input.shuffle, `${path}.shuffle`);
    card.shuffle = input.shuffle;
  }

  if (input.points !== undefined) {
    assertNumber(input.points, `${path}.points`);
    card.points = input.points;
  }

  if (input.xws !== undefined) {
    assertString(input.xws, `${path}.xws`);
    card.xws = input.xws;
  }

  if (input.conditions !== undefined) {
    card.conditions = normalizeStringArray(input.conditions, `${path}.conditions`);
  }

  return card;
}

function normalizeCharacterSheet(input: unknown, path: string): CharacterSheet {
  assertRecord(input, path);
  assertString(input.name, `${path}.name`);

  const perks = input.perks === undefined ? [] : normalizePerks(input.perks, `${path}.perks`);

  return {
    name: input.name,
    perks,
  };
}

function normalizePerks(input: unknown, path: string): Perk[] {
  assertArray(input, path);

  return input.map((perk, index) => normalizePerk(perk, `${path}[${index}]`));
}

function normalizePerk(input: unknown, path: string): Perk {
  assertRecord(input, path);
  assertString(input.name, `${path}.name`);

  const actions = input.actions === undefined ? [] : normalizePerkActions(input.actions, `${path}.actions`);

  return {
    name: input.name,
    actions,
  };
}

function normalizePerkActions(input: unknown, path: string): PerkAction[] {
  assertArray(input, path);

  return input.map((action, index) => normalizePerkAction(action, `${path}[${index}]`));
}

function normalizePerkAction(input: unknown, path: string): PerkAction {
  assertRecord(input, path);
  assertString(input.type, `${path}.type`);

  if (!perkActionTypes.has(input.type as PerkAction["type"])) {
    throw new Error(`${path}.type must be "add" or "remove"`);
  }

  return {
    type: input.type as PerkAction["type"],
    cards: normalizeStringArray(input.cards, `${path}.cards`),
  };
}

function normalizeModifierValue(input: unknown, path: string): ModifierValue {
  if (typeof input === "number") {
    return input;
  }

  if (typeof input === "string" && modifierValues.has(input as ModifierValue)) {
    return input as ModifierValue;
  }

  throw new Error(`${path} has unsupported modifier value`);
}

function validatePerkCardReferences(sheets: CharacterSheet[], cards: AttackModifierCard[]): void {
  const cardNames = new Set(cards.map((card) => card.name));

  for (const sheet of sheets) {
    for (const perk of sheet.perks) {
      for (const action of perk.actions) {
        for (const cardName of action.cards) {
          if (!cardNames.has(cardName)) {
            throw new Error(`${sheet.name} perk "${perk.name}" references unknown card "${cardName}"`);
          }
        }
      }
    }
  }
}

function validateAttackModifierMetadata(cards: AttackModifierCard[]): void {
  for (const card of cards) {
    if (card.value === undefined) {
      throw new Error(`Attack modifier "${card.name}" is missing value metadata`);
    }

    if (!Array.isArray(card.conditions)) {
      throw new Error(`Attack modifier "${card.name}" is missing conditions metadata`);
    }
  }
}

function validateClassDataReferences(
  classes: Record<string, CharacterClassData>,
  sheets: CharacterSheet[],
  cards: AttackModifierCard[],
): void {
  const expectedSheetNames = new Set(Object.values(classes).map((characterClass) => `${characterClass.name} perks`));
  const sheetNames = new Set(sheets.map((sheet) => sheet.name));
  const cardNames = cards.map((card) => card.name);

  for (const sheetName of sheetNames) {
    if (!expectedSheetNames.has(sheetName)) {
      throw new Error(`Character sheet "${sheetName}" does not match a known character class`);
    }
  }

  for (const [id, characterClass] of Object.entries(classes)) {
    const sheetName = `${characterClass.name} perks`;

    if (!sheetNames.has(sheetName)) {
      throw new Error(`Character class "${id}" is missing sheet "${sheetName}"`);
    }

    if (!cardNames.some((cardName) => cardName.startsWith(`am-${characterClass.abbr}-`))) {
      throw new Error(`Character class "${id}" has no attack modifier cards for abbreviation "${characterClass.abbr}"`);
    }
  }
}

function normalizeStringArray(input: unknown, path: string): string[] {
  assertArray(input, path);

  return input.map((value, index) => {
    assertString(value, `${path}[${index}]`);
    return value;
  });
}

function assertArray(input: unknown, path: string): asserts input is unknown[] {
  if (!Array.isArray(input)) {
    throw new Error(`${path} must be an array`);
  }
}

function assertRecord(input: unknown, path: string): asserts input is Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(`${path} must be an object`);
  }
}

function assertString(input: unknown, path: string): asserts input is string {
  if (typeof input !== "string") {
    throw new Error(`${path} must be a string`);
  }
}

function assertNumber(input: unknown, path: string): asserts input is number {
  if (typeof input !== "number") {
    throw new Error(`${path} must be a number`);
  }
}

function assertBoolean(input: unknown, path: string): asserts input is boolean {
  if (typeof input !== "boolean") {
    throw new Error(`${path} must be a boolean`);
  }
}
