# Development setup

## Prerequisites

- **Node.js ≥ 20** (`.nvmrc` pins 20)
- **pnpm ≥ 9** (pnpm 10 tested)

Rust/Tauri are **not** required for Phase 1. The prototype is a standard web app plus
a small Node bridge.

## Install

```bash
pnpm install
```

## Daily commands

```bash
pnpm dev          # system-service bridge + Vite shell (concurrently)
pnpm typecheck    # tsc --noEmit across all workspaces
pnpm lint         # ESLint (flat config at repo root)
pnpm test         # vitest across all workspaces
pnpm build        # production build of the shell
pnpm preview      # serve the production build
```

Work on one package:

```bash
pnpm --filter @goose/shell dev       # shell only (Vite on :5173)
pnpm --filter @goose/system-service dev   # bridge only (:4823)
pnpm --filter @goose/design-tokens generate  # regenerate theme.css from palette.json
```

## How the pieces talk in dev

`services/system-service` binds to `127.0.0.1:4823`. The shell's Vite dev server
proxies `/api/*` to it, so the browser sees same-origin requests. If the bridge is not
running, the shell uses bundled demo data and shows a **Demo/Offline** badge in quick
settings — start `pnpm dev` (or just the system-service) for live data.

Set `GOOSE_SERVICE_DEMO=1` to force the bridge to serve demo data only.

## Environment variables

Copy `.env.example` to `.env` for local overrides. Never commit `.env` files with
real values (`.gitignore` covers them; `!.env.example` is tracked).

## Design tokens

- Edit `packages/design-tokens/src/palette.json`.
- Run `pnpm --filter @goose/design-tokens generate` → rewrites `theme.css`.
- The contrast test in the same package guards WCAG AA pairs.

## Tests

- Reducers and helpers: plain `vitest` (node environment).
- UI primitives: `// @vitest-environment jsdom` + `@testing-library/react`.
- Add tests alongside the code; `pnpm test` must stay green.

## Common issues

| Symptom | Fix |
| --- | --- |
| Vite shows demo data always | start the bridge (`@goose/system-service`) |
| Settings resets | only `localStorage`; cleared on browser data wipe by design |
| Tailwind classes missing in `@goose/ui` | ui is self-styled (`styles.css`); report if a primitive looks unstyled |
| `pnpm lint` fails | ESLint flat config lives at the repo root |