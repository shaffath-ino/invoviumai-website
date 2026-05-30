import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Code, Terminal, Database, CheckCircle, 
  Search, Menu, X, Play, RefreshCw, Copy, Download,
  Award, ArrowRight, ArrowLeft, Check, AlertCircle, Layout
} from 'lucide-react';
import toast from 'react-hot-toast';

// ---------------------------------------------------------
// CONTENT DATASET FOR DAY 3 (JAVASCRIPT FUNDAMENTALS)
// ---------------------------------------------------------
const courseContent = [
  {
    id: "js-intro",
    title: "Introduction to JavaScript",
    content: `
JavaScript (JS) is a lightweight, interpreted programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js.

### Why JavaScript?
HTML defines the structure, CSS defines the style, and JavaScript defines the behavior of a web page. With JS, you can:
- Update and change both HTML and CSS dynamically.
- Calculate, manipulate, and validate data.
- Fetch data from remote servers (APIs).
- Create interactive maps, animated graphics, and complex web applications.

### Adding JS to HTML
You can include JS in your HTML using the \`<script>\` tag, either inline or via an external file:
\`\`\`html
<script src="script.js"></script>
\`\`\`
    `,
    interview: "Q: What is the difference between Java and JavaScript?\nA: Java is a compiled, strongly typed object-oriented language. JavaScript is an interpreted, loosely typed scripting language primarily used for web development."
  },
  {
    id: "js-variables",
    title: "Variables (let, const, var)",
    content: `
Variables are containers for storing data values. In modern JavaScript, we use \`let\` and \`const\`. 

### The const keyword
Use \`const\` for values that will not change. Once assigned, you cannot reassign it.
\`\`\`javascript
const pi = 3.14159;
// pi = 3.14; // This will throw an error
\`\`\`

### The let keyword
Use \`let\` when you know the variable's value will change over time (like in a loop or a counter).
\`\`\`javascript
let score = 0;
score = score + 10;
\`\`\`

### The var keyword (Legacy)
Before ES6 (2015), \`var\` was the only way to declare variables. It has function scope rather than block scope, which can lead to confusing bugs. **It is recommended to always use let and const.**
    `,
    interview: "Q: What is hoisting in JavaScript?\nA: Hoisting is JS's default behavior of moving declarations to the top of the current scope. Variables declared with `var` are hoisted and initialized as undefined. `let` and `const` are hoisted but not initialized, resulting in a ReferenceError if accessed early (Temporal Dead Zone)."
  },
  {
    id: "js-datatypes",
    title: "Data Types",
    content: `
JavaScript variables can hold many data types: numbers, strings, objects and more.

### Primitive Types
- **String:** Text, enclosed in single or double quotes, or backticks for template literals (\`"Hello"\`, \`'World'\`, \`\`Hi\`\`).
- **Number:** Numeric values (\`42\`, \`3.14\`). JS only has one number type.
- **Boolean:** Logical entity (\`true\` or \`false\`).
- **Undefined:** A variable that has been declared but not assigned a value.
- **Null:** Intentional absence of any object value.
- **Symbol:** Unique and immutable primitive introduced in ES6.

### Complex Types
- **Object:** Collections of key-value pairs (\`{ name: "Alice", age: 25 }\`).
- **Array:** A special type of object used to store multiple values in a single variable (\`[1, 2, 3]\`).
    `,
    interview: "Q: What is the difference between null and undefined?\nA: `undefined` means a variable has been declared but not assigned a value. `null` is an assignment value that represents no value or no object. `typeof undefined` is 'undefined', but `typeof null` is 'object' (a known JS bug)."
  },
  {
    id: "js-operators",
    title: "Operators & Expressions",
    content: `
Operators allow you to perform tests or computations on data.

### Arithmetic Operators
\`+\` (Addition), \`-\` (Subtraction), \`*\` (Multiplication), \`/\` (Division), \`%\` (Modulus/Remainder), \`++\` (Increment), \`--\` (Decrement).

### Comparison Operators
These evaluate to a boolean (\`true\` or \`false\`).
- \`==\` (Equal to - performs type coercion)
- \`===\` (Strict equal - checks value AND type)
- \`!=\` (Not equal)
- \`!==\` (Strict not equal)
- \`>\`, \`<\`, \`>=\`, \`<=\` (Greater/Less than)

### Logical Operators
- \`&&\` (Logical AND): True if both operands are true.
- \`||\` (Logical OR): True if at least one operand is true.
- \`!\` (Logical NOT): Reverses the boolean state.
    `,
    interview: "Q: Why is it highly recommended to use === instead of ==?\nA: `==` performs type coercion before comparison (e.g., `\"2\" == 2` is true). `===` checks both value and type without coercion (e.g., `\"2\" === 2` is false), which prevents unexpected bugs."
  },
  {
    id: "js-control-flow",
    title: "Control Flow (If/Else, Switch)",
    content: `
Control flow dictates the order in which statements are executed based on conditions.

### If / Else
\`\`\`javascript
const age = 18;
if (age >= 18) {
  console.log("You can vote.");
} else if (age >= 16) {
  console.log("You can drive.");
} else {
  console.log("Too young.");
}
\`\`\`

### Switch Statement
The switch statement is used to perform different actions based on different conditions, usually comparing one value against many cases.
\`\`\`javascript
const day = "Monday";
switch (day) {
  case "Monday":
    console.log("Start of the work week!");
    break;
  case "Friday":
    console.log("Almost weekend!");
    break;
  default:
    console.log("Just another day.");
}
\`\`\`
    `,
    interview: "Q: What is a ternary operator?\nA: A ternary operator is a one-line shorthand for an if/else statement. Syntax: `condition ? exprIfTrue : exprIfFalse`. For example: `const status = (age >= 18) ? 'Adult' : 'Minor';`"
  },
  {
    id: "js-loops",
    title: "Loops (For, While)",
    content: `
Loops are handy if you want to run the same code over and over again, each time with a different value.

### For Loop
Best used when you know exactly how many times you want to loop.
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log("Iteration " + i);
}
\`\`\`

### While Loop
Loops through a block of code as long as a specified condition is true.
\`\`\`javascript
let i = 0;
while (i < 5) {
  console.log("Iteration " + i);
  i++;
}
\`\`\`

### For...of and For...in
- **for...of**: Loops through the values of an iterable object (like an Array or String).
- **for...in**: Loops through the properties (keys) of an object.
    `,
    interview: "Q: What is an infinite loop and how do you prevent it?\nA: An infinite loop occurs when the terminating condition of the loop is never met, freezing the browser or crashing the program. Prevent it by ensuring that the loop variable gets updated in a way that eventually makes the condition false."
  },
  {
    id: "js-functions",
    title: "Functions & Scope",
    content: `
A JavaScript function is a block of code designed to perform a particular task.

### Function Declaration
\`\`\`javascript
function greet(name) {
  return "Hello, " + name;
}
\`\`\`

### Arrow Functions (ES6)
Arrow functions provide a shorter syntax and do not have their own \`this\`.
\`\`\`javascript
const greet = (name) => {
  return "Hello, " + name;
};
// Shorthand for returning a single expression:
const multiply = (a, b) => a * b;
\`\`\`

### Scope
- **Global Scope:** Variables declared outside any function or block are globally accessible.
- **Local/Function Scope:** Variables declared within a function cannot be accessed outside of it.
- **Block Scope:** Variables declared with \`let\` or \`const\` inside curly braces \`{}\` cannot be accessed from outside the block.
    `,
    interview: "Q: What is a closure in JavaScript?\nA: A closure is a feature where an inner function has access to the outer (enclosing) function's variables, even after the outer function has returned. It \"remembers\" the environment in which it was created."
  },
  {
    id: "js-arrays",
    title: "Arrays & Array Methods",
    content: `
Arrays are special variables that can hold more than one value at a time.

\`\`\`javascript
const fruits = ["Apple", "Banana", "Cherry"];
console.log(fruits[0]); // Apple
\`\`\`

### Common Array Methods
- \`push()\`: Adds a new element to the end.
- \`pop()\`: Removes the last element.
- \`shift()\`: Removes the first element.
- \`unshift()\`: Adds a new element to the beginning.
- \`length\`: Property that returns the number of elements.

### Advanced Methods (Higher-Order Functions)
- \`map()\`: Creates a new array by performing a function on each element.
- \`filter()\`: Creates a new array with elements that pass a test.
- \`reduce()\`: Reduces the array to a single value.
\`\`\`javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2); // [2, 4, 6]
\`\`\`
    `,
    interview: "Q: What does array.map() return?\nA: `map()` returns a completely new array of the same length as the original, populated with the results of calling a provided function on every element in the calling array."
  },
  {
    id: "js-objects",
    title: "Objects",
    content: `
In JavaScript, almost everything is an object. Objects are variables too, but they can contain many values, written as \`name:value\` pairs (properties).

### Creating Objects
\`\`\`javascript
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
};
\`\`\`

### Accessing Properties
You can access object properties in two ways:
1. **Dot notation:** \`person.firstName\`
2. **Bracket notation:** \`person["firstName"]\`

### Object Destructuring
ES6 allows you to unpack properties from objects into distinct variables easily:
\`\`\`javascript
const { firstName, age } = person;
console.log(firstName); // John
\`\`\`
    `,
    interview: "Q: What does the 'this' keyword refer to in JavaScript?\nA: The value of `this` depends on context. In an object method, `this` refers to the object. In a regular function (non-strict mode), it refers to the global object. In an arrow function, `this` is lexically bound to its surrounding scope."
  },
  {
    id: "js-dom",
    title: "The DOM (Document Object Model)",
    content: `
The DOM represents the web page as a tree of objects. JavaScript can access and change all the elements of an HTML document.

### Selecting Elements
- \`document.getElementById(id)\`
- \`document.querySelector(selector)\`: Returns the first element that matches a CSS selector.
- \`document.querySelectorAll(selector)\`: Returns all matching elements.

### Changing HTML & CSS
\`\`\`javascript
const header = document.querySelector('h1');
header.textContent = "New Title"; // Changes text
header.style.color = "blue";      // Changes CSS
header.classList.add("active");   // Adds a CSS class
\`\`\`

### Event Listeners
You can execute code when a user interacts with the page (clicks, types, hovers).
\`\`\`javascript
const button = document.querySelector('#btn');
button.addEventListener('click', () => {
  alert('Button clicked!');
});
\`\`\`
    `,
    interview: "Q: What is event bubbling?\nA: Event bubbling is a concept in the DOM where an event triggered on a deeply nested element \"bubbles up\" to its parent elements in the hierarchy, triggering their event handlers as well."
  }
];

