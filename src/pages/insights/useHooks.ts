import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CopilotMetrics, CopilotSeats } from '@/types/copilot';
import {
  TimeRange,
  TimeFrame,
  DateRange,
  InsightsFilter,
  ProcessedMetrics,
  LanguageBreakdown,
  EditorBreakdown,
  InsightsSummary,
} from './types';
import {
  getDateRangeFromTimeRange,
  processMetrics,
  getLanguageBreakdown,
  getEditorBreakdown,
  calculateSummary,
  filterMetricsByLanguages,
  filterMetricsByEditors,
} from './utils';
import {
  fetchCopilotMetrics,
  fetchCopilotSeats,
} from '@/api/copilotMetrics';

const QUERY_KEYS = {
  metrics: 'copilot-metrics',
  seats: 'copilot-seats',
};

export function useInsightsFilter() {
  const [filter, setFilter] = useState<InsightsFilter>({
    timeRange: '28_days',
    timeFrame: 'daily',
    languages: [],
    editors: [],
  });

  const dateRange = useMemo(() => {
    if (filter.timeRange === 'custom' && filter.customDateRange) {
      return filter.customDateRange;
    }
    return getDateRangeFromTimeRange(filter.timeRange);
  }, [filter.timeRange, filter.customDateRange]);

  const setTimeRange = useCallback((timeRange: TimeRange) => {
    setFilter((prev) => ({ ...prev, timeRange }));
  }, []);

  const setTimeFrame = useCallback((timeFrame: TimeFrame) => {
    setFilter((prev) => ({ ...prev, timeFrame }));
  }, []);

  const setCustomDateRange = useCallback((customDateRange: DateRange) => {
    setFilter((prev) => ({
      ...prev,
      timeRange: 'custom',
      customDateRange,
    }));
  }, []);

  const toggleLanguage = useCallback((language: string) => {
    setFilter((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  }, []);

  const toggleEditor = useCallback((editor: string) => {
    setFilter((prev) => ({
      ...prev,
      editors: prev.editors.includes(editor)
        ? prev.editors.filter((e) => e !== editor)
        : [...prev.editors, editor],
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilter({
      timeRange: '28_days',
      timeFrame: 'daily',
      languages: [],
      editors: [],
    });
  }, []);

  return {
    filter,
    dateRange,
    setTimeRange,
    setTimeFrame,
    setCustomDateRange,
    toggleLanguage,
    toggleEditor,
    resetFilters,
  };
}

export function useMetrics(dateRange: DateRange) {
  return useQuery<CopilotMetrics[]>({
    queryKey: [QUERY_KEYS.metrics, dateRange.startDate, dateRange.endDate],
    queryFn: () =>
      fetchCopilotMetrics({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useSeats() {
  return useQuery<CopilotSeats>({
    queryKey: [QUERY_KEYS.seats],
    queryFn: () => fetchCopilotSeats({}),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useProcessedMetrics(
  metrics: CopilotMetrics[] | undefined,
  filter: InsightsFilter
): ProcessedMetrics[] {
  return useMemo(() => {
    if (!metrics || metrics.length === 0) return [];

    let filteredMetrics = metrics;

    if (filter.languages.length > 0) {
      filteredMetrics = filterMetricsByLanguages(
        filteredMetrics,
        filter.languages
      );
    }

    if (filter.editors.length > 0) {
      filteredMetrics = filterMetricsByEditors(filteredMetrics, filter.editors);
    }

    return processMetrics(filteredMetrics, filter.timeFrame);
  }, [metrics, filter]);
}

export function useLanguageBreakdown(
  metrics: CopilotMetrics[] | undefined
): LanguageBreakdown[] {
  return useMemo(() => {
    if (!metrics || metrics.length === 0) return [];
    return getLanguageBreakdown(metrics);
  }, [metrics]);
}

export function useEditorBreakdown(
  metrics: CopilotMetrics[] | undefined
): EditorBreakdown[] {
  return useMemo(() => {
    if (!metrics || metrics.length === 0) return [];
    return getEditorBreakdown(metrics);
  }, [metrics]);
}

export function useSummary(
  metrics: CopilotMetrics[] | undefined,
  seats: CopilotSeats | undefined | null
): InsightsSummary {
  return useMemo(() => {
    if (!metrics) {
      return {
        totalActiveUsers: 0,
        totalEngagedUsers: 0,
        averageAcceptanceRate: 0,
        averageLinesAcceptanceRate: 0,
        totalSeats: 0,
        activeSeats: 0,
        adoptionRate: 0,
        totalSuggestions: 0,
        totalAcceptances: 0,
        totalChats: 0,
      };
    }
    return calculateSummary(metrics, seats || null);
  }, [metrics, seats]);
}

export function useInsights() {
  const filterHooks = useInsightsFilter();
  const { dateRange, filter } = filterHooks;

  const metricsQuery = useMetrics(dateRange);
  const seatsQuery = useSeats();

  const processedMetrics = useProcessedMetrics(metricsQuery.data, filter);
  const languageBreakdown = useLanguageBreakdown(metricsQuery.data);
  const editorBreakdown = useEditorBreakdown(metricsQuery.data);
  const summary = useSummary(metricsQuery.data, seatsQuery.data);

  const availableLanguages = useMemo(() => {
    return languageBreakdown.map((l) => l.name);
  }, [languageBreakdown]);

  const availableEditors = useMemo(() => {
    return editorBreakdown.map((e) => e.name);
  }, [editorBreakdown]);

  return {
    ...filterHooks,
    metricsQuery,
    seatsQuery,
    processedMetrics,
    languageBreakdown,
    editorBreakdown,
    summary,
    availableLanguages,
    availableEditors,
    isLoading: metricsQuery.isLoading || seatsQuery.isLoading,
    isError: metricsQuery.isError || seatsQuery.isError,
    error: metricsQuery.error || seatsQuery.error,
  };
}
