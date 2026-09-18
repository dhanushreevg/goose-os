import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { WindowState } from '@goose/types';
import { Icon } from '@goose/ui';
import { appById } from '../registry';
import { appIcon } from '../appIcon';
import { useShell } from '../store';
import { AppBody } from './AppBody';

interface LiveGeometry {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DragStart {
  mode: 'move' | 'resize';
  pointerX: number;
  pointerY: number;
  baseX: number;
  baseY: number;
  baseW: number;
  baseH: number;
}

export function WindowCard({ window }: { window: WindowState }) {
  const { dispatch } = useShell();
  const app = appById(window.appId);
  const rootRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<LiveGeometry | null>(null);
  const dragStart = useRef<DragStart | null>(null);

  const geometry = live ?? { x: window.x, y: window.y, w: window.w, h: window.h };

  function begin(event: ReactPointerEvent<HTMLButtonElement>, mode: 'move' | 'resize') {
    if (event.button !== 0) return;
    const root = rootRef.current;
    if (!root) return;
    root.setPointerCapture(event.pointerId);
    dragStart.current = {
      mode,
      pointerX: event.clientX,
      pointerY: event.clientY,
      baseX: window.x,
      baseY: window.y,
      baseW: window.w,
      baseH: window.h,
    };
    setLive({ x: window.x, y: window.y, w: window.w, h: window.h });
    dispatch({ type: 'FOCUS_WINDOW', id: window.id });
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest('[data-control]')) return;
    void begin(event as unknown as ReactPointerEvent<HTMLButtonElement>, 'move');
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (!start || !live) return;
    const dx = event.clientX - start.pointerX;
    const dy = event.clientY - start.pointerY;
    if (start.mode === 'move') {
      setLive({ x: start.baseX + dx, y: start.baseY + dy, w: start.baseW, h: start.baseH });
    } else {
      setLive({
        x: start.baseX,
        y: start.baseY,
        w: Math.max(320, start.baseW + dx),
        h: Math.max(220, start.baseH + dy),
      });
    }
  }

  function onPointerUp() {
    const start = dragStart.current;
    if (start && live) {
      if (start.mode === 'move') {
        dispatch({ type: 'MOVE_WINDOW', id: window.id, x: live.x, y: live.y });
      } else {
        dispatch({ type: 'RESIZE_WINDOW', id: window.id, w: live.w, h: live.h });
      }
    }
    dragStart.current = null;
    setLive(null);
  }

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={`${window.title} window`}
      className="absolute"
      style={{
        left: geometry.x,
        top: geometry.y,
        width: geometry.w,
        height: geometry.h,
        zIndex: window.z ?? 0,
        boxShadow: window.focused ? 'var(--goose-shadow-lg)' : 'var(--goose-shadow)',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        className="flex h-full flex-col overflow-hidden rounded-[var(--goose-radius-lg)]"
        style={{
          backgroundColor: 'var(--goose-surface-solid)',
          border: `1px solid ${window.focused ? app.tint : 'var(--goose-border)'}`,
        }}
      >
        <div
          className="flex h-10 shrink-0 items-center gap-2 px-3"
          style={{ borderBottom: '1px solid var(--goose-border)' }}
        >
          <Icon name={appIcon(app.id)} size={16} style={{ color: app.tint }} />
          <span className="flex-1 truncate text-sm font-medium">{window.title}</span>
          {app.kind === 'preview' && (
            <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand">
              Preview
            </span>
          )}
          <button
            type="button"
            data-control
            aria-label={`Minimise ${window.title}`}
            title="Minimise"
            className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
            onClick={() => dispatch({ type: 'TOGGLE_MINIMIZE', id: window.id })}
          >
            <Icon name="minimize" size={16} />
          </button>
          <button
            type="button"
            data-control
            aria-label={`Close ${window.title}`}
            title="Close"
            className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-accent-red hover:text-white"
            onClick={() => dispatch({ type: 'CLOSE_WINDOW', id: window.id })}
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1">
          <AppBody appId={app.id} />
        </div>

        <button
          type="button"
          aria-label="Resize window"
          className="absolute bottom-0 right-0 z-10 h-4 w-4 cursor-nwse-resize"
          style={{
            borderRight: '1.5px solid var(--goose-border-strong)',
            borderBottom: '1.5px solid var(--goose-border-strong)',
            borderBottomRightRadius: 'var(--goose-radius-lg)',
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
            begin(event, 'resize');
          }}
        />
      </div>
    </div>
  );
}