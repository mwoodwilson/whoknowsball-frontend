import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Path, Circle, Line as SkiaLine, Skia } from '@shopify/react-native-skia';
import { TealPineColors } from '../../theme/colors';

const CHART_HEIGHT = 180;
const Y_AXIS_WIDTH = 35;
const PADDING = { top: 15, bottom: 25, left: 5, right: 15 };

export type TimeFrame = '30d' | '3m' | '1y' | 'all';

interface BKSLineChartProps {
  history: Array<{ date: string; bks: number }>;
  timeFrame?: TimeFrame;
}

const screenWidth = Dimensions.get('window').width;

const BKSLineChart: React.FC<BKSLineChartProps> = ({ history, timeFrame = '30d' }) => {
  if (!history || history.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Not enough data yet</Text>
        <Text style={styles.emptySubtext}>Place more bets to see your trend</Text>
      </View>
    );
  }

  // Chart dimensions
  const chartWidth = screenWidth - 32 - Y_AXIS_WIDTH;
  const chartHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  // Scale functions
  const xScale = (index: number) => {
    if (history.length === 1) return PADDING.left + (chartWidth - PADDING.left - PADDING.right) / 2;
    return PADDING.left + (index / (history.length - 1)) * (chartWidth - PADDING.left - PADDING.right);
  };

  const yScale = (bks: number) => {
    return PADDING.top + chartHeight - (bks / 100) * chartHeight;
  };

  // Build path for line chart
  const linePath = Skia.Path.Make();
  history.forEach((point, index) => {
    const x = xScale(index);
    const y = yScale(point.bks);
    if (index === 0) {
      linePath.moveTo(x, y);
    } else {
      linePath.lineTo(x, y);
    }
  });

  // Y-axis tick values
  const yTicks = [0, 25, 50, 75, 100];

  // Format date label based on time frame
  const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);

    switch (timeFrame) {
      case '30d':
        // Short format: 12/5
        return `${date.getMonth() + 1}/${date.getDate()}`;
      case '3m':
        // Month name: Dec
        return date.toLocaleDateString('en-US', { month: 'short' });
      case '1y':
        // Month name: Dec
        return date.toLocaleDateString('en-US', { month: 'short' });
      case 'all':
        // Month + Year: Dec '24
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      default:
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // X-axis labels - adaptive based on data density
  const getXLabels = () => {
    const len = history.length;

    if (len <= 5) {
      // Show all labels for small datasets
      return history.map((p, i) => ({ index: i, label: formatDateLabel(p.date), x: xScale(i) }));
    }

    // Calculate step to show ~5-7 labels
    const step = Math.ceil(len / 6);
    const labels: Array<{ index: number; label: string; x: number }> = [];

    for (let i = 0; i < len; i += step) {
      labels.push({
        index: i,
        label: formatDateLabel(history[i].date),
        x: xScale(i)
      });
    }

    // Always include last point
    if (labels[labels.length - 1].index !== len - 1) {
      labels.push({
        index: len - 1,
        label: formatDateLabel(history[len - 1].date),
        x: xScale(len - 1)
      });
    }

    return labels;
  };

  const xLabels = getXLabels();

  return (
    <View style={styles.container}>
      <View style={styles.chartRow}>
        {/* Y-axis labels */}
        <View style={styles.yAxisContainer}>
          {yTicks.slice().reverse().map((tick) => (
            <Text key={tick} style={styles.yAxisLabel}>
              {tick}
            </Text>
          ))}
        </View>

        {/* Chart canvas */}
        <View style={styles.chartWrapper}>
          <Canvas style={{ width: chartWidth, height: CHART_HEIGHT }}>
            {/* Horizontal grid lines */}
            {yTicks.map((tick) => {
              const y = yScale(tick);
              return (
                <SkiaLine
                  key={tick}
                  p1={{ x: PADDING.left, y }}
                  p2={{ x: chartWidth - PADDING.right, y }}
                  color="rgba(0, 179, 164, 0.1)"
                  strokeWidth={1}
                  style="stroke"
                />
              );
            })}

            {/* Line chart */}
            {history.length > 1 && (
              <Path
                path={linePath}
                color={TealPineColors.primary}
                style="stroke"
                strokeWidth={3}
                strokeCap="round"
                strokeJoin="round"
              />
            )}

            {/* Data points */}
            {history.map((point, index) => (
              <Circle
                key={index}
                cx={xScale(index)}
                cy={yScale(point.bks)}
                r={5}
                color={TealPineColors.primary}
              />
            ))}
          </Canvas>
        </View>
      </View>

      {/* X-axis date labels - using React Native Text */}
      <View style={styles.xAxisContainer}>
        {xLabels.map(({ index, label, x }) => (
          <Text
            key={index}
            style={[
              styles.xAxisLabel,
              { left: Y_AXIS_WIDTH + x - 15 }
            ]}
          >
            {label}
          </Text>
        ))}
      </View>

      {/* Info message for single data point */}
      {history.length === 1 && (
        <Text style={styles.infoText}>
          Single data point - trend will show with more bets
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // No background/border - parent provides card wrapper
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
    paddingRight: 6,
    paddingTop: PADDING.top,
    paddingBottom: PADDING.bottom,
  },
  yAxisLabel: {
    fontSize: 10,
    color: TealPineColors.textSecondary,
    fontWeight: '500',
  },
  chartWrapper: {
    flex: 1,
    height: CHART_HEIGHT,
  },
  xAxisContainer: {
    height: 20,
    marginTop: 4,
    marginLeft: 0,
    position: 'relative',
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: 10,
    color: TealPineColors.textSecondary,
    width: 30,
    textAlign: 'center',
  },
  emptyState: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: TealPineColors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 12,
    color: TealPineColors.textSecondary,
  },
  infoText: {
    fontSize: 11,
    color: TealPineColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default BKSLineChart;
