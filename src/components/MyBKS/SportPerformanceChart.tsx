import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Canvas, RoundedRect, Rect, Line as SkiaLine } from '@shopify/react-native-skia';
import { TealPineColors } from '../../theme/colors';

interface SportStats {
  sport_key: string;
  sport_title: string;
  total_bets: number;
  avg_bks: number;
}

interface SportPerformanceChartProps {
  sportStats: SportStats[];
}

const screenWidth = Dimensions.get('window').width;
const CHART_HEIGHT = 160;
const Y_AXIS_WIDTH = 35;

const SportPerformanceChart: React.FC<SportPerformanceChartProps> = ({ sportStats }) => {
  if (!sportStats || sportStats.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>PERFORMANCE BY SPORT</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No sports data yet</Text>
        </View>
      </View>
    );
  }

  // Y-axis tick values (0-100 BKS scale)
  const yTicks = [0, 25, 50, 75, 100];

  // Calculate bar dimensions (accounting for Y-axis width)
  const containerPadding = 32; // 16px each side
  const chartWidth = screenWidth - containerPadding - Y_AXIS_WIDTH;
  const barCount = sportStats.length;
  const barGap = 16;
  const totalGapWidth = Math.max(0, (barCount - 1) * barGap);
  const barWidth = Math.min((chartWidth - totalGapWidth) / barCount, 70);
  const totalBarsWidth = (barWidth * barCount) + totalGapWidth;
  const startX = (chartWidth - totalBarsWidth) / 2;

  // Convert BKS value to Y position
  const yScale = (bks: number) => CHART_HEIGHT - (bks / 100) * CHART_HEIGHT;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PERFORMANCE BY SPORT</Text>

      <View style={styles.chartRow}>
        {/* Y-axis labels */}
        <View style={styles.yAxisContainer}>
          {yTicks.slice().reverse().map((tick) => (
            <Text key={tick} style={styles.yAxisLabel}>
              {tick}
            </Text>
          ))}
        </View>

        {/* Chart area */}
        <View style={styles.chartAreaWrapper}>
          {/* BKS Labels above bars */}
          <View style={styles.labelsContainer}>
            {sportStats.map((sport, index) => {
              const barHeight = (sport.avg_bks / 100) * CHART_HEIGHT;
              const x = startX + (index * (barWidth + barGap));
              const labelTop = CHART_HEIGHT - barHeight - 22;

              return (
                <Text
                  key={`label-${sport.sport_key}`}
                  style={[
                    styles.bksLabel,
                    {
                      position: 'absolute',
                      left: x,
                      top: Math.max(labelTop, 0),
                      width: barWidth,
                    }
                  ]}
                >
                  {sport.avg_bks.toFixed(1)}
                </Text>
              );
            })}
          </View>

          {/* Canvas-based bar chart with grid lines */}
          <View style={styles.chartContainer}>
            <Canvas style={{ width: chartWidth, height: CHART_HEIGHT }}>
              {/* Horizontal grid lines */}
              {[25, 50, 75].map((tick) => {
                const y = yScale(tick);
                return (
                  <SkiaLine
                    key={`grid-${tick}`}
                    p1={{ x: 0, y }}
                    p2={{ x: chartWidth, y }}
                    color="rgba(0, 179, 164, 0.1)"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Bars */}
              {sportStats.map((sport, index) => {
                const barHeight = (sport.avg_bks / 100) * CHART_HEIGHT;
                const x = startX + (index * (barWidth + barGap));
                const y = CHART_HEIGHT - barHeight;

                return (
                  <React.Fragment key={sport.sport_key}>
                    {/* Bar with rounded top corners */}
                    <RoundedRect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      r={8}
                      color={TealPineColors.primary}
                    />
                    {/* Square off bottom corners */}
                    <Rect
                      x={x}
                      y={CHART_HEIGHT - 16}
                      width={barWidth}
                      height={16}
                      color={TealPineColors.primary}
                    />
                  </React.Fragment>
                );
              })}
            </Canvas>
          </View>

          {/* X-axis labels (sport names) */}
          <View style={styles.sportLabelsContainer}>
            {sportStats.map((sport, index) => {
              const x = startX + (index * (barWidth + barGap));
              return (
                <Text
                  key={`name-${sport.sport_key}`}
                  style={[
                    styles.sportLabel,
                    {
                      position: 'absolute',
                      left: x,
                      width: barWidth,
                    }
                  ]}
                >
                  {sport.sport_title}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: TealPineColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 164, 0.1)',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  yAxisContainer: {
    width: Y_AXIS_WIDTH,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 11,
    color: TealPineColors.textSecondary,
    fontWeight: '500',
  },
  chartAreaWrapper: {
    flex: 1,
  },
  labelsContainer: {
    position: 'relative',
    width: '100%',
    height: CHART_HEIGHT,
  },
  bksLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: TealPineColors.textPrimary,
    textAlign: 'center',
  },
  chartContainer: {
    height: CHART_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  sportLabelsContainer: {
    height: 24,
    position: 'relative',
    marginTop: 8,
  },
  sportLabel: {
    fontSize: 12,
    color: TealPineColors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: TealPineColors.textSecondary,
  },
});

export default SportPerformanceChart;
