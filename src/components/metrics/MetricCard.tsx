import { Box, Text } from '@primer/react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'accent' | 'success' | 'attention' | 'severe' | 'danger';
}

export function MetricCard({ title, value, subtitle, trend, color = 'default' }: MetricCardProps) {
  const getColorStyles = () => {
    const colors: Record<string, { border: string; accent: string }> = {
      default: { border: 'border.default', accent: 'fg.default' },
      accent: { border: 'accent.emphasis', accent: 'accent.fg' },
      success: { border: 'success.emphasis', accent: 'success.fg' },
      attention: { border: 'attention.emphasis', accent: 'attention.fg' },
      severe: { border: 'severe.emphasis', accent: 'severe.fg' },
      danger: { border: 'danger.emphasis', accent: 'danger.fg' },
    };
    return colors[color] || colors.default;
  };

  const colorStyles = getColorStyles();

  return (
    <Box
      sx={{
        p: 3,
        bg: 'canvas.default',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'border.default',
        borderTop: color !== 'default' ? '3px solid' : undefined,
        borderTopColor: color !== 'default' ? colorStyles.border : undefined,
      }}
    >
      <Text
        sx={{
          fontSize: 0,
          color: 'fg.muted',
          fontWeight: 500,
          display: 'block',
          mb: 1,
        }}
      >
        {title}
      </Text>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <Text
          sx={{
            fontSize: '32px',
            fontWeight: 600,
            color: colorStyles.accent,
            lineHeight: 1,
          }}
        >
          {value}
        </Text>
        {trend && (
          <Text
            sx={{
              fontSize: 0,
              fontWeight: 500,
              color: trend.isPositive ? 'success.fg' : 'danger.fg',
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </Text>
        )}
      </Box>
      {subtitle && (
        <Text
          sx={{
            fontSize: 0,
            color: 'fg.muted',
            mt: 1,
            display: 'block',
          }}
        >
          {subtitle}
        </Text>
      )}
    </Box>
  );
}
