import os from 'node:os';
import { readFileSync, readdirSync } from 'node:fs';
import { execFile } from 'node:child_process';
import type { AudioInfo, BatteryInfo, NetworkInfo, SystemInfo } from '@goose/types';
import { parsePactlMuted, parsePactlVolume } from './audio';

function runOutput(command: string, args: string[]): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    execFile(command, args, { timeout: 2000 }, (error, stdout) => {
      resolve(error ? null : String(stdout));
    });
  });
}

async function collectAudio(): Promise<AudioInfo | null> {
  try {
    const [volumeOut, muteOut] = await Promise.all([
      runOutput('pactl', ['get-sink-volume', '@DEFAULT_SINK@']),
      runOutput('pactl', ['get-sink-mute', '@DEFAULT_SINK@']),
    ]);
    const volumePercent = volumeOut === null ? null : parsePactlVolume(volumeOut);
    if (volumePercent === null && muteOut === null) return null;
    return {
      volumePercent,
      muted: muteOut === null ? false : parsePactlMuted(muteOut),
    };
  } catch {
    return null;
  }
}

async function collectBattery(): Promise<BatteryInfo | null> {
  try {
    const base = '/sys/class/power_supply';
    const entries = readdirSync(base);
    const battery = entries.find((entry) => entry.startsWith('BAT'));
    if (!battery) return null;
    const dir = `${base}/${battery}`;
    const read = (file: string): string | null => {
      try {
        return readFileSync(`${dir}/${file}`, 'utf8').trim();
      } catch {
        return null;
      }
    };
    const present = read('present') ?? '1';
    if (present !== '1') return null;
    const rawCapacity = Number(read('capacity'));
    const levelPercent = Number.isFinite(rawCapacity) ? Math.min(100, Math.max(0, rawCapacity)) : null;
    const status = read('status') ?? '';
    const charging = status === 'Charging';
    const energyNow = Number(read('energy_now'));
    const powerNow = Number(read('power_now'));
    let timeToEmptyMinutes: number | null = null;
    if (Number.isFinite(energyNow) && Number.isFinite(powerNow) && powerNow > 0) {
      timeToEmptyMinutes = Math.max(0, Math.round((energyNow / powerNow) * 60));
    }
    return { present: true, levelPercent, charging, timeToEmptyMinutes };
  } catch {
    return null;
  }
}

function collectNetwork(): NetworkInfo | null {
  try {
    const base = '/sys/class/net';
    const entries = readdirSync(base);
    const candidates = entries.filter((entry) => entry !== 'lo');
    if (candidates.length === 0) return null;
    let connected = false;
    for (const entry of candidates) {
      try {
        const state = readFileSync(`${base}/${entry}/operstate`, 'utf8').trim();
        if (state === 'up') {
          connected = true;
          break;
        }
      } catch {
        /* interface without operstate is ignored */
      }
    }
    return { connected, ssid: null, signalPercent: null };
  } catch {
    return null;
  }
}

function collectSystem(): SystemInfo | null {
  try {
    const totalBytes = os.totalmem();
    const availableBytes = os.freemem();
    const load = os.loadavg();
    const [a = 0, b = 0, c = 0] = load;
    return {
      hostname: os.hostname(),
      os: `${os.type()} ${os.version()}`,
      kernel: os.release(),
      session: process.env.XDG_SESSION_TYPE ?? process.env.DESKTOP_SESSION ?? 'unknown',
      uptimeSeconds: Math.floor(os.uptime()),
      loadAvg: [Number(a.toFixed(2)), Number(b.toFixed(2)), Number(c.toFixed(2))],
      cpuCount: os.cpus().length,
      memory: {
        totalBytes,
        availableBytes,
        usedBytes: totalBytes - availableBytes,
        usedPercent: Math.round(((totalBytes - availableBytes) / totalBytes) * 100),
      },
    };
  } catch {
    return null;
  }
}

/** Collect every subsystem independently; each failure degrades to `null`. */
export async function collectHealth(version: string) {
  const [system, network, battery, audio] = await Promise.all([
    Promise.resolve(collectSystem()),
    Promise.resolve(collectNetwork()),
    collectBattery(),
    collectAudio(),
  ]);
  return { version, system, network, battery, audio };
}