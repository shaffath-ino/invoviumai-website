import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, TerminalSquare, ShieldCheck, Zap, Globe, Sparkles, Cpu } from 'lucide-react';

import bannerImg from '../../assets/banner.jpeg';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

function AnimatedCounter({ from, to, symbol = "" }) {
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    
    let animationControls;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animationControls = animate(from, to, {
          duration: 2,
          ease: "easeOut",
          onUpdate(val) {
            if (nodeRef.current) {
              nodeRef.current.textContent = Math.floor(val).toLocaleString() + symbol;
            }
          }
        });
        observer.disconnect();
      }
    });
    observer.observe(node);
    
    return () => {
      observer.disconnect();
      if (animationControls) {
        animationControls.stop();
      }
    };
  }, [from, to, symbol]);
  return <span ref={nodeRef}>{from}{symbol}</span>;
}

const Home = React.memo(function Home() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);
  const yOrbs = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <div className="w-full relative overflow-hidden">
      <motion.div style={{ y: yOrbs }} className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <motion.div style={{ y: yOrbs }} className="absolute top-80 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />

      {/* 1. Hero Section */}
      <section className="relative px-6 py-32 md:py-48 flex flex-col items-center justify-center text-center min-h-[90vh] max-w-5xl mx-auto z-10">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-10 backdrop-blur-md shadow-[0_0_20px_rgba(230,57,70,0.15)]">
            <Sparkles size={14} className="animate-pulse" /> InoviumAI Intelligence
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8 text-slate-900 dark:text-white transition-colors">
            Intelligent Infrastructure.<br className="hidden md:block" />
            <span className="text-gradient">Built for Scale.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-2xl font-medium leading-relaxed mb-12 transition-colors">
            Accelerate your enterprise with next-generation AI workflows, automated telemetry, and zero-latency operational systems.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center">
            <Link to="/contact" className="btn-primary w-full sm:w-auto relative group overflow-hidden">
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
              <span className="relative z-10 flex items-center justify-center gap-2">Get Started <ArrowRight size={16} /></span>
            </Link>
            <Link to="/contact" className="btn-outline w-full sm:w-auto hover:bg-white/10">
              Book Demo
            </Link>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: yBg, willChange: "transform" }} className="mt-24 w-full relative z-10 perspective-[2000px]">
          <motion.div
            initial={{ opacity: 0, rotateX: 20, y: 120, z: 0 }}
            animate={{ opacity: 1, rotateX: 0, y: -20, z: 0 }}
            transition={{ duration: 1.5, delay: 0.5, type: "spring", stiffness: 100 }}
            style={{ willChange: "transform, opacity" }}
            className="w-full glass-card max-w-5xl mx-auto p-2 md:p-4 flex items-center justify-center relative shadow-2xl group transition-all duration-500"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: "transform" }}
              className="w-full bg-white dark:bg-black rounded-2xl overflow-hidden relative border border-slate-200 dark:border-white/10 flex items-center justify-center p-8 md:p-16"
            >
              <img src={bannerImg} alt="Inovium AI Private Limited" className="w-full max-w-4xl h-auto rounded-[40px] drop-shadow-[0_0_25px_rgba(230,57,70,0.5)] transform group-hover:scale-105 transition-transform duration-700 ease-out" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Why Choose Us */}
      <section className="px-6 py-32 bg-slate-50/50 dark:bg-black/40 border-y border-slate-200 dark:border-white/5 relative z-100 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-20">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">Why Choose Us</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 dark:text-gray-400 max-w-xl mx-auto text-lg transition-colors">Engineered for extreme reliability, deep integrations, and immediate operational clarity.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Globe, name: "Scalable Architecture" },
              { icon: Cpu, name: "AI-Driven Systems" },
              { icon: Activity, name: "Real-Time Insights" },
              { icon: Zap, name: "High Performance" },
              { icon: ShieldCheck, name: "Reliable Solutions" }
            ].map((feature, idx) => (
              <motion.div
                key={idx} variants={fadeUp}
                whileHover={{ y: -5, scale: 1.05 }}
                className="glass-card p-6 flex flex-col items-center text-center gap-4 group transform transition-all duration-300"
              >
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors border border-slate-200 dark:border-white/10 group-hover:border-primary/50">
                  <feature.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-base font-bold mt-2 text-slate-800 dark:text-white transition-colors">{feature.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Stats / About Context */}
      <section className="px-6 py-32 max-w-7xl mx-auto relative z-10 border-b border-slate-200 dark:border-white/5 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-[1.1] text-slate-900 dark:text-white">Transforming Enterprise Potential.</h2>
            <p className="text-slate-600 dark:text-gray-400 mb-6 text-lg leading-relaxed transition-colors">
              InoviumAI builds next-generation, high-availability software platforms. We optimize massive workflows through intelligent automation and rigorous systems engineering.
            </p>
            <ul className="space-y-4 mb-10">
              {['Accelerate Core Operations', 'Zero-Friction Integrations', 'Uncompromising Data Security'].map((i, k) => (
                <li key={k} className="flex items-center gap-4 text-sm font-bold text-slate-800 dark:text-white transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> {i}
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-outline">More About Us</Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center sm:col-span-2 border-primary/20 bg-gradient-to-br from-white to-slate-50 dark:from-cardDark dark:to-dark group hover:-translate-y-2 transition-transform shadow-md dark:shadow-2xl">
              <span className="text-6xl font-black text-primary mb-3 drop-shadow-none dark:drop-shadow-[0_0_15px_rgba(230,57,70,0.4)]"><AnimatedCounter from={0} to={250} symbol="M+" /></span>
              <span className="text-slate-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Requests Verified Daily</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center group hover:-translate-y-2 transition-transform">
              <span className="text-4xl font-black text-slate-900 dark:text-white mb-2 transition-colors"><AnimatedCounter from={100} to={99} symbol="%" /></span>
              <span className="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Automated Processing</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center group hover:-translate-y-2 transition-transform">
              <span className="text-4xl font-black text-slate-900 dark:text-white mb-2 transition-colors"><TerminalSquare size={36} className="text-slate-900 dark:text-white mx-auto" /></span>
              <span className="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors mt-2">API-First Design</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Large Branding / CTA Showcase */}
      <section className="px-4 py-16 md:py-24 max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full relative rounded-[40px] overflow-hidden shadow-2xl group border border-slate-200 dark:border-white/10 bg-black"
        >
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none transition-opacity duration-700"></div>

          <img
            src="/InoviumAI.png"
            alt="Inovium AI Platform"
            loading="lazy"
            className="w-full h-[400px] md:h-[600px] object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000 ease-out"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 md:p-16 z-20">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-2xl"
            >
              Transform Your <span className="text-primary">Operations</span>
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mb-10 drop-shadow-lg"
            >
              Leverage advanced artificial intelligence and scalable software infrastructure to drive operational efficiency, ensure robust security, and achieve sustainable enterprise growth.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link
                to="/contact"
                className="btn-primary text-lg px-8 py-4 shadow-[0_0_20px_rgba(230,57,70,0.5)] hover:shadow-[0_0_40px_rgba(230,57,70,0.8)] transition-shadow"
              >
                Schedule a Consultation
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
});

export default Home;
