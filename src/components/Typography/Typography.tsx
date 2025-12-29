import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { typography } from '../../theme/typography';

/**
 * Typography Components
 *
 * Reusable text components that apply consistent styling from the design system.
 * All components accept standard TextProps and allow style overrides.
 */

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  color?: string;
}

/**
 * H1 - Primary Headline
 *
 * @example
 * <H1>WHO KNOWS BALL</H1>
 * <H1 color="#00B3A4">FEATURED GAMES</H1>
 */
export const H1: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text
    style={[
      typography.headline1,
      color && { color },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

/**
 * H2 - Secondary Headline
 *
 * @example
 * <H2>TODAY'S GAMES</H2>
 * <H2>MY PREDICTIONS</H2>
 */
export const H2: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text
    style={[
      typography.headline2,
      color && { color },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

/**
 * H3 - Tertiary Headline
 *
 * @example
 * <H3>UPCOMING</H3>
 * <H3>LIVE NOW</H3>
 */
export const H3: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text
    style={[
      typography.headline3,
      color && { color },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

/**
 * Label - Small Uppercase Label
 *
 * @example
 * <Label>SPREAD</Label>
 * <Label>OVER/UNDER</Label>
 */
export const Label: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text
    style={[
      typography.label,
      color && { color },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

/**
 * Body - Regular Body Text
 *
 * @example
 * <Body>Make your prediction before the game starts.</Body>
 * <Body color="#93A7A3">Optional game information.</Body>
 */
export const Body: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text
    style={[
      typography.body,
      color && { color },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

/**
 * BodySmall - Small Body Text
 *
 * @example
 * <BodySmall>Last updated 2 minutes ago</BodySmall>
 */
export const BodySmall: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text
    style={[
      typography.bodySmall,
      color && { color },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

/**
 * Mono - Monospace Numbers
 *
 * @example
 * <Mono>+150</Mono>
 * <Mono>-120</Mono>
 * <Mono>72.5%</Mono>
 */
export const Mono: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text
    style={[
      typography.mono,
      color && { color },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

/**
 * MonoLarge - Large Monospace Numbers
 *
 * @example
 * <MonoLarge>112</MonoLarge>
 * <MonoLarge>98</MonoLarge>
 */
export const MonoLarge: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text
    style={[
      typography.monoLarge,
      color && { color },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

/**
 * MonoSmall - Small Monospace Numbers
 *
 * @example
 * <MonoSmall>+5</MonoSmall>
 * <MonoSmall>68%</MonoSmall>
 */
export const MonoSmall: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text
    style={[
      typography.monoSmall,
      color && { color },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

// Export all components as a single object for easier importing
export const Typography = {
  H1,
  H2,
  H3,
  Label,
  Body,
  BodySmall,
  Mono,
  MonoLarge,
  MonoSmall,
};
