import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function OfferLetter() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    college: '',
    startDate: ''
  });

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/course/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = response.data.find(e => e._id === enrollmentId);
        if (found) {
          if (!found.courseId) {
            toast.error('The associated course is no longer available.');
            navigate('/dashboard');
            return;
          }
          if (found.status === 'Enrolled') {
            toast.error('Please complete payment first');
            navigate(`/payment/${enrollmentId}`);
            return;
          }
          setEnrollment(found);
        } else {
          toast.error('Enrollment not found');
          navigate('/dashboard');
        }
      } catch {
        toast.error('Failed to load enrollment details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [enrollmentId, navigate]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/course/generate-offer-letter`, 
        { enrollmentId, ...formData }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Offer letter generated successfully!');
      navigate('/my-courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate offer letter');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full relative px-6 py-12 md:py-24 min-h-screen flex flex-col items-center max-w-4xl mx-auto z-10">
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

        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Generate Offer Letter</h2>
        </div>

        {enrollment && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Course Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Course:</span> {enrollment.courseId.title}</p>
                <p><span className="font-medium">Duration:</span> {enrollment.courseId.duration}</p>
                <p><span className="font-medium">Amount Paid:</span> ₹{enrollment.paymentDetails?.amount || enrollment.courseId.price}</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">College/University</label>
                    <input
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({...formData, college: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Enter your college name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={generating}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                {generating ? 'Generating...' : 'Generate Offer Letter'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}