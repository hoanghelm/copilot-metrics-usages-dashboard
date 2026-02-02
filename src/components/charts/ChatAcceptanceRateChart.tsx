import { Box, Text } from '@primer/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ProcessedMetrics } from '@/pages/insights/types';

interface ChatAcceptanceRateChartProps {
  data: ProcessedMetrics[];
}

export function ChatAcceptanceRateChart({ data }: ChatAcceptanceRateChartProps) {
  const chartData = data.map((item) => ({
    name: item.displayDate,
    'Chat Acceptance Rate': item.chatAcceptanceRate,
  }));

  return (
    <Box
      sx={{
        p: 3,
        bg: 'canvas.default',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'border.default',
      }}
    >
      <Text
        sx={{
          fontSize: 1,
          fontWeight: 'semibold',
          color: 'fg.default',
          mb: 3,
          display: 'block',
        }}
      >
        Chat Acceptance Rate
      </Text>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="chatAcceptanceRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8250df" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8250df" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#d0d7de" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#656d76' }}
              axisLine={{ stroke: '#d0d7de' }}
              tickLine={{ stroke: '#d0d7de' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#656d76' }}
              axisLine={{ stroke: '#d0d7de' }}
              tickLine={{ stroke: '#d0d7de' }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '6px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
            />
            <Area
              type="monotone"
              dataKey="Chat Acceptance Rate"
              stroke="#8250df"
              strokeWidth={2}
              fill="url(#chatAcceptanceRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
