# Modernization Summary

This file is a completion record for the Gloomhaven app modernization. Keep durable contribution guidance in `AGENTS.md`; use this document only for migration context and future maintenance notes.

## Status

The modernization is complete on `master`.

The primary app is now a static Vite, Svelte, and TypeScript application deployed through GitHub Pages. The old jQuery, Material Components global, webpack, Babel, `node-sass`, checked-in bundle, and temporary legacy-page paths have been removed from the active app.

## Current Architecture

- `index.html` is the browser entrypoint for the Vite app.
- `src/main.ts` mounts the Svelte application.
- `src/App.svelte` coordinates loading and top-level UI state.
- `src/components/` contains the class picker, character tabs, draw stage, stats/discard panel, and perks panel.
- `src/state/deck-session.ts` wraps `GameSession` for browser-facing actions, multiple character slots, undo, and reset behavior.
- `src/domain/` contains framework-independent deck, character, class, perk, modifier, and session rules.
- `src/data/` contains typed and validated app data entrypoints.
- `tests/domain/`, `tests/data/`, and `tests/state/` cover rule and data behavior with Node's built-in test runner.
- `tests/e2e/` covers core browser flows with Playwright.

## Completed Work

- Extracted deck, character, class registry, app-data initialization, and session behavior into TypeScript domain modules.
- Added Svelte components for the modern attack modifier deck workflow.
- Added UI support for class selection, drawing, two-card draws, shuffling, discard inspection, scenario modifiers, perks, four character slots, undo, and scenario/base-deck/character resets.
- Converted the primary browser entrypoint to Vite and removed the obsolete legacy app source and generated bundles.
- Added canonical JSON copies and typed validation for attack modifiers, character perks, broader catalog data, class metadata, and asset path structure.
- Filled attack modifier `value` and `conditions` metadata for every normalized attack modifier card, including the corrected `am-p-17` `-2` value.
- Added parity tests to keep modern JSON files aligned with preserved legacy JSON-shaped `.js` data files.
- Added a GitHub Actions Pages workflow that tests, builds, uploads `dist/`, and deploys the static Vite output.

## Validation

Use these commands for routine verification:

- `npm test`
- `npm run build`
- `npm run test:e2e`

For local browser validation:

- `npm run dev`
- Open `http://127.0.0.1:5173/`

## Compatibility Notes

- The original JSON-shaped `.js` data files under `data/` remain for downstream consumers and historical compatibility.
- Modern JSON files should stay semantically in sync with those legacy files until the legacy exports are intentionally retired.
- Some attack modifier cards use `value: "special"` where the current source data does not encode a precise numeric, terminal, or rolling value.
- Several broader catalog datasets reference image paths for asset packs that are not fully present in this repository; catalog tests validate path shape rather than requiring every referenced image to exist locally.

## Future Maintenance

- Prefer keeping new rule behavior in `src/domain/` with focused tests.
- Prefer adding new browser-facing actions through `DeckSessionController` rather than directly mutating Svelte component state.
- When changing data shapes, update `src/data/validation.ts`, `src/data/catalog-data.ts`, and the parity tests together.
- If the project later wants TypeScript to type-check tests directly, add Node type declarations and update `tsconfig.json`; current validation is covered by the npm scripts above.
