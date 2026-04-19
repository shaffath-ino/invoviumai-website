import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { CircleDot, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const [isDark, setIsDark] = useState(false);
  const menuRef = useRef(null);

  // Theme tracking
  useEffect(() => {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || (!storedTheme && isSystemDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Careers', path: '/careers' },
  ];

  return (
    <motion.nav 
      ref={menuRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0, stiffness: 300, damping: 30 }}
      className={`fixed top-4 inset-x-0 mx-auto z-50 w-[calc(100%-2rem)] md:w-max rounded-full flex items-center justify-between px-4 md:px-6 py-3 transition-all duration-300 ${
        scrolled || isOpen
          ? 'bg-white/70 dark:bg-black/70 backdrop-blur-xl shadow-lg border border-slate-200/50 dark:border-white/10' 
          : 'bg-transparent border border-transparent'
      }`}
    >
      {/* Left: Logo */}
      <div className="flex-1 md:flex-none flex justify-start z-10">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
            <CircleDot size={22} className="text-primary" strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-white m-0 transition-colors mr-2 md:mr-8">
            InvoviumAI
          </h2>
        </Link>
      </div>

      {/* Center: Nav links */}
      <div className="hidden md:flex justify-center items-center gap-8 z-10 shrink-0">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path}
            className={`text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 transform ${
              location.pathname === link.path 
                ? 'text-primary' 
                : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right: Theme toggle + CTA */}
      <div className="hidden md:flex md:flex-none justify-end items-center gap-4 z-10 ml-8">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 hover:text-primary transition-colors focus:outline-none"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Link to="/contact" className="btn-primary !px-5 !py-2 !h-9 text-xs">
          Contact <ArrowRight size={14} />
        </Link>
      </div>

      {/* Mobile: Hamburger + Theme Toggle */}
      <div className="md:hidden flex flex-1 justify-end items-center gap-3 z-10">
        <button 
          onClick={toggleTheme} 
          className="p-2 text-slate-600 dark:text-gray-300 hover:text-primary transition-colors focus:outline-none"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-slate-900 dark:text-white hover:text-primary transition-colors focus:outline-none p-1"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[calc(100%+12px)] left-0 w-full bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 p-6 flex flex-col gap-4 shadow-2xl rounded-3xl md:hidden overflow-hidden origin-top"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className={`block text-lg font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                      location.pathname === link.path ? 'text-primary' : 'text-slate-800 dark:text-gray-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                  <div className="h-px bg-slate-200 dark:bg-white/10 w-full mt-4 transition-colors"></div>
                </div>
              ))}
              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="block text-lg font-bold uppercase tracking-wider text-slate-800 dark:text-gray-100 inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                Contact <ArrowRight size={16}/>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
