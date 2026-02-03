import { useState, useMemo } from 'react';
import {
  Box,
  Text,
  Heading,
  TextInput,
  ActionMenu,
  ActionList,
  Pagination,
  Label as PrimerLabel,
  IconButton,
  Button,
  FormControl,
} from '@primer/react';
import { SearchIcon, SortAscIcon, SortDescIcon, PencilIcon, XIcon } from '@primer/octicons-react';
import { mockDomainEvents } from '@/mocks/settingsData';
import { DomainEvent, DomainEventState, DomainEventType } from '@/types/settings';
import { format, parseISO } from 'date-fns';

type SortField = 'name' | 'eventType' | 'state' | 'createdAt' | 'createdBy';
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 10;

function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy, h:mm:ss a');
  } catch {
    return '-';
  }
}

function StateLabel({ state }: { state: DomainEventState }) {
  const variant = state === 'Success' ? 'success' : state === 'Executing' ? 'attention' : 'danger';
  return (
    <PrimerLabel variant={variant} sx={{ textTransform: 'capitalize' }}>
      {state}
    </PrimerLabel>
  );
}

// Code Editor component with VS Code-like dark theme
function JsonCodeEditor({ value }: { value: string }) {
  return (
    <Box
      sx={{
        fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
        fontSize: '13px',
        lineHeight: 1.5,
        bg: '#1e1e1e',
        color: '#d4d4d4',
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: '#3c3c3c',
        overflow: 'auto',
        maxHeight: '300px',
        whiteSpace: 'pre',
        '& .string': { color: '#ce9178' },
        '& .number': { color: '#b5cea8' },
        '& .boolean': { color: '#569cd6' },
        '& .null': { color: '#569cd6' },
        '& .key': { color: '#9cdcfe' },
      }}
    >
      <SyntaxHighlightedJson json={value} />
    </Box>
  );
}

// Simple JSON syntax highlighter
function SyntaxHighlightedJson({ json }: { json: string }) {
  if (!json) {
    return <Text sx={{ color: '#6a9955', fontStyle: 'italic' }}>// No payload data</Text>;
  }

  const highlightJson = (str: string): React.ReactNode[] => {
    const lines = str.split('\n');
    return lines.map((line, lineIndex) => {
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let keyIndex = 0;

      // Match keys
      const keyRegex = /"([^"]+)":/g;
      let lastIndex = 0;
      let match;

      while ((match = keyRegex.exec(line)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          parts.push(remaining.substring(lastIndex, match.index));
        }
        // Add highlighted key
        parts.push(
          <span key={`key-${lineIndex}-${keyIndex++}`} style={{ color: '#9cdcfe' }}>
            "{match[1]}"
          </span>
        );
        parts.push(':');
        lastIndex = match.index + match[0].length;
      }

      // Process the rest of the line for values
      const rest = line.substring(lastIndex);
      const valueHighlighted = rest
        .replace(/"([^"]*)"/g, '<STRING>"$1"</STRING>')
        .replace(/\b(\d+\.?\d*)\b/g, '<NUMBER>$1</NUMBER>')
        .replace(/\b(true|false)\b/g, '<BOOLEAN>$1</BOOLEAN>')
        .replace(/\bnull\b/g, '<NULL>null</NULL>');

      const valueParts = valueHighlighted.split(/(<STRING>.*?<\/STRING>|<NUMBER>.*?<\/NUMBER>|<BOOLEAN>.*?<\/BOOLEAN>|<NULL>.*?<\/NULL>)/);

      valueParts.forEach((part, idx) => {
        if (part.startsWith('<STRING>')) {
          const content = part.replace(/<\/?STRING>/g, '');
          parts.push(<span key={`str-${lineIndex}-${idx}`} style={{ color: '#ce9178' }}>{content}</span>);
        } else if (part.startsWith('<NUMBER>')) {
          const content = part.replace(/<\/?NUMBER>/g, '');
          parts.push(<span key={`num-${lineIndex}-${idx}`} style={{ color: '#b5cea8' }}>{content}</span>);
        } else if (part.startsWith('<BOOLEAN>')) {
          const content = part.replace(/<\/?BOOLEAN>/g, '');
          parts.push(<span key={`bool-${lineIndex}-${idx}`} style={{ color: '#569cd6' }}>{content}</span>);
        } else if (part.startsWith('<NULL>')) {
          parts.push(<span key={`null-${lineIndex}-${idx}`} style={{ color: '#569cd6' }}>null</span>);
        } else if (part) {
          parts.push(part);
        }
      });

      return (
        <div key={lineIndex}>
          {parts.length > 0 ? parts : line}
        </div>
      );
    });
  };

  return <>{highlightJson(json)}</>;
}

