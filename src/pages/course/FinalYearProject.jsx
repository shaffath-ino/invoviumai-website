import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Briefcase, Video, ChevronRight, CheckCircle, Code, Database, Rocket, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FinalYearProject() {
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const projectPayment = res.data.find(p => !p.courseId && p.status === 'Captured');
        if (projectPayment) {
          setIsPaid(true);
        }
      } catch {
        console.error('Failed to fetch payment history');
      } finally {
        setLoading(false);
      }
    };
    checkPayment();
  }, []);

  return (
    <div className="w-full relative px-6 py-24 min-h-[90vh] flex flex-col items-center max-w-7xl mx-auto z-10 transition-colors">
      {/* Background glow effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full glass-card p-6 md:p-10 relative overflow-hidden shadow-2xl group transition-all"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Briefcase size={32} className="text-purple-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">Final Year Projects & Mentorship</h2>
              <p className="text-slate-500 dark:text-gray-400 font-medium">Complete academic projects with live guidance</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Project Details Card */}
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 h-full flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-sm">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                    <Briefcase size={20} className="text-purple-600 dark:text-purple-400"/>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Industry-Grade Projects</h3>
                </div>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
                  We provide fully-documented final year projects complete with source code, database architecture, and deployment support tailored for university submissions.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
                    <Code size={18} className="text-purple-500 mt-0.5 shrink-0" />
                    <span>Clean, well-documented source code</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
                    <Database size={18} className="text-purple-500 mt-0.5 shrink-0" />
                    <span>Complete database architecture and schemas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
                    <Rocket size={18} className="text-purple-500 mt-0.5 shrink-0" />
                    <span>Deployment guides and setup instructions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Live Mentorship Card */}
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 h-full flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-500/40 transition-all shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                      <Video size={20} className="text-blue-600 dark:text-blue-400"/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Live Daily Meetings</h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1.5 border border-green-200 dark:border-green-800">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 5:00 PM Daily
                  </span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Join your mentors daily to discuss project progress, review code, clear technical doubts, and prepare for your final viva voce.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span>1-on-1 code reviews and debugging sessions</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span>Viva preparation and presentation tips</span>
                  </li>
                </ul>
              </div>
              {isPaid ? (
                <a href="https://meet.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-500/20 transition-colors border border-blue-500/30">
                  Join Live Meeting <ChevronRight size={18} />
                </a>
              ) : (
                <div className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold border border-slate-200 dark:border-slate-700 cursor-not-allowed">
                  <Lock size={18} /> Meeting Link Locked
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Section */}
          {!loading && !isPaid ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-8 rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Ready to start your project?</h3>
                <p className="text-slate-600 dark:text-gray-300">Request project allocation and complete your payment to get access to source code and mentors.</p>
              </div>
              <button 
                onClick={() => navigate('/project-payment')}
                className="w-full md:w-auto flex shrink-0 items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Pay & Request Project Allocation <ChevronRight size={20} />
              </button>
            </motion.div>
          ) : !loading && isPaid && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-8 rounded-2xl border border-green-200 dark:border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 flex items-center justify-center md:justify-start gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Project Allocation Confirmed</h3>
                <p className="text-sm text-slate-600 dark:text-gray-300">Your payment has been verified. You can now join the live meetings.</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
