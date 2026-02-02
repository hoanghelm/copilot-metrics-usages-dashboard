import { Box, Text } from '@primer/react';
import { LanguageBreakdown } from '@/pages/insights/types';
import { getChartColor } from '@/pages/insights/utils';

interface LanguageChartProps {
  data: LanguageBreakdown[];
}

export function LanguageChart({ data }: LanguageChartProps) {
  const topLanguages = data.slice(0, 8);
  const maxValue = Math.max(...topLanguages.map(l => l.totalSuggestions), 1);

  return (
    <Box
      sx={{
        p: 4,
        bg: 'canvas.default',
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
          Languages
        </Text>
        <Text
          sx={{
            fontSize: 0,
            color: 'fg.muted',
            display: 'block',
          }}
        >
          Suggestions by programming language
        </Text>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {topLanguages.map((lang, index) => (
          <Box key={lang.name}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bg: getChartColor(index),
                    flexShrink: 0,
                  }}
                />
                <Text sx={{ fontSize: 1, color: 'fg.default', fontWeight: 500 }}>
                  {lang.name}
                </Text>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Text sx={{ fontSize: 0, color: 'fg.muted', minWidth: 60, textAlign: 'right' }}>
                  {lang.totalSuggestions.toLocaleString()}
                </Text>
                <Text sx={{ fontSize: 0, color: 'success.fg', minWidth: 45, textAlign: 'right' }}>
                  {lang.acceptanceRate}%
                </Text>
              </Box>
            </Box>
            <Box
              sx={{
                height: 6,
                bg: 'neutral.muted',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${(lang.totalSuggestions / maxValue) * 100}%`,
                  bg: getChartColor(index),
                  borderRadius: 1,
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
      {data.length > 8 && (
        <Text
          sx={{
            fontSize: 0,
            color: 'fg.muted',
            mt: 3,
            display: 'block',
            textAlign: 'center',
          }}
        >
          +{data.length - 8} more languages
        </Text>
      )}
    </Box>
  );
}
