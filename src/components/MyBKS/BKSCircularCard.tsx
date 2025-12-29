import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { TealPineColors } from '../../theme/colors';

interface BKSCircularCardProps {
  bks: number;
  totalBets: number;
}

const BKS_TIERS = [
  { min: 91, max: 100, badge: 'Ball God', subtext: 'You are an eagle, soaring above the stadium. A beacon of hope for us mortals. We raise our hands in a somber, triumphant salute to you. Where were you when we needed you most? Trick question! You were exactly where you were supposed to be. Standing atop the snow capped mountain, looking down upon your kingdom. A ball god is among us.' },
  { min: 71, max: 90, badge: 'Ball Knower', subtext: 'You Know Ball.' },
  { min: 51, max: 70, badge: 'Ball Student', subtext: 'You may, one day, attain ball knowledge' },
  { min: 21, max: 50, badge: 'Ball Believer', subtext: 'You believe you know ball [but do you? Do you really?]' },
  { min: 1, max: 20, badge: 'Ball Fraud', subtext: "You don't know ball" },
];

const getTier = (bks: number) => {
  return BKS_TIERS.find(tier => bks >= tier.min && bks <= tier.max) || BKS_TIERS[BKS_TIERS.length - 1];
};

const BKSCircularCard: React.FC<BKSCircularCardProps> = ({ bks, totalBets }) => {
  const tier = getTier(bks);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OVERALL BKS SCORE</Text>

      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={280}
          width={20}
          fill={bks}
          tintColor={TealPineColors.primary}
          backgroundColor={TealPineColors.border}
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>{bks.toFixed(0)}</Text>
              <Text style={styles.scoreMax}>/ 100</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      <View style={styles.badgeContainer}>
        <Text style={styles.badge}>📈 {tier.badge}</Text>
      </View>

      <Text style={styles.subtext}>{tier.subtext}</Text>

      <Text style={styles.footer}>
        Based on {totalBets} bet{totalBets !== 1 ? 's' : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 164, 0.2)',
  },
  title: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 88,
    fontWeight: 'bold',
    color: TealPineColors.primary,
    fontFamily: 'BebasNeue-Regular',
    lineHeight: 88,
  },
  scoreMax: {
    fontSize: 24,
    color: TealPineColors.textSecondary,
    marginTop: -8,
  },
  badgeContainer: {
    backgroundColor: 'rgba(0, 179, 164, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  badge: {
    fontSize: 14,
    color: TealPineColors.primary,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 13,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  footer: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
  },
});

export default BKSCircularCard;
