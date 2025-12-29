import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TealPineColors } from '../../theme/colors';

interface MetricsCardsProps {
  winRate: number;
  totalBets: number;
  avgBKS: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ winRate, totalBets, avgBKS }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Win Rate Card */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🏆</Text>
        </View>
        <Text style={styles.value}>{winRate.toFixed(1)}%</Text>
        <Text style={styles.label}>Win Rate</Text>
      </View>

      {/* Total Bets Card */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎯</Text>
        </View>
        <Text style={styles.value}>{totalBets}</Text>
        <Text style={styles.label}>Total Bets</Text>
      </View>

      {/* Avg BKS Card */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📊</Text>
        </View>
        <Text style={styles.value}>{avgBKS.toFixed(1)}</Text>
        <Text style={styles.label}>Avg BKS/Bet</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 164, 0.1)',
  },
  iconContainer: {
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 4,
    fontFamily: 'BebasNeue-Regular',
  },
  label: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default MetricsCards;
