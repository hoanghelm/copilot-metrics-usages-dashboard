import { Box, Text } from '@primer/react';
import {
  AreaChart,
  Area,
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
}

export function AcceptanceRateChart({ data }: AcceptanceRateChartProps) {
  const chartData = data.map((item) => ({
    name: item.displayDate,
    'Suggestions': item.acceptanceRate,
    'Lines of code': item.linesAcceptanceRate,
  }));

  // Calculate average acceptance rate
  const avgAcceptanceRate = data.length > 0
    ? Math.round(data.reduce((sum, item) => sum + item.acceptanceRate, 0) / data.length * 10) / 10
    : 0;

  return (
    <Box
      sx={{
        p: 4,
        bg: 'canvas.default',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'border.default',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Text
            sx={{
              fontSize: 1,
              fontWeight: 'semibold',
              color: 'fg.default',
              display: 'block',
            }}
          >
            Acceptance rate
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            Percentage of suggestions accepted
          </Text>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Text
            sx={{
              fontSize: 3,
              fontWeight: 'semibold',
              color: 'fg.default',
              display: 'block',
            }}
          >
            {avgAcceptanceRate}%
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            avg acceptance rate
          </Text>
        </Box>
      </Box>
      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="acceptanceRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0969da" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0969da" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="linesRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8250df" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8250df" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#d0d7de" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#656d76' }}
              axisLine={{ stroke: '#d0d7de' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#656d76' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '6px',
                fontSize: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="Suggestions"
              stroke="#0969da"
              strokeWidth={2}
              fill="url(#acceptanceRate)"
            />
            <Area
              type="monotone"
              dataKey="Lines of code"
              stroke="#8250df"
              strokeWidth={2}
              fill="url(#linesRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
