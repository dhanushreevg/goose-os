import { useCallback, useEffect, useState } from 'react';
import type { BridgeHealth, SystemSource } from '@goose/types';
import { DEMO_HEALTH } from '../demoHealth';

export interface SystemHealthState {
  source: SystemSource;
  data: BridgeHealth;
}

export interface SystemHealthController {
  health: SystemHealthState;
  refresh: () => void;
}

const liveSource = new URL(
  import.meta.env.VITE_GOOSE_SERVICE_URL ?? '/api/health',
  window.location.origin,
).toString();

export function useSystemHealth(intervalMs = 3000): SystemHealthController {
  const [health, setHealth] = useState<SystemHealthState>({
    source: 'demo',
    data: DEMO_HEALTH,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const res = await fetch(liveSource, { cache: 'no-store' });
        if (!res.ok) throw new Error(`health ${res.status}`);
        const data = (await res.json()) as BridgeHealth;
        if (cancelled) return;
        if (data.ok) {
          setHealth({ source: 'live', data });
        } else {
          setHealth((prev) => ({ source: 'demo', data: prev.data }));
        }
      } catch {
        if (cancelled) return;
        setHealth((prev) =>
          prev.source === 'offline' ? prev : { source: 'offline', data: prev.data },
        );
      }
    }
    void poll();
    const id = window.setInterval(() => void poll(), intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [intervalMs, tick]);

  return {
    health,
    refresh: useCallback(() => setTick((value) => value + 1), []),
  };
}