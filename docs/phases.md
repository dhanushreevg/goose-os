# GOOSE OS — Phase-by-phase execution guide

> Master plan for taking GOOSE OS from the Phase 1 desktop prototype to a distributable
> system image. Each section documents one phase: objective, in/out scope, deliverables,
> task breakdown, acceptance criteria, risks, and a copy-paste **execution prompt** you
> can hand to an AI coding agent to run that phase autonomously.

Tracking: [roadmap.md](roadmap.md) · Architecture: [architecture.md](architecture.md) ·
Security: [security-model.md](security-model.md) · Branch convention: `feat/phase-N-…`.

---

## Phase 1 — Desktop UI prototype

**Status:** ✅ shipped (GOOSE OS 0.1, milestone current)
**Branch:** `feat/phase-1-desktop-prototype`

### Objective

Deliver a fully usable desktop shell that runs as a plain web application on an existing
Linux desktop — reversible, offline-first, no native install.

### In scope

- pnpm workspace scaffolding, strict TS, ESLint, tests (Vitest + Testing Library).
- Design tokens + generated `theme.css` (light / dark / high-contrast, reduced-motion).
- `packages/ui` glassmorphism primitives.
- `services/system-service` read-only localhost health bridge (`127.0.0.1:4823`) with
  demo fallback and per-subsystem degradation.
- Shell: wallpaper, top panel, dock, app launcher (search + keyboard nav),
  multi-workspace window cards (drag / resize / maximize), quick settings, notification
  center, toasts, interactive demo terminal, files / AI / Developer preview mocks.
- Settings persistence via `@goose/config` (localStorage, sanitised, no secrets).
- Docs, tests, CHANGELOG.

### Out of scope

Native integration, real filesystem, real terminals, AI providers — later phases.

### Remaining work

- Live host check on a real hardware matrix (1366×768 → 4K, HiDPI).
- Panel applet tests against real-world network / audio / battery variance.

### Acceptance criteria

1. `pnpm install && pnpm dev` runs the shell + bridge; http://localhost:5173 renders.
2. All README keyboard shortcuts work.
3. Theme, accent, reduced-motion, and settings persist across reloads.
4. Bridge failure degrades to demo data without breaking the UI.
5. `pnpm test`, `pnpm lint`, and `pnpm build` pass.

### Risks

- HiDPI / panel-resolution variance — mitigated by the hardware matrix test.

### Detailed checklist

1. **Audit rendering across the hardware matrix**
   - [ ] Set up viewport presets for 1366×768, 1920×1080, 2560×1440, 4K, and 200% HiDPI.
   - [ ] Screenshot and compare TopPanel, Dock, Launcher, WindowCard, QuickSettings at every preset.
   - [ ] Log all broken layouts, overlaps, and off-screen elements found.
   - [ ] Fix every logged issue in `apps/shell/src/components`.
2. **Harden panel applets against real-world variance**
   - [ ] Add synthetic states (disconnected, unplugged, muted, throttled) to `services/system-service`.
   - [ ] Surface each state as an explicit badge in `apps/shell/src/store.tsx`.
   - [ ] Confirm the UI never throws on missing or partial subsystem data.
3. **Keep the Phase 1 security contract**
   - [ ] Verify the bridge binds to `127.0.0.1` only.
   - [ ] Verify every endpoint is GET/read-only.
   - [ ] Verify CORS is limited to local Vite origins.
   - [ ] Grep for secrets in localStorage, git, and client bundles.
4. **Tests and quality gates**
   - [ ] Add Vitest coverage for the new applet and badge paths.
   - [ ] Run `pnpm test`, `pnpm lint`, `pnpm build` all green.
   - [ ] Update CHANGELOG.md under `[Unreleased]`.

### Execution detail (step-by-step)

**Step 1 — Rendering audit.** With `pnpm dev` running, use the browser devtools device toolbar and cycle the presets above. Focus inspection on the fixed chrome (TopPanel, Dock) as those are the highest-risk surfaces. For each size record overlaps, clipped text, and hit-target sizes (keep ≥ 24 px touch, ≥ 44 px desktop). Implement fixes with the existing `packages/ui` primitives and design tokens — do not invent arbitrary spacing; reuse `theme.css` variables.

