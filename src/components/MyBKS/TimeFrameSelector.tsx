import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TealPineColors } from '../../theme/colors';

export type TimeFrame = '30d' | '3m' | '1y' | 'all';

interface TimeFrameSelectorProps {
  selected: TimeFrame;
  onSelect: (value: TimeFrame) => void;
}

const OPTIONS: { value: TimeFrame; label: string }[] = [
  { value: '30d', label: '30 Days' },
  { value: '3m', label: '3 Months' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' },
];

const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: TealPineColors.border,
    backgroundColor: 'transparent',
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: TealPineColors.primary,
    borderColor: TealPineColors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: TealPineColors.textSecondary,
  },
  pillTextSelected: {
    color: TealPineColors.background,
    fontWeight: '600',
  },
});

export default TimeFrameSelector;
