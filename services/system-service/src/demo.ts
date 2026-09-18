import type { BridgeHealth } from '@goose/types';

const GB = 1024 ** 3;
const totalBytes = 16 * GB;
const availableBytes = 8.2 * GB;

/** Deterministic fallback payload served when the host is unavailable or demo mode is on. */
export const DEMO_HEALTH: BridgeHealth = {
  ok: true,
  version: '0.1.0',
  system: {
    hostname: 'goose-proto',
    os: 'GOOSE OS 0.1 (demo)',
    kernel: '6.8.0-demo',
    session: 'wayland',
    uptimeSeconds: 4 * 3600 + 23 * 60,
    loadAvg: [0.62, 0.44, 0.31],
    cpuCount: 8,
    memory: {
      totalBytes,
      availableBytes,
      usedBytes: totalBytes - availableBytes,
      usedPercent: Math.round(((totalBytes - availableBytes) / totalBytes) * 100),
    },
  },
  network: {
    connected: true,
    ssid: 'GOOSE-DEMO',
    signalPercent: 82,
  },
  battery: {
    present: true,
    levelPercent: 63,
    charging: false,
    timeToEmptyMinutes: 6 * 60,
  },
  audio: {
    volumePercent: 55,
    muted: false,
  },
};

/** Deep-cloned copy of the demo payload (callers may persist or mutate it). */
export function demoHealth(): BridgeHealth {
  return JSON.parse(JSON.stringify(DEMO_HEALTH)) as BridgeHealth;
}