import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Building2, LogOut, Users, Settings, Database } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CompanyDashboard() {
  const { firstName, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('username');
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="w-full relative px-6 py-24 min-h-[90vh] flex flex-col items-center max-w-7xl mx-auto z-10 transition-colors">
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-full glass-card p-8 md:p-10 relative overflow-hidden shadow-2xl group transition-all">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Building2 size={32} className="text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">Enterprise Portal</h2>
                    <p className="text-slate-500 dark:text-gray-400 font-medium">Welcome back, {firstName || 'Company Admin'}</p>
                </div>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/30 hover:bg-red-500/20 transition-all">
                <LogOut size={16} /> Terminate Session
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:border-primary/50 transition-all cursor-pointer">
                <Users size={24} className="text-primary mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Talent Acquisition</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">Review student applications and securely onboard external contractors.</p>
            </div>
            
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:border-primary/50 transition-all cursor-pointer">
                <Database size={24} className="text-primary mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">API Infrastructure</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">Manage InvoviumAI webhooks, datasets, and LLM throughput keys.</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:border-primary/50 transition-all cursor-pointer">
                <Settings size={24} className="text-primary mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Org Settings</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">Scale billing tier and provision IAM configurations for new hires.</p>
            </div>
        </div>

      </motion.div>
    </div>
  );
}
