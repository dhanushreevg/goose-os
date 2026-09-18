// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Button, Glass, Icon, SegmentedControl, Slider, Switch } from './index';

describe('@goose/ui', () => {
  it('Switch reflects checked state and fires onChange', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Switch checked={false} onChange={onChange} label="Wi-Fi" />,
    );
    const button = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(button).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Switch checked={true} onChange={onChange} label="Wi-Fi" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('Slider clamps values and exposes slider semantics', () => {
    const onChange = vi.fn();
    render(
      <Slider value={150} max={100} onChange={onChange} label="Brightness" format={(v) => `${v}%`} />,
    );
    const slider = screen.getByRole('slider', { name: 'Brightness' });
    expect(slider).toHaveAttribute('aria-valuenow', '150');
  });

  it('SegmentedControl selects options', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Theme"
        value="light"
        onChange={onChange}
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(onChange).toHaveBeenCalledWith('dark');
  });

  it('Icon renders a decorative svg', () => {
    render(<Icon name="terminal" size={24} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('Button renders with child content', () => {
    render(<Button variant="primary">Launch</Button>);
    expect(screen.getByRole('button', { name: 'Launch' })).toBeInTheDocument();
  });

  it('Glass renders a div with the glass class', () => {
    const { container } = render(<Glass>content</Glass>);
    expect(container.firstElementChild).toHaveClass('goose-glass');
  });
});