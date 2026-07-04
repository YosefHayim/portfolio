import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";
import BottomNav from "./Components/BottomNav/BottomNav";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import ReturnVisitorDialog from "./Components/ReturnVisitorDialog/ReturnVisitorDialog";
import ScrollProgress from "./Components/ScrollProgress/ScrollProgress";
import { useReturnVisitor } from "./hooks/useReturnVisitor";
import "@/index.css";

const Homepage = lazy(() => import("./Pages/Homepage/Homepage"));
const About = lazy(() => import("./Pages/About/About"));
const Projects = lazy(() => import("./Pages/Projects/Projects"));
const ProjectDetail = lazy(
  () => import("./Pages/Projects/ProjectDetail/ProjectDetail"),
);
const TechStack = lazy(() => import("./Pages/TechStack/TechStack"));
const Certifications = lazy(
  () => import("./Pages/Certifications/Certifications"),
);
const NotFound404 = lazy(() => import("./Pages/NotFound404/NotFound404"));
const Blog = lazy(() => import("./Pages/Blog/Blog"));
const BlogPost = lazy(() => import("./Pages/Blog/BlogPost"));

const AIChatSidebar = lazy(
  () => import("./Components/AIChatSidebar/AIChatSidebar"),
);

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
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden p-5 pb-24 md:pb-5">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes key={location.pathname} location={location}>
              <Route element={<Homepage />} path="/" />
              <Route element={<About />} path="/about" />
              <Route element={<Projects />} path="/projects" />
              <Route element={<ProjectDetail />} path="/projects/:projectId" />
              <Route element={<TechStack />} path="/techStack" />
              <Route element={<Certifications />} path="/certifications" />
              <Route element={<Blog />} path="/blog" />
              <Route element={<BlogPost />} path="/blog/:slug" />
              <Route element={<NotFound404 />} path="/404" />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
      <BottomNav />
      <ReturnVisitorDialog isOpen={shouldShowDialog} onClose={dismissDialog} />
      <Suspense fallback={<ChatLoader />}>
        <AIChatSidebar />
      </Suspense>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
          },
        }}
        theme="dark"
      />
    </div>
  );
};

export default App;
