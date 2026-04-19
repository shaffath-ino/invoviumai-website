import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowUpRight, Cpu, ShieldCheck, PhoneCall, BarChart2, Activity } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

function TiltCard({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [8, -8]);
  const rotateY = useTransform(x, [-200, 200], [-8, 8]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0); y.set(0);
  }

  return (
    <motion.div style={{ perspective: 1200 }} variants={fadeUp} className="w-full h-full">
      <motion.div style={{ rotateX, rotateY }} onMouseMove={handleMouse} onMouseLeave={handleMouseLeave} className="w-full h-full cursor-pointer">
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const genericServices = [
    { title: "AI Solutions", icon: Cpu, desc: "Bespoke artificial intelligence pipelines integrating natively with enterprise datasets for predictive autonomy." },
    { title: "Insurance Management Systems", icon: ShieldCheck, desc: "End-to-end policy lifecycle oversight optimizing workflows and tracking multi-tier premium models seamlessly." },
    { title: "Telecalling Platforms", icon: PhoneCall, desc: "Automate outbound communications mapping sophisticated lead assignments directly into your central CRM." },
    { title: "Workflow Automation", icon: Activity, desc: "Eliminate manual overhead with instantaneous sub-ms robotic process integration across your infrastructure." },
    { title: "Data Analytics", icon: BarChart2, desc: "Ingest massive operational pipelines to forge real-time global synchronous infrastructure tracking." }
  ];

  return (
    <div className="w-full relative px-6 py-24 max-w-7xl mx-auto">
      {/* Services Intro */}
      <div className="text-center mb-24 max-w-3xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-black mb-8 leading-[1.1]">
           Core <span className="text-gradient">Capabilities</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-xl text-gray-400 leading-relaxed">
          Robust, scalable, and intelligent. We construct elite digital infrastructures designed to handle absolute capacity.
        </motion.p>
      </div>

      {/* 3. Services Section */}
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {genericServices.map((svc, i) => (
          <TiltCard key={i}>
            <div className="glass-card p-8 flex flex-col h-full group transition-all duration-300">
               <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all mb-6 group-hover:shadow-[0_0_15px_rgba(230,57,70,0.3)]">
                 <svc.icon size={28} className="text-primary" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-wide">{svc.title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed mb-6">{svc.desc}</p>
               <div className="mt-auto group-hover:translate-x-2 transition-transform duration-300">
                 <ArrowUpRight size={20} className="text-primary opacity-50 group-hover:opacity-100" />
               </div>
            </div>
          </TiltCard>
        ))}
      </motion.div>

      {/* Key Projects Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20 border-t border-white/5 pt-24">
        
        {/* 4. First Project */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-10 lg:p-14 relative overflow-hidden group border-primary/20 hover:border-primary/50 transition-colors shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 relative z-10">MMS Broking Platform</h4>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 relative z-10">Take Full Control of Your Insurance Business with AI.</h2>
          <p className="text-gray-400 mb-8 leading-relaxed relative z-10">
            An advanced AI-powered vehicle insurance management platform designed to simplify, automate, and scale your operations. From tracking high-volume premiums to monitoring payouts and policy lifecycles across diverse segments (2-wheelers, private cars, commercial), everything is unified within a single intelligent dashboard.
          </p>
          <ul className="space-y-4 mb-8 relative z-10 border-t border-white/10 pt-8 mt-auto">
             {['Centralized Policy & Premium Tracking', 'Real-Time Insights & Advanced Filtering', 'Automated Claims & Payout Monitoring', 'Multi-Segment Vehicle Support'].map((feat, k) => (
               <li key={k} className="flex items-center text-sm font-semibold text-slate-900 dark:text-white">
                 <ShieldCheck size={16} className="text-primary mr-3" /> {feat}
               </li>
             ))}
          </ul>
        </motion.div>

        {/* 5. Second Project */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-10 lg:p-14 relative overflow-hidden group border-secondary/20 hover:border-secondary/50 transition-colors shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] group-hover:bg-secondary/30 transition-colors" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 relative z-10">Intelligent Telecalling</h4>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 relative z-10">Smart Telecalling Platform for Seamless Policy Renewal.</h2>
          <p className="text-gray-400 mb-8 leading-relaxed relative z-10">
            Transform the way you manage policy renewals with a results-driven telecalling platform. Intelligently track upcoming expiries, equip telecallers with centralized lead data, and automate reminders so your team never misses a follow-up. Designed to maximize conversion rates and streamline customer outreach.
          </p>
          <ul className="space-y-4 mb-8 relative z-10 border-t border-white/10 pt-8 mt-auto">
             {['Automated Expiry Identification & Tracking', 'Centralized Telecaller Leaderboards & CRM', 'Real-Time Status & Interaction Updates', 'Missed Follow-Up Prevention'].map((feat, k) => (
               <li key={k} className="flex items-center text-sm font-semibold text-slate-900 dark:text-white">
                 <PhoneCall size={16} className="text-primary mr-3" /> {feat}
               </li>
             ))}
          </ul>
        </motion.div>

      </div>
    </div>
  );
}
