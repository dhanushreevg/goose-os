import { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '@goose/config';
import type { ResolvedTheme, ShellSettings } from '@goose/types';

export interface SettingsController {
  settings: ShellSettings;
  resolved: ResolvedTheme;
  update: <K extends keyof ShellSettings>(key: K, value: ShellSettings[K]) => void;
}

export function useSettings(): SettingsController {
  const [settings, setSettings] = useState<ShellSettings>(() => loadSettings());
  const [systemDark, setSystemDark] = useState<boolean>(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const resolved: ResolvedTheme =
    settings.themeMode === 'system' ? (systemDark ? 'dark' : 'light') : settings.themeMode;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.highContrast = String(settings.highContrast);
    root.dataset.reducedMotion = String(settings.reducedMotion);
  }, [resolved, settings.highContrast, settings.reducedMotion]);

  function update<K extends keyof ShellSettings>(key: K, value: ShellSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return { settings, resolved, update };
}