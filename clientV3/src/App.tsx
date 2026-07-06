import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { Navbar } from './Components/Navbar/Navbar.tsx';
import { ReturnVisitorDialog } from './Components/ReturnVisitorDialog/ReturnVisitorDialog.tsx';
import { ScrollProgress } from './Components/ScrollProgress/ScrollProgress.tsx';
import { useReturnVisitor } from './hooks/useReturnVisitor.ts';
import '@/index.css';

const OnePagePortfolio = lazy(() =>
  import('./Pages/OnePage/OnePagePortfolio.tsx').then((module) => ({
    default: module.OnePagePortfolio,
  })),
);
const BlogList = lazy(() =>
  import('./Pages/Blog/BlogList.tsx').then((module) => ({ default: module.BlogList })),
);
const BlogPost = lazy(() =>
  import('./Pages/Blog/BlogPost.tsx').then((module) => ({ default: module.BlogPost })),
);

const AIChatSidebar = lazy(() =>
  import('./Components/AIChatSidebar/AIChatSidebar.tsx').then((module) => ({
    default: module.AIChatSidebar,
  })),
);

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
  </div>
);

const ChatLoader = () => null;

export const App = () => {
  const location = useLocation();
  const { shouldShowDialog, dismissDialog } = useReturnVisitor();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-2 overflow-hidden p-2 pt-16">
        <AnimatePresence mode="popLayout">
          <Suspense fallback={<PageLoader />}>
            <Routes key={location.pathname} location={location}>
              <Route element={<OnePagePortfolio />} path="/" />
              <Route element={<BlogList />} path="/blog" />
              <Route element={<BlogPost />} path="/blog/:slug" />
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
