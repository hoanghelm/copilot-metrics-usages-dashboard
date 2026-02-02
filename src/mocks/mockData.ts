import { CopilotMetrics, CopilotSeats } from '@/types/copilot';
import { format, subDays } from 'date-fns';

const LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'Go',
  'C#',
  'Ruby',
  'PHP',
  'Rust',
  'Swift',
];

const EDITORS = ['vscode', 'jetbrains', 'neovim', 'vim', 'emacs'];

const MODELS = ['default', 'gpt-4'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDailyMetrics(date: Date): CopilotMetrics {
  const dateStr = format(date, 'yyyy-MM-dd');
  const totalActiveUsers = randomInt(100, 500);
  const totalEngagedUsers = Math.floor(totalActiveUsers * 0.9);

  const languages = LANGUAGES.map((name) => ({
    name,
    total_engaged_users: randomInt(10, 100),
    total_code_suggestions: randomInt(500, 5000),
    total_code_acceptances: randomInt(200, 3000),
    total_code_lines_suggested: randomInt(1000, 10000),
    total_code_lines_accepted: randomInt(400, 6000),
  }));

  const editors = EDITORS.map((name) => ({
    name,
    total_engaged_users: randomInt(20, 150),
    models: MODELS.map((modelName) => ({
      name: modelName,
      is_custom_model: modelName !== 'default',
      custom_model_training_date: null,
      total_engaged_users: randomInt(10, 100),
      languages: languages.map((lang) => ({
        name: lang.name,
        total_engaged_users: randomInt(5, 50),
        total_code_suggestions: randomInt(100, 1000),
        total_code_acceptances: randomInt(50, 700),
        total_code_lines_suggested: randomInt(200, 2000),
        total_code_lines_accepted: randomInt(100, 1200),
      })),
    })),
  }));

  const chatEditors = EDITORS.slice(0, 3).map((name) => ({
    name,
    total_engaged_users: randomInt(10, 80),
    models: MODELS.map((modelName) => ({
      name: modelName,
      is_custom_model: modelName !== 'default',
      custom_model_training_date: null,
      total_engaged_users: randomInt(5, 50),
      total_chats: randomInt(50, 500),
      total_chat_insertion_events: randomInt(20, 200),
      total_chat_copy_events: randomInt(10, 100),
    })),
  }));

  return {
    id: `metrics-${dateStr}`,
    date: dateStr,
    total_active_users: totalActiveUsers,
    total_engaged_users: totalEngagedUsers,
    copilot_ide_code_completions: {
      total_engaged_users: Math.floor(totalEngagedUsers * 0.95),
      languages: LANGUAGES.map((name) => ({
        name,
        total_engaged_users: randomInt(10, 100),
      })),
      editors,
    },
    copilot_ide_chat: {
      total_engaged_users: Math.floor(totalEngagedUsers * 0.6),
      editors: chatEditors,
    },
    copilot_dotcom_chat: {
      total_engaged_users: randomInt(20, 100),
      models: MODELS.map((name) => ({
        name,
        is_custom_model: name !== 'default',
        custom_model_training_date: null,
        total_engaged_users: randomInt(10, 50),
        total_chats: randomInt(30, 300),
      })),
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: randomInt(10, 50),
      repositories: [
        {
          name: 'main-app',
          total_engaged_users: randomInt(5, 30),
          models: MODELS.map((name) => ({
            name,
            is_custom_model: name !== 'default',
            custom_model_training_date: null,
            total_engaged_users: randomInt(3, 20),
            total_pr_summaries_created: randomInt(5, 50),
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

export function generateMockMetrics(days: number = 30): CopilotMetrics[] {
  const metrics: CopilotMetrics[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    metrics.push(generateDailyMetrics(date));
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
