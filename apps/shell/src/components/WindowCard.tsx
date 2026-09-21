import { useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import type { WindowState } from '@goose/types';
import { Icon } from '@goose/ui';
import { appById } from '../registry';
import { appIcon, isGoogleApp } from '../appIcon';
import { useShell } from '../store';
import { cn, clamp } from '@goose/shared-utils';
import { AppBody } from './AppBody';
import { AppBadge } from './AppGlyph';

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

const MIN_W = 320;
const MIN_H = 220;
const MIN_VISIBLE = 80;

/** Keep at least `MIN_VISIBLE` px of the window on-screen within its parent. */
function clampBounds(
  parent: HTMLElement,
  bounds: { x: number; y: number; w: number; h: number },
  mode: DragStart['mode'],
): LiveGeometry {
  const pw = parent.clientWidth;
  const ph = parent.clientHeight;
  if (mode === 'resize') {
    return {
      x: bounds.x,
      y: bounds.y,
      w: clamp(bounds.w, MIN_W, pw),
      h: clamp(bounds.h, MIN_H, ph),
    };
  }
  return {
    x: clamp(bounds.x, -bounds.w + MIN_VISIBLE, pw - MIN_VISIBLE),
    y: clamp(bounds.y, 0, Math.max(0, ph - MIN_VISIBLE)),
    w: bounds.w,
    h: bounds.h,
  };
}

export function WindowCard({ window }: { window: WindowState }) {
  const { dispatch } = useShell();
  const app = appById(window.appId);
  const rootRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<LiveGeometry | null>(null);
  const dragStart = useRef<DragStart | null>(null);

  const maximized = window.maximized === true;
  const geometry = maximized || live === null ? { x: window.x, y: window.y, w: window.w, h: window.h } : live;

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
    if (maximized) return;
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
        w: Math.max(MIN_W, start.baseW + dx),
        h: Math.max(MIN_H, start.baseH + dy),
      });
    }
  }

  function onPointerUp() {
    const start = dragStart.current;
    const parent = rootRef.current?.parentElement ?? null;
    if (start && live) {
      const bounds = parent ? clampBounds(parent, live, start.mode) : live;
      if (start.mode === 'move') {
        dispatch({ type: 'MOVE_WINDOW', id: window.id, x: bounds.x, y: bounds.y });
      } else {
        dispatch({ type: 'RESIZE_WINDOW', id: window.id, w: bounds.w, h: bounds.h });
      }
    }
    dragStart.current = null;
    setLive(null);
  }

  const frameStyle: CSSProperties = maximized
    ? { zIndex: window.z ?? 0 }
    : {
        left: geometry.x,
        top: geometry.y,
        width: geometry.w,
        height: geometry.h,
        zIndex: window.z ?? 0,
        boxShadow: window.focused ? 'var(--goose-shadow-lg)' : 'var(--goose-shadow)',
      };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={`${window.title} window`}
      className={cn('goose-window-card absolute', maximized && 'inset-0')}
      style={frameStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        className="flex h-full flex-col overflow-hidden rounded-[var(--goose-radius-lg)] bg-surface-solid"
        style={{
          border: `1px solid ${window.focused ? app.tint : 'var(--goose-border)'}`,
          transition: 'border-color var(--goose-duration) var(--goose-ease)',
        }}
      >
        <div
          className="flex h-10 shrink-0 select-none items-center gap-2 px-3"
          style={{ borderBottom: '1px solid var(--goose-border)' }}
        >
          {isGoogleApp(app.id) ? (
            <AppBadge appId={app.id} size={16} />
          ) : (
            <Icon name={appIcon(app.id)} size={16} style={{ color: app.tint }} />
          )}
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
            aria-label={maximized ? `Restore ${window.title}` : `Maximise ${window.title}`}
            title={maximized ? 'Restore' : 'Maximise'}
            className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink"
            onClick={() => dispatch({ type: 'MAXIMIZE_WINDOW', id: window.id })}
          >
            <Icon name={maximized ? 'restore' : 'maximize'} size={16} />
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

        {!maximized && (
          <button
            type="button"
            data-control
            aria-label="Resize window"
            title="Resize window"
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
        )}
      </div>
    </div>
  );
}