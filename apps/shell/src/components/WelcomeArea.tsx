import { Icon } from '@goose/ui';
import { useClock } from '../hooks/useClock';
import { GooseLogo } from './GooseLogo';

/**
 * Empty-desktop state. A small, elegant welcome card that keeps the centre of
 * the workspace open — it never grows beyond a compact panel.
 */
export function WelcomeArea() {
  const clock = useClock(30000);

  return (
    <section
      className="goose-welcome pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-label="Welcome to GOOSE OS"
    >
      <div className="flex select-none flex-col items-center gap-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-line">
          <GooseLogo alt="GOOSE OS logo" className="h-full w-full p-1" fallbackSize={26} />
        </span>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">
            Welcome to GOOSE OS
          </h1>
          <p className="text-sm leading-relaxed text-ink-muted">
            A smarter workspace for building, creating, and exploring.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm tabular-nums text-ink-muted/80">
          <Icon name="clock" size={14} />
          <span>{clock.date} · {clock.time}</span>
        </div>

        <p className="flex items-center gap-1.5 rounded-full border border-line/70 bg-white/60 px-3.5 py-1.5 text-xs text-ink-muted">
          Press{' '}
          <kbd className="rounded-md bg-surface-solid px-1.5 py-0.5 font-mono text-[11px] text-ink shadow-sm ring-1 ring-line">
            Super + A
          </kbd>{' '}
          to open applications
        </p>
      </div>
    </section>
  );
}