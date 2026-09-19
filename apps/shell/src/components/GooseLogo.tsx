import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { Icon } from '@goose/ui';
import { cn } from '@goose/shared-utils';
import { GOOSE_LOGO_URL } from '../brand';

export interface GooseLogoProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onError'> {
  /** Accessible name for the logo image. */
  alt: string;
  /** Size in px for the fallback goose glyph (when the image fails to load). */
  fallbackSize?: number;
}

/**
 * Renders the official GOOSE OS logo, keeping its native proportions
 * (object-fit: contain). Falls back to the built-in goose glyph if the image
 * is unavailable, so branding never disappears silently.
 */
export function GooseLogo({ alt, className, fallbackSize = 20, ...rest }: GooseLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-label={alt}
        role="img"
        className={cn(
          'inline-flex items-center justify-center rounded-md bg-brand/15 text-brand',
          className,
        )}
      >
        <Icon name="goose" size={fallbackSize} />
      </span>
    );
  }

  return (
    <img
      src={GOOSE_LOGO_URL}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      className={cn('object-contain', className)}
      {...rest}
    />
  );
}