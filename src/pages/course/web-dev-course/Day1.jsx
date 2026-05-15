import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Code, Terminal, Database, CheckCircle, 
  Search, Menu, X, Play, RefreshCw, Copy, Download,
  Award, ArrowRight, ArrowLeft, Check, AlertCircle, Layout
} from 'lucide-react';
import toast from 'react-hot-toast';

// ---------------------------------------------------------
// MASSIVE CONTENT DATASET FOR DAY 1
// ---------------------------------------------------------
const courseContent = [
  {
    id: "intro-fullstack",
    title: "Introduction to Full Stack Development",
    content: `
Full Stack Development refers to the practice of working on both the front-end (client-side) and back-end (server-side) portions of a web application. A Full Stack Developer is a versatile engineer capable of handling databases, servers, systems engineering, and client-facing interfaces.

### Why Full Stack?
In the modern tech ecosystem, understanding the complete request-response cycle gives you a significant edge. You can architect solutions from the database schema all the way to the CSS animations in the browser. It reduces bottlenecks in teams and allows you to build complete MVPs independently.

**Real-world example:** Think of a restaurant. The frontend is the dining area, the menu, and the waiters. The backend is the kitchen, the chefs, and the recipes. The database is the pantry where ingredients are stored. A full-stack developer is the restaurant manager who understands and orchestrates all these moving parts.

### Best Practices
- Master one stack (e.g., MERN) before trying to learn everything.
- Understand HTTP and how the web works at a fundamental level.
- Keep learning: The tech landscape changes rapidly.
    `,
    interview: "Q: What is the difference between a Full Stack Developer and a Software Engineer?\nA: While overlapping, a Full Stack Developer typically focuses on web technologies across client and server, whereas a Software Engineer might work on any type of software (desktop, mobile, embedded) using various languages."
  },
  {
    id: "frontend-backend-db",
    title: "Frontend, Backend & Databases",
    content: `
### What is Frontend?
The frontend is everything the user sees and interacts with. It's built using HTML (structure), CSS (presentation), and JavaScript (logic/behavior). Modern frontend development relies heavily on frameworks like React, Vue, or Angular to build complex, state-driven interfaces.

### What is Backend?
The backend handles the business logic, authentication, data processing, and server management. It's the engine under the hood. It communicates with the frontend via APIs (Application Programming Interfaces). Common backend languages include Node.js (JavaScript), Python, Java, and Go.

### What is a Database?
A database is an organized collection of data. It allows you to store, retrieve, and manage information persistently. 
- **Relational (SQL):** MySQL, PostgreSQL (Uses tables, rows, columns)
- **Non-Relational (NoSQL):** MongoDB, Redis (Uses documents, key-value pairs)

### The Complete Flow
1. User clicks a button on the Frontend (React).
2. Frontend sends an HTTP request to the Backend (Node/Express).
3. Backend receives the request, processes it, and queries the Database (MongoDB).
4. Database returns data to the Backend.
5. Backend formats data and sends an HTTP response to the Frontend.
6. Frontend updates the UI based on the response.
    `,
    interview: "Q: Explain the difference between SQL and NoSQL.\nA: SQL databases are table-based and use a predefined schema, making them great for complex queries and transactional data. NoSQL databases are document, key-value, or graph-based, offering dynamic schemas and high scalability for unstructured data."
  },
  {
    id: "intro-react",
    title: "Introduction to React",
    content: `
React is a declarative, efficient, and flexible JavaScript library for building user interfaces, originally developed by Facebook.

### Core Concepts:
1. **Components:** The building blocks of React. They are reusable, self-contained pieces of UI (like a button, a form, or an entire page).
2. **JSX:** A syntax extension for JavaScript that looks like HTML. It allows you to write markup directly inside your JS logic.
3. **State:** Data that changes over time and affects what renders on the screen.
4. **Props:** Short for properties. Used to pass data from a parent component down to a child component.
5. **Virtual DOM:** A lightweight copy of the actual DOM. React uses it to efficiently determine the minimal number of changes needed to update the real DOM, boosting performance.

**Real-world example:** Imagine building a car. Instead of building the entire car as one giant piece, you build the engine, the wheels, the doors (components) separately, and then assemble them.
    `,
    interview: "Q: Why use React over vanilla JavaScript?\nA: React simplifies DOM manipulation, provides a component-based architecture for reusability, and offers better performance through the Virtual DOM, especially for complex, dynamic applications."
  },
  {
    id: "intro-node-mongo",
    title: "Introduction to Node.js & MongoDB",
    content: `
### Node.js
Node.js is a JavaScript runtime environment built on Chrome's V8 engine. It allows you to run JavaScript on the server, outside the browser. 

**Key Features:**
- **Asynchronous & Event-Driven:** It doesn't wait for API calls or database queries to finish before moving to the next line of code, making it highly concurrent and fast.
- **Single-Threaded but Highly Scalable:** Uses an event loop to handle multiple connections simultaneously.

### MongoDB
MongoDB is a popular NoSQL database that stores data in JSON-like documents (BSON). 

**Key Features:**
- **Document Model:** Data is stored as documents inside collections.
- **Flexible Schema:** Documents in the same collection don't need to have the identical set of fields.
- **Scalability:** Built to scale out natively using sharding.

**The MERN Stack Magic:** Because MongoDB uses JSON-like documents, Node.js runs JavaScript, and React uses JavaScript, the entire MERN stack speaks the same language (JavaScript/JSON), making data serialization and transmission seamless.
    `,
    interview: "Q: What is the Event Loop in Node.js?\nA: The event loop is what allows Node.js to perform non-blocking I/O operations despite being single-threaded. It offloads operations to the system kernel whenever possible, and processes callbacks when operations complete."
  },
  {
    id: "js-fundamentals",
    title: "JavaScript Fundamentals (Variables & Types)",
    content: `
JavaScript is the language of the web. It is dynamically typed, meaning you don't have to declare the type of a variable.

### Variables (let, const, var)
- **const:** Block-scoped. Cannot be reassigned. Use this by default!
- **let:** Block-scoped. Can be reassigned. Use when you know the value will change (e.g., counters).
- **var:** Function-scoped. Legacy way of declaring variables. Avoid using it in modern code due to hoisting behaviors.

### Data Types
- **Primitives:** String, Number, Boolean, Null, Undefined, Symbol, BigInt.
- **Non-Primitives (Objects):** Objects, Arrays, Functions.

**Undefined vs Null:**
- \`undefined\`: A variable has been declared but has not yet been assigned a value.
- \`null\`: An intentional absence of any object value.

### Type Coercion
JavaScript automatically converts types when needed, which can lead to bugs. Always use strict equality (\`===\`) instead of loose equality (\`==\`) to prevent unexpected type coercion.
    `,
    interview: "Q: What is the difference between == and ===?\nA: `==` checks for value equality with type coercion (e.g., '5' == 5 is true). `===` checks for both value and type equality without coercion (e.g., '5' === 5 is false)."
  },
  {
    id: "js-control-flow",
    title: "JavaScript Functions & Control Flow",
    content: `
### Functions
Functions are first-class citizens in JavaScript, meaning they can be assigned to variables, passed as arguments, and returned from other functions.

- **Function Declarations:** \`function add(a, b) { return a + b; }\`
- **Arrow Functions (ES6):** \`const add = (a, b) => a + b;\` (Shorter syntax, lexical \`this\` binding).

### Control Flow (Loops & Conditionals)
- **if/else, switch:** For branching logic.
- **for loop:** Traditional counter-based loop.
- **for...of:** Iterates over iterable objects (Arrays, Strings).
- **for...in:** Iterates over the enumerable properties of an object.
- **while / do...while:** Loops based on a condition.

**Higher-Order Array Methods:**
Instead of traditional loops, modern JS relies heavily on methods like:
- \`.map()\`: Transforms every element in an array and returns a new array.
- \`.filter()\`: Returns a new array with only elements that pass a test.
- \`.reduce()\`: Accumulates an array into a single value.
    `,
    interview: "Q: What is a closure in JavaScript?\nA: A closure is a function that remembers the variables from its lexical scope even after the outer function has finished executing."
  },
  {
    id: "git-basics",
    title: "Git Basics & GitHub Workflow",
    content: `
Git is a distributed version control system. It tracks changes in your source code, allowing you to revert to previous states, collaborate with others, and manage multiple features simultaneously.

### Key Concepts
- **Repository (Repo):** The project directory tracked by Git.
- **Commit:** A snapshot of your code at a specific point in time.
- **Branch:** An independent line of development. The main branch is typically \`main\` or \`master\`.
- **Merge:** Combining changes from one branch into another.

### Essential Commands
1. \`git init\`: Initialize a new local repository.
2. \`git add .\`: Stage all changed files for the next commit.
3. \`git commit -m "Message"\`: Save the staged changes to the local history.
4. \`git push\`: Upload local commits to a remote repository (like GitHub).
5. \`git pull\`: Download and merge changes from the remote repository.
6. \`git status\`: Check the current state of your working directory.

### Standard GitHub Workflow
1. Clone the repo: \`git clone <url>\`
2. Create a feature branch: \`git checkout -b feature/login\`
3. Make changes, add, and commit.
4. Push the branch: \`git push origin feature/login\`
5. Open a Pull Request (PR) on GitHub.
6. Review, approve, and merge into the main branch.
    `,
    interview: "Q: What is the difference between git fetch and git pull?\nA: `git fetch` downloads the latest changes from the remote repo but does NOT merge them into your working files. `git pull` does a fetch and then immediately merges the changes into your current branch."
  }
];

