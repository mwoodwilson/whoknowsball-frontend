// src/components/BetSlip/BetSlip.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Config from 'react-native-config';
import { TealPineColors } from '../../theme/colors';
import ParlayValidationService, { ParlayType } from '../../services/parlay/ParlayValidationService';
import { H2, Label } from '../Typography';

export const BetSlip = ({ bets, onPlaceBet, onClearSlip, onRemoveBet }) => {
  const [stake, setStake] = useState('');
  const [overallBKS, setOverallBKS] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [bksError, setBksError] = useState(null);

  // Clear stake when bet slip is emptied
  useEffect(() => {
    if (!bets || bets.length === 0) {
      setStake('');
      setOverallBKS(null);
      setBksError(null);
    }
  }, [bets]);

  // Helper function to get league name from sport_key
  const getLeagueName = (sport_key: string) => {
    const leagueMap: Record<string, string> = {
      'basketball_nba': 'NBA',
      'americanfootball_nfl': 'NFL',
      'baseball_mlb': 'MLB',
      'icehockey_nhl': 'NHL',
      'soccer_epl': 'EPL',
      'soccer_usa_mls': 'MLS',
    };
    return leagueMap[sport_key] || sport_key.toUpperCase();
  };

  // Determine game display based on bet composition
  const getGameDisplay = () => {
    if (!bets || bets.length === 0) return null;

    const firstBet = bets[0];

    // Check if all bets are from same game
    const allSameGame = bets.every(bet => bet.game_id === firstBet.game_id);

    // Check if all bets are from same league
    const allSameLeague = bets.every(bet => bet.sport_key === firstBet.sport_key);

    const league = getLeagueName(firstBet.sport_key);

    if (allSameGame) {
      // All legs from same game
      return {
        title: `${league} • ${firstBet.teams}`,
        date: new Date(firstBet.commence_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: new Date(firstBet.commence_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
      };
    } else if (allSameLeague && bets.length > 1) {
      // All legs from same league but different games
      return {
        title: `${league} • ${bets.length} Leg Parlay`,
        date: null,
        time: null
      };
    } else if (bets.length > 1) {
      // Legs cross multiple leagues
      return {
        title: `Multi • ${bets.length} Leg Parlay`,
        date: null,
        time: null
      };
    } else {
      // Single bet
      return {
        title: `${league} • ${firstBet.teams}`,
        date: new Date(firstBet.commence_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: new Date(firstBet.commence_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
      };
    }
  };

  const gameInfo = getGameDisplay();

  // Calculate combined odds for all legs
  const calculateCombinedOdds = () => {
    if (bets.length === 0) return 100; // Even odds as default

    // Convert American odds to decimal and multiply
    let decimalOdds = 1;
    bets.forEach(bet => {
      const american = bet.odds;
      const decimal = american > 0
        ? (american / 100) + 1
        : (100 / Math.abs(american)) + 1;
      decimalOdds *= decimal;
    });

    // Convert back to American odds
    if (decimalOdds >= 2) {
      return Math.round((decimalOdds - 1) * 100);
    } else {
      return Math.round(-100 / (decimalOdds - 1));
    }
  };

  const combinedOdds = calculateCombinedOdds();

  // Calculate potential payout
  const calculatePayout = () => {
    const stakeValue = parseFloat(stake);
    if (!stake || isNaN(stakeValue) || stakeValue < 1) return 0;

    if (combinedOdds > 0) {
      return stakeValue * (combinedOdds / 100 + 1);
    } else {
      return stakeValue * (1 + 100 / Math.abs(combinedOdds));
    }
  };

  // Map bet_type to market format expected by backend
  const mapBetTypeToMarket = (betType) => {
    const marketMap = {
      'moneyline': 'h2h',
      'spread': 'spreads',
      'total': 'totals'
    };
    return marketMap[betType] || 'h2h';
  };

  const handleRemoveBet = (betId) => {
    console.log('🗑️  Removing bet:', betId);
    if (onRemoveBet) {
      onRemoveBet(betId);
    }
  };

  const handleStakeChange = (value) => {
    // Only allow numbers and one decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');

    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    const sanitized = parts.length > 2
      ? parts[0] + '.' + parts.slice(1).join('')
      : numericValue;

    console.log('💰 Stake changed to:', sanitized);
    setStake(sanitized);
  };

  // Auto-calculate BKS when bets or stake changes
  useEffect(() => {
    const calculateBKSDebounced = () => {
      console.log('🔄 BKS calculation triggered - bets.length:', bets.length, 'stake:', stake);

      if (!stake || parseFloat(stake) <= 0 || !bets || bets.length === 0) {
        console.log('⚠️  Invalid inputs - clearing BKS');
        setOverallBKS(null);
        setIsCalculating(false);
        return;
      }

      const stakeNum = parseFloat(stake);
      console.log('📊 Starting BKS calculation with stake:', stakeNum);
      setIsCalculating(true);
      setBksError(null);

      // Calculate combined odds for parlays
      const combinedOddsDecimal = bets.reduce((acc, bet) => {
        const decimal = bet.odds > 0 ? (bet.odds / 100) + 1 : 100 / Math.abs(bet.odds) + 1;
        return acc * decimal;
      }, 1);

      const americanOdds = combinedOddsDecimal >= 2
        ? Math.round((combinedOddsDecimal - 1) * 100)
        : Math.round(-100 / (combinedOddsDecimal - 1));

      // Extract numeric line value from raw_odds_display (e.g., "+2.5" -> 2.5, "O 225" -> 225)
      const extractLine = (rawDisplay: string): number | undefined => {
        if (!rawDisplay) return undefined;
        const match = rawDisplay.match(/[-+]?[\d.]+/);
        return match ? parseFloat(match[0]) : undefined;
      };

      const firstBetLine = extractLine(bets[0].raw_odds_display);

      const payload = {
        // REQUIRED fields for backend
        bet_id: bets.length > 1 ? `parlay-${Date.now()}` : bets[0].id,
        game_id: bets[0].game_id || 'unknown',
        commence_time: bets[0].commence_time || new Date().toISOString(),
        sport_key: bets[0].sport_key,
        status: 'PENDING',
        market: mapBetTypeToMarket(bets[0].bet_type),
        selection: bets[0].selection,
        odds_american: americanOdds,
        stake: stakeNum,

        // Line is required for spreads and totals
        ...(firstBetLine !== undefined && { line: firstBetLine }),

        // Optional fields for enhanced BKS
        entry_opposing_odds_american: bets[0].opposing_odds,
        context: bets[0].context || 'regular',

        // Parlay fields
        legs: bets.length > 1 ? bets.map(bet => ({
          sport_key: bet.sport_key,
          market: mapBetTypeToMarket(bet.bet_type),
          selection: bet.selection,
          odds_american: bet.odds,
          entry_opposing_odds_american: bet.opposing_odds,
          market_type: bet.market_type || '2way',
          line: extractLine(bet.raw_odds_display),
        })) : undefined,
      };

      console.log('📤 BKS Calculation Request:', JSON.stringify(payload, null, 2));

      // Build headers with API key if configured
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (Config.API_KEY) {
        headers['X-API-Key'] = Config.API_KEY;
      }

      const backendUrl = Config.BACKEND_URL || 'http://localhost:3000';
      fetch(`${backendUrl}/api/v1/bets/calculate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
        .then(res => {
          console.log('📥 Response status:', res.status);
          console.log('📥 Response ok:', res.ok);
          console.log('📥 Response headers:', JSON.stringify([...res.headers.entries()]));

          // Always read the body first to check for error details
          return res.text().then(text => ({ text, status: res.status, ok: res.ok }));
        })
        .then(({ text, status, ok }) => {
          console.log('📥 Raw response text:', text);
          console.log('📥 Raw response length:', text.length);

          try {
            const data = JSON.parse(text);
            console.log('📥 Parsed JSON data:', JSON.stringify(data, null, 2));
            console.log('📥 Response keys:', Object.keys(data || {}));

            // Check for error response first
            if (data.error || data.message) {
              console.error('❌ Server error:', data.error, data.message);

              // Convert API/auth errors to user-friendly messages
              let errorMessage = data.message || data.error || 'Server error';

              // Check for authentication/authorization errors
              if (errorMessage.toLowerCase().includes('api key') ||
                  errorMessage.toLowerCase().includes('unauthorized') ||
                  errorMessage.toLowerCase().includes('x-api-key')) {
                errorMessage = 'Please log in to calculate BKS score';
              }

              setBksError(errorMessage);
              setOverallBKS(null);
              return;
            }

            // If not ok and no error details, throw generic error
            if (!ok) {
              throw new Error(`HTTP error! status: ${status}`);
            }

            console.log('📥 BKS field type:', typeof data.bks);
            console.log('📥 BKS field value:', data.bks);
            console.log('📥 Score field type:', typeof data.score);
            console.log('📥 Score field value:', data.score);

            // Check for different possible response formats
            if (data && typeof data.bks === 'number') {
              console.log('✅ Setting BKS from data.bks:', data.bks);
              setOverallBKS(data.bks);
              setBksError(null);
            } else if (data && typeof data.score === 'number') {
              console.log('✅ Setting BKS from data.score:', data.score);
              setOverallBKS(data.score);
              setBksError(null);
            } else if (data && typeof data.bks_provisional === 'number') {
              console.log('✅ Setting BKS from data.bks_provisional:', data.bks_provisional);
              setOverallBKS(data.bks_provisional);
              setBksError(null);
            } else {
              console.error('❌ Unexpected response format');
              console.error('❌ Available fields:', Object.keys(data || {}));
              console.error('❌ Full data:', data);
              setBksError('Invalid response format');
              setOverallBKS(null);
            }
          } catch (e) {
            console.error('❌ Failed to parse JSON:', e);
            console.error('❌ Parse error:', e.message);
            console.error('❌ Response text:', text);
            setBksError('Invalid JSON response');
            setOverallBKS(null);
          }
        })
        .catch(error => {
          console.error('❌ BKS calculation error:', error);
          console.error('❌ Error type:', error.name);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error stack:', error.stack);
          setBksError(error.message || 'Calculation failed');
          setOverallBKS(null);
        })
        .finally(() => {
          console.log('🏁 BKS calculation finished');
          setIsCalculating(false);
        });
    };

    const timer = setTimeout(calculateBKSDebounced, 500);
    return () => clearTimeout(timer);
  }, [bets, stake]);

  const getBKSColor = (bks) => {
    if (!bks) return TealPineColors.textSecondary;
    if (bks >= 91) return '#22C55E'; // Green for Ball God
    if (bks >= 61) return '#22C55E'; // Green for Ball Knower
    return '#EAB308'; // Yellow/Gold for everything else (0-60)
  };

  const getBKSLabel = (bks) => {
    if (!bks) return '';
    if (bks >= 91) return 'BALL GOD';
    if (bks >= 61) return 'BALL KNOWER';
    if (bks >= 51) return 'SOLID';
    if (bks >= 31) return 'STANDARD';
    return 'CONSERVATIVE';
  };

  const potentialPayout = calculatePayout();
  const hasStake = stake && parseFloat(stake) >= 1;
  const toWinAmount = hasStake ? potentialPayout - parseFloat(stake) : 0;

  // Check for invalid parlay combinations
  const hasInvalidCombinations = ParlayValidationService.hasInvalidCombinations(bets);
  const maxLegs = 10; // Max legs for both regular and SGP

  // Dynamic title based on validation
  const title = hasInvalidCombinations
    ? "Bet Slip - Contains Invalid Combinations"
    : bets.length > 0
      ? `Bet Slip (${bets.length}/${maxLegs})`
      : 'Bet Slip';

  return (
    <View style={styles.container}>
      {/* Header with Bet Type Badge */}
      <View style={styles.header}>
        <H2 style={styles.title}>{title}</H2>
        {bets.length === 1 ? (
          <View style={styles.betTypeBadge}>
            <Label style={styles.betTypeBadgeText}>Straight</Label>
          </View>
        ) : bets.length > 1 ? (
          <View style={styles.betTypeBadge}>
            <Label style={styles.betTypeBadgeText}>Parlay</Label>
          </View>
        ) : null}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Game Info */}
        {gameInfo && (
          <View style={styles.gameInfoContainer}>
            <View style={styles.gameInfoRow}>
              <View style={styles.gameInfoLeft}>
                <Text style={styles.gameInfoSport}>{gameInfo.title}</Text>
                {gameInfo.date && gameInfo.time && (
                  <Text style={styles.gameInfoDateTime}>
                    {gameInfo.date} • {gameInfo.time}
                  </Text>
                )}
              </View>
              {bets.length > 1 && (
                <Text style={styles.gameInfoOdds}>
                  {combinedOdds > 0 ? '+' : ''}{combinedOdds}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Selections List */}
        <View style={styles.selectionsContainer}>
          <Label style={styles.sectionTitle}>SELECTIONS ({bets.length})</Label>

          <View style={styles.selectionsWithConnector}>
            {bets.map((bet, index) => {
              // Build the selection title based on bet type and selection
              let selectionTitle = '';

              if (bet.bet_type === 'moneyline') {
                // For moneyline: just team name
                const teamName = bet.selection === 'home'
                  ? bet.teams.split(' @ ')[1]
                  : bet.teams.split(' @ ')[0];
                selectionTitle = teamName;
              } else if (bet.bet_type === 'spread') {
                // For spread: "Team +3" or "Team -2.5"
                const teamName = bet.selection === 'home'
                  ? bet.teams.split(' @ ')[1]
                  : bet.teams.split(' @ ')[0];
                selectionTitle = `${teamName} ${bet.raw_odds_display}`;
              } else if (bet.bet_type === 'total') {
                // For total: "Over 47.5" or "Under 225"
                const value = bet.raw_odds_display.replace(/^[OU]\s*/, '');
                const direction = bet.selection === 'over' ? 'Over' : 'Under';
                selectionTitle = `${direction} ${value}`;
              }

              // Use the American odds string stored in bet
              const oddsValue = bet.american_odds || (bet.odds > 0 ? `+${bet.odds}` : `${bet.odds}`);

              // Game matchup (e.g., "Lakers vs Warriors")
              const gameMatchup = bet.teams.replace(' @ ', ' vs ');

              return (
                <View key={bet.id} style={styles.selectionRowWrapper}>
                  <View style={styles.selectionRow}>
                    <View style={styles.selectionInfo}>
                      <View style={styles.selectionTitleRow}>
                        {/* Circular dot with ring aligned with title */}
                        <View style={styles.dotConnector}>
                          <View style={styles.dotRing}>
                            <View style={styles.dot} />
                          </View>
                          {/* Connecting line to next dot */}
                          {index < bets.length - 1 && (
                            <View style={styles.dotConnectorLine} />
                          )}
                        </View>
                        <Text style={styles.selectionTeam}>{selectionTitle}</Text>
                      </View>
                      <Text style={styles.selectionGame}>{gameMatchup}</Text>
                    </View>
                    <View style={styles.selectionRight}>
                      <Text style={styles.selectionOdds}>{oddsValue}</Text>
                      <TouchableOpacity
                        style={styles.removeX}
                        onPress={() => handleRemoveBet(bet.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={styles.removeXText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity onPress={onClearSlip} style={styles.removeAllButton}>
            <Text style={styles.removeAllText}>Remove All Selections</Text>
          </TouchableOpacity>
        </View>

        {/* BKS Gauge Section */}
        <View style={styles.bksSection}>
          <Label style={styles.bksTitle}>PRELIMINARY BKS SCORE</Label>

          {isCalculating ? (
            <View style={styles.bksGaugeContainer}>
              <View style={styles.bksGauge}>
                <ActivityIndicator size="large" color={TealPineColors.primary} />
              </View>
              <Text style={styles.bksCalculatingText}>Calculating...</Text>
            </View>
          ) : bksError ? (
            <View style={styles.bksGaugeContainer}>
              <View style={styles.bksGauge}>
                <Text style={styles.bksGaugeScore}>—</Text>
                <Text style={styles.bksGaugeDenominator}>/100</Text>
              </View>
              <Text style={styles.bksErrorText}>{bksError}</Text>
            </View>
          ) : overallBKS ? (
            <View style={styles.bksGaugeContainer}>
              <View style={[styles.bksGauge, { borderColor: getBKSColor(overallBKS) }]}>
                <Text style={[styles.bksGaugeScore, { color: getBKSColor(overallBKS) }]}>
                  {overallBKS.toFixed(0)}
                </Text>
                <Text style={styles.bksGaugeDenominator}>/100</Text>
              </View>
              <Text style={[styles.bksRatingText, { color: getBKSColor(overallBKS) }]}>
                {getBKSLabel(overallBKS)}
              </Text>
            </View>
          ) : (
            <View style={styles.bksGaugeContainer}>
              <View style={styles.bksGauge}>
                <Text style={styles.bksGaugeScore}>—</Text>
                <Text style={styles.bksGaugeDenominator}>/100</Text>
              </View>
              <Text style={styles.bksHint}>Enter stake to calculate</Text>
            </View>
          )}
        </View>

        {/* Stake and To Win Side by Side */}
        <View style={styles.stakeWinContainer}>
          <View style={styles.stakeColumn}>
            <Label style={styles.inputLabel}>STAKE</Label>
            <View style={styles.stakeInputWrapper}>
              <Text style={styles.stakeDollarSign}>$</Text>
              <TextInput
                style={styles.stakeInput}
                placeholder="0"
                placeholderTextColor={TealPineColors.textSecondary}
                keyboardType="decimal-pad"
                value={stake}
                onChangeText={handleStakeChange}
              />
            </View>
          </View>

          <View style={styles.toWinColumn}>
            <Label style={styles.inputLabel}>TO WIN</Label>
            <View style={styles.toWinDisplay}>
              <Text style={styles.toWinAmount}>
                ${toWinAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Bet Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.placeBetButton,
            (!hasStake || hasInvalidCombinations) && styles.placeBetButtonDisabled
          ]}
          onPress={() => {
            if (hasStake && !hasInvalidCombinations) {
              onPlaceBet(bets, { overall: stake }, { overall: overallBKS });
            }
          }}
          disabled={!hasStake || hasInvalidCombinations}
        >
          <Text style={styles.placeBetText}>Place Bet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 179, 164, 0.2)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: TealPineColors.textPrimary,
  },
  betTypeBadge: {
    backgroundColor: TealPineColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  betTypeBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: TealPineColors.textPrimary,
  },
  content: {
    flex: 1,
  },
  // Game Info
  gameInfoContainer: {
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 179, 164, 0.1)',
  },
  gameInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameInfoLeft: {
    flex: 1,
  },
  gameInfoSport: {
    fontSize: 14,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 4,
  },
  gameInfoDateTime: {
    fontSize: 13,
    fontWeight: '500',
    color: TealPineColors.textSecondary,
  },
  gameInfoOdds: {
    fontSize: 20,
    fontWeight: '700',
    color: TealPineColors.accent,
    marginLeft: 16,
  },
  // Selections List
  selectionsContainer: {
    padding: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: TealPineColors.textSecondary,
    letterSpacing: 1,
    marginBottom: 16,
  },
  selectionsWithConnector: {
    position: 'relative',
    marginLeft: 10,
  },
  selectionRowWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  selectionRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingLeft: 20,
  },
  selectionInfo: {
    flex: 1,
  },
  selectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  dotConnector: {
    position: 'absolute',
    left: -30,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0, 179, 164, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TealPineColors.surface,
    zIndex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: TealPineColors.primary,
  },
  dotConnectorLine: {
    position: 'absolute',
    left: 9,
    top: 20,
    width: 2,
    height: 40,
    backgroundColor: 'rgba(0, 179, 164, 0.3)',
    zIndex: 0,
  },
  selectionTeam: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
  },
  selectionGame: {
    fontSize: 13,
    fontWeight: '500',
    color: TealPineColors.textSecondary,
    marginTop: 2,
  },
  selectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectionOdds: {
    fontSize: 16,
    fontWeight: '700',
    color: TealPineColors.textPrimary,
  },
  removeX: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeXText: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
  },
  removeAllButton: {
    paddingVertical: 12,
    marginTop: 8,
  },
  removeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
    textAlign: 'center',
  },
  // BKS Section
  bksSection: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: 'rgba(0, 30, 30, 0.8)',
    borderRadius: 16,
    padding: 20,
    paddingVertical: 24,
  },
  bksTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TealPineColors.textSecondary,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  bksGaugeContainer: {
    alignItems: 'center',
  },
  bksGauge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: TealPineColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 179, 164, 0.05)',
    shadowColor: TealPineColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bksGaugeScore: {
    fontSize: 56,
    fontWeight: '300',
    color: TealPineColors.primary,
    lineHeight: 56,
  },
  bksGaugeDenominator: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textSecondary,
    marginTop: 2,
  },
  bksRatingText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bksCalculatingText: {
    fontSize: 13,
    color: TealPineColors.textSecondary,
    marginTop: 12,
  },
  bksErrorText: {
    fontSize: 13,
    color: '#FF3B30',
    marginTop: 12,
  },
  bksHint: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    marginTop: 12,
  },
  // Stake and Win Side by Side
  stakeWinContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 8,
    gap: 12,
  },
  stakeColumn: {
    flex: 1,
  },
  toWinColumn: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: TealPineColors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  stakeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: TealPineColors.primary,
    paddingHorizontal: 12,
    height: 50,
  },
  stakeDollarSign: {
    fontSize: 18,
    fontWeight: '700',
    color: TealPineColors.textPrimary,
    marginRight: 4,
  },
  stakeInput: {
    flex: 1,
    color: TealPineColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  toWinDisplay: {
    backgroundColor: 'rgba(0, 179, 164, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: TealPineColors.primary,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toWinAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: TealPineColors.accent,
  },
  // Footer
  footer: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 179, 164, 0.3)',
    backgroundColor: TealPineColors.surface,
  },
  placeBetButton: {
    backgroundColor: TealPineColors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeBetButtonDisabled: {
    backgroundColor: 'rgba(0, 179, 164, 0.3)',
  },
  placeBetText: {
    fontSize: 18,
    fontWeight: '700',
    color: TealPineColors.textPrimary,
  },
});
