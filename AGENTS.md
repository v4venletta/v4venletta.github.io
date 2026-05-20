# Repository Guidelines

## Project Overview

This is a static Gloomhaven attack modifier/card data app. The browser entrypoint is `index.html`; the app source lives in `src/` and is built by Vite.

The repository also contains reusable Gloomhaven data and assets:

- `data/`: JavaScript/JSON data files for cards, perks, events, items, monsters, and related content.
- `images/`: card, icon, map, and token images used by the app and downstream consumers.
- `src/domain/`: framework-independent TypeScript for deck, character, perk, modifier, and rule behavior.
- `src/data/`: typed app data and validation for the modern deck workflow.
- `src/components/`: Svelte UI components.
- `src/state/`: UI-facing session state and actions.

## Modernization Target

The target state is a static TypeScript app built with Vite and Svelte. The modern app is now the primary deployed experience.

Target structure:

- `src/domain/`: framework-independent TypeScript for deck, character, perk, modifier, and rule behavior.
- `src/data/`: typed imports or normalized JSON for cards, perks, class metadata, and image paths.
- `src/components/`: UI components such as class select, deck view, discard pile, modifier controls, stats, and perks dialog.
- `src/state/`: small app stores for selected class, active character, deck state, modifier pools, and UI state.
- `tests/`: Vitest coverage for domain rules and Playwright coverage for core browser flows.

Keep the app deployable as a static GitHub Pages site. Avoid introducing a server requirement unless a future feature explicitly needs persistence beyond browser storage or static assets.

For the active migration checklist, phase status, and acceptance criteria, see `MODERNIZATION.md`.

## Commands

- `npm install`: install dependencies.
- `npm run dev`: start the Vite development server.
- `npm run build`: type-check and build the static production bundle.
- `npm run preview`: preview the production build locally.
- `npm test`: run Node test-runner domain/unit tests.
- `npm run test:e2e`: run Playwright browser flows.

## Coding Notes

- Prefer TypeScript for new app code and keep framework-independent behavior in `src/domain/`.
- Image and data paths are mostly root-relative, such as `/images/...` and `../data/...`; check behavior under the intended GitHub Pages base path before changing paths.
- The app stores selected class/perk state in browser storage through `DeckSessionController`. Be careful when changing storage keys or object shapes.
- When modifying `data/` files, keep exported object/array shapes compatible with existing consumers and avoid broad formatting churn.
- When adding images, keep file sizes reasonable and preserve the existing directory naming conventions.

## Migration Priorities

1. Extract and test `Deck` and `Character` behavior before changing the UI. Protect draw, shuffle, bless/curse return, perk application, and global modifier behavior with Vitest.
2. Add Vite, TypeScript, Vitest, and Dart Sass while keeping the current UI behavior intact.
3. Normalize data loading by converting JSON-like `.js` data files into real JSON or typed TypeScript exports.
4. Remove jQuery and CDN runtime assumptions; use static imports, `fetch`, native DOM APIs, or framework state.
5. Rebuild the UI as components, starting with the class selector, deck/discard views, modifier buttons, stats, and perks dialog.
6. Add Playwright coverage for class selection, drawing, shuffling, discard inspection, modifier buttons, and perk application.
7. Clean up deployment so generated output is intentional and documented for GitHub Pages.

## Git Hygiene

- Do not commit generated dependency folders or local OS files. This repo currently has untracked `.DS_Store` files; leave them alone unless explicitly asked to clean them up.
- The production build output lives in `dist/` and is deployed by GitHub Actions; do not commit generated build output.
