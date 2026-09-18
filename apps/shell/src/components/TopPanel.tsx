import type { BatteryInfo } from '@goose/types';
import { Icon } from '@goose/ui';
import type { IconName } from '@goose/ui';
import { appById } from '../registry';
import { useShell } from '../store';
import type { ClockValue } from '../hooks/useClock';
import type { SettingsController } from '../hooks/useSettings';
import type { SystemHealthController } from '../hooks/useSystemHealth';

function batteryIcon(battery: BatteryInfo | null): IconName {
  if (!battery?.present || battery.levelPercent === null) return 'power';
  return battery.charging ? 'battery-charging' : 'battery';
}

export interface TopPanelProps {
  clock: ClockValue;
  settings: SettingsController;
  system: SystemHealthController;
}

export function TopPanel({ clock, settings, system }: TopPanelProps) {
  const { state, dispatch } = useShell();
  const { network, battery, audio } = system.health.data;

  const focusedWindow = state.windows.find((window) => window.id === state.focusedWindowId);
  const activeAppName = focusedWindow ? appById(focusedWindow.appId).name : 'Desktop';

  const wifiOn = settings.settings.wifiEnabled;
  const lowBattery =
    battery !== null &&
    battery.levelPercent !== null &&
    battery.levelPercent <= 20 &&
    !battery.charging;

  const glassStyle = {
    backgroundColor: 'var(--goose-surface)',
    backdropFilter: 'blur(var(--goose-blur)) saturate(1.2)',
    WebkitBackdropFilter: 'blur(var(--goose-blur)) saturate(1.2)',
    borderBottom: '1px solid var(--goose-border)',
  };

  return (
    <header
      className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex h-12 items-center justify-between gap-2 px-3"
      style={glassStyle}
    >
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-2 rounded-glass px-2 py-1 transition-colors hover:bg-surface active:bg-surface-solid"
          title="Open launcher"
          aria-label="Open launcher"
          onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'launcher' })}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-glass bg-brand text-brand-contrast">
            <Icon name="goose" size={16} />
          </span>
          <span className="text-sm font-semibold leading-none">GOOSE OS</span>
        </button>

        <div className="mx-1 hidden h-5 w-px bg-line sm:block" />

        <div className="hidden items-center rounded-glass bg-surface px-1 py-0.5 sm:flex">
          <button
            type="button"
            className="rounded-full p-1 text-ink-muted transition-colors hover:bg-surface-solid hover:text-ink"
            title="Previous workspace (Alt+Left)"
            aria-label="Previous workspace"
            onClick={() =>
              dispatch({
                type: 'SET_WORKSPACE',
                workspace: (state.activeWorkspace - 1 + state.workspaces) % state.workspaces,
              })
            }
          >
            <Icon name="chevron-left" size={14} />
          </button>
          <span className="px-1 text-xs text-ink-muted">
            Workspace {state.activeWorkspace + 1} of {state.workspaces}
          </span>
          <button
            type="button"
            className="rounded-full p-1 text-ink-muted transition-colors hover:bg-surface-solid hover:text-ink"
            title="Next workspace (Alt+Right)"
            aria-label="Next workspace"
            onClick={() =>
              dispatch({
                type: 'SET_WORKSPACE',
                workspace: (state.activeWorkspace + 1) % state.workspaces,
              })
            }
          >
            <Icon name="chevron-right" size={14} />
          </button>
        </div>

        <span className="hidden truncate pl-2 text-sm text-ink-muted md:block">
          {activeAppName}
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-0.5">
        <button
          type="button"
          className="rounded-full p-2 text-ink transition-colors hover:bg-surface active:bg-surface-solid"
          title={wifiOn ? 'Wi-Fi connected' : 'Wi-Fi off'}
          aria-label={wifiOn ? 'Wi-Fi connected — open quick settings' : 'Wi-Fi off — open quick settings'}
          onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'quick' })}
        >
          <Icon name={wifiOn ? (network?.connected ? 'wifi' : 'wifi-off') : 'wifi-off'} size={18} />
        </button>

        <button
          type="button"
          className="rounded-full p-2 text-ink transition-colors hover:bg-surface active:bg-surface-solid"
          title={audio?.muted || (audio?.volumePercent ?? 0) === 0 ? 'Muted' : `Volume ${audio?.volumePercent ?? '—'}%`}
          aria-label="Audio — open quick settings"
          onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'quick' })}
        >
          <Icon
            name={
              audio?.muted || (audio?.volumePercent ?? 0) === 0 ? 'volume-mute' : 'volume'
            }
            size={18}
          />
        </button>

        <div
          className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-ink-muted"
          title={battery?.present ? (battery.charging ? 'Charging' : 'Battery') : 'Desktop'}
        >
          <Icon
            name={batteryIcon(battery)}
            size={16}
            className={lowBattery ? 'text-accent-red' : undefined}
          />
          {battery?.present && battery.levelPercent !== null && (
            <span className="font-mono">{battery.levelPercent}%</span>
          )}
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-glass px-2 py-1 transition-colors hover:bg-surface active:bg-surface-solid"
          title={`${clock.date} — open quick settings`}
          aria-label="Clock — open quick settings"
          onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'quick' })}
        >
          <span className="text-sm font-medium tabular-nums">{clock.time}</span>
        </button>

        <button
          type="button"
          className="ml-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-brand-contrast transition-opacity hover:opacity-90"
          title="User — open quick settings"
          aria-label="User menu — open quick settings"
          onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'quick' })}
        >
          <Icon name="user" size={16} />
        </button>
      </div>
    </header>
  );
}