import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, Text } from '@primer/react';
import {
  CopilotIcon,
  CodeIcon,
  PeopleIcon,
  PersonIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GearIcon,
  ZapIcon,
  ToolsIcon,
} from '@primer/octicons-react';

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ElementType;
  indent?: boolean;
}

function NavItem({ path, label, icon: Icon, indent = false }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <NavLink
      to={path}
      style={{ textDecoration: 'none' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: '8px',
          px: indent ? 3 : 2,
          ml: indent ? 2 : 0,
          borderRadius: 2,
          color: isActive ? 'fg.default' : 'fg.muted',
          bg: isActive ? 'actionListItem.default.selectedBg' : 'transparent',
          fontWeight: isActive ? 600 : 400,
          fontSize: '14px',
          borderLeft: isActive ? '2px solid' : '2px solid transparent',
          borderLeftColor: isActive ? 'accent.fg' : 'transparent',
          '&:hover': {
            bg: isActive
              ? 'actionListItem.default.selectedBg'
              : 'actionListItem.default.hoverBg',
            color: 'fg.default',
          },
          transition: 'all 0.15s ease',
        }}
      >
        <Icon size={16} />
        <Text>{label}</Text>
      </Box>
    </NavLink>
  );
}

interface CollapsibleGroupProps {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  basePath: string;
}

function CollapsibleGroup({ label, icon: Icon, children, defaultOpen = true, basePath }: CollapsibleGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();

  // Check if any child route is active
  const isChildActive = location.pathname.startsWith(basePath);

  return (
    <Box>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: '8px',
          px: 2,
          borderRadius: 2,
          color: isChildActive ? 'fg.default' : 'fg.muted',
          fontWeight: isChildActive ? 600 : 400,
          fontSize: '14px',
          cursor: 'pointer',
          '&:hover': {
            bg: 'actionListItem.default.hoverBg',
            color: 'fg.default',
          },
          transition: 'all 0.15s ease',
        }}
      >
        <Icon size={16} />
        <Text sx={{ flex: 1 }}>{label}</Text>
        {isOpen ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
      </Box>
      {isOpen && (
        <Box sx={{ mt: 1 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

export function Sidebar() {
  return (
    <Box
      as="aside"
      sx={{
        width: 240,
        minWidth: 240,
        minHeight: 'calc(100vh - 64px)',
        borderRight: '1px solid',
        borderColor: 'border.default',
        bg: 'canvas.default',
        py: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ px: 3, mb: 3 }}>
        <Text
          sx={{
            fontSize: 0,
            fontWeight: 'bold',
            color: 'fg.muted',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Insights
        </Text>
      </Box>

      <Box as="nav" sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
        {/* GitHub Copilot Section */}
        <CollapsibleGroup
          label="GitHub Copilot"
          icon={CopilotIcon}
          defaultOpen={true}
          basePath="/insights"
        >
          <NavItem
            path="/insights/copilot-usage"
            label="Copilot usage"
            icon={CopilotIcon}
            indent
          />
          <NavItem
            path="/insights/code-generation"
            label="Code generation"
            icon={CodeIcon}
            indent
          />
          <NavItem
            path="/insights/teams"
            label="Teams"
            icon={PeopleIcon}
            indent
          />
          <NavItem
            path="/insights/seats"
            label="Seats"
            icon={PersonIcon}
            indent
          />
        </CollapsibleGroup>
      </Box>

      {/* Settings Section - Always at bottom */}
      <Box sx={{ px: 2, borderTop: '1px solid', borderColor: 'border.default', pt: 3 }}>
        <CollapsibleGroup
          label="Settings"
          icon={GearIcon}
          defaultOpen={true}
          basePath="/settings"
        >
          <NavItem
            path="/settings/domain-events"
            label="Domain Events"
            icon={ZapIcon}
            indent
          />
          <NavItem
            path="/settings/configurations"
            label="Configurations"
            icon={ToolsIcon}
            indent
          />
        </CollapsibleGroup>
      </Box>
    </Box>
  );
}
