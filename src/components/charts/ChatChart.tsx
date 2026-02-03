import { Box, Text } from '@primer/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CopilotMetrics } from '@/types/copilot';

interface ChatChartProps {
  data: CopilotMetrics[];
}

// Colors for chat modes
const CHAT_MODE_COLORS = {
  Edit: '#3fb950',      // Green
  Ask: '#238636',       // Dark green
  Agent: '#2ea043',     // Medium green
  Custom: '#56d364',    // Light green
  Inline: '#7ee787',    // Lightest green
};

export function ChatChart({ data }: ChatChartProps) {
  // Average chat requests per active user chart data
  const avgChatData = data.map((item) => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    avgRequests: item.chat_requests?.average_per_active_user || 0,
  }));

  // Requests per chat mode chart data
  const chatModeData = data.map((item) => {
    const modeData: Record<string, string | number> = {
      name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    item.chat_requests?.requests_by_mode?.forEach((mode) => {
      modeData[mode.mode] = mode.requests;
    });
    return modeData;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Average chat requests per active user */}
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
            Average chat requests per active user
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            User-initiated requests across all chat modes, excluding code completions
          </Text>
        </Box>
        <Box sx={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={avgChatData}>
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
                label={{ value: 'Requests', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
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
                formatter={(value: number) => [`${value} requests`, 'Average chat requests per active user']}
              />
              <Line
                type="monotone"
                dataKey="avgRequests"
                stroke="#3fb950"
                strokeWidth={2}
                dot={{ fill: '#3fb950', strokeWidth: 0, r: 3 }}
                activeDot={{ fill: '#3fb950', strokeWidth: 2, stroke: '#fff', r: 5 }}
                name="Average chat requests per active user"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Requests per chat mode */}
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
            Requests per chat mode
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            User-initiated chat requests across all modes
          </Text>
        </Box>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chatModeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#8b949e' }}
                axisLine={{ stroke: '#30363d' }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#8b949e' }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Requests', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
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
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                iconType="square"
                iconSize={10}
              />
              <Bar dataKey="Edit" stackId="a" fill={CHAT_MODE_COLORS.Edit} />
              <Bar dataKey="Ask" stackId="a" fill={CHAT_MODE_COLORS.Ask} />
              <Bar dataKey="Agent" stackId="a" fill={CHAT_MODE_COLORS.Agent} />
              <Bar dataKey="Custom" stackId="a" fill={CHAT_MODE_COLORS.Custom} />
              <Bar dataKey="Inline" stackId="a" fill={CHAT_MODE_COLORS.Inline} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
