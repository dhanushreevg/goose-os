import { useEffect, useRef } from 'react';
import { greeting } from '@goose/shared-utils';
import { useShell, ShellProvider } from './store';
import { useClock } from './hooks/useClock';
import { useSettings } from './hooks/useSettings';
import { useSystemHealth } from './hooks/useSystemHealth';
import { useKeyboard } from './hooks/useKeyboard';
import { appById } from './registry';
import { Wallpaper } from './components/Wallpaper';
import { TopPanel } from './components/TopPanel';
import { Dock } from './components/Dock';
import { WorkspaceView } from './components/WorkspaceView';
import { Launcher } from './components/Launcher';
import { QuickSettings } from './components/QuickSettings';
import { NotificationCenter } from './components/NotificationCenter';
import { ToastHost } from './components/ToastHost';

export function App() {
  return (
    <ShellProvider>
      <ShellApp />
    </ShellProvider>
  );
}

function ShellApp() {
  const { state, dispatch } = useShell();
  const settings = useSettings();
  const clock = useClock();
  const system = useSystemHealth();

  useKeyboard(dispatch, {
    activeWorkspace: state.activeWorkspace,
    workspaceCount: state.workspaces,
  });

  const offlineNotified = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch({
        type: 'NOTIFY',
        notification: {
          appId: 'system',
          title: `${greeting()} from GOOSE OS`,
          body: 'Interactive prototype. Press Super+A to launch an app, Alt+1…4 to switch workspaces.',
        },
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (system.health.source === 'offline' && !offlineNotified.current) {
      offlineNotified.current = true;
      dispatch({
        type: 'NOTIFY',
        notification: {
          appId: 'system',
          title: 'Offline',
          body: 'The system bridge is unreachable — showing bundled demo data. Everything keeps working.',
        },
      });
    }
  }, [system.health.source, dispatch]);

  const focusedWindow = state.windows.find((window) => window.id === state.focusedWindowId);
  const activeAppName = focusedWindow ? appById(focusedWindow.appId).name : 'Desktop';

  return (
    <div role="application" aria-label="GOOSE OS desktop" className="relative h-full overflow-hidden text-ink">
      <Wallpaper />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center pb-24"
      >
        <div className="flex select-none flex-col items-center gap-1 text-center">
          <span className="text-6xl font-semibold tracking-tight text-ink-muted/70 tabular-nums">
            {clock.time}
          </span>
          <span className="text-lg text-ink-muted/70">
            {greeting()} · {clock.date}
          </span>
        </div>
      </div>

      <WorkspaceView />
      <TopPanel clock={clock} settings={settings} system={system} />
      <Dock />

      {state.overlay !== null && (
        <button
          type="button"
          aria-label="Close overlay"
          tabIndex={-1}
          className={
            state.overlay === 'launcher'
              ? 'absolute inset-0 z-40 bg-black/30 backdrop-blur-sm'
              : 'absolute inset-0 z-40'
          }
          onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })}
        />
      )}
      {state.overlay === 'launcher' && <Launcher />}
      {state.overlay === 'quick' && <QuickSettings />}
      {state.overlay === 'notifications' && <NotificationCenter />}

      <ToastHost />

      <footer
        aria-hidden="true"
        className="pointer-events-none absolute bottom-14 left-1/2 z-0 hidden -translate-x-1/2 text-xs text-ink-muted/70 sm:block"
      >
        {activeAppName} · GOOSE OS 0.1 prototype
      </footer>
    </div>
  );
}