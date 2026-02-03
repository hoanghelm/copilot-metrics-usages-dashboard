import {
  CopilotMetrics,
  CopilotSeats,
  ChatMode,
  AIModel,
  ChatModeRequest,
  ModelUsageEntry,
  LanguageUsageEntry,
  CodeChangeByMode,
  CodeChangeByModel,
  CodeChangeByLanguage,
  AgentCodeChangeByModel,
  AgentCodeChangeByLanguage,
} from '@/types/copilot';
import { format, subDays } from 'date-fns';

const LANGUAGES = ['csharp', 'TSX', 'Java', 'Python', 'SQL', 'vb', 'Visual Basic .NET', 'Other languages'];

const EDITORS = ['VS Code', 'JetBrains', 'Visual Studio', 'Neovim'];

const CHAT_MODES: ChatMode[] = ['Edit', 'Ask', 'Agent', 'Custom', 'Inline'];

const AI_MODELS: AIModel[] = [
  'Claude Sonnet 4.5',
  'GPT-4.1',
  'Claude Haiku 4.5',
  'GPT-5.2',
  'Gemini 3.0 Pro',
  'Other models',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

// Generate chat mode requests (Edit dominates, then Ask, Agent, Custom, Inline)
function generateChatModeRequests(totalRequests: number): ChatModeRequest[] {
  const editPct = randomFloat(0.35, 0.45);
  const askPct = randomFloat(0.25, 0.35);
  const agentPct = randomFloat(0.15, 0.25);
  const customPct = randomFloat(0.05, 0.10);
  const inlinePct = 1 - editPct - askPct - agentPct - customPct;

  return [
    { mode: 'Edit', requests: Math.floor(totalRequests * editPct) },
    { mode: 'Ask', requests: Math.floor(totalRequests * askPct) },
    { mode: 'Agent', requests: Math.floor(totalRequests * agentPct) },
    { mode: 'Custom', requests: Math.floor(totalRequests * customPct) },
    { mode: 'Inline', requests: Math.floor(totalRequests * Math.max(0, inlinePct)) },
  ];
}

// Generate model usage (Claude Sonnet 4.5 dominates based on screenshots)
function generateModelUsage(totalRequests: number): ModelUsageEntry[] {
  return [
    { model: 'Claude Sonnet 4.5', percentage: randomFloat(70, 75), requests: Math.floor(totalRequests * 0.73) },
    { model: 'Claude Haiku 4.5', percentage: randomFloat(8, 12), requests: Math.floor(totalRequests * 0.10) },
    { model: 'GPT-4.1', percentage: randomFloat(4, 6), requests: Math.floor(totalRequests * 0.05) },
    { model: 'GPT-5.2', percentage: randomFloat(5, 7), requests: Math.floor(totalRequests * 0.06) },
    { model: 'Other models', percentage: randomFloat(4, 6), requests: Math.floor(totalRequests * 0.05) },
  ];
}

// Generate language usage (csharp dominates based on screenshots)
function generateLanguageUsage(totalRequests: number): LanguageUsageEntry[] {
  return [
    { language: 'csharp', percentage: randomFloat(22, 25), requests: Math.floor(totalRequests * 0.23) },
    { language: 'TSX', percentage: randomFloat(7, 9), requests: Math.floor(totalRequests * 0.08) },
    { language: 'Java', percentage: randomFloat(7, 9), requests: Math.floor(totalRequests * 0.08) },
    { language: 'Python', percentage: randomFloat(6, 8), requests: Math.floor(totalRequests * 0.07) },
    { language: 'Other languages', percentage: randomFloat(50, 55), requests: Math.floor(totalRequests * 0.54) },
  ];
}

// Generate code changes by mode
function generateCodeChangesByMode(): CodeChangeByMode[] {
  return [
    { mode: 'Completions', suggested: randomInt(5000, 10000), added: randomInt(2000, 5000) },
    { mode: 'Ask', suggested: randomInt(35000, 50000), added: randomInt(10000, 20000) },
    { mode: 'Inline', suggested: randomInt(500, 2000), added: randomInt(200, 1000) },
    { mode: 'Edit', suggested: randomInt(2000, 5000), added: randomInt(1000, 3000) },
    { mode: 'Agent', suggested: randomInt(25000, 40000), added: randomInt(5000, 15000) },
    { mode: 'Custom', suggested: randomInt(2000, 5000), added: randomInt(1000, 3000) },
  ];
}

// Generate code changes by model
function generateCodeChangesByModel(): CodeChangeByModel[] {
  return [
    { model: 'Claude Sonnet 4.5', suggested: randomInt(45000, 60000), added: randomInt(5000, 10000) },
    { model: 'GPT-4.1', suggested: randomInt(10000, 15000), added: randomInt(3000, 7000) },
    { model: 'Claude Haiku 4.5', suggested: randomInt(8000, 12000), added: randomInt(2000, 5000) },
    { model: 'Gemini 3.0 Pro', suggested: randomInt(5000, 8000), added: randomInt(1500, 4000) },
    { model: 'Other models', suggested: randomInt(3000, 5000), added: randomInt(1000, 3000) },
  ];
}

// Generate code changes by language
function generateCodeChangesByLanguage(): CodeChangeByLanguage[] {
  return [
    { language: 'SQL', suggested: randomInt(12000, 18000), added: randomInt(3000, 6000) },
    { language: 'csharp', suggested: randomInt(12000, 18000), added: randomInt(4000, 8000) },
    { language: 'Visual Basic .NET', suggested: randomInt(6000, 10000), added: randomInt(2000, 4000) },
    { language: 'vb', suggested: randomInt(8000, 12000), added: randomInt(3000, 6000) },
    { language: 'Other languages', suggested: randomInt(40000, 55000), added: randomInt(10000, 15000) },
  ];
}

// Generate agent code changes by model
function generateAgentCodeChangesByModel(): AgentCodeChangeByModel[] {
  return [
    { model: 'Claude Sonnet 4.5', added: randomInt(90000, 120000), deleted: randomInt(15000, 25000) },
    { model: 'Claude Haiku 4.5', added: randomInt(8000, 15000), deleted: randomInt(2000, 5000) },
    { model: 'GPT-5.2', added: randomInt(5000, 10000), deleted: randomInt(1000, 3000) },
    { model: 'Gemini 3.0 Pro', added: randomInt(3000, 6000), deleted: randomInt(800, 2000) },
    { model: 'Other models', added: randomInt(2000, 4000), deleted: randomInt(500, 1500) },
  ];
}

// Generate agent code changes by language
function generateAgentCodeChangesByLanguage(): AgentCodeChangeByLanguage[] {
  return [
    { language: 'Java', added: randomInt(50000, 70000), deleted: randomInt(10000, 18000) },
    { language: 'Visual Basic .NET', added: randomInt(5000, 12000), deleted: randomInt(2000, 5000) },
    { language: 'csharp', added: randomInt(8000, 15000), deleted: randomInt(3000, 6000) },
    { language: 'vb', added: randomInt(15000, 25000), deleted: randomInt(5000, 10000) },
    { language: 'Other languages', added: randomInt(30000, 50000), deleted: randomInt(10000, 18000) },
  ];
}

function generateDailyMetrics(date: Date, _dayIndex: number): CopilotMetrics {
  const dateStr = format(date, 'yyyy-MM-dd');

  // Base values that vary realistically over time
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const activityMultiplier = isWeekend ? 0.3 : 1;

  const totalActiveUsers = Math.floor(randomInt(30, 45) * activityMultiplier) || randomInt(15, 25);
  const totalEngagedUsers = Math.floor(totalActiveUsers * 0.9);

  // IDE active users (4 as shown in screenshot for monthly)
  const dailyActiveUsers = Math.floor(randomInt(25, 40) * activityMultiplier) || randomInt(10, 20);
  const weeklyActiveUsers = randomInt(40, 60);

  // Agent adoption (25% as shown in screenshot)
  const agentActiveUsers = Math.floor(totalActiveUsers * randomFloat(0.2, 0.3));
  const agentAdoptionPercentage = totalActiveUsers > 0
    ? Math.round((agentActiveUsers / totalActiveUsers) * 100)
    : 0;

  // Chat requests
  const totalChatRequests = randomInt(150, 350);
  const avgChatRequestsPerUser = totalActiveUsers > 0
    ? Math.round((totalChatRequests / totalActiveUsers) * 10) / 10
    : 0;

  // Code completions
  const totalSuggestions = randomInt(150, 800);
  const totalAcceptances = Math.floor(totalSuggestions * randomFloat(0.3, 0.6));
  const acceptanceRate = totalSuggestions > 0
    ? Math.round((totalAcceptances / totalSuggestions) * 100)
    : 0;

  const languages = LANGUAGES.map((name) => ({
    name,
    total_engaged_users: randomInt(1, Math.max(2, Math.floor(totalEngagedUsers * 0.3))),
  }));

  const editors = EDITORS.map((name) => ({
    name,
    total_engaged_users: randomInt(1, Math.max(2, Math.floor(totalEngagedUsers * 0.4))),
    models: AI_MODELS.slice(0, 2).map((modelName) => ({
      name: modelName,
      is_custom_model: false,
      custom_model_training_date: null,
      total_engaged_users: randomInt(1, Math.max(2, Math.floor(totalEngagedUsers * 0.2))),
      languages: languages.map((lang) => ({
        name: lang.name,
        total_engaged_users: randomInt(1, Math.max(2, Math.floor(totalEngagedUsers * 0.1))),
        total_code_suggestions: randomInt(50, 500),
        total_code_acceptances: randomInt(20, 300),
        total_code_lines_suggested: randomInt(100, 1000),
        total_code_lines_accepted: randomInt(50, 600),
      })),
    })),
  }));

  const chatEditors = EDITORS.slice(0, 3).map((name) => ({
    name,
    total_engaged_users: randomInt(1, Math.max(2, Math.floor(totalEngagedUsers * 0.3))),
    models: AI_MODELS.slice(0, 3).map((modelName) => ({
      name: modelName,
      is_custom_model: false,
      custom_model_training_date: null,
      total_engaged_users: randomInt(1, Math.max(2, Math.floor(totalEngagedUsers * 0.15))),
      total_chats: randomInt(20, 200),
      total_chat_insertion_events: randomInt(10, 100),
      total_chat_copy_events: randomInt(5, 50),
    })),
  }));

  // Code generation metrics
  const dailyLinesAdded = randomInt(3000, 20000);
  const dailyLinesDeleted = randomInt(1000, 8000);
  const totalLinesChanged = dailyLinesAdded + dailyLinesDeleted;

  // Agent contribution (89.59% as shown in screenshot)
  const agentContribution = randomFloat(85, 92);
  const avgLinesDeletedByAgent = Math.floor(dailyLinesDeleted * agentContribution / 100);

  return {
    id: `metrics-${dateStr}`,
    date: dateStr,
    total_active_users: totalActiveUsers,
    total_engaged_users: totalEngagedUsers,
    daily_active_users: dailyActiveUsers,
    weekly_active_users: weeklyActiveUsers,
    agent_adoption: {
      percentage: agentAdoptionPercentage,
      active_agent_users: agentActiveUsers,
      total_active_users: totalActiveUsers,
    },
    chat_requests: {
      average_per_active_user: avgChatRequestsPerUser,
      total_requests: totalChatRequests,
      requests_by_mode: generateChatModeRequests(totalChatRequests),
    },
    model_usage: {
      most_used_model: 'Claude Sonnet 4.5',
      usage_by_model: generateModelUsage(totalChatRequests),
      usage_by_chat_mode: AI_MODELS.map(model => ({
        model,
        usage_by_mode: CHAT_MODES.map(mode => ({
          mode,
          percentage: randomFloat(5, 70),
        })),
      })),
      usage_by_language: LANGUAGES.map(lang => ({
        language: lang,
        usage_by_model: AI_MODELS.map(model => ({
          model,
          percentage: randomFloat(5, 50),
        })),
      })),
    },
    language_usage: {
      usage_by_language: generateLanguageUsage(totalChatRequests),
      daily_breakdown: LANGUAGES.map(lang => ({
        language: lang,
        percentage: randomFloat(5, 30),
      })),
    },
    code_generation: {
      total_lines_changed: totalLinesChanged,
      agent_contribution_percentage: agentContribution,
      average_lines_deleted_by_agent: avgLinesDeletedByAgent,
      daily_lines: {
        added: dailyLinesAdded,
        deleted: dailyLinesDeleted,
      },
      user_initiated_changes: {
        by_mode: generateCodeChangesByMode(),
        by_model: generateCodeChangesByModel(),
        by_language: generateCodeChangesByLanguage(),
      },
      agent_initiated_changes: {
        total_added: Math.floor(dailyLinesAdded * agentContribution / 100),
        total_deleted: avgLinesDeletedByAgent,
        by_model: generateAgentCodeChangesByModel(),
        by_language: generateAgentCodeChangesByLanguage(),
      },
    },
    copilot_ide_code_completions: {
      total_engaged_users: Math.floor(totalEngagedUsers * 0.95),
      total_suggestions: totalSuggestions,
      total_acceptances: totalAcceptances,
      acceptance_rate: acceptanceRate,
      languages,
      editors,
    },
    copilot_ide_chat: {
      total_engaged_users: Math.floor(totalEngagedUsers * 0.6),
      editors: chatEditors,
    },
    copilot_dotcom_chat: {
      total_engaged_users: randomInt(5, 30),
      models: AI_MODELS.slice(0, 3).map((name) => ({
        name,
        is_custom_model: false,
        custom_model_training_date: null,
        total_engaged_users: randomInt(3, 15),
        total_chats: randomInt(10, 100),
      })),
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: randomInt(2, 15),
      repositories: [
        {
          name: 'main-app',
          total_engaged_users: randomInt(2, 10),
          models: AI_MODELS.slice(0, 2).map((name) => ({
            name,
            is_custom_model: false,
            custom_model_training_date: null,
            total_engaged_users: randomInt(1, 8),
            total_pr_summaries_created: randomInt(2, 20),
          })),
        },
      ],
    },
    enterprise: null,
    organization: 'demo-org',
    team: null,
    last_update: new Date().toISOString(),
  };
}

export function generateMockMetrics(days: number = 28): CopilotMetrics[] {
  const metrics: CopilotMetrics[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    metrics.push(generateDailyMetrics(date, days - 1 - i));
  }

  return metrics;
}

export function generateMockSeats(): CopilotSeats {
  const seats = Array.from({ length: 50 }, (_, i) => ({
    created_at: format(subDays(new Date(), randomInt(30, 365)), 'yyyy-MM-dd'),
    updated_at: format(subDays(new Date(), randomInt(1, 30)), 'yyyy-MM-dd'),
    pending_cancellation_date: null,
    last_activity_at:
      Math.random() > 0.2
        ? format(subDays(new Date(), randomInt(0, 30)), 'yyyy-MM-dd')
        : null,
    last_activity_editor:
      Math.random() > 0.2
        ? EDITORS[randomInt(0, EDITORS.length - 1)]
        : null,
    plan_type: 'business',
    assignee: {
      id: i + 1,
      login: `user${i + 1}`,
      name: `User ${i + 1}`,
      avatar_url: `https://avatars.githubusercontent.com/u/${i + 1}`,
      html_url: `https://github.com/user${i + 1}`,
      type: 'User',
    },
    assigning_team: null,
    organization: {
      login: 'demo-org',
      id: 12345,
      avatar_url: 'https://avatars.githubusercontent.com/u/12345',
      description: 'Demo Organization',
    },
  }));

  return {
    id: 'seats-demo',
    date: format(new Date(), 'yyyy-MM-dd'),
    total_seats: 50,
    seats,
    enterprise: null,
    organization: 'demo-org',
    page: 1,
    has_next_page: false,
    last_update: new Date().toISOString(),
  };
}

// Summary calculation helpers
export function calculateCopilotUsageSummary(metrics: CopilotMetrics[]) {
  if (metrics.length === 0) return null;

  // Get the latest month's data
  const latestMetrics = metrics[metrics.length - 1];

  // Calculate unique active users for the period
  const uniqueActiveUsers = new Set(metrics.map(m => m.total_active_users)).size > 0
    ? Math.max(...metrics.map(m => m.total_active_users))
    : 0;

  // Calculate agent adoption
  const avgAgentAdoption = metrics.reduce((sum, m) => sum + m.agent_adoption.percentage, 0) / metrics.length;
  const totalAgentUsers = metrics.reduce((sum, m) => sum + m.agent_adoption.active_agent_users, 0);

  return {
    ideActiveUsers: uniqueActiveUsers,
    agentAdoptionPercentage: Math.round(avgAgentAdoption),
    agentActiveUsers: Math.round(totalAgentUsers / metrics.length),
    mostUsedChatModel: latestMetrics.model_usage.most_used_model,
  };
}

export function calculateCodeGenerationSummary(metrics: CopilotMetrics[]) {
  if (metrics.length === 0) return null;

  const totalLinesChanged = metrics.reduce((sum, m) => sum + m.code_generation.total_lines_changed, 0);
  const avgAgentContribution = metrics.reduce((sum, m) => sum + m.code_generation.agent_contribution_percentage, 0) / metrics.length;
  const avgLinesDeleted = metrics.reduce((sum, m) => sum + m.code_generation.average_lines_deleted_by_agent, 0) / metrics.length;

  return {
    totalLinesChanged,
    agentContributionPercentage: Math.round(avgAgentContribution * 100) / 100,
    averageLinesDeletedByAgent: Math.round(avgLinesDeleted),
  };
}
