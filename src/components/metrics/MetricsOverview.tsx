import { Box } from '@primer/react';
import { MetricCard } from './MetricCard';
import { InsightsSummary } from '@/pages/insights/types';

interface MetricsOverviewProps {
  summary: InsightsSummary;
}

export function MetricsOverview({ summary }: MetricsOverviewProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr', 'repeat(2, 1fr)', 'repeat(4, 1fr)'],
        gap: 3,
      }}
    >
      <MetricCard
        title="Acceptance Rate"
        value={`${summary.averageAcceptanceRate}%`}
        subtitle="Code suggestions accepted"
      />
      <MetricCard
        title="Active Users"
        value={summary.totalActiveUsers}
        subtitle="Average daily active users"
      />
      <MetricCard
        title="Adoption Rate"
        value={`${summary.adoptionRate}%`}
        subtitle={`${summary.activeSeats} of ${summary.totalSeats} seats active`}
      />
      <MetricCard
        title="Total Suggestions"
        value={summary.totalSuggestions.toLocaleString()}
        subtitle={`${summary.totalAcceptances.toLocaleString()} accepted`}
      />
    </Box>
  );
}
