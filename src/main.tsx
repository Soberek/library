import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import { queryClient } from './lib/queryClient';
import { SearchProvider } from './providers/SearchProvider.tsx';
import { ThemeProvider } from './theme';
import RouterProviderWrapper from './providers/RouterProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SearchProvider>
          <RouterProviderWrapper />
        </SearchProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
