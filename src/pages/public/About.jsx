import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Goal, Users, Medal, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full relative px-6 py-24 max-w-7xl mx-auto">
      <div className="absolute top-0 right-0 w-1/3 h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Intro */}
      <section className="text-center mb-32 max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-black mb-8 leading-[1.1]">
          Pioneering the <br /><span className="text-gradient">Intelligent Edge.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-xl text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
          InoviumAI is a forward-thinking engineering collective rapidly advancing enterprise architecture. We deploy intelligent, scalable systems designed to meet the growing demands of the modern digital landscape.
        </motion.p>
      </section>

      {/* Mission & Vision */}
      <section className="mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-12 lg:p-16 border-slate-200 dark:border-white/10 bg-gradient-to-br from-card to-black shadow-2xl relative overflow-hidden group">
            <Goal size={200} className="text-primary/5 absolute -right-10 -bottom-10 group-hover:scale-110 transition-transform duration-700" />
            <h2 className="text-3xl font-extrabold mb-8 text-slate-900 dark:text-white relative z-10">Mission & Vision</h2>
            <ul className="space-y-6 relative z-10">
              {['Develop robust, scalable web architectures to solve complex operational challenges.', 'Implement robust security protocols to ensure complete data integrity.', 'Leverage advanced AI/ML algorithms to optimize and automate workflows.', 'Build strong partnerships with clients through transparent, high-quality engineering.'].map((pt, i) => (
                <li key={i} className="flex items-start text-base font-medium text-slate-600 dark:text-gray-300">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-0.5 border border-primary/30">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="flex flex-col gap-12 justify-center">
            {/* Founders Highlight */}
            <div className="flex flex-col gap-6">
              {[
                {
                  name: 'Palaniappa Deepa',
                  role: 'Founder',
                  desc: '"Driving innovation and operational excellence with a strong commitment to scaling enterprise solutions and delivering unmatched value to our partners and clients."',
                  highlight: true
                },
                {
                  name: 'Arshiya Mobeen',
                  role: 'Founder',
                  desc: '"Championing technical strategy and business growth, ensuring InoviumAI remains at the forefront of AI and engineering advancements while fostering a culture of excellence."',
                  highlight: true
                }
              ].map((founder, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className={`glass-card p-6 ${founder.highlight ? 'border-primary/20 shadow-[0_0_15px_rgba(230,57,70,0.1)]' : 'border-white/5 hover:border-primary/20'} transition-all duration-300`}>
                  <div className={`flex items-center gap-4 ${founder.desc ? 'mb-4' : ''}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${founder.highlight ? 'bg-primary/20 border-primary/50' : 'bg-primary/5 border-primary/20'}`}>
                      <Medal size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{founder.name}</h3>
                      <p className="text-primary text-xs uppercase tracking-widest font-bold">{founder.role}</p>
                    </div>
                  </div>
                  {founder.desc && (
                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed border-l-2 border-primary/30 pl-4 py-1 italic font-medium">
                      {founder.desc}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Team Strength */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-10 border-slate-200 dark:border-white/10 shadow-xl group hover:border-primary/40 transition-all flex items-start gap-6">
              <Users size={40} className="text-primary group-hover:scale-110 transition-transform mt-1 shrink-0" />
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Our Engineering Core</h3>
                <p className="text-slate-600 dark:text-gray-400 text-base leading-relaxed">
                  A dedicated team of highly skilled AI/ML engineers and full-stack developers. We bring a collaborative problem-solving mindset to build solutions that exceed expectations and create measurable business impact.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