const mcqs = [
  {
    question: "Which keyword should you use to declare a variable whose value should NEVER change?",
    options: [
      "let",
      "var",
      "const",
      "static"
    ],
    answer: 2,
    explanation: "The const keyword creates a read-only reference to a value, preventing reassignment."
  },
  {
    question: "What will be the output of `console.log(typeof null)`?",
    options: [
      "null",
      "undefined",
      "object",
      "string"
    ],
    answer: 2,
    explanation: "Due to a historical bug in JavaScript, typeof null returns 'object'."
  },
  {
    question: "Which array method removes the LAST element from an array?",
    options: [
      "pop()",
      "push()",
      "shift()",
      "unshift()"
    ],
    answer: 0,
    explanation: "pop() removes the last element. push() adds to the end. shift() removes the first element. unshift() adds to the beginning."
  },
  {
    question: "Which operator is used to test for STRICT equality (value AND type)?",
    options: [
      "=",
      "==",
      "===",
      "!="
    ],
    answer: 2,
    explanation: "=== is the strict equality operator, which returns true only if both the value and the type of the two operands are exactly the same."
  },
  {
    question: "How do you select an element with the id 'container' using JavaScript?",
    options: [
      "document.select('#container')",
      "document.querySelector('#container')",
      "document.getElementById('#container')",
      "document.getElement('#container')"
    ],
    answer: 1,
    explanation: "document.querySelector('#container') correctly uses the CSS selector syntax to select by ID. document.getElementById('container') also works, but does not use the '#' prefix."
  }
];