**Step 2 — Applet hardening.** In `services/system-service`, extend the network / audio / battery collectors beyond pass/fail with the realistic states listed. Return typed values that `apps/shell/src/store.tsx` maps to badges (`connected`/`disconnected`, `charging`/`unplugged`, `muted`). Requests must never throw; every missing subsystem returns `null` per the existing degrade contract.

**Step 3 — Security review.** Confirm the bridge config (bind host, CORS allowlist) is unchanged and read-only, then run a repo-wide scan for API keys, tokens, and secret patterns.

**Step 4 — Verification.** Add tests for the badge mapping and null-hygiene paths, then run the full test/lint/build pipeline. Record results in CHANGELOG under `[Unreleased]` and report the exact commands you ran.

### Execution prompt

```
You are implementing Phase 1 of GOOSE OS (repo root). Finish the remaining work only:
1. Audit the shell rendering at 1366x768, 1920x1080, 2560x1440 and HiDPI (200%) widths;
   fix any broken or misaligned layouts in apps/shell/src/components.
2. Make network/audio/battery applets robust to realistic variance (disconnected,
   unplugged, muted) in services/system-service; surface state as badges via
   apps/shell/src/store.tsx.
3. Preserve the security model: bridge stays 127.0.0.1 + read-only + CORS-restricted;
   no secrets in localStorage or git.
4. Add Vitest tests for the new paths; run `pnpm test`, `pnpm lint`, `pnpm build` until
   green. Update CHANGELOG.md under [Unreleased].
Report what you changed and the exact commands you ran.
```

---

## Phase 2 — Native desktop integration

**Status:** 🔜 planned
**Branch:** `feat/phase-2-native-desktop-integration`

### Objective

Bridge the web shell to the real Linux desktop: launch native applications, read actual
system state via portals/DBus, and decide with evidence whether to ship the desktop via
**Tauri 2** or keep it web-first.

### In scope

- Desktop environment detection (GNOME / KDE / Wayland / X11 / sway).
- Launch native apps (`xdg-open`, `gio launch`, `spawn`) through the local bridge.
- Read real network manager / audio (PipeWire/Pulse) / power (UPower) state via DBus +
  portals, replacing `/proc`, `/sys`, `pactl` scraping where practical.
- Tauri 2 evaluation spike: Rust toolchain setup, app wrapper, tray, window controls,
  shell embedding; compare against the Vite web shell.
- GTK4 / layer-shell / wlroots compositor research notes only.
- Permission prompts for app launches per security-model.md (Ask → Confirm → audit).

### Out of scope

System image, packaging for distribution, full compositor implementation.

### Deliverables

- `services/system-service` v2 (DBus/portal-backed read endpoints + spawn endpoint).
- `docs/tauri-evaluation.md` with a build-vs-buy recommendation.
- App-launch permission flow in the shell.

### Acceptance criteria

1. The shell can launch a native app with an explicit permission prompt.
2. Network/audio/battery reflect real state (live), still degrade to demo offline.
3. Tauri spike builds and runs the shell on Linux; decision documented.
4. No unapproved command may run without confirmation (allowlist + audit log).
5. Full test/lint/build suite green.

### Risks

- Tauri may gatecore CSP/asset custom protocols; spike mitigates before Phase 7.

### Detailed checklist

1. **Desktop-environment detection**
   - [ ] Detect DE (GNOME / KDE / XFCE), session type (Wayland / X11), compositor (sway / hyprland / gnome-shell).
   - [ ] Expose the result through the health bridge payload.
2. **Permission-gated app launching**
   - [ ] Add a `launch` endpoint to `services/system-service` (mutating, so it requires confirmation).
   - [ ] Implement in order of availability: `xdg-open`, then `gio launch`, then `spawn` with cwd/gui flags.
   - [ ] Shell-side permission dialog shows app, args, cwd, and risk.
   - [ ] Audit log records every accepted launch.
3. **DBus/portal system state**
   - [ ] Network via NetworkManager DBus; audio via PipeWire/Pulse; power via UPower.
   - [ ] Keep exact `@goose/types` payload shapes and the demo-fallback contract.
4. **Tauri 2 evaluation spike**
   - [ ] Install/verify the Rust toolchain (rustup).
   - [ ] Scaffold a Tauri 2 app embedding the built shell.
   - [ ] Wire tray, window controls, and localhost/fetch permissions.
   - [ ] Write `docs/tauri-evaluation.md` with build time, binary size, memory, and a recommendation.
