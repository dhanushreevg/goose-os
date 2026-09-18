/* eslint-disable react-refresh/only-export-components -- reducer + context + hooks shared by every component. */
import { createContext, useContext, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { AppDefinition, Notification, WindowState } from '@goose/types';
import { uid } from '@goose/shared-utils';

export const WORKSPACE_COUNT = 4;

export type OverlayId = 'launcher' | 'quick' | 'notifications' | null;

export interface ShellState {
  workspaces: number;
  activeWorkspace: number;
  windows: WindowState[];
  notifications: Notification[];
  overlay: OverlayId;
  focusedWindowId: string | null;
  launchCount: number;
}

export type ShellAction =
  | { type: 'OPEN_APP'; app: AppDefinition }
  | { type: 'CLOSE_WINDOW'; id: string }
  | { type: 'TOGGLE_MINIMIZE'; id: string }
  | { type: 'FOCUS_WINDOW'; id: string }
  | { type: 'MOVE_WINDOW'; id: string; x: number; y: number }
  | { type: 'RESIZE_WINDOW'; id: string; w: number; h: number }
  | { type: 'SET_WORKSPACE'; workspace: number }
  | { type: 'TOGGLE_OVERLAY'; overlay: OverlayId }
  | { type: 'CLOSE_OVERLAY' }
  | {
      type: 'NOTIFY';
      notification: Omit<Notification, 'id' | 'timestamp' | 'read'>;
    }
  | { type: 'DISMISS_NOTIFICATION'; id: string }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'CLEAR_NOTIFICATIONS' };

function maxZ(windows: WindowState[]): number {
  return windows.reduce((highest, window) => Math.max(highest, window.z ?? 0), 0);
}

function topmostOf(windows: WindowState[], workspace: number): WindowState | undefined {
  return windows
    .filter((window) => window.workspace === workspace && !window.minimized)
    .sort((a, b) => (b.z ?? 0) - (a.z ?? 0))[0];
}

export function createInitialState(): ShellState {
  return {
    workspaces: WORKSPACE_COUNT,
    activeWorkspace: 0,
    windows: [],
    notifications: [],
    overlay: null,
    focusedWindowId: null,
    launchCount: 0,
  };
}

export function shellReducer(state: ShellState, action: ShellAction): ShellState {
  switch (action.type) {
    case 'OPEN_APP': {
      const existing = state.windows.find((window) => window.appId === action.app.id);
      if (existing) {
        const windows = state.windows.map((window) =>
          window.id === existing.id
            ? {
                ...window,
                focused: true,
                minimized: false,
                z: maxZ(state.windows) + 1,
              }
            : { ...window, focused: false },
        );
        return {
          ...state,
          windows,
          focusedWindowId: existing.id,
          activeWorkspace: existing.workspace,
          overlay: null,
        };
      }
      const size = action.app.defaultSize ?? { w: 640, h: 420 };
      const cascade = state.launchCount % 6;
      const window: WindowState = {
        id: uid('win'),
        appId: action.app.id,
        title: action.app.name,
        x: 96 + cascade * 24,
        y: 56 + cascade * 20,
        w: Math.min(size.w, 1120),
        h: Math.min(size.h, 720),
        workspace: state.activeWorkspace,
        focused: true,
        minimized: false,
        z: maxZ(state.windows) + 1,
      };
      return {
        ...state,
        windows: [...state.windows.map((w) => ({ ...w, focused: false })), window],
        focusedWindowId: window.id,
        launchCount: state.launchCount + 1,
        overlay: null,
      };
    }
    case 'CLOSE_WINDOW': {
      const windows = state.windows.filter((window) => window.id !== action.id);
      const topmost = topmostOf(windows, state.activeWorkspace);
      return {
        ...state,
        windows,
        focusedWindowId:
          state.focusedWindowId === action.id ? (topmost?.id ?? null) : state.focusedWindowId,
      };
    }
    case 'TOGGLE_MINIMIZE': {
      const target = state.windows.find((window) => window.id === action.id);
      if (!target) return state;
      if (target.minimized) {
        const windows = state.windows.map((window) =>
          window.id === action.id
            ? { ...window, minimized: false, focused: true, z: maxZ(state.windows) + 1 }
            : { ...window, focused: false },
        );
        return { ...state, windows, focusedWindowId: action.id };
      }
      const windows = state.windows.map((window) =>
        window.id === action.id ? { ...window, minimized: true, focused: false } : window,
      );
      const topmost = topmostOf(windows, state.activeWorkspace);
      return { ...state, windows, focusedWindowId: topmost?.id ?? null };
    }
    case 'FOCUS_WINDOW': {
      const windows = state.windows.map((window) =>
        window.id === action.id
          ? { ...window, focused: true, minimized: false, z: maxZ(state.windows) + 1 }
          : { ...window, focused: false },
      );
      return { ...state, windows, focusedWindowId: action.id };
    }
    case 'MOVE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map((window) =>
          window.id === action.id
            ? { ...window, x: action.x, y: action.y }
            : window,
        ),
      };
    }
    case 'RESIZE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map((window) =>
          window.id === action.id
            ? { ...window, w: Math.max(320, action.w), h: Math.max(220, action.h) }
            : window,
        ),
      };
    }
    case 'SET_WORKSPACE': {
      const workspace = Math.max(0, Math.min(state.workspaces - 1, action.workspace));
      const topmost = topmostOf(state.windows, workspace);
      return {
        ...state,
        activeWorkspace: workspace,
        overlay: null,
        focusedWindowId: topmost?.id ?? null,
      };
    }
    case 'TOGGLE_OVERLAY': {
      return { ...state, overlay: state.overlay === action.overlay ? null : action.overlay };
    }
    case 'CLOSE_OVERLAY': {
      return { ...state, overlay: null };
    }
    case 'NOTIFY': {
      const notification: Notification = {
        id: uid('notification'),
        timestamp: Date.now(),
        read: false,
        ...action.notification,
      };
      return {
        ...state,
        notifications: [...state.notifications, notification].slice(-30),
      };
    }
    case 'DISMISS_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter((item) => item.id !== action.id),
      };
    }
    case 'MARK_NOTIFICATIONS_READ': {
      return {
        ...state,
        notifications: state.notifications.map((item) => ({ ...item, read: true })),
      };
    }
    case 'CLEAR_NOTIFICATIONS': {
      return { ...state, notifications: [] };
    }
  }
}

export interface ShellContextValue {
  state: ShellState;
  dispatch: Dispatch<ShellAction>;
}

export const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used within ShellProvider');
  return ctx;
}

export interface ShellProviderProps {
  children: ReactNode;
  initial?: Partial<ShellState>;
}

export function ShellProvider({ children, initial }: ShellProviderProps) {
  const [state, dispatch] = useReducer(
    shellReducer,
    { ...createInitialState(), ...initial },
    (base) => base,
  );
  return (
    <ShellContext.Provider value={{ state, dispatch }}>
      {children}
    </ShellContext.Provider>
  );
}