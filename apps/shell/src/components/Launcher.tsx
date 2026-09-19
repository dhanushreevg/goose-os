import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';
import { Icon } from '@goose/ui';
import type { AppDefinition } from '@goose/types';
import { APPS } from '../registry';
import { appIcon } from '../appIcon';
import { useShell } from '../store';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { cn } from '@goose/shared-utils';

function rankApps(query: string, apps: AppDefinition[]): AppDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return apps;
  const scored: Array<{ app: AppDefinition; score: number }> = [];
  for (const app of apps) {
    const name = app.name.toLowerCase();
    const hay = `${name} ${app.description.toLowerCase()}`;
    if (hay.includes(q)) {
      scored.push({
        app,
        score: 1000 + (name.startsWith(q) ? 200 : 0) + (name.includes(q) ? 50 : 0),
      });
      continue;
    }
    let cursor = 0;
    let points = 0;
    let matched = true;
    for (const ch of q) {
      const idx = hay.indexOf(ch, cursor);
      if (idx === -1) {
        matched = false;
        break;
      }
      points += idx === cursor ? 3 : 1;
      cursor = idx + 1;
    }
    if (matched) scored.push({ app, score: points });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.app);
}

export function Launcher() {
  const { state, dispatch } = useShell();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const runningIds = useMemo(
    () => new Set(state.windows.map((window) => window.appId)),
    [state.windows],
  );

  const ranked = useMemo(() => rankApps(query, APPS), [query]);
  const hasQuery = query.trim().length > 0;
  const inUse = hasQuery ? [] : ranked.filter((app) => runningIds.has(app.id));
  const remaining = hasQuery ? ranked : ranked.filter((app) => !inUse.includes(app));
  const ordered = [...inUse, ...remaining];

  const clampedIndex = Math.min(Math.max(0, activeIndex), Math.max(0, ordered.length - 1));

  useFocusTrap(panelRef);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useLayoutEffect(() => {
    const el = gridRef.current?.querySelector(`[data-index="${clampedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [clampedIndex, ordered.length]);

  function openApp(app: AppDefinition) {
    dispatch({ type: 'OPEN_APP', app });
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, ordered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = ordered[clampedIndex] ?? ordered[0];
      if (target) openApp(target);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      dispatch({ type: 'CLOSE_OVERLAY' });
    }
  }

  function AppButton({ app, index }: { app: AppDefinition; index: number }) {
    const selected = index === clampedIndex;
    return (
      <button
        type="button"
        data-index={index}
        className={cn(
          'flex items-center gap-3 rounded-xl p-3 text-left outline-none transition-all duration-[var(--goose-duration-fast)]',
          selected ? 'bg-surface-solid shadow-sm ring-1 ring-brand/30' : 'hover:bg-surface',
        )}
        onMouseEnter={() => setActiveIndex(index)}
        onClick={() => openApp(app)}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            color: app.tint,
            backgroundColor: `color-mix(in srgb, ${app.tint} 14%, transparent)`,
          }}
        >
          <Icon name={appIcon(app.id)} size={20} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">{app.name}</span>
          <span className="block truncate text-xs text-ink-muted">{app.description}</span>
        </span>
        {app.kind === 'preview' && (
          <span className="ml-auto shrink-0 rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand">
            Preview
          </span>
        )}
      </button>
    );
  }

  function SectionTitle({ children }: { children: ReactNode }) {
    return (
      <p className="mt-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        {children}
      </p>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center pt-16 sm:pt-20">
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Application launcher"
        className="goose-launcher-panel pointer-events-auto w-full max-w-2xl overflow-hidden rounded-[var(--goose-radius-xl)] border border-line/70 bg-white/80 shadow-[var(--goose-shadow-lg)] backdrop-blur-[var(--goose-blur)]"
      >
        <div className="flex items-center gap-3 px-5 pb-2 pt-5">
          <Icon name="search" size={18} className="text-ink-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search apps and actions…"
            aria-label="Search apps"
            className="h-10 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-muted/70"
            autoComplete="off"
            spellCheck={false}
          />
          {hasQuery && (
            <button
              type="button"
              aria-label="Clear search"
              title="Clear search"
              className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        <div ref={gridRef} className="max-h-[52vh] overflow-y-auto px-3 pb-3">
          {ordered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-ink-muted">
                <Icon name="search" size={22} />
              </span>
              <p className="text-sm font-medium text-ink">No apps found</p>
              <p className="max-w-xs text-xs text-ink-muted">
                Nothing matches “{query}”. Try “files”, “terminal” or “settings”.
              </p>
            </div>
          ) : (
            <>
              {inUse.length > 0 && (
                <>
                  <SectionTitle>In use</SectionTitle>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-1.5">
                    {ordered.slice(0, inUse.length).map((app, index) => (
                      <AppButton key={app.id} app={app} index={index} />
                    ))}
                  </div>
                </>
              )}
              {remaining.length > 0 && (
                <>
                  <SectionTitle>{hasQuery ? 'Results' : 'Applications'}</SectionTitle>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-1.5">
                    {remaining.map((app, relIndex) => (
                      <AppButton key={app.id} app={app} index={inUse.length + relIndex} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line/70 bg-white/50 px-5 py-2.5">
          <span className="text-[11px] text-ink-muted">
            {ordered.length === 0
              ? 'No results'
              : `${ordered.length} application${ordered.length === 1 ? '' : 's'}`}
          </span>
          <span className="text-[11px] text-ink-muted">
            ↑↓ navigate · Enter launch · Esc close · Super+A opens
          </span>
        </div>
      </div>
    </div>
  );
}