5. **Docs + quality gates**
   - [ ] Update `docs/architecture.md`, `docs/security-model.md`, CHANGELOG.
   - [ ] Run `pnpm test`, `pnpm lint`, `pnpm build` all green.

### Execution detail (step-by-step)

**Step 1 — Detection.** Read `XDG_CURRENT_DESKTOP`, `XDG_SESSION_TYPE`, and `WAYLAND_DISPLAY` env vars; add a `desktop` block to the health payload. Never rely on a single env var — cross-check at least two signals.

**Step 2 — Launch endpoint.** This is the first mutating endpoint, so it must sit behind the permission layer built in `apps/shell/src/components` (Ask → Confirm → audit). Pick the launch mechanism by runtime availability, fall back gracefully, and return typed errors. Keep the endpoint bound to 127.0.0.1 with a restricted CORS allowlist.

**Step 3 — System state via portals/DBus.** Use DBus bindings for NetworkManager, PipeWire/Pulse, and UPower. Map results into the existing `@goose/types` SystemInfo shape so the shell requires no changes. If a bus is absent, return that subsystem as `null`; the Phase 1 demo fallback already covers a total absence.

**Step 4 — Tauri spike.** Keep the spike in its own directory plus `docs/tauri-evaluation.md`. Measure cold build time, release binary size, idle memory with the shell loaded, and tray/window behaviour on Wayland vs X11. Finish with a written build-vs-buy recommendation that informs Phases 6–7.

**Step 5 — Documentation + gates.** Reflect the new endpoints and permission model in `architecture.md` and `security-model.md`, add a CHANGELOG entry, then run the full suite.

### Execution prompt

```
You are implementing Phase 2 of GOOSE OS. Use the existing workspace (packages decide
boundaries, all interoperability through @goose/types). Work in sequence:
1. Add desktop-environment detection and a permission-gated `launch` endpoint to
   services/system-service (127.0.0.1, read-mostly; mutations require confirmation).
2. Replace /proc | /sys | pactl scraping with DBus/portals where available, keeping the
   exact @goose/types payload and the demo-fallback contract from Phase 1.
3. Add an app-launch permission dialog in apps/shell/src/components and wire it to the
   new endpoint; ship an audit log via @goose/config.
4. Create a Tauri 2 spike in skel of the repo (docs/tauri-evaluation.md) that embeds
   the built shell, with a written build-vs-buy recommendation and benchmarks.
5. Update architecture.md and security-model.md for the new surfaces.
6. Run `pnpm test`, `pnpm lint`, `pnpm build` green; document results in CHANGELOG.
Report changed paths, the recommendation, and commands run.
```

---

## Phase 3 — Gemini / AI Center integration

**Status:** 🔜 planned
**Branch:** `feat/phase-3-gemini-integration`

### Objective

Turn the AI Center preview into a real, offline-first AI assistant with a provider
abstraction, guided setup, and permission-based project assistance.

### In scope

- AI Center app: chat, streaming, markdown, code blocks, history, model configuration.
- Provider abstraction: Gemini API, Gemini CLI, and a stubbed local-model provider.
- Claude Code-style CLI detection + guided setup; no silent installs.
- Permission-based project assistance; command execution only after security review
  (reuse Phase 2 permission flow).
- Offline behavior: desktop keeps working when provider is unavailable.

### Out of scope

Local model training, cloud infrastructure, telemetry.

### Deliverables

- `apps/shell` AI Center app replacing the preview mock.
- `packages/ai-provider` (or `services/ai-provider`) abstraction.
- Permission + audit integration for AI-suggested commands.

### Acceptance criteria

1. End-to-end chat works with at least one real provider.
2. Provider swap requires no shell changes (abstraction holds).
3. AI-proposed commands go through Ask → Confirm → audit before execution.
4. No credentials in localStorage/git; secrets via backend `.env` only.
5. Suite green; guided-setup UX tested.

### Risks

- API cost/key handling — mitigated by secrets-not-in-client rule and usage caps.

### Detailed checklist

1. **Provider abstraction (`packages/ai-provider`)**
   - [ ] Define a typed `Provider` interface (stream, history, models, config).
   - [ ] Implement providers: Gemini API, Gemini CLI, local mock.
   - [ ] Add provider + model settings UI backed by `@goose/config`.
2. **AI Center app**
   - [ ] Replace the preview mock in `apps/shell` with a real chat app.
   - [ ] Streaming responses, markdown rendering, code blocks with copy.
   - [ ] Conversation history persisted via `@goose/config`.
