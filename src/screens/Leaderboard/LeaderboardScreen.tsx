import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { TealPineColors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import BackendAPIService from '../../services/api/BackendAPIService';

interface LeaderboardEntry {
  rank: number;
  username: string;
  overall_bks: number;
  total_bets: number;
  isCurrentUser?: boolean;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
  limit: number;
  offset: number;
  updated_at: string;
  cache_hit?: boolean;
}

const LeaderboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);

  // Get current user's username
  const currentUsername = user?.user_metadata?.username;

  const loadData = useCallback(async () => {
    try {
      setError(null);
      console.log('[Leaderboard] Loading global leaderboard...');

      const response: LeaderboardResponse = await BackendAPIService.getGlobalLeaderboard(100, 0);

      console.log(`[Leaderboard] Received ${response.leaderboard.length} entries (total: ${response.total})`);

      // Mark current user in the leaderboard
      const leaderboardWithCurrentUser = response.leaderboard.map(entry => ({
        ...entry,
        isCurrentUser: currentUsername ? entry.username === currentUsername : false,
      }));

      setLeaderboard(leaderboardWithCurrentUser);
      setTotal(response.total);
    } catch (err: any) {
      console.error('[Leaderboard] Error loading data:', err);
      setError(err.message || 'Failed to load leaderboard');
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }, [currentUsername]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Get medal emoji for top 3
  const getMedal = (rank: number): string => {
    switch (rank) {
      case 1: return '1';
      case 2: return '2';
      case 3: return '3';
      default: return '';
    }
  };

  // Get rank display
  const getRankDisplay = (rank: number): string => {
    const medal = getMedal(rank);
    return medal || `#${rank}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={TealPineColors.primary} />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to load leaderboard</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={TealPineColors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>LEADERBOARD</Text>
          <Text style={styles.headerSubtitle}>
            Top Ball Knowers ranked by overall BKS
          </Text>
        </View>

        {leaderboard.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No rankings yet</Text>
            <Text style={styles.emptyMessage}>
              Place your first bet to appear on the leaderboard!
            </Text>
          </View>
        ) : (
          <>
            {/* Leaderboard Table */}
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.rankCell]}>RANK</Text>
                <Text style={[styles.headerCell, styles.userCell]}>USER</Text>
                <Text style={[styles.headerCell, styles.bksCell]}>BKS</Text>
                <Text style={[styles.headerCell, styles.betsCell]}>BETS</Text>
              </View>

              {/* Table Rows */}
              {leaderboard.map((entry) => (
                <View
                  key={`${entry.username}-${entry.rank}`}
                  style={[
                    styles.tableRow,
                    entry.isCurrentUser && styles.currentUserRow,
                    entry.rank <= 3 && styles.topThreeRow,
                  ]}
                >
                  <View style={[styles.cell, styles.rankCell]}>
                    <Text style={[
                      styles.rankText,
                      entry.rank <= 3 && styles.topThreeRank,
                      entry.isCurrentUser && styles.currentUserText,
                    ]}>
                      {getRankDisplay(entry.rank)}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.userCell]}>
                    <Text style={[
                      styles.usernameText,
                      entry.isCurrentUser && styles.currentUserText,
                    ]} numberOfLines={1}>
                      {entry.username}
                      {entry.isCurrentUser && ' (You)'}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.bksCell]}>
                    <Text style={[
                      styles.bksText,
                      entry.isCurrentUser && styles.currentUserText,
                    ]}>
                      {entry.overall_bks.toFixed(1)}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.betsCell]}>
                    <Text style={[
                      styles.betsText,
                      entry.isCurrentUser && styles.currentUserText,
                    ]}>
                      {entry.total_bets}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Info Footer */}
            <Text style={styles.footerText}>
              Showing top {leaderboard.length} of {total} users
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TealPineColors.background,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: TealPineColors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: TealPineColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    fontFamily: 'BebasNeue-Regular',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 164, 0.1)',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 179, 164, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCell: {
    fontSize: 11,
    fontWeight: 'bold',
    color: TealPineColors.textSecondary,
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 179, 164, 0.05)',
  },
  currentUserRow: {
    backgroundColor: 'rgba(0, 179, 164, 0.15)',
  },
  topThreeRow: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  cell: {
    justifyContent: 'center',
  },
  rankCell: {
    width: 50,
  },
  userCell: {
    flex: 1,
  },
  bksCell: {
    width: 60,
    alignItems: 'flex-end',
  },
  betsCell: {
    width: 50,
    alignItems: 'flex-end',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: TealPineColors.textPrimary,
  },
  topThreeRank: {
    fontSize: 20,
  },
  usernameText: {
    fontSize: 15,
    fontWeight: '500',
    color: TealPineColors.textPrimary,
  },
  bksText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TealPineColors.primary,
    fontFamily: 'BebasNeue-Regular',
  },
  betsText: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
  },
  currentUserText: {
    color: TealPineColors.accent,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default LeaderboardScreen;
