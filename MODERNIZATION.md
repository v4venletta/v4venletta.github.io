# Modernization Roadmap

This file tracks the active rewrite plan. Keep durable engineering guidance in `AGENTS.md`; keep phase status, remaining work, and acceptance criteria here.

## Target State

- Static TypeScript app built with Vite.
- Svelte + TypeScript UI unless team preference changes.
- Framework-independent domain logic in `src/domain/`.
- Typed/normalized data imports in `src/data/`.
- Componentized UI in `src/components/`.
- App state/actions exposed through small stores or session wrappers.
- Unit tests for rules and browser tests for core flows.
- GitHub Pages-compatible static deployment.

## Phase Status

### Phase 1: Domain Foundation

Status: Complete and merged to `master`.

Completed:

- Extracted `Deck`, `Character`, and shared types into `src/domain/`.
- Added `GameSession` as a UI-facing action layer.
- Added typed class registry and app data initializer.
- Added tests for deck behavior, character perks, real data, class registry, and session actions.
- Current validation: covered by the full `npm test` suite.

Known caveat:

- Tests currently use Node's built-in test runner. Move to Vitest when the modern package stack is introduced.

### Phase 2: Modern Browser Shell

Status: Complete on `codex-phase-2-vite-shell`; ready to merge after review.

Goals:

- Add Vite + Svelte + TypeScript without relying on legacy webpack or `node-sass`.
- Create a browser-testable app shell.
- Wire the first UI slice to `GameSession`.
- Keep the legacy app available until the new shell can cover core flows.

Completed so far:

- Added a `modern.html` Vite entrypoint beside the legacy `index.html`; Phase 6 prep later promoted this to `index.html`.
- Added a Svelte + TypeScript app shell for class selection, drawing, shuffling, scenario modifiers, discard inspection, stats, and first-pass perk application.
- Added `src/browser-data.ts` to load existing JSON-shaped data files in the browser without changing legacy consumers.
- Added `src/state/DeckSessionController` as a testable UI-facing state/action wrapper around `GameSession`.
- Split the modern shell into focused Svelte components: class picker, draw stage, stats/discard panel, and perks panel.
- Added stable `data-testid` hooks for upcoming browser tests.
- Added Node-runner state tests for the modern shell action surface.
- Removed the legacy webpack/Babel/node-sass dependency stack from `package.json`; the legacy checked-in bundle remains available through `legacy.html`.
- Regenerated `package-lock.json` for the modern Vite/Svelte toolchain.
- Added `node_modules/`, `dist/`, and Playwright output folders to `.gitignore`.
- Added Playwright configuration and browser tests for the modern shell.
- Added perk toggles and terminal-card auto-shuffle behavior to the modern UI.

Current validation: `npm test`, `npm run build`, and `npm run test:e2e` pass on modern Node. The browser app has also been manually validated at `http://127.0.0.1:5173/`.

Known caveat:

- Superseded by Phase 6 prep: the modern shell now owns `index.html`, and the legacy page has been archived as `legacy.html`.

Acceptance criteria:

- `npm run dev` starts a Vite dev server.
- `npm run build` produces a static build.
- A user can open the app in a browser and select a class, draw a card, shuffle, and see deck stats through the new UI.
- Existing domain tests still pass.

### Phase 3: Data Normalization

Status: Complete for the current modern deck workflow.

Goals:

- Convert JSON-shaped `.js` data files into real `.json` or typed TypeScript modules.
- Add validation for card, perk, class, and image-path data.
- Remove ad hoc file-path and naming knowledge from UI code.

Completed so far:

- Added canonical JSON files for the modern attack modifier and character perk data used by the deck workflow.
- Added `src/data/` as the normalized app-data entrypoint with runtime validation for attack modifier cards, character sheets, perk actions, modifier values, and perk card references.
- Updated the modern browser loader and test helpers to use typed bundled data instead of fetching and parsing legacy `.js` data files.
- Added tests for data normalization, placeholder character sheets, and invalid card references.
- Moved class metadata and icon paths into `src/data/`, leaving the existing domain registry API as a compatibility adapter.
- Added tests that validate normalized attack modifier image paths and class icon paths exist on disk.
- Added cross-data validation so class metadata, character perk sheets, and class attack modifier card prefixes stay in sync.
- Documented the modern/legacy data boundary in `src/data/README.md`.
- Added parity tests to keep the modern JSON files in sync with the legacy JSON-shaped `.js` files while both app entrypoints exist.

