import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { TealPineColors, borderRadius } from '../../theme/colors';
import { Label } from '../Typography';

interface GameCardProps {
  game: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    commenceTime: string;
    sportKey: string;
    isLive?: boolean;
    scores?: Array<{ name: string; score: string }> | null;
    completed?: boolean;
    sportTitle?: string;
    odds: {
      spread: {
        home: { line: string; odds: string };
        away: { line: string; odds: string };
      };
      moneyline: {
        home: { odds: string };
        away: { odds: string };
      };
      total: {
        over: { line: string; odds: string };
        under: { line: string; odds: string };
      };
    };
  };
  onAddToBetSlip: (game: any, betType: string, selection: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onAddToBetSlip }) => {
  // Animation for data refresh
  const flashAnim = useRef(new Animated.Value(0)).current;
  const previousOdds = useRef<string>('');

  if (!game || !game.odds) {
    return null;
  }

  // Detect odds changes and trigger animation
  useEffect(() => {
    const currentOddsSignature = JSON.stringify({
      spread: game.odds.spread,
      moneyline: game.odds.moneyline,
      total: game.odds.total,
      scores: game.scores
    });

    // If odds changed (and not first render), animate
    if (previousOdds.current && previousOdds.current !== currentOddsSignature) {
      // Flash animation: 0 -> 1 -> 0
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }

    previousOdds.current = currentOddsSignature;
  }, [game.odds, game.scores]);

  // Interpolate flash animation to background color
  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [TealPineColors.surface, 'rgba(0, 179, 164, 0.2)'] // Flash to teal
  });

  // Find scores for each team
  const awayScore = game.scores?.find(s => s.name === game.awayTeam)?.score || '-';
  const homeScore = game.scores?.find(s => s.name === game.homeTeam)?.score || '-';

  // Get user's timezone abbreviation (excluding AM/PM)
  const getTimezoneAbbr = () => {
    const date = new Date();
    const timeZoneString = date.toLocaleTimeString('en-US', { timeZoneName: 'short' });
    // Match timezone abbreviations (PST, EST, etc.) but NOT AM/PM
    // Look for patterns at the end after time, skip AM/PM
    const parts = timeZoneString.split(' ');
    // The timezone is usually the last part, but could be second-to-last if AM/PM is last
    const lastPart = parts[parts.length - 1];
    const secondToLastPart = parts[parts.length - 2];

    // If last part is AM/PM, use second-to-last
    if (lastPart === 'AM' || lastPart === 'PM') {
      return secondToLastPart || '';
    }
    // Otherwise, use last part if it's not AM/PM
    return (lastPart !== 'AM' && lastPart !== 'PM') ? lastPart : '';
  };

  // Format commence time based on game status
  const formatGameTime = (commenceTime: string, isLive: boolean) => {
    // Parse ISO datetime string - automatically converts to user's local timezone
    const date = new Date(commenceTime);

    if (isLive) {
      // For live games: just show time (e.g., "1:00 PM")
      const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return {
        displayText: timeString,
        isStacked: false
      };
    } else {
      // For upcoming games: return separate date and time for stacking
      const dateString = date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
      });
      const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const timezone = getTimezoneAbbr();

      // Only add timezone if it's not empty and not already in the time string
      const finalTime = timezone && !timeString.includes(timezone)
        ? `${timeString} ${timezone}`
        : timeString;

      return {
        date: dateString,
        time: finalTime,
        isStacked: true
      };
    }
  };

  const formattedTime = formatGameTime(game.commenceTime, game.isLive || false);

  // Check if odds are valid (not defaults)
  // Default odds are: +0/+100 for spread, +100 for moneyline, O 0/U 0 with +100
  const hasValidSpread = game.odds.spread.home.line !== '+0' && game.odds.spread.home.odds !== '+100';
  const hasValidMoneyline = game.odds.moneyline.home.odds !== '+100' || game.odds.moneyline.away.odds !== '+100';
  const hasValidTotal = game.odds.total.over.line !== 'O 0' && game.odds.total.under.line !== 'U 0';
  const hasAnyValidOdds = hasValidSpread || hasValidMoneyline || hasValidTotal;

  // Handler for when locked buttons are tapped
  const handleLockedButtonPress = () => {
    Alert.alert(
      'Betting Unavailable',
      'Odds are no longer available for this game.',
      [{ text: 'OK' }]
    );
  };

  return (
    <Animated.View style={[styles.card, { backgroundColor }]}>
      <View style={styles.header}>
        <View style={styles.matchupContainer}>
          <Text style={styles.matchup}>
            {game.awayTeam} @ {game.homeTeam}
          </Text>
          {game.sportTitle && (
            <Text style={styles.sportLabel}>{game.sportTitle}</Text>
          )}
          {/* Show time below matchup for live games */}
          {game.isLive && (
            <Text style={styles.liveGameTime}>{formattedTime.displayText}</Text>
          )}
        </View>
        <View style={styles.timeContainer}>
          {game.isLive && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Label style={styles.liveText}>LIVE</Label>
            </View>
          )}
          {!game.isLive && formattedTime.isStacked && (
            <View style={styles.upcomingTimeContainer}>
              <Text style={styles.upcomingDate}>{formattedTime.date}</Text>
              <Text style={styles.upcomingTime}>{formattedTime.time}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Live Score Display */}
      {game.isLive && game.scores && (
        <View style={styles.scoresContainer}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreTeam}>{game.awayTeam}</Text>
            <Text style={styles.scoreValue}>{awayScore}</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreTeam}>{game.homeTeam}</Text>
            <Text style={styles.scoreValue}>{homeScore}</Text>
          </View>
        </View>
      )}

      <View style={styles.oddsLabels}>
        <View style={styles.labelSpacer} />
        <Label style={styles.labelText}>SPREAD</Label>
        <Label style={styles.labelText}>MONEY</Label>
        <Label style={styles.labelText}>TOTAL</Label>
      </View>

      <View style={styles.oddsContainer}>
        <View style={styles.oddsRow}>
          <Text style={styles.teamName}>{game.awayTeam}</Text>
          <TouchableOpacity
            style={[styles.oddsButton, !hasValidSpread && styles.oddsButtonLocked]}
            onPress={hasValidSpread ? () => onAddToBetSlip(game, 'spread', 'away') : handleLockedButtonPress}
          >
            <Text style={[styles.oddsText, !hasValidSpread && styles.oddsTextLocked]}>{game.odds.spread.away.line}</Text>
            <Text style={[styles.oddsValue, !hasValidSpread && styles.oddsTextLocked]}>{game.odds.spread.away.odds}</Text>
            {!hasValidSpread && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.oddsButton, !hasValidMoneyline && styles.oddsButtonLocked]}
            onPress={hasValidMoneyline ? () => onAddToBetSlip(game, 'moneyline', 'away') : handleLockedButtonPress}
          >
            <Text style={[styles.oddsText, !hasValidMoneyline && styles.oddsTextLocked]}>{game.odds.moneyline.away.odds}</Text>
            {!hasValidMoneyline && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.oddsButton, !hasValidTotal && styles.oddsButtonLocked]}
            onPress={hasValidTotal ? () => onAddToBetSlip(game, 'total', 'over') : handleLockedButtonPress}
          >
            <Text style={[styles.oddsText, !hasValidTotal && styles.oddsTextLocked]}>{game.odds.total.over.line}</Text>
            <Text style={[styles.oddsValue, !hasValidTotal && styles.oddsTextLocked]}>{game.odds.total.over.odds}</Text>
            {!hasValidTotal && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.oddsRow}>
          <Text style={styles.teamName}>{game.homeTeam}</Text>
          <TouchableOpacity
            style={[styles.oddsButton, !hasValidSpread && styles.oddsButtonLocked]}
            onPress={hasValidSpread ? () => onAddToBetSlip(game, 'spread', 'home') : handleLockedButtonPress}
          >
            <Text style={[styles.oddsText, !hasValidSpread && styles.oddsTextLocked]}>{game.odds.spread.home.line}</Text>
            <Text style={[styles.oddsValue, !hasValidSpread && styles.oddsTextLocked]}>{game.odds.spread.home.odds}</Text>
            {!hasValidSpread && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.oddsButton, !hasValidMoneyline && styles.oddsButtonLocked]}
            onPress={hasValidMoneyline ? () => onAddToBetSlip(game, 'moneyline', 'home') : handleLockedButtonPress}
          >
            <Text style={[styles.oddsText, !hasValidMoneyline && styles.oddsTextLocked]}>{game.odds.moneyline.home.odds}</Text>
            {!hasValidMoneyline && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.oddsButton, !hasValidTotal && styles.oddsButtonLocked]}
            onPress={hasValidTotal ? () => onAddToBetSlip(game, 'total', 'under') : handleLockedButtonPress}
          >
            <Text style={[styles.oddsText, !hasValidTotal && styles.oddsTextLocked]}>{game.odds.total.under.line}</Text>
            <Text style={[styles.oddsValue, !hasValidTotal && styles.oddsTextLocked]}>{game.odds.total.under.odds}</Text>
            {!hasValidTotal && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    // backgroundColor applied dynamically via animation
    borderRadius: borderRadius,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  matchupContainer: {
    flex: 1,
  },
  matchup: {
    color: TealPineColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  sportLabel: {
    color: TealPineColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  liveGameTime: {
    color: TealPineColors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    color: TealPineColors.textSecondary,
    fontSize: 12,
  },
  upcomingTimeContainer: {
    alignItems: 'flex-end',
  },
  upcomingDate: {
    color: TealPineColors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  upcomingTime: {
    color: TealPineColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scoresContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  scoreTeam: {
    color: TealPineColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  scoreValue: {
    color: TealPineColors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  oddsLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelSpacer: {
    flex: 1,
  },
  labelText: {
    color: TealPineColors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    width: 70,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  oddsContainer: {
    marginTop: 4,
  },
  oddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  teamName: {
    color: TealPineColors.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  oddsButton: {
    backgroundColor: TealPineColors.primary,
    borderRadius: borderRadius,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    width: 70,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oddsText: {
    color: TealPineColors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  oddsValue: {
    color: TealPineColors.textPrimary,
    fontSize: 10,
  },
  oddsButtonLocked: {
    backgroundColor: 'rgba(100, 100, 100, 0.3)', // Greyed out locked button
    opacity: 0.6,
  },
  oddsTextLocked: {
    opacity: 0.5,
  },
  lockIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 10,
    opacity: 0.8,
  },
});
