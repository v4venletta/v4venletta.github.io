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
- Current validation: `npm test` passes with 21 tests.

Known caveat:

- Tests currently use Node's built-in test runner. Move to Vitest when the modern package stack is introduced.

### Phase 2: Modern Browser Shell

Status: In progress.

Goals:

- Add Vite + Svelte + TypeScript without relying on legacy webpack or `node-sass`.
- Create a browser-testable app shell.
- Wire the first UI slice to `GameSession`.
- Keep the legacy app available until the new shell can cover core flows.

Completed so far:

- Added a `modern.html` Vite entrypoint beside the legacy `index.html`.
- Added a Svelte + TypeScript app shell for class selection, drawing, shuffling, scenario modifiers, discard inspection, stats, and first-pass perk application.
- Added `src/browser-data.ts` to load existing JSON-shaped data files in the browser without changing legacy consumers.
- Added `src/state/DeckSessionController` as a testable UI-facing state/action wrapper around `GameSession`.
- Split the modern shell into focused Svelte components: class picker, draw stage, stats/discard panel, and perks panel.
- Added stable `data-testid` hooks for upcoming browser tests.
- Added Node-runner state tests for the modern shell action surface.
- Removed the legacy webpack/Babel/node-sass dependency stack from `package.json`; the legacy checked-in bundle remains available through `index.html`.
- Regenerated `package-lock.json` for the modern Vite/Svelte toolchain.
- Added `node_modules/` and `dist/` to `.gitignore`.

Current validation: `npm install`, `npm test`, `npm run build`, and `npm run dev` pass on modern Node.

Known caveat:

- `node_modules/` was previously tracked in git. The cleanup removes the tracked dependency tree from the working copy; the eventual commit should intentionally stop tracking dependency folders.

Acceptance criteria:

- `npm run dev` starts a Vite dev server.
- `npm run build` produces a static build.
- A user can open the app in a browser and select a class, draw a card, shuffle, and see deck stats through the new UI.
- Existing domain tests still pass.

### Phase 3: Data Normalization

Status: Not started.

Goals:

- Convert JSON-shaped `.js` data files into real `.json` or typed TypeScript modules.
- Add validation for card, perk, class, and image-path data.
- Remove ad hoc file-path and naming knowledge from UI code.

Acceptance criteria:

- Domain/session initialization uses typed data imports.
- Tests validate data shape and key cross-references.
- Legacy data consumers are either migrated or explicitly preserved.

### Phase 4: Component Rewrite

Status: Started.

Goals:

- Replace DOM mutation in `app.js` with Svelte components.
- Build class selector, deck view, discard pile, modifier controls, stats, and perks dialog.
- Move inline styles into component or global styles.

Completed so far:

- Added first-pass Svelte components for the class selector, draw stage, stats/discard panel, and perks panel.
- Kept app coordination in `App.svelte` and state/action behavior in `src/state/DeckSessionController`.

Acceptance criteria:

- Core legacy workflows are available in the new UI.
- The UI does not depend on jQuery, CDN Material Components globals, or anime.js.
- Layout works on mobile and desktop.

### Phase 5: Browser Tests

Status: Not started.

Goals:

- Add Playwright coverage for core app flows.
- Verify the app renders with real assets.

Acceptance criteria:

- Browser tests cover class selection, drawing, shuffling, discard inspection, modifier buttons, and perk application.
- Tests run locally and in the intended CI path.

### Phase 6: Legacy Removal And Deployment

Status: Not started.

Goals:

- Remove webpack 3, Babel 6/7 legacy build pieces, `node-sass`, jQuery, old Material Components packages, and unused local package indirection.
- Decide whether generated assets are committed or built in deployment.
- Configure GitHub Pages deployment for the Vite build.

Acceptance criteria:

- Dependency vulnerabilities from the old build stack are eliminated or materially reduced.
- `npm install`, `npm run build`, and deployment work on a modern Node runtime.
- Legacy bundles and obsolete source paths are removed or documented if retained.

## Current Branches

- `master`: contains Phase 1.
- `codex-phase-2-vite-shell`: active Phase 2 branch.

## Testing Notes

- Current source validation: `npm test`.
- Modern build validation: `npm run build`.
- Modern dev server validation: `npm run dev`, then open `http://127.0.0.1:5173/modern.html`.
- Legacy webpack build is no longer part of the npm scripts; the existing checked-in legacy bundle is still available through `index.html` during migration.
- Browser-testable rewritten code exists under `modern.html`.