3. **Permission-integrated command execution**
   - [ ] AI-suggested commands render verbatim (command, cwd, files, risk).
   - [ ] Route through the Phase 2 Ask → Confirm → audit flow.
4. **Guided setup**
   - [ ] Detect the Gemini CLI; guide API-key entry without storing it in the client.
   - [ ] No silent installs.
5. **Offline behaviour + gates**
   - [ ] Missing/offline provider degrades with a clear notice; desktop unaffected.
   - [ ] `pnpm test`, `pnpm lint`, `pnpm build` green; docs + CHANGELOG updated.

### Execution detail (step-by-step)

**Step 1 — Abstraction.** Define the interface in `packages/ai-provider`; never let the shell import provider SDKs directly. The Gemini API provider reads credentials from the backend `.env` only. The CLI provider shells out to the detected `gemini` binary. The local mock returns canned streaming output so the UI is testable offline.

**Step 2 — AI Center.** Build the chat UI reusing `packages/ui`. Stream tokens as they arrive; render markdown and fenced code blocks with a copy button. Persist conversations keyed by config-safe IDs with no secret content.

**Step 3 — Command execution.** When the AI suggests a shell command, render it verbatim with target, cwd, affected files, and risk level, then reuse the Phase 2 permission dialog and audit log. Never execute silently.

**Step 4 — Guided setup.** Detect `gemini` on PATH (`which gemini`) and offer a guided API-key entry flow that writes to the backend `.env` via a local endpoint — never localStorage.

**Step 5 — Verification.** Simulate provider failure and confirm the desktop stays fully usable with a banner. Update `security-model.md` threat rows and `architecture.md`, then run the gates.

### Execution prompt

```
You are implementing Phase 3 of GOOSE OS. Build the AI Center on the existing shell.
1. Create `packages/ai-provider` with typed providers (Gemini API, Gemini CLI, local
   mock). Keep the interface stable; add a settings UI for model + provider.
2. Build the AI Center app in apps/shell (stream chat, markdown + code blocks, history
   persisted via @goose/config, no secrets in localStorage).
3. Extend the Phase 2 permission flow so AI-suggested commands render verbatim
   (command, cwd, files, risk) and require confirmation; record to audit log.
4. Add CLI detection + guided setup (never silent installs).
5. Ensure offline-first: missing provider degrades with notice, desktop unaffected.
6. Update docs (architecture, security-model, roadmap) and CHANGELOG.
7. Run `pnpm test`, `pnpm lint`, `pnpm build` green.
Report changed paths, the provider interface, and commands run.
```

---

## Phase 4 — Developer Center

**Status:** 🔜 planned
**Branch:** `feat/phase-4-developer-center`

### Objective

Deliver the developer-first workflow: project creation, git/GitHub management, Docker
tooling, and secure environment variables.

### In scope

- Project dashboard + creation wizard (templates: React/Vite, Next.js, FastAPI, Node,
  Spring Boot, Flutter, Docker).
- Git + GitHub integration (clone/init/status/commit/branch/push with permission flow).
- Integrated terminal launch and Docker tooling (images/containers/compose).
- Environment variable management: secure storage, never committed, never in client.

### Out of scope

Full IDE, CI/CD, cloud deployment.

### Deliverables

- Developer Center app replacing the preview mock.
- Backend endpoints (git/docker/env) behind the permission system.

### Acceptance criteria

1. Creating a project from each template produces a working scaffold.
2. Git operations run through permission prompts; audit log records pushes.
3. Env vars are stored backend-side only; no secret ever appears in the client bundle.
4. Docker operations are gated and read-only by default.
5. Suite green.

### Risks

- Secret leakage via git — mitigated by `.env*` ignores, secure env storage, hooks.

### Detailed checklist

1. **Template wizard + dashboard**
   - [ ] Templates: React/Vite, Next.js, FastAPI, Node, Spring Boot, Flutter, Docker.
   - [ ] Scaffold each template without overwriting existing paths.
   - [ ] Project dashboard lists, opens, and tracks projects.
2. **Git + GitHub integration**
   - [ ] init / clone / status / commit / branch / push operations.
   - [ ] All operations go through Ask → Confirm → audit.
   - [ ] Pushes recorded in the audit log.
3. **Docker tooling**
   - [ ] images / containers / compose listing (read-only by default).
   - [ ] start / stop / build gated behind permission prompts.
