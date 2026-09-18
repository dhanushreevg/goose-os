import { useEffect, useRef, useState } from 'react';
import type { AppDefinition } from '@goose/types';
import { Button, Icon, SegmentedControl, Switch } from '@goose/ui';
import { greeting } from '@goose/shared-utils';
import { appById } from '../registry';
import { appIcon } from '../appIcon';
import { useShell } from '../store';
import { useSettings } from '../hooks/useSettings';

interface FileEntry {
  name: string;
  kind: 'folder' | 'file';
  size: string;
}

const HOME_ENTRIES: FileEntry[] = [
  { name: 'Documents', kind: 'folder', size: '' },
  { name: 'Downloads', kind: 'folder', size: '' },
  { name: 'Pictures', kind: 'folder', size: '' },
  { name: 'Projects', kind: 'folder', size: '' },
  { name: 'goose-os', kind: 'folder', size: '' },
  { name: 'README.md', kind: 'file', size: '3.4 KB' },
  { name: 'notes.md', kind: 'file', size: '1.2 KB' },
  { name: 'idea-plan.md', kind: 'file', size: '2.1 KB' },
];

const BOOT_LINES = [
  'GOOSE OS Terminal — prototype build 0.1.0',
  'Session: goosedev · Shell: bash (demo)',
  'Type "help" to see what this demo understands.',
  '',
];

function AppFiles() {
  return (
    <div className="flex h-full flex-col bg-surface-solid/60">
      <div className="flex items-center gap-2 px-4 py-3">
        <Icon name="home" size={16} className="text-ink-muted" />
        <span className="text-sm font-medium">Home</span>
      </div>
      <div className="grid flex-1 grid-cols-2 content-start gap-1 overflow-y-auto p-3 sm:grid-cols-3">
        {HOME_ENTRIES.map((entry) => (
          <button
            key={entry.name}
            type="button"
            className="flex items-center gap-2 rounded-lg p-2 text-left text-sm transition-colors hover:bg-surface"
          >
            <Icon
              name={entry.kind === 'folder' ? 'folder' : 'file'}
              size={18}
              style={{
                color: entry.kind === 'folder' ? 'var(--goose-accent-blue)' : 'var(--goose-ink)',
              }}
            />
            <span className="min-w-0 flex-1 truncate">{entry.name}</span>
            {entry.size !== '' && (
              <span className="shrink-0 text-xs text-ink-muted">{entry.size}</span>
            )}
          </button>
        ))}
      </div>
      <p className="px-4 py-2 text-xs text-ink-muted">
        Demo listing — read-only. Real filesystem access arrives in a later phase.
      </p>
    </div>
  );
}

const HELP_TEXT = [
  '  clear          Clear the screen',
  '  echo <text>    Print text back',
  '  date           Show the current date',
  '  help           Show this list',
  'The AI Center will add GOOSE-assist to this terminal soon.',
];

function AppTerminal() {
  const [lines, setLines] = useState<string[]>(BOOT_LINES);
  const [value, setValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function run(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cmd = value.trim();
    setValue('');
    if (!cmd) return;
    if (cmd === 'clear') {
      setLines([]);
      return;
    }
    if (cmd === 'help') {
      setLines((prev) => [...prev, `$ ${cmd}`, ...HELP_TEXT]);
      return;
    }
    if (cmd === 'date') {
      setLines((prev) => [...prev, `$ ${cmd}`, new Date().toString()]);
      return;
    }
    if (cmd.startsWith('echo ')) {
      setLines((prev) => [...prev, `$ ${cmd}`, cmd.slice(5)]);
      return;
    }
    setLines((prev) => [
      ...prev,
      `$ ${cmd}`,
      `bash: ${cmd}: command not found (GOOSE demo)`,
    ]);
  }

  return (
    <div
      className="flex h-full flex-col bg-[#0c0f14] font-mono text-[13px] leading-relaxed text-emerald-100/90"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3"
        role="log"
        aria-label="Terminal output"
      >
        {lines.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line || '\u00A0'}
          </div>
        ))}
        <form onSubmit={run} className="flex items-center gap-2">
          <span className="shrink-0 text-emerald-300">sanjay@goose:~$</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-emerald-100 caret-emerald-300 outline-none"
          />
        </form>
      </div>
    </div>
  );
}

function AppSettings() {
  const { settings, update, resolved } = useSettings();
  const { dispatch } = useShell();
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
      <div>
        <h2 className="text-base font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Theme currently resolves to <span className="text-ink">{resolved}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-glass bg-surface p-4">
        <span className="text-sm font-medium">Theme mode</span>
        <SegmentedControl
          label="Theme mode"
          value={settings.themeMode}
          onChange={(value) => update('themeMode', value as typeof settings.themeMode)}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'system', label: 'System' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-glass bg-surface p-4">
        <span className="text-sm font-medium">Accessibility</span>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="settings-hc" className="text-sm">High contrast</label>
          <Switch
            id="settings-hc"
            checked={settings.highContrast}
            onChange={(value) => update('highContrast', value)}
            label="High contrast"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="settings-rm" className="text-sm">Reduced motion</label>
          <Switch
            id="settings-rm"
            checked={settings.reducedMotion}
            onChange={(value) => update('reducedMotion', value)}
            label="Reduced motion"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-glass bg-surface p-4">
        <span className="text-sm font-medium">Connectivity</span>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="settings-wifi" className="text-sm">Wi-Fi</label>
          <Switch
            id="settings-wifi"
            checked={settings.wifiEnabled}
            onChange={(value) => update('wifiEnabled', value)}
            label="Wi-Fi"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="settings-bt" className="text-sm">Bluetooth</label>
          <Switch
            id="settings-bt"
            checked={settings.bluetoothEnabled}
            onChange={(value) => update('bluetoothEnabled', value)}
            label="Bluetooth"
          />
        </div>
      </div>

      <div>
        <Button
          variant="primary"
          onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'quick' })}
        >
          Open quick settings
        </Button>
      </div>
    </div>
  );
}

function PreviewPane({ app }: { app: AppDefinition }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-3 bg-surface-solid/40 p-8 text-center"
      role="note"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-[var(--goose-radius-xl)]"
        style={{
          color: app.tint,
          backgroundColor: `color-mix(in srgb, ${app.tint} 16%, transparent)`,
        }}
      >
        <Icon name={appIcon(app.id)} size={28} />
      </span>
      <h2 className="text-lg font-semibold text-ink">{app.name}</h2>
      <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
        {app.description}. This module ships in a later phase — the desktop shell,
        launcher, terminals and settings you see today are real prototype features.
      </p>
      <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-medium text-brand">
        Preview
      </span>
    </div>
  );
}

export function AppBody({ appId }: { appId: string }) {
  const app = appById(appId);
  switch (app.id) {
    case 'files':
      return <AppFiles />;
    case 'terminal':
      return <AppTerminal />;
    case 'settings':
      return <AppSettings />;
    case 'ai-center':
    case 'developer-center':
      return <PreviewPane app={app} />;
    default:
      return (
        <div className="flex h-full items-center justify-center text-sm text-ink-muted">
          {app.name} — {greeting()}.
        </div>
      );
  }
}