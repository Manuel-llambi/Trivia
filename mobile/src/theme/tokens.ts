/**
 * Trivia DS Suave tokens (source: Trivia_DS_completo.md, sections 2.1 to 2.7 and appendix A).
 * Token names are canonical and match the DS exactly, so color keys stay in kebab-case.
 */
import type { TextStyle } from 'react-native';

export type ColorToken =
  | 'bg'
  | 'surface'
  | 'surface-2'
  | 'line'
  | 'line-strong'
  | 'edge'
  | 'text'
  | 'text-muted'
  | 'forest'
  | 'on-forest'
  | 'on-forest-muted'
  | 'brand'
  | 'brand-deep'
  | 'brand-soft'
  | 'on-brand'
  | 'brand-text'
  | 'coral'
  | 'coral-deep'
  | 'coral-soft'
  | 'on-coral'
  | 'danger-text'
  | 'sky'
  | 'sky-deep'
  | 'sky-soft'
  | 'on-sky'
  | 'violet'
  | 'violet-deep'
  | 'violet-soft'
  | 'on-violet'
  | 'orange'
  | 'orange-deep'
  | 'orange-soft'
  | 'on-orange'
  | 'sun'
  | 'sun-deep'
  | 'sun-soft'
  | 'on-sun'
  | 'focus-ring'
  | 'aura-track-on-forest'
  | 'aura-pill-on-forest'
  | 'aura-pill-line-on-forest';

export type Palette = Record<ColorToken, string>;

export const lightColors: Palette = {
  bg: '#f3f6ee',
  surface: '#ffffff',
  'surface-2': '#eaf0e3',
  line: '#dce5d3',
  'line-strong': '#c6d2bb',
  edge: '#7a8875',
  text: '#19231b',
  'text-muted': '#566358',
  forest: '#26352b',
  'on-forest': '#ffffff',
  'on-forest-muted': '#b9c8bc',
  brand: '#6fcb1f',
  'brand-deep': '#4e9f12',
  'brand-soft': '#e1f4c8',
  'on-brand': '#0a1206',
  'brand-text': '#3c7a0a',
  coral: '#ff6378',
  'coral-deep': '#d93a52',
  'coral-soft': '#ffe1e6',
  'on-coral': '#2a0a10',
  'danger-text': '#c0273f',
  sky: '#5ab0ff',
  'sky-deep': '#2f8be0',
  'sky-soft': '#ddf0ff',
  'on-sky': '#0b1d2e',
  violet: '#6a4be0',
  'violet-deep': '#4f33b8',
  'violet-soft': '#e9e3ff',
  'on-violet': '#ffffff',
  orange: '#ff8a3d',
  'orange-deep': '#e06a1c',
  'orange-soft': '#ffe8d6',
  'on-orange': '#2b1405',
  sun: '#ffc93c',
  'sun-deep': '#e0a516',
  'sun-soft': '#fff1c9',
  'on-sun': '#2b2005',
  'focus-ring': '#2f8be0',
  'aura-track-on-forest': 'rgba(255, 255, 255, 0.2)',
  'aura-pill-on-forest': 'rgba(255, 255, 255, 0.08)',
  'aura-pill-line-on-forest': 'rgba(255, 255, 255, 0.14)',
};

export const darkColors: Palette = {
  bg: '#111912',
  surface: '#1b251d',
  'surface-2': '#243028',
  line: '#2e3b31',
  'line-strong': '#3d4e41',
  edge: '#6e8272',
  text: '#f0f5ea',
  'text-muted': '#a8b6aa',
  forest: '#2f4034',
  'on-forest': '#f0f5ea',
  'on-forest-muted': '#b9c8bc',
  brand: '#6fcb1f',
  'brand-deep': '#4e9f12',
  'brand-soft': '#25381a',
  'on-brand': '#0a1206',
  'brand-text': '#8fe04a',
  coral: '#ff6378',
  'coral-deep': '#d93a52',
  'coral-soft': '#3c1920',
  'on-coral': '#2a0a10',
  'danger-text': '#ff8fa0',
  sky: '#5ab0ff',
  'sky-deep': '#2f8be0',
  'sky-soft': '#14283a',
  'on-sky': '#0b1d2e',
  violet: '#8a6ff2',
  'violet-deep': '#6a4be0',
  'violet-soft': '#271f45',
  'on-violet': '#12082e',
  orange: '#ff8a3d',
  'orange-deep': '#e06a1c',
  'orange-soft': '#3a2415',
  'on-orange': '#2b1405',
  sun: '#ffc93c',
  'sun-deep': '#e0a516',
  'sun-soft': '#3a3010',
  'on-sun': '#2b2005',
  'focus-ring': '#7dc0ff',
  'aura-track-on-forest': 'rgba(255, 255, 255, 0.2)',
  'aura-pill-on-forest': 'rgba(255, 255, 255, 0.08)',
  'aura-pill-line-on-forest': 'rgba(255, 255, 255, 0.14)',
};

