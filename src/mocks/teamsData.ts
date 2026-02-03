import { Team, Seat, SeatsData } from '@/types/teams';
import { format, subDays } from 'date-fns';

// Mock teams data
export const mockTeams: Team[] = [
  {
    id: 79113,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/79113',
    totalSeats: 4,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_user_ca',
    name: 'STE_GHC_USER_CA',
    slug: 'ste_ghc_user_ca',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/79113/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
  {
    id: 79114,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/79114',
    totalSeats: 1,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_user_da',
    name: 'STE_GHC_USER_DA',
    slug: 'ste_ghc_user_da',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/79114/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
  {
    id: 79115,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/79115',
    totalSeats: 2,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_digital_infra',
    name: 'STE_GHC_DIGITAL_INFRA',
    slug: 'ste_ghc_digital_infra',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/79115/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
  {
    id: 79116,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/79116',
    totalSeats: 3,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_admin',
    name: 'STE_GHC_ADMIN',
    slug: 'ste_ghc_admin',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/79116/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
  {
    id: 79117,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/79117',
    totalSeats: 16,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_user_digitalops',
    name: 'STE_GHC_USER_DIGITALOPS',
    slug: 'ste_ghc_user_digitalops',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/79117/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
  {
    id: 79118,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/79118',
    totalSeats: 41,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_user_digitalsap',
    name: 'STE_GHC_USER_DIGITALSAP',
    slug: 'ste_ghc_user_digitalsap',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/79118/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
  {
    id: 79119,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/79119',
    totalSeats: 4,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_user_digitalcoe',
    name: 'STE_GHC_USER_DIGITALCOE',
    slug: 'ste_ghc_user_digitalcoe',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/79119/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
  {
    id: 79120,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/79120',
    totalSeats: 2,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_user_stena',
    name: 'STE_GHC_USER_STENA',
    slug: 'ste_ghc_user_stena',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/79120/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
  {
    id: 79121,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/79121',
    totalSeats: 13,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_user_ci',
    name: 'STE_GHC_USER_CI',
    slug: 'ste_ghc_user_ci',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/79121/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
  {
    id: 78626,
    nodeId: '',
    url: 'https://api.github.com/enterprises/stengg/teams/78626',
    totalSeats: 58,
    htmlUrl: 'https://github.com/enterprises/stengg/teams/ste_ghc_user_vcc',
    name: 'STE_GHC_USER_VCC',
    slug: 'ste_ghc_user_vcc',
    description: '',
    privacy: '',
    notificationSetting: '',
    permission: '',
    membersUrl: 'https://api.github.com/enterprises/stengg/teams/78626/memberships{/member}',
    repositoriesUrl: '',
    parent: '{}',
  },
];

// Helper to generate random date
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

// Generate mock seats data
function generateMockSeats(): Seat[] {
  const teamNames = mockTeams.map(t => t.name);
  const editors = [
    'unknown/GitHubCopilotChat/0.36.2',
    'VisualStudio/18.2.1/copilot-vs/18.0.988.22099',
    'Eclipse/4.37.0.v20250905-0730/copilot-eclipse/1.2.3',
    'vscode/1.85.0/copilot/1.143.0',
    'JetBrains-IU/2024.2/copilot-intellij/1.5.6',
    'neovim/0.9.4/copilot.vim/1.21.0',
    null,
  ];

  const users = [
    { login: 'ngocanhthu-thach_stengg', name: 'Thu Thach', email: 'ngocanhthu.thach@stengg.com' },
    { login: 'quocdat-hoang_stengg', name: 'Dat Hoang', email: 'quocdat.hoang@stengg.com' },
    { login: 'chitho-le_stengg', name: 'Tho Le', email: 'chitho.le@stengg.com' },
    { login: 'panglm_stengg', name: 'LM Pang', email: 'panglm@stengg.com' },
    { login: 'john-doe_stengg', name: 'John Doe', email: 'john.doe@stengg.com' },
    { login: 'jane-smith_stengg', name: 'Jane Smith', email: 'jane.smith@stengg.com' },
    { login: 'mike-wilson_stengg', name: 'Mike Wilson', email: 'mike.wilson@stengg.com' },
    { login: 'sarah-chen_stengg', name: 'Sarah Chen', email: 'sarah.chen@stengg.com' },
    { login: 'david-lee_stengg', name: 'David Lee', email: 'david.lee@stengg.com' },
    { login: 'emma-wong_stengg', name: 'Emma Wong', email: 'emma.wong@stengg.com' },
    { login: 'alex-tan_stengg', name: 'Alex Tan', email: 'alex.tan@stengg.com' },
    { login: 'lisa-ng_stengg', name: 'Lisa Ng', email: 'lisa.ng@stengg.com' },
    { login: 'tom-lim_stengg', name: 'Tom Lim', email: 'tom.lim@stengg.com' },
    { login: 'amy-koh_stengg', name: 'Amy Koh', email: 'amy.koh@stengg.com' },
    { login: 'peter-ong_stengg', name: 'Peter Ong', email: 'peter.ong@stengg.com' },
    { login: 'kevin-goh_stengg', name: 'Kevin Goh', email: 'kevin.goh@stengg.com' },
    { login: 'rachel-teo_stengg', name: 'Rachel Teo', email: 'rachel.teo@stengg.com' },
    { login: 'daniel-sim_stengg', name: 'Daniel Sim', email: 'daniel.sim@stengg.com' },
    { login: 'grace-lim_stengg', name: 'Grace Lim', email: 'grace.lim@stengg.com' },
    { login: 'james-low_stengg', name: 'James Low', email: 'james.low@stengg.com' },
  ];

  const seats: Seat[] = [];
  const now = new Date();
  const oneYearAgo = subDays(now, 365);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const teamIndex = i % teamNames.length;
    const team = mockTeams[teamIndex];
    const hasActivity = Math.random() > 0.3;

    seats.push({
      id: `seat-${i + 1}`,
      createdAt: randomDate(oneYearAgo, subDays(now, 30)),
      updatedAt: randomDate(subDays(now, 30), now),
      pendingCancellationDate: '',
      lastActivityAt: hasActivity ? randomDate(subDays(now, 60), now) : null,
      lastActivityEditor: hasActivity ? editors[Math.floor(Math.random() * editors.length)] : null,
      planType: 'business',
      isDeleted: false,
      user: {
        id: 220105807 + i,
        login: user.login,
        name: user.name,
        nodeId: `U_kgDODR6MT${i}`,
        avatarUrl: `https://avatars.githubusercontent.com/u/${220105807 + i}?v=4`,
        url: `https://api.github.com/users/${user.login}`,
        htmlUrl: `https://github.com/${user.login}`,
        type: 'User',
        siteAdmin: false,
      },
      team: {
        id: team.id,
        nodeId: '',
        name: team.name,
        slug: team.slug,
        description: '',
        privacy: '',
        permission: '',
      },
      organization: null,
    });
  }

  return seats;
}

export const mockSeatsData: SeatsData = {
  id: 'stengg',
  date: format(new Date(), 'yyyy-MM-dd'),
  totalSeats: 144,
  enterprise: 'stengg',
  organization: '',
  lastUpdate: new Date().toISOString(),
  seats: generateMockSeats(),
};

export function fetchMockTeams(): Promise<Team[]> {
  return Promise.resolve(mockTeams);
}

export function fetchMockSeats(): Promise<SeatsData> {
  return Promise.resolve(mockSeatsData);
}
