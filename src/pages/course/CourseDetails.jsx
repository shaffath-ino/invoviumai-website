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
        const response = await axios.get(`http://187.127.166.185:5000/api/course/courses/${courseId}`, { headers });
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
        'http://187.127.166.185:5000/api/course/enroll',
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
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="w-full relative px-6 py-24 min-h-screen flex flex-col items-center max-w-6xl mx-auto z-10">
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
              <Zap size={16} /> Premium Internship
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
                  <p className="font-bold text-slate-900 dark:text-white">100% Online</p>
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

          {/* What You'll Learn Section */}
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Target className="text-primary" /> What You'll Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Code, title: 'Hands-on Projects', desc: 'Build real-world applications from scratch.' },
                { icon: Users, title: 'Expert Mentorship', desc: 'Get guidance from industry professionals.' },
                { icon: MonitorPlay, title: 'Interactive Learning', desc: 'Engaging content tailored for retention.' },
                { icon: Award, title: 'Certification', desc: 'Earn a verifiable certificate upon completion.' }
              ].map((feature, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-start gap-4 hover:border-primary/50 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Syllabus Section */}
          <motion.div variants={fadeUp} className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <BookOpen className="text-primary" /> Comprehensive Syllabus
            </h2>
            
            <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-4 space-y-12 pb-8">
              {course.stages.map((stage, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
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
                      {stage.level} Stage
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

        </div>

        {/* Right Column: Sticky Enrollment Box */}
        <div className="lg:col-span-1">
          <motion.div 
            variants={fadeUp} 
            className="sticky top-24 glass-card p-8 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent shadow-xl"
          >
            <div className="text-center mb-6">
              <p className="text-slate-500 dark:text-gray-400 font-medium mb-2">Program Investment</p>
              <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">
                ₹{course.price}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-500/10 py-1 px-3 rounded-full inline-block">
                Limited Seats Available
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                'Full Lifetime Access',
                '1-on-1 Expert Mentorship',
                'Real-world Projects',
                'Official Offer Letter',
                'Completion Certificate'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-gray-300">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>

            <button 
              onClick={handleEnroll}
              className="w-full group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-white font-black text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <CreditCard size={22} className="relative z-10" /> 
              <span className="relative z-10">Enroll Now</span>
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-gray-500 mt-4">
              Secure payment processing. You will receive your offer letter instantly after payment.
            </p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
