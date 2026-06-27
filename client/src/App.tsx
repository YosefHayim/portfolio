import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import ReturnVisitorDialog from './Components/ReturnVisitorDialog/ReturnVisitorDialog.tsx';
import ScrollProgress from './Components/ScrollProgress/ScrollProgress.tsx';
import { useReturnVisitor } from './hooks/useReturnVisitor.ts';
import '@/index.css';

const OnePagePortfolio = lazy(() => import('./Pages/OnePage/OnePagePortfolio.tsx'));

const AIChatSidebar = lazy(() => import('./Components/AIChatSidebar/AIChatSidebar.tsx'));

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#05df72] border-t-transparent" />
  </div>
);

const ChatLoader = () => null;

const App = () => {
  const location = useLocation();
  const { shouldShowDialog, dismissDialog } = useReturnVisitor();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <ScrollProgress />
      <main className="flex flex-1 flex-col items-center justify-center gap-2 overflow-hidden p-2">
        <AnimatePresence mode="popLayout">
          <Suspense fallback={<PageLoader />}>
            <Routes key={location.pathname} location={location}>
              <Route element={<OnePagePortfolio />} path="/" />
              <Route element={<OnePagePortfolio />} path="*" />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <ReturnVisitorDialog isOpen={shouldShowDialog} onClose={dismissDialog} />
      <Suspense fallback={<ChatLoader />}>
        <AIChatSidebar />
      </Suspense>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          },
        }}
        theme="dark"
      />
    </div>
  );
};

export default App;
