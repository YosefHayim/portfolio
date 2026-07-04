import { Route, Routes, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import Homepage from './Pages/Homepage/Homepage';
import About from './Pages/About/About';
import Certifications from './Pages/Certifications/Certifications';
import TechStack from './Pages/TechStack/TechStack';
import Projects from './Pages/Projects/Projects';
import ProjectDetail from './Pages/Projects/ProjectDetail/ProjectDetail';
import NotFound404 from './Pages/NotFound404/NotFound404';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import BottomNav from './Components/BottomNav/BottomNav';
import ScrollProgress from './Components/ScrollProgress/ScrollProgress';
import ReturnVisitorDialog from './Components/ReturnVisitorDialog/ReturnVisitorDialog';
import { useReturnVisitor } from './hooks/useReturnVisitor';
import '@/index.css';

const App = () => {
  const location = useLocation();
  const { shouldShowDialog, dismissDialog } = useReturnVisitor();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden p-5 pb-24 md:pb-5">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/techStack" element={<TechStack />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/404" element={<NotFound404 />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <BottomNav />
      <ReturnVisitorDialog isOpen={shouldShowDialog} onClose={dismissDialog} />
    </div>
  );
};

export default App;
