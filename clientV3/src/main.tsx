import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App.tsx';
import './i18n/config.ts';
import { portfolioQueryClient } from './queryClient.ts';

/**
 * Resolves the Vite root element before React bootstraps.
 *
 * @returns The app root element.
 * @example
 * getRootElement() // document element with id "root"
 */
const getRootElement = (): HTMLElement => {
  const rootElement = document.getElementById('root');

  if (rootElement === null) {
    throw new Error('Missing #root element');
  }

  return rootElement;
};

createRoot(getRootElement()).render(
  <QueryClientProvider client={portfolioQueryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
);
