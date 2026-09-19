import palette from './palette.json';

export type ThemeName = 'light' | 'dark';

export interface AccentPalette {
  blue: string;
  green: string;
  red: string;
  yellow: string;
}

export interface ThemeTokens {
  bg: string;
  surface: string;
  surfaceSolid: string;
  border: string;
  borderStrong: string;
  fg: string;
  fgMuted: string;
  primary: string;
  primaryContrast: string;
  accent: AccentPalette;
}

export interface SharedTokens {
  blur: string;
  radiusSm: string;
  radius: string;
  radiusLg: string;
  radiusXl: string;
  radiusFull: string;
  shadowSm: string;
  shadow: string;
  shadowLg: string;
  fontSans: string;
  fontMono: string;
  durationFast: string;
  duration: string;
  durationSlow: string;
  ease: string;
}

interface GoosePalette {
  themes: Record<ThemeName, ThemeTokens>;
  shared: SharedTokens;
}

const RAW = palette as unknown as GoosePalette;

/** The complete design token set. Single source of truth for `theme.css`. */
export const goosePalette: GoosePalette = RAW;

/** Shared (theme-independent) tokens. */
export const shared = RAW.shared;

export function theme(name: ThemeName): ThemeTokens {
  return RAW.themes[name];
}