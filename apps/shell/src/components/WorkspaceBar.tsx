import { useShell } from '../store';
import { workspaceName } from '../layout';
import { cn } from '@goose/shared-utils';

/** Compact, floating workspace switcher pinned to the bottom centre. */
export function WorkspaceBar() {
  const { state, dispatch } = useShell();

  return (
    <nav
      className="goose-workspace-bar pointer-events-auto absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-line/70 bg-white/75 px-3.5 py-2 shadow-glass backdrop-blur-[var(--goose-blur)]"
      aria-label="Workspace switcher"
    >
      <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
        Workspaces
      </span>

      <div className="flex items-center gap-2">
        {Array.from({ length: state.workspaces }, (_, index) => {
          const active = index === state.activeWorkspace;
          return (
            <button
              key={index}
              type="button"
              className={cn(
                'rounded-full transition-all duration-[var(--goose-duration-fast)]',
                active
                  ? 'h-2.5 w-2.5 bg-ink ring-2 ring-ink/20'
                  : 'h-2 w-2 bg-ink-muted/40 hover:bg-ink-muted',
              )}
              title={`${workspaceName(index)} (Alt+${index + 1})`}
              aria-label={`Switch to workspace ${index + 1}: ${workspaceName(index)}`}
              aria-current={active ? 'true' : undefined}
              onClick={() => dispatch({ type: 'SET_WORKSPACE', workspace: index })}
            />
          );
        })}
      </div>

      <span className="text-xs tabular-nums text-ink-muted">
        {state.activeWorkspace + 1}/{state.workspaces}
      </span>

      <span className="hidden text-xs text-ink-muted/70 md:block">
        Alt+1–{state.workspaces} to switch
      </span>
    </nav>
  );
}