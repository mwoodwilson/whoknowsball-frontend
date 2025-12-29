import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { TealPineColors } from '../../theme/colors';
import BackendAPIService from '../../services/api/BackendAPIService';
import { useAuth } from '../../contexts/AuthContext';

// Components
import BKSCircularCard from '../../components/MyBKS/BKSCircularCard';
import MetricsCards from '../../components/MyBKS/MetricsCards';
import BKSLineChart from '../../components/MyBKS/BKSLineChart';
import SportPerformanceChart from '../../components/MyBKS/SportPerformanceChart';
import TimeFrameSelector from '../../components/MyBKS/TimeFrameSelector';
import type { TimeFrame } from '../../components/MyBKS/TimeFrameSelector';

interface UserStats {
  overall_bks: number;
  total_bets: number;
  total_won: number;
  total_lost: number;
  win_rate: number;
  avg_bks_per_bet: number;
  by_sport: Array<{
    sport_key: string;
    sport_title: string;
    total_bets: number;
    avg_bks: number;
  }>;
}

interface BKSHistory {
  date: string;
  bks: number;
}

// Helper function to convert time frame to days parameter
const getDaysFromTimeFrame = (tf: TimeFrame): number => {
  switch (tf) {
    case '30d': return 30;
    case '3m': return 90;
    case '1y': return 365;
    case 'all': return 0; // 0 = all time (backend now supports this)
    default: return 30;
  }
};

const MyBKSScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<BKSHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('30d');

  // Minimum data requirements check
  const hasEnoughData = useMemo(() => {
    const hasEnoughBets = (stats?.total_bets ?? 0) >= 10;
    const hasEnoughHistory = (history?.length ?? 0) >= 14;
    return hasEnoughBets && hasEnoughHistory;
  }, [stats?.total_bets, history?.length]);

  // Load stats (doesn't depend on time frame)
  const loadStats = useCallback(async () => {
    try {
      const statsData = await BackendAPIService.getUserStats();
      setStats(statsData);
    } catch (err) {
      console.error('[MyBKS] Error loading stats:', err);
      throw err;
    }
  }, []);

  // Load BKS history (depends on time frame)
  const loadHistory = useCallback(async (tf: TimeFrame) => {
    try {
      const days = getDaysFromTimeFrame(tf);
      const historyData = await BackendAPIService.getUserBKSHistory(days);
      setHistory(historyData.history || []);
    } catch (err) {
      console.error('[MyBKS] Error loading history:', err);
      throw err;
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([loadStats(), loadHistory(timeFrame)]);
      } catch (err) {
        setError('Failed to load your stats. Pull to refresh.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Reload history when time frame changes
  useEffect(() => {
    if (!loading) {
      loadHistory(timeFrame).catch((err) => {
        console.error('[MyBKS] Error updating history for time frame:', err);
      });
    }
  }, [timeFrame]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadStats(), loadHistory(timeFrame)]);
    } catch (err) {
      setError('Failed to load your stats. Pull to refresh.');
    } finally {
      setRefreshing(false);
    }
  }, [timeFrame, loadStats, loadHistory]);

  // Loading state
  if (loading && !stats) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={TealPineColors.primary} />
          <Text style={styles.loadingText}>Loading your stats...</Text>
        </View>
      </View>
    );
  }

  // Empty state (no bets)
  if (!loading && stats && stats.total_bets === 0) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={TealPineColors.primary}
            />
          }
        >
          <Text style={styles.emptyTitle}>Build Your BKS</Text>
          <Text style={styles.emptySubtitle}>
            Start betting to build your Ball Knowledge Score
          </Text>
          <Text style={styles.emptyDescription}>
            Your BKS reflects your betting skill level. Place bets on the Home
            feed to start tracking your performance.
          </Text>
        </ScrollView>
      </View>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={TealPineColors.primary}
            />
          }
        >
          <Text style={styles.errorText}>{error}</Text>
        </ScrollView>
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
          <Text style={styles.headerTitle}>MY BKS</Text>
          <Text style={styles.headerSubtitle}>
            Your Ball Knowing Score - Track your betting performance
          </Text>
        </View>

        {/* Main BKS Circular Display */}
        <BKSCircularCard
          bks={stats?.overall_bks || 0}
          totalBets={stats?.total_bets || 0}
        />

        {/* Metrics Cards */}
        <MetricsCards
          winRate={stats?.win_rate || 0}
          totalBets={stats?.total_bets || 0}
          avgBKS={stats?.avg_bks_per_bet || 0}
        />

        {/* BKS Over Time Chart Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>BKS OVER TIME</Text>
          <TimeFrameSelector selected={timeFrame} onSelect={setTimeFrame} />

          {hasEnoughData ? (
            <BKSLineChart history={history} timeFrame={timeFrame} />
          ) : (
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderText}>
                Place more bets to see your BKS trend
              </Text>
            </View>
          )}
        </View>

        {/* Performance by Sport */}
        <SportPerformanceChart sportStats={stats?.by_sport || []} />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 8,
    fontFamily: 'BebasNeue-Regular',
  },
  emptySubtitle: {
    fontSize: 18,
    color: TealPineColors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: TealPineColors.loss,
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
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 164, 0.1)',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chartPlaceholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

export default MyBKSScreen;
