# Font Usage Guide

## Installed Fonts

The following custom fonts have been installed and configured for the WhoKnowsBall app:

### Teko (Condensed Display Font)
- **Teko-Medium** (weight: 500)
- **Teko-SemiBold** (weight: 600)
- **Teko-Bold** (weight: 700)

**Use for:** Headlines, titles, section headers, uppercase text elements

### JetBrains Mono (Monospace Font)
- **JetBrainsMono-Medium** (weight: 500)

**Use for:** Numbers, odds, scores, statistics, tabular data

## Usage Examples

### Using Teko for Headlines

```typescript
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  headline: {
    fontFamily: 'Teko-Bold',
    fontSize: 48,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  subheadline: {
    fontFamily: 'Teko-SemiBold',
    fontSize: 32,
    textTransform: 'uppercase',
    color: '#00B3A4',
  },
  sectionTitle: {
    fontFamily: 'Teko-Medium',
    fontSize: 24,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

// Example usage
<Text style={styles.headline}>WHO KNOWS BALL</Text>
<Text style={styles.subheadline}>TODAY'S GAMES</Text>
<Text style={styles.sectionTitle}>MY PREDICTIONS</Text>
```

### Using JetBrains Mono for Numbers

```typescript
const styles = StyleSheet.create({
  odds: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 16,
    color: '#00B3A4',
    letterSpacing: 0,
  },
  score: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 36,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  stat: {
    fontFamily: 'JetBrainsMono-Medium',
    fontSize: 14,
    color: '#94A3B8',
  },
});

// Example usage
<Text style={styles.odds}>+150</Text>
<Text style={styles.score}>112</Text>
<Text style={styles.stat}>75.5%</Text>
```

## Typography System

### Recommended Pairings

**Headlines + Numbers:**
```typescript
<View>
  <Text style={{ fontFamily: 'Teko-Bold', fontSize: 24, textTransform: 'uppercase' }}>
    GAME ODDS
  </Text>
  <Text style={{ fontFamily: 'JetBrainsMono-Medium', fontSize: 18 }}>
    +150 / -120
  </Text>
</View>
```

**Stats Display:**
```typescript
<View style={{ flexDirection: 'row', gap: 16 }}>
  <View>
    <Text style={{ fontFamily: 'Teko-SemiBold', fontSize: 14 }}>WIN RATE</Text>
    <Text style={{ fontFamily: 'JetBrainsMono-Medium', fontSize: 24 }}>68.5%</Text>
  </View>
  <View>
    <Text style={{ fontFamily: 'Teko-SemiBold', fontSize: 14 }}>STREAK</Text>
    <Text style={{ fontFamily: 'JetBrainsMono-Medium', fontSize: 24 }}>+7</Text>
  </View>
</View>
```

## Design Guidelines

### Teko Guidelines
- Always use `textTransform: 'uppercase'` for maximum impact
- Add subtle `letterSpacing` (0.5-1) for headlines
- Use bold weights (SemiBold, Bold) for primary headlines
- Use Medium weight for secondary/tertiary headings
- Ideal for short, impactful text (3-15 characters)

### JetBrains Mono Guidelines
- Always use for numeric data (scores, odds, percentages, stats)
- Set `letterSpacing: 0` to maintain tabular alignment
- Use Medium weight (default)
- Excellent for comparing numbers in columns/rows
- Monospace ensures consistent width for dynamic number updates

## Platform Considerations

### iOS
Fonts are located in: `ios/WhoKnowsBall/Resources/*.ttf`
Configured in: `ios/WhoKnowsBall/Info.plist` under `UIAppFonts`

### Android
Fonts are located in: `android/app/src/main/assets/fonts/*.ttf`
Automatically linked via React Native asset system

## Troubleshooting

### Font Not Displaying
1. Ensure you're using the exact font family name:
   - ✅ `'Teko-Bold'`
   - ❌ `'Teko Bold'`
   - ❌ `'TekoBold'`

2. Clear cache and rebuild:
   ```bash
   # iOS
   cd ios && pod install && cd ..
   npx react-native run-ios

   # Android
   npx react-native run-android
   ```

3. Verify fonts are installed:
   ```bash
   # Check iOS Info.plist
   grep -A 10 "UIAppFonts" ios/WhoKnowsBall/Info.plist

   # Check Android fonts
   ls android/app/src/main/assets/fonts/
   ```

### Font Weight Not Working
JetBrains Mono only has Medium weight installed. Use the Medium variant:
```typescript
// ✅ Correct
fontFamily: 'JetBrainsMono-Medium'

// ❌ Won't work (not installed)
fontFamily: 'JetBrainsMono-Bold'
fontWeight: 'bold' // This won't affect JetBrainsMono
```

## Next Steps

To add additional font weights:

1. Download font files from:
   - Teko: https://fonts.google.com/specimen/Teko
   - JetBrains Mono: https://www.jetbrains.com/lp/mono/

2. Add `.ttf` files to `assets/fonts/`

3. Run linking:
   ```bash
   npx react-native-asset
   ```

4. Rebuild apps:
   ```bash
   npx react-native run-ios
   npx react-native run-android
   ```
