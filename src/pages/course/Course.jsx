import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Lock, Play, Code2, HelpCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Mock curriculum data for demonstration
const mockCurriculum = {
  1: {
    title: "HTML5 Foundations",
    content: "Welcome to Day 1! Today we dive into the skeleton of the web. HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a Web page semantically.",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Day 1: HTML5</title>
</head>
<body>
    <h1>Welcome to InoviumAI</h1>
    <p>This is your very first webpage!</p>
    <a href="https://inoviumai.com">Visit us</a>
</body>
</html>`,
    quiz: {
      question: "Which tag is used to create the largest heading in HTML5?",
      options: ["<heading>", "<h1>", "<h6>", "<head>"],
      correct: 1
    }
  },
  2: {
    title: "CSS Styling Basics",
    content: "Day 2 focuses on making things look good. Cascading Style Sheets (CSS) is used to format the layout of a webpage. You can control color, font, size of text, spacing between elements, and much more.",
    code: `body {
    background-color: #f4f4f9;
    font-family: 'Inter', sans-serif;
}

h1 {
    color: #e60023; /* Primary Color */
    text-align: center;
}

p {
    font-size: 18px;
    padding: 20px;
}`,
    quiz: {
      question: "Which property is used to change the background color of an element?",
      options: ["color", "bgcolor", "background-color", "bg-color"],
      correct: 2
    }
  },
  3: {
    title: "JavaScript Variables & Data Types",
    content: "On Day 3, we add logic. JavaScript is the programming language of the Web. We will start with declaring variables and understanding basic data types like Strings, Numbers, and Booleans.",
    code: `// Modern way to declare variables
let internName = "Alex";
const programDuration = 4; // months
let isEnrolled = true;

console.log("Welcome " + internName);

// Template Literals (ES6)
console.log(\`Duration: \${programDuration} months\`);`,
    quiz: {
      question: "Which keyword should you use to declare a variable that will NOT be reassigned?",
      options: ["var", "let", "const", "static"],
      correct: 2
    }
  }
};

export default function Course() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  
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
        if (found && found.status === 'activated') {
          setEnrollment(found);
          
          // Calculate Current Day based on Start Date
          const startDate = new Date(found.additionalDetails?.startDate || found.createdAt);
          const today = new Date();
          
          // Reset time to midnight for accurate day calculation
          startDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          
          const diffTime = today - startDate;
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          const currentDayNumber = diffDays >= 0 ? diffDays + 1 : 1;
          setSelectedDay(currentDayNumber > 3 ? 3 : currentDayNumber); // Capped at 3 for demo

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

  // Calculate maximum unlocked day
  const startDate = new Date(enrollment.additionalDetails?.startDate || enrollment.createdAt);
  const today = new Date();
  startDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const maxUnlockedDay = diffDays >= 0 ? diffDays + 1 : 1;

  const currentLesson = mockCurriculum[selectedDay] || mockCurriculum[1];

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return toast.error('Please select an answer');
    setQuizSubmitted(true);
    if (quizAnswer === currentLesson.quiz.correct) {
      toast.success('Correct! Great job!');
    } else {
      toast.error('Incorrect. Try reviewing the lesson again.');
    }
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
            {enrollment?.courseId.title}
          </h1>
          <p className="text-primary font-bold mt-2">Active Learning Workspace</p>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-20">
        
        {/* Left Sidebar: Daily Curriculum */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-6 border-primary/20 bg-primary/5 rounded-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Curriculum</h3>
            
            <div className="space-y-3">
              {[1, 2, 3].map((day) => {
                const isUnlocked = day <= maxUnlockedDay;
                const isActive = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => isUnlocked && setSelectedDay(day)}
                    disabled={!isUnlocked}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isActive
                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30'
                        : isUnlocked
                          ? 'border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:border-primary/50 text-slate-700 dark:text-gray-300'
                          : 'border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 dark:text-gray-600 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-white/20' : isUnlocked ? 'bg-primary/10 text-primary' : 'bg-slate-200 dark:bg-white/10'
                      }`}>
                        {!isUnlocked ? <Lock size={14} /> : isActive ? <Play size={14} className="ml-0.5" /> : <CheckCircle size={14} />}
                      </div>
                      <span className="font-bold">Day {day}</span>
                    </div>
                  </button>
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
              Day {selectedDay} Lesson
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
              {currentLesson.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed">
              {currentLesson.content}
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
              <h3 className="font-bold text-white">Example Code</h3>
            </div>
            <div className="p-6 bg-[#0d1117]">
              <pre className="text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
                <code>{currentLesson.code}</code>
              </pre>
            </div>
          </motion.div>

          {/* Interactive Quiz */}
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
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Knowledge Check</h3>
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

        </div>
      </div>
    </div>
  );
}