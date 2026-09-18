import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@goose/shared-utils';

export type ButtonVariant = 'primary' | 'glass' | 'ghost';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export function Button({
  variant = 'glass',
  size = 'md',
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'goose-ui-btn',
        `goose-ui-btn--${variant}`,
        `goose-ui-btn--${size}`,
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}