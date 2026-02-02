import { Outlet } from 'react-router-dom';
import { Box } from '@primer/react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bg: 'canvas.default',
      }}
    >
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box
          as="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bg: 'canvas.subtle',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
