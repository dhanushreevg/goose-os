import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const palette = JSON.parse(
  await readFile(path.join(ROOT, 'src', 'palette.json'), 'utf8'),
);

const toCssVar = (key) => `--goose-${key}`;

function sharedCss(shared) {
  return [
    `${toCssVar('blur')}: ${shared.blur};`,
    `${toCssVar('radius-sm')}: ${shared.radiusSm};`,
    `${toCssVar('radius')}: ${shared.radius};`,
    `${toCssVar('radius-lg')}: ${shared.radiusLg};`,
    `${toCssVar('radius-xl')}: ${shared.radiusXl};`,
    `${toCssVar('radius-full')}: ${shared.radiusFull};`,
    `${toCssVar('shadow-sm')}: ${shared.shadowSm};`,
    `${toCssVar('shadow')}: ${shared.shadow};`,
    `${toCssVar('shadow-lg')}: ${shared.shadowLg};`,
    `${toCssVar('font-sans')}: ${shared.fontSans};`,
    `${toCssVar('font-mono')}: ${shared.fontMono};`,
    `${toCssVar('duration-fast')}: ${shared.durationFast};`,
    `${toCssVar('duration')}: ${shared.duration};`,
    `${toCssVar('duration-slow')}: ${shared.durationSlow};`,
    `${toCssVar('ease')}: ${shared.ease};`,
  ];
}

function themeCss(theme) {
  return [
    `${toCssVar('bg')}: ${theme.bg};`,
    `${toCssVar('surface')}: ${theme.surface};`,
    `${toCssVar('surface-solid')}: ${theme.surfaceSolid};`,
    `${toCssVar('border')}: ${theme.border};`,
    `${toCssVar('border-strong')}: ${theme.borderStrong};`,
    `${toCssVar('fg')}: ${theme.fg};`,
    `${toCssVar('fg-muted')}: ${theme.fgMuted};`,
    `${toCssVar('primary')}: ${theme.primary};`,
    `${toCssVar('primary-contrast')}: ${theme.primaryContrast};`,
    `${toCssVar('accent-blue')}: ${theme.accent.blue};`,
    `${toCssVar('accent-green')}: ${theme.accent.green};`,
    `${toCssVar('accent-red')}: ${theme.accent.red};`,
    `${toCssVar('accent-yellow')}: ${theme.accent.yellow};`,
  ];
}

const REDUCED_MOTION = `
/* Respect the operating system's reduced-motion preference. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Explicit GOOSE reduced-motion toggle (overrides OS preference). */
html[data-reduced-motion='true'] *,
html[data-reduced-motion='true'] *::before,
html[data-reduced-motion='true'] *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
`;

const GLASS = `
/* Glass surface. Translucent with backdrop blur; falls back to solid
 * whenever the browser does not support backdrop-filter. */
.goose-glass {
  background-color: var(--goose-surface);
  border: 1px solid var(--goose-border);
  backdrop-filter: blur(var(--goose-blur)) saturate(1.2);
  -webkit-backdrop-filter: blur(var(--goose-blur)) saturate(1.2);
  box-shadow: var(--goose-shadow-sm);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .goose-glass {
    background-color: var(--goose-surface-solid);
  }
}

/* High-contrast mode: solid surfaces, stronger borders, no blur. */
html[data-high-contrast='true'] {
  --goose-surface: var(--goose-surface-solid);
  --goose-border: var(--goose-border-strong);
  --goose-blur: 0px;
}
`;

const RADIUS_UTILS = `
/* Radius utilities. */
.goose-radius-sm { border-radius: var(--goose-radius-sm); }
.goose-radius { border-radius: var(--goose-radius); }
.goose-radius-lg { border-radius: var(--goose-radius-lg); }
.goose-radius-xl { border-radius: var(--goose-radius-xl); }
.goose-radius-full { border-radius: var(--goose-radius-full); }
`;

function buildCss() {
  const lines = [
    '/**',
    ' * @goose/design-tokens — generated theme.',
    ' * Do not edit by hand. Edit src/palette.json and run `pnpm --filter @goose/design-tokens generate`.',
    ' */',
    ':root {',
    ...sharedCss(palette.shared),
    '}',
    `:root, html[data-theme='light'] {`,
    ...themeCss(palette.themes.light),
    '}',
    `html[data-theme='dark'] {`,
    ...themeCss(palette.themes.dark),
    '}',
  ];
  return `${lines.join('\n')}\n${RADIUS_UTILS}${REDUCED_MOTION}${GLASS}`;
}

await writeFile(path.join(ROOT, 'theme.css'), buildCss(), 'utf8');
console.log('[design-tokens] wrote packages/design-tokens/theme.css');