import { Box, Text } from '@primer/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ProcessedMetrics } from '@/pages/insights/types';

interface AcceptanceRateChartProps {
  data: ProcessedMetrics[];
  title?: string;
  subtitle?: string;
  showLines?: boolean;
}

export function AcceptanceRateChart({
  data,
  title = 'Code completions acceptance rate',
  subtitle = 'Percentage of shown inline completions that were either fully or partially accepted',
  showLines = false,
}: AcceptanceRateChartProps) {
  const chartData = data.map((item) => ({
    name: item.displayDate,
    accepted: showLines ? item.totalCodeAcceptances : item.acceptanceRate,
    suggested: showLines ? item.totalCodeSuggestions : undefined,
  }));

  return (
    <Box
      sx={{
        p: 4,
        bg: 'canvas.subtle',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'border.default',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Text
          sx={{
            fontSize: 1,
            fontWeight: 'semibold',
            color: 'fg.default',
            display: 'block',
          }}
        >
          {title}
        </Text>
        <Text
          sx={{
            fontSize: 0,
            color: 'fg.muted',
            display: 'block',
          }}
        >
          {subtitle}
        </Text>
      </Box>
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#8b949e' }}
              axisLine={{ stroke: '#30363d' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#8b949e' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => showLines ? value.toLocaleString() : `${value}%`}
              label={{
                value: showLines ? 'Completions' : '%',
                angle: -90,
                position: 'insideLeft',
                fontSize: 10,
                fill: '#8b949e',
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#c9d1d9',
              }}
              labelStyle={{ color: '#c9d1d9' }}
              formatter={(value: number, name: string) => [
                showLines ? value.toLocaleString() : `${value.toFixed(1)}%`,
                name === 'accepted' ? (showLines ? 'Accepted completions' : 'Acceptance rate') : 'Suggested completions',
              ]}
            />
            {showLines && (
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                iconType="line"
                iconSize={12}
                formatter={(value) => value === 'accepted' ? 'Accepted completions' : 'Suggested completions'}
              />
            )}
            <Line
              type="monotone"
              dataKey="accepted"
              stroke={showLines ? '#8957e5' : '#3fb950'}
              strokeWidth={2}
              dot={false}
              name="accepted"
            />
            {showLines && (
              <Line
                type="monotone"
                dataKey="suggested"
                stroke="#8957e5"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="suggested"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
