import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Text,
  Heading,
  TextInput,
  ActionMenu,
  ActionList,
  Pagination,
  Button,
  Avatar,
} from '@primer/react';
import { SearchIcon, SortAscIcon, SortDescIcon, DownloadIcon } from '@primer/octicons-react';
import { mockSeatsData, mockTeams } from '@/mocks/teamsData';
import { Seat } from '@/types/teams';
import { format, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

type SortField = 'login' | 'team' | 'createdAt' | 'lastActivityAt' | 'lastActivityEditor';
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 10;

// Format date for display
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy');
  } catch {
    return '-';
  }
}

// Export to Excel with styling
function exportToExcel(data: Seat[]) {
  const exportData = data.map(seat => ({
    'User Login': seat.user.login || '',
    'Email': seat.user.login.replace('_stengg', '@stengg.com') || '',
    'Team': seat.team?.name || '',
    'Created Date': formatDate(seat.createdAt),
    'Last Activity': formatDate(seat.lastActivityAt),
    'Activity Editor': seat.lastActivityEditor || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  const columnWidths = [
    { wch: 40 },
    { wch: 40 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 }
  ];
  worksheet['!cols'] = columnWidths;

  // Header style
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "366092" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'];
  headerCells.forEach(cell => {
    if (worksheet[cell]) {
      worksheet[cell].s = headerStyle;
    }
  });

  // Row styles
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let row = 2; row <= range.e.r + 1; row++) {
    const isEvenRow = row % 2 === 0;
    const rowStyle = {
      fill: { fgColor: { rgb: isEvenRow ? "F8F9FA" : "FFFFFF" } },
      border: {
        top: { style: "thin", color: { rgb: "E9ECEF" } },
        bottom: { style: "thin", color: { rgb: "E9ECEF" } },
        left: { style: "thin", color: { rgb: "E9ECEF" } },
        right: { style: "thin", color: { rgb: "E9ECEF" } }
      },
      alignment: { vertical: "center" }
    };

    for (let col = 0; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row - 1, c: col });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = rowStyle;
      }
    }
  }

  // Center align date columns
  for (let row = 2; row <= range.e.r + 1; row++) {
    const createdDateCell = `D${row}`;
    const lastActivityCell = `E${row}`;

    if (worksheet[createdDateCell]) {
      worksheet[createdDateCell].s = {
        ...worksheet[createdDateCell].s,
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    if (worksheet[lastActivityCell]) {
      worksheet[lastActivityCell].s = {
        ...worksheet[lastActivityCell].s,
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'GitHub Copilot Seats');

  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const fileName = `GitHub_Copilot_Seats_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}

export function SeatsPage() {
  const [searchParams] = useSearchParams();
  const teamFromUrl = searchParams.get('team') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>(teamFromUrl);
  const [selectedEditor, setSelectedEditor] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('login');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Update selectedTeam when URL params change
  useEffect(() => {
    if (teamFromUrl) {
      setSelectedTeam(teamFromUrl);
      setCurrentPage(1);
    }
  }, [teamFromUrl]);

  const seats = mockSeatsData.seats;

  // Get unique team names for filter dropdown
  const teamNames = useMemo(() => {
    return mockTeams.map(t => t.name).sort();
  }, []);

  // Get unique editors for filter dropdown
  const editors = useMemo(() => {
    const editorSet = new Set<string>();
    seats.forEach(seat => {
      if (seat.lastActivityEditor) {
        // Extract main editor name
        const editorName = seat.lastActivityEditor.split('/')[0];
        editorSet.add(editorName);
      }
    });
    return Array.from(editorSet).sort();
  }, [seats]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...seats];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(seat =>
        seat.user.login.toLowerCase().includes(query) ||
        seat.user.name?.toLowerCase().includes(query)
      );
    }

    // Filter by selected team
    if (selectedTeam) {
      result = result.filter(seat => seat.team?.name === selectedTeam);
    }

    // Filter by selected editor
    if (selectedEditor) {
      result = result.filter(seat =>
        seat.lastActivityEditor?.startsWith(selectedEditor)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'login':
          comparison = a.user.login.localeCompare(b.user.login);
          break;
        case 'team':
          comparison = (a.team?.name || '').localeCompare(b.team?.name || '');
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'lastActivityAt':
          const aTime = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
          const bTime = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
          comparison = aTime - bTime;
          break;
        case 'lastActivityEditor':
          comparison = (a.lastActivityEditor || '').localeCompare(b.lastActivityEditor || '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [seats, searchQuery, selectedTeam, selectedEditor, sortField, sortDirection]);

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

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTeam('');
    setSelectedEditor('');
    setCurrentPage(1);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Heading as="h1" sx={{ fontSize: 3, fontWeight: 600, mb: 1 }}>
            GitHub Copilot Seats
          </Heading>
          <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
            Total seats: {mockSeatsData.totalSeats} | Active: {seats.filter(s => s.lastActivityAt).length}
          </Text>
        </Box>
        <Button
          leadingVisual={DownloadIcon}
          variant="primary"
          onClick={() => exportToExcel(filteredAndSortedData)}
        >
          Export to Excel
        </Button>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 4,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200, maxWidth: 300 }}>
          <TextInput
            leadingVisual={SearchIcon}
            placeholder="Search by user login..."
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

        <ActionMenu>
          <ActionMenu.Button>
            {selectedEditor || 'Select Editor'}
          </ActionMenu.Button>
          <ActionMenu.Overlay width="medium">
            <ActionList selectionVariant="single">
              <ActionList.Item
                selected={!selectedEditor}
                onSelect={() => {
                  setSelectedEditor('');
                  setCurrentPage(1);
                }}
              >
                All Editors
              </ActionList.Item>
              <ActionList.Divider />
              {editors.map((editor) => (
                <ActionList.Item
                  key={editor}
                  selected={selectedEditor === editor}
                  onSelect={() => {
                    setSelectedEditor(editor);
                    setCurrentPage(1);
                  }}
                >
                  {editor}
                </ActionList.Item>
              ))}
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>

        {(searchQuery || selectedTeam || selectedEditor) && (
          <Button variant="invisible" onClick={resetFilters}>
            Clear filters
          </Button>
        )}
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
            gridTemplateColumns: '180px 1fr 200px 120px 120px 200px',
            bg: 'canvas.subtle',
            borderBottom: '1px solid',
            borderColor: 'border.default',
          }}
        >
          <HeaderCell field="login" label="User Login" sortField={sortField} onSort={handleSort}>
            <SortIcon field="login" />
          </HeaderCell>
          <Box sx={{ p: 3 }}>
            <Text sx={{ fontWeight: 600, color: 'accent.fg', fontSize: 1 }}>Email</Text>
          </Box>
          <HeaderCell field="team" label="Team" sortField={sortField} onSort={handleSort}>
            <SortIcon field="team" />
          </HeaderCell>
          <HeaderCell field="createdAt" label="Created Date" sortField={sortField} onSort={handleSort}>
            <SortIcon field="createdAt" />
          </HeaderCell>
          <HeaderCell field="lastActivityAt" label="Last Activity" sortField={sortField} onSort={handleSort}>
            <SortIcon field="lastActivityAt" />
          </HeaderCell>
          <HeaderCell field="lastActivityEditor" label="Activity Editor" sortField={sortField} onSort={handleSort}>
            <SortIcon field="lastActivityEditor" />
          </HeaderCell>
        </Box>

        {/* Table Body */}
        {paginatedData.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Text sx={{ color: 'fg.muted' }}>No seats found</Text>
          </Box>
        ) : (
          paginatedData.map((seat, index) => (
            <Box
              key={seat.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 200px 120px 120px 200px',
                borderBottom: index < paginatedData.length - 1 ? '1px solid' : 'none',
                borderColor: 'border.default',
                '&:hover': { bg: 'canvas.subtle' },
              }}
            >
              <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={seat.user.avatarUrl} size={24} />
                <Text sx={{ color: 'fg.default', fontSize: 1 }}>{seat.user.login}</Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
                  {seat.user.login.replace('_stengg', '@stengg.com')}
                </Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.default', fontSize: 1 }}>{seat.team?.name || '-'}</Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{formatDate(seat.createdAt)}</Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{formatDate(seat.lastActivityAt)}</Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Text
                  sx={{
                    color: 'fg.muted',
                    fontSize: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={seat.lastActivityEditor || ''}
                >
                  {seat.lastActivityEditor || '-'}
                </Text>
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
          Showing {paginatedData.length} of {filteredAndSortedData.length} seats
        </Text>
      </Box>
    </Box>
  );
}

// Helper component for header cells
interface HeaderCellProps {
  field: SortField;
  label: string;
  sortField: SortField;
  onSort: (field: SortField) => void;
  children?: React.ReactNode;
}

function HeaderCell({ field, label, onSort, children }: HeaderCellProps) {
  return (
    <Box
      onClick={() => onSort(field)}
      sx={{
        p: 3,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        '&:hover': { bg: 'canvas.inset' },
      }}
    >
      <Text sx={{ fontWeight: 600, color: 'accent.fg', fontSize: 1 }}>{label}</Text>
      {children}
    </Box>
  );
}
