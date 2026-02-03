import { useState } from 'react';
import {
  Box,
  Text,
  Heading,
  Label as PrimerLabel,
  Button,
  IconButton,
  TextInput,
  FormControl,
  Checkbox,
  UnderlineNav,
  ActionMenu,
  ActionList,
} from '@primer/react';
import { PlusIcon, PencilIcon, XIcon } from '@primer/octicons-react';
import { mockCopilotSources } from '@/mocks/settingsData';
import { CopilotSource } from '@/types/settings';

type TabType = 'copilot-sources';
type ScopeType = 'enterprise' | 'organization';

export function ConfigurationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('copilot-sources');
  const [sources, setSources] = useState<CopilotSource[]>(mockCopilotSources);

  // Add/Edit dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<CopilotSource | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    tenantName: '',
    scope: 'enterprise' as ScopeType,
    isActive: true,
  });

  const handleAddNew = () => {
    setEditingSource(null);
    setFormData({
      name: '',
      tenantName: '',
      scope: 'enterprise',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (source: CopilotSource) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      tenantName: source.tenantName,
      scope: source.scope,
      isActive: source.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingSource) {
      // Update existing
      setSources(prev =>
        prev.map(s =>
          s.id === editingSource.id
            ? { ...s, ...formData, updatedAt: new Date().toISOString() }
            : s
        )
      );
    } else {
      // Add new
      const newSource: CopilotSource = {
        id: `source-${Date.now()}`,
        ...formData,
        token: '',
        createdAt: new Date().toISOString(),
        createdBy: 'user',
        updatedAt: new Date().toISOString(),
        updatedBy: '',
        domainEvent: [],
        metrics: [],
        assignedSeats: [],
        usage: [],
      };
      setSources(prev => [...prev, newSource]);
    }
    setIsDialogOpen(false);
  };

  const scopes: ScopeType[] = ['enterprise', 'organization'];

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Heading as="h1" sx={{ fontSize: 3, fontWeight: 600, mb: 1 }}>
          Configurations
        </Heading>
        <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
          Manage Copilot data sources and configurations
        </Text>
      </Box>

      {/* Tabs */}
      <UnderlineNav aria-label="Configuration tabs">
        <UnderlineNav.Item
          as="button"
          aria-current={activeTab === 'copilot-sources' ? 'page' : undefined}
          onClick={() => setActiveTab('copilot-sources')}
          sx={{ textTransform: 'uppercase', fontWeight: 600, fontSize: 1 }}
        >
          Copilot Sources
        </UnderlineNav.Item>
      </UnderlineNav>

      {/* Content */}
      <Box sx={{ mt: 4 }}>
        {activeTab === 'copilot-sources' && (
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'border.default',
              borderRadius: 2,
              p: 4,
            }}
          >
            {/* Add New Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
              <Button variant="primary" leadingVisual={PlusIcon} onClick={handleAddNew}>
                ADD NEW
              </Button>
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
                  gridTemplateColumns: '1fr 1fr 150px 100px 60px',
                  bg: 'canvas.subtle',
                  borderBottom: '1px solid',
                  borderColor: 'border.default',
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Text sx={{ fontWeight: 600, color: 'accent.fg', fontSize: 1 }}>Name</Text>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Text sx={{ fontWeight: 600, color: 'accent.fg', fontSize: 1 }}>Tenant Name</Text>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Text sx={{ fontWeight: 600, color: 'accent.fg', fontSize: 1 }}>Scope</Text>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Text sx={{ fontWeight: 600, color: 'accent.fg', fontSize: 1 }}>Active</Text>
                </Box>
                <Box sx={{ p: 3 }} />
              </Box>

              {/* Table Body */}
              {sources.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Text sx={{ color: 'fg.muted' }}>No sources configured</Text>
                </Box>
              ) : (
                sources.map((source, index) => (
                  <Box
                    key={source.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 150px 100px 60px',
                      borderBottom: index < sources.length - 1 ? '1px solid' : 'none',
                      borderColor: 'border.default',
                      '&:hover': { bg: 'canvas.subtle' },
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <Text sx={{ color: 'fg.default', fontSize: 1 }}>{source.name}</Text>
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{source.tenantName}</Text>
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{source.scope}</Text>
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <PrimerLabel variant={source.isActive ? 'success' : 'secondary'}>
                        {source.isActive ? 'Active' : 'Inactive'}
                      </PrimerLabel>
                    </Box>
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconButton
                        aria-label="Edit source"
                        icon={PencilIcon}
                        variant="invisible"
                        onClick={() => handleEdit(source)}
                      />
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Add/Edit Dialog - Custom Modal */}
      {isDialogOpen && (
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
          onClick={() => setIsDialogOpen(false)}
        >
          <Box
            sx={{
              bg: 'canvas.default',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'border.default',
              width: '500px',
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
                {editingSource ? 'Edit Copilot Source' : 'Add Copilot Source'}
              </Heading>
              <IconButton
                aria-label="Close"
                icon={XIcon}
                variant="invisible"
                onClick={() => setIsDialogOpen(false)}
              />
            </Box>

            {/* Dialog Content */}
            <Box sx={{ p: 3, overflow: 'auto', flex: 1 }}>
              <FormControl sx={{ mb: 3 }}>
                <FormControl.Label sx={{ color: 'fg.default' }}>Name</FormControl.Label>
                <TextInput
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ width: '100%' }}
                />
              </FormControl>

              <FormControl sx={{ mb: 3 }}>
                <FormControl.Label sx={{ color: 'fg.default' }}>Tenant Name</FormControl.Label>
                <TextInput
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  sx={{ width: '100%' }}
                />
              </FormControl>

              <FormControl sx={{ mb: 3 }}>
                <FormControl.Label sx={{ color: 'fg.default' }}>Scope</FormControl.Label>
                <ActionMenu>
                  <ActionMenu.Button
                    sx={{
                      width: '100%',
                      '[data-component="buttonContent"]': { justifyContent: 'space-between' },
                    }}
                  >
                    {formData.scope}
                  </ActionMenu.Button>
                  <ActionMenu.Overlay width="medium" sx={{ zIndex: 200 }}>
                    <ActionList selectionVariant="single">
                      {scopes.map((scope) => (
                        <ActionList.Item
                          key={scope}
                          selected={formData.scope === scope}
                          onSelect={() => setFormData({ ...formData, scope })}
                        >
                          {scope}
                        </ActionList.Item>
                      ))}
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              </FormControl>

              <FormControl sx={{ mb: 3 }}>
                <Checkbox
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <FormControl.Label sx={{ color: 'fg.default' }}>Active</FormControl.Label>
              </FormControl>
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
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>
                {editingSource ? 'Save Changes' : 'Add Source'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
