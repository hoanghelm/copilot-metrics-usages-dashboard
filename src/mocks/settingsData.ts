import { CopilotSource, DomainEvent, DomainEventState, DomainEventType } from '@/types/settings';
import { format, subDays, subHours } from 'date-fns';

// Mock Copilot Sources
export const mockCopilotSources: CopilotSource[] = [
  {
    id: '0c70ff8a-f982-4d8f-9861-99ae7a3c64be',
    name: 'N1',
    tenantName: 'stengg',
    scope: 'enterprise',
    token: '',
    isActive: true,
    createdAt: '2025-10-02T08:22:01.327559Z',
    createdBy: 'system',
    updatedAt: '2025-10-02T08:22:01.327591Z',
    updatedBy: '',
    domainEvent: [],
    metrics: [],
    assignedSeats: [],
    usage: [],
  },
];

// Sample payloads for different event types
function generatePayload(eventType: DomainEventType, eventName: string): string {
  if (eventType === 'seats') {
    return JSON.stringify({
      enterprise: "stengg",
      date: eventName.split('-ENT-')[0],
      totalSeats: 144,
      seats: [
        {
          login: "john-doe_stengg",
          createdAt: "2025-06-15T10:30:00Z",
          lastActivityAt: "2026-02-01T14:22:00Z",
          lastActivityEditor: "vscode/1.85.0/copilot/1.143.0"
        },
        {
          login: "jane-smith_stengg",
          createdAt: "2025-07-20T08:15:00Z",
          lastActivityAt: "2026-02-02T09:45:00Z",
          lastActivityEditor: "JetBrains-IU/2024.2/copilot-intellij/1.5.6"
        }
      ]
    }, null, 2);
  } else if (eventType === 'usages') {
    return JSON.stringify({
      enterprise: "stengg",
      date: eventName,
      totalSuggestions: 15420,
      totalAcceptances: 8956,
      acceptanceRate: 58.1,
      breakdown: {
        ide: {
          vscode: { suggestions: 8500, acceptances: 5200 },
          jetbrains: { suggestions: 4200, acceptances: 2400 },
          visualstudio: { suggestions: 2720, acceptances: 1356 }
        }
      }
    }, null, 2);
  } else {
    return JSON.stringify({
      enterprise: "stengg",
      team: eventName.split('-ENT-stengg-')[1] || "unknown",
      period: "2026-02-01",
      metrics: {
        totalLines: 45230,
        acceptedLines: 28450,
        activeUsers: 12,
        chatRequests: 856,
        agentActions: 234
      },
      languages: [
        { name: "TypeScript", lines: 18500 },
        { name: "Python", lines: 12300 },
        { name: "Java", lines: 8900 },
        { name: "Go", lines: 5530 }
      ]
    }, null, 2);
  }
}

// Generate mock domain events
function generateMockDomainEvents(): DomainEvent[] {
  const events: DomainEvent[] = [];
  const eventTypes: DomainEventType[] = ['seats', 'usages', 'metrics'];
  const states: DomainEventState[] = ['Executing', 'Success', 'Fail'];
  const teams = [
    'ste_ghc_user_digitalops',
    'ste_ghc_user_vcc',
    'ste_ghc_user_digitalsap',
    'ste_ghc_user_ci',
    'ste_ghc_admin',
  ];

  const now = new Date();

  // Generate events for the last 30 days
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(i / 3);
    const eventDate = subDays(now, daysAgo);
    const eventType = eventTypes[i % eventTypes.length];
    const state = i < 3 ? states[i % 2] : states[Math.floor(Math.random() * 3)];

    let eventName = '';
    if (eventType === 'seats') {
      eventName = `${format(eventDate, 'yyyy-MM-d')}-ENT-stengg`;
    } else if (eventType === 'usages') {
      eventName = format(eventDate, 'yyyy-MM-dd');
    } else {
      const team = teams[Math.floor(Math.random() * teams.length)];
      eventName = `${format(eventDate, 'yyyy-MM-d')}-ENT-stengg-${team}`;
    }

    const payload = generatePayload(eventType, eventName);

    events.push({
      id: `event-${i + 1}`,
      name: eventName,
      eventType,
      payload,
      state,
      errorMessage: state === 'Fail' ? 'Connection timeout: Failed to connect to GitHub API after 3 retries. Please check network connectivity and API credentials.' : '',
      createdAt: subHours(eventDate, Math.floor(Math.random() * 12)).toISOString(),
      createdBy: 'system',
      domainEventExecutionLogs: [],
      sourceId: '0c70ff8a-f982-4d8f-9861-99ae7a3c64be',
      source: {
        id: '0c70ff8a-f982-4d8f-9861-99ae7a3c64be',
        name: 'N1',
        tenantName: 'stengg',
        scope: 'enterprise',
      },
    });
  }

  return events;
}

export const mockDomainEvents = generateMockDomainEvents();

export function fetchMockCopilotSources(): Promise<CopilotSource[]> {
  return Promise.resolve(mockCopilotSources);
}

export function fetchMockDomainEvents(page: number = 1, size: number = 10) {
  const start = (page - 1) * size;
  const items = mockDomainEvents.slice(start, start + size);

  return Promise.resolve({
    size,
    page,
    total: mockDomainEvents.length,
    items,
  });
}

export function updateDomainEventState(id: string, state: DomainEventState): Promise<DomainEvent | null> {
  const event = mockDomainEvents.find(e => e.id === id);
  if (event) {
    event.state = state;
    return Promise.resolve(event);
  }
  return Promise.resolve(null);
}
