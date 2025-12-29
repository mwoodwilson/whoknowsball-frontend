import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  AppState,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TealPineColors } from '../../theme/colors';
import BackendAPIService from '../../services/api/BackendAPIService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { useVerificationDeadline } from '../../hooks/useVerificationDeadline';
import { LEAGUE_LOGOS, getLeagueInfo } from '../../constants/leagueLogos';

type TabType = 'active' | 'settled';

// Helper functions
const getLeagueSportKey = (bet: any): string => {
  // For parlays, get sport key from first leg
  if (bet.bet_type === 'parlay' && bet.parlay_legs && bet.parlay_legs.length > 0) {
    return bet.parlay_legs[0].sport_key;
  }
  // For single bets, use the bet's sport_key
  return bet.sport_key;
};

const getBetTitle = (bet: any): string => {
  const isParlay = bet.bet_type === 'parlay' && bet.parlay_legs && bet.parlay_legs.length > 0;

  if (!isParlay) {
    // Single bet - show game matchup
    if (bet.game) {
      return `${bet.game.away_team} @ ${bet.game.home_team}`;
    }
    return (bet.bet_type || '').toUpperCase();
  }

  // Parlay - check if all legs are for the same game
  const legs = bet.parlay_legs || [];
  if (legs.length === 0) return 'PARLAY';

  // Get unique game IDs (filter out any null/undefined values)
  const gameIds = legs.map((leg: any) => leg.game_id).filter((id: any) => id);
  const uniqueGameIds = [...new Set(gameIds)];

  if (uniqueGameIds.length === 1) {
    // All legs for same game - show matchup
    const firstLeg = legs[0];
    if (firstLeg?.games) {
      return `${firstLeg.games.away_team} @ ${firstLeg.games.home_team}`;
    }
    // Fallback: try to get game info from the bet itself
    if (bet.game) {
      return `${bet.game.away_team} @ ${bet.game.home_team}`;
    }
  }

  // Multi-game parlay
  return `${legs.length} LEG MULTI-GAME PARLAY`;
};

const shouldShowLeagueIcon = (bet: any): boolean => {
  const isParlay = bet.bet_type === 'parlay' && bet.parlay_legs && bet.parlay_legs.length > 0;

  if (!isParlay) {
    return true; // Always show for single bets
  }

  // Check if all legs are from the same league
  const legs = bet.parlay_legs || [];
  if (legs.length === 0) return false;

  const uniqueSports = [...new Set(legs.map((leg: any) => leg.sport_key))];
  return uniqueSports.length === 1; // Show icon only if all legs are same league
};

const getBKSValue = (bet: any): number => {
  // For settled bets, show final BKS; otherwise show provisional
  if (bet.status === 'SETTLED' && bet.bks_final != null) {
    return Math.round(bet.bks_final);
  }
  return Math.round(bet.bks_provisional || 0);
};

const formatOdds = (odds: number): string => {
  return odds > 0 ? `+${odds}` : `${odds}`;
};

const calculatePayout = (stake: number, odds: number): number => {
  if (odds > 0) {
    return stake * (1 + odds / 100);
  }
  return stake * (1 - 100 / odds);
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString();
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'PENDING': '#F59E0B',
    'LIVE': '#EF4444',
    'WON': '#10B981',
    'LOST': '#EF4444',
    'SETTLED': '#6B7280',
    'VOID': '#9CA3AF',
  };
  return colors[status] || '#6B7280';
};

const getStatusEmoji = (status: string): string => {
  const emojis: Record<string, string> = {
    'PENDING': '🟡',
    'LIVE': '🔴',
    'WON': '🟢',
    'LOST': '🔴',
    'SETTLED': '⚪',
    'VOID': '⚪',
  };
  return emojis[status] || '⚪';
};

interface MyBetsScreenProps {
  navigation?: any;
}

