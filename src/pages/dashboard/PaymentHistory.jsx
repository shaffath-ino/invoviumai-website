import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, CreditCard, Download, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data);
      } catch {
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const downloadInvoice = (paymentId) => {
    navigate(`/invoice/${paymentId}`);
  };

  return (
    <div className="w-full relative px-6 py-24 min-h-screen flex flex-col max-w-5xl mx-auto z-10">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Payment History</h2>
          <p className="text-slate-500 dark:text-gray-400">View all your transactions and invoices.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary pointer-events-none" />

        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-10">
            <Receipt size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No payments yet</h3>
            <p className="text-slate-500">You haven't made any purchases yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl">Date</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3 rounded-tr-xl">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {payments.map(payment => (
                  <tr key={payment._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-gray-300">
                    <td className="px-4 py-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{payment.courseId?.title || 'Unknown'}</td>
                    <td className="px-4 py-4">₹{payment.amount}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        payment.status === 'Captured' ? 'bg-green-500/20 text-green-500' :
                        payment.status === 'Failed' ? 'bg-red-500/20 text-red-500' :
                        payment.status === 'Refunded' ? 'bg-orange-500/20 text-orange-500' :
                        payment.status === 'Pending_Verification' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono">{payment.paymentId || payment.orderId}</td>
                    <td className="px-4 py-4">
                      {payment.status === 'Captured' && (
                        <button 
                          onClick={() => downloadInvoice(payment._id)}
                          className="flex items-center gap-1 text-primary hover:underline text-xs font-bold"
                        >
                          <Download size={14} /> PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
