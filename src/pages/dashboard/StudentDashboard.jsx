import React, { useContext, useState, useEffect } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers,
  LogOut,
  Target
} from 'lucide-react';
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

const getRemainingLevels = (enrollment) => {
  if (!enrollment || enrollment.status !== 'activated') return STAGES.length;
  return Math.max(STAGES.length - getStageIndex(enrollment.currentStage) - 1, 0);
};

const getOverallProgress = (enrollments) => {
  if (enrollments.length === 0) return 0;
  const totalProgress = enrollments.reduce((total, enrollment) => total + getCourseProgress(enrollment), 0);
  return Math.round(totalProgress / enrollments.length);
};

const getTotalRemainingLevels = (enrollments) => {
  return enrollments.reduce((total, enrollment) => total + getRemainingLevels(enrollment), 0);
};

const getDaysLeft = (enrollment) => {
  const endDate = enrollment?.additionalDetails?.endDate;
  if (!endDate) return null;

  const today = new Date();
  const end = new Date(endDate);
  const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return Math.max(daysLeft, 0);
};

const getCoursePeriod = (enrollment) => {
  const details = enrollment?.additionalDetails;
  if (details?.startDate && details?.endDate) {
    return `${new Date(details.startDate).toLocaleDateString()} - ${new Date(details.endDate).toLocaleDateString()}`;
  }

  return details?.courseDuration || enrollment?.courseId?.duration || 'Not scheduled';
};

const getCreditPoints = (enrollments) => {
  return enrollments.reduce((total, enrollment) => total + Math.round(getCourseProgress(enrollment) * 1.5), 0);
};

const getNearestDaysLeft = (enrollments) => {
  const days = enrollments
    .map((enrollment) => getDaysLeft(enrollment))
    .filter((value) => value !== null);

  if (days.length === 0) return null;
  return Math.min(...days);
};

const getStatusText = (status) => {
  switch (status) {
    case 'activated':
      return 'Start Learning';
    case 'paid':
      return 'Generate Offer Letter';
    case 'enrolled':
      return 'Complete Payment';
    default:
      return status || 'View Details';
  }
};

