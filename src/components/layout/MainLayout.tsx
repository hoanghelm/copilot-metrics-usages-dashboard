import { Outlet } from 'react-router-dom';
import { Box } from '@primer/react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  return (
    <Box
      sx={{
        height: '100vh',
        bg: 'canvas.default',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Header />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <Box
          as="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bg: 'canvas.subtle',
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