/** 2.3 Spacing (px). */
export const space = {
  'space-1': 4,
  'space-2': 8,
  'space-3': 12,
  'space-4': 16,
  'space-5': 20,
  'space-6': 24,
  'space-7': 32,
  'space-8': 48,
} as const;

/** 2.4 Radii (px). */
export const radius = {
  'radius-sm': 12,
  'radius-md': 16,
  'radius-lg': 24,
  'radius-xl': 32,
  'radius-pill': 999,
} as const;

/** 2.5 Borders (px). */
export const border = {
  'border-w': 2,
} as const;

/** 2.6 Sizes (px). */
export const size = {
  'tap-min': 52,
  'avatar-sm': 32,
  'avatar-md': 44,
  'avatar-lg': 88,
  icon: 24,
} as const;

/**
 * 2.7 Lips: hard 4px edge under pressable elements (CSS `0 4px 0 0 <color>`).
 * iOS: shadowOffset {0, 4}, shadowRadius 0, shadowOpacity 1, shadowColor = lip color.
 * Android: sibling view offset 4px behind the element (DS section 6).
 */
export const LIP_OFFSET = 4;

export type LipToken =
  | 'lip-neutral'
  | 'lip-brand'
  | 'lip-coral'
  | 'lip-sky'
  | 'lip-violet'
  | 'lip-orange'
  | 'lip-sun';

export const lightLips: Record<LipToken, string> = {
  'lip-neutral': '#c6d2bb',
  'lip-brand': '#4e9f12',
  'lip-coral': '#d93a52',
  'lip-sky': '#2f8be0',
  'lip-violet': '#4f33b8',
  'lip-orange': '#e06a1c',
  'lip-sun': '#e0a516',
};

export const darkLips: Record<LipToken, string> = {
  'lip-neutral': '#0b120d',
  'lip-brand': '#4e9f12',
  'lip-coral': '#d93a52',
  'lip-sky': '#2f8be0',
  'lip-violet': '#6a4be0',
  'lip-orange': '#e06a1c',
  'lip-sun': '#e0a516',
};

/** 2.7 Soft shadows, transcribed from CSS `0 <y>px <blur>px rgba(...)`. */
export type SoftShadow = {
  shadowColor: string;
  shadowOpacity: number;
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
};

export type ShadowToken = 'shadow-soft' | 'shadow-float';

export const lightShadows: Record<ShadowToken, SoftShadow> = {
  'shadow-soft': { shadowColor: 'rgb(38, 53, 43)', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 6 }, shadowRadius: 20 },
  'shadow-float': { shadowColor: 'rgb(38, 53, 43)', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 14 }, shadowRadius: 36 },
};

export const darkShadows: Record<ShadowToken, SoftShadow> = {
  'shadow-soft': { shadowColor: 'rgb(0, 0, 0)', shadowOpacity: 0.45, shadowOffset: { width: 0, height: 6 }, shadowRadius: 20 },
  'shadow-float': { shadowColor: 'rgb(0, 0, 0)', shadowOpacity: 0.55, shadowOffset: { width: 0, height: 14 }, shadowRadius: 36 },
};

/** 2.2 Typography. Font keys match the names registered with useFonts in the root layout. */
export const fontFamily = {
  display: 'Urbanist_800ExtraBold',
  body: 'Nunito_600SemiBold',
} as const;

/** Tabular figures for every value that changes. */
export const tabularNums: TextStyle = { fontVariant: ['tabular-nums'] };

/** Converts a CSS em letter-spacing into RN pixels for a given font size. */
const em = (value: number, fontSize: number) => value * fontSize;

export type TypeToken =
  | 'display-xl'
  | 'display-lg'
  | 'title'
  | 'number-xl'
  | 'number-md'
  | 'heading'
  | 'body'
  | 'body-sm'
  | 'label';

export const typography: Record<TypeToken, TextStyle> = {
  'display-xl': { fontFamily: fontFamily.display, fontSize: 56, lineHeight: 56, letterSpacing: em(-0.02, 56) },
  'display-lg': { fontFamily: fontFamily.display, fontSize: 36, lineHeight: 40, letterSpacing: em(-0.02, 36) },
  title: { fontFamily: fontFamily.display, fontSize: 24, lineHeight: 30 },
  'number-xl': { fontFamily: fontFamily.display, fontSize: 64, lineHeight: 64, letterSpacing: em(-0.03, 64), ...tabularNums },
  'number-md': { fontFamily: fontFamily.display, fontSize: 28, lineHeight: 32, ...tabularNums },
  heading: { fontFamily: fontFamily.display, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.body, fontSize: 16, lineHeight: 24 },
  'body-sm': { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 20 },
  // The DS gives `label` weight 800 but no family; Urbanist 800 is the only 800 face loaded.
  label: { fontFamily: fontFamily.display, fontSize: 12, lineHeight: 16, letterSpacing: em(0.08, 12), textTransform: 'uppercase' },
};
