import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { TealPineColors } from '../../theme/colors';
import { getLeagueInfo } from '../../constants/leagueLogos';

export interface Sport {
  key: string;
  label: string;
  icon: string;
}

interface SportSelectorProps {
  selectedSports: string[];
  onToggleSport: (sportKey: string) => void;
}

const SPORTS: Sport[] = [
  { key: 'americanfootball_nfl', label: 'NFL', icon: '🏈' },
  { key: 'americanfootball_ncaaf', label: 'NCAAF', icon: '🪖' },
  { key: 'basketball_nba', label: 'NBA', icon: '🏀' },
  { key: 'basketball_ncaab', label: 'NCAAB', icon: '🏀' },
  { key: 'icehockey_nhl', label: 'NHL', icon: '🏒' },
  { key: 'baseball_mlb', label: 'MLB', icon: '⚾' },
];

export const SportSelector: React.FC<SportSelectorProps> = ({
  selectedSports,
  onToggleSport,
}) => {
  const isSelected = (sportKey: string) => selectedSports.includes(sportKey);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SPORTS.map((sport) => {
          const selected = isSelected(sport.key);
          const leagueInfo = getLeagueInfo(sport.key);
          const useEmoji = leagueInfo?.useEmoji || !leagueInfo;

          return (
            <TouchableOpacity
              key={sport.key}
              style={[
                styles.chip,
                selected && styles.chipSelected,
              ]}
              onPress={() => onToggleSport(sport.key)}
              activeOpacity={0.7}
            >
              {useEmoji ? (
                <Text style={styles.iconEmoji}>
                  {leagueInfo?.emoji || sport.icon}
                </Text>
              ) : (
                <Image
                  source={{ uri: leagueInfo.badge }}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              )}
              <Text
                style={[
                  styles.chipText,
                  selected && styles.chipTextSelected,
                ]}
              >
                {sport.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: TealPineColors.background,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 184, 166, 0.2)',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealPineColors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  chipSelected: {
    backgroundColor: TealPineColors.primary,
    borderColor: TealPineColors.primary,
    transform: [{ scale: 1.05 }],
  },
  iconEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  iconImage: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  chipText: {
    color: TealPineColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: TealPineColors.textPrimary,
    fontWeight: '700',
  },
});
