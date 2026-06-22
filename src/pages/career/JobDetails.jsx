import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Briefcase, MapPin, Clock, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/jobs/${id}`);
        setJob(res.data);
      } catch {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading role details...</div>;
  }

  if (!job) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Job not found</div>;
  }

  return (
    <div className="w-full relative px-6 py-24 min-h-screen max-w-5xl mx-auto z-10">
      <Link to="/careers" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-10">
        <ArrowLeft size={16} /> Back to Careers
      </Link>

      <div className="glass-card p-8 md:p-12 relative overflow-hidden mb-8 shadow-2xl border-t-4 border-t-primary">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white leading-[1.1]">
          {job.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm md:text-base font-medium text-slate-600 dark:text-gray-400 mb-8 pb-8 border-b border-white/10">
          <span className="flex items-center gap-2"><Building2 size={18} className="text-primary" /> {job.dept}</span>
          <span className="flex items-center gap-2"><MapPin size={18} /> {job.location}</span>
          <span className="flex items-center gap-2"><Clock size={18} /> {job.type}</span>
          {job.experience && <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-white">{job.experience}</span>}
          {job.salary && <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-green-400">{job.salary}</span>}
          {job.openings && <span className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary font-bold">{job.openings} Openings</span>}
        </div>

        {job.description && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Role Overview</h2>
            <div className="text-slate-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap text-base">
              {job.description}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Key Responsibilities</h2>
              <ul className="space-y-4">
                {job.responsibilities.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-gray-300">
                    <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Requirements</h2>
              <ul className="space-y-4">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-2" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {job.benefits && job.benefits.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Benefits & Perks</h2>
            <div className="flex flex-wrap gap-3">
              {job.benefits.map((benefit, i) => (
                <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-gray-300">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-16 text-center border-t border-white/10 pt-10">
          <p className="text-slate-500 mb-6">To apply, please send your resume and portfolio to our hiring team.</p>
          <a href="mailto:careers@inoviumai.com" className="btn-primary inline-flex relative group overflow-hidden">
             <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></span>
             <span className="relative font-bold text-lg px-8 py-2">Email careers@inoviumai.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}
