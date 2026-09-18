/**
 * @goose/types — shared type definitions for GOOSE OS.
 *
 * Types in this package are consumed by the shell application, the system
 * service bridge and any future native desktop backend.
 */

/** Theme resolution modes. `system` follows the host OS preference. */
export type ThemeMode = 'light' | 'dark' | 'system';

/** The concrete theme that is currently applied to the UI. */
export type ResolvedTheme = 'light' | 'dark';

/** Implementation status of an app: `ready` is usable, `preview` is a mock. */
export type AppStatus = 'ready' | 'preview';

/** A registered, launchable application in the GOOSE OS prototype. */
export interface AppDefinition {
  id: string;
  name: string;
  description: string;
  /** Pinned to the dock by default. */
  pinned: boolean;
  /** Default workspace to open when spawned by the launcher. */
  defaultWorkspace: number;
  /** Accent color hint used for window chrome and app badges (CSS color). */
  tint: string;
  /** `ready` apps are fully functional; `preview` apps show placeholder windows. */
  kind?: AppStatus;
  /** Preferred window size when spawned. */
  defaultSize?: { w: number; h: number };
}

/** A desktop window card on a workspace. */
export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  workspace: number;
  focused: boolean;
  /** Window is minimised but kept alive. */
  minimized?: boolean;
  /** Stacking order within the workspace (higher is on top). */
  z?: number;
}

/** A user-facing notification. */
export interface Notification {
  id: string;
  appId: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

/** Live host information as reported by the system-service bridge. */
export interface SystemInfo {
  hostname: string;
  os: string;
  kernel: string;
  session: string;
  uptimeSeconds: number;
  loadAvg: [number, number, number];
  cpuCount: number;
  memory: {
    totalBytes: number;
    availableBytes: number;
    usedBytes: number;
    usedPercent: number;
  };
}

/** Live network status reported by the system-service bridge. */
export interface NetworkInfo {
  connected: boolean;
  ssid: string | null;
  signalPercent: number | null;
}

/** Battery status reported by the system-service bridge. */
export interface BatteryInfo {
  present: boolean;
  levelPercent: number | null;
  charging: boolean;
  timeToEmptyMinutes: number | null;
}

/** Audio status reported by the system-service bridge. */
export interface AudioInfo {
  volumePercent: number | null;
  muted: boolean;
}

/** Overall snapshot returned by `GET /api/health`. */
export interface BridgeHealth {
  ok: boolean;
  version: string;
  system: SystemInfo | null;
  network: NetworkInfo | null;
  battery: BatteryInfo | null;
  audio: AudioInfo | null;
}

/** Source of the system data currently shown in the UI. */
export type SystemSource = 'live' | 'demo' | 'offline';

/** User-editable shell settings persisted to localStorage via @goose/config. */
export interface ShellSettings {
  themeMode: ThemeMode;
  highContrast: boolean;
  reducedMotion: boolean;
  audioVolume: number;
  brightness: number;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
}