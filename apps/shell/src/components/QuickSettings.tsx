import type { SystemSource } from '@goose/types';
import { Button, Icon, SegmentedControl, Slider, Switch } from '@goose/ui';
import { formatBytes, formatUptime } from '@goose/shared-utils';
import { useShell } from '../store';
import { useSettings } from '../hooks/useSettings';
import { useSystemHealth } from '../hooks/useSystemHealth';

const SOURCE: Record<SystemSource, { label: string; color: string }> = {
  live: { label: 'Live', color: 'var(--goose-accent-green)' },
  demo: { label: 'Demo data', color: 'var(--goose-accent-yellow)' },
  offline: { label: 'Offline', color: 'var(--goose-accent-red)' },
};

export function QuickSettings() {
  const { state } = useShell();
  const { settings, update, resolved } = useSettings();
  const { health, refresh } = useSystemHealth();
  const system = health.data.system;
  const source = SOURCE[health.source];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-14 z-50 flex justify-end pr-3">
      <div
        role="dialog"
        aria-label="Quick settings"
        className="goose-glass pointer-events-auto w-full max-w-sm goose-radius-xl p-5 shadow-[var(--goose-shadow-lg)]"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-ink">Quick settings</h2>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${source.color}22`, color: source.color }}
            >
              {source.label}
            </span>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Refresh system status"
              title="Refresh system status"
              onClick={refresh}
            >
              <Icon name="refresh" size={14} />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <SegmentedControl
            label="Theme"
            value={settings.themeMode}
            onChange={(value) => update('themeMode', value as typeof settings.themeMode)}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'system', label: 'System' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-ink">
              <Icon name="wifi" size={16} />
              Wi-Fi
            </span>
            <Switch
              checked={settings.wifiEnabled}
              onChange={(value) => update('wifiEnabled', value)}
              label="Wi-Fi"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-ink">
              <Icon name="bluetooth" size={16} />
              Bluetooth
            </span>
            <Switch
              checked={settings.bluetoothEnabled}
              onChange={(value) => update('bluetoothEnabled', value)}
              label="Bluetooth"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-ink">
              <Icon name="sparkle" size={16} />
              High contrast
            </span>
            <Switch
              checked={settings.highContrast}
              onChange={(value) => update('highContrast', value)}
              label="High contrast"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-ink">
              <Icon name="refresh" size={16} />
              Reduced motion
            </span>
            <Switch
              checked={settings.reducedMotion}
              onChange={(value) => update('reducedMotion', value)}
              label="Reduced motion"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <Slider
            value={settings.audioVolume}
            onChange={(value) => update('audioVolume', value)}
            label="Volume"
          />
          <Slider
            value={settings.brightness}
            onChange={(value) => update('brightness', value)}
            label="Brightness"
          />
        </div>

        {system && (
          <div className="mt-5 rounded-glass bg-surface p-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <span className="text-ink-muted">Host</span>
              <span className="truncate text-right font-mono text-ink">{system.hostname}</span>
              <span className="text-ink-muted">OS</span>
              <span className="truncate text-right font-mono text-ink">{system.os}</span>
              <span className="text-ink-muted">Kernel</span>
              <span className="truncate text-right font-mono text-ink">{system.kernel}</span>
              <span className="text-ink-muted">Session</span>
              <span className="truncate text-right font-mono text-ink">{system.session}</span>
              <span className="text-ink-muted">Uptime</span>
              <span className="truncate text-right font-mono text-ink">
                {formatUptime(system.uptimeSeconds)}
              </span>
              <span className="text-ink-muted">Memory</span>
              <span className="truncate text-right font-mono text-ink">
                {formatBytes(system.memory.totalBytes - system.memory.availableBytes)}
                {` / ${formatBytes(system.memory.totalBytes)}`}
              </span>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-ink-muted">
          GOOSE OS 0.1 · Workspace {state.activeWorkspace + 1} of {state.workspaces} · Theme {resolved}
        </p>
      </div>
    </div>
  );
}