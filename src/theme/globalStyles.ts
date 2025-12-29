import { StyleSheet } from 'react-native';
import { TealPineColors, borderRadius } from './colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  card: {
    backgroundColor: TealPineColors.surface,
    borderRadius: borderRadius,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  button: {
    backgroundColor: TealPineColors.primary,
    borderRadius: borderRadius,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: TealPineColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    color: TealPineColors.textPrimary,
    fontSize: 14,
  },
  textSecondary: {
    color: TealPineColors.textSecondary,
    fontSize: 12,
  },
});
