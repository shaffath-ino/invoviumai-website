import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleNetwork from './components/ParticleNetwork';
import AIChatbot from './components/AIChatbot';
import { AuthProvider } from './context/AuthContext';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));

// Loading Skeleton
function PageSkeleton() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-primary animate-spin"></div>
      <p className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Assets...</p>
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Global Cursor Spotlight
function SpotlightTracker({ children }) {
  const [position, setPosition] = useState({ x: '50%', y: '50%' });

  const handleMouseMove = (e) => {
    setPosition({ x: `${e.clientX}px`, y: `${e.clientY}px` });
  };

  return (
    <div 
      className="flex flex-col min-h-screen w-full overflow-hidden relative transition-colors duration-500"
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': position.x, '--mouse-y': position.y }}
    >
      <div className="cursor-spotlight"></div>
      <div className="bg-grid"></div>
      <ParticleNetwork />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}

// Wrapper to animate page transitions
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageSkeleton />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/careers" element={<PageWrapper><Careers /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/student-dashboard" element={<PageWrapper><StudentDashboard /></PageWrapper>} />
          <Route path="/company-dashboard" element={<PageWrapper><CompanyDashboard /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full relative"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <SpotlightTracker>
          <Navbar />
          <main className="flex-grow w-full pt-[80px]">
            <AnimatedRoutes />
          </main>
          <Footer />
          <AIChatbot />
        </SpotlightTracker>
      </Router>
    </AuthProvider>
  );
}
