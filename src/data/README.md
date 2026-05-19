# Modern Data Boundary

The modern Vite/Svelte shell imports normalized data through `src/data/`.

- `data/attack-modifiers.json` is the canonical modern copy of legacy `data/attack-modifiers.js`.
- `data/character-perks-plus.json` is the canonical modern copy of legacy `data/character-perks+.js`.
- `src/data/app-data.ts` validates and exports the data used by the modern deck workflow.
- `src/data/character-classes.ts` owns class ids, abbreviations, names, and icon paths.

The previous `legacy.html` flow has been removed, but the original JSON-shaped `.js` data files remain for downstream consumers and historical compatibility. Keep each modern JSON file semantically in sync with its legacy source until those legacy data exports are intentionally retired. The parity tests in `tests/data/parity.test.ts` enforce that split.
