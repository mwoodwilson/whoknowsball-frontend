// src/components/BetSlip/BetSlipBar.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { TealPineColors } from '../../theme/colors';

interface BetSlipBarProps {
  betCount: number;
  onViewSlip: () => void;
  onClearSlip: () => void;
}

export const BetSlipBar: React.FC<BetSlipBarProps> = ({
  betCount,
  onViewSlip,
  onClearSlip,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onViewSlip} activeOpacity={0.8}>
      <View style={styles.leftSection}>
        <Text style={styles.betCount}>
          {betCount} bet{betCount > 1 ? 's' : ''}
        </Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onClearSlip();
          }}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tapHint}>Tap to view</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: TealPineColors.surface,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: TealPineColors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  betCount: {
    color: TealPineColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    color: TealPineColors.accent,
    fontSize: 14,
  },
  tapHint: {
    color: TealPineColors.textSecondary,
    fontSize: 14,
  },
});
