import type { BatteryInfo } from '@goose/types';
import { Icon } from '@goose/ui';
import type { IconName } from '@goose/ui';
import { appById } from '../registry';
import { useShell } from '../store';
import { workspaceName } from '../layout';
import { GooseLogo } from './GooseLogo';
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

const SOURCE_TINT: Record<string, string> = {
  live: 'var(--goose-accent-green)',
  demo: 'var(--goose-accent-yellow)',
  offline: 'var(--goose-accent-red)',
};

const SOURCE_LABEL: Record<string, string> = {
  live: 'Live system bridge',
  demo: 'Showing demo system data',
  offline: 'System bridge offline',
};

export function TopPanel({ clock, settings, system }: TopPanelProps) {
  const { state, dispatch } = useShell();
  const { network, battery, audio } = system.health.data;
  const source = system.health.source;

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
    boxShadow: 'var(--goose-shadow-sm)',
  };

  const start = (
    <div className="flex min-w-0 items-center gap-2">
      <button
        type="button"
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface active:bg-surface-solid"
        title="Open launcher (Super+A)"
        aria-label="Open launcher"
        onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'launcher' })}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-line">
          <GooseLogo alt="GOOSE OS logo" className="h-full w-full" fallbackSize={18} />
        </span>
        <span className="hidden text-sm font-semibold leading-none tracking-tight sm:block">
          GOOSE OS
        </span>
      </button>

      <div className="mx-1 hidden h-5 w-px bg-line md:block" />

      <div className="hidden items-center rounded-full border border-line/60 bg-white/70 px-1 py-0.5 md:flex">
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
        <span className="px-1.5 text-xs font-medium text-ink">
          {workspaceName(state.activeWorkspace)}
          <span className="text-ink-muted"> · {state.activeWorkspace + 1}/{state.workspaces}</span>
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

      <span className="hidden truncate px-2 text-sm text-ink-muted xl:block">{activeAppName}</span>
    </div>
  );

  const center = (
    <div className="flex min-w-0 flex-col items-center justify-center leading-none">
      <span className="text-sm font-medium tabular-nums text-ink">{clock.time}</span>
      <span className="mt-1 hidden text-[11px] font-normal text-ink-muted sm:block">
        {clock.date}
      </span>
    </div>
  );

  const end = (
    <div className="flex min-w-0 items-center justify-end gap-0.5">
      <span
        className="mr-1 hidden h-2 w-2 rounded-full lg:block"
        style={{ backgroundColor: SOURCE_TINT[source] }}
        title={SOURCE_LABEL[source]}
        aria-label={SOURCE_LABEL[source]}
      />

      <button
        type="button"
        className="rounded-full p-2 text-ink transition-colors hover:bg-surface active:bg-surface-solid"
        title={wifiOn ? `Wi-Fi ${network?.connected ? 'connected' : 'unavailable'}` : 'Wi-Fi off'}
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
          name={audio?.muted || (audio?.volumePercent ?? 0) === 0 ? 'volume-mute' : 'volume'}
          size={18}
        />
      </button>

      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-ink transition-colors hover:bg-surface active:bg-surface-solid"
        title={battery?.present ? (battery.charging ? 'Charging' : 'Battery') : 'Desktop'}
        aria-label={battery?.present && battery.levelPercent !== null ? `Battery ${battery.levelPercent} percent` : 'Battery'}
        onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'quick' })}
      >
        <Icon
          name={batteryIcon(battery)}
          size={16}
          className={lowBattery ? 'text-accent-red' : undefined}
        />
        {battery?.present && battery.levelPercent !== null && (
          <span className="text-xs font-medium tabular-nums">{battery.levelPercent}%</span>
        )}
      </button>

      <button
        type="button"
        className="rounded-full p-2 text-ink transition-colors hover:bg-surface active:bg-surface-solid"
        title="Notifications (Super+N)"
        aria-label="Open notifications"
        onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'notifications' })}
      >
        <Icon name="bell" size={18} />
      </button>

      <button
        type="button"
        className="ml-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand ring-1 ring-brand/20 transition-colors hover:bg-brand/15"
        title={`${clock.date} — open quick settings`}
        aria-label="User menu — open quick settings"
        onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'quick' })}
      >
        <Icon name="user" size={16} />
      </button>
    </div>
  );

  return (
    <header
      className="pointer-events-auto absolute inset-x-0 top-0 z-30 grid h-12 grid-cols-[1fr_auto_1fr] items-center gap-2 px-3"
      style={glassStyle}
    >
      {start}
      {center}
      {end}
    </header>
  );
}