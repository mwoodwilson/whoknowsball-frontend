import { TextStyle } from 'react-native';
import { TealPineColors } from './colors';

/**
 * Typography System
 *
 * Design System Fonts:
 * - Bebas Neue: Bold condensed display font for headlines and labels
 * - JetBrains Mono: Monospace font for numbers, odds, and tabular data
 * - System: Body text (TODO: Consider installing dedicated body font)
 */

export const typography = {
  /**
   * H1 - Primary headlines (Bebas Neue)
   * Use for: Main page titles, hero headlines
   */
  headline1: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: 1,
    color: TealPineColors.textPrimary,
    fontWeight: '400' as const,
  } as TextStyle,

  /**
   * H2 - Secondary headlines (Bebas Neue)
   * Use for: Section titles, card headers
   */
  headline2: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 1,
    color: TealPineColors.textPrimary,
    fontWeight: '700' as const,
  } as TextStyle,

  /**
   * H3 - Tertiary headlines (Bebas Neue)
   * Use for: Subsection titles, list headers
   */
  headline3: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.5,
    color: TealPineColors.textPrimary,
    fontWeight: '400' as const,
  } as TextStyle,

  /**
   * Label - Small labels (Bebas Neue)
   * Use for: Form labels, metadata, categories
   */
  label: {
    fontFamily: 'BebasNeue-Regular',
    fontWeight: '400' as const,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: TealPineColors.textSecondary,
  } as TextStyle,

  /**
   * Body - Regular body text
   * Use for: Paragraphs, descriptions, general content
   */
  body: {
    fontFamily: 'System', // TODO: Replace with 'Space Grotesk' when installed
    fontWeight: '400' as const,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    color: TealPineColors.textPrimary,
  } as TextStyle,

  /**
   * Body Small - Smaller body text
   * Use for: Captions, helper text, footnotes
   */
  bodySmall: {
    fontFamily: 'System', // TODO: Replace with 'Space Grotesk' when installed
    fontWeight: '400' as const,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    color: TealPineColors.textSecondary,
  } as TextStyle,

  /**
   * Mono - Monospace numbers
   * Use for: Odds, scores, statistics, prices
   * Tabular numbers ensure consistent width
   */
  mono: {
    fontFamily: 'JetBrainsMono-Medium',
    fontWeight: '500' as const,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'] as const,
    color: TealPineColors.textPrimary,
  } as TextStyle,

  /**
   * Mono Large - Large monospace numbers
   * Use for: Prominent scores, large odds displays
   */
  monoLarge: {
    fontFamily: 'JetBrainsMono-Medium',
    fontWeight: '500' as const,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'] as const,
    color: TealPineColors.textPrimary,
  } as TextStyle,

  /**
   * Mono Small - Small monospace numbers
   * Use for: Secondary stats, inline numbers
   */
  monoSmall: {
    fontFamily: 'JetBrainsMono-Medium',
    fontWeight: '500' as const,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'] as const,
    color: TealPineColors.textSecondary,
  } as TextStyle,
};

/**
 * Typography utility functions
 */
export const typographyUtils = {
  /**
   * Create a custom text style by merging with base typography
   */
  extend: (baseStyle: TextStyle, overrides: Partial<TextStyle>): TextStyle => ({
    ...baseStyle,
    ...overrides,
  }),

  /**
   * Apply color to typography style
   */
  withColor: (style: TextStyle, color: string): TextStyle => ({
    ...style,
    color,
  }),
};

// Export individual styles for direct import
export const {
  headline1,
  headline2,
  headline3,
  label,
  body,
  bodySmall,
  mono,
  monoLarge,
  monoSmall,
} = typography;
