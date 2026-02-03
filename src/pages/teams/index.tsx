import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Heading, TextInput, ActionMenu, ActionList, Pagination, Link } from '@primer/react';
import { SearchIcon, SortAscIcon, SortDescIcon } from '@primer/octicons-react';
import { mockTeams } from '@/mocks/teamsData';

type SortField = 'name' | 'totalSeats';
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 10;

export function TeamsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSeatsClick = (teamName: string) => {
    navigate(`/insights/seats?team=${encodeURIComponent(teamName)}`);
  };

  // Get unique team names for filter dropdown
  const teamNames = useMemo(() => {
    return mockTeams.map(t => t.name).sort();
  }, []);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...mockTeams];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(team =>
        team.name.toLowerCase().includes(query)
      );
    }

    // Filter by selected team
    if (selectedTeam) {
      result = result.filter(team => team.name === selectedTeam);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'totalSeats') {
        comparison = a.totalSeats - b.totalSeats;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, selectedTeam, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / PAGE_SIZE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedData, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAscIcon size={12} /> : <SortDescIcon size={12} />;
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Heading as="h1" sx={{ fontSize: 3, fontWeight: 600, mb: 1 }}>
          Teams
        </Heading>
        <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
          Manage GitHub Copilot teams and seat allocation
        </Text>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 4,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <TextInput
            leadingVisual={SearchIcon}
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            sx={{ width: '100%' }}
          />
        </Box>
        <ActionMenu>
          <ActionMenu.Button>
            {selectedTeam || 'Select Team'}
          </ActionMenu.Button>
          <ActionMenu.Overlay width="medium">
            <ActionList selectionVariant="single">
              <ActionList.Item
                selected={!selectedTeam}
                onSelect={() => {
                  setSelectedTeam('');
                  setCurrentPage(1);
                }}
              >
                All Teams
              </ActionList.Item>
              <ActionList.Divider />
              {teamNames.map((name) => (
                <ActionList.Item
                  key={name}
                  selected={selectedTeam === name}
                  onSelect={() => {
                    setSelectedTeam(name);
                    setCurrentPage(1);
                  }}
                >
                  {name}
                </ActionList.Item>
              ))}
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Box>

      {/* Table */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'border.default',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 150px',
            bg: 'canvas.subtle',
            borderBottom: '1px solid',
            borderColor: 'border.default',
          }}
        >
          <Box
            onClick={() => handleSort('name')}
            sx={{
              p: 3,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { bg: 'canvas.inset' },
            }}
          >
            <Text sx={{ fontWeight: 600, color: 'accent.fg' }}>Team Name</Text>
            <SortIcon field="name" />
          </Box>
          <Box
            onClick={() => handleSort('totalSeats')}
            sx={{
              p: 3,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { bg: 'canvas.inset' },
            }}
          >
            <Text sx={{ fontWeight: 600, color: 'accent.fg' }}>Total Seats</Text>
            <SortIcon field="totalSeats" />
          </Box>
        </Box>

        {/* Table Body */}
        {paginatedData.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Text sx={{ color: 'fg.muted' }}>No teams found</Text>
          </Box>
        ) : (
          paginatedData.map((team, index) => (
            <Box
              key={team.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 150px',
                borderBottom: index < paginatedData.length - 1 ? '1px solid' : 'none',
                borderColor: 'border.default',
                '&:hover': { bg: 'canvas.subtle' },
              }}
            >
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.default' }}>{team.name}</Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Link
                  as="button"
                  onClick={() => handleSeatsClick(team.name)}
                  sx={{ color: 'accent.fg', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  {team.totalSeats}
                </Link>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={(_, page) => setCurrentPage(page)}
          />
        </Box>
      )}

      {/* Summary */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Text sx={{ color: 'fg.muted', fontSize: 0 }}>
          Showing {paginatedData.length} of {filteredAndSortedData.length} teams
        </Text>
      </Box>
    </Box>
  );
}
