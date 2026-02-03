import {
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  format,
  startOfWeek,
  parseISO,
  isWithinInterval,
  differenceInDays,
} from 'date-fns';
import { CopilotMetrics, CopilotSeats } from '@/types/copilot';
import {
  TimeRange,
  TimeFrame,
  DateRange,
  ProcessedMetrics,
  LanguageBreakdown,
  EditorBreakdown,
  InsightsSummary,
} from './types';

export function getDateRangeFromTimeRange(timeRange: TimeRange): DateRange {
  const now = new Date();

  switch (timeRange) {
    case '7_days':
      return {
        startDate: subDays(now, 7),
        endDate: now,
      };
    case '14_days':
      return {
        startDate: subDays(now, 14),
        endDate: now,
      };
    case '28_days':
      return {
        startDate: subDays(now, 28),
        endDate: now,
      };
    case 'current_month':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };
    case 'previous_month':
      const prevMonth = subMonths(now, 1);
      return {
        startDate: startOfMonth(prevMonth),
        endDate: endOfMonth(prevMonth),
      };
    case '3_months':
      return {
        startDate: startOfMonth(subMonths(now, 2)),
        endDate: endOfMonth(now),
      };
    case '6_months':
      return {
        startDate: startOfMonth(subMonths(now, 5)),
        endDate: endOfMonth(now),
      };
    case '1_year':
      return {
        startDate: startOfMonth(subMonths(now, 11)),
        endDate: endOfMonth(now),
      };
    default:
      return {
        startDate: subDays(now, 28),
        endDate: now,
      };
  }
}

export function formatDateForDisplay(
  date: string,
  timeFrame: TimeFrame
): string {
  const parsedDate = parseISO(date);

  switch (timeFrame) {
    case 'daily':
      return format(parsedDate, 'MMM d');
    case 'weekly':
      return format(startOfWeek(parsedDate), 'MMM d');
    case 'monthly':
      return format(parsedDate, 'MMM yyyy');
    default:
      return format(parsedDate, 'MMM d');
  }
}

