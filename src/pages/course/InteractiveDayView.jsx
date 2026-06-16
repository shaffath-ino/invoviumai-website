import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Code, Terminal, CheckCircle, 
  Menu, X, Play, RefreshCw, Copy, 
  Award, ArrowLeft, Check, AlertCircle, HelpCircle, 
  ChevronDown, ChevronUp, Star, Eye, EyeOff, Award as AwardIcon, Target
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getCourseDayContent } from '../../data/coursesContent';

const MarkdownRenderer = ({ text }) => {
  const parseMarkdown = (raw) => {
    if (!raw) return '';
    let parsed = raw;
    parsed = parsed.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-200">$1</h3>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-black mt-8 mb-4 text-slate-900 dark:text-white">$1</h2>');
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
    parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-slate-150 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm text-primary font-mono">$1</code>');
    parsed = parsed.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc mb-1.5">$1</li>');
    parsed = parsed.replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed text-slate-600 dark:text-slate-350">');
    return `<p class="mb-3 leading-relaxed text-slate-600 dark:text-slate-350">${parsed}</p>`;
  };

  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} />;
};

const transpilePython = (pythonCode) => {
  let lines = pythonCode.split('\n');
  let jsLines = [];
  let indentStack = [0];
  
  for (let line of lines) {
    let cleanLine = line.trim();
    if (!cleanLine) {
      jsLines.push(line);
      continue;
    }
    
    // Check indentation
    let indent = line.length - line.trimStart().length;
    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }
    
    // Translate comments
    if (cleanLine.startsWith('#')) {
      jsLines.push(' '.repeat(indent) + '//' + cleanLine.substring(1));
      continue;
    }
    
    let processed = cleanLine;
    
    // Replace boolean and null values
    processed = processed.replace(/\bNone\b/g, 'null');
    processed = processed.replace(/\bTrue\b/g, 'true');
    processed = processed.replace(/\bFalse\b/g, 'false');
    
    // Replace logic operators
    processed = processed.replace(/\band\b/g, '&&');
    processed = processed.replace(/\bor\b/g, '||');
    processed = processed.replace(/\bnot\b/g, '!');
    
    // Replace function declaration
    if (processed.startsWith('def ')) {
      processed = processed.replace(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*:/g, 'function $1($2) {');
      indentStack.push(indent + 4);
    }
    // Replace if / elif statements
    else if (processed.startsWith('if ') || processed.startsWith('elif ')) {
      let isElif = processed.startsWith('elif ');
      let cond = processed.substring(isElif ? 5 : 3).replace(/:$/, '').trim();
      
      // Translate 'is None' and 'is not None'
      cond = cond.replace(/\bis\s+None\b/g, '=== null');
      cond = cond.replace(/\bis\s+not\s+None\b/g, '!== null');
      
      processed = `${isElif ? '} else if' : 'if'} (${cond}) {`;
      indentStack.push(indent + 4);
    }
    // Replace else statement
    else if (processed === 'else:') {
      processed = '} else {';
      indentStack.push(indent + 4);
    }
    // Standard statements, add semicolon
    else {
      if (!processed.endsWith(';') && !processed.endsWith('{') && !processed.endsWith('}')) {
        processed += ';';
      }
    }
    
    jsLines.push(' '.repeat(indent) + processed);
  }
  
  // Close any remaining open braces
  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
  }
  
  let jsCode = jsLines.join('\n');
  
  // Get function name
  const funcMatch = pythonCode.match(/def\s+([a-zA-Z0-9_]+)/);
  const funcName = funcMatch ? funcMatch[1] : 'validate_input';
  
  return `${jsCode}\nreturn ${funcName};`;
};

