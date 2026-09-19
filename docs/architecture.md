# Architecture

This document describes the GOOSE OS architecture at each phase. Phase 1 ships a
**web desktop prototype** that runs on an existing Linux desktop; later phases move
towards a native shell and a distributable system image.

```
┌────────────────────────────────────────────────────────────────┐
│ apps/shell  (React + Vite + Tailwind)                          │
│                                                                │
│  TopPanel · Dock · Launcher · Workspaces · Window cards        │
│  QuickSettings · NotificationCenter · AppBody (apps)           │
│                                                                │
│  store.ts  — reducer + context (windows, workspaces, notif.)   │
│  useSettings · useSystemHealth · useClock · useKeyboard        │
└───────────▲───────────────────────────▲────────────────────────┘
            │ settings(bytes)           │ fetch /api/health
            │                           │ (Vite dev proxy → localhost)
┌───────────┴─────────────┐   ┌─────────┴────────────────────────┐
│ packages/config         │   │ services/system-service (Node)   │
│ localStorage sanitised  │   │ 127.0.0.1:4823 · read-only        │
│ (no secrets, ever)      │   │ os · /proc · /sys · pactl         │
└────────────▲────────────┘   └─────────▲────────────────────────┘
             │                          │ degrades to demo payload
       ┌─────┴─────┐   ┌────────┴───────┐   ┌──────────────────┐
       │ types     │   │ shared-utils   │   │ design-tokens    │
       │ ui        │   │ config         │   │ (theme.css)      │
       └───────────┘   └────────────────┘   └──────────────────┘
                    packages/ (pure, reusable)
```

## Layering rules

- **Apps** (`apps/*`) own user-facing behaviour and UI state.
- **Services** (`services/*`) own host interaction. They are read-only in Phase 1.
- **Packages** (`packages/*`) are pure and reusable: types, tokens, UI primitives,
  settings, utilities. Packages never depend on apps or services.
- A future native backend (Tauri/GTK/Wayland) can replace the HTTP bridge without
  changing the shell, because all boundaries cross `@goose/types`.

## State management

The shell uses a single reducer (`apps/shell/src/store.ts`) for desktop state:
windows, workspaces, notifications, overlay. Settings live in `useSettings`
(persisted via `@goose/config`). System health is polled in `useSystemHealth`
(`live → demo → offline` fallback).

## Data flow for system status

1. `useSystemHealth` polls `/api/health` every 3 s.
2. `system-service` collects independent subsystems (`system`, `network`, `battery`,
   `audio`); each failing subsystem degrades to `null`, the request never throws.
3. If the request fails entirely, the shell keeps the last known payload and marks the
   source `offline`; with no prior payload it uses the bundled demo data.
4. The UI always renders something. Status badges make the data source explicit.

## Themes

Design tokens are defined once in `packages/design-tokens/src/palette.json` and turned
into `theme.css` by a generator script (single source of truth). `data-theme`
(`light`/`dark`), `data-high-contrast` and `data-reduced-motion` attributes on
`<html>` drive the applied styles, including WCAG-compliant fallbacks.

## Security boundaries (Phase 1)

- The bridge binds to `127.0.0.1` only and is read-only.
- CORS is limited to local Vite (dev/preview) origins.
- No secrets in `localStorage`, git, or client bundles.
- Destructive/privileged operations are not yet implemented; when added, they must go
  through explicit permission prompts (§9.4 and security-model).

## Roadmap mapping

- **Phase 1 — this shell** (web, reversible)
- Phase 2 — native desktop integration (launch apps, portals, system status) — *evaluate Tauri/GTK/Wayland*
- Phase 3 — Gemini + AI Center (provider abstraction, offline-first)
- Phase 4 — Developer Center (projects, git, docker, templates)
- Phase 5 — File manager + settings hardening
- Phase 6 — Application ecosystem (Flatpak/AppImage/Wine evaluation)
- Phase 7 — Reproducible system image on a supported Linux base

See [roadmap.md](roadmap.md) for details.