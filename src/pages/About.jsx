import React from 'react';
import { motion } from 'framer-motion';
import { Goal, Users, Medal, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full relative px-6 py-24 max-w-7xl mx-auto">
      <div className="absolute top-0 right-0 w-1/3 h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      
      {/* Intro */}
      <section className="text-center mb-32 max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-black mb-8 leading-[1.1]">
          Pioneering the <br/><span className="text-gradient">Intelligent Edge.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-xl text-gray-400 leading-relaxed font-medium">
          InvoviumAI is a premiere engineering collective rapidly advancing enterprise architecture. We deploy high-availability AI systems designed explicitly for the extreme demands of the global operational landscape.
        </motion.p>
      </section>

      {/* Mission & Vision */}
      <section className="mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-12 lg:p-16 border-white/10 bg-gradient-to-br from-card to-black shadow-2xl relative overflow-hidden group">
            <Goal size={200} className="text-primary/5 absolute -right-10 -bottom-10 group-hover:scale-110 transition-transform duration-700" />
            <h2 className="text-3xl font-extrabold mb-8 text-slate-900 dark:text-white relative z-10">Mission & Vision</h2>
            <ul className="space-y-6 relative z-10">
              {['Engineer structural integrity that obliterates operational bottlenecks globally.', 'Implement unbreachable security margins using strict zero-trust boundaries.', 'Eradicate legacy latency by migrating architectures natively to autonomous neural cores.', 'Form absolute symbiosis with enterprise partners executing high-risk transactions.'].map((pt, i) => (
                <li key={i} className="flex items-start text-base font-medium text-gray-300">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-0.5 border border-primary/30">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <div className="flex flex-col gap-12 justify-center">
             {/* Founder Highlight */}
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-10 border-primary/20 transition-colors duration-300">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(230,57,70,0.3)]">
                   <Medal size={28} className="text-primary" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">Shaffath Hussain Shakir</h3>
                   <p className="text-primary text-xs uppercase tracking-widest font-bold">Founder & Technology Leader</p>
                 </div>
               </div>
               <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-primary/30 pl-4 py-1 italic font-medium">
                 "With over 20 years bridging software engineering, telecommunications, and large-scale system development as Principal Technical Lead at Viasat Inc., Shaffath built InvoviumAI on a foundation of extreme technical excellence and strategic vision."
               </p>
             </motion.div>

             {/* Team Strength */}
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-10 border-white/10 shadow-xl group hover:border-primary/40 transition-all flex items-start gap-6">
               <Users size={40} className="text-primary group-hover:scale-110 transition-transform mt-1 shrink-0" />
               <div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Our Engineering Core</h3>
                 <p className="text-gray-400 text-base leading-relaxed">
                   A strictly curated team of highly skilled AI/ML engineers and full-stack developers. We bring an aggressive problem-solving mindset to build solutions that exceed expectations and create measurable business impact.
                 </p>
               </div>
             </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
