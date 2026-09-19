import { Icon } from '@goose/ui';
import { useShell } from '../store';
import { DOCK_WIDTH, TOP_BAR_HEIGHT, WORKSPACE_BAR_HEIGHT } from '../layout';
import { WindowCard } from './WindowCard';
import { WelcomeArea } from './WelcomeArea';

export function WorkspaceView() {
  const { state } = useShell();
  const windows = state.windows.filter(
    (window) => window.workspace === state.activeWorkspace && !window.minimized,
  );
  const sorted = [...windows].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

  return (
    <main
      className="absolute inset-0 z-10 flex"
      style={{
        paddingTop: TOP_BAR_HEIGHT,
        paddingBottom: WORKSPACE_BAR_HEIGHT,
        paddingLeft: DOCK_WIDTH,
        paddingRight: 0,
      }}
      aria-label={`Workspace ${state.activeWorkspace + 1}`}
    >
      <div className="relative h-full w-full overflow-hidden">
        {sorted.length === 0 && <WelcomeArea />}
        {sorted.map((window) => (
          <WindowCard key={window.id} window={window} />
        ))}
        {sorted.length > 0 && (
          <Icon
            aria-hidden="true"
            name="goose"
            size={28}
            className="pointer-events-none absolute bottom-3 right-4 text-ink-muted/20"
          />
        )}
      </div>
    </main>
  );
}