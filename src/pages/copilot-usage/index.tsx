import { useState } from 'react';
import { Box, Spinner, Flash, Text, Heading } from '@primer/react';
import { MetricsOverview } from '@/components/metrics';
import {
  ActiveUsersChart,
  ChatChart,
  LanguageChart,
  EditorChart,
} from '@/components/charts';
import {
  TimeRangeFilter,
  TimeFrameToggle,
  DateRangePicker,
} from '@/components/filters';
import { useInsights } from '@/pages/insights/useHooks';
import { format } from 'date-fns';

export function CopilotUsagePage() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const {
    filter,
    dateRange,
    setTimeRange,
    setTimeFrame,
    setCustomDateRange,
    processedMetrics,
    languageBreakdown,
    editorBreakdown,
    summary,
    isLoading,
    isError,
    error,
  } = useInsights();

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Flash variant="danger">
          Error loading metrics: {error?.message || 'Unknown error'}
        </Flash>
      </Box>
    );
  }

  const getDateRangeLabel = () => {
    const start = format(dateRange.startDate, 'MMM d, yyyy');
    const end = format(dateRange.endDate, 'MMM d, yyyy');
    return `${start} - ${end}`;
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1280, mx: 'auto' }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        <Box>
          <Heading as="h1" sx={{ fontSize: 3, fontWeight: 600, mb: 1 }}>
            Copilot IDE usage
          </Heading>
          <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
            {getDateRangeLabel()}
          </Text>
        </Box>
        <TimeRangeFilter
          value={filter.timeRange}
          onChange={setTimeRange}
          customDateRange={filter.customDateRange}
          onCustomDateClick={() => setIsDatePickerOpen(true)}
          variant="segmented"
        />
      </Box>

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <Spinner size="large" />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Metrics Overview Cards */}
          <MetricsOverview summary={summary} />

          {/* Time Frame Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <TimeFrameToggle
              value={filter.timeFrame}
              onChange={setTimeFrame}
            />
          </Box>

          {/* Active Users Chart */}
          <ActiveUsersChart data={processedMetrics} />

          {/* Chat Chart */}
          <ChatChart data={processedMetrics} />

          {/* Language and Editor Breakdown */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)'],
              gap: 4,
            }}
          >
            <LanguageChart data={languageBreakdown} />
            <EditorChart data={editorBreakdown} />
          </Box>
        </Box>
      )}

      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={(range) => {
          setCustomDateRange(range);
          setIsDatePickerOpen(false);
        }}
        initialDateRange={dateRange}
      />
    </Box>
  );
}