export function DomainEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Edit dialog state
  const [editingEvent, setEditingEvent] = useState<DomainEvent | null>(null);
  const [newState, setNewState] = useState<DomainEventState>('Executing');

  const [events, setEvents] = useState<DomainEvent[]>(mockDomainEvents);

  const eventTypes: DomainEventType[] = ['seats', 'usages', 'metrics'];
  const states: DomainEventState[] = ['Executing', 'Success', 'Fail'];

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...events];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.source.name.toLowerCase().includes(query)
      );
    }

    // Filter by event type
    if (selectedEventType) {
      result = result.filter(event => event.eventType === selectedEventType);
    }

    // Filter by state
    if (selectedState) {
      result = result.filter(event => event.state === selectedState);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'eventType':
          comparison = a.eventType.localeCompare(b.eventType);
          break;
        case 'state':
          comparison = a.state.localeCompare(b.state);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'createdBy':
          comparison = a.createdBy.localeCompare(b.createdBy);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [events, searchQuery, selectedEventType, selectedState, sortField, sortDirection]);

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
    setSelectedEventType('');
    setSelectedState('');
    setCurrentPage(1);
  };

  const handleEditClick = (event: DomainEvent) => {
    setEditingEvent(event);
    setNewState(event.state);
  };

  const handleSaveState = () => {
    if (editingEvent) {
      setEvents(prev =>
        prev.map(e =>
          e.id === editingEvent.id ? { ...e, state: newState } : e
        )
      );
      setEditingEvent(null);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Heading as="h1" sx={{ fontSize: 3, fontWeight: 600, mb: 1 }}>
          Domain Events
        </Heading>
        <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
          Monitor and manage domain event execution status
        </Text>
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
            placeholder="Search by name..."
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
            {selectedEventType || 'Event Type'}
          </ActionMenu.Button>
          <ActionMenu.Overlay width="medium">
            <ActionList selectionVariant="single">
              <ActionList.Item
                selected={!selectedEventType}
                onSelect={() => {
                  setSelectedEventType('');
                  setCurrentPage(1);
                }}
              >
                All Types
              </ActionList.Item>
              <ActionList.Divider />
              {eventTypes.map((type) => (
                <ActionList.Item
                  key={type}
                  selected={selectedEventType === type}
                  onSelect={() => {
                    setSelectedEventType(type);
                    setCurrentPage(1);
                  }}
                >
                  {type}
                </ActionList.Item>
              ))}
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>

        <ActionMenu>
          <ActionMenu.Button>
            {selectedState || 'State'}
          </ActionMenu.Button>
          <ActionMenu.Overlay width="medium">
            <ActionList selectionVariant="single">
              <ActionList.Item
                selected={!selectedState}
                onSelect={() => {
                  setSelectedState('');
                  setCurrentPage(1);
                }}
              >
                All States
              </ActionList.Item>
              <ActionList.Divider />
              {states.map((state) => (
                <ActionList.Item
                  key={state}
                  selected={selectedState === state}
                  onSelect={() => {
                    setSelectedState(state);
                    setCurrentPage(1);
                  }}
                >
                  {state}
                </ActionList.Item>
              ))}
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>

        {(searchQuery || selectedEventType || selectedState) && (
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
            gridTemplateColumns: '1fr 120px 120px 120px 180px 120px 60px',
            bg: 'canvas.subtle',
            borderBottom: '1px solid',
            borderColor: 'border.default',
          }}
        >
          <HeaderCell field="name" label="Name" sortField={sortField} onSort={handleSort}>
            <SortIcon field="name" />
          </HeaderCell>
          <Box sx={{ p: 3 }}>
            <Text sx={{ fontWeight: 600, color: 'accent.fg', fontSize: 1 }}>Source Name</Text>
          </Box>
          <HeaderCell field="eventType" label="Event Type" sortField={sortField} onSort={handleSort}>
            <SortIcon field="eventType" />
          </HeaderCell>
          <HeaderCell field="state" label="State" sortField={sortField} onSort={handleSort}>
            <SortIcon field="state" />
          </HeaderCell>
          <HeaderCell field="createdAt" label="Created Date" sortField={sortField} onSort={handleSort}>
            <SortIcon field="createdAt" />
          </HeaderCell>
          <HeaderCell field="createdBy" label="Created By" sortField={sortField} onSort={handleSort}>
            <SortIcon field="createdBy" />
          </HeaderCell>
          <Box sx={{ p: 3 }} />
        </Box>

        {/* Table Body */}
        {paginatedData.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Text sx={{ color: 'fg.muted' }}>No domain events found</Text>
          </Box>
        ) : (
          paginatedData.map((event, index) => (
            <Box
              key={event.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 120px 120px 180px 120px 60px',
                borderBottom: index < paginatedData.length - 1 ? '1px solid' : 'none',
                borderColor: 'border.default',
                '&:hover': { bg: 'canvas.subtle' },
              }}
            >
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.default', fontSize: 1, wordBreak: 'break-word' }}>
                  {event.name}
                </Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{event.source.name}</Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{event.eventType}</Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <StateLabel state={event.state} />
              </Box>
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{formatDate(event.createdAt)}</Text>
              </Box>
              <Box sx={{ p: 3 }}>
                <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{event.createdBy}</Text>
              </Box>
              <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                  aria-label="Edit state"
                  icon={PencilIcon}
                  variant="invisible"
                  onClick={() => handleEditClick(event)}
                />
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
          Showing {paginatedData.length} of {filteredAndSortedData.length} events
        </Text>
      </Box>

      {/* Edit Event Dialog - Custom Modal */}
      {editingEvent && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setEditingEvent(null)}
        >
          <Box
            sx={{
              bg: 'canvas.default',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'border.default',
              width: '700px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 3,
                borderBottom: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Heading as="h2" sx={{ fontSize: 2, fontWeight: 600 }}>
                Domain Event Details
              </Heading>
              <IconButton
                aria-label="Close"
                icon={XIcon}
                variant="invisible"
                onClick={() => setEditingEvent(null)}
              />
            </Box>

            {/* Dialog Content */}
            <Box sx={{ p: 3, overflow: 'auto', flex: 1 }}>
              {/* Event Info Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 3,
                  mb: 4,
                }}
              >
                <Box>
                  <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mb: 1 }}>
                    Event Name
                  </Text>
                  <Text sx={{ fontSize: 1, color: 'fg.default', fontWeight: 500 }}>
                    {editingEvent.name}
                  </Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mb: 1 }}>
                    Event ID
                  </Text>
                  <Text sx={{ fontSize: 1, color: 'fg.default', fontFamily: 'mono' }}>
                    {editingEvent.id}
                  </Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mb: 1 }}>
                    Event Type
                  </Text>
                  <Text sx={{ fontSize: 1, color: 'fg.default' }}>
                    {editingEvent.eventType}
                  </Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mb: 1 }}>
                    Source
                  </Text>
                  <Text sx={{ fontSize: 1, color: 'fg.default' }}>
                    {editingEvent.source.name} ({editingEvent.source.tenantName})
                  </Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mb: 1 }}>
                    Created Date
                  </Text>
                  <Text sx={{ fontSize: 1, color: 'fg.default' }}>
                    {formatDate(editingEvent.createdAt)}
                  </Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mb: 1 }}>
                    Created By
                  </Text>
                  <Text sx={{ fontSize: 1, color: 'fg.default' }}>
                    {editingEvent.createdBy}
                  </Text>
                </Box>
              </Box>

              {/* State Selection */}
              <FormControl sx={{ mb: 4 }}>
                <FormControl.Label sx={{ color: 'fg.default' }}>Status</FormControl.Label>
                <ActionMenu>
                  <ActionMenu.Button
                    sx={{
                      width: '200px',
                      '[data-component="buttonContent"]': { justifyContent: 'space-between' },
                    }}
                  >
                    <StateLabel state={newState} />
                  </ActionMenu.Button>
                  <ActionMenu.Overlay width="medium" sx={{ zIndex: 200 }}>
                    <ActionList selectionVariant="single">
                      {states.map((state) => (
                        <ActionList.Item
                          key={state}
                          selected={newState === state}
                          onSelect={() => setNewState(state)}
                        >
                          <StateLabel state={state} />
                        </ActionList.Item>
                      ))}
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              </FormControl>

              {/* Error Message */}
              {editingEvent.errorMessage && (
                <Box sx={{ mb: 4 }}>
                  <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mb: 1 }}>
                    Error Message
                  </Text>
                  <Box
                    sx={{
                      p: 2,
                      bg: 'danger.subtle',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'danger.muted',
                    }}
                  >
                    <Text sx={{ fontSize: 1, color: 'danger.fg' }}>
                      {editingEvent.errorMessage}
                    </Text>
                  </Box>
                </Box>
              )}

              {/* Payload JSON */}
              <Box>
                <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block', mb: 2 }}>
                  Payload Data
                </Text>
                <JsonCodeEditor value={editingEvent.payload} />
              </Box>
            </Box>

            {/* Dialog Footer */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                p: 3,
                borderTop: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Button onClick={() => setEditingEvent(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveState}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </Box>
      )}
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
