import type { HTMLAttributes } from 'react';
import { cn } from '@goose/shared-utils';

export interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  /** Override the default rounded corner radius. */
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const RADIUS: Record<NonNullable<GlassProps['radius']>, string> = {
  sm: 'goose-radius-sm',
  md: 'goose-radius',
  lg: 'goose-radius-lg',
  xl: 'goose-radius-xl',
  none: 'rounded-none',
};

/** A glass surface that falls back to solid when blur is unsupported. */
export function Glass({ radius = 'md', className, ...rest }: GlassProps) {
  return <div className={cn('goose-glass', RADIUS[radius], className)} {...rest} />;
}