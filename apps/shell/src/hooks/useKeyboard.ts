import { useEffect } from 'react';
import type { Dispatch } from 'react';
import type { ShellAction } from '../store';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  );
}

export interface KeyboardBindings {
  activeWorkspace: number;
  workspaceCount: number;
}

export function useKeyboard(
  dispatch: Dispatch<ShellAction>,
  bindings: KeyboardBindings,
) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = isTypingTarget(event.target);
      const withMod = event.altKey || event.metaKey;

      if (event.key === 'Escape') {
        dispatch({ type: 'CLOSE_OVERLAY' });
        return;
      }

      if ((event.metaKey || event.altKey) && (event.key === ' ' || event.key.toLowerCase() === 'a')) {
        event.preventDefault();
        dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'launcher' });
        return;
      }
      if ((event.metaKey || event.altKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'quick' });
        return;
      }
      if ((event.metaKey || event.altKey) && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        dispatch({ type: 'TOGGLE_OVERLAY', overlay: 'notifications' });
        return;
      }

      if (typing) return;

      if (event.altKey) {
        const digit = Number(event.key);
        if (digit >= 1 && digit <= bindings.workspaceCount) {
          event.preventDefault();
          dispatch({ type: 'SET_WORKSPACE', workspace: digit - 1 });
          return;
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          dispatch({
            type: 'SET_WORKSPACE',
            workspace: (bindings.activeWorkspace + 1) % bindings.workspaceCount,
          });
          return;
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          dispatch({
            type: 'SET_WORKSPACE',
            workspace:
              (bindings.activeWorkspace - 1 + bindings.workspaceCount) % bindings.workspaceCount,
          });
        }
      }

      if (withMod) {
        const ignored = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
        if (ignored.has(event.key)) event.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, bindings.activeWorkspace, bindings.workspaceCount]);
}