import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TealPineColors, borderRadius } from '../../theme/colors';

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

/**
 * SettingsSection - Card wrapper with title and icon
 *
 * A reusable card component for grouping settings with a consistent style.
 * Features a teal icon, white title, and dark background following TealPine theme.
 *
 * @example
 * <SettingsSection title="Account" icon={<Ionicons name="person" size={20} color={TealPineColors.primary} />}>
 *   <SettingsRow label="Email" ... />
 * </SettingsSection>
 */
export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, icon, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F2A27',
    borderRadius: borderRadius,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: TealPineColors.primary, // Teal color to distinguish from row labels
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    // Content wrapper for rows
  },
});
