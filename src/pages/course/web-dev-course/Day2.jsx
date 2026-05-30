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
// CONTENT DATASET FOR DAY 2 (CSS & RESPONSIVE DESIGN)
// ---------------------------------------------------------
const courseContent = [
  {
    id: "css-box-model",
    title: "Understanding the CSS Box Model",
    content: `
The CSS Box Model is the foundation of design and layout on the web. Every element in HTML is represented as a rectangular box. The box model consists of four layers:

1. **Content:** The actual text, images, or child elements.
2. **Padding:** The space between the content and the border. It is transparent and inside the element.
3. **Border:** A border surrounding the padding and content.
4. **Margin:** The space outside the border, separating the element from other elements.

### Box Sizing: border-box vs content-box
By default, browsers use \`box-sizing: content-box\`. This means if you set \`width: 200px; padding: 20px; border: 5px solid black;\`, the actual rendered width of the element will be:
\`200px (width) + 40px (padding left/right) + 10px (border left/right) = 250px\`.

To fix this counter-intuitive behavior, modern web designs apply:
\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`
With \`border-box\`, the padding and border are included in the specified width. An element with \`width: 200px\` remains exactly 200px wide.
    `,
    interview: "Q: What is the difference between margin and padding?\nA: Padding adds space *inside* the element (increasing clickable area and content spacing), whereas margin adds space *outside* the element (separating it from neighboring items)."
  },
  {
    id: "flexbox",
    title: "Mastering CSS Flexbox",
    content: `
Flexbox (Flexible Box Layout) is a one-dimensional layout model designed for distributing space and aligning items in a row or column.

### Flex Container Properties
- \`display: flex;\` activates the flex context.
- \`flex-direction:\` Defines the main axis (row, column, row-reverse, column-reverse).
- \`justify-content:\` Aligns items along the main axis (flex-start, flex-end, center, space-between, space-around, space-evenly).
- \`align-items:\` Aligns items along the cross axis (stretch, flex-start, flex-end, center, baseline).
- \`flex-wrap:\` Controls whether flex items wrap onto multiple lines (nowrap, wrap, wrap-reverse).

### Flex Item Properties
- \`flex-grow:\` Ability for an item to grow if necessary (takes up remaining space).
- \`flex-shrink:\` Ability for an item to shrink if necessary.
- \`flex-basis:\` The default size of an element before remaining space is distributed.
- \`align-self:\` Overrides the container's align-items setting for this specific item.
    `,
    interview: "Q: How do you perfectly center an element using Flexbox?\nA: Set the container's display to `flex`, and apply `justify-content: center;` (main axis centering) and `align-items: center;` (cross axis centering)."
  },
  {
    id: "css-grid",
    title: "Introduction to CSS Grid",
    content: `
CSS Grid Layout is a two-dimensional layout system for the web. Unlike Flexbox, which is designed for one-dimensional layouts (rows OR columns), Grid is designed for both rows AND columns simultaneously.

### Grid Container Properties
- \`display: grid;\` starts the grid context.
- \`grid-template-columns:\` Defines grid columns (e.g., \`grid-template-columns: 1fr 2fr 1fr;\` or \`repeat(3, 1fr);\`).
- \`grid-template-rows:\` Defines grid rows.
- \`gap:\` Sets spacing between grid tracks (\`grid-row-gap\` and \`grid-column-gap\`).

### Grid Item Properties
- \`grid-column:\` Short-hand for defining start/end line coordinates (e.g., \`grid-column: 1 / 3;\` span 2 columns).
- \`grid-row:\` Short-hand for defining row start/end coordinates.
    `,
    interview: "Q: When should you use Flexbox vs CSS Grid?\nA: Use Flexbox when you want to layout items in a single direction (row or column) or align items sequentially. Use Grid when you need a multi-dimensional grid layout with alignment in both columns and rows."
  },
  {
    id: "media-queries",
    title: "Media Queries & Responsive Web Design",
    content: `
Responsive Web Design (RWD) makes web pages look good on all devices (desktops, tablets, and phones). The cornerstone of RWD is Media Queries.

### The Viewport Meta Tag
To make a site responsive, you must include this in your HTML \`<head>\`:
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

### Media Query Syntax
A media query consists of a media type and expressions that limit style sheets' scope:
\`\`\`css
/* Desktop First Approach */
@media (max-width: 768px) {
  /* CSS rules here apply to devices with screen widths of 768px or less */
  .sidebar {
    display: none;
  }
}
\`\`\`

### Mobile-First Design
It is best practice to write mobile-first styles: write base styles for small mobile screens first, then use \`min-width\` media queries to scale up rules for tablets and laptops.
    `,
    interview: "Q: What is a breakpoint in CSS?\nA: A breakpoint is a specific screen width (defined via media queries) where the design layout adapts or changes to fit the device viewport size."
  },
  {
    id: "css-positioning",
    title: "Mastering CSS Positioning",
    content: `
The \`position\` property specifies the type of positioning method used for an element. 

### Common Position Values
- **static:** The default. Elements render in order, as they appear in the document flow.
- **relative:** Positioned relative to its normal (static) position. Setting top/right/bottom/left will adjust it away from its normal position.
- **absolute:** Positioned relative to the nearest positioned ancestor (instead of positioned relative to the viewport, like fixed). It is removed from the normal document flow.
- **fixed:** Positioned relative to the viewport. It stays in the exact same place even if the page is scrolled.
- **sticky:** Toggles between relative and fixed, depending on the scroll position.
    `,
    interview: "Q: What is the difference between absolute and relative positioning?\nA: 'Relative' moves an element from its normal position but keeps its space in the document flow. 'Absolute' completely removes the element from the flow and positions it relative to its closest positioned parent."
  },
  {
    id: "css-typography",
    title: "Advanced CSS Typography",
    content: `
Typography is a crucial part of web design. Modern CSS provides powerful tools for controlling how text looks.

### Key Properties
- \`font-family\`: Defines the typeface. Best practice is to use web-safe fallback fonts or import from Google Fonts.
- \`line-height\`: Controls the vertical spacing between lines. A line-height of 1.5 to 1.6 is generally recommended for readability.
- \`letter-spacing\` & \`word-spacing\`: Controls the horizontal spacing between characters and words.
- \`text-transform\`: Easily convert text to \`uppercase\`, \`lowercase\`, or \`capitalize\`.

### Fluid Typography
Using \`clamp()\` allows typography to scale fluidly between a minimum and maximum size depending on viewport width:
\`\`\`css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
\`\`\`
    `,
    interview: "Q: What does the clamp() function do in CSS?\nA: clamp() takes three parameters (minimum, preferred, maximum) and allows a value to fluidly scale with the viewport while never going below the minimum or above the maximum bounds."
  },
  {
    id: "css-transitions",
    title: "CSS Transitions & Animations",
    content: `
Animations bring web interfaces to life by providing visual feedback and smoothing state changes.

### CSS Transitions
Transitions provide a way to control animation speed when changing CSS properties (e.g., on hover).
\`\`\`css
.button {
  background-color: blue;
  transition: background-color 0.3s ease-in-out, transform 0.2s;
}
.button:hover {
  background-color: darkblue;
  transform: translateY(-2px);
}
\`\`\`

### Keyframe Animations
For complex, multi-step animations, use \`@keyframes\`:
\`\`\`css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
.loader {
  animation: bounce 2s infinite;
}
\`\`\`
    `,
    interview: "Q: What is the difference between a CSS transition and an animation?\nA: Transitions implicitly animate an element between two states (e.g., hover on and off), requiring a trigger. Animations explicitly define keyframes and can run automatically without a trigger."
  },
  {
    id: "css-variables",
    title: "CSS Custom Properties (Variables)",
    content: `
CSS variables allow you to store specific values for reuse throughout your stylesheet. They are incredibly useful for theming, such as implementing Dark Mode.

### Defining Variables
Variables are usually defined in the \`:root\` pseudo-class so they are available globally.
\`\`\`css
:root {
  --primary-color: #3498db;
  --bg-color: #ffffff;
  --text-color: #333333;
}
\`\`\`

### Using Variables
Use the \`var()\` function to apply the values.
\`\`\`css
body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
.button {
  background-color: var(--primary-color);
}
\`\`\`
    `,
    interview: "Q: Why use CSS Variables over SASS/LESS variables?\nA: CSS variables are accessible and modifiable at runtime via JavaScript, whereas SASS/LESS variables are compiled away into static CSS values during the build process."
  },
  {
    id: "css-architecture",
    title: "CSS Architecture (BEM)",
    content: `
As projects grow, maintaining CSS becomes difficult. Methodologies like BEM (Block, Element, Modifier) help structure CSS.

### The BEM Convention
- **Block:** A standalone entity that is meaningful on its own (e.g., \`card\`, \`navbar\`).
- **Element:** A part of a block that has no standalone meaning (e.g., \`card__title\`, \`card__image\`).
- **Modifier:** A flag on a block or element used to change appearance or behavior (e.g., \`card--featured\`, \`card__button--disabled\`).

### Example
\`\`\`html
<div class="card card--dark">
  <img class="card__image" src="..." />
  <h2 class="card__title">Title</h2>
  <button class="card__button card__button--primary">Click</button>
</div>
\`\`\`
    `,
    interview: "Q: What problem does BEM solve?\nA: BEM solves CSS scoping and specificity issues by flattening the CSS selector hierarchy and providing clear naming conventions that explain the relationship between HTML elements."
  },
  {
    id: "responsive-images",
    title: "Responsive Images & Media",
    content: `
Serving large desktop images to mobile devices hurts performance. We must serve responsive media.

### Max-Width 100%
The most basic rule for responsive images is ensuring they never overflow their container:
\`\`\`css
img, video {
  max-width: 100%;
  height: auto;
}
\`\`\`

### The <picture> Element
For serving entirely different image files based on screen size (art direction) or format support (WebP), use the \`<picture>\` element:
\`\`\`html
<picture>
  <source media="(max-width: 768px)" srcset="small-image.webp">
  <source media="(min-width: 769px)" srcset="large-image.webp">
  <img src="fallback-image.jpg" alt="Responsive graphic">
</picture>
\`\`\`
    `,
    interview: "Q: Why is max-width used instead of width: 100% for images?\nA: `max-width: 100%` allows the image to scale down to fit small containers but prevents it from scaling up past its original resolution, preventing pixelation. `width: 100%` forces the image to always be exactly the container width, regardless of its native size."
  }
];

