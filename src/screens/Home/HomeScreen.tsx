import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  RefreshControl,
  Alert,
  Image,
  Animated,
  AppState,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GameCard } from '../../components/GameCard/GameCard';
import { BetSlipBar } from '../../components/BetSlip/BetSlipBar';
import { BetSlip } from '../../components/BetSlip/BetSlip';
import { SportSelector } from '../../components/SportSelector/SportSelector';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import BottomSheet from '@gorhom/bottom-sheet';
import { TealPineColors } from '../../theme/colors';
import { H2 } from '../../components/Typography';
import { RootState } from '../../store';
import { setAuthModalVisible } from '../../store/slices/uiSlice';
import ParlayValidationService from '../../services/parlay/ParlayValidationService';
import OddsAPIService, { SportSection } from '../../services/OddsAPIService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeagueInfo } from '../../constants/leagueLogos';
import { matchesTeam, matchesSport } from '../../utils/fuzzyMatch';
import { useAuth } from '../../contexts/AuthContext';
import { useVerificationDeadline } from '../../hooks/useVerificationDeadline';
import BackendAPIService from '../../services/api/BackendAPIService';

// Sport emoji/logo mapping helper
const getSportIcon = (sportKey: string) => {
  const leagueInfo = getLeagueInfo(sportKey);
  return {
    useEmoji: leagueInfo?.useEmoji || !leagueInfo,
    emoji: leagueInfo?.emoji,
    badge: leagueInfo?.badge,
  };
};

// Fallback emoji mapping (for unknown sports)
const getFallbackEmoji = (sportTitle: string): string => {
  if (sportTitle.includes('NFL')) return '🏈';
  if (sportTitle.includes('College Football')) return '🪖';
  if (sportTitle.includes('NCAAF')) return '🪖';
  if (sportTitle.includes('NCAA')) return '🏈';
  if (sportTitle.includes('NBA')) return '🏀';
  if (sportTitle.includes('NHL')) return '🏒';
  if (sportTitle.includes('MLB')) return '⚾';
  return '🏆';
};

// Get status emoji for Live/Upcoming
const getStatusEmoji = (sportTitle: string): string | null => {
  if (sportTitle.includes('(Live)')) return '🔴';
  if (sportTitle.includes('(Upcoming)')) return '📅';
  return null;
};

const SPORT_FILTER_KEY = '@sport_filter_selections';