4. **Secure environment variables**
   - [ ] Backend-only encrypted storage; `.env*` never committed.
   - [ ] Client sees masked flags only; bundle contains no secrets.
5. **Quality gates + docs**
   - [ ] Suite green; CHANGELOG + docs updated.

### Execution detail (step-by-step)

**Step 1 — Templates.** Store templates as versioned files (e.g., `services/devcenter/templates`). Scaffolding writes into a user-approved directory root; refuse to overwrite anything without confirmation, reusing the Path-picker permission concept.

**Step 2 — Git.** Implement via the local bridge executing `git` with a restricted command allowlist. Every state-changing git call goes through the Ask-Confirm dialog; pushes are always logged with repo, branch, and a user-visible diff summary.

**Step 3 — Docker.** Query via Docker CLI/API read-only by default: `docker ps`, `images`, `compose ls`. Mutations (start/stop/build) require confirmation and are audited.

**Step 4 — Secrets.** The backend holds env vars encrypted at rest in a user-owned location; the client receives only name/existence flags with masked values. Add scripts that detect and refuse to stage `.env*` files.

**Step 5 — Verification.** Test every template end-to-end, grep the built bundle for a planted test secret to prove none leaked, run the gates, and update the docs.

### Execution prompt

```
You are implementing Phase 4 of GOOSE OS. Extend the existing services and shell.
1. Add a Developer Center app in apps/shell: project dashboard + creation wizard with
   the listed templates (scaffold locally, never overwrite without confirmation).
2. Implement backend git + Docker + env endpoints under the existing permission/audit
   layer from Phases 2-3; all git/docker actions require Ask-Confirm.
3. Build secure env-var storage server-side (encrypted at rest), exposed to the web
   shell only via masked/flag endpoints; refuse to emit secrets to the client bundle.
4. Wire an integrated terminal launcher (reuse the Phase 2 launch flow).
5. Update docs + CHANGELOG; run `pnpm test`, `pnpm lint`, `pnpm build` green.
Report changed paths, template list implemented, and commands run.
```

---

## Phase 5 — File manager and settings

**Status:** 🔜 planned
**Branch:** `feat/phase-5-file-manager`

### Objective

Replace the files preview with a real, permission-respecting filesystem browser and
harden the settings experience end-to-end.

### In scope

- Filesystem browsing that respects Linux permissions; copy/move/rename/delete with
  confirmation, hidden-file toggle, search.
- Real settings app: themes, shortcuts, privacy controls, AI configuration (consolidate
  the Quick Settings mock into a full app).
- Path-picker + permission scopes for which roots apps may read.

### Out of scope

Windows compatibility, root/system filesystem editing, cloud sync.

### Acceptance criteria

1. Browse, copy, move, rename, delete, and search work for permitted roots only.
2. Destructive operations require confirmation and are audited.
3. Settings app persists every option via @goose/config with no secret leakage.
4. Path-permission model reviewed against security-model.md.
5. Suite green.

### Risks

- Accidental destructive ops — mitigated by confirm + audit + trash-before-delete.

### Detailed checklist

1. **File manager**
   - [ ] Two-pane browse, breadcrumbs, permission-denied surfaces rendered as notices.
   - [ ] copy / move / rename / delete with trash-first behaviour.
   - [ ] Hidden-file toggle + search.
2. **Permission scopes**
   - [ ] Root/namespace grants issued via the Phase 2 permission flow.
   - [ ] Path-picker for granting a directory to an app.
3. **Settings app**
   - [ ] Themes, shortcuts, privacy controls, AI config — all persisted via `@goose/config`.
   - [ ] Consolidates the Quick Settings mock into a full app.
4. **Security review + gates**
   - [ ] Path-permission model reviewed against `security-model.md`.
   - [ ] Suite green; CHANGELOG + docs updated.

### Execution detail (step-by-step)

**Step 1 — FS layer.** Implement behind the bridge so filesystem access stays server-side. Return directory listings with typed entries; mark permission-denied paths as typed errors the UI renders as a notice, never a crash. Use `gio trash` where present before any permanent delete.

**Step 2 — Scopes.** Add a path-picker that grants a directory root through the Ask → Confirm flow; the bridge rejects any path outside granted roots. Store grants in the audit/config layer.

**Step 3 — Settings.** Build the full settings app on the existing `@goose/config` schema. Every control maps to a persisted, validated key; the sanitisation layer refuses secret-like values.

