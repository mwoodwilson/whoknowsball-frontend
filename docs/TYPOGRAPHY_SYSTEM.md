# Typography System Guide

## Overview

The WhoKnowsBall typography system provides a consistent, scalable approach to text styling using custom fonts (Teko and JetBrains Mono) and a structured hierarchy.

## Color Palette

The updated pine green color palette creates a sophisticated sports betting aesthetic:

```typescript
import { TealPineColors } from '../theme/colors';

// Pine green backgrounds
TealPineColors.background           // #0C1412 - Primary pine background
TealPineColors.backgroundSecondary  // #0E1715 - Secondary pine background
TealPineColors.surface              // #101D1A - Card/surface background
TealPineColors.border               // #0F2A27 - Border/hairline color

// Brand colors
TealPineColors.primary              // #00B3A4 - Teal primary
TealPineColors.accent               // #34D399 - Accent green

// Text colors
TealPineColors.textPrimary          // #E9F3F1 - Primary text (ink)
TealPineColors.textSecondary        // #93A7A3 - Secondary text (muted)

// Status colors
TealPineColors.win                  // #22C55E - Win/success
TealPineColors.loss                 // #F43F5E - Loss/error
TealPineColors.warning              // #EAB308 - Warning
TealPineColors.info                 // #14B8A6 - Info
```

## Typography Components

### Import

```typescript
// Individual imports
import { H1, H2, H3, Label, Body, Mono } from '../components/Typography';

// Or import all at once
import { Typography } from '../components/Typography';
```

### H1 - Primary Headlines

**Use for:** Main page titles, hero headlines, app name

```tsx
<H1>WHO KNOWS BALL</H1>
<H1 color={TealPineColors.primary}>FEATURED GAMES</H1>

// With custom styles
<H1 style={{ marginBottom: 16 }}>TODAY'S PICKS</H1>
```

**Specifications:**
- Font: Teko-Bold
- Size: 40px
- Line Height: 38px
- Letter Spacing: 0.2
- Transform: Uppercase

### H2 - Secondary Headlines

**Use for:** Section titles, card headers, page sections

```tsx
<H2>TODAY'S GAMES</H2>
<H2>MY PREDICTIONS</H2>
<H2 color={TealPineColors.accent}>LIVE NOW</H2>
```

**Specifications:**
- Font: Teko-SemiBold
- Size: 24px
- Line Height: 24px
- Letter Spacing: 0.15
- Transform: Uppercase

### H3 - Tertiary Headlines

**Use for:** Subsection titles, list headers, categories

```tsx
<H3>UPCOMING</H3>
<H3>COMPLETED</H3>
<H3>FAVORITES</H3>
```

**Specifications:**
- Font: Teko-Medium
- Size: 20px
- Line Height: 20px
- Letter Spacing: 0.1
- Transform: Uppercase

### Label - Small Labels

**Use for:** Form labels, metadata, categories, tags

```tsx
<Label>SPREAD</Label>
<Label>OVER/UNDER</Label>
<Label>MONEYLINE</Label>

// With color
<Label color={TealPineColors.primary}>LIVE</Label>
```

**Specifications:**
- Font: System (Space Grotesk when installed)
- Weight: 600
- Size: 12px
- Line Height: 16px
- Letter Spacing: 0.3
- Transform: Uppercase

### Body - Regular Text

**Use for:** Paragraphs, descriptions, general content

```tsx
<Body>Make your prediction before the game starts.</Body>
<Body color={TealPineColors.textSecondary}>
  Optional game information goes here.
</Body>
```

**Specifications:**
- Font: System (Space Grotesk when installed)
- Weight: 400
- Size: 15px
- Line Height: 22px

### BodySmall - Small Text

**Use for:** Captions, helper text, footnotes, timestamps

```tsx
<BodySmall>Last updated 2 minutes ago</BodySmall>
<BodySmall color={TealPineColors.textSecondary}>
  Terms and conditions apply
</BodySmall>
```

