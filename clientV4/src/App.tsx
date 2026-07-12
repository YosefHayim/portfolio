import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { IdleMount } from '@/Components/IdleMount';
import { HomePage } from '@/Pages/HomePage';

const BlogListPage = lazy(async () => {
  const module = await import('@/Pages/BlogListPage');
  return { default: module.BlogListPage };
});

const BlogPostPage = lazy(async () => {
  const module = await import('@/Pages/BlogPostPage');
  return { default: module.BlogPostPage };
});

const AIChatDock = lazy(async () => {
  const module = await import('@/Components/AIChatDock');
  return { default: module.AIChatDock };
});

export const App = () => (
  <>
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<BlogListPage />} path="/blog" />
        <Route element={<BlogPostPage />} path="/blog/:slug" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Suspense>
    <IdleMount timeoutMs={3000}>
      <Suspense fallback={null}>
        <AIChatDock />
      </Suspense>
    </IdleMount>
  </>
);
