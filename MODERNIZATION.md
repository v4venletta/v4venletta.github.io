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

Status: Next.

Goals:

- Add Vite + Svelte + TypeScript without relying on legacy webpack or `node-sass`.
- Create a browser-testable app shell.
- Wire the first UI slice to `GameSession`.
- Keep the legacy app available until the new shell can cover core flows.

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

Status: Not started.

Goals:

- Replace DOM mutation in `app.js` with Svelte components.
- Build class selector, deck view, discard pile, modifier controls, stats, and perks dialog.
- Move inline styles into component or global styles.

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

- Current domain validation: `npm test`.
- Legacy webpack build is blocked on modern Node by `node-sass@4.12.0`.
- Browser-testable rewritten code begins in Phase 2 after the Vite/Svelte shell is introduced.
