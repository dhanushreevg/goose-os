import { Icon } from '@goose/ui';
import { APPS } from '../registry';
import { appIcon } from '../appIcon';
import { useShell } from '../store';
import { cn } from '@goose/shared-utils';

export function Dock() {
  const { state, dispatch } = useShell();
  const running = new Set(state.windows.map((window) => window.appId));

  const pinned = APPS.filter((app) => app.pinned);
  const extra = APPS.filter((app) => !app.pinned && running.has(app.id));
  const items = [...pinned, ...extra];

  const glassStyle = {
    backgroundColor: 'var(--goose-surface)',
    backdropFilter: 'blur(var(--goose-blur)) saturate(1.2)',
    WebkitBackdropFilter: 'blur(var(--goose-blur)) saturate(1.2)',
    border: '1px solid var(--goose-border)',
  };

  return (
    <nav
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex justify-center pb-3"
      aria-label="Application dock"
    >
      <div
        className="flex items-end gap-1 rounded-[var(--goose-radius-xl)] px-2 py-2 shadow-glass"
        style={glassStyle}
      >
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-glass text-ink transition-colors hover:bg-surface active:bg-surface-solid"
          title="Open launcher (Super+A)"
          aria-label="Open launcher"
          onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'launcher' })}
        >
          <Icon name="grid" size={20} />
        </button>

        <div className="mx-1 h-8 w-px self-center bg-line" />

        {items.map((app) => {
          const isRunning = running.has(app.id);
          return (
            <button
              key={app.id}
              type="button"
              className="group relative flex h-10 w-10 items-center justify-center rounded-glass transition-colors hover:bg-surface active:bg-surface-solid"
              title={app.name}
              aria-label={`Open ${app.name}`}
              onClick={() => dispatch({ type: 'OPEN_APP', app })}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-glass"
                style={{
                  color: app.tint,
                  backgroundColor: isRunning
                    ? `color-mix(in srgb, ${app.tint} 14%, transparent)`
                    : 'transparent',
                }}
              >
                <Icon name={appIcon(app.id)} size={18} />
              </span>
              {isRunning ? (
                <span
                  className="absolute bottom-0.5 h-1 w-1 rounded-full"
                  style={{ backgroundColor: app.tint }}
                />
              ) : (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-line opacity-0 transition-opacity duration-[var(--goose-duration-fast)] group-hover:opacity-100" />
              )}
            </button>
          );
        })}

        <div className="mx-1 h-8 w-px self-center bg-line" />

        <div className="flex items-center gap-1.5 self-center pl-0.5 pr-1">
          {Array.from({ length: state.workspaces }, (_, index) => {
            const active = index === state.activeWorkspace;
            return (
              <button
                key={index}
                type="button"
                className={cn(
                  'rounded-full transition-all duration-[var(--goose-duration-fast)]',
                  active ? 'h-2 w-2 bg-ink' : 'h-1.5 w-1.5 bg-ink-muted/50 hover:bg-ink-muted',
                )}
                title={`Switch to workspace ${index + 1} (Alt+${index + 1})`}
                aria-label={`Switch to workspace ${index + 1}`}
                onClick={() => dispatch({ type: 'SET_WORKSPACE', workspace: index })}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
}