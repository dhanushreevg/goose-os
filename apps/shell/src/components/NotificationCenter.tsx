import { Button, Icon } from '@goose/ui';
import { appIcon } from '../appIcon';
import { useShell } from '../store';

function timeAgo(timestamp: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationCenter() {
  const { state, dispatch } = useShell();
  const unread = state.notifications.filter((item) => !item.read).length;
  const items = [...state.notifications].reverse();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-14 z-50 flex justify-end pr-3">
      <div
        role="dialog"
        aria-label="Notifications"
        className="goose-glass pointer-events-auto w-full max-w-sm goose-radius-xl p-5 shadow-[var(--goose-shadow-lg)]"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <Icon name="bell" size={18} />
            Notifications
            {unread > 0 && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-brand-contrast">
                {unread}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: 'MARK_NOTIFICATIONS_READ' })}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Clear all notifications"
              onClick={() => dispatch({ type: 'CLEAR_NOTIFICATIONS' })}
            >
              Clear
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">
            You’re all caught up.
          </p>
        ) : (
          <ul className="mt-3 flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-glass bg-surface p-3"
                style={{ opacity: item.read ? 0.75 : 1 }}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-ink-muted">
                    <Icon name={appIcon(item.appId)} size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-ink">{item.title}</span>
                      <span className="shrink-0 text-[10px] text-ink-muted">
                        {timeAgo(item.timestamp)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Dismiss notification: ${item.title}`}
                    className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-solid hover:text-ink"
                    onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', id: item.id })}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}