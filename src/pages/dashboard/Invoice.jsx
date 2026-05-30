import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Printer, ArrowLeft } from 'lucide-react';

export default function Invoice() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayment(res.data);
      } catch {
        toast.error('Failed to load invoice');
        navigate('/payment-history');
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [paymentId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-500">Generating Invoice...</div>
      </div>
    );
  }

  if (!payment) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-12 px-6 font-sans print:bg-white print:py-0 print:px-0 print:min-h-0">
      
      {/* Non-printable controls */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate('/payment-history')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-bold"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Printer size={20} /> Print / Save as PDF
        </button>
      </div>

      {/* Printable Invoice */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-950 text-slate-900 dark:text-white p-10 md:p-16 rounded-xl shadow-xl border border-transparent dark:border-white/10 print:bg-white print:text-black print:border-none print:shadow-none print:p-0 print:m-0 print:w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-200 dark:border-slate-800 print:border-slate-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black text-primary mb-2">INVOICE</h1>
            <p className="text-slate-500 dark:text-slate-400 print:text-slate-500 font-medium">Receipt #{payment.paymentId || payment.orderId || payment._id}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white print:text-slate-800">InoviumAI</h2>
            <p className="text-slate-500 dark:text-slate-400 print:text-slate-500">123 Tech Park, Innovation Hub</p>
            <p className="text-slate-500 dark:text-slate-400 print:text-slate-500">billing@inoviumai.com</p>
            <p className="text-slate-500 dark:text-slate-400 print:text-slate-500">+91 99999 99999</p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 print:text-slate-400 uppercase tracking-wider mb-2">Billed To</h3>
            <p className="font-bold text-xl text-slate-800 dark:text-white print:text-slate-800">{payment.userId?.name}</p>
            <p className="text-slate-600 dark:text-slate-400 print:text-slate-600">{payment.userId?.email}</p>
          </div>
          <div className="md:text-right">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 print:text-slate-400 uppercase tracking-wider mb-2">Payment Details</h3>
            <p><span className="text-slate-500 dark:text-slate-400 print:text-slate-500 mr-2">Date:</span> <span className="font-medium dark:text-white print:text-slate-900">{new Date(payment.createdAt).toLocaleDateString()}</span></p>
            <p><span className="text-slate-500 dark:text-slate-400 print:text-slate-500 mr-2">Status:</span> <span className="font-bold text-green-600 dark:text-green-400 print:text-green-600 uppercase">{payment.status === 'Captured' ? 'PAID' : payment.status.replace('_', ' ')}</span></p>
            <p><span className="text-slate-500 dark:text-slate-400 print:text-slate-500 mr-2">Method:</span> <span className="font-medium uppercase dark:text-white print:text-slate-900">{payment.method || 'Online'}</span></p>
          </div>
        </div>

        {/* Table */}
        <div className="mb-12">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-800 print:border-slate-200 text-slate-500 dark:text-slate-400 print:text-slate-500">
                <th className="py-3 font-bold uppercase tracking-wider">Description</th>
                <th className="py-3 font-bold uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800/50 print:border-slate-100">
                <td className="py-4 font-bold text-slate-800 dark:text-white print:text-slate-800">
                  {payment.courseId?.title || 'Course Enrollment'}
                </td>
                <td className="py-4 text-right font-mono text-slate-800 dark:text-white print:text-slate-800">
                  ₹{payment.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-16">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between py-2 text-slate-500 dark:text-slate-400 print:text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono">₹{payment.amount}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-500 dark:text-slate-400 print:text-slate-500 border-b-2 border-slate-200 dark:border-slate-800 print:border-slate-200">
              <span>Tax (0%)</span>
              <span className="font-mono">₹0</span>
            </div>
            <div className="flex justify-between py-4 text-2xl font-black text-slate-900 dark:text-white print:text-slate-900">
              <span>Total Paid</span>
              <span className="font-mono text-primary">₹{payment.amount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 dark:text-slate-500 print:text-slate-400 text-sm border-t border-slate-100 dark:border-slate-800 print:border-slate-100 pt-8">
          <p>Thank you for choosing InoviumAI.</p>
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
        </div>

      </div>
    </div>
  );
}
