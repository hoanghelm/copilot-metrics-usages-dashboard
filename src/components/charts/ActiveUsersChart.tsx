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

interface ActiveUsersChartProps {
  data: ProcessedMetrics[];
}

export function ActiveUsersChart({ data }: ActiveUsersChartProps) {
  const dailyChartData = data.map((item) => ({
    name: item.displayDate,
    users: item.totalActiveUsers,
  }));

  // Group data by week for weekly chart
  const weeklyChartData = data.reduce((acc: { name: string; users: number }[], item, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = { name: item.displayDate, users: 0 };
    }
    acc[weekIndex].users = Math.max(acc[weekIndex].users, item.totalActiveUsers);
    return acc;
  }, []);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)'],
        gap: 4,
      }}
    >
      {/* IDE Daily Active Users */}
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
            IDE daily active users
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            Unique users who used Copilot on a given day, either via chat or code completions
          </Text>
        </Box>
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyChartData}>
              <defs>
                <linearGradient id="colorDailyUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#58a6ff" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#8b949e' }}
                axisLine={{ stroke: '#30363d' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#8b949e' }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Users', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
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
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#58a6ff"
                strokeWidth={2}
                fill="url(#colorDailyUsers)"
                name="Daily active users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* IDE Weekly Active Users */}
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
            IDE weekly active users
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            Unique users who used Copilot on a given week, either via chat or code completions
          </Text>
        </Box>
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyChartData}>
              <defs>
                <linearGradient id="colorWeeklyUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#58a6ff" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
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
                label={{ value: 'Users', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
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
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#58a6ff"
                strokeWidth={2}
                fill="url(#colorWeeklyUsers)"
                name="Weekly active users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
