# Roadmap

> Current milestone: **GOOSE OS 0.1 — Desktop prototype** (in progress)

Progress is tracked against GitHub milestones. Feature claims in this document are
**planned** unless marked as shipped in [CHANGELOG](../CHANGELOG.md) / README.

## Phase 0 — Repository audit ✅

- Inspected repository, Git history, Git LFS, legacy ISO, toolchain.
- Documented findings in [legacy-iso-analysis.md](legacy-iso-analysis.md).

## Phase 1 — Desktop UI prototype (current)

- [x] Scaffolding: pnpm workspaces, strict TS, ESLint, tokens package
- [x] Design tokens + theme generation (light/dark/high-contrast)
- [x] `packages/ui` primitives (glass, buttons, switches, sliders, icons)
- [x] System-service bridge (localhost, read-only, demo fallback)
- [x] Shell: top panel, dock, launcher, workspaces, window cards
- [x] Quick settings, notification center, toasts
- [x] Interactive demo terminal, files/settings mocks, preview mocks
- [x] Tests, docs, CHANGELOG
- [ ] Live host check on real hardware matrix (1366×768 → 4K, HiDPI)
- [ ] Panel applet tests (network/audio/battery real-world variance)

## Phase 2 — Native desktop integration

- Launch native applications; detect the desktop environment.
- Read real network manager / audio / power state via portals + DBus.
- Evaluate **Tauri 2** (requires installing the Rust toolchain) for packaged desktop
  distribution vs. keeping the web shell.
- Evaluate GTK4 / layer-shell / wlroots-based compositor experiments (research only).

## Phase 3 — Gemini integration

- AI Center app: chat, streaming, markdown, code blocks, history, model config.
- Provider abstraction (`Gemini API`, `Gemini CLI`, future local models).
- CLI detection + guided setup; no silent installs.
- Permission-based project assistance; command execution only after security review.

## Phase 4 — Developer Center

- Project dashboard + creation wizard (templates: React/Vite, Next.js, FastAPI,
  Node, Spring Boot, Flutter, Docker).
- Git + GitHub integration, integrated terminal launch, Docker tooling.
- Environment variable management (secure storage, never committed).

## Phase 5 — File manager and settings

- Real filesystem browsing (respecting Linux permissions), copy/move/rename/delete
  with confirmation, hidden files, search.
- Settings: themes, shortcuts, privacy controls, AI configuration.

## Phase 6 — Application ecosystem

- Evaluate Flatpak / AppImage / Snap; build a management UI on top of them.
- Wine/Proton/Distrobox compatibility diagnostics (optional, documented).

## Phase 7 — System image

- Select a Linux base (Ubuntu LTS / Debian / Fedora) after evaluation.
- Reproducible build (KIWI-style pipelines or debian-live/image-builder tooling).
- GOOSE OS branding, packaging, VM + hardware testing, installation docs.
- The legacy ISO stays untouched in `legacy/`.

## Milestones

| Milestone | Scope |
| --- | --- |
| GOOSE OS 0.1 | Desktop prototype (current) |
| GOOSE OS 0.2 | AI integration |
| GOOSE OS 0.3 | Developer Center |
| GOOSE OS 0.4 | System integration |
| GOOSE OS 1.0 | Future stable release |