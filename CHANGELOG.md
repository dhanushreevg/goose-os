# Changelog

All notable changes to GOOSE OS are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and this project adheres to
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] — 2026-09-18 — Desktop prototype

**Added**

- Repo scaffolding: pnpm workspaces, strict TypeScript config, ESLint flat config,
  `.env.example`, `.nvmrc`.
- `packages/types` — shared domain types (apps, windows, notifications, system info,
  settings).
- `packages/design-tokens` — GOOSE palette (light/dark/high-contrast), design tokens,
  generated `theme.css`, reduced-motion handling.
- `packages/ui` — glassmorphism primitives: Glass, Button, Switch, Slider,
  SegmentedControl, Icon.
- `services/system-service` — read-only localhost health bridge with demo fallback.
- `apps/shell` — desktop prototype: wallpaper, top panel, dock, launcher,
  multi-workspace window cards (drag + resize), quick settings, notification center,
  toasts, interactive demo terminal, files/settings mocks, AI/Developer previews.
- Documentation: README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, CHANGELOG, LICENSE,
  docs (architecture, roadmap, design-system, development-setup, security-model,
  legacy-iso-analysis), legacy/ and iso/ notes.

**Notes**

- The bundled legacy `demo-goose.iso` (Chrome OS Linux / openSUSE 11.4 based, 2011) is
  preserved as an archival artifact and is **not** a GOOSE OS build.