**Step 4 — Review.** Walk the path-permission and trash-first guarantees against the threat rows in `security-model.md`, update the docs, and run the gates.

### Execution prompt

```
You are implementing Phase 5 of GOOSE OS. Build on the permission/audit foundations.
1. Create a file manager app: two-pane browse, breadcrumbs, copy/move/rename/delete
   (trash-first), hidden-file toggle, search, and correct handling of permission-denied
   paths (surface, never crash).
2. Restrict roots to permission-scoped paths granted via the Phase 2 permission flow.
3. Build the Settings app replacing the mock: themes, shortcuts, privacy, AI config,
   all persisted through @goose/config with sanitisation.
4. Update security-model.md and roadmap.md; add to CHANGELOG.
5. Run `pnpm test`, `pnpm lint`, `pnpm build` green.
Report changed paths and commands run.
```

---

## Phase 6 — Application ecosystem

**Status:** 🔜 planned
**Branch:** `feat/phase-6-application-ecosystem`

### Objective

Evaluate and integrate the Linux application ecosystem so users can install, update, and
launch third-party applications from within GOOSE OS.

### In scope

- Evaluate Flatpak / AppImage / Snap; recommend a primary format (likely Flatpak).
- Management UI: install / update / remove / launch apps with permission prompts.
- Wine / Proton / Distrobox compatibility diagnostics (optional, documented).

### Out of scope

Repackaging third-party apps, proprietary app stores, Windows compatibility guarantee.

### Acceptance criteria

1. Format evaluation documented with a recommendation.
2. Install/update/remove/launch work end-to-end from the management UI, permission-gated.
3. Flatpak sandboxing is respected (no privilege escalation).
4. Suite green.

### Risks

- Sandbox escape / supply chain — mitigated by verified installs + signature checks.

### Detailed checklist

1. **Format evaluation**
   - [ ] Compare Flatpak / AppImage / Snap: sandboxing, OCI, updates, maintainability, Wayland/portal support.
   - [ ] Write the recommendation into `docs/app-ecosystem-evaluation.md`.
2. **App Center**
   - [ ] Search, install, update, remove, launch UI.
   - [ ] Backed by new read/write endpoints under Ask → Confirm → audit.
3. **Sandbox safety**
   - [ ] No privilege-escalation calls; verified installs + signature/checksum checks.
   - [ ] Surface app provenance in the UI.
4. **Compatibility diagnostics (optional)**
   - [ ] Wine / Proton / Distrobox detection, documented and gated.
5. **Gates + docs**
   - [ ] Suite green; CHANGELOG updated.

### Execution detail (step-by-step)

**Step 1 — Evaluate.** Produce a scorecard: sandbox strength, update mechanism, disk footprint, Wayland integration, CLI/SDK ergonomics. Publish the recommended primary format and a stated secondary for legacy apps.

**Step 2 — App Center.** Add repository search for the chosen format, then install / update / remove / launch through the bridge endpoints. Every mutation is Ask → Confirm; the audit log records app id, action, and origin.

**Step 3 — Safety.** Enable signature/checksum verification of fetched artifacts, never run with elevated privileges, and label provenance in the UI.

**Step 4 — Diagnostics.** Detect `wine`, Proton (Steam/Proton, Heroic), and `distrobox`; present compatibility notes without actions, documented as a gated feature.

**Step 5 — Gates + docs.** Run the full suite and update CHANGELOG + docs.

### Execution prompt

```
You are implementing Phase 6 of GOOSE OS. Research then build:
1. Write docs/app-ecosystem-evaluation.md comparing Flatpak, AppImage, and Snap
   (sandboxing, OCI, updates, maintainability) with a recommendation.
2. Implement an App Center in apps/shell: search + install/update/remove/launch buttons
   backed by new read/write endpoints, all under the Ask-Confirm audit flow.
3. Respect sandboxing: never calls that escalate privileges; surface app provenance.
4. Add optional Wine/Proton/Distrobox compatibility diagnostics (documented, gated).
5. Update docs + CHANGELOG; run `pnpm test`, `pnpm lint`, `pnpm build` green.
Report the format recommendation, changed paths, and commands run.
```

---

## Phase 7 — System image

**Status:** 🔜 planned
**Branch:** `feat/phase-7-system-image`

### Objective

Turn the finished GOOSE OS experience into a reproducible, distributable Linux system
image on a supported base, while leaving the legacy ISO untouched.

