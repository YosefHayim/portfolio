import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { SidebarProvider } from './Components/ui/sidebar.tsx';

createRoot(document.getElementById('root')!).render(
<<<<<<< HEAD
  <BrowserRouter basename="/v1">
=======
  <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
>>>>>>> refs/heads/mac-reset-backup/2026-07-30/stash/000-afbb755efb3e
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </BrowserRouter>
);
