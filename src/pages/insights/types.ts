import { CopilotMetrics, CopilotSeats } from '@/types/copilot';

export type TimeRange =
  | '7_days'
  | '14_days'
  | '28_days'
  | 'current_month'
  | 'previous_month'
  | '3_months'
  | '6_months'
  | '1_year'
  | 'custom';

export type TimeFrame = 'daily' | 'weekly' | 'monthly';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface InsightsFilter {
  timeRange: TimeRange;
  timeFrame: TimeFrame;
  customDateRange?: DateRange;
  languages: string[];
  editors: string[];
}

export interface ProcessedMetrics {
  date: string;
  displayDate: string;
  totalActiveUsers: number;
  totalEngagedUsers: number;
  totalCodeSuggestions: number;
  totalCodeAcceptances: number;
  totalCodeLinesSuggested: number;
  totalCodeLinesAccepted: number;
  totalChatEngagedUsers: number;
  totalChats: number;
  totalChatInsertionEvents: number;
  totalChatCopyEvents: number;
  totalPrSummariesCreated: number;
  acceptanceRate: number;
  linesAcceptanceRate: number;
  chatAcceptanceRate: number;
}

export interface LanguageBreakdown {
  name: string;
  totalEngagedUsers: number;
  totalSuggestions: number;
  totalAcceptances: number;
  totalLinesSuggested: number;
  totalLinesAccepted: number;
  acceptanceRate: number;
  percentage: number;
}

export interface EditorBreakdown {
  name: string;
  totalEngagedUsers: number;
  percentage: number;
}

export interface InsightsSummary {
  totalActiveUsers: number;
  totalEngagedUsers: number;
  averageAcceptanceRate: number;
  averageLinesAcceptanceRate: number;
  totalSeats: number;
  activeSeats: number;
  adoptionRate: number;
  totalSuggestions: number;
  totalAcceptances: number;
  totalChats: number;
}

export interface InsightsData {
  metrics: CopilotMetrics[];
  seats: CopilotSeats | null;
  processedMetrics: ProcessedMetrics[];
  languageBreakdown: LanguageBreakdown[];
  editorBreakdown: EditorBreakdown[];
  summary: InsightsSummary;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
