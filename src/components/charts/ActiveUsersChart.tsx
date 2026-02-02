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

interface ActiveUsersChartProps {
  data: ProcessedMetrics[];
}

export function ActiveUsersChart({ data }: ActiveUsersChartProps) {
  const chartData = data.map((item) => ({
    name: item.displayDate,
    'Code completion': item.totalEngagedUsers,
    'Chat': item.totalChatEngagedUsers,
  }));

  // Calculate total engaged users for the header
  const totalEngaged = data.reduce((sum, item) => sum + item.totalEngagedUsers + item.totalChatEngagedUsers, 0);
  const avgEngaged = data.length > 0 ? Math.round(totalEngaged / data.length) : 0;

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
            Engaged users
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            Users who used code completion or chat
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
            {avgEngaged}
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            avg per day
          </Text>
        </Box>
      </Box>
      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCodeCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0969da" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0969da" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorChat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8250df" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8250df" stopOpacity={0.05}/>
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d0d7de',
                borderRadius: '6px',
                fontSize: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="Code completion"
              stackId="1"
              stroke="#0969da"
              strokeWidth={2}
              fill="url(#colorCodeCompletion)"
            />
            <Area
              type="monotone"
              dataKey="Chat"
              stackId="1"
              stroke="#8250df"
              strokeWidth={2}
              fill="url(#colorChat)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