### In scope

- Select a Linux base (Ubuntu LTS / Debian / Fedora) after an evidence-based evaluation.
- Reproducible build pipeline (KIWI-style, debian-live, or image-builder tooling).
- GOOSE OS branding, bootloader config, packaged shell, VM + hardware testing.
- Installation docs, verification (checksums), release process.

### Out of scope

Modifying or reusing the legacy ISO, third-party branding, cloud images.

### Acceptance criteria

1. Building the image is one reproducible command (documented pinning).
2. Image boots in QEMU and on reference hardware with the GOOSE shell as the desktop.
3. OTA/update path defined (even if simple).
4. Install + restore docs; checksums published.
5. Legacy ISO remains byte-identical in legacy/.

### Risks

- Driver/HW variance — mitigated by a hardware test matrix; base-image LTS pinning.

### Detailed checklist

1. **Base OS evaluation**
   - [ ] Compare Ubuntu LTS / Debian / Fedora: OTA tooling, drivers, reproducibility, support lifecycle.
   - [ ] Document the selection in `docs/base-os-evaluation.md`.
2. **Reproducible build**
   - [ ] Single pinned build command producing a bootable image/ISO.
   - [ ] Shell (Phases 1–6) packaged as the default session.
3. **Boot + hardware testing**
   - [ ] QEMU boot test passes.
   - [ ] Reference-hardware matrix documented.
4. **Update + release path**
   - [ ] Update strategy defined; install docs written; checksums published.
5. **Legacy ISO integrity**
   - [ ] `legacy/demo-goose.iso` byte-identical and untouched.
6. **Gates + docs**
   - [ ] CHANGELOG + roadmap updated.

### Execution detail (step-by-step)

**Step 1 — Base.** Build a scorecard for Ubuntu LTS, Debian, and Fedora across forward-update/OTA tooling, driver and firmware support, reproducibility (pinned sources), and LTS lifecycle. Choose one and justify the choice.

**Step 2 — Build pipeline.** Use a containerized, pinned build (debian-live or image-builder tooling) configured in-repo under `iso/`. The output must install the packaged shell as the session and configure bootloader and GOOSE branding. Document every pinned version.

**Step 3 — Verification.** Boot under QEMU first, then run a reference-hardware matrix (VM plus at least two physical configurations) and record the results.

**Step 4 — Release.** Define the update mechanism and a checksummed release process; add installation and restore instructions.

**Step 5 — Legacy integrity.** Record the ISO SHA-256 before and after the pipeline and assert equality against `legacy/demo-goose.iso`.

**Step 6 — Close out.** Update CHANGELOG and roadmap to mark the release path complete; run the final gates.

### Execution prompt

```
You are implementing Phase 7 of GOOSE OS. Build the distribution path:
1. Write docs/base-os-evaluation.md comparing Ubuntu LTS, Debian, and Fedora against
   OTA tooling, driver support, and reproducibility; pick one and justify it.
2. Stand up a reproducible image build (single pinned command) producing an ISO/bootable
   image that bundles the phase 1-6 shell as the default session.
3. Boot-test under QEMU and document a reference-hardware matrix.
4. Define the update strategy and release/checksum process; add installation docs.
5. Verify the legacy ISO in legacy/ is byte-identical and untouched.
6. Update CHANGELOG and roadmap to mark the release path complete.
Report the chosen base, the build command, test matrix, and changed paths.
```

---

## Milestones

| Milestone | Scope | Branch |
| --- | --- | --- |
| GOOSE OS 0.1 | Desktop prototype (current) | `feat/phase-1-desktop-prototype` |
| GOOSE OS 0.2 | AI integration (Phases 2-3) | `feat/phase-2-…`, `feat/phase-3-…` |
| GOOSE OS 0.3 | Developer Center (Phase 4) | `feat/phase-4-developer-center` |
| GOOSE OS 0.4 | System integration (Phases 5-6) | `feat/phase-5-…`, `feat/phase-6-…` |
| GOOSE OS 1.0 | Stable release (Phase 7) | `feat/phase-7-system-image` |

## Phase handoff checklist

- [ ] Phase execution prompt run on its branch.
- [ ] Acceptance criteria verified (tests, lint, build).
- [ ] docs/architecture.md, docs/roadmap.md, docs/security-model.md, CHANGELOG updated.
- [ ] Branch merged to `main` per the release process; next branch rebased.