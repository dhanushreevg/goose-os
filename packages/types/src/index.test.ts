import { describe, expect, it } from 'vitest';
import type {
  AppDefinition,
  BatteryInfo,
  BridgeHealth,
  NetworkInfo,
  SystemInfo,
  WindowState,
} from './index';

describe('@goose/types', () => {
  it('base app and window shapes are well-formed', () => {
    const app = {
      id: 'files',
      name: 'Files',
      description: 'Browse files',
      pinned: true,
      defaultWorkspace: 0,
      tint: '#f97316',
      kind: 'preview',
      defaultSize: { w: 720, h: 480 },
    } satisfies AppDefinition;

    const window = {
      id: 'w1',
      appId: app.id,
      title: app.name,
      x: 0,
      y: 0,
      w: app.defaultSize.w,
      h: app.defaultSize.h,
      workspace: 0,
      focused: true,
      minimized: false,
      z: 1,
    } satisfies WindowState;

    expect(window.minimized).toBe(false);
    expect(window.z).toBe(1);
  });

  it('system payloads accept null subsystem degradation', () => {
    const health = {
      ok: true,
      version: '0.1.0',
      system: null,
      network: null,
      battery: null,
      audio: null,
    } satisfies BridgeHealth;

    const battery = { present: false, levelPercent: null, charging: false, timeToEmptyMinutes: null } satisfies BatteryInfo;
    const network = { connected: false, ssid: null, signalPercent: null } satisfies NetworkInfo;
    const system = {
      hostname: 'goose',
      os: 'Linux',
      kernel: '6.8.0',
      session: 'wayland',
      uptimeSeconds: 42,
      loadAvg: [0.1, 0.2, 0.3],
      cpuCount: 8,
      memory: { totalBytes: 1, availableBytes: 1, usedBytes: 0, usedPercent: 0 },
    } satisfies SystemInfo;

    expect(health.system).toBeNull();
    expect(battery.present).toBe(false);
    expect(network.connected).toBe(false);
    expect(system.cpuCount).toBe(8);
  });
});