import { CopilotMetrics, CopilotSeats, AIModel } from '@/types/copilot';

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
  // Copilot Usage page metrics
  ideActiveUsers: number;
  agentAdoptionPercentage: number;
  agentActiveUsers: number;
  mostUsedChatModel: AIModel;
  // Code Generation page metrics
  totalLinesChanged: number;
  agentContributionPercentage: number;
  averageLinesDeletedByAgent: number;
}

// Chat mode data for charts
export interface ChatModeData {
  date: string;
  displayDate: string;
  Edit: number;
  Ask: number;
  Agent: number;
  Custom: number;
  Inline: number;
}

// Model usage data for charts
export interface ModelUsageData {
  date: string;
  displayDate: string;
  'Claude Sonnet 4.5': number;
  'GPT-4.1': number;
  'Claude Haiku 4.5': number;
  'GPT-5.2': number;
  'Gemini 3.0 Pro': number;
  'Other models': number;
}

// Language usage data for charts
export interface LanguageUsageData {
  date: string;
  displayDate: string;
  csharp: number;
  TSX: number;
  Java: number;
  Python: number;
  'Other languages': number;
}

// Code generation data for charts
export interface CodeGenerationData {
  date: string;
  displayDate: string;
  linesAdded: number;
  linesDeleted: number;
}

// Model distribution for donut chart
export interface ModelDistribution {
  name: AIModel;
  value: number;
  percentage: number;
}

// Language distribution for donut chart
export interface LanguageDistribution {
  name: string;
  value: number;
  percentage: number;
}

// Code changes by mode
export interface CodeChangesByMode {
  mode: string;
  suggested: number;
  added: number;
}

// Code changes by model
export interface CodeChangesByModel {
  model: AIModel;
  suggested: number;
  added: number;
}

// Agent code changes by model
export interface AgentCodeChangesByModel {
  model: AIModel;
  added: number;
  deleted: number;
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
