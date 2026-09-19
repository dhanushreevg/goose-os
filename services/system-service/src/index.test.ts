import { describe, expect, it } from 'vitest';
import { createGooseServer, buildHealth, VERSION } from './index';
import { demoHealth } from './demo';
import { parsePactlMuted, parsePactlVolume } from './audio';

describe('@goose/system-service', () => {
  it('buildHealth returns a well-formed BridgeHealth payload', async () => {
    const health = await buildHealth();
    expect(health.ok).toBe(true);
    expect(health.version).toBe(VERSION);
    for (const key of ['system', 'network', 'battery', 'audio'] as const) {
      const group = health[key];
      if (group !== null) {
        expect(typeof group).toBe('object');
      }
    }
    expect(health).toHaveProperty('version');
  });

  it('demoHealth is deterministic and self-consistent', () => {
    const a = demoHealth();
    const b = demoHealth();
    expect(a).toEqual(b);
    expect(a.system?.memory.usedBytes).toBe(
      a.system!.memory.totalBytes - a.system!.memory.availableBytes,
    );
    expect(a.ok).toBe(true);
  });

  it('parsePactlVolume reads a percent from pactl output', () => {
    expect(parsePactlVolume('Volume: front-left: 32768 /  50% / -18.06 dB, front-right: 32768 /  50%')).toBe(50);
    expect(parsePactlVolume('Mute: no')).toBeNull();
  });

  it('parsePactlMuted handles yes and no', () => {
    expect(parsePactlMuted('Mute: yes')).toBe(true);
    expect(parsePactlMuted('Mute: no')).toBe(false);
  });

  it('server responds 404 for unknown routes', async () => {
    const server = createGooseServer();
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('no port');
    const res = await fetch(`http://127.0.0.1:${address.port}/nope`);
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('not found');
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});