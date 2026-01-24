# Repository Guidelines

## Project Structure & Module Organization
- `index.html` bootstraps the Vite app.
- `src/main.js` mounts the Vue app; `src/App.vue` is the root view.
- `src/components/` holds UI building blocks like tiles and grids.
- `src/services/` contains API helpers (e.g., `fetchJsonp`).
- `src/utils/` houses data transforms (normalization, sorting).
- `src/tests/` contains Vitest unit tests named `*.test.js`.
- `src/style.css` provides global styling.

## Build, Test, and Development Commands
- `npm run dev`: start the local Vite dev server.
- `npm run build`: build the production bundle into `dist/`.
- `npm run preview`: serve the production build locally.
- `npm test`: run the Vitest suite once.
- `npm run test:watch`: run tests in watch mode.
- `npm run test:coverage`: generate coverage with V8.
- `npm run deploy`: build and publish `dist/` to `gh-pages`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces in Vue templates, JS, and CSS.
- JavaScript uses single quotes and semicolons; follow existing patterns.
- Vue uses `<script setup>`; prefer composables and small components.
- File names are `PascalCase.vue` for components and `camelCase.js` for utilities.

## Testing Guidelines
- Frameworks: Vitest + `@vue/test-utils` with `jsdom`.
- Tests live in `src/tests/` and mirror feature names (e.g., `app.test.js`).
- Keep coverage high; this project has aimed for 100% in recent work.
- Run `npm test` for quick checks and `npm run test:coverage` before PRs.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits: `feat:`, `docs:`, `refactor:`, `build:`.
- Keep commits focused; avoid mixing unrelated changes.
- PRs should include a clear description, testing notes, and screenshots/GIFs for UI changes.

## Configuration & Deployment Notes
- Set `VITE_DATA_URL` to point at the JSONP backend endpoint.
- Set `VITE_BASE="/repo-name/"` when deploying to GitHub Pages.
