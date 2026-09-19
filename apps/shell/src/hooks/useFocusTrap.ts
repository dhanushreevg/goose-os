import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function queryFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null && !el.hasAttribute('aria-hidden'),
  );
}

/**
 * Traps keyboard focus within an overlay while it is open. Focus is moved to
 * the first focusable element on open and returned to `restoreTo` on unmount.
 * Returns nothing — callers are expected to keep the overlay mounted only while
 * it is open (conditional render).
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, restoreTo?: HTMLElement | null): void {
  useEffect(() => {
    const container = containerRef.current;
    const previous = restoreTo ?? (document.activeElement as HTMLElement | null);

    const focusFirst = () => {
      const first = queryFocusable(container ?? document.body)[0];
      first?.focus();
    };

    focusFirst();
    document.addEventListener('keydown', trapTabSteps);
    return () => {
      document.removeEventListener('keydown', trapTabSteps);
      previous?.focus?.();
      previous?.focus();
    };
  }, [containerRef, restoreTo]);
}

function trapTabSteps(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    const focusable = queryFocusable(document.body);
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey && (active === first || !document.body.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !document.body.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }
}