const mcqs = [
  {
    question: "Which of the following describes the Virtual DOM in React?",
    options: [
      "A direct manipulation of the browser's DOM elements",
      "A lightweight copy of the actual DOM kept in memory",
      "A database used to store React components",
      "A plugin that allows React to run offline"
    ],
    answer: 1,
    explanation: "React creates an in-memory data structure cache (Virtual DOM), computes the resulting differences, and then updates the browser's displayed DOM efficiently."
  },
  {
    question: "What is the primary difference between let and var in JavaScript?",
    options: [
      "var is block-scoped, let is function-scoped",
      "let can be reassigned, var cannot",
      "let is block-scoped, var is function-scoped",
      "They are exactly the same"
    ],
    answer: 2,
    explanation: "Variables declared with `let` are scoped to the nearest enclosing block (like an if statement or loop), whereas `var` is scoped to the nearest enclosing function."
  },
  {
    question: "Which Git command is used to save changes locally with a descriptive message?",
    options: ["git push", "git commit", "git save", "git add"],
    answer: 1,
    explanation: "git commit captures a snapshot of the project's currently staged changes."
  },
  {
    question: "In the MERN stack, what role does Express.js play?",
    options: [
      "The database management system",
      "The client-side UI library",
      "The backend web application framework running on Node.js",
      "The hosting platform"
    ],
    answer: 2,
    explanation: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications."
  },
  {
    question: "Which array method should you use to transform every element in an array and return a new array of the same length?",
    options: ["forEach()", "filter()", "reduce()", "map()"],
    answer: 3,
    explanation: "map() creates a new array populated with the results of calling a provided function on every element in the calling array."
  }
];

