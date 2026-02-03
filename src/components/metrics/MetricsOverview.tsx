import { Box, Text, Link, ProgressBar } from '@primer/react';
import { InsightsSummary } from '@/pages/insights/types';

interface MetricsOverviewProps {
  summary: InsightsSummary;
}

export function MetricsOverview({ summary }: MetricsOverviewProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)'],
        gap: 3,
      }}
    >
      {/* IDE Active Users Card */}
      <Box
        sx={{
          p: 3,
          bg: 'canvas.subtle',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'border.default',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Text sx={{ fontSize: 1, fontWeight: 600, color: 'fg.default' }}>
            IDE active users
          </Text>
          <Link href="#" sx={{ fontSize: 0, color: 'accent.fg' }}>
            Manage licenses
          </Link>
        </Box>
        <Text
          sx={{
            fontSize: '48px',
            fontWeight: 600,
            color: 'fg.default',
            lineHeight: 1,
            display: 'block',
            mb: 2,
          }}
        >
          {summary.ideActiveUsers}
        </Text>
        <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
          Copilot-licensed users who interacted with Copilot in the current calendar month
        </Text>
      </Box>

      {/* Agent Adoption Card */}
      <Box
        sx={{
          p: 3,
          bg: 'canvas.subtle',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'border.default',
        }}
      >
        <Text sx={{ fontSize: 1, fontWeight: 600, color: 'fg.default', display: 'block', mb: 2 }}>
          Agent adoption
        </Text>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 2 }}>
          <Text
            sx={{
              fontSize: '48px',
              fontWeight: 600,
              color: 'fg.default',
              lineHeight: 1,
            }}
          >
            {summary.agentAdoptionPercentage}%
          </Text>
          <Text sx={{ fontSize: 1, color: 'fg.muted' }}>
            {summary.agentActiveUsers} out of {summary.ideActiveUsers} active users
          </Text>
        </Box>
        <ProgressBar
          progress={summary.agentAdoptionPercentage}
          sx={{
            height: 8,
            bg: 'neutral.muted',
            mb: 2,
          }}
        />
        <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
          Active users who used any agent feature in the current calendar month
        </Text>
      </Box>

      {/* Most Used Chat Model Card */}
      <Box
        sx={{
          p: 3,
          bg: 'canvas.subtle',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'border.default',
        }}
      >
        <Text sx={{ fontSize: 1, fontWeight: 600, color: 'fg.default', display: 'block', mb: 2 }}>
          Most used chat model
        </Text>
        <Text
          sx={{
            fontSize: '32px',
            fontWeight: 600,
            color: 'fg.default',
            lineHeight: 1.2,
            display: 'block',
            mb: 2,
          }}
        >
          {summary.mostUsedChatModel}
        </Text>
        <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
          Model with the highest number of chat requests in the last 28 days
        </Text>
      </Box>
    </Box>
  );
}