**Specifications:**
- Font: System (Space Grotesk when installed)
- Weight: 400
- Size: 13px
- Line Height: 18px

### Mono - Monospace Numbers

**Use for:** Odds, prices, standard numeric data

```tsx
<Mono>+150</Mono>
<Mono>-120</Mono>
<Mono color={TealPineColors.win}>+5.5</Mono>
```

**Specifications:**
- Font: JetBrainsMono-Medium
- Weight: 500
- Size: 16px
- Line Height: 24px
- Font Variant: Tabular nums

### MonoLarge - Large Numbers

**Use for:** Prominent scores, large odds displays

```tsx
<MonoLarge>112</MonoLarge>
<MonoLarge color={TealPineColors.primary}>+250</MonoLarge>
```

**Specifications:**
- Font: JetBrainsMono-Medium
- Weight: 500
- Size: 32px
- Line Height: 40px
- Font Variant: Tabular nums

### MonoSmall - Small Numbers

**Use for:** Secondary stats, inline numbers, percentages

```tsx
<MonoSmall>+5</MonoSmall>
<MonoSmall color={TealPineColors.win}>68%</MonoSmall>
```

**Specifications:**
- Font: JetBrainsMono-Medium
- Weight: 500
- Size: 14px
- Line Height: 20px
- Font Variant: Tabular nums

## Usage Examples

### Game Card Header

```tsx
<View style={styles.card}>
  <View style={styles.cardHeader}>
    <H2>LIVE NOW</H2>
    <Label>NBA • Q3 • 4:23</Label>
  </View>
  <View style={styles.teams}>
    <View>
      <Body>Lakers</Body>
      <MonoLarge color={TealPineColors.win}>112</MonoLarge>
    </View>
    <Body>vs</Body>
    <View>
      <Body>Celtics</Body>
      <MonoLarge>98</MonoLarge>
    </View>
  </View>
</View>
```

### Odds Display

```tsx
<View style={styles.oddsCard}>
  <Label>SPREAD</Label>
  <Mono color={TealPineColors.primary}>LAL -5.5</Mono>
  <MonoSmall>+110</MonoSmall>
</View>
```

### Stats Section

```tsx
<View style={styles.stats}>
  <H3>YOUR STATS</H3>
  <View style={styles.statRow}>
    <Label>WIN RATE</Label>
    <Mono color={TealPineColors.win}>68.5%</Mono>
  </View>
  <View style={styles.statRow}>
    <Label>STREAK</Label>
    <Mono color={TealPineColors.accent}>+7</Mono>
  </View>
  <View style={styles.statRow}>
    <Label>TOTAL PICKS</Label>
    <Mono>142</Mono>
  </View>
</View>
```

### User Profile

```tsx
<View style={styles.profile}>
  <H1>JOHN DOE</H1>
  <Body color={TealPineColors.textSecondary}>@johndoe</Body>
  <View style={styles.profileStats}>
    <View>
      <MonoLarge>1,247</MonoLarge>
      <Label>PREDICTIONS</Label>
    </View>
    <View>
      <MonoLarge color={TealPineColors.win}>72%</MonoLarge>
      <Label>WIN RATE</Label>
    </View>
  </View>
</View>
```

## Direct Style Usage

If you need to use typography styles directly without components:

```tsx
import { typography } from '../theme/typography';

const styles = StyleSheet.create({
  customHeadline: {
    ...typography.headline2,
    marginBottom: 16,
    color: TealPineColors.primary,
  },
  customStat: {
    ...typography.mono,
    fontSize: 20,
  },
});
```

## Style Extension

Use the typography utilities for custom variations:

```tsx
import { typographyUtils } from '../theme/typography';

// Apply custom color
const greenHeadline = typographyUtils.withColor(
  typography.headline1,
  TealPineColors.accent
);

// Extend with custom properties
const customBody = typographyUtils.extend(
  typography.body,
  { marginBottom: 12, textAlign: 'center' }
);
```

