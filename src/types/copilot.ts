export interface CopilotMetrics {
  id: string;
  date: string;
  total_active_users: number;
  total_engaged_users: number;
  copilot_ide_code_completions: IdeCodeCompletions | null;
  copilot_ide_chat: IdeChat | null;
  copilot_dotcom_chat: DotcomChat | null;
  copilot_dotcom_pull_requests: DotcomPullRequests | null;
  enterprise: string | null;
  organization: string | null;
  team: string | null;
  last_update: string;
}

export interface IdeCodeCompletions {
  total_engaged_users: number;
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