export const HomeScreen = () => {
  // All hooks must be at the top level
  const dispatch = useDispatch();
  const { user, isAuthenticated, isEmailVerified } = useAuth();
  const { isPastDeadline } = useVerificationDeadline();
  const [sportSections, setSportSections] = useState<SportSection[]>([]);
  const [allSportSections, setAllSportSections] = useState<SportSection[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [betSlip, setBetSlip] = useState<any[]>([]);
  const [isBackgroundRefreshing, setIsBackgroundRefreshing] = useState(false);
  const betSlipSheetRef = useRef<BottomSheet>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Track when each game was first seen to maintain stable sort order
  const gameSeenTimestamps = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    loadSavedSportFilters();
    loadGames();

    // Set up 30-second auto-refresh (matches Odds API update frequency)
    // Odds API updates live scores every ~30 seconds
    const startAutoRefresh = () => {
      if (refreshIntervalRef.current) return; // Already running

      refreshIntervalRef.current = setInterval(() => {
        console.log('[HomeScreen] Auto-refresh triggered (30s interval)');
        loadGames(true); // true = background refresh
      }, 30000);
      console.log('[HomeScreen] Auto-refresh started');
    };

    const stopAutoRefresh = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
        console.log('[HomeScreen] Auto-refresh stopped');
      }
    };

    // Start auto-refresh initially
    startAutoRefresh();

    // Listen to app state changes (foreground/background)
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('[HomeScreen] App state changed to:', nextAppState);

      if (nextAppState === 'active') {
        // App came to foreground - resume auto-refresh and fetch fresh data
        console.log('[HomeScreen] App foregrounded - resuming auto-refresh');
        startAutoRefresh();
        loadGames(true); // Fetch fresh data immediately
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App went to background - stop auto-refresh to save quota
        console.log('[HomeScreen] App backgrounded - pausing auto-refresh');
        stopAutoRefresh();
      }
    });

    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
      appStateSubscription.remove();
      console.log('[HomeScreen] Cleaned up auto-refresh and app state listener');
    };
  }, []);

  useEffect(() => {
    filterGamesBySports();
  }, [selectedSports, allSportSections, searchQuery]);

  // Pulse animation for refresh indicator
  useEffect(() => {
    if (isBackgroundRefreshing) {
      // Start continuous pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animation and reset
      pulseAnim.setValue(1);
    }
  }, [isBackgroundRefreshing]);

  const loadSavedSportFilters = async () => {
    try {
      const saved = await AsyncStorage.getItem(SPORT_FILTER_KEY);
      if (saved) {
        setSelectedSports(JSON.parse(saved));
      }
    } catch (err) {
      console.error('[HomeScreen] Failed to load sport filters:', err);
    }
  };

  const saveSportFilters = async (sports: string[]) => {
    try {
      await AsyncStorage.setItem(SPORT_FILTER_KEY, JSON.stringify(sports));
    } catch (err) {
      console.error('[HomeScreen] Failed to save sport filters:', err);
    }
  };

  const handleToggleSport = (sportKey: string) => {
    setSelectedSports((prev) => {
      const newSelection = prev.includes(sportKey)
        ? prev.filter((s) => s !== sportKey)
        : [...prev, sportKey];
      saveSportFilters(newSelection);
      return newSelection;
    });
  };

  const filterGamesBySports = () => {
    let filtered = allSportSections;

    // Apply sport filter if selected sports exist
    if (selectedSports.length > 0) {
      filtered = filtered
        .map((section) => {
          const filteredGames = section.games.filter((game) =>
            selectedSports.includes(game.sportKey)
          );
          return {
            ...section,
            games: filteredGames,
          };
        })
        .filter((section) => section.games.length > 0);
    }

    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      filtered = filtered
        .map((section) => {
          const filteredGames = section.games.filter((game) => {
            // Check if sport name matches
            const sportMatch = matchesSport(searchQuery, section.sportTitle) ||
                              matchesSport(searchQuery, game.sportKey || '');

            // Check if team name matches
            const teamMatch = matchesTeam(
              searchQuery,
              game.homeTeam || '',
              game.awayTeam || ''
            );

            return sportMatch || teamMatch;
          });
          return {
            ...section,
            games: filteredGames,
          };
        })
        .filter((section) => section.games.length > 0);
    }

    setSportSections(filtered);
  };

  const loadGames = async (isBackgroundRefresh = false) => {
    try {
      // Start performance measurement
      const loadStartTime = Date.now();
      console.time('[HomeScreen] Total load time');

      // For background refresh, use different state
      if (isBackgroundRefresh) {
        setIsBackgroundRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // DON'T clear cache - let OddsAPIService handle caching strategy
      // This enables optimistic caching and faster initial loads

      // Fetch all active sports from backend API
      // For background refresh, force fresh data; otherwise use cache if available
      console.log(`[HomeScreen] ${isBackgroundRefresh ? 'Background refreshing' : 'Fetching'} games from backend API...`);
      console.warn(`[HomeScreen] ${isBackgroundRefresh ? 'BACKGROUND REFRESH' : 'FETCHING ALL GAMES FROM BACKEND'}`);

      const allSports = await OddsAPIService.getAllActiveGames(isBackgroundRefresh);

      console.log(`[HomeScreen] Loaded ${allSports.length} sports with games`);
      console.warn(`[HomeScreen] ✅ LOADED ${allSports.length} SPORTS WITH GAMES`);

      // Track when games are first seen for stable sorting
      const now = Date.now();
      allSports.forEach(section => {
        section.games.forEach(game => {
          if (!gameSeenTimestamps.current.has(game.id)) {
            gameSeenTimestamps.current.set(game.id, now);
          }
        });
      });

      // Group games by sport, separating live and upcoming
      const liveGamesBySport = new Map<string, { sport: string; sportTitle: string; games: any[] }>();
      const upcomingGamesBySport = new Map<string, { sport: string; sportTitle: string; games: any[] }>();

      allSports.forEach(section => {
        section.games.forEach(game => {
          // Add firstSeenTimestamp to game object for stable sorting
          const gameWithTimestamp = {
            ...game,
            firstSeenTimestamp: gameSeenTimestamps.current.get(game.id) || now
          };

          if (game.isLive) {
            // Group live games by sport
            if (!liveGamesBySport.has(section.sport)) {
              liveGamesBySport.set(section.sport, {
                sport: section.sport,
                sportTitle: section.sportTitle,
                games: []
              });
            }
            liveGamesBySport.get(section.sport)!.games.push(gameWithTimestamp);
          } else {
            // Group upcoming games by sport
            if (!upcomingGamesBySport.has(section.sport)) {
              upcomingGamesBySport.set(section.sport, {
                sport: section.sport,
                sportTitle: section.sportTitle,
                games: []
              });
            }
            upcomingGamesBySport.get(section.sport)!.games.push(gameWithTimestamp);
          }
        });
      });

      // Create sections: Live games by sport first, then upcoming games by sport
      const sections: SportSection[] = [];

      // Add live game sections (by sport) - sorted by firstSeenTimestamp for stable order
      liveGamesBySport.forEach(section => {
        if (section.games.length > 0) {
          // Sort by firstSeenTimestamp to maintain consistent order across refreshes
          const sortedGames = section.games.sort((a, b) =>
            (a.firstSeenTimestamp || 0) - (b.firstSeenTimestamp || 0)
          );
          sections.push({
            sport: section.sport,
            sportTitle: `${section.sportTitle} (Live)`,
            games: sortedGames,
          });
        }
      });

      // Add upcoming game sections (by sport) - sorted by firstSeenTimestamp for stable order
      upcomingGamesBySport.forEach(section => {
        if (section.games.length > 0) {
          // Sort by firstSeenTimestamp to maintain consistent order across refreshes
          const sortedGames = section.games.sort((a, b) =>
            (a.firstSeenTimestamp || 0) - (b.firstSeenTimestamp || 0)
          );
          sections.push({
            sport: section.sport,
            sportTitle: `${section.sportTitle} (Upcoming)`,
            games: sortedGames,
          });
        }
      });

      console.warn(`[HomeScreen] Created ${sections.length} sections`);

      setAllSportSections(sections);

      // If no games at all, show message
      if (sections.length === 0) {
        console.warn('[HomeScreen] ⚠️ NO GAMES AVAILABLE');
        setError('No games available at the moment');
      }
    } catch (err: any) {
      console.error('[HomeScreen] Error loading games:', err);
      if (!isBackgroundRefresh) {
        setError(err.message || 'Failed to load games');
        Alert.alert('Error Loading Games', err.message || 'Failed to load games. Please try again.');
      } else {
        // Silently log background refresh errors
        console.warn('[HomeScreen] Background refresh failed, will retry in 30s');
      }
    } finally {
      // End performance measurement
      const loadEndTime = Date.now();
      const loadDuration = loadEndTime - Date.now();
      console.timeEnd('[HomeScreen] Total load time');
      console.log(`[HomeScreen] Load completed in ${Math.abs(loadDuration)}ms`);

      if (isBackgroundRefresh) {
        setIsBackgroundRefreshing(false);
      } else {
        setLoading(false);
      }
      setRefreshing(false);
    }
  };

  const handleAddToBetSlip = (game: any, betType: string, selection: string) => {
    // CRITICAL VALIDATION: Ensure game has required sport_key field
    if (!game.sportKey || typeof game.sportKey !== 'string') {
      console.error('[HomeScreen] ERROR: Missing or invalid sportKey when adding bet to slip');
      console.error('[HomeScreen] Game object:', JSON.stringify({
        id: game.id,
        sportKey: game.sportKey,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        hasOdds: !!game.odds,
      }, null, 2));

      Alert.alert(
        'Unable to Add Bet',
        'This game is missing required information. Please try refreshing the games list.',
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('[HomeScreen] Adding bet to slip:', {
      gameId: game.id,
      sportKey: game.sportKey,
      betType,
      selection,
      teams: `${game.awayTeam} @ ${game.homeTeam}`
    });

    // Get the selected odds object
    const selectedOddsObj = game.odds[betType][selection];

    // Determine opposing odds based on bet type and selection
    let opposingOddsObj;
    if (betType === 'moneyline') {
      opposingOddsObj = selection === 'home' ? game.odds.moneyline.away : game.odds.moneyline.home;
    } else if (betType === 'spread') {
      opposingOddsObj = selection === 'home' ? game.odds.spread.away : game.odds.spread.home;
    } else if (betType === 'total') {
      opposingOddsObj = selection === 'over' ? game.odds.total.under : game.odds.total.over;
    }

    // Extract the actual betting odds (American odds like -110, +102)
    const selectedOdds = selectedOddsObj.odds;
    const opposingOdds = opposingOddsObj.odds;

    // Parse American odds to numbers for BKS calculation
    const parseAmericanOdds = (odds: string) => {
      return parseFloat(odds.replace(/[+\-]/g, '')) * (odds.startsWith('-') ? -1 : 1);
    };

    // Store line/spread value for display (e.g., "+2.5", "O 225.5")
    const rawSelectedLine = betType === 'moneyline'
      ? null
      : selectedOddsObj.line;
    const rawOpposingLine = betType === 'moneyline'
      ? null
      : opposingOddsObj.line;

    // Extract numeric line value from raw display (e.g., "+2.5" -> 2.5, "O 225.5" -> 225.5)
    const extractNumericLine = (rawLine: string | null): number | undefined => {
      if (!rawLine) return undefined;
      const match = rawLine.match(/[-+]?[\d.]+/);
      return match ? parseFloat(match[0]) : undefined;
    };

    const newBet = {
      id: `${game.id}-${betType}-${selection}-${Date.now()}`,
      game_id: game.id,
      sport_key: game.sportKey,
      teams: `${game.awayTeam} @ ${game.homeTeam}`,
      bet_type: betType,
      market_type: '2way', // Default to 2way, adjust for 3way markets if needed
      selection,
      odds: parseAmericanOdds(selectedOdds), // American odds as number
      opposing_odds: parseAmericanOdds(opposingOdds),
      raw_odds_display: rawSelectedLine, // Line/spread for display
      raw_opposing_display: rawOpposingLine,
      american_odds: selectedOdds, // Store actual American odds string
      line: extractNumericLine(rawSelectedLine), // Numeric line for validation
      commence_time: new Date().toISOString(), // TODO: Use actual game commence time
      context: 'regular',
    };

    // PARLAY VALIDATION - Silent blocking
    const validation = ParlayValidationService.validate(betSlip, newBet);

    if (!validation.valid) {
      // Silently reject the bet - don't add it, don't show error
      // User only sees no action when they tap
      console.log('[Parlay Validation] Blocked:', validation.invalidReason);
      return; // Exit without adding bet or showing alert
    }

    // Valid bet - add to slip
    setBetSlip([...betSlip, newBet]);
    // No alert needed - BetSlipBar provides visual feedback
  };

  const handleViewBetSlip = () => {
    betSlipSheetRef.current?.expand();
  };

  const handleClearSlip = () => {
    Alert.alert(
      'Clear Bet Slip',
      `Remove all ${betSlip.length} bet(s) from your slip?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setBetSlip([]),
        },
      ]
    );
  };

  const handleRemoveBet = (betId: string) => {
    console.log('Removing bet from slip:', betId);
    const updatedBetSlip = betSlip.filter(bet => bet.id !== betId);
    setBetSlip(updatedBetSlip);

    if (updatedBetSlip.length === 0) {
      betSlipSheetRef.current?.close();
    }
  };

  const handlePlaceBet = async (bets: any[], stakes: any, predictedBKS: any) => {
    // Check if user is not authenticated
    if (!user || !isAuthenticated) {
      Alert.alert(
        'Sign In to Place Bet',
        `You have ${betSlip.length} bet(s) ready. Sign in to place them and start tracking your BKS!`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => dispatch(setAuthModalVisible(true)) },
        ]
      );
      return;
    }

    // Check if past deadline and not verified
    if (isPastDeadline && !isEmailVerified) {
      Alert.alert(
        'Verify Email to Place Bet',
        'Email verification is required to place bets after the first 24 hours. Please check your inbox and verify your email.',
        [
          { text: 'OK', style: 'default' },
          {
            text: 'Resend Email',
            onPress: () => {
              // TODO: Implement resend verification email
              console.log('Resend verification email');
            },
          },
        ]
      );
      return;
    }

    // User is authorized to place bet
    try {
      console.log('[HomeScreen] Placing bets:', { count: bets.length, stake: stakes.overall });

      // Map bet_type to backend market format
      const betTypeToMarket = (betType: string): string => {
        switch (betType) {
          case 'moneyline': return 'h2h';
          case 'spread': return 'spreads';
          case 'total': return 'totals';
          default: return 'h2h';
        }
      };

      // Calculate parlay odds if multiple bets
      let parlayOdds = bets[0].odds;
      if (bets.length > 1) {
        // Multiply decimal odds together, then convert back to American
        let combinedDecimal = 1;
        for (const bet of bets) {
          const americanOdds = bet.odds;
          const decimal = americanOdds > 0
            ? (americanOdds / 100) + 1
            : (100 / Math.abs(americanOdds)) + 1;
          combinedDecimal *= decimal;
        }
        // Convert combined decimal back to American odds
        parlayOdds = combinedDecimal >= 2
          ? Math.round((combinedDecimal - 1) * 100)
          : Math.round(-100 / (combinedDecimal - 1));
      }

      // CRITICAL VALIDATION: Verify all bets have required sport_key before sending to backend
      const invalidBets = bets.filter(bet => !bet.sport_key || typeof bet.sport_key !== 'string');
      if (invalidBets.length > 0) {
        console.error('[HomeScreen] ERROR: Bets missing sport_key:', invalidBets);
        console.error('[HomeScreen] All bets:', JSON.stringify(bets, null, 2));

        Alert.alert(
          'Unable to Place Bet',
          'Some bets are missing required information. Please remove them and try again.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Build bet data for backend API
      // IMPORTANT: Single bets and parlays have different data structures!
      let betData: any;

      if (bets.length === 1) {
        // SINGLE BET: Flat structure at top level
        const bet = bets[0];
        betData = {
          sport_key: bet.sport_key,
          event_id: bet.game_id,  // Backend expects "event_id" not "game_id"
          market: betTypeToMarket(bet.bet_type),
          selection: bet.selection,
          odds_american: bet.odds,
          stake: parseFloat(stakes.overall),
          line: bet.line,
          entry_opposing_odds_american: bet.opposing_odds,
          entry_draw_odds_american: undefined,  // Not used for 2-way markets
          context: bet.context || 'regular',
          correlation: 0
        };
        console.log('[HomeScreen] Placing SINGLE bet with flat structure');
      } else {
        // PARLAY BET: Legs array structure
        betData = {
          legs: bets.map(bet => ({
            game_id: bet.game_id,
            sport_key: bet.sport_key,
            market: betTypeToMarket(bet.bet_type),
            selection: bet.selection,
            odds_american: bet.odds,
            line: bet.line,
            entry_opposing_odds_american: bet.opposing_odds,
            market_type: bet.market_type
          })),
          stake: parseFloat(stakes.overall),
          parlay_odds_american: parlayOdds,
          context: bets[0].context || 'regular',
          correlation: 0
        };
        console.log(`[HomeScreen] Placing PARLAY bet with ${bets.length} legs`);
      }

      console.log('[HomeScreen] Bet data validation passed - all legs have sport_key');
      console.log('[HomeScreen] Calling BackendAPIService.placeBet with:', JSON.stringify(betData, null, 2));

      // Call backend API
      const response = await BackendAPIService.placeBet(betData);

      console.log('[HomeScreen] Bet placed successfully:', response);

      // Close bet slip and clear bets
      betSlipSheetRef.current?.close();
      setBetSlip([]);

      // Show success message
      const bksValue = response.bks_provisional || predictedBKS.overall;
      const roundedBKS = Math.round(bksValue);
      Alert.alert(
        'Bet Placed!',
        `Your ${bets.length === 1 ? 'bet' : `${bets.length}-leg parlay`} has been placed successfully.\n\nBKS: ${roundedBKS}`,
        [{ text: 'OK' }]
      );

    } catch (error: any) {
      console.error('[HomeScreen] Error placing bet:', error);

      // Show error message
      Alert.alert(
        'Bet Placement Failed',
        error.response?.data?.message || error.message || 'Failed to place bet. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Background refresh indicator */}
      {isBackgroundRefreshing && (
        <View style={styles.refreshIndicator}>
          <Animated.View style={[styles.refreshDot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={styles.refreshText}>Updating odds...</Text>
        </View>
      )}

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Search by sport or team..."
      />
      <SportSelector
        selectedSports={selectedSports}
        onToggleSport={handleToggleSport}
      />
      <SectionList
        sections={sportSections.map(section => ({
          title: section.sportTitle,
          data: section.games,
          gameCount: section.games.length,
        }))}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderSectionHeader={({ section }) => {
          const statusEmoji = getStatusEmoji(section.title);
          // Extract sport key from section data
          const sportKey = sportSections.find(s => s.sportTitle === section.title)?.sport;
          const sportIcon = sportKey ? getSportIcon(sportKey) : null;
          const fallbackEmoji = getFallbackEmoji(section.title);

          return (
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {sportIcon && !sportIcon.useEmoji ? (
                  <Image
                    source={{ uri: sportIcon.badge }}
                    style={styles.sportLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.sportEmoji}>
                    {sportIcon?.emoji || fallbackEmoji}
                  </Text>
                )}
                <H2>{section.title}</H2>
                {statusEmoji && (
                  <Text style={styles.statusEmoji}>{statusEmoji}</Text>
                )}
              </View>
              <Text style={styles.gameCount}>{section.gameCount} games</Text>
            </View>
          );
        }}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onAddToBetSlip={handleAddToBetSlip}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadGames}
            tintColor={TealPineColors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading
                ? 'Loading games...'
                : searchQuery.trim()
                  ? `No games found for "${searchQuery}"`
                  : error || 'No games available'}
            </Text>
            {error && !loading && (
              <Text style={styles.errorHint}>Pull down to refresh</Text>
            )}
            {searchQuery.trim() && !loading && (
              <>
                <Text style={styles.errorHint}>Try searching by:</Text>
                <Text style={styles.errorHint}>• Sport name (NFL, NBA, NHL, MLB)</Text>
                <Text style={styles.errorHint}>• Team name (Lakers, Chiefs, Yankees)</Text>
              </>
            )}
          </View>
        }
        stickySectionHeadersEnabled={true}
      />

      {betSlip.length > 0 && (
        <BetSlipBar
          betCount={betSlip.length}
          onViewSlip={handleViewBetSlip}
          onClearSlip={handleClearSlip}
        />
      )}

      <BottomSheet
        ref={betSlipSheetRef}
        index={-1}
        snapPoints={['75%', '90%']}
        enablePanDownToClose={true}
        enableOverDrag={true}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        onChange={(index) => {
          if (index === -1) {
            console.log('Bet slip closed via swipe');
          }
        }}
      >
        <BetSlip
          bets={betSlip}
          onPlaceBet={handlePlaceBet}
          onClearSlip={handleClearSlip}
          onRemoveBet={handleRemoveBet}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  refreshIndicator: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 179, 164, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  refreshDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TealPineColors.primary,
    marginRight: 6,
  },
  refreshText: {
    color: TealPineColors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    backgroundColor: 'rgba(0, 30, 30, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: TealPineColors.primary,
  },
  sportEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  sportLogo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  sectionTitle: {
    color: TealPineColors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusEmoji: {
    fontSize: 11,
    marginLeft: 8,
  },
  gameCount: {
    color: TealPineColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
  errorHint: {
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.7,
  },
  bottomSheetBackground: {
    backgroundColor: TealPineColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bottomSheetIndicator: {
    backgroundColor: TealPineColors.primary,
    width: 48,
    height: 5,
    borderRadius: 3,
  },
});
