import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { AppDefinition } from '@goose/types';
import { Button, Icon, Switch } from '@goose/ui';
import { greeting, formatBytes, formatUptime } from '@goose/shared-utils';
import { APPS, appById } from '../registry';
import { appIcon } from '../appIcon';
import { useShell } from '../store';
import { useSettings } from '../hooks/useSettings';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { AppGlyph } from './AppGlyph';

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
                color: entry.kind === 'folder' ? 'var(--goose-accent-blue)' : 'var(--goose-fg)',
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

  function run(event: FormEvent<HTMLFormElement>) {
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
      className="flex h-full flex-col bg-[#10151B] font-mono text-[13px] leading-relaxed text-emerald-100/90"
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

function AppEditor() {
  const [doc, setDoc] = useState(
    '# Welcome\n\nThis is the GOOSE OS text editor prototype.\n\n- Edit text on the right\n- Everything is kept in memory for now\n- Files land in a real storage layer later\n',
  );
  const words = doc.trim() ? doc.trim().split(/\s+/).length : 0;
  const chars = doc.length;

  return (
    <div className="flex h-full flex-col bg-surface-solid/60">
      <div className="flex items-center justify-between gap-2 border-b border-line/70 px-4 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon name="docs" size={16} className="text-brand" />
          <span>untitled.md</span>
        </div>
        <span className="text-xs tabular-nums text-ink-muted">
          {words} words · {chars} chars · Light theme
        </span>
      </div>
      <textarea
        value={doc}
        onChange={(event) => setDoc(event.target.value)}
        aria-label="Document text"
        spellCheck={false}
        className="min-h-0 flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-ink outline-none placeholder:text-ink-muted"
        placeholder="Start typing…"
      />
      <p className="px-4 py-2 text-xs text-ink-muted">
        Prototype editor — content lives in memory only.
      </p>
    </div>
  );
}

const WEB_RESULTS = [
  { title: 'GOOSE OS — official docs', url: 'goose-os.dev/docs', snippet: 'Reference for the shell, launcher, workspaces and app registry.' },
  { title: 'Building a Linux desktop with React', url: 'blog.dev/linux-react', snippet: 'How the GOOSE prototype combines web tech with a desktop metaphor.' },
  { title: 'GOOSE installer for Linux', url: 'goose-os.dev/install', snippet: 'Download the demo image and run it in a VM today.' },
];

function AppSearch() {
  const [query, setQuery] = useState('');

  const appMatches = APPS.filter((app) =>
    `${app.name} ${app.description}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const webMatches = WEB_RESULTS.filter((r) =>
    `${r.title} ${r.snippet}`.toLowerCase().includes(query.trim().toLowerCase()),
  ).slice(0, 4);

  return (
    <div className="flex h-full flex-col bg-surface-solid/60">
      <div className="flex items-center gap-3 px-4 py-3">
        <Icon name="search" size={16} className="text-ink-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search files, apps and the web…"
          aria-label="Search"
          autoComplete="off"
          spellCheck={false}
          className="h-9 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {query.trim() === '' ? (
          <p className="py-10 text-center text-sm text-ink-muted">
            Type above to search your workspace.
          </p>
        ) : (
          <>
            {appMatches.length > 0 && (
              <>
                <p className="px-1 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Applications
                </p>
                {appMatches.map((app) => (
                  <div key={app.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface">
                    <AppGlyph app={app} size={32} className="h-8 w-8 rounded-lg" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{app.name}</p>
                      <p className="truncate text-xs text-ink-muted">{app.description}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {webMatches.length > 0 && (
              <>
                <p className="px-1 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Web
                </p>
                {webMatches.map((result) => (
                  <button
                    key={result.url}
                    type="button"
                    className="block w-full rounded-lg p-2 text-left hover:bg-surface"
                  >
                    <p className="truncate text-sm font-medium text-accent-blue">{result.title}</p>
                    <p className="truncate text-xs text-ink-muted">{result.url}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">{result.snippet}</p>
                  </button>
                ))}
              </>
            )}
            {appMatches.length === 0 && webMatches.length === 0 && (
              <p className="py-10 text-center text-sm text-ink-muted">
                No results for “{query}”.
              </p>
            )}
          </>
        )}
      </div>
      <p className="px-4 py-2 text-xs text-ink-muted">
        Prototype search — results are bundled demo data, not a live index.
      </p>
    </div>
  );
}

function AppBrowser() {
  const [url, setUrl] = useState('');
  const [visited, setVisited] = useState<string | null>(null);
  const { dispatch } = useShell();

  function navigate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = url.trim() || 'goose-os.dev';
    if (target.includes('goose-os')) {
      setVisited(null);
    } else {
      setVisited(target);
    }
  }

  return (
    <div className="flex h-full flex-col bg-surface-solid/60">
      <div className="flex items-center gap-2 border-b border-line/70 px-3 py-2">
        <span className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-red/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-yellow/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-green/70" />
        </span>
        <form onSubmit={navigate} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-surface px-3 py-1.5">
          <Icon name="globe" size={14} className="shrink-0 text-ink-muted" />
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="goose-os.dev"
            aria-label="Address"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          />
        </form>
        <button
          type="button"
          className="shrink-0 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
          title="Back (prototype)"
          aria-label="Back"
          onClick={() => setVisited(null)}
        >
          <Icon name="chevron-left" size={16} />
        </button>
        <button
          type="button"
          className="shrink-0 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
          title="Reload (prototype)"
          aria-label="Reload"
          onClick={() => setVisited((v) => (v === null ? null : v))}
        >
          <Icon name="refresh" size={16} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {visited ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <Icon name="wifi-off" size={32} className="text-ink-muted" />
            <p className="text-sm font-medium text-ink">{visited} cannot be displayed</p>
            <p className="max-w-sm text-xs text-ink-muted">
              The browser is a prototype without networking. Only the bundled GOOSE OS home page is
              available.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-line">
                <Icon name="goose" size={20} className="text-brand" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-ink">GOOSE OS Home</h2>
                <p className="text-xs text-ink-muted">goose-os.dev</p>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">
              A smarter workspace for building, creating, and exploring. This is a bundled demo
              page rendered by the prototype browser.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(
                [
                  ['Files', 'files'],
                  ['Terminal', 'terminal'],
                  ['Settings', 'settings'],
                  ['AI Assistant', 'ai-center'],
                  ['Music', 'music'],
                  ['App Center', 'app-center'],
                ] as Array<[string, string]>
              ).map(([name, id]) => (
                <button
                  key={id}
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-line/60 bg-surface/60 p-2.5 text-left text-sm text-ink transition-colors hover:bg-surface"
                  onClick={() => {
                    const app = appById(id);
                    dispatch({ type: 'OPEN_APP', app });
                  }}
                >
                  <Icon name={appIcon(id)} size={16} className="text-brand" />
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppAppCenter() {
  const { dispatch } = useShell();
  const [installed, setInstalled] = useState(() => new Set(APPS.map((app) => app.id)));

  function toggle(app: AppDefinition) {
    setInstalled((prev) => {
      const next = new Set(prev);
      if (next.has(app.id)) {
        next.delete(app.id);
      } else {
        next.add(app.id);
      }
      return next;
    });
  }

  return (
    <div className="flex h-full flex-col bg-surface-solid/60">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon name="store" size={16} className="text-brand" />
          App Center
        </div>
        <span className="text-xs text-ink-muted">{installed.size} installed</span>
      </div>
      <div className="grid flex-1 auto-rows-min grid-cols-2 content-start gap-2 overflow-y-auto p-3 sm:grid-cols-3">
        {APPS.map((app) => {
          const isInstalled = installed.has(app.id);
          return (
            <div
              key={app.id}
              className="flex flex-col gap-2 rounded-xl border border-line/60 bg-white/70 p-3"
            >
              <AppGlyph app={app} size={36} className="h-9 w-9 rounded-lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{app.name}</p>
                <p className="line-clamp-2 text-[11px] leading-snug text-ink-muted">
                  {app.description}
                </p>
              </div>
              <div className="mt-auto flex gap-1.5">
                <Button
                  variant="glass"
                  size="sm"
                  className="flex-1"
                  onClick={() => dispatch({ type: 'OPEN_APP', app })}
                >
                  Open
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggle(app)}
                  aria-label={isInstalled ? `Uninstall ${app.name}` : `Install ${app.name}`}
                >
                  {isInstalled ? 'Uninstall' : 'Install'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="px-4 py-2 text-xs text-ink-muted">
        Prototype store — install state is kept in memory for this session.
      </p>
    </div>
  );
}

function Meter({ label, value, display, tint }: { label: string; value: number; display: string; tint: string }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-ink-muted">{label}</span>
        <span className="font-mono text-ink">{display}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-solid ring-1 ring-line/50">
        <div
          className="h-full rounded-full transition-all duration-[var(--goose-duration)]"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: tint }}
        />
      </div>
    </div>
  );
}

function AppSystemMonitor() {
  const { health } = useSystemHealth();
  const system = health.data.system;
  const network = health.data.network;
  const battery = health.data.battery;

  if (!system) {
    return <p className="p-6 text-sm text-ink-muted">System data unavailable.</p>;
  }

  const memUsed = system.memory.usedPercent;
  const cpuLoad = Math.min(100, Math.round((system.loadAvg[0] / Math.max(1, system.cpuCount)) * 100));

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto bg-surface-solid/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon name="cpu" size={16} className="text-accent-blue" />
          System Monitor
        </div>
        <span className="text-xs text-ink-muted">{system.hostname}</span>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line/60 bg-white/70 p-4">
        <Meter label="CPU" value={cpuLoad} display={`${cpuLoad}% · ${system.cpuCount} cores`} tint="var(--goose-accent-blue)" />
        <Meter label="Memory" value={memUsed} display={`${formatBytes(system.memory.usedBytes)} / ${formatBytes(system.memory.totalBytes)}`} tint="var(--goose-primary)" />
        <Meter
          label="Uptime"
          value={100}
          display={formatUptime(system.uptimeSeconds)}
          tint="var(--goose-accent-green)"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line/60 bg-white/70 p-3">
          <p className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Icon name={battery?.charging ? 'battery-charging' : 'battery'} size={14} />
            Battery
          </p>
          <p className="mt-2 font-mono text-lg font-medium text-ink">
            {battery?.levelPercent ?? '—'}%
          </p>
          <p className="text-[11px] text-ink-muted">
            {battery?.charging ? 'Charging' : battery?.timeToEmptyMinutes ? `${Math.round(battery.timeToEmptyMinutes)}m remaining` : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-line/60 bg-white/70 p-3">
          <p className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Icon name={network?.connected ? 'wifi' : 'wifi-off'} size={14} />
            Network
          </p>
          <p className="mt-2 truncate font-mono text-lg font-medium text-ink">
            {network?.ssid ?? 'Offline'}
          </p>
          <p className="text-[11px] text-ink-muted">
            {network?.signalPercent != null ? `${network.signalPercent}% signal` : 'No connection'}
          </p>
        </div>
      </div>

      <p className="mt-auto text-xs text-ink-muted">
        Demo readings for the prototype. Live metrics arrive with the native bridge.
      </p>
    </div>
  );
}

const TRACKS = [
  { title: 'Grey Goose', artist: 'GOOSE Session', duration: '3:24', played: false },
  { title: 'The Golden Hour', artist: 'Orchard Lights', duration: '4:02', played: true },
  { title: 'Kernel Panic', artist: 'Null Pointer', duration: '2:51', played: false },
  { title: 'Sunday Build', artist: 'Team GOOSE', duration: '3:47', played: true },
  { title: 'Midnight Merge', artist: 'Config Dreams', duration: '5:12', played: false },
];

function AppMusic() {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(1);
  const [progress, setProgress] = useState(34);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 900);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div className="flex h-full flex-col bg-surface-solid/60">
      <div className="flex flex-col items-center gap-1 px-4 pb-3 pt-5 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand/10 text-brand shadow-sm ring-1 ring-brand/20">
          <Icon name="music" size={36} />
        </span>
        <p className="mt-2 text-sm font-semibold text-ink">
          {TRACKS[current]?.title}
        </p>
        <p className="text-xs text-ink-muted">{TRACKS[current]?.artist}</p>
      </div>

      <div className="px-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-solid ring-1 ring-line/50">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] tabular-nums text-ink-muted">
          <span>0:{String(Math.floor((progress / 100) * 180)).padStart(2, '0')}</span>
          <span>{TRACKS[current]?.duration}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-3">
        <button
          type="button"
          className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
          aria-label="Previous track"
          onClick={() => setCurrent((c) => (c - 1 + TRACKS.length) % TRACKS.length)}
        >
          <Icon name="chevron-left" size={20} />
        </button>
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-contrast shadow-sm transition-transform hover:scale-105 active:scale-95"
          aria-label={playing ? 'Pause' : 'Play'}
          title={playing ? 'Pause (prototype)' : 'Play (prototype)'}
          onClick={() => setPlaying((p) => !p)}
        >
          <Icon name={playing ? 'pause' : 'play'} size={22} />
        </button>
        <button
          type="button"
          className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
          aria-label="Next track"
          onClick={() => setCurrent((c) => (c + 1) % TRACKS.length)}
        >
          <Icon name="chevron-right" size={20} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-line/70 px-2 py-2">
        {TRACKS.map((track, index) => (
          <button
            key={track.title}
            type="button"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface ${index === current ? 'bg-surface' : ''}`}
            onClick={() => {
              setCurrent(index);
              setPlaying(true);
              setProgress(0);
            }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-ink-muted">
              <Icon name="music" size={15} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block truncate text-sm ${index === current ? 'font-medium text-brand' : 'text-ink'}`}>
                {track.title}
              </span>
              <span className="block truncate text-xs text-ink-muted">{track.artist}</span>
            </span>
            <span className="shrink-0 text-xs tabular-nums text-ink-muted">{track.duration}</span>
          </button>
        ))}
      </div>
      <p className="px-4 py-2 text-xs text-ink-muted">
        Prototype player — playback visuals only, no audio yet.
      </p>
    </div>
  );
}

const TRASH_ENTRIES = [
  { name: 'old-notes.md', size: '1.8 KB', deleted: '2h ago' },
  { name: 'draft-cover.jpg', size: '412 KB', deleted: 'Yesterday' },
  { name: 'tmp-backup.tar.gz', size: '24 MB', deleted: '3 days ago' },
];

function AppTrash() {
  const [items, setItems] = useState(TRASH_ENTRIES);

  return (
    <div className="flex h-full flex-col bg-surface-solid/60">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon name="trash" size={16} className="text-ink-muted" />
          Trash
        </div>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" disabled={items.length === 0} onClick={() => setItems([])}>
            Empty all
          </Button>
          <Button variant="ghost" size="sm" disabled={items.length === 0} onClick={() => setItems(TRASH_ENTRIES)}>
            Restore all
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <Icon name="trash" size={32} className="text-ink-muted/60" />
          <p className="text-sm font-medium text-ink">Trash is empty</p>
          <p className="max-w-xs text-xs text-ink-muted">
            Deleted files in this prototype stay safely in your browser session.
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          {items.map((item) => (
            <div key={item.name} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface">
              <Icon name="file" size={18} className="text-ink-muted" />
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{item.name}</span>
              <span className="hidden shrink-0 text-xs tabular-nums text-ink-muted sm:block">{item.size}</span>
              <span className="shrink-0 text-xs text-ink-muted">{item.deleted}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AppSettings() {
  const { settings, update } = useSettings();
  const { dispatch } = useShell();

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto bg-surface-solid/60 p-5">
      <div>
        <h2 className="text-base font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-ink-muted">
          GOOSE OS ships the <span className="text-ink">Light</span> theme in this iteration — dark
          mode is on the roadmap.
        </p>
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
      className="flex h-full flex-col items-center justify-center gap-3 bg-surface-solid/60 p-8 text-center"
      role="note"
    >
      <AppGlyph
        app={app}
        size={56}
        className="h-14 w-14 rounded-[var(--goose-radius-xl)]"
      />
      <h2 className="text-lg font-semibold text-ink">{app.name}</h2>
      <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
        {app.description}. This module ships in a later phase — the desktop shell, launcher,
        terminals and settings you see today are real prototype features.
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
    case 'editor':
      return <AppEditor />;
    case 'search':
      return <AppSearch />;
    case 'browser':
      return <AppBrowser />;
    case 'app-center':
      return <AppAppCenter />;
    case 'system-monitor':
      return <AppSystemMonitor />;
    case 'music':
      return <AppMusic />;
    case 'trash':
      return <AppTrash />;
    case 'terminal':
      return <AppTerminal />;
    case 'settings':
      return <AppSettings />;
    case 'ai-center':
    case 'developer-center':
      return <PreviewPane app={app} />;
    default:
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-surface-solid/60 p-8 text-center">
          <AppGlyph app={app} size={64} className="h-16 w-16 rounded-2xl" />
          <p className="text-sm font-medium text-ink">{app.name}</p>
          <p className="max-w-xs text-xs text-ink-muted">
            {app.description}. {greeting()}.
          </p>
        </div>
      );
  }
}