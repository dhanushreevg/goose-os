import type { ReactElement, SVGProps } from 'react';
import { cn } from '@goose/shared-utils';

export type IconName =
  | 'goose'
  | 'grid'
  | 'close'
  | 'minimize'
  | 'bell'
  | 'wifi'
  | 'wifi-off'
  | 'bluetooth'
  | 'volume'
  | 'volume-mute'
  | 'battery'
  | 'battery-charging'
  | 'sun'
  | 'moon'
  | 'power'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'user'
  | 'search'
  | 'file'
  | 'folder'
  | 'terminal'
  | 'settings'
  | 'sparkle'
  | 'code'
  | 'download'
  | 'docs'
  | 'refresh'
  | 'arrow-up-right'
  | 'home'
  | 'monitor'
  | 'clock';

const ICONS: Record<IconName, ReactElement> = {
  goose: (
    <>
      <path d="M4.5 15C6 11.5 9 9.5 12 9.5s6 2 7.5 5.5" />
      <path d="M7.5 17.5c3-.6 6-.6 9 0" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  minimize: <path d="M5 12h14" />,
  bell: (
    <>
      <path d="M6.3 9.2a5.7 5.7 0 0 1 11.4 0c0 4.8 1.3 6.5 2 7.3H4.3c.7-.8 2-2.5 2-7.3z" />
      <path d="M10.3 19.5a2 2 0 0 0 3.4 0" />
    </>
  ),
  wifi: (
    <>
      <path d="M4.5 9.5a10 10 0 0 1 15 0" />
      <path d="M7.5 12.8a5.8 5.8 0 0 1 9 0" />
      <path d="M10.8 16a2 2 0 0 1 2.4 0" />
      <circle cx="12" cy="18.7" r="0.9" />
    </>
  ),
  'wifi-off': (
    <>
      <path d="M4.5 9.5a10 10 0 0 1 15 0" />
      <path d="M7.5 12.9a5.6 5.6 0 0 1 6.2-.7" />
      <path d="M10.9 16a2 2 0 0 1 2.3 0" />
      <circle cx="12" cy="18.7" r="0.9" />
      <path d="M3 3.5l18 17" />
    </>
  ),
  bluetooth: <path d="M6.5 8l11 8-5 4V4l5 4-11 8" />,
  volume: (
    <>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z" />
      <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
      <path d="M18 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  'volume-mute': (
    <>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </>
  ),
  battery: (
    <>
      <rect x="2.5" y="8" width="16" height="8" rx="2" />
      <path d="M21.5 11v2" />
      <rect x="4.5" y="10" width="6" height="4" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  'battery-charging': (
    <>
      <rect x="2.5" y="8" width="16" height="8" rx="2" />
      <path d="M21.5 11v2" />
      <path d="M12 7l-2.5 5h4L11 17" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 13.2A8 8 0 0 1 10.8 4a7.5 7.5 0 1 0 9.2 9.2z" />,
  power: (
    <>
      <path d="M12 3v9" />
      <path d="M6.2 6.4a8.5 8.5 0 1 0 11.6 0" />
    </>
  ),
  'chevron-left': <path d="M14.5 6l-6 6 6 6" />,
  'chevron-right': <path d="M9.5 6l6 6-6 6" />,
  'chevron-down': <path d="M6 9.5l6 6 6-6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.4 3.6-5.5 7-5.5s6.2 2.1 7 5.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5L20 20" />
    </>
  ),
  file: (
    <>
      <path d="M6 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V3.5z" />
      <path d="M14 3.8V8h4" />
    </>
  ),
  folder: (
    <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-11z" />
  ),
  terminal: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M7 9l3.5 3L7 15" />
      <path d="M12.5 15.5H17" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8l1.2 2.6 2.8.5 1.8-1.8 2.2 2.2-1.8 1.8.5 2.8 2.5 1.2-1 2.4-2.5 1.2-.5 2.8 1.8 1.8-2.2 2.2-1.8-1.8-2.8.5-1.2 2.5-2.3-1-2.4 1-.5-2.8-2.5-1.2 1-2.4-2.5-1.2.6-2.8-1.9-1.8 2.2-2.2 1.9 1.8 2.7-.5z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7L12 3z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </>
  ),
  code: <path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5" />,
  download: (
    <>
      <path d="M12 3v11" />
      <path d="M8 10l4 4 4-4" />
      <path d="M4.5 17.5v1A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-1" />
    </>
  ),
  docs: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a4 4 0 0 1 2 .5A4 4 0 0 1 14 4h4.5A1.5 1.5 0 0 1 20 5.5V18a1.5 1.5 0 0 1-1.5 1.5H14a3.5 3.5 0 0 0-2 1 3.5 3.5 0 0 0-2-1H5.5A1.5 1.5 0 0 1 4 18V5.5z" />
      <path d="M12 7v11.5" />
    </>
  ),
  refresh: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M20.5 3v3.5H17" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  home: (
    <>
      <path d="M4 10.5L12 4l8 6.5" />
      <path d="M6 9v10.5h12V9" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4.5" width="18" height="12.5" rx="2" />
      <path d="M9 21h6" />
      <path d="M12 17v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

/** Renders a stroke-based icon. Decorative by default; pair with a labelled control. */
export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
      {...rest}
    >
      {ICONS[name]}
    </svg>
  );
}