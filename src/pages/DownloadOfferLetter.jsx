import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FileText, Download, ArrowLeft, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function DownloadOfferLetter() {
  const { firstName, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/course/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter only activated courses with offer letters
      const activatedCourses = response.data.filter(e => e.status === 'activated');
      setEnrollments(activatedCourses);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (courseId) => {
    setDownloading(courseId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/course/download-offer-letter/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `offer_letter_${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Offer letter downloaded successfully!');
    } catch {
      toast.error('Failed to download offer letter');
    } finally {
      setDownloading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('username');
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="w-full relative px-6 py-24 min-h-screen flex flex-col items-center max-w-4xl mx-auto z-10">
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6 }}
        className="w-full glass-card p-8 md:p-10 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Download Offer Letter</h2>
              <p className="text-slate-500 dark:text-gray-400 font-medium">Welcome back, {firstName || 'Student'}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/30 hover:bg-red-500/20 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading your courses...</div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-gray-400">No offer letters available. Complete your course enrollment and payment first.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-6 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-gray-400 mb-6">Select a course to download your offer letter:</p>
            {enrollments.map((enrollment) => (
              <motion.div 
                key={enrollment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{enrollment.courseId.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{enrollment.courseId.description}</p>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                      Enrolled on: {new Date(enrollment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDownload(enrollment.courseId._id)}
                    disabled={downloading === enrollment.courseId._id}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={16} />
                    {downloading === enrollment.courseId._id ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}