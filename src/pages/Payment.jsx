import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Payment() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/course/my-courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = response.data.find(e => e._id === enrollmentId);
        if (found) {
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

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/course/payment', 
        { enrollmentId, paymentMethod: 'card' }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Payment successful! Continue to generate your offer letter.');
      navigate(`/offer-letter/${enrollmentId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
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

        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Payment</h2>
        </div>

        {enrollment && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Course Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Course:</span> {enrollment.courseId.title}</p>
                <p><span className="font-medium">Duration:</span> {enrollment.courseId.duration}</p>
                <p><span className="font-medium">Amount:</span> ₹{enrollment.courseId.price}</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Payment Method</h3>
              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary/30 bg-primary/5">
                <CreditCard size={24} className="text-primary" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Credit/Debit Card</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Secure payment processing</p>
                </div>
                <CheckCircle size={20} className="text-primary ml-auto" />
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay ₹${enrollment.courseId.price}`}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}