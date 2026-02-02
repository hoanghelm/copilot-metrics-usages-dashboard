import { useState } from 'react';
import { Box, Spinner, Flash } from '@primer/react';
import { PageHeader } from '@/components/layout';
import { MetricsOverview } from '@/components/metrics';
import {
  AcceptanceRateChart,
  ActiveUsersChart,
  SuggestionsChart,
  LinesChart,
  ChatChart,
  LanguageChart,
  EditorChart,
} from '@/components/charts';
import {
  TimeRangeFilter,
  TimeFrameToggle,
  DropdownFilter,
  DateRangePicker,
} from '@/components/filters';
import { useInsights } from './useHooks';

export function InsightsPage() {
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
    editorBreakdown,
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

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
      <PageHeader
        title="Insights"
        description="View usage metrics and trends for GitHub Copilot"
        actions={
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TimeRangeFilter
              value={filter.timeRange}
              onChange={setTimeRange}
              customDateRange={filter.customDateRange}
              onCustomDateClick={() => setIsDatePickerOpen(true)}
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
        }
      />

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
          <MetricsOverview summary={summary} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <TimeFrameToggle
              value={filter.timeFrame}
              onChange={setTimeFrame}
            />
          </Box>

          <ActiveUsersChart data={processedMetrics} />

          <AcceptanceRateChart data={processedMetrics} />

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

          <ChatChart data={processedMetrics} />

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
