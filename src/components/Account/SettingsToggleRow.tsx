import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { TealPineColors } from '../../theme/colors';

interface SettingsToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/**
 * SettingsToggleRow - Row with toggle switch
 *
 * A reusable row component with an integrated toggle switch for boolean settings.
 * Features consistent styling with other settings rows and TealPine theme colors.
 *
 * @example
 * <SettingsToggleRow
 *   icon={<Ionicons name="notifications" size={20} color={TealPineColors.primary} />}
 *   label="Push Notifications"
 *   description="Receive alerts about your bets"
 *   value={notificationsEnabled}
 *   onValueChange={setNotificationsEnabled}
 * />
 */
export const SettingsToggleRow: React.FC<SettingsToggleRowProps> = ({
  icon,
  label,
  description,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: '#4B5563',
          true: '#00B3A4'
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#4B5563"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A3D36',
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  label: {
    color: TealPineColors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  description: {
    color: TealPineColors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
});
