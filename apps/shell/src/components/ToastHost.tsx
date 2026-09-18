import { useEffect, useState } from 'react';
import { Icon } from '@goose/ui';
import type { Notification } from '@goose/types';
import { appIcon } from '../appIcon';
import { useShell } from '../store';

export function ToastHost() {
  const { state, dispatch } = useShell();
  const latest = state.notifications[state.notifications.length - 1];
  const latestId = latest?.id;
  const [visible, setVisible] = useState<Notification | null>(null);

  useEffect(() => {
    if (!latest) {
      setVisible(null);
      return;
    }
    setVisible(latest);
    const timer = window.setTimeout(() => {
      setVisible((current) => (current?.id === latest.id ? null : current));
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [latest, latestId]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="goose-glass pointer-events-auto absolute right-3 top-14 z-[60] w-80 max-w-[calc(100vw-1.5rem)] goose-radius-lg p-4 shadow-[var(--goose-shadow-lg)]"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-brand">
          <Icon name={appIcon(visible.appId)} size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink">{visible.title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">
            {visible.body}
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-solid hover:text-ink"
          onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', id: visible.id })}
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  );
}