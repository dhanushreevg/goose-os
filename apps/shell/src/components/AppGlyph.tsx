import type { CSSProperties } from 'react';
import type { AppDefinition } from '@goose/types';
import { Icon } from '@goose/ui';
import { cn } from '@goose/shared-utils';
import { appIcon, isGoogleApp } from '../appIcon';
import { GoogleAppIcon } from './GoogleAppIcon';

export interface AppGlyphProps {
  app: AppDefinition;
  /** Tile size in px. Branded icons fill the tile; fallback icons render at ~half. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders an app icon tile: the extracted full-colour Google icon for branded
 * apps, or a tinted stroke glyph for everything else.
 */
export function AppGlyph({ app, size = 40, className, style }: AppGlyphProps) {
  const branded = isGoogleApp(app.id);
  return (
    <span
      aria-hidden="true"
      className={cn('flex shrink-0 items-center justify-center overflow-hidden', className)}
      style={{
        color: app.tint,
        ...(!branded && {
          backgroundColor: `color-mix(in srgb, ${app.tint} 14%, transparent)`,
        }),
        ...style,
      }}
    >
      {branded ? (
        <GoogleAppIcon appId={app.id} size={size} />
      ) : (
        <Icon name={appIcon(app.id)} size={Math.round(size * 0.5)} />
      )}
    </span>
  );
}

export interface AppBadgeProps {
  appId: string;
  size?: number;
  color?: string;
}

/** Compact glyph for titlebars, toasts and notifications. */
export function AppBadge({ appId, size = 16, color }: AppBadgeProps) {
  if (isGoogleApp(appId)) {
    return <GoogleAppIcon appId={appId} size={Math.round(size * 1.5)} />;
  }
  return <Icon name={appIcon(appId)} size={size} style={color ? { color } : undefined} />;
}