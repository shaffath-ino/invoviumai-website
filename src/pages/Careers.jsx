import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowUpRight, Zap, Search } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Careers() {
  const [filter, setFilter] = useState('');
  
  const jobs = [
    { id: 1, title: "Senior AI/ML Engineer", dept: "Engineering", type: "Full-Time", location: "Remote / Global", link: "/contact" },
    { id: 2, title: "Systems Architect (Platform)", dept: "Infrastructure", type: "Full-Time", location: "New York, NY", link: "/contact" },
    { id: 3, title: "Lead Frontend Developer", dept: "Engineering", type: "Full-Time", location: "Remote", link: "/contact" },
    { id: 4, title: "Security Operations Analyst", dept: "Cybersecurity", type: "Contract", location: "London, UK", link: "/contact" },
    { id: 5, title: "Data Pipeline Engineer", dept: "Infrastructure", type: "Full-Time", location: "San Francisco, CA", link: "/contact" }
  ];

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(filter.toLowerCase()) || 
    job.dept.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="w-full relative px-6 py-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20 border-b border-white/5 pb-16">
        <div className="max-w-2xl">
          <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-black mb-6 leading-[1.1]">
             Join the <span className="text-gradient">Core Team.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-xl text-gray-400 leading-relaxed font-medium mb-8">
            Build systems that never break. We're looking for extreme engineering talent to architect autonomous infrastructure at a global layer. 
          </motion.p>
          <motion.a 
            href="#roles" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }} 
            className="btn-primary inline-flex relative group overflow-hidden"
          >
             <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></span>
             <span className="relative font-bold">Join Our Team</span>
          </motion.a>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="glass-card p-6 flex items-center gap-4 bg-primary/10 border-primary/30 shrink-0 shadow-lg">
          <Zap size={32} className="text-primary animate-pulse" />
          <div>
            <p className="text-xs uppercase font-bold tracking-widest text-primary mb-1">Open Roles</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{jobs.length} Positions</p>
          </div>
        </motion.div>
      </div>

      {/* Modern Filter Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12 relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search by role or department..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium shadow-lg backdrop-blur-md"
        />
      </motion.div>

      {/* Jobs List using AnimatePresence for smooth filtering */}
      <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">Available Positions</h2>
      <div className="flex flex-col gap-4 min-h-[400px]">
        <AnimatePresence>
          {filteredJobs.length > 0 ? filteredJobs.map((job) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              key={job.id} 
              whileHover={{ scale: 1.01 }}
              className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer transition-all duration-300"
            >
              <div>
                 <h3 className="text-2xl font-extrabold mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{job.title}</h3>
                 <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-400 font-medium">
                   <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"><Briefcase size={14} className="text-primary" /> {job.dept}</span>
                   <span className="flex items-center gap-2"><MapPin size={14} /> {job.location}</span>
                   <span className="flex items-center gap-2"><Clock size={14} /> {job.type}</span>
                 </div>
              </div>
              
              <a href={job.link} onClick={e => e.stopPropagation()} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white/10 group-hover:bg-primary group-hover:text-slate-900 dark:text-white transition-all text-slate-900 dark:text-white font-bold tracking-wide uppercase text-xs border border-white/10 group-hover:border-primary shadow-lg">
                View Role <ArrowUpRight size={16} />
              </a>
            </motion.div>
          )) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-gray-500 font-medium text-lg border border-dashed border-white/10 rounded-3xl">
              No roles found matching "{filter}".
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
