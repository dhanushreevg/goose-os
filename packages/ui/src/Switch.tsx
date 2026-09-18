import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@goose/shared-utils';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}

/** Accessible toggle switch rendered as a button with `role="switch"`. */
export function Switch({ checked, onChange, label, disabled, className, id, ...rest }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      id={id}
      onClick={() => onChange(!checked)}
      className={cn('goose-ui-switch', className)}
      {...rest}
    >
      <span
        className="goose-ui-switch-thumb"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0px)' }}
      />
    </button>
  );
}