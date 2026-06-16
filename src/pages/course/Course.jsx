import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Lock, Play, Code2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getCourseDayContent } from '../../data/coursesContent';

// Mock curriculum data for fallback
const mockCurriculum = {
  1: {
    title: "HTML5 Foundations",
    content: "Welcome to Day 1! Today we dive into the skeleton of the web. HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a Web page semantically.",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <title>Day 1: HTML5</title>\n</head>\n<body>\n    <h1>Welcome to InoviumAI</h1>\n</body>\n</html>`,
    quiz: {
      question: "Which tag is used to create the largest heading in HTML5?",
      options: ["<heading>", "<h1>", "<h6>", "<head>"],
      correct: 1
    }
  }
};

const monthData = [
  {
    index: 1,
    name: "Month 1: Foundation (Days 1–30)",
    weeks: [
      { name: "Week 1: Core Fundamentals", days: [1, 2, 3, 4, 5, 6, 7] },
      { name: "Week 2: Advanced Structures", days: [8, 9, 10, 11, 12, 13, 14] },
      { name: "Week 3: Advanced Concepts", days: [15, 16, 17, 18, 19, 20, 21] },
      { name: "Week 4: First Milestone Lab", days: [22, 23, 24, 25, 26, 27, 28, 29, 30] }
    ]
  },
  {
    index: 2,
    name: "Month 2: Intermediate (Days 31–60)",
    weeks: [
      { name: "Week 5: Backend & Routing", days: [31, 32, 33, 34, 35, 36, 37] },
      { name: "Week 6: Server Architectures", days: [38, 39, 40, 41, 42, 43, 44] },
      { name: "Week 7: Databases & Persistence", days: [45, 46, 47, 48, 49, 50, 51] },
      { name: "Week 8: Full Stack API Integrations", days: [52, 53, 54, 55, 56, 57, 58, 59, 60] }
    ]
  },
  {
    index: 3,
    name: "Month 3: Advanced & Professional (Days 61–90)",
    weeks: [
      { name: "Week 9: System Security & Token Auth", days: [61, 62, 63, 64, 65, 66, 67] },
      { name: "Week 10: Performance Optimization", days: [68, 69, 70, 71, 72, 73, 74] },
      { name: "Week 11: Deployment & CI/CD Pipelines", days: [75, 76, 77, 78, 79, 80, 81] },
      { name: "Week 12: Professional Placement & Capstone", days: [82, 83, 84, 85, 86, 87, 88, 89, 90] }
    ]
  }
];

export default function Course() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [expandedMonths, setExpandedMonths] = useState({ 1: true, 2: false, 3: false });
  
  // Quiz state
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/course/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = response.data.find(e => e._id === enrollmentId);
        if (found && found.status === 'Activated') {
          if (!found.courseId) {
            toast.error('The associated course is no longer available.');
            navigate('/my-courses');
            return;
          }
          setEnrollment(found);
          
          // Calculate Current Day based on Start Date
          const startDate = new Date(found.additionalDetails?.startDate || found.createdAt);
          const today = new Date();
          
          startDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          
          const diffTime = today - startDate;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          const currentDayNumber = diffDays >= 0 ? diffDays + 1 : 1;
          setSelectedDay(currentDayNumber > 90 ? 90 : currentDayNumber);

          // Auto-expand appropriate month containing the selected day
          const activeMonth = Math.ceil(currentDayNumber / 30);
          setExpandedMonths({
            1: activeMonth === 1,
            2: activeMonth === 2,
            3: activeMonth === 3
          });

        } else {
          toast.error('Course not activated');
          navigate('/my-courses');
        }
      } catch {
        toast.error('Failed to load course');
        navigate('/my-courses');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollment();
  }, [enrollmentId, navigate]);

  // Reset quiz when day changes
  useEffect(() => {
    setQuizAnswer(null);
    setQuizSubmitted(false);
  }, [selectedDay]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (!enrollment) return null;

  // Max unlocked day based on start date
  const startDate = new Date(enrollment.additionalDetails?.startDate || enrollment.createdAt);
  const today = new Date();
  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const maxUnlockedDay = diffDays >= 0 ? diffDays + 1 : 1;

  // Fetch daily content dynamically
  const courseTitle = enrollment.courseId?.title || '';
  const dynamicLesson = getCourseDayContent(courseTitle, selectedDay);
  
  const currentLesson = dynamicLesson ? {
    title: dynamicLesson.dayTitle,
    content: dynamicLesson.topics[0]?.content || 'Lesson description is currently loading.',
    code: dynamicLesson.challenges[0]?.initialCode || 'No code example is required for today.',
    quiz: {
      question: dynamicLesson.mcqs[0]?.question || 'Concept check question is being generated.',
      options: dynamicLesson.mcqs[0]?.options || [],
      correct: dynamicLesson.mcqs[0]?.answer || 0
    }
  } : (mockCurriculum[selectedDay] || mockCurriculum[1]);

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return toast.error('Please select an answer');
    setQuizSubmitted(true);
    if (quizAnswer === currentLesson.quiz.correct) {
      toast.success('Correct! Great job! 🎉');
    } else {
      toast.error('Incorrect. Try reviewing the lesson again.');
    }
  };

  const toggleMonth = (mIdx) => {
    setExpandedMonths(prev => ({ ...prev, [mIdx]: !prev[mIdx] }));
  };

  return (
    <div className="w-full relative px-6 py-24 min-h-screen flex flex-col items-center max-w-7xl mx-auto z-10">
      {/* Background Radiance */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="w-full mb-8 z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate('/my-courses')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4 text-sm font-bold tracking-wider uppercase group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            {courseTitle}
          </h1>
          <p className="text-primary font-bold mt-2">Active Learning Workspace (90-Day Curriculum)</p>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-20">
        
        {/* Left Sidebar: Daily Curriculum */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-4 border-primary/20 bg-primary/5 rounded-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider px-2">Syllabus Index</h3>
            
            <div className="space-y-4">
              {monthData.map((month) => {
                const isMonthExpanded = expandedMonths[month.index];
                return (
                  <div key={month.index} className="border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden bg-white/40 dark:bg-slate-900/40">
                    <button 
                      onClick={() => toggleMonth(month.index)}
                      className="w-full px-4 py-3 flex items-center justify-between font-bold text-sm bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 hover:text-primary transition-colors"
                    >
                      <span className="truncate max-w-[200px]" title={month.name}>{month.name.split(' (')[0]}</span>
                      {isMonthExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <AnimatePresence initial={false}>
                      {isMonthExpanded && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 space-y-3">
                            {month.weeks.map((week, wIdx) => (
                              <div key={wIdx} className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide mb-1.5 uppercase px-2">{week.name}</h4>
                                <div className="grid grid-cols-4 gap-1.5">
                                  {week.days.map((day) => {
                                    const isUnlocked = day <= maxUnlockedDay;
                                    const isActive = selectedDay === day;
                                    return (
                                      <button
                                        key={day}
                                        onClick={() => isUnlocked && setSelectedDay(day)}
                                        disabled={!isUnlocked}
                                        title={`Day ${day}: ${isUnlocked ? 'Unlocked' : 'Locked'}`}
                                        className={`p-2 rounded-lg text-xs font-bold text-center border transition-all ${
                                          isActive
                                            ? 'border-primary bg-primary text-white shadow shadow-primary/20'
                                            : isUnlocked
                                              ? 'border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 hover:border-primary/50 text-slate-700 dark:text-gray-300'
                                              : 'border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 dark:text-gray-600 opacity-40 cursor-not-allowed'
                                        }`}
                                      >
                                        D{day}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content: Lesson, Code, Quiz */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Lesson Content */}
          <motion.div 
            key={`content-${selectedDay}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-8 md:p-10 rounded-3xl border-slate-200 dark:border-white/10 shadow-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
              Day {selectedDay} Lesson Preview
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
              {currentLesson.title}
            </h2>
            
            <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/[0.01] p-6 mb-6">
              <p className="text-base md:text-lg text-slate-600 dark:text-gray-300 leading-relaxed mb-6 max-w-xl">
                Day {selectedDay} class is equipped with an interactive training workspace. Access technical reading checklists, write code using the compiler, and evaluate your understanding.
              </p>
              <button
                onClick={() => navigate(`/course/${enrollmentId}/day/${selectedDay}`)}
                className="px-8 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <Play size={16} fill="currentColor" /> Enter Interactive Workspace
              </button>
            </div>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Syllabus Overview</h3>
            <p className="text-base text-slate-600 dark:text-gray-300 leading-relaxed">
              {currentLesson.content.split('###')[0]}
            </p>
          </motion.div>

          {/* Code Example */}
          <motion.div 
            key={`code-${selectedDay}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card rounded-3xl border-slate-200 dark:border-white/10 shadow-xl overflow-hidden"
          >
            <div className="bg-slate-900 px-6 py-4 flex items-center gap-3 border-b border-white/10">
              <Code2 className="text-primary" size={20} />
              <h3 className="font-bold text-white">Daily Code Sample</h3>
            </div>
            <div className="p-6 bg-[#0d1117]">
              <pre className="text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
                <code>{currentLesson.code}</code>
              </pre>
            </div>
          </motion.div>

          {/* Interactive Quiz */}
          {currentLesson.quiz && currentLesson.quiz.options && currentLesson.quiz.options.length > 0 && (
            <motion.div 
              key={`quiz-${selectedDay}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass-card p-8 md:p-10 rounded-3xl border border-primary/20 bg-primary/5 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="text-primary" size={24} />
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Quick Check</h3>
              </div>
              
              <p className="text-lg font-medium text-slate-800 dark:text-gray-200 mb-6">
                {currentLesson.quiz.question}
              </p>

              <div className="space-y-3 mb-8">
                {currentLesson.quiz.options.map((option, idx) => {
                  let borderClass = "border-slate-200 dark:border-white/10 hover:border-primary/50 text-slate-700 dark:text-gray-300";
                  
                  if (quizAnswer === idx) borderClass = "border-primary bg-primary/10 text-primary font-bold";
                  
                  if (quizSubmitted) {
                    if (idx === currentLesson.quiz.correct) {
                      borderClass = "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 font-bold";
                    } else if (quizAnswer === idx) {
                      borderClass = "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-bold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizSubmitted}
                      onClick={() => setQuizAnswer(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${borderClass}`}
                    >
                      <span className="inline-block w-6 font-bold opacity-50">{['A', 'B', 'C', 'D'][idx]}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleQuizSubmit}
                disabled={quizAnswer === null || quizSubmitted}
                className="px-8 py-3 rounded-xl bg-primary text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
              >
                {quizSubmitted ? 'Submitted' : 'Submit Answer'}
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}