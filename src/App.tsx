import { ThemeProvider, BaseStyles } from '@primer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CopilotUsagePage } from '@/pages/copilot-usage';
import { CodeGenerationPage } from '@/pages/code-generation';
import { TeamsPage } from '@/pages/teams';
import { SeatsPage } from '@/pages/seats';
import { DomainEventsPage } from '@/pages/settings/domain-events';
import { ConfigurationsPage } from '@/pages/settings/configurations';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider colorMode="night">
        <BaseStyles>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/insights/copilot-usage" replace />} />
                <Route path="insights">
                  <Route path="copilot-usage" element={<CopilotUsagePage />} />
                  <Route path="code-generation" element={<CodeGenerationPage />} />
                  <Route path="teams" element={<TeamsPage />} />
                  <Route path="seats" element={<SeatsPage />} />
                </Route>
                <Route path="settings">
                  <Route path="domain-events" element={<DomainEventsPage />} />
                  <Route path="configurations" element={<ConfigurationsPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </BaseStyles>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
