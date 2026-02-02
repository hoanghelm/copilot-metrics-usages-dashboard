import { useState } from 'react';
import { Box, Spinner, Flash, Text, Heading } from '@primer/react';
import {
  AcceptanceRateChart,
  SuggestionsChart,
  LinesChart,
  LanguageChart,
} from '@/components/charts';
import {
  TimeRangeFilter,
  TimeFrameToggle,
  DropdownFilter,
  DateRangePicker,
} from '@/components/filters';
import { MetricCard } from '@/components/metrics';
import { useInsights } from '@/pages/insights/useHooks';
import { format } from 'date-fns';

export function CodeCompletionPage() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const {
    filter,
    dateRange,
    setTimeRange,
    setTimeFrame,
    setCustomDateRange,
    toggleLanguage,
    toggleEditor,
    processedMetrics,
    languageBreakdown,
    summary,
    availableLanguages,
    availableEditors,
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
            Code completion
          </Heading>
          <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
            {getDateRangeLabel()}
          </Text>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TimeRangeFilter
            value={filter.timeRange}
            onChange={setTimeRange}
            customDateRange={filter.customDateRange}
            onCustomDateClick={() => setIsDatePickerOpen(true)}
            variant="segmented"
          />
          <DropdownFilter
            label="Languages"
            options={availableLanguages}
            selectedOptions={filter.languages}
            onToggle={toggleLanguage}
          />
          <DropdownFilter
            label="Editors"
            options={availableEditors}
            selectedOptions={filter.editors}
            onToggle={toggleEditor}
          />
        </Box>
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
          {/* Metrics Cards */}
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
              subtitle="Suggestions accepted"
            />
            <MetricCard
              title="Lines Acceptance Rate"
              value={`${summary.averageLinesAcceptanceRate}%`}
              subtitle="Lines of code accepted"
            />
            <MetricCard
              title="Total Suggestions"
              value={summary.totalSuggestions.toLocaleString()}
              subtitle="Code suggestions shown"
            />
            <MetricCard
              title="Total Acceptances"
              value={summary.totalAcceptances.toLocaleString()}
              subtitle="Suggestions accepted"
            />
          </Box>

          {/* Time Frame Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <TimeFrameToggle
              value={filter.timeFrame}
              onChange={setTimeFrame}
            />
          </Box>

          {/* Acceptance Rate Chart */}
          <AcceptanceRateChart data={processedMetrics} />

          {/* Suggestions and Lines Charts */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)'],
              gap: 4,
            }}
          >
            <SuggestionsChart data={processedMetrics} />
            <LinesChart data={processedMetrics} />
          </Box>

          {/* Language Breakdown */}
          <LanguageChart data={languageBreakdown} />
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
