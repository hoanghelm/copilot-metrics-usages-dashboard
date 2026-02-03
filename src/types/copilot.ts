// Chat modes used in Copilot
export type ChatMode = 'Edit' | 'Ask' | 'Agent' | 'Custom' | 'Inline';

// AI Models available in Copilot
export type AIModel =
  | 'Claude Sonnet 4.5'
  | 'GPT-4.1'
  | 'Claude Haiku 4.5'
  | 'GPT-5.2'
  | 'Gemini 3.0 Pro'
  | 'Other models';

// Languages tracked in metrics
export type Language = 'csharp' | 'TSX' | 'Java' | 'Python' | 'SQL' | 'vb' | 'Visual Basic .NET' | 'Other languages';

export interface CopilotMetrics {
  id: string;
  date: string;
  total_active_users: number;
  total_engaged_users: number;
  copilot_ide_code_completions: IdeCodeCompletions | null;
  copilot_ide_chat: IdeChat | null;
  copilot_dotcom_chat: DotcomChat | null;
  copilot_dotcom_pull_requests: DotcomPullRequests | null;
  // New fields for enhanced metrics
  daily_active_users: number;
  weekly_active_users: number;
  agent_adoption: AgentAdoption;
  chat_requests: ChatRequests;
  model_usage: ModelUsage;
  language_usage: LanguageUsage;
  code_generation: CodeGeneration;
  enterprise: string | null;
  organization: string | null;
  team: string | null;
  last_update: string;
}

// Agent adoption metrics
export interface AgentAdoption {
  percentage: number;
  active_agent_users: number;
  total_active_users: number;
}

// Chat requests metrics
export interface ChatRequests {
  average_per_active_user: number;
  total_requests: number;
  requests_by_mode: ChatModeRequest[];
}

export interface ChatModeRequest {
  mode: ChatMode;
  requests: number;
}

// Model usage metrics
export interface ModelUsage {
  most_used_model: AIModel;
  usage_by_model: ModelUsageEntry[];
  usage_by_chat_mode: ModelChatModeUsage[];
  usage_by_language: ModelLanguageUsage[];
}

export interface ModelUsageEntry {
  model: AIModel;
  percentage: number;
  requests: number;
}

export interface ModelChatModeUsage {
  model: AIModel;
  usage_by_mode: { mode: ChatMode; percentage: number }[];
}

export interface ModelLanguageUsage {
  language: string;
  usage_by_model: { model: AIModel; percentage: number }[];
}

// Language usage metrics
export interface LanguageUsage {
  usage_by_language: LanguageUsageEntry[];
  daily_breakdown: LanguageDailyUsage[];
}

export interface LanguageUsageEntry {
  language: string;
  percentage: number;
  requests: number;
}

export interface LanguageDailyUsage {
  language: string;
  percentage: number;
}

// Code generation metrics
export interface CodeGeneration {
  total_lines_changed: number;
  agent_contribution_percentage: number;
  average_lines_deleted_by_agent: number;
  daily_lines: DailyCodeLines;
  user_initiated_changes: UserInitiatedCodeChanges;
  agent_initiated_changes: AgentInitiatedCodeChanges;
}

export interface DailyCodeLines {
  added: number;
  deleted: number;
}

export interface UserInitiatedCodeChanges {
  by_mode: CodeChangeByMode[];
  by_model: CodeChangeByModel[];
  by_language: CodeChangeByLanguage[];
}

export interface AgentInitiatedCodeChanges {
  total_added: number;
  total_deleted: number;
  by_model: AgentCodeChangeByModel[];
  by_language: AgentCodeChangeByLanguage[];
}

export interface CodeChangeByMode {
  mode: string;
  suggested: number;
  added: number;
}

export interface CodeChangeByModel {
  model: AIModel;
  suggested: number;
  added: number;
}

export interface CodeChangeByLanguage {
  language: string;
  suggested: number;
  added: number;
}

export interface AgentCodeChangeByModel {
  model: AIModel;
  added: number;
  deleted: number;
}

export interface AgentCodeChangeByLanguage {
  language: string;
  added: number;
  deleted: number;
}

export interface IdeCodeCompletions {
  total_engaged_users: number;
  total_suggestions: number;
  total_acceptances: number;
  acceptance_rate: number;
  languages: IdeCodeCompletionLanguage[];
  editors: IdeCodeCompletionEditor[];
}

export interface IdeCodeCompletionLanguage {
  name: string;
  total_engaged_users: number;
}

export interface IdeCodeCompletionEditor {
  name: string;
  total_engaged_users: number;
  models: IdeCodeCompletionModel[];
}

export interface IdeCodeCompletionModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users: number;
  languages: IdeCodeCompletionModelLanguage[];
}

export interface IdeCodeCompletionModelLanguage {
  name: string;
  total_engaged_users: number;
  total_code_suggestions: number;
  total_code_acceptances: number;
  total_code_lines_suggested: number;
  total_code_lines_accepted: number;
}

export interface IdeChat {
  total_engaged_users: number;
  editors: IdeChatEditor[];
}

export interface IdeChatEditor {
  name: string;
  total_engaged_users: number;
  models: IdeChatModel[];
}

export interface IdeChatModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users: number;
  total_chats: number;
  total_chat_insertion_events: number;
  total_chat_copy_events: number;
}

export interface DotcomChat {
  total_engaged_users: number;
  models: DotcomChatModel[];
}

export interface DotcomChatModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users: number;
  total_chats: number;
}

export interface DotcomPullRequests {
  total_engaged_users: number;
  repositories: DotcomPullRequestRepository[];
}

export interface DotcomPullRequestRepository {
  name: string;
  total_engaged_users: number;
  models: DotcomPullRequestModel[];
}

export interface DotcomPullRequestModel {
  name: string;
  is_custom_model: boolean;
  custom_model_training_date: string | null;
  total_engaged_users: number;
  total_pr_summaries_created: number;
}

export interface CopilotSeats {
  id: string;
  date: string;
  total_seats: number;
  seats: Seat[];
  enterprise: string | null;
  organization: string | null;
  page: number;
  has_next_page: boolean;
  last_update: string;
}

export interface Seat {
  created_at: string;
  updated_at: string;
  pending_cancellation_date: string | null;
  last_activity_at: string | null;
  last_activity_editor: string | null;
  plan_type: string;
  assignee: GitHubUser;
  assigning_team: GitHubTeam | null;
  organization: GitHubOrganization;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface GitHubTeam {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  privacy: string;
  html_url: string;
}

export interface GitHubOrganization {
  login: string;
  id: number;
  avatar_url: string;
  description: string | null;
}

// Summary types for processed data
export interface CopilotUsageSummary {
  ideActiveUsers: number;
  agentAdoptionPercentage: number;
  agentActiveUsers: number;
  mostUsedChatModel: AIModel;
}

export interface CodeGenerationSummary {
  totalLinesChanged: number;
  agentContributionPercentage: number;
  averageLinesDeletedByAgent: number;
}
