import { Icon } from '@goose/ui';
import { APPS } from '../registry';
import { appIcon } from '../appIcon';
import { useShell } from '../store';
import { DOCK_WIDTH } from '../layout';

export function Dock() {
  const { state, dispatch } = useShell();
  const running = new Set(state.windows.map((window) => window.appId));
  const activeAppId = state.windows.find((window) => window.id === state.focusedWindowId)?.appId;

  const pinned = APPS.filter((app) => app.pinned);
  const extra = APPS.filter((app) => !app.pinned && running.has(app.id));
  const items = [...pinned, ...extra];

  const glassStyle = {
    backgroundColor: 'var(--goose-surface)',
    backdropFilter: 'blur(var(--goose-blur)) saturate(1.2)',
    WebkitBackdropFilter: 'blur(var(--goose-blur)) saturate(1.2)',
    borderRight: '1px solid var(--goose-border)',
    boxShadow: 'var(--goose-shadow-sm)',
  };

  return (
    <nav
      className="pointer-events-auto absolute bottom-0 left-0 top-12 z-30 flex flex-col items-center"
      style={{ width: DOCK_WIDTH, ...glassStyle }}
      aria-label="Application dock"
    >
      <div className="flex w-full flex-1 flex-col items-center gap-1 overflow-y-auto px-3 py-3">
        <button
          type="button"
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-ink transition-all duration-[var(--goose-duration-fast)] hover:bg-brand/10 hover:text-brand active:bg-brand/15"
          title="Open launcher (Super+A)"
          aria-label="Open launcher (Super+A)"
          onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'launcher' })}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-solid shadow-sm ring-1 ring-line transition-transform duration-[var(--goose-duration-fast)] group-hover:scale-105">
            <Icon name="grid" size={20} />
          </span>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-bg opacity-0 shadow-lg transition-opacity duration-[var(--goose-duration-fast)] group-hover:block group-hover:opacity-100 group-focus-visible:block group-focus-visible:opacity-100"
          >
            Applications · Super+A
          </span>
        </button>

        <div className="my-2 h-px w-9 bg-line" />

        {items.map((app) => {
          const isRunning = running.has(app.id);
          const isActive = activeAppId === app.id;
          const label = isActive ? `${app.name} — focused` : `${app.name}${isRunning ? ' — running' : ''}`;
          return (
            <button
              key={app.id}
              type="button"
              className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-ink transition-all duration-[var(--goose-duration-fast)] hover:bg-surface-solid active:bg-surface-solid"
              title={label}
              aria-label={label}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => dispatch({ type: 'OPEN_APP', app })}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-[var(--goose-duration-fast)] group-hover:scale-110"
                style={{
                  color: app.tint,
                  backgroundColor: isRunning
                    ? `color-mix(in srgb, ${app.tint} 14%, transparent)`
                    : 'transparent',
                  boxShadow: isActive ? 'var(--goose-shadow-sm)' : undefined,
                }}
              >
                <Icon name={appIcon(app.id)} size={20} />
              </span>

              <span
                aria-hidden="true"
                className="absolute left-0.5 transition-all duration-[var(--goose-duration-fast)]"
                style={{
                  width: isActive ? 4 : 3,
                  height: isActive ? 20 : isRunning ? 8 : 0,
                  borderRadius: 9999,
                  backgroundColor: isActive ? 'var(--goose-fg)' : app.tint,
                  opacity: isActive || isRunning ? 1 : 0,
                }}
              />

              <span
                role="tooltip"
                className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-bg opacity-0 shadow-lg transition-opacity duration-[var(--goose-duration-fast)] group-hover:block group-hover:opacity-100 group-focus-visible:block group-focus-visible:opacity-100"
              >
                {app.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex w-full shrink-0 flex-col items-center gap-1 border-t border-line/70 px-3 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
          GOOSE OS
        </span>
        <span className="text-[10px] text-ink-muted/70">0.1 prototype</span>
      </div>
    </nav>
  );
}