import { CopilotMetrics, CopilotSeats } from '@/types/copilot';
import { DateRange } from '@/pages/insights/types';
import { format } from 'date-fns';
import { mockFetchMetrics, mockFetchSeats } from '@/mocks/handlers';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface FetchMetricsParams {
  startDate: Date;
  endDate: Date;
  enterprise?: string;
  organization?: string;
  team?: string;
}

export async function fetchCopilotMetrics(
  params: FetchMetricsParams
): Promise<CopilotMetrics[]> {
  if (USE_MOCK) {
    return mockFetchMetrics(params);
  }

  const searchParams = new URLSearchParams({
    startDate: format(params.startDate, 'yyyy-MM-dd'),
    endDate: format(params.endDate, 'yyyy-MM-dd'),
  });

  if (params.enterprise) {
    searchParams.append('enterprise', params.enterprise);
  }
  if (params.organization) {
    searchParams.append('organization', params.organization);
  }
  if (params.team) {
    searchParams.append('team', params.team);
  }

  const response = await fetch(
    `${API_BASE_URL}/copilot/metrics?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch metrics: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchCopilotSeats(params: {
  enterprise?: string;
  organization?: string;
}): Promise<CopilotSeats> {
  if (USE_MOCK) {
    return mockFetchSeats();
  }

  const searchParams = new URLSearchParams();

  if (params.enterprise) {
    searchParams.append('enterprise', params.enterprise);
  }
  if (params.organization) {
    searchParams.append('organization', params.organization);
  }

  const response = await fetch(
    `${API_BASE_URL}/copilot/seats?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch seats: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAvailableLanguages(): Promise<string[]> {
  if (USE_MOCK) {
    return [
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
  }

  const response = await fetch(`${API_BASE_URL}/copilot/languages`);

  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAvailableEditors(): Promise<string[]> {
  if (USE_MOCK) {
    return ['vscode', 'jetbrains', 'neovim', 'vim', 'emacs'];
  }

  const response = await fetch(`${API_BASE_URL}/copilot/editors`);

  if (!response.ok) {
    throw new Error(`Failed to fetch editors: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchMetricsByDateRange(
  dateRange: DateRange
): Promise<CopilotMetrics[]> {
  return fetchCopilotMetrics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });
}
