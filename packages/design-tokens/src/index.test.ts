import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@goose/shared-utils';
import { theme, shared, goosePalette } from './tokens';

describe('design tokens', () => {
  it('generated theme.css exists and is up to date', async () => {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const run = promisify(execFile);
    const { stdout } = await run('node', ['scripts/generate-css.mjs']);
    expect(stdout).toContain('wrote');
  });

  it('exposes both themes and shared tokens', () => {
    expect(theme('light').bg).toBeTypeOf('string');
    expect(theme('dark').bg).toBeTypeOf('string');
    expect(shared.radius).toBe(goosePalette.shared.radius);
  });

  it('core text pairs meet WCAG AA contrast (>= 4.5:1) in both themes', () => {
    const pairs = ['fg', 'fgMuted', 'primaryContrast'] as const;
    for (const name of ['light', 'dark'] as const) {
      const t = theme(name);
      for (const key of pairs) {
        const bg = key === 'primaryContrast' ? t.primary : t.bg;
        expect(
          contrastRatio(t[key], bg),
          `${name} palette: ${key} on ${bg} must be >= 4.5`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('brand colours differ between themes', () => {
    expect(theme('light').primary).not.toBe(theme('dark').primary);
  });
});