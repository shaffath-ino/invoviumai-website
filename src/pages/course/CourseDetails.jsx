import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  BookOpen, ArrowLeft, CreditCard, Clock, GraduationCap, 
  Code, MonitorPlay, Award, Users, Target, Zap, CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/course/courses/${courseId}`, { headers });
        setCourse(response.data);
      } catch {
        toast.error('Failed to load course details');
        navigate('/intern-courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to enroll');
        navigate('/login');
        return;
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/course/enroll`,
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Enrolled successfully!');
      const url = `${window.location.origin}/payment/${response.data.enrollmentId}`;
      window.open(url, '_blank');
      navigate('/intern-courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (!course) return null;

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="w-full relative px-6 py-24 min-h-screen flex flex-col items-center max-w-6xl mx-auto z-10 font-sans">
      {/* Background Radiance */}
      <div className="fixed top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      
      {/* Back Button */}
      <div className="w-full mb-8 z-20">
        <button 
          onClick={() => navigate('/intern-courses')}
          className="flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all font-bold tracking-wider uppercase text-sm group"
        >
          <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" /> 
          Back to Courses
        </button>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20"
      >
        
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Header Card */}
          <motion.div variants={fadeUp} className="glass-card p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
              <Zap size={16} /> Professional Training Program
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              {course.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-300 leading-relaxed mb-8">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-6 border-t border-slate-200 dark:border-white/10 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary">
                  <MonitorPlay size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Format</p>
                  <p className="font-bold text-slate-900 dark:text-white">100% Online Workspace</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Duration</p>
                  <p className="font-bold text-slate-900 dark:text-white">{course.duration}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Overview Card */}
          {course.overview && (
            <motion.div variants={fadeUp} className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-white/10">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target size={22} className="text-primary" /> Program Overview
              </h2>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed">{course.overview}</p>
            </motion.div>
          )}

          {/* Target Audience & Prerequisites */}
          {(course.targetAudience || course.prerequisites) && (
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.targetAudience && (
                <div className="glass-card p-6 border border-slate-200 dark:border-white/10">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg flex items-center gap-2">
                    <Users className="text-primary" size={20} /> Target Audience
                  </h4>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{course.targetAudience}</p>
                </div>
              )}
              {course.prerequisites && (
                <div className="glass-card p-6 border border-slate-200 dark:border-white/10">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg flex items-center gap-2">
                    <BookOpen className="text-primary" size={20} /> Prerequisites
                  </h4>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{course.prerequisites}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Learning Outcomes */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <motion.div variants={fadeUp} className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Award className="text-primary" /> Key Learning Outcomes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-500/10 text-green-500 mt-0.5 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-300 font-medium leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Syllabus Section */}
          <motion.div variants={fadeUp} className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <BookOpen className="text-primary" /> Comprehensive 3-Month Syllabus
            </h2>
            
            <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-4 space-y-12 pb-8">
              {course.stages.map((stage, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-primary ring-4 ring-white dark:ring-slate-950 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  
                  <div className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all border border-slate-200 dark:border-white/10 hover:border-primary/30">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-primary group-hover:scale-110 group-hover:opacity-20 transition-all">
                      <GraduationCap size={64} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                      Month {index + 1}: {stage.level} Phase
                    </h3>
                    <div className="h-1 w-12 bg-primary rounded-full mb-6" />
                    
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none relative z-10 prose-p:leading-relaxed prose-headings:text-slate-800 dark:prose-headings:text-white prose-a:text-primary prose-ul:my-2 prose-li:my-1 prose-strong:text-primary">
                      <ReactMarkdown>{stage.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Projects Card */}
          {course.projectsInfo && (
            <motion.div variants={fadeUp} className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Code className="text-primary" /> Practical Projects
              </h2>
              <div className="glass-card p-6 md:p-8 space-y-6 border border-slate-200 dark:border-white/10">
                {course.projectsInfo.miniProjects && course.projectsInfo.miniProjects.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">Weekly Mini Projects</h4>
                    <ul className="space-y-3">
                      {course.projectsInfo.miniProjects.map((proj, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <span>{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {course.projectsInfo.capstoneProject && (
                  <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">Final Capstone Project</h4>
                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/20">
                      {course.projectsInfo.capstoneProject}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Assessment & Career Preparation */}
          {(course.assessmentStructure || course.careerPreparation) && (
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.assessmentStructure && (
                <div className="glass-card p-6 border border-slate-200 dark:border-white/10">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg flex items-center gap-2">
                    <Zap className="text-primary" size={20} /> Assessment Structure
                  </h4>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{course.assessmentStructure}</p>
                </div>
              )}
              {course.careerPreparation && (
                <div className="glass-card p-6 border border-slate-200 dark:border-white/10">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg flex items-center gap-2">
                    <Users className="text-primary" size={20} /> Placement Preparation
                  </h4>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{course.careerPreparation}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Certification & Guidelines */}
          {(course.certificationCriteria || course.recommendations) && (
            <motion.div variants={fadeUp} className="glass-card p-6 md:p-8 border border-slate-200 dark:border-white/10">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-xl flex items-center gap-2">
                <GraduationCap className="text-primary" size={24} /> Certification & Guidelines
              </h3>
              <div className="space-y-4 text-sm text-slate-600 dark:text-gray-300">
                {course.certificationCriteria && (
                  <div>
                    <span className="font-bold text-slate-850 dark:text-white block mb-1">Criteria for Certification:</span>
                    <p className="leading-relaxed">{course.certificationCriteria}</p>
                  </div>
                )}
                {course.recommendations && (
                  <div>
                    <span className="font-bold text-slate-850 dark:text-white block mb-1">Academic Guidelines:</span>
                    <p className="leading-relaxed">{course.recommendations}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>

        {/* Right Column: Sticky Enrollment Box */}
        <div className="lg:col-span-1">
          <motion.div 
            variants={fadeUp} 
            className="sticky top-24 glass-card p-8 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent shadow-xl space-y-6"
          >
            <div className="text-center">
              <p className="text-slate-500 dark:text-gray-400 font-medium mb-2">Program Investment</p>
              <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">
                ₹{course.price}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-500/10 py-1 px-3 rounded-full inline-block">
                Seats Open for Enrollment
              </p>
            </div>

            <div className="space-y-4 border-t border-b border-slate-200 dark:border-white/10 py-6">
              {[
                'Full 3-Month Workspace Access',
                'Interactive Daily Compiler',
                'Weekly Quizzes & Assessments',
                '1-on-1 Placement Preparation',
                'Verifiable Completion Certificate'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-gray-300">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {course.readinessScore && (
              <div className="text-center py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="text-2xl font-black text-primary">{course.readinessScore}%</div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">Industry Readiness Rating</div>
              </div>
            )}

            <button 
              onClick={handleEnroll}
              className="w-full group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-white font-black text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <CreditCard size={22} className="relative z-10" /> 
              <span className="relative z-10">Enroll Now</span>
            </button>
            
            <p className="text-center text-xs text-slate-500 dark:text-gray-500 mt-4 leading-relaxed">
              Upon successful registration, your official internship offer letter will be generated instantly.
            </p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
