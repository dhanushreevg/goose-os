/**
 * @goose/config — typed settings persistence backed by localStorage.
 *
 * Only non-sensitive user preferences are stored here. Secrets (API keys,
 * tokens) must never be written to localStorage — they belong in secure
 * backend configuration and are out of scope for this package.
 */

import type { ShellSettings } from '@goose/types';

export const DEFAULT_SETTINGS: ShellSettings = {
  themeMode: 'system',
  highContrast: false,
  reducedMotion: false,
  audioVolume: 100,
  brightness: 100,
  wifiEnabled: true,
  bluetoothEnabled: false,
};

const STORAGE_KEY = 'goose.settings.v1';

/** Absolute minimum of an acceptable settings object before we treat storage as valid. */
const SHAPE_KEYS: Array<keyof ShellSettings> = [
  'themeMode',
  'highContrast',
  'reducedMotion',
  'audioVolume',
  'brightness',
  'wifiEnabled',
  'bluetoothEnabled',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitise(raw: unknown): ShellSettings {
  const base = { ...DEFAULT_SETTINGS };
  if (!isRecord(raw)) return base;
  for (const key of SHAPE_KEYS) {
    const value = raw[key];
    if (value === undefined) continue;
    switch (key) {
      case 'themeMode':
        if (value === 'light' || value === 'dark' || value === 'system') base.themeMode = value;
        break;
      case 'highContrast':
      case 'reducedMotion':
      case 'wifiEnabled':
      case 'bluetoothEnabled':
        if (typeof value === 'boolean') base[key] = value;
        break;
      case 'audioVolume':
      case 'brightness':
        if (typeof value === 'number' && Number.isFinite(value)) base[key] = Math.min(100, Math.max(0, value));
        break;
    }
  }
  return base;
}

/** Read persisted settings, falling back to defaults on any failure. */
export function loadSettings(): ShellSettings {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return { ...DEFAULT_SETTINGS };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === null ? { ...DEFAULT_SETTINGS } : sanitise(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** Persist settings. Silently ignores storage failures (private mode etc.). */
export function saveSettings(settings: ShellSettings): void {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable — in-memory settings keep working */
  }
}