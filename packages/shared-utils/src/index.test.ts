import { describe, expect, it } from 'vitest';
import { clamp, cn, contrastRatio, formatBytes, formatUptime, greeting, uid } from './index';

describe('cn', () => {
  it('joins class names and drops falsy values', () => {
    expect(cn('a', 'b')).toBe('a b');
    expect(cn('a', undefined, false, null, 'b')).toBe('a b');
    expect(cn()).toBe('');
  });
});

describe('clamp', () => {
  it('clamps values into an inclusive range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe('formatBytes', () => {
  it('formats bytes into human-readable strings', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(-1)).toBe('0 B');
    expect(formatBytes(Number.NaN)).toBe('0 B');
  });
});

describe('formatUptime', () => {
  it('formats seconds into a compact duration', () => {
    expect(formatUptime(59)).toBe('0m');
    expect(formatUptime(65)).toBe('1m');
    expect(formatUptime(3_665)).toBe('1h 1m');
    expect(formatUptime(3_600)).toBe('1h 0m');
    expect(formatUptime(90_000)).toBe('1d 1h');
    expect(formatUptime(-5)).toBe('0m');
  });
});

describe('greeting', () => {
  it('returns a time-of-day greeting', () => {
    expect(greeting(new Date(2026, 0, 1, 3))).toBe('Good night');
    expect(greeting(new Date(2026, 0, 1, 9))).toBe('Good morning');
    expect(greeting(new Date(2026, 0, 1, 15))).toBe('Good afternoon');
    expect(greeting(new Date(2026, 0, 1, 21))).toBe('Good evening');
  });
});

describe('uid', () => {
  it('generates unique-ish prefixed ids', () => {
    const a = uid('win');
    const b = uid('win');
    expect(a).toMatch(/^win-/);
    expect(a).not.toBe(b);
  });
});

describe('contrastRatio', () => {
  it('computes white/black contrast bounds', () => {
    expect(contrastRatio('#ffffff', '#ffffff')).toBe(1);
    expect(contrastRatio('#ffffff', '#000000')).toBeGreaterThanOrEqual(21);
    expect(contrastRatio('#000000', '#ffffff')).toBeGreaterThanOrEqual(21);
  });
});