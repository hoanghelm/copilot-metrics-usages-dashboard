import { Box, Text } from '@primer/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { LanguageBreakdown } from '@/pages/insights/types';

interface LanguageChartProps {
  data: LanguageBreakdown[];
}

// Colors matching the screenshot (orange/brown tones)
const LANGUAGE_COLORS = [
  '#d29922',  // Primary orange
  '#986a44',  // Brown
  '#8b5a2b',  // Dark brown
  '#654321',  // Coffee brown
  '#524232',  // Dark tan
];

export function LanguageChart({ data }: LanguageChartProps) {
  const topLanguages = data.slice(0, 5);
  const otherLanguages = data.slice(5);

  // Calculate total for percentages
  const total = topLanguages.reduce((sum, l) => sum + l.totalSuggestions, 0) +
    otherLanguages.reduce((sum, l) => sum + l.totalSuggestions, 0);

  const chartData = [
    ...topLanguages.map((lang) => ({
      name: lang.name,
      value: lang.totalSuggestions,
      percentage: total > 0 ? ((lang.totalSuggestions / total) * 100).toFixed(1) : '0',
    })),
    ...(otherLanguages.length > 0 ? [{
      name: 'Other languages',
      value: otherLanguages.reduce((sum, l) => sum + l.totalSuggestions, 0),
      percentage: total > 0
        ? ((otherLanguages.reduce((sum, l) => sum + l.totalSuggestions, 0) / total) * 100).toFixed(1)
        : '0',
    }] : []),
  ];

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
          Language usage
        </Text>
        <Text
          sx={{
            fontSize: 0,
            color: 'fg.muted',
            display: 'block',
          }}
        >
          Distribution of languages used across all chat modes and code completions
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
                  fill={LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]}
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
