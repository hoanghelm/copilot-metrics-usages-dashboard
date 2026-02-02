import { Box, Text } from '@primer/react';
import { EditorBreakdown } from '@/pages/insights/types';
import { getChartColor } from '@/pages/insights/utils';

interface EditorChartProps {
  data: EditorBreakdown[];
}

export function EditorChart({ data }: EditorChartProps) {
  const maxValue = Math.max(...data.map(e => e.totalEngagedUsers), 1);

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
          Editors
        </Text>
        <Text
          sx={{
            fontSize: 0,
            color: 'fg.muted',
            display: 'block',
          }}
        >
          IDE usage distribution
        </Text>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {data.map((editor, index) => (
          <Box key={editor.name}>
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
                  {editor.name}
                </Text>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Text sx={{ fontSize: 0, color: 'fg.muted', minWidth: 50, textAlign: 'right' }}>
                  {editor.totalEngagedUsers.toLocaleString()}
                </Text>
                <Text sx={{ fontSize: 0, color: 'fg.muted', minWidth: 45, textAlign: 'right' }}>
                  {editor.percentage}%
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
                  width: `${(editor.totalEngagedUsers / maxValue) * 100}%`,
                  bg: getChartColor(index),
                  borderRadius: 1,
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