export function processMetrics(
  metrics: CopilotMetrics[],
  timeFrame: TimeFrame
): ProcessedMetrics[] {
  const groupedData = new Map<string, CopilotMetrics[]>();

  metrics.forEach((metric) => {
    const date = parseISO(metric.date);
    let key: string;

    switch (timeFrame) {
      case 'daily':
        key = metric.date;
        break;
      case 'weekly':
        key = format(startOfWeek(date), 'yyyy-MM-dd');
        break;
      case 'monthly':
        key = format(date, 'yyyy-MM');
        break;
      default:
        key = metric.date;
    }

    if (!groupedData.has(key)) {
      groupedData.set(key, []);
    }
    groupedData.get(key)!.push(metric);
  });

  const result: ProcessedMetrics[] = [];

  groupedData.forEach((group, key) => {
    const aggregated = aggregateMetrics(group);
    result.push({
      date: key,
      displayDate: formatDateForDisplay(
        group[0].date,
        timeFrame
      ),
      ...aggregated,
    });
  });

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

function aggregateMetrics(metrics: CopilotMetrics[]) {
  let totalActiveUsers = 0;
  let totalEngagedUsers = 0;
  let totalCodeSuggestions = 0;
  let totalCodeAcceptances = 0;
  let totalCodeLinesSuggested = 0;
  let totalCodeLinesAccepted = 0;
  let totalChatEngagedUsers = 0;
  let totalChats = 0;
  let totalChatInsertionEvents = 0;
  let totalChatCopyEvents = 0;
  let totalPrSummariesCreated = 0;

  metrics.forEach((metric) => {
    totalActiveUsers += metric.total_active_users;
    totalEngagedUsers += metric.total_engaged_users;

    if (metric.copilot_ide_code_completions) {
      metric.copilot_ide_code_completions.editors.forEach((editor) => {
        editor.models.forEach((model) => {
          model.languages.forEach((lang) => {
            totalCodeSuggestions += lang.total_code_suggestions;
            totalCodeAcceptances += lang.total_code_acceptances;
            totalCodeLinesSuggested += lang.total_code_lines_suggested;
            totalCodeLinesAccepted += lang.total_code_lines_accepted;
          });
        });
      });
    }

    if (metric.copilot_ide_chat) {
      totalChatEngagedUsers += metric.copilot_ide_chat.total_engaged_users;
      metric.copilot_ide_chat.editors.forEach((editor) => {
        editor.models.forEach((model) => {
          totalChats += model.total_chats;
          totalChatInsertionEvents += model.total_chat_insertion_events;
          totalChatCopyEvents += model.total_chat_copy_events;
        });
      });
    }

    if (metric.copilot_dotcom_chat) {
      metric.copilot_dotcom_chat.models.forEach((model) => {
        totalChats += model.total_chats;
      });
    }

    if (metric.copilot_dotcom_pull_requests) {
      metric.copilot_dotcom_pull_requests.repositories.forEach((repo) => {
        repo.models.forEach((model) => {
          totalPrSummariesCreated += model.total_pr_summaries_created;
        });
      });
    }
  });

  const acceptanceRate =
    totalCodeSuggestions > 0
      ? (totalCodeAcceptances / totalCodeSuggestions) * 100
      : 0;

  const linesAcceptanceRate =
    totalCodeLinesSuggested > 0
      ? (totalCodeLinesAccepted / totalCodeLinesSuggested) * 100
      : 0;

  const chatAcceptanceRate =
    totalChats > 0
      ? ((totalChatInsertionEvents + totalChatCopyEvents) / totalChats) * 100
      : 0;

  return {
    totalActiveUsers: Math.round(totalActiveUsers / metrics.length),
    totalEngagedUsers: Math.round(totalEngagedUsers / metrics.length),
    totalCodeSuggestions,
    totalCodeAcceptances,
    totalCodeLinesSuggested,
    totalCodeLinesAccepted,
    totalChatEngagedUsers: Math.round(totalChatEngagedUsers / metrics.length),
    totalChats,
    totalChatInsertionEvents,
    totalChatCopyEvents,
    totalPrSummariesCreated,
    acceptanceRate: Math.round(acceptanceRate * 100) / 100,
    linesAcceptanceRate: Math.round(linesAcceptanceRate * 100) / 100,
    chatAcceptanceRate: Math.round(chatAcceptanceRate * 100) / 100,
  };
}

export function getLanguageBreakdown(
  metrics: CopilotMetrics[]
): LanguageBreakdown[] {
  const languageMap = new Map<
    string,
    {
      totalEngagedUsers: number;
      totalSuggestions: number;
      totalAcceptances: number;
      totalLinesSuggested: number;
      totalLinesAccepted: number;
    }
  >();

  metrics.forEach((metric) => {
    if (metric.copilot_ide_code_completions) {
      metric.copilot_ide_code_completions.editors.forEach((editor) => {
        editor.models.forEach((model) => {
          model.languages.forEach((lang) => {
            const existing = languageMap.get(lang.name) || {
              totalEngagedUsers: 0,
              totalSuggestions: 0,
              totalAcceptances: 0,
              totalLinesSuggested: 0,
              totalLinesAccepted: 0,
            };

            languageMap.set(lang.name, {
              totalEngagedUsers:
                existing.totalEngagedUsers + lang.total_engaged_users,
              totalSuggestions:
                existing.totalSuggestions + lang.total_code_suggestions,
              totalAcceptances:
                existing.totalAcceptances + lang.total_code_acceptances,
              totalLinesSuggested:
                existing.totalLinesSuggested + lang.total_code_lines_suggested,
              totalLinesAccepted:
                existing.totalLinesAccepted + lang.total_code_lines_accepted,
            });
          });
        });
      });
    }
  });

  const totalUsers = Array.from(languageMap.values()).reduce(
    (sum, lang) => sum + lang.totalEngagedUsers,
    0
  );

  const result: LanguageBreakdown[] = Array.from(languageMap.entries())
    .map(([name, data]) => ({
      name,
      totalEngagedUsers: data.totalEngagedUsers,
      totalSuggestions: data.totalSuggestions,
      totalAcceptances: data.totalAcceptances,
      totalLinesSuggested: data.totalLinesSuggested,
      totalLinesAccepted: data.totalLinesAccepted,
      acceptanceRate:
        data.totalSuggestions > 0
          ? Math.round(
              (data.totalAcceptances / data.totalSuggestions) * 100 * 100
            ) / 100
          : 0,
      percentage:
        totalUsers > 0
          ? Math.round((data.totalEngagedUsers / totalUsers) * 100 * 100) / 100
          : 0,
    }))
    .sort((a, b) => b.totalEngagedUsers - a.totalEngagedUsers);

  return result;
}

export function getEditorBreakdown(
  metrics: CopilotMetrics[]
): EditorBreakdown[] {
  const editorMap = new Map<string, number>();

  metrics.forEach((metric) => {
    if (metric.copilot_ide_code_completions) {
      metric.copilot_ide_code_completions.editors.forEach((editor) => {
        const existing = editorMap.get(editor.name) || 0;
        editorMap.set(editor.name, existing + editor.total_engaged_users);
      });
    }
  });

  const totalUsers = Array.from(editorMap.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  const result: EditorBreakdown[] = Array.from(editorMap.entries())
    .map(([name, totalEngagedUsers]) => ({
      name,
      totalEngagedUsers,
      percentage:
        totalUsers > 0
          ? Math.round((totalEngagedUsers / totalUsers) * 100 * 100) / 100
          : 0,
    }))
    .sort((a, b) => b.totalEngagedUsers - a.totalEngagedUsers);

  return result;
}

export function calculateSummary(
  metrics: CopilotMetrics[],
  seats: CopilotSeats | null
): InsightsSummary {
  if (metrics.length === 0) {
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
      ideActiveUsers: 0,
      agentAdoptionPercentage: 0,
      agentActiveUsers: 0,
      mostUsedChatModel: 'Claude Sonnet 4.5',
      totalLinesChanged: 0,
      agentContributionPercentage: 0,
      averageLinesDeletedByAgent: 0,
    };
  }

  let totalActiveUsers = 0;
  let totalEngagedUsers = 0;
  let totalSuggestions = 0;
  let totalAcceptances = 0;
  let totalLinesSuggested = 0;
  let totalLinesAccepted = 0;
  let totalChats = 0;
  let totalAgentAdoption = 0;
  let totalAgentUsers = 0;
  let totalLinesChanged = 0;
  let totalAgentContribution = 0;
  let totalLinesDeletedByAgent = 0;

  metrics.forEach((metric) => {
    totalActiveUsers += metric.total_active_users;
    totalEngagedUsers += metric.total_engaged_users;

    // New metrics from enhanced data
    if (metric.agent_adoption) {
      totalAgentAdoption += metric.agent_adoption.percentage;
      totalAgentUsers += metric.agent_adoption.active_agent_users;
    }

    if (metric.code_generation) {
      totalLinesChanged += metric.code_generation.total_lines_changed;
      totalAgentContribution += metric.code_generation.agent_contribution_percentage;
      totalLinesDeletedByAgent += metric.code_generation.average_lines_deleted_by_agent;
    }

    if (metric.copilot_ide_code_completions) {
      metric.copilot_ide_code_completions.editors.forEach((editor) => {
        editor.models.forEach((model) => {
          model.languages.forEach((lang) => {
            totalSuggestions += lang.total_code_suggestions;
            totalAcceptances += lang.total_code_acceptances;
            totalLinesSuggested += lang.total_code_lines_suggested;
            totalLinesAccepted += lang.total_code_lines_accepted;
          });
        });
      });
    }

    if (metric.copilot_ide_chat) {
      metric.copilot_ide_chat.editors.forEach((editor) => {
        editor.models.forEach((model) => {
          totalChats += model.total_chats;
        });
      });
    }

    if (metric.copilot_dotcom_chat) {
      metric.copilot_dotcom_chat.models.forEach((model) => {
        totalChats += model.total_chats;
      });
    }
  });

  const averageAcceptanceRate =
    totalSuggestions > 0
      ? Math.round((totalAcceptances / totalSuggestions) * 100 * 100) / 100
      : 0;

  const averageLinesAcceptanceRate =
    totalLinesSuggested > 0
      ? Math.round((totalLinesAccepted / totalLinesSuggested) * 100 * 100) / 100
      : 0;

  const totalSeats = seats?.total_seats || 0;
  const activeSeats = seats
    ? seats.seats.filter((seat) => {
        if (!seat.last_activity_at) return false;
        const lastActivity = parseISO(seat.last_activity_at);
        const daysSinceActivity = differenceInDays(new Date(), lastActivity);
        return daysSinceActivity <= 30;
      }).length
    : 0;

  const adoptionRate =
    totalSeats > 0
      ? Math.round((activeSeats / totalSeats) * 100 * 100) / 100
      : 0;

  // Calculate IDE active users (max unique active users in the period)
  const ideActiveUsers = Math.max(...metrics.map(m => m.total_active_users));

  // Get the most used chat model from the latest metrics
  const latestMetric = metrics[metrics.length - 1];
  const mostUsedChatModel = latestMetric?.model_usage?.most_used_model || 'Claude Sonnet 4.5';

  return {
    totalActiveUsers: Math.round(totalActiveUsers / metrics.length),
    totalEngagedUsers: Math.round(totalEngagedUsers / metrics.length),
    averageAcceptanceRate,
    averageLinesAcceptanceRate,
    totalSeats,
    activeSeats,
    adoptionRate,
    totalSuggestions,
    totalAcceptances,
    totalChats,
    ideActiveUsers,
    agentAdoptionPercentage: Math.round(totalAgentAdoption / metrics.length),
    agentActiveUsers: Math.round(totalAgentUsers / metrics.length),
    mostUsedChatModel,
    totalLinesChanged,
    agentContributionPercentage: Math.round((totalAgentContribution / metrics.length) * 100) / 100,
    averageLinesDeletedByAgent: Math.round(totalLinesDeletedByAgent / metrics.length),
  };
}

export function filterMetricsByDateRange(
  metrics: CopilotMetrics[],
  dateRange: DateRange
): CopilotMetrics[] {
  return metrics.filter((metric) => {
    const date = parseISO(metric.date);
    return isWithinInterval(date, {
      start: dateRange.startDate,
      end: dateRange.endDate,
    });
  });
}

export function filterMetricsByLanguages(
  metrics: CopilotMetrics[],
  languages: string[]
): CopilotMetrics[] {
  if (languages.length === 0) return metrics;

  return metrics.map((metric) => {
    if (!metric.copilot_ide_code_completions) return metric;

    const filteredEditors = metric.copilot_ide_code_completions.editors.map(
      (editor) => ({
        ...editor,
        models: editor.models.map((model) => ({
          ...model,
          languages: model.languages.filter((lang) =>
            languages.includes(lang.name)
          ),
        })),
      })
    );

    return {
      ...metric,
      copilot_ide_code_completions: {
        ...metric.copilot_ide_code_completions,
        editors: filteredEditors,
      },
    };
  });
}

export function filterMetricsByEditors(
  metrics: CopilotMetrics[],
  editors: string[]
): CopilotMetrics[] {
  if (editors.length === 0) return metrics;

  return metrics.map((metric) => {
    if (!metric.copilot_ide_code_completions) return metric;

    const filteredEditors = metric.copilot_ide_code_completions.editors.filter(
      (editor) => editors.includes(editor.name)
    );

    return {
      ...metric,
      copilot_ide_code_completions: {
        ...metric.copilot_ide_code_completions,
        editors: filteredEditors,
      },
    };
  });
}

export const CHART_COLORS = [
  '#0969da',
  '#8250df',
  '#bf3989',
  '#cf222e',
  '#fb8f44',
  '#4ac26b',
  '#2da44e',
  '#1b7c83',
  '#0550ae',
  '#6639ba',
];

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