Remaining deferred work:

- Broader non-deck datasets such as items, events, monsters, ability cards, and map assets can be normalized when the modern UI starts consuming them.

Acceptance criteria:

- Domain/session initialization uses typed data imports. Complete for deck workflow.
- Tests validate data shape and key cross-references. Complete for deck workflow.
- Legacy data consumers are either migrated or explicitly preserved. Complete; legacy `.js` data files are preserved and parity-tested.

### Phase 4: Component Rewrite

Status: Started as part of Phase 2; remaining work should continue after data normalization.

Goals:

- Replace DOM mutation in `app.js` with Svelte components.
- Build class selector, deck view, discard pile, modifier controls, stats, and perks dialog.
- Move inline styles into component or global styles.

Completed so far:

- Added first-pass Svelte components for the class selector, draw stage, stats/discard panel, and perks panel.
- Kept app coordination in `App.svelte` and state/action behavior in `src/state/DeckSessionController`.
- Added a first-pass responsive layout and visible controls for core deck workflows.
- Added the legacy two-card draw workflow to the modern draw stage for advantage/disadvantage-style checks.
- Added expandable discard inspection so the modern shell can show the full discard pile when more than eight cards are present.
- Restored perk symbol rendering in the modern perks panel using existing icon assets for tokens such as rolling, wound, push, and elements.
- Tightened mobile draw-stage layout so attack modifier cards keep their landscape ratio, avoid horizontal overflow, and display two-card draws side by side.
- Improved the mobile perks layout by switching the icon-heavy perk list to a single readable column on narrow screens.

Acceptance criteria:

- Core legacy workflows are available in the new UI.
- The UI does not depend on jQuery, CDN Material Components globals, or anime.js.
- Layout works on mobile and desktop.

### Phase 5: Browser Tests

Status: Started; core modern-shell flows are covered.

Goals:

- Add Playwright coverage for core app flows.
- Verify the app renders with real assets.

Completed so far:

- Added `@playwright/test`, `playwright.config.ts`, and `npm run test:e2e`.
- Covered class selection, perk reset, drawing, manual shuffling, scenario modifier buttons, perk toggling, and terminal-card auto-shuffle.

Acceptance criteria:

- Browser tests cover class selection, drawing, shuffling, discard inspection, modifier buttons, and perk application. Complete for the current modern shell.
- Tests run locally. CI/deployment integration remains for Phase 6.

### Phase 6: Legacy Removal And Deployment

Status: Started.

Goals:

- Remove webpack 3, Babel 6/7 legacy build pieces, `node-sass`, jQuery, old Material Components packages, and unused local package indirection.
- Decide whether generated assets are committed or built in deployment.
- Configure GitHub Pages deployment for the Vite build.

Completed so far:

- Promoted the Svelte/Vite app from `modern.html` to the primary `index.html` entrypoint.
- Archived the previous jQuery/Material legacy page as `legacy.html` for one migration step.
- Updated Vite and Playwright to build and exercise `/` as the production app route.
- Added a GitHub Actions Pages workflow that tests, builds, uploads `dist/`, and deploys the static Vite output.

Acceptance criteria:

- Dependency vulnerabilities from the old build stack are eliminated or materially reduced.
- `npm install`, `npm run build`, and deployment work on a modern Node runtime.
- Legacy bundles and obsolete source paths are removed or documented if retained.

## Current Branches

- `master`: contains Phase 1.
- `codex-phase-2-vite-shell`: active modernization branch with Phase 2 complete and early Phase 4/5 work.

## Testing Notes

- Current source validation: `npm test` passes with 34 tests.
- Modern build validation: `npm run build`.
- Modern dev server validation: `npm run dev`, then open `http://127.0.0.1:5173/`.
- Browser validation: `npm run test:e2e` passes with 5 Playwright tests.
- Legacy webpack build is no longer part of the npm scripts; the existing checked-in legacy bundle is still available through `legacy.html` during migration.
- Browser-testable rewritten code now owns `index.html`.
