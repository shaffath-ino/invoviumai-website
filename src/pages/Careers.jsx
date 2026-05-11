import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowUpRight, Zap, Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

// eslint-disable-next-line no-unused-vars
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Careers() {
  const [filter, setFilter] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { userRole } = useContext(AuthContext);
  
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({ title: '', dept: '', type: 'Full-Time', location: '', link: '', description: '', experience: '', salary: '', openings: '', responsibilities: '', requirements: '', benefits: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/jobs');
      setJobs(res.data);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(filter.toLowerCase()) || 
    job.dept.toLowerCase().includes(filter.toLowerCase())
  );

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({ 
        title: job.title || '', 
        dept: job.dept || '', 
        type: job.type || 'Full-Time', 
        location: job.location || '', 
        link: job.link || '',
        description: job.description || '',
        experience: job.experience || '',
        salary: job.salary || '',
        openings: job.openings || '',
        responsibilities: job.responsibilities ? job.responsibilities.join('\n') : '',
        requirements: job.requirements ? job.requirements.join('\n') : '',
        benefits: job.benefits ? job.benefits.join('\n') : ''
      });
    } else {
      setEditingJob(null);
      setFormData({ title: '', dept: '', type: 'Full-Time', location: '', link: '', description: '', experience: '', salary: '', openings: '', responsibilities: '', requirements: '', benefits: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingJob(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const submissionData = {
        ...formData,
        responsibilities: formData.responsibilities.split('\n').map(item => item.trim()).filter(Boolean),
        requirements: formData.requirements.split('\n').map(item => item.trim()).filter(Boolean),
        benefits: formData.benefits.split('\n').map(item => item.trim()).filter(Boolean),
      };

      if (editingJob) {
        await axios.put(`http://localhost:5000/api/admin/jobs/${editingJob._id}`, submissionData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Job updated');
      } else {
        await axios.post('http://localhost:5000/api/admin/jobs', submissionData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Job created');
      }
      fetchJobs();
      handleCloseModal();
    } catch {
      toast.error('Failed to save job');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Job deleted');
      fetchJobs();
    } catch {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="w-full relative px-6 py-24 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20 border-b border-white/5 pb-16">
        <div className="max-w-2xl">
          <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-black mb-6 leading-[1.1]">
             Join <span className="text-gradient">InoviumAI.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-xl text-gray-400 leading-relaxed font-medium mb-8">
            Shape the future of intelligent digital solutions. We are looking for passionate, driven professionals to build scalable infrastructure and advanced web applications.
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

      {/* Modern Filter Search & Admin Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative w-full max-w-md">
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

        {userRole === 'admin' && (
          <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => handleOpenModal()} 
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Add New Role
          </motion.button>
        )}
      </div>

      {/* Jobs List using AnimatePresence for smooth filtering */}
      <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white" id="roles">Available Positions</h2>
      <div className="flex flex-col gap-4 min-h-[400px]">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading positions...</div>
        ) : (
          <AnimatePresence>
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                key={job._id} 
                whileHover={{ scale: 1.01 }}
                className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-all duration-300"
              >
                <div>
                   <h3 className="text-2xl font-extrabold mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors">{job.title}</h3>
                   <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-400 font-medium">
                     <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"><Briefcase size={14} className="text-primary" /> {job.dept}</span>
                     <span className="flex items-center gap-2"><MapPin size={14} /> {job.location}</span>
                     <span className="flex items-center gap-2"><Clock size={14} /> {job.type}</span>
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {userRole === 'admin' && (
                    <>
                      <button onClick={() => handleOpenModal(job)} className="p-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(job._id)} className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  <Link to={job.link || `/careers/${job._id}`} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white/10 hover:bg-primary hover:text-slate-900 dark:text-white transition-all text-slate-900 dark:text-white font-bold tracking-wide uppercase text-xs border border-white/10 hover:border-primary shadow-lg">
                    View Role <ArrowUpRight size={16} />
                  </Link>
                </div>
              </motion.div>
            )) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-gray-500 font-medium text-lg border border-dashed border-white/10 rounded-3xl">
                No roles found matching "{filter}".
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Admin Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                {editingJob ? 'Edit Role' : 'Add New Role'}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Job Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Department</label>
                  <input type="text" required value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Type</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white">
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Location</label>
                  <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Experience</label>
                    <input type="text" placeholder="e.g. 0 - 1 years" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Salary</label>
                    <input type="text" placeholder="e.g. 6 - 10 LPA" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Openings</label>
                    <input type="number" placeholder="e.g. 12" value={formData.openings} onChange={e => setFormData({...formData, openings: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Description</label>
                  <textarea rows="4" placeholder="Enter full job description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Responsibilities (One per line)</label>
                  <textarea rows="4" placeholder="Enter responsibilities..." value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Requirements (One per line)</label>
                  <textarea rows="4" placeholder="Enter requirements..." value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-gray-300">Benefits (One per line)</label>
                  <textarea rows="4" placeholder="Enter benefits..." value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} className="w-full px-3 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white"></textarea>
                </div>
                <button type="submit" className="btn-primary mt-2">
                  {editingJob ? 'Update Role' : 'Save Role'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
