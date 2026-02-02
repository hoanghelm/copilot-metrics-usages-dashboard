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

interface ChatChartProps {
  data: ProcessedMetrics[];
}

export function ChatChart({ data }: ChatChartProps) {
  const chartData = data.map((item) => ({
    name: item.displayDate,
    'Chats': item.totalChats,
    'Insertions': item.totalChatInsertionEvents,
    'Copies': item.totalChatCopyEvents,
  }));

  // Calculate total chats
  const totalChats = data.reduce((sum, item) => sum + item.totalChats, 0);

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
            Chat activity
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            Conversations, insertions, and copies
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
            {totalChats.toLocaleString()}
          </Text>
          <Text
            sx={{
              fontSize: 0,
              color: 'fg.muted',
              display: 'block',
            }}
          >
            total chats
          </Text>
        </Box>
      </Box>
      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
              tickFormatter={(value) => value.toLocaleString()}
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
              wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="Chats"
              fill="#8250df"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="Insertions"
              fill="#2da44e"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="Copies"
              fill="#fb8f44"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
