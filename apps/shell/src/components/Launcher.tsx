import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@goose/ui';
import type { AppDefinition } from '@goose/types';
import { APPS } from '../registry';
import { appIcon } from '../appIcon';
import { useShell } from '../store';
import { cn } from '@goose/shared-utils';

function filterApps(query: string): AppDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return APPS;
  return APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q),
  );
}

export function Launcher() {
  const { dispatch } = useShell();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => filterApps(query), [query]);
  const clampedIndex = Math.max(0, Math.min(activeIndex, results.length - 1));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useLayoutEffect(() => {
    const el = gridRef.current?.querySelector(`[data-index="${clampedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [clampedIndex, results.length]);

  function openApp(app: AppDefinition) {
    dispatch({ type: 'OPEN_APP', app });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = results[clampedIndex] ?? results[0];
      if (target) openApp(target);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      dispatch({ type: 'CLOSE_OVERLAY' });
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Application launcher"
      className="pointer-events-auto absolute inset-x-0 top-0 z-50 flex justify-center pt-24"
    >
      <div className="goose-glass w-full max-w-2xl goose-radius-xl p-5 shadow-[var(--goose-shadow-lg)]">
        <div className="flex items-center gap-3 rounded-glass bg-surface px-4 focus-within:ring-1 focus-within:ring-brand/60">
          <Icon name="search" size={18} className="text-ink-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search apps…"
            aria-label="Search apps"
            className="h-12 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-muted"
          />
        </div>

        <div
          ref={gridRef}
          className="mt-4 grid max-h-[46vh] grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2"
        >
          {results.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-ink-muted">
              No apps match “{query}”.
            </p>
          )}
          {results.map((app, index) => {
            const selected = index === clampedIndex;
            return (
              <button
                key={app.id}
                type="button"
                data-index={index}
                className={cn(
                  'flex items-center gap-3 rounded-glass p-3 text-left transition-colors',
                  selected ? 'bg-surface-solid' : 'hover:bg-surface',
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => openApp(app)}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-glass"
                  style={{
                    color: app.tint,
                    backgroundColor: `color-mix(in srgb, ${app.tint} 14%, transparent)`,
                  }}
                >
                  <Icon name={appIcon(app.id)} size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">
                    {app.name}
                  </span>
                  <span className="block truncate text-xs text-ink-muted">
                    {app.description}
                  </span>
                </span>
                {app.kind === 'preview' && (
                  <span className="ml-auto shrink-0 rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand">
                    Preview
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Type to search · Enter to launch · Esc to close · Alt / Super + A
        </p>
      </div>
    </div>
  );
}