const transpileJava = (javaCode) => {
  let js = javaCode;
  js = js.replace(/public\s+class\s+\w+\s*\{/, '');
  js = js.replace(/(public|private|protected)?\s*static\s+\w+(<[^>]+>)?\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/g, 'function $3($4) {');
  js = js.replace(/function\s+(\w+)\s*\(([^)]*)\)/g, (match, funcName, argsStr) => {
    const cleanArgs = argsStr.split(',').map(arg => {
      const parts = arg.trim().split(/\s+/);
      return parts[parts.length - 1];
    }).join(', ');
    return `function ${funcName}(${cleanArgs})`;
  });
  const lastBraceIndex = js.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    js = js.substring(0, lastBraceIndex) + js.substring(lastBraceIndex + 1);
  }
  const funcMatch = javaCode.match(/static\s+\w+\s+([a-zA-Z0-9_]+)/);
  const funcName = funcMatch ? funcMatch[1] : 'validateInput';
  return `${js}\nreturn ${funcName};`;
};

const transpileGo = (goCode) => {
  let js = goCode;
  js = js.replace(/package\s+main/g, '');
  js = js.replace(/import\s+\([^)]*\)/g, '');
  js = js.replace(/import\s+"[^"]+"/g, '');
  js = js.replace(/func\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\w*\s*\{/g, 'function $1($2) {');
  js = js.replace(/function\s+(\w+)\s*\(([^)]*)\)/g, (match, funcName, argsStr) => {
    if (!argsStr.trim()) return `function ${funcName}()`;
    const cleanArgs = argsStr.split(',').map(arg => {
      const parts = arg.trim().split(/\s+/);
      return parts[0].replace('*', '');
    }).join(', ');
    return `function ${funcName}(${cleanArgs})`;
  });
  js = js.replace(/\bnil\b/g, 'null');
  js = js.replace(/\*([a-zA-Z0-9_]+)\b/g, '$1');
  const funcMatch = goCode.match(/func\s+([a-zA-Z0-9_]+)/);
  const funcName = funcMatch ? funcMatch[1] : 'validateInput';
  return `${js}\nreturn ${funcName};`;
};

