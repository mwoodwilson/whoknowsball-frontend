import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TealPineColors } from '../../theme/colors';

interface DropdownOption {
  label: string;
  value: string;
}

interface SettingsDropdownRowProps {
  icon: React.ReactNode;
  label: string;
  options: DropdownOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * SettingsDropdownRow - Row with dropdown selector
 *
 * A reusable row component with a dropdown/picker for selecting from multiple options.
 * Shows the selected value on the right with a chevron-down indicator.
 * Supports disabled state for read-only or unavailable options.
 *
 * @example
 * <SettingsDropdownRow
 *   icon={<Ionicons name="color-palette" size={20} color={TealPineColors.primary} />}
 *   label="Theme"
 *   options={[
 *     { label: 'Dark', value: 'dark' },
 *     { label: 'Light', value: 'light' },
 *   ]}
 *   selectedValue={theme}
 *   onValueChange={setTheme}
 * />
 *
 * @example
 * <SettingsDropdownRow
 *   icon={<Ionicons name="language" size={20} color={TealPineColors.textSecondary} />}
 *   label="Language"
 *   options={[{ label: 'English', value: 'en' }]}
 *   selectedValue="en"
 *   onValueChange={() => {}}
 *   disabled
 * />
 */
export const SettingsDropdownRow: React.FC<SettingsDropdownRowProps> = ({
  icon,
  label,
  options,
  selectedValue,
  onValueChange,
  disabled = false,
}) => {
  // Find the selected option label
  const selectedOption = options.find(opt => opt.value === selectedValue);
  const selectedLabel = selectedOption ? selectedOption.label : '';

  const handlePress = () => {
    if (disabled) return;
    // For now, this would typically open a modal or action sheet with options
    // This is a simplified version - in production, you'd implement proper picker UI
    console.log('Dropdown pressed - would show picker with options:', options);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[
          styles.value,
          disabled && styles.valueDisabled
        ]}>
          {selectedLabel}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={disabled ? TealPineColors.textSecondary : TealPineColors.textPrimary}
          style={styles.chevron}
        />
      </View>
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
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    color: TealPineColors.textPrimary,
    fontSize: 15,
    marginRight: 4,
  },
  valueDisabled: {
    color: TealPineColors.textSecondary,
  },
  chevron: {
    marginLeft: 4,
  },
});
