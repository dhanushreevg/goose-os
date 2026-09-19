import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn, clamp } from '@goose/shared-utils';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: number;
  onChange: (next: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
  valueLabel?: ReactNode;
}

/** A labelled range slider styled with the GOOSE accent colour. */
export function Slider({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  format,
  valueLabel,
  className,
  ...rest
}: SliderProps) {
  const display = format ? format(value) : `${Math.round(value)}%`;
  return (
    <div className={cn('goose-ui-slider-group', className)}>
      <div className="goose-ui-slider-head">
        <label htmlFor={`slider-${label}`}>{label}</label>
        <span className="goose-ui-slider-value">{valueLabel ?? display}</span>
      </div>
      <input
        id={`slider-${label}`}
        type="range"
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
        className={cn('goose-ui-slider', className)}
        {...rest}
      />
    </div>
  );
}