export default function StudentDashboard() {
  const { firstName, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/course/my-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollments(response.data);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('username');
    if (logout) logout();
    navigate('/login');
  };

  const handleOpenCourse = (enrollment) => {
    if (enrollment.status === 'activated') {
      navigate(`/course/${enrollment._id}`);
    } else if (enrollment.status === 'paid') {
      navigate(`/offer-letter/${enrollment._id}`);
    } else {
      navigate(`/payment/${enrollment._id}`);
    }
  };

  const activeEnrollment = enrollments.find((enrollment) => enrollment.status === 'activated') || enrollments[0];
  const progress = getOverallProgress(enrollments);
  const remainingLevels = getTotalRemainingLevels(enrollments);
  const daysLeft = getNearestDaysLeft(enrollments);
  const creditPoints = getCreditPoints(enrollments);
  const chartItems = enrollments.length
    ? enrollments.map((enrollment) => ({
        label: enrollment.courseId?.title || 'Course',
        value: getCourseProgress(enrollment)
      }))
    : [{ label: 'No courses', value: 0 }];
  const chartPoints = chartItems
    .map((item, index) => {
      const x = chartItems.length === 1 ? 280 : 40 + (index * 480) / (chartItems.length - 1);
      const y = 180 - item.value * 1.4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full relative px-6 py-24 min-h-[90vh] flex flex-col items-center max-w-7xl mx-auto z-10 transition-colors">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="w-full glass-card p-6 md:p-10 relative overflow-hidden shadow-2xl group transition-all">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <GraduationCap size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">Intern Courses Dashboard</h2>
              <p className="text-slate-500 dark:text-gray-400 font-medium">Welcome back, {firstName || 'Student'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/my-courses')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold border border-primary/30 hover:bg-primary/20 transition-all">
              <BookOpen size={16} /> My Courses
            </button>
            <button onClick={() => navigate('/download-offer-letter')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-500 font-bold border border-blue-500/30 hover:bg-blue-500/20 transition-all">
              <FileText size={16} /> Download Offer Letter
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/30 hover:bg-red-500/20 transition-all">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-600 dark:text-gray-300">Loading dashboard...</div>
        ) : (
          <div className="space-y-8">
            {enrollments.length === 0 ? (
              <section className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/5 text-center">
                <BookOpen size={44} className="text-slate-400 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No course progress yet</h3>
                <p className="text-slate-500 dark:text-gray-400">Choose an intern course to start tracking levels, period, and credit points.</p>
                <button onClick={() => navigate('/intern-courses')} className="mt-5 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                  Browse Intern Courses
                </button>
              </section>
            ) : (
              <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Overall Progress</p>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">Course Completion</h3>
                      <p className="text-slate-500 dark:text-gray-400 mt-1">{enrollments.length} enrolled course{enrollments.length > 1 ? 's' : ''} tracked</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-4xl font-black text-primary">{progress}%</p>
                      <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Overall completed</p>
                    </div>
                  </div>

                  <div className="h-4 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-6">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white/70 dark:bg-black/20 border border-slate-200 dark:border-white/10">
                      <Layers size={20} className="text-primary mb-3" />
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{remainingLevels}</p>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Total levels left</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/70 dark:bg-black/20 border border-slate-200 dark:border-white/10">
                      <CalendarDays size={20} className="text-blue-500 mb-3" />
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{daysLeft ?? enrollments.length}</p>
                      <p className="text-sm text-slate-500 dark:text-gray-400">{daysLeft === null ? 'Active courses' : 'Nearest days left'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/70 dark:bg-black/20 border border-slate-200 dark:border-white/10">
                      <Award size={20} className="text-amber-500 mb-3" />
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{creditPoints}</p>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Credit points</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/5">
                  <div className="flex items-center gap-3 mb-5">
                    <Target size={22} className="text-primary" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Next Milestone</h3>
                </div>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
                  {remainingLevels === 0
                    ? 'All tracked course levels are complete. Keep reviewing your lessons to hold the score.'
                    : `${activeEnrollment?.courseId?.title || 'Your active course'} is next to continue. ${remainingLevels} total level${remainingLevels > 1 ? 's' : ''} left across your courses.`}
                </p>
                  <button onClick={() => navigate('/my-courses')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                    View Course Details <ChevronRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {enrollments.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Course Details</h3>
                    <p className="text-slate-500 dark:text-gray-400">Open a course to continue learning, payment, or offer letter steps.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {enrollments.map((enrollment) => {
                    const courseProgress = getCourseProgress(enrollment);

                    return (
                      <div
                        key={enrollment._id}
                        className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white">{enrollment.courseId?.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">{enrollment.courseId?.description}</p>
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {enrollment.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4 text-sm text-slate-600 dark:text-gray-300">
                          <p><span className="font-bold text-slate-800 dark:text-white">Duration:</span> {enrollment.courseId?.duration}</p>
                          <p><span className="font-bold text-slate-800 dark:text-white">Amount:</span> ₹{enrollment.paymentDetails?.amount || enrollment.courseId?.price}</p>
                          <p><span className="font-bold text-slate-800 dark:text-white">Course period:</span> {getCoursePeriod(enrollment)}</p>
                        </div>

                        <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
                          <span>{enrollment.currentStage || 'Beginner'}</span>
                          <span>{courseProgress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-4">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${courseProgress}%` }} />
                        </div>

                        <button onClick={() => handleOpenCourse(enrollment)} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                          {getStatusText(enrollment.status)} <ChevronRight size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {enrollments.length > 0 && (
              <section className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 size={24} className="text-primary" />
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Performance Chart</h3>
                    <p className="text-slate-500 dark:text-gray-400">Progress across your intern courses.</p>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <svg viewBox="0 0 560 220" className="min-w-[560px] w-full h-64" role="img" aria-label="Course performance chart">
                    <line x1="40" y1="40" x2="40" y2="180" className="stroke-slate-300 dark:stroke-white/20" strokeWidth="2" />
                    <line x1="40" y1="180" x2="520" y2="180" className="stroke-slate-300 dark:stroke-white/20" strokeWidth="2" />
                    {[0, 25, 50, 75, 100].map((value) => (
                      <g key={value}>
                        <line x1="40" y1={180 - value * 1.4} x2="520" y2={180 - value * 1.4} className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" />
                        <text x="12" y={185 - value * 1.4} className="fill-slate-500 dark:fill-gray-400 text-[11px] font-bold">{value}</text>
                      </g>
                    ))}
                    <polyline points={chartPoints} fill="none" className="stroke-primary" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    {chartItems.map((item, index) => {
                      const x = chartItems.length === 1 ? 280 : 40 + (index * 480) / (chartItems.length - 1);
                      const y = 180 - item.value * 1.4;

                      return (
                        <g key={item.label}>
                          <circle cx={x} cy={y} r="7" className="fill-primary" />
                          <text x={x} y="205" textAnchor="middle" className="fill-slate-600 dark:fill-gray-300 text-[11px] font-bold">
                            {item.label.length > 14 ? `${item.label.slice(0, 14)}...` : item.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
