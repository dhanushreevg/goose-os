import { Icon } from '@goose/ui';
import { greeting } from '@goose/shared-utils';
import { useShell } from '../store';
import { WindowCard } from './WindowCard';

export function WorkspaceView() {
  const { state } = useShell();
  const windows = state.windows.filter(
    (window) => window.workspace === state.activeWorkspace && !window.minimized,
  );
  const sorted = [...windows].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

  return (
    <main
      className="absolute inset-0 z-10 flex pt-12 pb-20"
      aria-label={`Workspace ${state.activeWorkspace + 1}`}
    >
      <div className="relative h-full w-full">
        {sorted.length === 0 && (
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
            aria-hidden="true"
          >
            <Icon name="grid" size={40} className="text-ink-muted/60" />
            <p className="text-ink-muted">
              {greeting()} — press <kbd className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">Super+A</kbd> to launch an app
            </p>
          </div>
        )}
        {sorted.map((window) => (
          <WindowCard key={window.id} window={window} />
        ))}
      </div>
    </main>
  );
}