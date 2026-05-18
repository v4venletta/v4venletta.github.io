# Repository Guidelines

## Project Overview

This is a static Gloomhaven attack modifier/card data app. The browser entrypoint is `index.html`; the app source is `app.js` plus `app.scss`, bundled by webpack into the checked-in `bundle.js` and `bundle.css`.

The repository also contains reusable Gloomhaven data and assets:

- `data/`: JavaScript/JSON data files for cards, perks, events, items, monsters, and related content.
- `images/`: card, icon, map, and token images used by the app and downstream consumers.
- `local_modules/deck` and `local_modules/character`: local npm packages imported as `deck` and `character`.
- `source/`, `lib/`, `src/`, and top-level `utility.js`: older/supporting module sources; inspect call sites before changing them.

## Modernization Target

The recommended target state is a static TypeScript app built with Vite. Prefer Svelte + TypeScript for the UI because the app is mostly reactive state around a small card/deck workflow. React + TypeScript is an acceptable alternative if team familiarity matters more than minimal UI boilerplate.

Target structure:

- `src/domain/`: framework-independent TypeScript for deck, character, perk, modifier, and rule behavior.
- `src/data/`: typed imports or normalized JSON for cards, perks, class metadata, and image paths.
- `src/components/`: UI components such as class select, deck view, discard pile, modifier controls, stats, and perks dialog.
- `src/state/`: small app stores for selected class, active character, deck state, modifier pools, and UI state.
- `tests/`: Vitest coverage for domain rules and Playwright coverage for core browser flows.

Keep the app deployable as a static GitHub Pages site. Avoid introducing a server requirement unless a future feature explicitly needs persistence beyond browser storage or static assets.

For the active migration checklist, phase status, and acceptance criteria, see `MODERNIZATION.md`.

## Commands

- `npm install`: install dependencies. This project uses older webpack/node-sass tooling, so a modern Node version may require dependency upgrades or an older compatible Node runtime.
- `npm run build`: run `webpack -p` and regenerate `bundle.js` / `bundle.css`.
- `npm start`: run `webpack-dev-server`.

There is no formal automated test suite configured in `package.json`. For behavior changes, verify with a local browser/dev server and exercise class selection, drawing, shuffling, bless/curse/-1 modifiers, and perk changes.

Target commands after modernization:

- `npm run dev`: start the Vite development server.
- `npm run build`: type-check and build the static production bundle.
- `npm run preview`: preview the production build locally.
- `npm test`: run Vitest domain/unit tests.
- `npm run test:e2e`: run Playwright browser flows.

## Coding Notes

- Preserve the existing plain JavaScript style unless a larger modernization is explicitly requested.
- `app.js` relies on browser globals from `index.html`, including jQuery and Material Components assets loaded from CDNs.
- Image and data paths are mostly root-relative, such as `/images/...` and `../data/...`; check behavior under the intended GitHub Pages base path before changing paths.
- The app stores character state in browser storage through the `Character` module. Be careful when changing storage keys or object shapes.
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
- If source files change, rebuild only when the generated `bundle.js` / `bundle.css` are intended to be updated.