const codingChallenges = [
  {
    id: 1,
    title: "1. Sum of Two Numbers",
    description: "Write a function `sum(a, b)` that returns the sum of a and b.",
    initialCode: "function sum(a, b) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn sum;",
    testCases: [
      { args: [2, 3], expected: 5 },
      { args: [-1, 1], expected: 0 },
      { args: [100, 200], expected: 300 }
    ]
  },
  {
    id: 2,
    title: "2. Reverse String",
    description: "Write a function `reverse(str)` that takes a string and returns it reversed.",
    initialCode: "function reverse(str) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn reverse;",
    testCases: [
      { args: ["hello"], expected: "olleh" },
      { args: ["react"], expected: "tcaer" },
      { args: ["a"], expected: "a" }
    ]
  },
  {
    id: 3,
    title: "3. Check Even or Odd",
    description: "Write a function `isEven(num)` that returns true if even, false if odd.",
    initialCode: "function isEven(num) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn isEven;",
    testCases: [
      { args: [4], expected: true },
      { args: [7], expected: false },
      { args: [0], expected: true }
    ]
  },
  {
    id: 4,
    title: "4. Find Largest Number",
    description: "Write a function `findLargest(arr)` that returns the largest number in an array.",
    initialCode: "function findLargest(arr) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn findLargest;",
    testCases: [
      { args: [[1, 5, 3, 9, 2]], expected: 9 },
      { args: [[-10, -5, -1]], expected: -1 },
      { args: [[100]], expected: 100 }
    ]
  },
  {
    id: 5,
    title: "5. Factorial Program",
    description: "Write a function `factorial(n)` that returns the factorial of n. (Assume n >= 0)",
    initialCode: "function factorial(n) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn factorial;",
    testCases: [
      { args: [5], expected: 120 },
      { args: [0], expected: 1 },
      { args: [3], expected: 6 }
    ]
  }
];

// ---------------------------------------------------------
// HELPER COMPONENTS
// ---------------------------------------------------------
const MarkdownRenderer = ({ text }) => {
  const parseMarkdown = (raw) => {
    let parsed = raw;
    parsed = parsed.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-slate-100">$1</h3>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-black mt-10 mb-6 text-slate-900 dark:text-white">$1</h2>');
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
    parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm text-primary font-mono">$1</code>');
    parsed = parsed.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc mb-2">$1</li>');
    parsed = parsed.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">');
    return `<p class="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">${parsed}</p>`;
  };

  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} />;
};

