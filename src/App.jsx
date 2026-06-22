import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleNetwork from './components/ParticleNetwork';
import AIChatbot from './components/AIChatbot';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy Loaded Pages
// -- Public Pages --
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Services = lazy(() => import('./pages/public/Services'));
const Contact = lazy(() => import('./pages/public/Contact'));

// -- Auth --
const Login = lazy(() => import('./pages/auth/Login'));

// -- Dashboards --
const StudentDashboard = lazy(() => import('./pages/dashboard/StudentDashboard'));
const CompanyDashboard = lazy(() => import('./pages/dashboard/CompanyDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));

// -- Courses & Internships --
const Course = lazy(() => import('./pages/course/Course'));
const CourseDetails = lazy(() => import('./pages/course/CourseDetails'));
const InternCourses = lazy(() => import('./pages/course/InternCourses'));
const MyCourses = lazy(() => import('./pages/course/MyCourses'));
const WebDevInternship = lazy(() => import('./pages/course/WebDevInternship'));
const FinalYearProject = lazy(() => import('./pages/course/FinalYearProject'));
const InteractiveDayView = lazy(() => import('./pages/course/InteractiveDayView'));

// -- Careers --
const Careers = lazy(() => import('./pages/career/Careers'));
const JobDetails = lazy(() => import('./pages/career/JobDetails'));

// -- Onboarding & Payment --
const Payment = lazy(() => import('./pages/onboarding/Payment'));
const OfferLetter = lazy(() => import('./pages/onboarding/OfferLetter'));
const DownloadOfferLetter = lazy(() => import('./pages/onboarding/DownloadOfferLetter'));
const PaymentHistory = lazy(() => import('./pages/dashboard/PaymentHistory'));
const Invoice = lazy(() => import('./pages/dashboard/Invoice'));
const ProjectPayment = lazy(() => import('./pages/onboarding/ProjectPayment'));

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
const SpotlightTracker = React.memo(function SpotlightTracker({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };
    
    // Use an animation frame to throttle style updates slightly if needed, 
    // or just direct style injection which is much faster than React state updates.
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col min-h-screen w-full overflow-hidden relative transition-colors duration-500"
      style={{ '--mouse-x': '50%', '--mouse-y': '50%' }}
    >
      <div className="cursor-spotlight"></div>
      <div className="bg-grid"></div>
      <ParticleNetwork />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {children}
      </div>
    </div>
  );
});

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
          <Route path="/dashboard" element={<PageWrapper><StudentDashboard /></PageWrapper>} />
          <Route path="/intern-courses" element={<PageWrapper><InternCourses /></PageWrapper>} />
          <Route path="/company-dashboard" element={<PageWrapper><CompanyDashboard /></PageWrapper>} />
          <Route path="/payment-history" element={<PageWrapper><PaymentHistory /></PageWrapper>} />
          <Route path="/invoice/:paymentId" element={<PageWrapper><Invoice /></PageWrapper>} />
          <Route path="/payment/:enrollmentId" element={<PageWrapper><Payment /></PageWrapper>} />
          <Route path="/project-payment" element={<PageWrapper><ProjectPayment /></PageWrapper>} />
          <Route path="/final-year-project" element={<PageWrapper><FinalYearProject /></PageWrapper>} />
          <Route path="/offer-letter/:enrollmentId" element={<PageWrapper><OfferLetter /></PageWrapper>} />
          <Route path="/my-courses" element={<PageWrapper><MyCourses /></PageWrapper>} />
          <Route path="/course/:enrollmentId" element={<PageWrapper><Course /></PageWrapper>} />
          <Route path="/download-offer-letter" element={<PageWrapper><DownloadOfferLetter /></PageWrapper>} />
          <Route path="/course-details/:courseId" element={<PageWrapper><CourseDetails /></PageWrapper>} />
          <Route path="/web-development-internship" element={<PageWrapper><WebDevInternship /></PageWrapper>} />
          <Route path="/course/:enrollmentId/day/:dayNumber" element={<PageWrapper><InteractiveDayView /></PageWrapper>} />
          <Route path="/admin-dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          <Route path="/careers/:id" element={<PageWrapper><JobDetails /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

const PageWrapper = React.memo(function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full relative"
    >
      {children}
    </motion.div>
  );
});

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <SpotlightTracker>
            <Navbar />
            <main className="flex-grow w-full pt-[80px] print:pt-0">
              <AnimatedRoutes />
            </main>
            <Footer />
            <AIChatbot />
          </SpotlightTracker>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
