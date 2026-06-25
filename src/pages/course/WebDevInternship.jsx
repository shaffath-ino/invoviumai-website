import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Code, Database, Server, MonitorSmartphone, Layout, GitBranch, 
  ShieldCheck, Rocket, ChevronRight, Play, ArrowLeft, CheckCircle2, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


export default function WebDevInternship() {
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState(null);
  const [loading, setLoading] = useState(false);



  // Fetch the actual Web Development course ID from the database for enrollment
  useEffect(() => {
    const fetchCourseId = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/course/courses`);
        const webCourse = response.data.find(c => c.title === 'Web Development Internship');
        if (webCourse) {
          setCourseId(webCourse._id);
        }
      } catch {
        console.error('Failed to fetch course ID');
      }
    };
    fetchCourseId();
  }, []);

  const handleEnroll = async () => {
    if (!courseId) {
      toast.error('Course is currently unavailable');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to enroll');
        navigate('/login');
        return;
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/course/enroll`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Registration started! Please complete payment.');
      const url = `${window.location.origin}/payment/${response.data.enrollmentId}`;
      window.open(url, '_blank');
      navigate('/intern-courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  const syllabus = [
    {
      month: "Month 1: Frontend Architecture & Fundamentals",
      weeks: [
        { title: "Week 1: Web Foundations & HTML5", desc: "DNS, Hosting, Browsers, Semantic HTML5, Forms, Tables, Accessibility (A11y)." },
        { title: "Week 2: Advanced CSS3 & Responsive Design", desc: "CSS Box Model, Flexbox, CSS Grid, Mobile-first design, Animations." },
        { title: "Week 3: JavaScript Core (ES6+)", desc: "Variables, Data Types, Arrays, Objects, Control flow, DOM Manipulation." },
        { title: "Week 4: Asynchronous JS & Version Control", desc: "Promises, Async/Await, Fetch API, Git & GitHub. Project: Personal Portfolio." }
      ]
    },
    {
      month: "Month 2: Modern Frontend Frameworks",
      weeks: [
        { title: "Week 5: React.js Fundamentals", desc: "Virtual DOM, JSX, Component architecture, Props, and State." },
        { title: "Week 6: React Hooks & Routing", desc: "Deep dive into useState, useEffect, useRef. React Router DOM." },
        { title: "Week 7: State Management & API Integration", desc: "Context API, REST API integration, loading/error states." },
        { title: "Week 8: Modern Styling & Animations", desc: "Tailwind CSS, Framer Motion. Project: E-Commerce store frontend." }
      ]
    },
    {
      month: "Month 3: Backend Engineering & Databases",
      weeks: [
        { title: "Week 9: Node.js & Express.js server", desc: "Event Loop, Express.js routing, middleware, server setup." },
        { title: "Week 10: Database Design with MongoDB", desc: "NoSQL concepts, MongoDB Atlas, Mongoose ODM, Schemas." },
        { title: "Week 11: Advanced Database Operations", desc: "CRUD operations, Database relationships, Aggregations." },
        { title: "Week 12: Security & Authentication", desc: "User Registration, Password Hashing (bcrypt), JWT. Project: Secure API." }
      ]
    },
    {
      month: "Month 4: Full-Stack Integration & Deployment",
      weeks: [
        { title: "Week 13: Full-Stack Symbiosis (MERN)", desc: "Connecting React to Express, CORS, headers, sessions." },
        { title: "Week 14: Advanced Application Features", desc: "File/image uploads, pagination, search algorithms." },
        { title: "Week 15: Optimization & Testing", desc: "Refactoring, removing bottlenecks, XSS & CSRF protection." },
        { title: "Week 16: Cloud Deployment & Capstone", desc: "Vercel, Render deployments. Final Project: Full-Stack SaaS application." }
      ]
    }
  ];

  return (
    <div className="w-full relative min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Background Radiance */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10 text-center">
        <button 
          onClick={() => navigate('/intern-courses')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 font-bold text-sm tracking-wider uppercase transition-colors"
        >
          <ArrowLeft size={16} /> All Courses
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20">
            <Rocket size={16} /> Elite 4-Month Program
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Full-Stack Web Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Internship</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Master the MERN stack (MongoDB, Express, React, Node.js). Build production-ready applications, receive 1-on-1 mentorship, and launch your software engineering career.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleEnroll}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-black text-lg hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Secure Your Spot Now'} <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tech Stack Grid */}
      <div className="py-12 border-y border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-8">
            Technologies You Will Master
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            {[
              { name: 'React', icon: Layout },
              { name: 'Node.js', icon: Server },
              { name: 'MongoDB', icon: Database },
              { name: 'JavaScript', icon: Code },
              { name: 'Git', icon: GitBranch },
              { name: 'Responsive', icon: MonitorSmartphone },
            ].map((tech, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-800 dark:text-white font-bold text-lg">
                <tech.icon className="text-primary" size={28} /> {tech.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprehensive Syllabus */}
      <div className="py-12 md:py-24 px-6 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Complete 16-Week Curriculum</h2>
          <p className="text-lg text-slate-600 dark:text-gray-400">Step-by-step roadmap from beginner to full-stack engineer.</p>
        </div>

        <div className="space-y-16">
          {syllabus.map((phase, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/30 shrink-0">
                  {idx + 1}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{phase.month}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6 md:pl-16 border-l-2 border-slate-200 dark:border-white/10 ml-6 md:ml-0">
                {phase.weeks.map((week, wIdx) => (
                  <div key={wIdx} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 dark:bg-white/10 group-hover:bg-primary transition-colors" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2 flex items-center gap-2">
                      <Play size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity -ml-6" />
                      {week.title}
                    </h4>
                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                      {week.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>



      {/* Call to Action Footer */}
      <div className="py-12 md:py-24 px-6 relative z-10 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="max-w-4xl mx-auto glass-card p-6 md:p-12 rounded-3xl border border-primary/20 bg-primary/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">Ready to Build Your Future?</h2>
          <p className="text-lg text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful interns who have launched their tech careers with InoviumAI. Get real-world experience and an official offer letter today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button 
              onClick={handleEnroll}
              disabled={loading}
              className="px-10 py-4 rounded-xl bg-primary text-white font-black text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/30"
            >
              Enroll in Program — ₹6000
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-gray-300">
              <ShieldCheck className="text-green-500" size={20} /> Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
