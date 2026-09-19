import { beforeEach, describe, expect, it } from 'vitest';
import type { ThemeMode } from '@goose/types';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from './index';

function stubWindow() {
  const store = new Map<string, string>();
  const storage = {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      store.set(key, value);
    },
    removeItem: (key: string): void => {
      store.delete(key);
    },
  };
  (globalThis as Record<string, unknown>).window = { localStorage: storage };
}

beforeEach(() => {
  delete (globalThis as Record<string, unknown>).window;
});

describe('@goose/config', () => {
  it('returns defaults when storage is unavailable', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips settings through storage', () => {
    stubWindow();
    saveSettings({ ...DEFAULT_SETTINGS, themeMode: 'dark', highContrast: true });
    expect(loadSettings()).toEqual({ ...DEFAULT_SETTINGS, themeMode: 'dark', highContrast: true });
  });

  it('sanitises malformed and out-of-range values', () => {
    stubWindow();
    saveSettings({
      ...DEFAULT_SETTINGS,
      themeMode: 'neon' as ThemeMode,
      audioVolume: 999,
      brightness: -5,
      wifiEnabled: 'yes' as unknown as boolean,
    });
    const loaded = loadSettings();
    expect(loaded.themeMode).toBe('system');
    expect(loaded.audioVolume).toBe(100);
    expect(loaded.brightness).toBe(0);
    expect(loaded.wifiEnabled).toBe(true);
  });

  it('falls back to defaults on corrupt JSON', () => {
    stubWindow();
    const raw = (globalThis.window as { localStorage: { setItem: (k: string, v: string) => void } }).localStorage;
    raw.setItem('goose.settings.v1', 'not json {');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
});