const codingChallenges = [
  {
    id: 1,
    title: "1. Sum of Array",
    description: "Write a function `sumArray(arr)` that takes an array of numbers and returns the total sum.",
    initialCode: "function sumArray(arr) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn sumArray;",
    testCases: [
      { args: [[1, 2, 3]], expected: 6 },
      { args: [[10, 20, -10]], expected: 20 },
      { args: [[]], expected: 0 }
    ]
  },
  {
    id: 2,
    title: "2. Reverse a String",
    description: "Write a function `reverseString(str)` that takes a string and returns it reversed.",
    initialCode: "function reverseString(str) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn reverseString;",
    testCases: [
      { args: ["hello"], expected: "olleh" },
      { args: ["JavaScript"], expected: "tpircSavaJ" },
      { args: ["a"], expected: "a" }
    ]
  },
  {
    id: 3,
    title: "3. Find Even Numbers",
    description: "Write a function `filterEvens(arr)` that returns a new array containing only the even numbers from the original array.",
    initialCode: "function filterEvens(arr) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn filterEvens;",
    testCases: [
      { args: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6] },
      { args: [[1, 3, 5]], expected: [] },
      { args: [[2, 4, 6]], expected: [2, 4, 6] }
    ]
  },
  {
    id: 4,
    title: "4. Factorial",
    description: "Write a function `factorial(n)` that returns the factorial of n (n!). For example, 5! = 5 * 4 * 3 * 2 * 1 = 120. Assume n is non-negative.",
    initialCode: "function factorial(n) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn factorial;",
    testCases: [
      { args: [5], expected: 120 },
      { args: [0], expected: 1 },
      { args: [3], expected: 6 }
    ]
  },
  {
    id: 5,
    title: "5. Check if Prime",
    description: "Write a function `isPrime(n)` that returns true if a number is prime, and false otherwise. A prime number is greater than 1 and has no divisors other than 1 and itself.",
    initialCode: "function isPrime(n) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn isPrime;",
    testCases: [
      { args: [7], expected: true },
      { args: [10], expected: false },
      { args: [1], expected: false },
      { args: [2], expected: true }
    ]
  }
];

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

