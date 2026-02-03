// Team API response types
export interface Team {
  id: number;
  nodeId: string;
  url: string;
  totalSeats: number;
  htmlUrl: string;
  name: string;
  slug: string;
  description: string;
  privacy: string;
  notificationSetting: string;
  permission: string;
  membersUrl: string;
  repositoriesUrl: string;
  parent: string;
}

export interface TeamsApiResponse {
  success: boolean;
  result: Team[];
}

// Seat API response types
export interface SeatUser {
  id: number;
  login: string;
  name: string;
  nodeId: string;
  avatarUrl: string;
  url: string;
  htmlUrl: string;
  type: string;
  siteAdmin: boolean;
}

export interface SeatTeam {
  id: number;
  nodeId: string;
  name: string;
  slug: string;
  description: string;
  privacy: string;
  permission: string;
}

export interface Seat {
  id: string;
  createdAt: string;
  updatedAt: string;
  pendingCancellationDate: string;
  lastActivityAt: string | null;
  lastActivityEditor: string | null;
  planType: string;
  isDeleted: boolean;
  user: SeatUser;
  team: SeatTeam | null;
  organization: string | null;
}

export interface SeatsData {
  id: string;
  date: string;
  totalSeats: number;
  enterprise: string;
  organization: string;
  lastUpdate: string;
  seats: Seat[];
}

export interface SeatsApiResponse {
  success: boolean;
  result: SeatsData[];
}
