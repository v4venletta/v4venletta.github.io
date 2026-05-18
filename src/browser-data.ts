import { appData } from "./data/app-data.ts";
import type { AppData } from "./domain/index.ts";

export async function loadAppData(): Promise<AppData> {
  return appData;
}

export function assetPath(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