export const MyBetsScreen = ({ navigation }: MyBetsScreenProps) => {
  // Authentication and verification status
  const { user, isAuthenticated, isEmailVerified } = useAuth();
  const { isPastDeadline } = useVerificationDeadline();

  // Auto-refresh interval ref (must be at top with other hooks)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [is401Error, setIs401Error] = useState(false);

  // Determine if user can view bets (same logic as was in TabNavigator)
  const canViewBets = (): boolean => {
    // Not logged in - cannot access
    if (!user || !isAuthenticated) return false;

    // Within first 24 hours - allow if logged in (even unverified)
    if (!isPastDeadline) return true;

    // After 24 hours - require email verification
    return isEmailVerified;
  };

  const loadBets = useCallback(async (isRefreshing = false) => {
    try {
      setError(null);
      // Only show loading spinner on initial load, not when refreshing
      if (!isRefreshing) {
        setLoading(true);
      }
      console.log('[MyBets] Loading bets for user:', user?.id);

      const userBets = await BackendAPIService.getUserBets();

      console.log('[MyBets] Received bets:', userBets?.length || 0, 'bets');
      console.log('[MyBets] First bet:', userBets?.[0] ? JSON.stringify(userBets[0]).substring(0, 150) : 'none');

      // Handle successful response - even if empty array
      setBets(Array.isArray(userBets) ? userBets : []);
      console.log('[MyBets] State updated with', userBets?.length || 0, 'bets');
    } catch (err: any) {
      // Handle 401 Unauthorized - user not logged in (though this should be caught by canViewBets now)
      if (err?.response?.status === 401) {
        setBets([]);
        setError(null); // Don't show error, the auth check will handle it
        setIs401Error(true);
      }
      // Handle 404 or empty result - not an error, just no bets
      else if (err?.response?.status === 404 || err?.message?.includes('No bets found')) {
        setBets([]);
        setError(null); // No error, just empty state
      }
      // Actual errors
      else {
        setBets([]);
        setError('Failed to load bets. Pull down to retry.');
        setIs401Error(false);
        console.error('Error loading bets:', err);
      }
    } finally {
      if (!isRefreshing) {
        setLoading(false);
      }
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBets(true); // Pass true to indicate this is a refresh operation
    setRefreshing(false);
  }, [loadBets]);

  useEffect(() => {
    // Only load bets if user is authorized to view them
    if (canViewBets()) {
      loadBets();
    } else {
      // Skip loading, renderContent will show appropriate prompt
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, isEmailVerified, isPastDeadline]);

  const filteredBets = useMemo(() => {
    return activeTab === 'active'
      ? bets.filter(b => ['PENDING', 'LIVE'].includes(b.status))
      : bets.filter(b => b.status === 'SETTLED');
  }, [bets, activeTab]);

  // Check if there are any active/live bets that need real-time updates
  const hasActiveBets = useMemo(() => {
    return bets.some(b => ['PENDING', 'LIVE'].includes(b.status));
  }, [bets]);

  // Auto-refresh for active bets (matches HomeScreen's 30s interval)
  useEffect(() => {
    const startAutoRefresh = () => {
      if (refreshIntervalRef.current) return; // Already running

      refreshIntervalRef.current = setInterval(() => {
        console.log('[MyBetsScreen] Auto-refresh triggered (30s interval)');
        loadBets(true); // Pass true to avoid loading spinner during auto-refresh
      }, 30000); // 30 seconds
      console.log('[MyBetsScreen] Auto-refresh started');
    };

    const stopAutoRefresh = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
        console.log('[MyBetsScreen] Auto-refresh stopped');
      }
    };

    // Only auto-refresh if:
    // 1. User is authorized to view bets
    // 2. There are active/live bets to track
    if (canViewBets() && hasActiveBets) {
      startAutoRefresh();

      // Listen to app state changes (foreground/background)
      const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
        console.log('[MyBetsScreen] App state changed to:', nextAppState);

        if (nextAppState === 'active') {
          // App came to foreground - resume auto-refresh and fetch fresh data
          console.log('[MyBetsScreen] App foregrounded - resuming auto-refresh');
          startAutoRefresh();
          loadBets(true); // Pass true to avoid loading spinner when app returns to foreground
        } else if (nextAppState === 'background' || nextAppState === 'inactive') {
          // App went to background - stop auto-refresh to save resources
          console.log('[MyBetsScreen] App backgrounded - pausing auto-refresh');
          stopAutoRefresh();
        }
      });

      // Cleanup on unmount or when dependencies change
      return () => {
        stopAutoRefresh();
        appStateSubscription.remove();
        console.log('[MyBetsScreen] Cleaned up auto-refresh and app state listener');
      };
    } else {
      // No active bets or not authorized - stop auto-refresh
      stopAutoRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActiveBets, user, isAuthenticated, isEmailVerified, isPastDeadline]);

  const handleTabPress = (tab: TabType) => {
    if (tab !== activeTab) {
      Vibration.vibrate(10); // Light haptic feedback
      setActiveTab(tab);
      // Refresh bets when switching tabs to ensure we have latest data
      // This is critical for showing settled bets that may have settled since last fetch
      if (canViewBets()) {
        loadBets();
      }
    }
  };

  const renderContent = () => {
    // 1. Check if user is not authenticated - show login prompt
    if (!user || !isAuthenticated) {
      return (
        <View style={styles.centerContent}>
          <Icon name="account-lock" size={80} color={TealPineColors.primary} />
          <Text style={styles.promptHeading}>Log in to view your bets</Text>
          <Text style={styles.promptDescription}>
            Track your betting history and analyze your performance
          </Text>
          {navigation && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // 2. Check if past deadline and not verified - show verification prompt
    if (isPastDeadline && !isEmailVerified) {
      return (
        <View style={styles.centerContent}>
          <Icon name="email-check" size={80} color={TealPineColors.primary} />
          <Text style={styles.promptHeading}>Verify your email</Text>
          <Text style={styles.promptDescription}>
            Email verification is required to access your betting history after the first 24 hours
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              // TODO: Implement resend verification email
              console.log('Resend verification email');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Resend Verification Email</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // 3. User is authorized - show normal loading/error/content states
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={TealPineColors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Icon
            name="alert-circle-outline"
            size={64}
            color={TealPineColors.textSecondary}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (filteredBets.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Icon name="clipboard-text-outline" size={64} color={TealPineColors.textSecondary} />
          <Text style={styles.emptyText}>
            No {activeTab} bets
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={TealPineColors.primary}
            colors={[TealPineColors.primary]}
          />
        }
      >
        {filteredBets.map((bet, index) => {
          const isParlay = bet.bet_type === 'parlay' && bet.parlay_legs && bet.parlay_legs.length > 0;
          const potentialPayout = calculatePayout(bet.stake, bet.odds);
          const showIcon = shouldShowLeagueIcon(bet);
          const betTitle = getBetTitle(bet);

          return (
            <View key={bet.id || index} style={styles.betCard}>
              {/* Header */}
              <View style={styles.betHeader}>
                <View style={styles.betTitleRow}>
                  {showIcon && (() => {
                    const sportKey = getLeagueSportKey(bet);
                    const leagueInfo = getLeagueInfo(sportKey);

                    if (leagueInfo?.useEmoji && leagueInfo?.emoji) {
                      return (
                        <Text style={styles.leagueEmoji}>{leagueInfo.emoji}</Text>
                      );
                    } else if (leagueInfo?.badge) {
                      return (
                        <Image
                          source={{ uri: leagueInfo.badge }}
                          style={styles.leagueLogo}
                          resizeMode="contain"
                        />
                      );
                    }
                    return null;
                  })()}
                  <Text style={styles.betType}>{betTitle}</Text>
                </View>
                <Text style={styles.betOdds}>{formatOdds(bet.odds)}</Text>
              </View>

              {/* Stake Info */}
              <View style={styles.stakeRow}>
                <Text style={styles.stakeText}>
                  Stake: ${bet.stake.toFixed(2)}
                </Text>
                <Text style={styles.stakeDivider}>•</Text>
                <Text style={styles.stakeText}>
                  To Win: ${potentialPayout.toFixed(2)}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Bet Details */}
              {isParlay ? (
                // Parlay Legs
                <View style={styles.legsContainer}>
                  {bet.parlay_legs.sort((a: any, b: any) => a.leg_number - b.leg_number).map((leg: any) => {
                    // Determine icon based on leg outcome
                    const getIconName = () => {
                      if (leg.outcome === 'WIN') return 'check-circle';
                      if (leg.outcome === 'LOSS') return 'close-circle';
                      return 'checkbox-blank-circle-outline';
                    };
                    const getIconColor = () => {
                      if (leg.outcome === 'WIN') return '#10B981';
                      if (leg.outcome === 'LOSS') return '#EF4444';
                      return TealPineColors.textSecondary;
                    };

                    return (
                    <View key={leg.leg_number} style={styles.legRow}>
                      <View style={styles.legContent}>
                        <View style={styles.legHeader}>
                          <Icon name={getIconName()} size={16} color={getIconColor()} />
                          <Text style={styles.legSelection}>
                            {leg.bet_type === 'total'
                              ? `${(leg.selection || '').charAt(0).toUpperCase()}${(leg.selection || '').slice(1)} ${leg.line || ''}`
                              : `${leg.team || leg.selection}${leg.line ? ` ${leg.line < 0 ? '' : ''}${leg.line}` : ''}`
                            }
                          </Text>
                        </View>
                        <Text style={styles.legOpponent}>
                          {leg.bet_type === 'total'
                            ? `${leg.selection?.toLowerCase() === 'over' ? 'Over' : 'Under'} ${Math.abs(leg.line || 0)}`
                            : `vs ${bet.game?.away_team || bet.game?.home_team || 'Opponent'}`
                          }
                        </Text>
                      </View>
                      <Text style={styles.legOdds}>{formatOdds(leg.odds)}</Text>
                    </View>
                    );
                  })}
                </View>
              ) : (
                // Single Bet
                <View style={styles.singleBetContainer}>
                  <Text style={styles.singleBetTeam}>
                    {bet.team || bet.selection}
                    {bet.line ? ` ${bet.line > 0 ? '+' : ''}${bet.line}` : ''}
                  </Text>
                  {bet.game && (
                    <Text style={styles.singleBetOpponent}>
                      {bet.game.home_team} vs {bet.game.away_team}
                    </Text>
                  )}
                </View>
              )}

              <View style={styles.divider} />

              {/* Footer */}
              <View style={styles.betFooter}>
                <View style={styles.bksSquareHorizontal}>
                  <Text style={styles.bksSquareLabel}>BKS</Text>
                  <Text style={styles.bksSquareNumber}>{getBKSValue(bet)}</Text>
                </View>
                <View style={styles.footerRightSection}>
                  {bet.status === 'LIVE' && (
                    <View style={styles.liveIndicator}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                  {(() => {
                    const displayStatus = bet.status === 'SETTLED' && bet.outcome ? bet.outcome : bet.status;
                    const getPillColor = () => {
                      if (displayStatus === 'WIN') return '#10B981';
                      if (displayStatus === 'LOSS') return '#EF4444';
                      if (displayStatus === 'PUSH') return '#9CA3AF';
                      return 'transparent';
                    };
                    const showPill = ['WIN', 'LOSS', 'PUSH'].includes(displayStatus);

                    // Don't show status badge if it's just 'LIVE' (we have the live indicator now)
                    if (displayStatus === 'LIVE') return null;

                    return (
                      <View style={[styles.statusBadge, showPill && { backgroundColor: getPillColor() }]}>
                        <Text style={[styles.statusText, { color: showPill ? '#FFFFFF' : getStatusColor(displayStatus) }]}>
                          {displayStatus}
                        </Text>
                        {(() => {
                          if (displayStatus === 'WIN') {
                            return <Icon name="check-circle" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />;
                          } else if (displayStatus === 'LOSS') {
                            return <Icon name="close-circle" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />;
                          } else if (displayStatus === 'PUSH') {
                            return <Icon name="checkbox-blank-circle-outline" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />;
                          } else {
                            return <Text>{getStatusEmoji(displayStatus)}</Text>;
                          }
                        })()}
                      </View>
                    );
                  })()}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'active' && styles.tabActive,
          ]}
          onPress={() => handleTabPress('active')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.tabTextActive,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'settled' && styles.tabActive,
          ]}
          onPress={() => handleTabPress('settled')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'settled' && styles.tabTextActive,
            ]}
          >
            Settled
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: TealPineColors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textSecondary,
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  errorText: {
    color: TealPineColors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    color: TealPineColors.textSecondary,
    fontSize: 18,
    marginTop: 16,
  },
  loginButton: {
    backgroundColor: TealPineColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  betCard: {
    backgroundColor: '#101D1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E3A32',
    padding: 16,
    marginBottom: 12,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  betTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  leagueLogo: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  leagueEmoji: {
    fontSize: 24,
    marginRight: 4,
  },
  betType: {
    fontSize: 20,
    fontWeight: '700',
    color: TealPineColors.textPrimary,
    fontFamily: 'BebasNeue-Regular',
    flexShrink: 1,
  },
  betOdds: {
    fontSize: 20,
    fontWeight: '700',
    color: TealPineColors.primary,
    fontFamily: 'BebasNeue-Regular',
  },
  stakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  stakeText: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
  },
  stakeDivider: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E3A32',
    marginVertical: 12,
  },
  legsContainer: {
    gap: 12,
  },
  legRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  legContent: {
    flex: 1,
    marginRight: 12,
  },
  legHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  legSelection: {
    fontSize: 15,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
  },
  legOpponent: {
    fontSize: 13,
    color: TealPineColors.textSecondary,
    marginLeft: 22,
  },
  legOdds: {
    fontSize: 15,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
  },
  singleBetContainer: {
    paddingVertical: 4,
  },
  singleBetTeam: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
    marginBottom: 4,
  },
  singleBetOpponent: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
  },
  betFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bksSquare: {
    backgroundColor: TealPineColors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 55,
  },
  bksSquareLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'BebasNeue-Regular',
    marginBottom: 2,
  },
  bksSquareNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'BebasNeue-Regular',
  },
  bksSquareHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealPineColors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  footerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  promptHeading: {
    color: TealPineColors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  promptDescription: {
    color: TealPineColors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: TealPineColors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: TealPineColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default MyBetsScreen;