export default function Day3() {
  const navigate = useNavigate();
  const [loadingAccess, setLoadingAccess] = useState(true);
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

  // Verify Course access
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

        const isActivated = response.data.some(
          e => e.courseId?.title === 'Web Development Internship' && e.status === 'Activated'
        );

        if (!isActivated) {
          toast.error('Access restricted. Please complete your enrollment and payment verification first.');
          navigate('/dashboard');
          return;
        }
        
        setLoadingAccess(false);
      } catch {
        toast.error('Failed to verify course access');
        navigate('/dashboard');
      }
    };

    verifyAccess();
  }, [navigate]);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('day3_progress');
    if (saved) {
      setReadTopics(JSON.parse(saved));
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('day3_progress', JSON.stringify(readTopics));
  }, [readTopics]);

  const markAsRead = (id) => {
    if (!readTopics.includes(id)) {
      const updated = [...readTopics, id];
      setReadTopics(updated);
      toast.success('Topic completed!', { icon: '✅' });

      if (quizSubmitted) {
        const score = Object.keys(quizAnswers).reduce((acc, qIdx) => {
          return acc + (quizAnswers[qIdx] === mcqs[qIdx].answer ? 1 : 0);
        }, 0);
        const validUpdated = updated.filter(valId => courseContent.some(c => c.id === valId));
        const newProgress = Math.round((validUpdated.length / courseContent.length) * 100);
        if (score === mcqs.length && newProgress === 100) {
          setShowCertificate(true);
        }
      }
    }
  };

  const calculateProgress = () => {
    const validTopics = readTopics.filter(id => courseContent.some(c => c.id === id));
    return Math.round((validTopics.length / courseContent.length) * 100);
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
    }
  };

  if (loadingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-primary animate-spin"></div>
      </div>
    );
  }

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
            <button 
              onClick={() => navigate('/my-courses')}
              className="p-1 rounded bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-600 dark:text-slate-200 transition-all mr-1"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="font-bold text-lg">Full Stack Track</h1>
          </div>
          <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span>Day 3 Progress</span>
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
              {activeTab === 'reading' && "Module 3: JavaScript Fundamentals"}
              {activeTab === 'compiler' && "Day 3 Practice Environment"}
              {activeTab === 'quiz' && "Day 3 Quiz Check"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={16} /> Exit Class
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
                    Day 3 of 30
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    JavaScript <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Fundamentals</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
                    Today, we dive into JavaScript to add interactivity and logic to our web pages. Master variables, functions, and the DOM.
                  </p>
                </div>
              </div>

              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search Day 3 content..."
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

              <div className="flex-1 flex flex-col min-h-0 border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
                <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
                    <Code size={16} /> solution.js
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
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Day 3 Assessment</h2>
                <p className="text-lg text-slate-600 dark:text-gray-400">Validate your JavaScript Fundamentals knowledge.</p>
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
                      <p className="text-yellow-400 text-sm mt-4">Note: Complete all reading materials to earn your Day 3 Certificate!</p>
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
              
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Day 3 Complete!</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Excellent! You've mastered JavaScript Variables, Control Flow, Functions, Arrays, and the DOM. You are 3 steps closer to your dream role.
              </p>
              
              <button 
                onClick={() => { setShowCertificate(false); navigate('/my-courses'); }}
                className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                Return to Syllabus
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
