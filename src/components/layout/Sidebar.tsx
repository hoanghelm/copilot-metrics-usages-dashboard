import { NavLink, useLocation } from 'react-router-dom';
import { Box, Text } from '@primer/react';
import {
  CopilotIcon,
  CodeIcon,
  CommentDiscussionIcon,
  GitPullRequestIcon,
} from '@primer/octicons-react';

const NAV_ITEMS = [
  {
    path: '/insights/copilot-usage',
    label: 'Copilot IDE usage',
    icon: CopilotIcon,
  },
  {
    path: '/insights/code-completion',
    label: 'Code completion',
    icon: CodeIcon,
  },
  {
    path: '/insights/chat',
    label: 'Chat',
    icon: CommentDiscussionIcon,
  },
  {
    path: '/insights/pull-requests',
    label: 'Pull requests',
    icon: GitPullRequestIcon,
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <Box
      as="aside"
      sx={{
        width: 220,
        minHeight: 'calc(100vh - 64px)',
        borderRight: '1px solid',
        borderColor: 'border.default',
        bg: 'canvas.default',
        py: 3,
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
          Copilot
        </Text>
      </Box>

      <Box as="nav" sx={{ px: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 2,
                  py: '8px',
                  borderRadius: 2,
                  color: isActive ? 'fg.default' : 'fg.muted',
                  bg: isActive ? 'actionListItem.default.selectedBg' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderLeft: isActive ? '2px solid' : '2px solid transparent',
                  borderLeftColor: isActive ? 'accent.fg' : 'transparent',
                  ml: isActive ? '-2px' : 0,
                  '&:hover': {
                    bg: isActive
                      ? 'actionListItem.default.selectedBg'
                      : 'actionListItem.default.hoverBg',
                    color: 'fg.default',
                  },
                }}
              >
                <Icon size={16} />
                <Text>{item.label}</Text>
              </Box>
            </NavLink>
          );
        })}
      </Box>
    </Box>
  );
}
