import { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '@goose/config';
import type { ShellSettings } from '@goose/types';

export interface SettingsController {
  settings: ShellSettings;
  update: <K extends keyof ShellSettings>(key: K, value: ShellSettings[K]) => void;
}

export function useSettings(): SettingsController {
  const [settings, setSettings] = useState<ShellSettings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // GOOSE OS ships a single, carefully-tuned LIGHT theme in this iteration.
  // Dark mode is intentionally not exposed.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = 'light';
    root.dataset.highContrast = String(settings.highContrast);
    root.dataset.reducedMotion = String(settings.reducedMotion);
  }, [settings.highContrast, settings.reducedMotion]);

  function update<K extends keyof ShellSettings>(key: K, value: ShellSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return { settings, update };
}