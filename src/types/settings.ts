// Configuration/Copilot Source types
export interface CopilotSource {
  id: string;
  name: string;
  tenantName: string;
  scope: 'enterprise' | 'organization';
  token: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  domainEvent: unknown[];
  metrics: unknown[];
  assignedSeats: unknown[];
  usage: unknown[];
}

export interface ConfigurationResponse {
  success: boolean;
  result: CopilotSource[];
  errorCode: string | null;
  errorMessage: string | null;
}

// Domain Event types
export type DomainEventState = 'Executing' | 'Success' | 'Fail';
export type DomainEventType = 'seats' | 'usages' | 'metrics';

export interface DomainEventSource {
  id: string;
  name: string;
  tenantName: string;
  scope: string;
}

export interface DomainEvent {
  id: string;
  name: string;
  eventType: DomainEventType;
  payload: string;
  state: DomainEventState;
  errorMessage: string;
  createdAt: string;
  createdBy: string;
  domainEventExecutionLogs: unknown[];
  sourceId: string;
  source: DomainEventSource;
}

export interface DomainEventsResponse {
  success: boolean;
  result: {
    size: number;
    page: number;
    total: number;
    items: DomainEvent[];
  };
  errorCode: string | null;
  errorMessage: string | null;
}
