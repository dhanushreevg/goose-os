import { useId } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@goose/shared-utils';

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps
  extends Omit<ButtonHTMLAttributes<HTMLDivElement>, 'onChange'> {
  label: string;
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

/** A single-select segmented control with `radiogroup` semantics. */
export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className,
  ...rest
}: SegmentedControlProps) {
  const groupId = useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('goose-ui-seg', className)}
      {...rest}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            id={`${groupId}-${option.value}`}
            aria-labelledby={`${groupId}-label-${option.value}`}
            onClick={() => onChange(option.value)}
            className="goose-ui-seg-option"
          >
            <span id={`${groupId}-label-${option.value}`}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}