const mcqs = [
  {
    question: "Which box-sizing value includes padding and border in the element's total width and height?",
    options: [
      "content-box",
      "border-box",
      "padding-box",
      "margin-box"
    ],
    answer: 1,
    explanation: "border-box ensures that width and height declarations apply to the border-box (content, padding, and border combined), making sizes highly predictable."
  },
  {
    question: "Which Flexbox property centers items along the main axis of a container?",
    options: [
      "align-items: center",
      "align-content: center",
      "justify-content: center",
      "justify-items: center"
    ],
    answer: 2,
    explanation: "justify-content aligns flex items along the main axis. align-items aligns them along the cross axis."
  },
  {
    question: "What is the correct viewport meta tag configuration for responsive mobile views?",
    options: [
      "<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
      "<meta name='viewport' content='device-width'>",
      "<meta name='viewport' content='responsive=true'>",
      "<meta name='viewport' content='scale-to-fit=yes'>"
    ],
    answer: 0,
    explanation: "The standard viewport configuration uses width=device-width and initial-scale=1.0 to render layouts relative to the screen width."
  },
  {
    question: "What does the '1fr' unit represent in CSS Grid?",
    options: [
      "One fixed pixel ratio",
      "One fractional unit of the free space in the grid container",
      "One font size relative size",
      "One frame unit"
    ],
    answer: 1,
    explanation: "fr is a fractional unit used to describe a fraction of the available space inside the grid container."
  },
  {
    question: "Which CSS property specifies the spacing between cells or grid lines?",
    options: [
      "spacing",
      "border-collapse",
      "gap",
      "grid-margin"
    ],
    answer: 2,
    explanation: "The `gap` property (previously grid-gap) sets the columns and rows spacing for grids and flexboxes."
  }
];

