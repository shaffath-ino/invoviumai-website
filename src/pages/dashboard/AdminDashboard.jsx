import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, BookOpen, GraduationCap, ArrowLeft, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/students', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch {
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [userRole, navigate]);

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

      {loading ? (
        <div className="text-center text-slate-500">Loading student data...</div>
      ) : (
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
                            <div key={e._id} className="text-xs">
                              <span className={`px-2 py-1 rounded-full font-bold ${e.status === 'activated' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                {e.status}
                              </span>
                              {e.status === 'activated' && (
                                <span className="ml-2 text-slate-500">Stage: {e.currentStage || 'Beginner'}</span>
                              )}
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
      )}
    </div>
  );
}
