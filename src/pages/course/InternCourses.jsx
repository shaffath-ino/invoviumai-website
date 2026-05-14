import React, { useContext, useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, CreditCard, GraduationCap, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const STAGES = ['Beginner', 'Intermediate', 'Advanced'];

const getStageIndex = (stage) => {
  const index = STAGES.indexOf(stage);
  return index === -1 ? 0 : index;
};

const getCourseProgress = (enrollment) => {
  if (!enrollment || enrollment.status !== 'activated') return 0;
  return Math.round(((getStageIndex(enrollment.currentStage) + 1) / STAGES.length) * 100);
};

const getStatusText = (status) => {
  switch (status) {
    case 'activated':
      return 'Learning';
    case 'paid':
      return 'Offer letter pending';
    case 'enrolled':
      return 'Payment pending';
    default:
      return status || 'Not started';
  }
};

export default function InternCourses() {
  const { firstName, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [coursesResponse, enrollmentsResponse] = await Promise.all([
        axios.get('http://187.127.166.185:5000/api/course/courses', { headers }),
        axios.get('http://187.127.166.185:5000/api/course/my-courses', { headers })
      ]);
      setCourses(coursesResponse.data);
      setEnrollments(enrollmentsResponse.data);
    } catch {
      toast.error('Failed to load intern courses');
    } finally {
      setLoading(false);
    }
  };

  const getCourseEnrollment = (courseId) => {
    return enrollments.find((enrollment) => enrollment.courseId?._id === courseId);
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://187.127.166.185:5000/api/course/enroll',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Enrolled successfully!');
      const url = `${window.location.origin}/payment/${response.data.enrollmentId}`;
      window.open(url, '_blank');
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
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
    <div className="w-full relative px-6 py-24 min-h-screen flex flex-col items-center max-w-7xl mx-auto z-10">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="w-full glass-card p-6 md:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <GraduationCap size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Intern Courses</h2>
              <p className="text-slate-500 dark:text-gray-400 font-medium">Welcome back, {firstName || 'Student'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/my-courses')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold border border-primary/30 hover:bg-primary/20 transition-all">
              <BookOpen size={16} /> My Courses
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/30 hover:bg-red-500/20 transition-all">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-600 dark:text-gray-300">Loading intern courses...</div>
        ) : courses.length === 0 ? (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 text-center text-slate-500 dark:text-gray-400">
            No intern courses available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, index) => {
              const enrollment = getCourseEnrollment(course._id);
              const courseProgress = getCourseProgress(enrollment);

              return (
                <div
                  key={course._id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:border-primary/50 hover:-translate-y-1 transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{course.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                        {enrollment ? getStatusText(enrollment.status) : `Duration: ${course.duration}`}
                      </p>
                    </div>
                    <span className="text-xl font-black text-primary">₹{course.price}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-300 mb-4 line-clamp-2">{course.description}</p>
                  {enrollment ? (
                    <>
                      <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
                        <span>{enrollment.currentStage || 'Beginner'}</span>
                        <span>{courseProgress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-4">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${courseProgress}%` }} />
                      </div>
                      <button onClick={() => navigate('/my-courses')} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-bold border border-green-500/30 hover:bg-green-500/20 transition-all">
                        <CheckCircle size={16} /> Open My Courses
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-3 mt-auto">
                      <button 
                        onClick={() => navigate(`/course-details/${course._id}`)} 
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-200 font-bold hover:bg-slate-300 dark:hover:bg-white/20 transition-all text-sm"
                      >
                        <BookOpen size={16} /> Syllabus
                      </button>
                      <button 
                        onClick={() => handleEnroll(course._id)} 
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all text-sm"
                      >
                        <CreditCard size={16} /> Enroll
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
