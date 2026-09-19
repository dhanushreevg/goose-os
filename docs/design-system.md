# GOOSE OS design system

A restrained, accessible, glassmorphism-based design language. It is an **original**
design — it does not reproduce any commercial operating system's interface or branding.

## Principles

1. **Quiet contrast.** Soft surfaces, clear hierarchy, minimal visual noise.
2. **Glass with purpose.** Transparency and blur support hierarchy; they never degrade
   readability or performance.
3. **Accessible by default.** Text pairs meet WCAG AA (≥ 4.5:1) in applied palettes.
4. **Respect motion.** Every animation is purposeful and honours reduced-motion.
5. **Fallback always.** Systems without backdrop-filter get solid, high-contrast surfaces.

## Colour

The brand accent is **GOOSE Orange**. Functional accents (blue / green / red / yellow)
are used only to communicate state.

Single source of truth: `packages/design-tokens/src/palette.json` → generated
`packages/design-tokens/theme.css`. Palettes: `light`, `dark`, plus a
`data-high-contrast` override (solid surfaces, stronger borders, no blur).

Core pairs are enforced by an automated test
(`packages/design-tokens/src/index.test.ts`) that checks WCAG AA contrast for
foreground / muted / primary-contrast against their backgrounds in both themes.

## Glass rules

- Surfaces use `var(--goose-surface)` with `blur(var(--goose-blur))` and a visible
  `1px` border (`var(--goose-border)`) so edges read on any background.
- `.goose-glass` falls back to `var(--goose-surface-solid)` when `backdrop-filter`
  is unsupported.
- High-contrast mode pins surfaces solid and disables blur entirely.

## Typography

- **UI:** system font stack (`--goose-font-sans`) — fast, offline-safe, readable.
- **Code/status:** developer monospace stack (`--goose-font-mono`, JetBrains Mono /
  Fira Code / etc. when installed, with system fallbacks).
- Scale: compact 0.875rem UI, 1rem dialogs, large display sizes reserved for the
  wallpaper clock.

## Motion

- Durations: 120 / 200 / 300 ms, easing `cubic-bezier(0.2, 0, 0, 1)`.
- Purposeful transitions only: opens/closes, focus changes, panel reveals, toasts,
  workspace switches.
- `@media (prefers-reduced-motion: reduce)` and `html[data-reduced-motion='true']`
  collapse animation/transition durations to ~0.
- No looping or decorative idle animations.

## Spacing & radius

- Consistent corner radii from tokens: `sm 0.5rem · md 0.75rem · lg 1rem · xl 1.5rem`,
  full for chips/dots/switches.
- Spacious, content-first layouts; touch input is not assumed, keyboard + pointer are.

## Components

Reusable primitives live in `packages/ui` (Glass, Button, Switch, Slider,
SegmentedControl, Icon) and own their styling via `packages/ui/styles.css`, which reads
the design tokens. App-specific composition uses Tailwind utilities in `apps/shell`.

## Contributing UI

- Use tokens; do not hard-code colors, radii, or durations.
- Keep contrast AA; if a new pair is added, extend the token contrast test.
- Verify both themes, high-contrast, and reduced-motion before submitting.