const codingChallenges = [
  {
    id: 1,
    title: "1. Celsius to Fahrenheit Converter",
    description: "Write a function `convert(celsius)` that converts Celsius to Fahrenheit using formula: `(c * 9/5) + 32`.",
    initialCode: "function convert(celsius) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn convert;",
    testCases: [
      { args: [0], expected: 32 },
      { args: [30], expected: 86 },
      { args: [-10], expected: 14 }
    ]
  },
  {
    id: 2,
    title: "2. Is Palindrome String",
    description: "Write a function `isPalindrome(str)` that checks if a string reads the same forwards and backwards. Ignore casing.",
    initialCode: "function isPalindrome(str) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn isPalindrome;",
    testCases: [
      { args: ["racecar"], expected: true },
      { args: ["hello"], expected: false },
      { args: ["Madam"], expected: true }
    ]
  },
  {
    id: 3,
    title: "3. Count Vowels",
    description: "Write a function `countVowels(str)` that returns the number of vowels (a, e, i, o, u) inside a string.",
    initialCode: "function countVowels(str) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn countVowels;",
    testCases: [
      { args: ["hello"], expected: 2 },
      { args: ["inoviumai"], expected: 5 },
      { args: ["xyz"], expected: 0 }
    ]
  },
  {
    id: 4,
    title: "4. Max in Array",
    description: "Write a function `getMax(arr)` that returns the maximum number in an array.",
    initialCode: "function getMax(arr) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn getMax;",
    testCases: [
      { args: [[1, 10, 3, 4]], expected: 10 },
      { args: [[-5, -2, -9]], expected: -2 },
      { args: [[5]], expected: 5 }
    ]
  },
  {
    id: 5,
    title: "5. Fibonacci Number",
    description: "Write a function `fibonacci(n)` that returns the n-th Fibonacci number (where F(0)=0, F(1)=1, F(2)=1, etc.).",
    initialCode: "function fibonacci(n) {\n  // your code here\n  \n}\n\n// Do not change below\nreturn fibonacci;",
    testCases: [
      { args: [0], expected: 0 },
      { args: [1], expected: 1 },
      { args: [6], expected: 8 }
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

export default function Day2() {
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
    const saved = localStorage.getItem('day2_progress');
    if (saved) {
      setReadTopics(JSON.parse(saved));
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('day2_progress', JSON.stringify(readTopics));
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
            <span>Day 2 Progress</span>
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
              {activeTab === 'reading' && "Module 2: Advanced CSS & Responsive"}
              {activeTab === 'compiler' && "Day 2 Practice Environment"}
              {activeTab === 'quiz' && "Day 2 Quiz Check"}
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
                    Day 2 of 30
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    Responsive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Web Design</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
                    Today, we learn how to structuralize and customize layouts. Create fluid box boundaries, adapt layouts dynamically, and deploy CSS models.
                  </p>
                </div>
              </div>

              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search Day 2 content..."
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
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Day 2 Assessment</h2>
                <p className="text-lg text-slate-600 dark:text-gray-400">Validate your layout and responsiveness knowledge.</p>
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
                      <p className="text-yellow-400 text-sm mt-4">Note: Complete all reading materials to earn your Day 2 Certificate!</p>
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
              
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Day 2 Complete!</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Excellent! You've mastered CSS Layouts, Grid structures, Flexbox models, and Responsive Design logic. You are 2 steps closer to your dream role.
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
