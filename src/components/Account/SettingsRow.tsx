import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TealPineColors } from '../../theme/colors';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onPress: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

/**
 * SettingsRow - Tappable row with icon, label, description, and chevron
 *
 * A reusable interactive row component for settings and account options.
 * Supports optional description, chevron indicator, and danger state for destructive actions.
 *
 * @example
 * <SettingsRow
 *   icon={<Ionicons name="mail" size={20} color={TealPineColors.primary} />}
 *   label="Email"
 *   description="user@example.com"
 *   onPress={() => navigate('EditEmail')}
 *   showChevron
 * />
 *
 * @example
 * <SettingsRow
 *   icon={<Ionicons name="log-out" size={20} color={TealPineColors.loss} />}
 *   label="Sign Out"
 *   onPress={handleSignOut}
 *   danger
 * />
 */
export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  description,
  onPress,
  showChevron = true,
  danger = false,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={TealPineColors.textSecondary}
          style={styles.chevron}
        />
      )}
    </TouchableOpacity>
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
  labelDanger: {
    color: TealPineColors.loss,
  },
  description: {
    color: TealPineColors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  chevron: {
    marginLeft: 8,
  },
});
