import { Box, Text } from '@primer/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { EditorBreakdown } from '@/pages/insights/types';

interface EditorChartProps {
  data: EditorBreakdown[];
}

// Colors for model usage (blue tones matching screenshots)
const MODEL_COLORS = [
  '#58a6ff',  // Light blue
  '#388bfd',  // Medium blue
  '#1f6feb',  // Primary blue
  '#0d419d',  // Dark blue
  '#0a3069',  // Darker blue
];

export function EditorChart({ data }: EditorChartProps) {
  const total = data.reduce((sum, e) => sum + e.totalEngagedUsers, 0);

  const chartData = data.map((editor) => ({
    name: editor.name,
    value: editor.totalEngagedUsers,
    percentage: total > 0 ? ((editor.totalEngagedUsers / total) * 100).toFixed(1) : '0',
  }));

  return (
    <Box
      sx={{
        p: 4,
        bg: 'canvas.subtle',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'border.default',
        height: '100%',
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
          Chat model usage
        </Text>
        <Text
          sx={{
            fontSize: 0,
            color: 'fg.muted',
            display: 'block',
          }}
        >
          Distribution of models used across all chat modes
        </Text>
      </Box>
      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percentage }) => `${name}\n${percentage}%`}
              labelLine={{ stroke: '#8b949e', strokeWidth: 1 }}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={MODEL_COLORS[index % MODEL_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#c9d1d9',
              }}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} (${chartData.find(d => d.name === name)?.percentage}%)`,
                name,
              ]}
            />
            <Legend
              verticalAlign="middle"
              align="left"
              layout="vertical"
              wrapperStyle={{
                fontSize: '12px',
                paddingLeft: '10px',
              }}
              formatter={(value) => {
                const item = chartData.find(d => d.name === value);
                return (
                  <span style={{ color: '#c9d1d9' }}>
                    {value} <span style={{ color: '#8b949e' }}>{item?.percentage}%</span>
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
