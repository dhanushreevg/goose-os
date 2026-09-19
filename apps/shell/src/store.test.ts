import { describe, expect, it } from 'vitest';
import { createInitialState, shellReducer, WORKSPACE_COUNT } from './store';
import { appById } from './registry';

const Files = appById('files');
const Terminal = appById('terminal');

describe('shell reducer', () => {
  it('opens a window on the active workspace and focuses it', () => {
    let state = createInitialState();
    state = shellReducer(state, { type: 'OPEN_APP', app: Files });
    expect(state.windows).toHaveLength(1);
    const window = state.windows[0]!;
    expect(window.appId).toBe('files');
    expect(window.workspace).toBe(0);
    expect(state.focusedWindowId).toBe(window.id);
  });

  it('focuses an existing window instead of opening a duplicate', () => {
    let state = createInitialState();
    state = shellReducer(state, { type: 'OPEN_APP', app: Files });
    const id = state.windows[0]!.id;
    state = shellReducer(state, { type: 'SET_WORKSPACE', workspace: 1 });
    state = shellReducer(state, { type: 'OPEN_APP', app: Files });
    expect(state.windows).toHaveLength(1);
    expect(state.activeWorkspace).toBe(0);
    expect(state.focusedWindowId).toBe(id);
  });

  it('switches workspaces and restores focus to the topmost window', () => {
    let state = createInitialState();
    state = shellReducer(state, { type: 'OPEN_APP', app: Files });
    state = shellReducer(state, { type: 'OPEN_APP', app: Terminal });
    state = shellReducer(state, { type: 'SET_WORKSPACE', workspace: 1 });
    expect(state.activeWorkspace).toBe(1);
    expect(state.focusedWindowId).toBeNull();
    state = shellReducer(state, { type: 'SET_WORKSPACE', workspace: 0 });
    const focused = state.windows.find((window) => window.id === state.focusedWindowId);
    expect(focused?.appId).toBe('terminal');
  });

  it('clamps workspace changes', () => {
    const state = shellReducer(createInitialState(), {
      type: 'SET_WORKSPACE',
      workspace: 99,
    });
    expect(state.activeWorkspace).toBe(WORKSPACE_COUNT - 1);
  });

  it('minimises and restores windows', () => {
    let state = createInitialState();
    state = shellReducer(state, { type: 'OPEN_APP', app: Files });
    const id = state.windows[0]!.id;
    state = shellReducer(state, { type: 'TOGGLE_MINIMIZE', id });
    expect(state.windows[0]!.minimized).toBe(true);
    expect(state.focusedWindowId).toBeNull();
    state = shellReducer(state, { type: 'TOGGLE_MINIMIZE', id });
    expect(state.windows[0]!.minimized).toBe(false);
    expect(state.focusedWindowId).toBe(id);
  });

  it('closes windows and refocuses the topmost remaining', () => {
    let state = createInitialState();
    state = shellReducer(state, { type: 'OPEN_APP', app: Files });
    state = shellReducer(state, { type: 'OPEN_APP', app: Terminal });
    const closedId = state.focusedWindowId!;
    state = shellReducer(state, { type: 'CLOSE_WINDOW', id: closedId });
    expect(state.windows).toHaveLength(1);
    expect(state.focusedWindowId).not.toBe(closedId);
  });

  it('adds, marks and clears notifications', () => {
    let state = createInitialState();
    state = shellReducer(state, {
      type: 'NOTIFY',
      notification: { appId: 'system', title: 'Hi', body: 'Body' },
    });
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0]!.read).toBe(false);
    state = shellReducer(state, { type: 'MARK_NOTIFICATIONS_READ' });
    expect(state.notifications[0]!.read).toBe(true);
    state = shellReducer(state, { type: 'DISMISS_NOTIFICATION', id: state.notifications[0]!.id });
    expect(state.notifications).toHaveLength(0);
    state = shellReducer(state, {
      type: 'NOTIFY',
      notification: { appId: 'system', title: 'Hi', body: 'Body' },
    });
    state = shellReducer(state, { type: 'CLEAR_NOTIFICATIONS' });
    expect(state.notifications).toHaveLength(0);
  });

  it('moves and resizes windows with minimum bounds', () => {
    let state = createInitialState();
    state = shellReducer(state, { type: 'OPEN_APP', app: Files });
    const id = state.windows[0]!.id;
    state = shellReducer(state, { type: 'MOVE_WINDOW', id, x: 10, y: 20 });
    expect(state.windows[0]!.x).toBe(10);
    expect(state.windows[0]!.y).toBe(20);
    state = shellReducer(state, { type: 'RESIZE_WINDOW', id, w: 50, h: 40 });
    expect(state.windows[0]!.w).toBe(320);
    expect(state.windows[0]!.h).toBe(220);
  });

  it('maximises and restores windows', () => {
    let state = createInitialState();
    state = shellReducer(state, { type: 'OPEN_APP', app: Files });
    const id = state.windows[0]!.id;
    const original = { x: state.windows[0]!.x, y: state.windows[0]!.y, w: state.windows[0]!.w, h: state.windows[0]!.h };
    state = shellReducer(state, { type: 'MAXIMIZE_WINDOW', id });
    expect(state.windows[0]!.maximized).toBe(true);
    expect(state.windows[0]!.prevBounds).toEqual(original);
    state = shellReducer(state, { type: 'MAXIMIZE_WINDOW', id });
    expect(state.windows[0]!.maximized).toBe(false);
    expect(state.windows[0]!.x).toBe(original.x);
    expect(state.windows[0]!.w).toBe(original.w);
  });

  it('registers preview windows from the registry', () => {
    const ai = appById('ai-center');
    expect(ai.kind).toBe('preview');
    expect(ai.defaultSize).toBeDefined();
  });
});