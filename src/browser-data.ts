import type { AppData, AttackModifierCard, CharacterSheet } from "./domain/index.ts";

export async function loadAppData(): Promise<AppData> {
  const [cards, sheets] = await Promise.all([
    loadJson<AttackModifierCard[]>("data/attack-modifiers.js"),
    loadJson<CharacterSheet[]>("data/character-perks+.js"),
  ]);

  return { cards, sheets };
}

async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(assetPath(path));

  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.status}`);
  }

  return parseJsonData<T>(await response.text());
}

export function assetPath(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function parseJsonData<T>(source: string): T {
  return JSON.parse(stripTrailingSourceMap(source)) as T;
}

function stripTrailingSourceMap(source: string): string {
  return source.replace(/\n\/\/# sourceMappingURL=data:application\/json;base64,[\s\S]*$/, "");
}