## Design Guidelines

### Teko (Headlines)
- ✅ Always use uppercase (`textTransform: 'uppercase'`)
- ✅ Use for short, impactful text (3-15 characters)
- ✅ Bold weights (SemiBold, Bold) for primary headlines
- ✅ Add subtle letter spacing for improved readability
- ❌ Don't use for long paragraphs or body text
- ❌ Don't mix case (no "Title Case" or "Sentence case")

### JetBrains Mono (Numbers)
- ✅ Always use for numeric data (scores, odds, percentages)
- ✅ Use tabular-nums for consistent column alignment
- ✅ Set `letterSpacing: 0` to maintain alignment
- ✅ Great for live-updating numbers (width stays constant)
- ❌ Don't use bold weights (Medium is the only installed weight)
- ❌ Don't use for non-numeric text

### Space Grotesk (Body/Labels)
- ⚠️ **Not yet installed** - Currently using system default
- 📦 To install: Download from [Google Fonts](https://fonts.google.com/specimen/Space+Grotesk)
- ✅ Use for body text, descriptions, labels
- ✅ Regular (400) for body, SemiBold (600) for labels
- ✅ Clean, modern sans-serif for readability

## Color Usage

### Text on Backgrounds

```tsx
// Primary text on pine backgrounds
<Body color={TealPineColors.textPrimary}>Main content</Body>

// Secondary/muted text
<BodySmall color={TealPineColors.textSecondary}>Helper text</BodySmall>

// Accent text
<H2 color={TealPineColors.primary}>Featured Section</H2>
```

### Status Colors

```tsx
// Win/Success
<Mono color={TealPineColors.win}>+7</Mono>

// Loss/Error
<Mono color={TealPineColors.loss}>-3</Mono>

// Warning
<Label color={TealPineColors.warning}>PENDING</Label>

// Info
<Body color={TealPineColors.info}>Live update available</Body>
```

## Accessibility

- All typography components use semantic sizes and proper line heights
- Color contrast ratios meet WCAG AA standards
- Monospace fonts ensure readability for numeric data
- Uppercase headlines use increased letter spacing for legibility

## Migration Guide

### Replacing Inline Styles

**Before:**
```tsx
<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
  TITLE
</Text>
```

**After:**
```tsx
<H2>TITLE</H2>
```

### Replacing Custom Text Components

**Before:**
```tsx
<Text style={styles.headline}>HEADLINE</Text>
<Text style={styles.odds}>+150</Text>
```

**After:**
```tsx
<H2>HEADLINE</H2>
<Mono>+150</Mono>
```

## Next Steps

1. **Install Space Grotesk font** (for body and label text)
   - Download from Google Fonts
   - Add to `assets/fonts/`
   - Run `npx react-native-asset`
   - Update typography.ts to use Space Grotesk

2. **Migrate existing screens** to use typography components
3. **Remove duplicate text styles** from StyleSheets
4. **Test on iOS and Android** to ensure font rendering

## Troubleshooting

### Fonts not displaying correctly

1. Verify fonts are installed:
   ```bash
   ls assets/fonts/
   ```

2. Check font references:
   ```bash
   grep -A 10 "UIAppFonts" ios/WhoKnowsBall/Info.plist
   ```

3. Rebuild app:
   ```bash
   npx react-native run-ios
   npx react-native run-android
   ```

### Uppercase not applying

Ensure you're using the correct components:
- ✅ `<H1>text</H1>` - Automatically uppercase
- ❌ `<Text style={typography.headline1}>text</Text>` - Need to add textTransform

### Color overrides not working

Color prop should be used correctly:
```tsx
// ✅ Correct
<H2 color={TealPineColors.primary}>TEXT</H2>

// ❌ Incorrect
<H2 style={{ color: TealPineColors.primary }}>TEXT</H2>
```
