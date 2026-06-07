# Gothic 1 Remake - Lockpicking Solver

A browser-based tool for the lockpicking puzzles in **Gothic 1 Remake**. Enter your current lock setup and get the shortest step-by-step solution.

**Live app:** https://matriz88.github.io/gothic-remake-lockpicking-solver/

## What it does

- Accepts 3–7 locks with their current pin positions (1–7, centre is 4)
- Lets you define how locks affect each other when moved
- Finds the **shortest** valid move sequence via breadth-first search
- Shows each step with an optional visual pin track so you can follow along in-game
- Lets you mark steps as done and group repeated moves for easier reading
- Share configurations via copy code, copy link, or import code (including from URL)

For usage details, physics, sharing, UI behaviour, and the solver algorithm, see [docs/how-it-works.md](docs/how-it-works.md).

## Tech stack

- [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4 for styling
- [Vite](https://vite.dev/) for dev server and production build
- [Vitest](https://vitest.dev/) for unit tests
- Deployed to GitHub Pages from the `dist/` output

## Development

**Prerequisites:** Node.js 24 (as used in CI) and Yarn 4. Enable Corepack if needed:

```bash
corepack enable
```

```bash
yarn install
yarn dev          # local dev server
yarn typecheck    # TypeScript
yarn lint:check   # eslint + prettier
yarn lint:fix     # auto-fix lint and format
yarn test         # vitest (watch mode)
yarn test:run     # vitest (single run, used in CI)
yarn build        # production build → dist/
yarn preview      # serve the production build locally
```

The production build outputs to `dist/` and is deployed to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. CI runs `typecheck`, `lint:check`, and `test:run` before each deploy.

## Project layout

```
src/
  App.tsx              # main app state and wiring
  components/          # UI (selectors, table, solution panel, share bar, import dialog)
  lib/
    solver.ts          # BFS solver
    share.ts           # encode/decode share codes
    solution.ts        # step display helpers
    defaults.ts        # default pin positions and effects
    clipboard.ts       # copy-to-clipboard helper
  types.ts             # shared TypeScript types
public/                # static assets (images, robots.txt, sitemap)
docs/how-it-works.md   # detailed usage and algorithm reference
```