// ---------------------------------------------------------
// MAIN DAY1 COMPONENT
// ---------------------------------------------------------
export default function Day1() {
  const [activeTab, setActiveTab] = useState('reading'); // 'reading', 'compiler', 'quiz'
  const [readTopics, setReadTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Compiler state
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [userCode, setUserCode] = useState(codingChallenges[0].initialCode);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [testResults, setTestResults] = useState([]);

  const contentContainerRef = useRef(null);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('day1_progress');
    if (saved) {
      setReadTopics(JSON.parse(saved));
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('day1_progress', JSON.stringify(readTopics));
  }, [readTopics]);

  const markAsRead = (id) => {
    if (!readTopics.includes(id)) {
      const updated = [...readTopics, id];
      setReadTopics(updated);
      toast.success('Topic completed!', { icon: '✅' });
    }
  };

  const calculateProgress = () => {
    return Math.round((readTopics.length / courseContent.length) * 100);
  };

  const filteredContent = courseContent.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const runCode = () => {
    setConsoleOutput([]);
    setTestResults([]);
    const challenge = codingChallenges[activeChallengeIdx];
    
    try {
      // Create a safely wrapped function evaluator
      // Note: In a real prod app, use Web Workers or Sandboxed Iframes to evaluate user code.
      const funcBody = `
        let logs = [];
        const originalLog = console.log;
        console.log = (...args) => { logs.push(args.join(' ')); };
        
        let userFunc;
        try {
          userFunc = (function() { ${userCode} })();
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
          // Simple equality for primitives, JSON.stringify for arrays/objects
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
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-hidden">
      
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
        fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">FS</div>
            <h1 className="font-bold text-lg">Full Stack Track</h1>
          </div>
          <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span>Day 1 Progress</span>
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
          <button 
            onClick={() => { setActiveTab('compiler'); setSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'compiler' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Terminal size={20} /> Practice Compiler
          </button>
          <button 
            onClick={() => { setActiveTab('quiz'); setSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'quiz' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <CheckCircle size={20} /> Knowledge Quiz
          </button>

          {activeTab === 'reading' && (
            <div className="mt-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">Topics</h3>
              {courseContent.map((topic, idx) => {
                const isRead = readTopics.includes(topic.id);
                return (
                  <button 
                    key={topic.id}
                    onClick={() => {
                      document.getElementById(topic.id)?.scrollIntoView({ behavior: 'smooth' });
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-start gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg group"
                  >
                    <div 
                      className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${isRead ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent group-hover:border-primary'}`}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className={`leading-tight ${isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {idx + 1}. {topic.title}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
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
            <h2 className="font-black text-xl hidden sm:block">
              {activeTab === 'reading' && "Module 1: The Foundation"}
              {activeTab === 'compiler' && "Interactive Coding Environment"}
              {activeTab === 'quiz' && "Module Assessment"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors">
              <Download size={16} /> <span className="hidden sm:inline">Download Notes</span>
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto" ref={contentContainerRef}>
          
          {/* READING TAB */}
          {activeTab === 'reading' && (
            <div className="max-w-4xl mx-auto py-12 px-6">
              
              <div className="mb-12 relative rounded-3xl overflow-hidden bg-slate-900 p-10 md:p-16 border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-bold text-xs mb-6 border border-white/20">
                    Day 1 of 30
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Full-Stack</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
                    Today, we lay the foundational bricks of your engineering career. Read carefully, understand the concepts, and complete the checkpoints.
                  </p>
                </div>
              </div>

              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search Day 1 content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
              </div>

              <div className="space-y-16 pb-24">
                {filteredContent.map((topic, index) => (
                  <motion.div 
                    key={topic.id} 
                    id={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative"
                  >
                    <div className="absolute -left-4 md:-left-12 top-2 h-full flex flex-col items-center hidden md:flex">
                      <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center font-bold text-xs ${readTopics.includes(topic.id) ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                        {index + 1}
                      </div>
                      <div className={`w-0.5 flex-1 mt-2 ${readTopics.includes(topic.id) ? 'bg-primary/30' : 'bg-slate-200 dark:bg-slate-800'}`} />
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h2 className="text-3xl font-black mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                        {topic.title}
                      </h2>
                      
                      <MarkdownRenderer text={topic.content} />
                      
                      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                          <div>
                            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Interview Prep</h4>
                            <p className="text-blue-800 dark:text-blue-400 text-sm whitespace-pre-wrap leading-relaxed">
                              {topic.interview}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button 
                          onClick={() => markAsRead(topic.id)}
                          disabled={readTopics.includes(topic.id)}
                          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${readTopics.includes(topic.id) ? 'bg-green-500/10 text-green-600 cursor-default' : 'bg-primary text-white hover:bg-primary/90 hover:-translate-y-1 shadow-lg shadow-primary/30'}`}
                        >
                          {readTopics.includes(topic.id) ? <><CheckCircle size={18}/> Completed</> : "Mark as Understood"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredContent.length === 0 && (
                  <div className="text-center py-20 text-slate-500">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No content found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COMPILER TAB */}
          {activeTab === 'compiler' && (
            <div className="h-full flex flex-col lg:flex-row p-6 gap-6 bg-slate-950">
              
              {/* Challenge Selector */}
              <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
                <h3 className="text-white font-bold text-lg px-2">Coding Challenges</h3>
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  {codingChallenges.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveChallengeIdx(i);
                        setUserCode(c.initialCode);
                        setConsoleOutput([]);
                        setTestResults([]);
                      }}
                      className={`text-left p-4 rounded-xl border shrink-0 w-64 lg:w-full transition-all ${activeChallengeIdx === i ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <div className="font-bold text-sm mb-1 text-white">{c.title}</div>
                      <div className="text-xs line-clamp-2">{c.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor & Output Area */}
              <div className="flex-1 flex flex-col min-h-0 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
                
                {/* Editor Header */}
                <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
                    <Code size={16} /> script.js
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setUserCode(codingChallenges[activeChallengeIdx].initialCode)} className="p-2 text-slate-400 hover:text-white transition-colors" title="Reset Code">
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

                {/* Editor Area */}
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

                  {/* Console & Tests Area */}
                  <div className="w-full md:w-80 lg:w-96 flex flex-col min-h-0 bg-slate-950">
                    <div className="flex-1 p-4 overflow-y-auto border-b border-slate-800">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Test Results</h4>
                      {testResults.length === 0 ? (
                        <p className="text-slate-600 text-sm italic">Run code to see results.</p>
                      ) : (
                        <div className="space-y-3">
                          {testResults.map((tr, i) => (
                            <div key={i} className={`p-3 rounded-lg border ${tr.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                {tr.passed ? <CheckCircle size={16} className="text-green-500"/> : <X size={16} className="text-red-500"/>}
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

          {/* QUIZ TAB */}
          {activeTab === 'quiz' && (
            <div className="max-w-3xl mx-auto py-16 px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Module Assessment</h2>
                <p className="text-lg text-slate-600 dark:text-gray-400">Test your knowledge on Day 1 concepts.</p>
              </div>

              <div className="space-y-8">
                {mcqs.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      <span className="text-primary mr-2">{qIdx + 1}.</span>{q.question}
                    </h3>
                    <div className="space-y-3">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = quizAnswers[qIdx] === oIdx;
                        const isCorrect = q.answer === oIdx;
                        
                        let btnStyle = "border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 hover:border-primary hover:bg-primary/5";
                        
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
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle size={20} className="text-green-500" />}
                            {quizSubmitted && isSelected && !isCorrect && <X size={20} className="text-red-500" />}
                          </button>
                        );
                      })}
                    </div>
                    
                    {quizSubmitted && (
                      <div className={`mt-6 p-4 rounded-xl ${quizAnswers[qIdx] === q.answer ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <strong className="block mb-1">Explanation:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <div className="mt-12 text-center">
                  <button 
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < mcqs.length}
                    className="px-10 py-4 bg-primary text-white font-black text-lg rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/30"
                  >
                    Submit Assessment
                  </button>
                  {Object.keys(quizAnswers).length < mcqs.length && (
                    <p className="text-slate-500 mt-4 text-sm">Please answer all questions before submitting.</p>
                  )}
                </div>
              ) : (
                <div className="mt-12 text-center">
                  <div className="inline-flex flex-col items-center p-8 bg-slate-900 rounded-3xl border border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
                    <Award size={64} className="text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                    <h3 className="text-3xl font-black text-white mb-2">
                      Score: {Object.values(quizAnswers).filter((ans, idx) => ans === mcqs[idx].answer).length} / {mcqs.length}
                    </h3>
                    {calculateProgress() < 100 && (
                      <p className="text-yellow-400 text-sm mt-4">Note: Complete all reading materials to earn your Day 1 Certificate!</p>
                    )}
                  </div>
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
              
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full mx-auto flex items-center justify-center mb-8 shadow-xl shadow-yellow-500/20">
                <Award size={48} className="text-white" />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Day 1 Complete!</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Incredible work! You've mastered the foundational concepts of Full-Stack Development. You are 1 step closer to your dream role.
              </p>
              
              <button 
                onClick={() => setShowCertificate(false)}
                className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                Continue to Day 2
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