const transpileBash = (bashCode) => {
  let js = `
    function runBash(arg1) {
      let x = arg1;
  `;
  let body = bashCode.replace(/#!\/bin\/bash/g, '');
  body = body.replace(/\[\s+-z\s+["']?\$1["']?\s+\]/g, '(x === null || x === undefined || x === "")');
  body = body.replace(/\[\s+-z\s+["']?\$x["']?\s+\]/g, '(x === null || x === undefined || x === "")');
  body = body.replace(/if\s+(.*?)\s*;?\s*then/g, 'if ($1) {');
  body = body.replace(/else/g, '} else {');
  body = body.replace(/fi/g, '}');
  body = body.replace(/echo\s+\$\(\(\s*\$1\s*\*\s*2\s*\)\)/g, 'return x * 2;');
  body = body.replace(/echo\s+([^\n]+)/g, 'return $1;');
  js += body + '\n}\nreturn runBash;';
  return js;
};

export default function InteractiveDayView() {
  const { enrollmentId, dayNumber } = useParams();
  const dayNum = parseInt(dayNumber, 10);
  const navigate = useNavigate();
  
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [courseTitle, setCourseTitle] = useState('');
  const [activeTab, setActiveTab] = useState('reading'); // 'reading', 'compiler', 'quiz', 'milestones'
  const [readTopics, setReadTopics] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedTopicIdx, setExpandedTopicIdx] = useState(0);
  const [revealShort, setRevealShort] = useState({});
  const [revealLong, setRevealLong] = useState({});

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Compiler state
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [testResults, setTestResults] = useState([]);

  const contentContainerRef = useRef(null);

  // Verify access and fetch course title
  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to access the course content');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/course/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const activeEnrollment = response.data.find(
          e => e._id === enrollmentId && e.status === 'Activated'
        );

        if (!activeEnrollment) {
          toast.error('Access restricted. Please complete your enrollment and payment verification first.');
          navigate('/dashboard');
          return;
        }
        
        setCourseTitle(activeEnrollment.courseId?.title || '');
        setLoadingAccess(false);
      } catch (error) {
        console.error('Failed to verify course access:', error);
        toast.error('Failed to verify course access');
        navigate('/dashboard');
      }
    };

    verifyAccess();
  }, [enrollmentId, navigate]);

  // Load content
  const content = useMemo(() => {
    return getCourseDayContent(courseTitle, dayNum) || {};
  }, [courseTitle, dayNum]);

  const courseContent = useMemo(() => content.topics || [], [content.topics]);
  const mcqs = useMemo(() => content.mcqs || [], [content.mcqs]);
  const codingChallenges = useMemo(() => content.challenges || [], [content.challenges]);

  // Setup code compilation default when active challenge changes
  useEffect(() => {
    if (codingChallenges && codingChallenges.length > 0) {
      setUserCode(codingChallenges[activeChallengeIdx]?.initialCode || '');
      setConsoleOutput([]);
      setTestResults([]);
    }
  }, [activeChallengeIdx, codingChallenges]);

  // Load progress
  useEffect(() => {
    if (courseTitle && dayNum) {
      const saved = localStorage.getItem(`${courseTitle}_day${dayNum}_progress`);
      if (saved) {
        setReadTopics(JSON.parse(saved));
      } else {
        setReadTopics([]);
      }
      setQuizAnswers({});
      setQuizSubmitted(false);
      setShowCertificate(false);
      setActiveChallengeIdx(0);
      setRevealShort({});
      setRevealLong({});
      setExpandedTopicIdx(0);
    }
  }, [courseTitle, dayNum]);

  // Save progress
  const markAsRead = (id) => {
    if (!readTopics.includes(id)) {
      const updated = [...readTopics, id];
      setReadTopics(updated);
      localStorage.setItem(`${courseTitle}_day${dayNum}_progress`, JSON.stringify(updated));
      toast.success('Topic completed!', { icon: '✅' });
      
      // Check if day is complete
      const validUpdated = updated.filter(valId => courseContent.some(c => c.id === valId));
      const newProgress = Math.round((validUpdated.length / courseContent.length) * 100);
      if (quizSubmitted && newProgress === 100) {
        const score = Object.keys(quizAnswers).reduce((acc, qIdx) => {
          return acc + (quizAnswers[qIdx] === mcqs[qIdx].answer ? 1 : 0);
        }, 0);
        if (score === mcqs.length) {
          setShowCertificate(true);
        }
      }
    }
  };

  const calculateProgress = () => {
    if (courseContent.length === 0) return 0;
    const validTopics = readTopics.filter(id => courseContent.some(c => c.id === id));
    return Math.round((validTopics.length / courseContent.length) * 100);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const runCode = () => {
    setConsoleOutput([]);
    setTestResults([]);
    const challenge = codingChallenges[activeChallengeIdx];
    if (!challenge) return;
    
    try {
      let codeToRun = userCode;
      
      const titleLower = courseTitle.toLowerCase();
      if (titleLower.includes('python')) {
        codeToRun = transpilePython(userCode);
      } else if (titleLower.includes('java')) {
        codeToRun = transpileJava(userCode);
      } else if (titleLower.includes('golang') || titleLower.includes('go internship')) {
        codeToRun = transpileGo(userCode);
      } else if (titleLower.includes('cyber') || titleLower.includes('security')) {
        codeToRun = transpileBash(userCode);
      }

      const funcBody = `
        let logs = [];
        const originalLog = console.log;
        console.log = (...args) => { logs.push(args.join(' ')); };
        
        let userFunc;
        try {
          userFunc = (function() { ${codeToRun} })();
        } catch(e) {
          console.log = originalLog;
          throw e;
        }
        
        console.log = originalLog;
        return { userFunc, logs };
      `;
      
      const evaluate = new Function(funcBody);
      const { userFunc, logs } = evaluate();
      
      if (logs.length > 0) {
        setConsoleOutput(logs);
      }

      if (typeof userFunc !== 'function') {
        throw new Error("Your code must return a function at the end.");
      }

      // Run against test cases
      const results = challenge.testCases.map((tc, i) => {
        try {
          const result = userFunc(...tc.args);
          const passed = JSON.stringify(result) === JSON.stringify(tc.expected);
          return { index: i, passed, result, expected: tc.expected, args: tc.args };
        } catch (err) {
          return { index: i, passed: false, error: err.message, expected: tc.expected, args: tc.args };
        }
      });
      
      setTestResults(results);
      
      if (results.every(r => r.passed)) {
        toast.success("All test cases passed! Great job! 🎉", { duration: 4000 });
      } else {
        toast.error("Some test cases failed. Keep trying!");
      }

    } catch (error) {
      setConsoleOutput([`Error: ${error.message}`]);
      toast.error("Compilation Error");
    }
  };

  const handleQuizSubmit = () => {
    const score = Object.keys(quizAnswers).reduce((acc, qIdx) => {
      return acc + (quizAnswers[qIdx] === mcqs[qIdx].answer ? 1 : 0);
    }, 0);
    
    setQuizSubmitted(true);
    if (score === mcqs.length && calculateProgress() === 100) {
      setShowCertificate(true);
    } else {
      toast.success(`Quiz graded! Score: ${score}/${mcqs.length}. Complete all readings and get 100% to earn certificate.`);
    }
  };

  const toggleRevealShort = (idx) => {
    setRevealShort(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleRevealLong = (idx) => {
    setRevealLong(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loadingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Class content not found</h2>
        <button onClick={() => navigate(`/course/${enrollmentId}`)} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl">
          Back to Syllabus
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <div className={`
        fixed inset-y-[80px] left-0 z-50 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(`/course/${enrollmentId}`)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-600 dark:text-slate-200 transition-all mr-1"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="font-black text-base truncate max-w-[180px]" title={courseTitle}>
              {courseTitle.replace(' Internship', ' Track')}
            </h1>
          </div>
          <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span>Day {dayNum} Progress</span>
            <span className="text-primary">{calculateProgress()}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <button 
            onClick={() => { setActiveTab('reading'); setSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'reading' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <BookOpen size={20} /> Reading Material
          </button>
          
          {codingChallenges.length > 0 && (
            <button 
              onClick={() => { setActiveTab('compiler'); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'compiler' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Code size={20} /> Practical Lab
            </button>
          )}

          <button 
            onClick={() => { setActiveTab('quiz'); setSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'quiz' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <CheckCircle size={20} /> Daily Assessment
          </button>

          <button 
            onClick={() => { setActiveTab('milestones'); setSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'milestones' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <AwardIcon size={20} /> Milestones & Projects
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="font-black text-lg hidden sm:block">
              {activeTab === 'reading' && content.dayTitle}
              {activeTab === 'compiler' && `Day ${dayNum} Practical Exercises`}
              {activeTab === 'quiz' && `Day ${dayNum} Theoretical Assessment`}
              {activeTab === 'milestones' && `Day ${dayNum} Milestone Reviews`}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/course/${enrollmentId}`)}
              className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={16} /> Exit Class
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto" ref={contentContainerRef}>
          
          {/* READING TAB */}
          {activeTab === 'reading' && (
            <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
              
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 p-10 md:p-16 border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-bold text-xs mb-6 border border-white/20">
                    Day {dayNum} of 90
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                    {content.dayTitle}
                  </h1>
                </div>
              </div>

              {/* Learning Objectives & Key Concepts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Target size={20} className="text-primary" /> Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {content.learningObjectives?.map((obj, i) => (
                      <li key={i} className="text-sm text-slate-650 dark:text-slate-300 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card p-6 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <BookOpen size={20} className="text-primary" /> Key Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {content.keyConcepts?.map((concept, i) => (
                      <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-gray-300 border border-slate-300/50 dark:border-white/5">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 10 Topics Accordion List */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Daily Lectures (10 Topics)</h3>
                
                <div className="space-y-3">
                  {courseContent.map((topic, index) => {
                    const isExpanded = expandedTopicIdx === index;
                    const isRead = readTopics.includes(topic.id);
                    return (
                      <div key={topic.id} className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50 transition-all">
                        <button
                          onClick={() => setExpandedTopicIdx(isExpanded ? -1 : index)}
                          className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(topic.id);
                              }}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${isRead ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-650 hover:border-primary'}`}
                            >
                              <Check size={14} strokeWidth={3} />
                            </div>
                            <span className={`font-bold text-base ${isRead ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                              {topic.title}
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]"
                            >
                              <div className="p-6 space-y-6">
                                <MarkdownRenderer text={topic.content} />
                                
                                {topic.interview && (
                                  <div className="p-4 rounded-xl bg-blue-500/10 text-blue-900 dark:text-blue-300 border border-blue-500/20 text-sm leading-relaxed whitespace-pre-wrap">
                                    <strong className="block mb-1.5 text-blue-950 dark:text-blue-100">Interview Drill Point:</strong>
                                    {topic.interview}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day Summary */}
              {content.summary && (
                <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Daily Summary</h3>
                  <p className="text-slate-650 dark:text-slate-300 leading-relaxed text-sm">{content.summary}</p>
                </div>
              )}

              {/* Day Interview Questions */}
              {content.interviewQuestions && content.interviewQuestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Day {dayNum} Technical Interview Preparation</h3>
                  <div className="space-y-3">
                    {content.interviewQuestions.map((q, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/30">
                        <strong className="block text-slate-800 dark:text-white mb-2">Q: {q.question}</strong>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">A: {q.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* COMPILER TAB */}
          {activeTab === 'compiler' && codingChallenges.length > 0 && (
            <div className="h-[calc(100vh-144px)] flex flex-col lg:flex-row p-6 gap-6 bg-slate-950">
              
              <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0 overflow-y-auto">
                <h3 className="text-white font-bold text-lg px-2">5 Practice Exercises</h3>
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  {codingChallenges.map((c, i) => (
                    <button
                      key={c.id || i}
                      onClick={() => {
                        setActiveChallengeIdx(i);
                      }}
                      className={`text-left p-4 rounded-xl border shrink-0 w-64 lg:w-full transition-all ${activeChallengeIdx === i ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <div className="font-bold text-sm mb-1 text-white">{c.title}</div>
                      <div className="text-xs line-clamp-2">{c.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
                <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
                    <Terminal size={16} /> script.js
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setUserCode(codingChallenges[activeChallengeIdx]?.initialCode || '')} className="p-2 text-slate-400 hover:text-white transition-colors" title="Reset Code">
                      <RefreshCw size={16} />
                    </button>
                    <button onClick={() => handleCopyCode(userCode)} className="p-2 text-slate-400 hover:text-white transition-colors" title="Copy Code">
                      <Copy size={16} />
                    </button>
                    <button onClick={runCode} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-green-900/20">
                      <Play size={14} fill="currentColor" /> Run Tests
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row min-h-0">
                  <div className="flex-1 min-h-0 relative border-b md:border-b-0 md:border-r border-slate-800">
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      spellCheck="false"
                      className="absolute inset-0 w-full h-full p-6 bg-slate-900 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-inset focus:ring-1 focus:ring-primary/50"
                      style={{ tabSize: 2 }}
                    />
                  </div>

                  <div className="w-full md:w-80 lg:w-96 flex flex-col min-h-0 bg-slate-950">
                    <div className="flex-1 p-4 overflow-y-auto border-b border-slate-800">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Test Results</h4>
                      {testResults.length === 0 ? (
                        <p className="text-slate-650 text-sm italic">Run compiler check to see test executions.</p>
                      ) : (
                        <div className="space-y-3">
                          {testResults.map((tr, i) => (
                            <div key={i} className={`p-3 rounded-lg border ${tr.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                {tr.passed ? <CheckCircle size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />}
                                <span className={`font-bold text-sm ${tr.passed ? 'text-green-400' : 'text-red-400'}`}>Test Case {i + 1}</span>
                              </div>
                              <div className="text-xs font-mono text-slate-400 space-y-1">
                                <div>Input: <span className="text-slate-300">{JSON.stringify(tr.args)}</span></div>
                                <div>Expected: <span className="text-slate-300">{JSON.stringify(tr.expected)}</span></div>
                                <div>Output: <span className={tr.passed ? "text-green-300" : "text-red-300"}>{tr.error ? tr.error : JSON.stringify(tr.result)}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="h-48 shrink-0 p-4 overflow-y-auto bg-black">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Terminal size={14}/> Console Output
                      </h4>
                      <div className="font-mono text-sm text-slate-300 space-y-1">
                        {consoleOutput.length === 0 && <span className="text-slate-600 opacity-50">No output</span>}
                        {consoleOutput.map((log, i) => (
                          <div key={i}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QUIZ/ASSESSMENT TAB */}
          {activeTab === 'quiz' && (
            <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Day {dayNum} Assessment</h2>
                <p className="text-slate-500 dark:text-gray-400">Complete 20 MCQs and review Short/Long questions</p>
              </div>

              {/* 20 MCQs */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-3">Multiple Choice Questions (20 Qs)</h3>
                
                {mcqs.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-4">
                      <span className="text-primary mr-2">{qIdx + 1}.</span>{q.question}
                    </h4>
                    <div className="space-y-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = quizAnswers[qIdx] === oIdx;
                        const isCorrect = q.answer === oIdx;
                        
                        let btnStyle = "border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300 hover:border-primary hover:bg-primary/5";
                        
                        if (quizSubmitted) {
                          if (isCorrect) btnStyle = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300";
                          else if (isSelected && !isCorrect) btnStyle = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300";
                          else btnStyle = "border-slate-200 dark:border-slate-800 opacity-50";
                        } else if (isSelected) {
                          btnStyle = "border-primary bg-primary/10 text-primary font-bold";
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswers({...quizAnswers, [qIdx]: oIdx})}
                            className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle size={18} className="text-green-500" />}
                            {quizSubmitted && isSelected && !isCorrect && <X size={18} className="text-red-500" />}
                          </button>
                        );
                      })}
                    </div>
                    
                    {quizSubmitted && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/5 text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                        <strong className="block mb-1">Answer Explanation:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                {!quizSubmitted ? (
                  <div className="text-center pt-6">
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < mcqs.length}
                      className="px-12 py-4 bg-primary text-white font-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/95 transition-all shadow-lg shadow-primary/25"
                    >
                      Submit Daily Assessment
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
                    <Award size={48} className="text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-bold text-lg text-green-700 dark:text-green-400">Score: {Object.values(quizAnswers).filter((ans, idx) => ans === mcqs[idx].answer).length} / {mcqs.length}</h4>
                  </div>
                )}
              </div>

              {/* Short Answer Questions (5) */}
              <div className="space-y-6 pt-6 border-t border-slate-250 dark:border-white/10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Short Answer Questions (5 Qs)</h3>
                <div className="space-y-4">
                  {content.shortQuestions?.map((q, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/25 space-y-3">
                      <div className="font-bold text-slate-850 dark:text-slate-100 flex items-start gap-2">
                        <span className="text-primary">{idx + 1}.</span>
                        <span>{q.question}</span>
                      </div>
                      
                      <button 
                        onClick={() => toggleRevealShort(idx)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                      >
                        {revealShort[idx] ? <><EyeOff size={14} /> Hide Guide Answer</> : <><Eye size={14} /> Reveal Guide Answer</>}
                      </button>

                      {revealShort[idx] && (
                        <p className="text-sm text-green-700 dark:text-green-400 bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
                          {q.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Long Answer Questions (5) */}
              <div className="space-y-6 pt-6 border-t border-slate-250 dark:border-white/10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Long Answer Case Studies (5 Qs)</h3>
                <div className="space-y-4">
                  {content.longQuestions?.map((q, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/25 space-y-3">
                      <div className="font-bold text-slate-850 dark:text-slate-100 flex items-start gap-2">
                        <span className="text-primary">{idx + 1}.</span>
                        <span>{q.question}</span>
                      </div>
                      
                      <button 
                        onClick={() => toggleRevealLong(idx)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                      >
                        {revealLong[idx] ? <><EyeOff size={14} /> Hide Model Breakdown</> : <><Eye size={14} /> Reveal Model Breakdown</>}
                      </button>

                      {revealLong[idx] && (
                        <p className="text-sm text-green-700 dark:text-green-400 bg-green-500/5 border border-green-500/10 p-3 rounded-xl leading-relaxed">
                          {q.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* MILESTONES TAB */}
          {activeTab === 'milestones' && (
            <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Milestones & Projects Review</h2>
                <p className="text-slate-500 dark:text-gray-400">Weekly and Monthly checkpoints for the program</p>
              </div>

              {content.milestones ? (
                <div className="space-y-8">
                  {/* Weekly Boundary */}
                  <div className="glass-card p-6 md:p-8 border border-slate-200 dark:border-white/10 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <AwardIcon className="text-primary" size={24} /> Week Milestone Checkpoints
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <strong className="block text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Weekly Assignment</strong>
                        <p className="text-sm leading-relaxed">{content.milestones.weeklyAssignment}</p>
                      </div>
                      <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                        <strong className="block text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Weekly Challenge</strong>
                        <p className="text-sm leading-relaxed">{content.milestones.weeklyChallenge}</p>
                      </div>
                      <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                        <strong className="block text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Weekly Assessment</strong>
                        <p className="text-sm leading-relaxed">{content.milestones.weeklyAssessment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Boundary */}
                  {content.milestones.monthlyExam && (
                    <div className="glass-card p-6 md:p-8 border border-primary/20 bg-primary/5 rounded-2xl space-y-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Star className="text-yellow-500" size={24} /> Monthly Exam & Evaluators
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <strong className="block text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Monthly Examination Guide</strong>
                          <p className="text-sm leading-relaxed">{content.milestones.monthlyExam}</p>
                        </div>
                        <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                          <strong className="block text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Monthly Project Scope</strong>
                          <p className="text-sm leading-relaxed font-bold text-primary">{content.milestones.monthlyProject}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Capstone Boundary */}
                  {content.milestones.capstoneChecklist && (
                    <div className="glass-card p-6 md:p-8 border border-green-500/20 bg-green-500/5 rounded-2xl space-y-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <AwardIcon className="text-green-500" size={24} /> Capstone Presentation Checklist
                      </h3>
                      <ul className="space-y-2">
                        {content.milestones.capstoneChecklist.map((item, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-sm">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-white/20 dark:bg-white/[0.01]">
                  <HelpCircle size={40} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">There are no milestone boundaries on Day {dayNum}. Keep practicing to unlock the end-of-week assessment.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-center"
            >
              <button onClick={() => setShowCertificate(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={24} />
              </button>
              
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full mx-auto flex items-center justify-center mb-8 shadow-xl shadow-yellow-500/20">
                <Award size={40} className="text-white" />
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Day {dayNum} Complete!</h2>
              <p className="text-base text-slate-650 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Excellent work! You have cleared today's 10 lectures, solved the coding challenges, and submitted the 20 MCQs with a perfect score. You are moving closer to the final Capstone project.
              </p>
              
              <button 
                onClick={() => { setShowCertificate(false); navigate(`/course/${enrollmentId}`); }}
                className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md"
              >
                Return to Syllabus Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
