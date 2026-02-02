import { Box, Text } from '@primer/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ProcessedMetrics } from '@/pages/insights/types';

interface LinesChartProps {
  data: ProcessedMetrics[];
}

export function LinesChart({ data }: LinesChartProps) {
  const chartData = data.map((item) => ({
    name: item.displayDate,
    'Suggested': item.totalCodeLinesSuggested,
    'Accepted': item.totalCodeLinesAccepted,
  }));

  const totalLinesAccepted = data.reduce((sum, item) => sum + item.totalCodeLinesAccepted, 0);

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
            Lines of code
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            Lines suggested vs accepted
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
            {totalLinesAccepted.toLocaleString()}
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            lines accepted
          </Text>
        </Box>
      </Box>
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d0d7de" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#656d76' }}
              axisLine={{ stroke: '#d0d7de' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#656d76' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '6px',
                fontSize: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
              formatter={(value: number) => [value.toLocaleString(), '']}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="Suggested"
              fill="#bf3989"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
            <Bar
              dataKey="Accepted"
              fill="#2da44e"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
