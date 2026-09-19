# GOOSE OS

**AI-native developer operating system** — an experimental open-source project by **Team GOOSE**.

> Status: **experimental prototype (0.1.0)** · Phase 1 — desktop UI
>
> GOOSE OS is an independent project. It is not a Google product, is not affiliated with
> the ChromeOS or Android projects, and does not ship or endorse any proprietary Google
> branding as its own identity.

---

## What GOOSE OS is

A modern Linux-based developer desktop experience that combines:

- **Linux freedom and flexibility**
- **ChromeOS-inspired simplicity** (not a copy of its interface)
- **A glassmorphism design system** designed in-house
- **Optionally integrated AI assistance** (Gemini provider, later phases)
- **Developer-first workflows** (terminal, projects, git, containers)
- **Offline-first operation** — the desktop stays fully usable without any network or AI
- **Respectful, unobtrusive privacy** — no hidden telemetry, no silent uploads

## What GOOSE OS is not

- It is **not** a completed operating system.
- It is **not** yet distributable as an OS image.
- It is **not** an official Google/ChromeOS product.
- It does **not** fully run Windows applications (compatibility is a long-term, optional goal).
- The bundled legacy `demo-goose.iso` is **not** a modern GOOSE OS build — see
  [the legacy ISO analysis](docs/legacy-iso-analysis.md).

## Current status (0.1.0)

Phase 1 ships a **desktop prototype that runs as a normal web application** on an existing
Linux desktop. It does not replace your desktop environment and is fully reversible.

Implemented in the prototype:

| Area | Status |
| --- | --- |
| Desktop shell (wallpaper, top panel, dock) | ✅ prototype |
| Application launcher (search, keyboard nav) | ✅ prototype |
| Multiple workspaces + window cards (drag/resize) | ✅ prototype |
| Quick settings (theme, toggles, sliders) | ✅ prototype |
| Notification center + toasts | ✅ prototype |
| Light / dark / high-contrast themes | ✅ prototype |
| Reduced-motion support (OS + manual) | ✅ prototype |
| Settings persistence (`localStorage`) | ✅ prototype |
| Terminal app (interactive demo) | ✅ prototype |
| System-service bridge (live host info) | ✅ prototype |
| Files / AI Center / Developer Center apps | 🧪 preview mocks |
| Gemini & AI Center (real provider) | 🔜 Phase 3 |
| Native Wayland/GTK shell, packaging, system image | 🔜 later phases |

## Running the prototype

Requirements: Node.js ≥ 20, pnpm ≥ 9.

```bash
pnpm install        # install workspace dependencies
pnpm dev            # starts the system-service bridge + the shell (Vite)
```

Open http://localhost:5173. The shell starts in **demo mode** and switches to **live**
when the `@goose/system-service` bridge reports real host data.

Keyboard shortcuts:

| Shortcut | Action |
| --- | --- |
| `Super+A` / `Super+Space` | Open launcher |
| `Alt+1` … `Alt+4` | Switch workspace |
| `Alt+Left` / `Alt+Right` | Previous / next workspace |
| `Super+D` | Quick settings |
| `Super+N` | Notifications |
| `Esc` | Close overlay |

Production preview: `pnpm build && pnpm preview`.

## Repository layout

```
apps/shell              → desktop prototype (React + Vite + Tailwind)
services/system-service → read-only localhost bridge for host system info
packages/types          → shared domain types
packages/config         → typed settings persistence
packages/shared-utils   → dependency-free helpers (incl. WCAG contrast utilities)
packages/design-tokens  → GOOSE design tokens + generated theme.css
packages/ui             → reusable glassmorphism primitives
legacy/                 → notes about the legacy ISO artifact
iso/                    → notes about ISO packaging (future)
docs/                   → architecture, roadmap, design system, setup
```

## Documentation

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Design system](docs/design-system.md)
- [Development setup](docs/development-setup.md)
- [Security model](docs/security-model.md)
- [Legacy ISO analysis](docs/legacy-iso-analysis.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). All contributions must follow the
[Code of Conduct](CODE_OF_CONDUCT.md). Security reports go to [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © Team GOOSE.

Third-party components shipped with this repository (including the legacy ISO) remain
subject to their own licenses — see [docs/legacy-iso-analysis.md](docs/legacy-iso-analysis.md).