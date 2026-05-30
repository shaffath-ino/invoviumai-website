import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, BookOpen, GraduationCap, ArrowLeft, LogOut, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [studentsRes, paymentsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/admin/students`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/payments/all`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setStudents(studentsRes.data);
        setPayments(paymentsRes.data);
      } catch {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userRole, navigate]);

  const handleRefund = async (paymentId) => {
    if (!window.confirm("Are you sure you want to refund this payment?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/payments/refund`, { paymentId }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Refund processed successfully');
      setPayments(payments.map(p => p.paymentId === paymentId ? { ...p, status: 'Refunded' } : p));
    } catch {
      toast.error('Failed to process refund');
    }
  };

  const handleVerifyManual = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/payments/verify-manual`, { paymentId }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Payment verified successfully');
      setPayments(payments.map(p => p._id === paymentId ? { ...p, status: 'Captured' } : p));
    } catch {
      toast.error('Failed to verify payment');
    }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/payments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Payment deleted');
      setPayments(payments.filter(p => p._id !== id));
    } catch {
      toast.error('Failed to delete payment');
    }
  };

  const handleDeleteEnrollment = async (enrollmentId, studentId) => {
    if (!window.confirm("Are you sure you want to remove this enrollment?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/enrollment/${enrollmentId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Enrollment removed');
      
      setStudents(students.map(s => {
        if (s._id === studentId) {
          return { ...s, enrollments: s.enrollments.filter(e => e._id !== enrollmentId) };
        }
        return s;
      }));
    } catch {
      toast.error('Failed to remove enrollment');
    }
  };

  const totalRevenue = payments.filter(p => p.status === 'Captured').reduce((acc, curr) => acc + curr.amount, 0);
  const successfulPayments = payments.filter(p => p.status === 'Captured').length;
  const failedPayments = payments.filter(p => p.status === 'Failed').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (userRole !== 'admin') return null;

  return (
    <div className="w-full relative px-6 py-24 min-h-screen flex flex-col max-w-7xl mx-auto z-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-gray-400">Monitor student enrollments and progress.</p>
        </div>
        <button onClick={handleLogout} className="btn-outline flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-500/10">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('students')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'students' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-200'}`}
        >
          Students
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'payments' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-200'}`}
        >
          Payments & Revenue
        </button>
      </div>

      {loading ? (
        <div className="text-center text-slate-500">Loading admin data...</div>
      ) : activeTab === 'students' ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-gray-300">
              <thead className="text-xs uppercase bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Enrollments</th>
                  <th className="px-6 py-4">Status / Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{student.name}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">
                      {student.enrollments && student.enrollments.length > 0 ? (
                        <div className="space-y-2">
                          {student.enrollments.map((e) => (
                            <div key={e._id} className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold inline-block mr-2">
                              {e.courseId?.title || 'Unknown Course'}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No enrollments</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.enrollments && student.enrollments.length > 0 ? (
                        <div className="space-y-2">
                          {student.enrollments.map((e) => (
                            <div key={e._id} className="flex items-center gap-2 text-xs">
                              <span className={`px-2 py-1 rounded-full font-bold ${e.status === 'Activated' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                {e.status}
                              </span>
                              {e.status === 'Activated' && (
                                <span className="text-slate-500">Stage: {e.currentStage || 'Beginner'}</span>
                              )}
                              <button 
                                onClick={() => handleDeleteEnrollment(e._id, student._id)}
                                className="ml-auto text-red-500 hover:text-red-600 hover:underline px-2 py-1"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 border-l-4 border-l-green-500">
              <p className="text-sm font-bold text-slate-500 uppercase">Total Revenue</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">₹{totalRevenue}</h3>
            </div>
            <div className="glass-card p-6 border-l-4 border-l-primary">
              <p className="text-sm font-bold text-slate-500 uppercase">Successful Payments</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{successfulPayments}</h3>
            </div>
            <div className="glass-card p-6 border-l-4 border-l-red-500">
              <p className="text-sm font-bold text-slate-500 uppercase">Failed Payments</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{failedPayments}</h3>
            </div>
          </div>
          
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-gray-300">
                <thead className="text-xs uppercase bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{payment.userId?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">{payment.courseId?.title || 'Unknown Course'}</td>
                      <td className="px-6 py-4 font-mono">₹{payment.amount}</td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {payment.status === 'Captured' && (
                            <button 
                              onClick={() => handleRefund(payment.paymentId)}
                              className="text-xs text-orange-500 hover:text-orange-600 border border-orange-500 hover:bg-orange-500/10 px-3 py-1 rounded"
                            >
                              Refund
                            </button>
                          )}
                          {payment.status === 'Pending_Verification' && (
                            <button 
                              onClick={() => handleVerifyManual(payment._id)}
                              className="text-xs text-green-500 hover:text-green-600 border border-green-500 hover:bg-green-500/10 px-3 py-1 rounded font-bold"
                            >
                              Verify
                            </button>
                          )}
                          {payment.screenshotUrl && (
                            <a 
                              href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${payment.screenshotUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 border border-primary hover:bg-primary/10 px-3 py-1 rounded"
                            >
                              <Eye size={14} /> View
                            </a>
                          )}
                          <button 
                            onClick={() => handleDeletePayment(payment._id)}
                            className="text-xs text-red-500 hover:text-red-600 border border-red-500 hover:bg-red-500/10 px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
