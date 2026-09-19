import { useEffect, useState } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

export interface ClockValue {
  time: string;
  date: string;
}

export function useClock(intervalMs = 15000): ClockValue {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return {
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    date: now.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
  };
}