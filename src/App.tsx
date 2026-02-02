import { ThemeProvider, BaseStyles } from '@primer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CopilotUsagePage } from '@/pages/copilot-usage';
import { CodeCompletionPage } from '@/pages/code-completion';

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
      <ThemeProvider colorMode="auto">
        <BaseStyles>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/insights/copilot-usage" replace />} />
                <Route path="insights">
                  <Route path="copilot-usage" element={<CopilotUsagePage />} />
                  <Route path="code-completion" element={<CodeCompletionPage />} />
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
