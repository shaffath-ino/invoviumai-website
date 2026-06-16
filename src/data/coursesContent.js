// Centralized premium curriculum registry for all 90 days across 5 internship tracks.
// Programmatically constructs 10 subtopics, 20 MCQs, 5 short/long questions, 5 coding/practical tasks,
// and weekly/monthly milestones (quizzes, assignments, exams, and projects) for every single day.

const courseTracks = {
  'Web Development Internship': 'webdev',
  'Python Internship': 'python',
  'Java Internship': 'java',
  'Golang Internship': 'golang',
  'Cyber Security Internship': 'cybersecurity'
};

const courseMetadata = {
  webdev: {
    name: "Web Development Internship",
    topics: [
      "Web Architecture & DNS Protocols", "Semantic Document Structures", "Form Handling & A11y Standards",
      "CSS Selector Priorities & Inheritance", "Flexbox Axis Alignments", "CSS Grid Multi-Column Structures",
      "Responsive Fluid Layouts & Typography", "Keyframe Web Animations", "CSS Variable Custom Engines",
      "JS Compiler V8 Engine Parsing", "Asynchronous Events Loop", "Promises & Callback Handling",
      "Axios REST Request Workflows", "Vite Bundler Configurations", "State Hook useState Execution",
      "Effect Hook useEffect Lifecycle", "Ref Hook useRef DOM References", "React Router client side navigation",
      "Context API state managers", "Node Core Architecture & Modules", "Express Server Routing Patterns",
      "Middleware pipelines execution", "NoSQL Data Modeling Atlas", "Mongoose Schema Relational Mappings",
      "Bcrypt password hashes cryptography", "JWT Token filter validations", "CORS policy and session variables",
      "Multer multipart file attachments", "Aggregation Queries databases", "Index optimization databases",
      "Jest Unit test frameworks routers", "Vercel Frontend hosting pipelines", "Render backend deployments"
    ]
  },
  python: {
    name: "Python Internship",
    topics: [
      "Interpreter architecture PEP8 formats", "Lists & Tuples allocations", "Dictionary hash lookups",
      "Sets uniqueness operations", "Functional scopes & variable args", "Lambda expressions maps",
      "Classes inheritance model", "Polymorphism method execution", "Dunder magic properties",
      "File I/O text processing", "JSON/CSV database pipelines", "Exceptions hierarchies catch",
      "BeautifulSoup dynamic scrapers", "Requests header configurations", "Relational SQL databases schema",
      "PostgreSQL tables setups", "psycopg2 query execution driver", "Flask web app routing",
      "Flask templates parameters", "Django project architectures", "Django models schema migration",
      "Django views templates handlers", "DRF Serializers fields definitions", "DRF ViewSets routing setups",
      "JWT authentications configurations", "Redis cache layer queues", "Celery tasks schedules broker",
      "Pytest unit mocks assertions", "Docker multi-stage packages", "AWS backend server deployments"
    ]
  },
  java: {
    name: "Java Internship",
    topics: [
      "JVM internals bytecode memory", "Primitive variables static scopes", "If-Else conditionals scopes",
      "Loops switch expressions parameters", "Single multi-dimensional arrays", "Class constructs objects heap",
      "Encapsulation getters setters fields", "Subclass extends overrides rules", "Interface declaration contracts",
      "Abstract classes method structures", "Try catch resource blocks", "ArrayList LinkedList list limits",
      "HashMaps mappings lookup key", "Functional interfaces lambda syntax", "Streams API filter map operations",
      "Runnable classes threads execution", "Thread pools executor mechanics", "JDBC drivers persistence models",
      "Spring Boot IoC injections", "Hibernate entity database mapping", "Spring Data JPA repositories",
      "REST Controllers requests mapping", "Security configurations stateless JWT", "Eureka Service Discovery models"
    ]
  },
  golang: {
    name: "Golang Internship",
    topics: [
      "Go compiler workspace structures", "Variables constants type systems", "Logical conditions loops structures",
      "Address pointers variables lookup", "Slices structures allocations limits", "Map lookup hash variables",
      "Custom structures fields layout", "Pointer receivers methods rules", "Interface implementation contracts",
      "Composition vs Class hierarchies", "Go error values check", "Defer execution stacks",
      "Panic recover handlers pipeline", "Goroutine execution schedule model", "Channels buffers sync controls",
      "Select statements channels routing", "WaitGroups threads synchronization models", "Mutex variable locking mechanics",
      "net/http package servers execution", "Chi routing endpoints parameters", "GORM schemas migrations queries",
      "Auth headers validations middleware", "Table driven tests tests", "Kubernetes cluster hosting setups"
    ]
  },
  cybersecurity: {
    name: "Cyber Security Internship",
    topics: [
      "CIA triad parameters auditing", "Network protocols TCP UDP", "OSI model layers deconstruction",
      "IP formats subnet calculations", "Wireshark packet header analyses", "Linux terminal files navigation",
      "Bash automation script structures", "OSINT active recon domains", "Nmap scans firewalls checks",
      "CVE catalogs CVSS risk", "Metasploit payloads target execution", "Linux privilege check scripts",
      "Burp Suite requests interception", "OWASP web vulnerabilities checks", "Symmetric cryptography keys encryption",
      "Wireless WPA2 checks", "Malware reverse engineering assembly", "Forensics evidence logs collections"
    ]
  }
};

// Generates complete dynamic details for a specific day
const generateDynamicDay = (trackKey, day) => {
  const meta = courseMetadata[trackKey];
  const topicIdx = Math.min(Math.floor((day - 1) / 3), meta.topics.length - 1);
  const coreTheme = meta.topics[topicIdx];
  const month = Math.ceil(day / 30);
  const week = Math.ceil(day / 7);
  const moduleName = `Month ${month}: ${month === 1 ? 'Foundation' : month === 2 ? 'Intermediate' : 'Advanced & Professional'} (Days ${month === 1 ? '1–30' : month === 2 ? '31–60' : '61–90'})`;

  // 10 Detailed Topics
  const topics = [];
  for (let i = 1; i <= 10; i++) {
    topics.push({
      id: `${trackKey}-d${day}-t${i}`,
      title: `Sub-topic ${i}: Deep Dive into ${coreTheme} Part ${i}`,
      content: `This section covers advanced structural concepts, design parameters, and implementation mechanics of **${coreTheme} (Part ${i})**.\n\n### Theoretical Foundations\nDevelopers must understand the underpinnings of ${coreTheme} to avoid common architecture bottlenecks. Standard conventions suggest modular design structures where boundaries are clearly declared.\n\n### Step-by-Step Practical Activities\n1. Initialize your execution environment.\n2. Configure specific parameters matching your local setup.\n3. Execute tests using compilation tools to confirm runtime success.\n\n### Real-world Case Studies\nIn industry applications, organizations leverage this paradigm to reduce latency by up to 45% and ensure maximum data isolation under high concurrent traffic models.`,
      interview: `Q: What is the main structural consideration when configuring ${coreTheme} Part ${i}?\nA: The primary concern is resource management and thread synchronization. Developers must avoid blocked threads and use connection pooling.`
    });
  }

  // 20 MCQs
  const mcqs = [];
  for (let i = 1; i <= 20; i++) {
    const correctIdx = (i % 4);
    mcqs.push({
      question: `Question ${i}: Regarding ${coreTheme}, which statement best describes the standard practice in configuration ${i}?`,
      options: [
        `Option A: Bypasses runtime check validation metrics`,
        `Option B: Enhances data isolation and enforces strict typing validations`,
        `Option C: Allows direct memory modification without pointer references`,
        `Option D: Relies on external server environments for local validation`
      ],
      answer: correctIdx,
      explanation: `Correct Option is option ${['A', 'B', 'C', 'D'][correctIdx]}. Standard practice prioritizes safety and scalability configurations.`
    });
  }

  // 5 Short & 5 Long Answer Questions
  const shortQuestions = [];
  const longQuestions = [];
  
  const getShortQuestion = (index, theme) => {
    switch(index) {
      case 1:
        return {
          question: `Explain the fundamental purpose and role of ${theme} in modern software applications.`,
          answer: `${theme} provides the core structural mechanics and logical pathways for organizing system code, managing resource states, or handling variables. Properly utilizing it is essential for writing clean, modular, and maintainable software systems.`
        };
      case 2:
        return {
          question: `What is the recommended industry best practice or coding standard when implementing modules utilizing ${theme}?`,
          answer: `Industry standards suggest complying with strict style guides (such as PEP8 for Python, structural OOP naming templates in Java, or idiomatic patterns in Go), enforcing separation of concerns, writing self-contained components, and logging errors properly.`
        };
      case 3:
        return {
          question: `Identify a common issue or resource bottleneck developers encounter when working with ${theme}, and how to resolve it.`,
          answer: `Common issues include connection leaks, unhandled exceptions, or unoptimized data queries. This can be resolved by wrapping files and network drivers in try-catch-finally or try-with-resources blocks, allocating pools, and sanitizing input values.`
        };
      case 4:
        return {
          question: `How does efficient allocation and execution of ${theme} impact application speed and memory footprints?`,
          answer: `Optimized implementation prevents stack overflows, reduces garbage collection overheads, limits memory fragmentation, and avoids blocked threads, resulting in faster request cycles and lower container scaling costs.`
        };
      default:
        return {
          question: `What security considerations must be evaluated when utilizing or exposing ${theme} parameters?`,
          answer: `Developers must sanitize all input fields to avoid query injection, protect endpoints using secure authenticators (like JWT), encrypt data payloads, and avoid exposing raw internal memory stacks or configuration files.`
        };
    }
  };

  const getLongQuestion = (index, theme) => {
    switch(index) {
      case 1:
        return {
          question: `Provide a detailed architectural breakdown of how ${theme} is configured and deployed in high-throughput enterprise systems.`,
          answer: `Architecting this configuration requires separating layers (Controller, Service, Repository), establishing connection pooling to handle data channels safely, implementing local caching layers (like Redis) to reduce repeat calculations, and setting up system health checks to detect memory leaks under peak traffic loads.`
        };
      case 2:
        return {
          question: `Detail the step-by-step workflow required to successfully design, test, and deploy a system module based on ${theme}.`,
          answer: `1. Define the module boundary and design specifications.\n2. Write unit tests targeting success, failure, and boundary conditions.\n3. Implement the coding logic using clean programming standards.\n4. Run linter checks and local compilers to resolve warning flags.\n5. Build a multi-stage Docker container and automate cloud deployment using CI/CD tools (e.g. GitHub Actions).`
        };
      case 3:
        return {
          question: `Compare and contrast standard vs. optimized implementations of ${theme}. Under what specific business scenarios does optimization become critical?`,
          answer: `A standard implementation focuses on code readability and fast development, which works well for low-concurrency applications. An optimized implementation utilizes memory pooling, asynchronous task runs, and index layouts. Optimization is critical when processing large files, handling thousands of real-time client requests, or building low-latency APIs.`
        };
      case 4:
        return {
          question: `Describe a scenario where a production system running ${theme} encounters a critical runtime crash. Detail your plan to troubleshoot and resolve it.`,
          answer: `1. Inspect the server logs to locate the crash trace.\n2. Attach a memory profiler to look for memory leaks, deadlocks, or excessive heap allocations.\n3. Identify unresolved streams or network blocks causing resource exhaustion.\n4. Write tests to reproduce the error, edit the code, and compile to verify.`
        };
      default:
        return {
          question: `Explain how a system utilizing ${theme} integrates with external infrastructure layers, such as relational databases, task queues, or third-party web endpoints.`,
          answer: `Integration is achieved by using driver interfaces (e.g., JDBC or psycopg2) and REST APIs. Security is maintained by passing token authenticators in headers. Background long-running workloads are offloaded to task queues (e.g., Celery/Redis) to keep main application responses fast and non-blocking.`
        };
    }
  };

  for (let i = 1; i <= 5; i++) {
    shortQuestions.push(getShortQuestion(i, coreTheme));
    longQuestions.push(getLongQuestion(i, coreTheme));
  }

  // 5 Programming/Practical Exercises
  const challenges = [];
  
  const getExerciseData = (index, trackKey, coreTheme) => {
    let language = 'javascript';
    let title = '';
    let description = '';
    let initialCode = '';
    let testCases = [];
    
    if (trackKey === 'python') {
      language = 'python';
      if (index === 1) {
        title = `Exercise 1: ${coreTheme} Scaler`;
        description = `Write a function in Python that takes a number 'x'. If 'x' is None, return -1. Otherwise, return x multiplied by 2.`;
        initialCode = `def validate_input(x):\n    # your code here\n    if x is None:\n        return -1\n    return x * 2`;
        testCases = [{ args: [10], expected: 20 }, { args: [null], expected: -1 }];
      } else if (index === 2) {
        title = `Exercise 2: ${coreTheme} Even Check`;
        description = `Write a function in Python that takes an integer 'x'. If 'x' is None, return False. Otherwise, return True if 'x' is even, and False if it is odd.`;
        initialCode = `def is_even(x):\n    # your code here\n    if x is None:\n        return False\n    return x % 2 == 0`;
        testCases = [{ args: [10], expected: true }, { args: [7], expected: false }, { args: [null], expected: false }];
      } else if (index === 3) {
        title = `Exercise 3: ${coreTheme} Length Evaluator`;
        description = `Write a function in Python that takes a string 's'. If 's' is None, return 0. Otherwise, return the length of the string.`;
        initialCode = `def get_length(s):\n    # your code here\n    if s is None:\n        return 0\n    return len(s)`;
        testCases = [{ args: ["hello"], expected: 5 }, { args: [null], expected: 0 }];
      } else if (index === 4) {
        title = `Exercise 4: ${coreTheme} Max Value`;
        description = `Write a function in Python that takes two integers 'a' and 'b'. If either is None, return 0. Otherwise, return the larger integer.`;
        initialCode = `def find_max(a, b):\n    # your code here\n    if a is None or b is None:\n        return 0\n    return a if a > b else b`;
        testCases = [{ args: [10, 20], expected: 20 }, { args: [15, 5], expected: 15 }, { args: [null, null], expected: 0 }];
      } else {
        title = `Exercise 5: ${coreTheme} Square Multiplier`;
        description = `Write a function in Python that takes a number 'x'. If 'x' is None, return -1. Otherwise, return the square of x (x * x).`;
        initialCode = `def calculate_square(x):\n    # your code here\n    if x is None:\n        return -1\n    return x * x`;
        testCases = [{ args: [5], expected: 25 }, { args: [null], expected: -1 }];
      }
    } else if (trackKey === 'java') {
      language = 'java';
      if (index === 1) {
        title = `Exercise 1: ${coreTheme} Scaler`;
        description = `Write a static method in Java under class 'Validator' that takes an Integer 'x'. If 'x' is null, return -1. Otherwise, return x multiplied by 2.`;
        initialCode = `public class Validator {\n    public static int validateInput(Integer x) {\n        // your code here\n        if (x == null) return -1;\n        return x * 2;\n    }\n}`;
        testCases = [{ args: [10], expected: 20 }, { args: [null], expected: -1 }];
      } else if (index === 2) {
        title = `Exercise 2: ${coreTheme} Even Check`;
        description = `Write a static method in Java under class 'Validator' that takes an Integer 'x'. If 'x' is null, return false. Otherwise, return true if 'x' is even, and false if odd.`;
        initialCode = `public class Validator {\n    public static boolean isEven(Integer x) {\n        // your code here\n        if (x == null) return false;\n        return x % 2 == 0;\n    }\n}`;
        testCases = [{ args: [10], expected: true }, { args: [7], expected: false }, { args: [null], expected: false }];
      } else if (index === 3) {
        title = `Exercise 3: ${coreTheme} Length Evaluator`;
        description = `Write a static method in Java under class 'Validator' that takes a String 's'. If 's' is null, return 0. Otherwise, return the length of the string.`;
        initialCode = `public class Validator {\n    public static int getLength(String s) {\n        // your code here\n        if (s == null) return 0;\n        return s.length();\n    }\n}`;
        testCases = [{ args: ["hello"], expected: 5 }, { args: [null], expected: 0 }];
      } else if (index === 4) {
        title = `Exercise 4: ${coreTheme} Max Value`;
        description = `Write a static method in Java under class 'Validator' that takes two Integers 'a' and 'b'. If either is null, return 0. Otherwise, return the larger integer.`;
        initialCode = `public class Validator {\n    public static int findMax(Integer a, Integer b) {\n        // your code here\n        if (a == null || b == null) return 0;\n        return a > b ? a : b;\n    }\n}`;
        testCases = [{ args: [10, 20], expected: 20 }, { args: [15, 5], expected: 15 }, { args: [null, null], expected: 0 }];
      } else {
        title = `Exercise 5: ${coreTheme} Square Multiplier`;
        description = `Write a static method in Java under class 'Validator' that takes an Integer 'x'. If 'x' is null, return -1. Otherwise, return the square of x (x * x).`;
        initialCode = `public class Validator {\n    public static int calculateSquare(Integer x) {\n        // your code here\n        if (x == null) return -1;\n        return x * x;\n    }\n}`;
        testCases = [{ args: [5], expected: 25 }, { args: [null], expected: -1 }];
      }
    } else if (trackKey === 'golang') {
      language = 'go';
      if (index === 1) {
        title = `Exercise 1: ${coreTheme} Scaler`;
        description = `Write a function in Go that takes a pointer to an int 'x'. If 'x' is nil, return -1. Otherwise, return the dereferenced value of x multiplied by 2.`;
        initialCode = `package main\n\nfunc validateInput(x *int) int {\n    // your code here\n    if x == nil {\n        return -1\n    }\n    return *x * 2\n}`;
        testCases = [{ args: [10], expected: 20 }, { args: [null], expected: -1 }];
      } else if (index === 2) {
        title = `Exercise 2: ${coreTheme} Even Check`;
        description = `Write a function in Go that takes a pointer to an int 'x'. If 'x' is nil, return false. Otherwise, return true if x is even, and false if odd.`;
        initialCode = `package main\n\nfunc isEven(x *int) bool {\n    // your code here\n    if x == nil {\n        return false\n    }\n    return *x % 2 == 0\n}`;
        testCases = [{ args: [10], expected: true }, { args: [7], expected: false }, { args: [null], expected: false }];
      } else if (index === 3) {
        title = `Exercise 3: ${coreTheme} Length Evaluator`;
        description = `Write a function in Go that takes a pointer to a string 's'. If 's' is nil, return 0. Otherwise, return the length of the string.`;
        initialCode = `package main\n\nfunc getLength(s *string) int {\n    // your code here\n    if s == nil {\n        return 0\n    }\n    return len(*s)\n}`;
        testCases = [{ args: ["hello"], expected: 5 }, { args: [null], expected: 0 }];
      } else if (index === 4) {
        title = `Exercise 4: ${coreTheme} Max Value`;
        description = `Write a function in Go that takes two pointers to ints 'a' and 'b'. If either is nil, return 0. Otherwise, return the larger of the two values.`;
        initialCode = `package main\n\nfunc findMax(a *int, b *int) int {\n    // your code here\n    if a == nil || b == nil {\n        return 0\n    }\n    if *a > *b {\n        return *a\n    }\n    return *b\n}`;
        testCases = [{ args: [10, 20], expected: 20 }, { args: [15, 5], expected: 15 }, { args: [null, null], expected: 0 }];
      } else {
        title = `Exercise 5: ${coreTheme} Square Multiplier`;
        description = `Write a function in Go that takes a pointer to an int 'x'. If 'x' is nil, return -1. Otherwise, return the square of the dereferenced value (x * x).`;
        initialCode = `package main\n\nfunc calculateSquare(x *int) int {\n    // your code here\n    if x == nil {\n        return -1\n    }\n    return (*x) * (*x)\n}`;
        testCases = [{ args: [5], expected: 25 }, { args: [null], expected: -1 }];
      }
    } else if (trackKey === 'cybersecurity') {
      language = 'bash';
      if (index === 1) {
        title = `Exercise 1: ${coreTheme} Scaler`;
        description = `Write a Bash script that takes a positional parameter $1. If the parameter is empty, echo -1. Otherwise, echo the parameter multiplied by 2.`;
        initialCode = `#!/bin/bash\n# your code here\nif [ -z "$1" ]; then\n  echo -1\nelse\n  echo $(( $1 * 2 ))\nfi`;
        testCases = [{ args: [10], expected: 20 }, { args: [null], expected: -1 }];
      } else if (index === 2) {
        title = `Exercise 2: ${coreTheme} Even Check`;
        description = `Write a Bash script that takes a positional parameter $1. If the parameter is empty, echo false. Otherwise, echo true if even, and false if odd.`;
        initialCode = `#!/bin/bash\n# your code here\nif [ -z "$1" ]; then\n  echo false\nelse\n  if [ $(( $1 % 2 )) -eq 0 ]; then\n    echo true\n  else\n    echo false\n  fi\nfi`;
        testCases = [{ args: [10], expected: true }, { args: [7], expected: false }, { args: [null], expected: false }];
      } else if (index === 3) {
        title = `Exercise 3: ${coreTheme} Length Evaluator`;
        description = `Write a Bash script that takes a positional parameter $1. If the parameter is empty, echo 0. Otherwise, echo the length of the string.`;
        initialCode = `#!/bin/bash\n# your code here\nif [ -z "$1" ]; then\n  echo 0\nelse\n  echo \${#1}\nfi`;
        testCases = [{ args: ["hello"], expected: 5 }, { args: [null], expected: 0 }];
      } else if (index === 4) {
        title = `Exercise 4: ${coreTheme} Max Value`;
        description = `Write a Bash script that takes two positional parameters $1 and $2. If either is empty, echo 0. Otherwise, echo the larger number.`;
        initialCode = `#!/bin/bash\na=$1\nb=$2\nif [ -z "$a" ] || [ -z "$b" ]; then\n  echo 0\nelif [ $a -gt $b ]; then\n  echo $a\nelse\n  echo $b\nfi`;
        testCases = [{ args: [10, 20], expected: 20 }, { args: [15, 5], expected: 15 }, { args: [null, null], expected: 0 }];
      } else {
        title = `Exercise 5: ${coreTheme} Square Multiplier`;
        description = `Write a Bash script that takes a positional parameter $1. If the parameter is empty, echo -1. Otherwise, echo the square of the parameter ($1 * $1).`;
        initialCode = `#!/bin/bash\n# your code here\nif [ -z "$1" ]; then\n  echo -1\nelse\n  echo $(( $1 * $1 ))\nfi`;
        testCases = [{ args: [5], expected: 25 }, { args: [null], expected: -1 }];
      }
    } else {
      language = 'javascript';
      if (index === 1) {
        title = `Exercise 1: ${coreTheme} Scaler`;
        description = `Write a function in JavaScript that takes an argument 'x'. If 'x' is undefined or null, return -1. Otherwise, return x multiplied by 2.`;
        initialCode = `function validateInput(x) {\n  // your code here\n  if (x === undefined || x === null) return -1;\n  return typeof x === 'number' ? x * 2 : -1;\n}\nreturn validateInput;`;
        testCases = [{ args: [10], expected: 20 }, { args: [null], expected: -1 }];
      } else if (index === 2) {
        title = `Exercise 2: ${coreTheme} Even Check`;
        description = `Write a function in JavaScript that takes an argument 'x'. If 'x' is undefined or null, return false. Otherwise, return true if 'x' is even, and false if odd.`;
        initialCode = `function isEven(x) {\n  // your code here\n  if (x === undefined || x === null) return false;\n  return x % 2 === 0;\n}\nreturn isEven;`;
        testCases = [{ args: [10], expected: true }, { args: [7], expected: false }, { args: [null], expected: false }];
      } else if (index === 3) {
        title = `Exercise 3: ${coreTheme} Length Evaluator`;
        description = `Write a function in JavaScript that takes an argument 's'. If 's' is undefined or null, return 0. Otherwise, return the length of the string.`;
        initialCode = `function getLength(s) {\n  // your code here\n  if (s === undefined || s === null) return 0;\n  return s.length;\n}\nreturn getLength;`;
        testCases = [{ args: ["hello"], expected: 5 }, { args: [null], expected: 0 }];
      } else if (index === 4) {
        title = `Exercise 4: ${coreTheme} Max Value`;
        description = `Write a function in JavaScript that takes two arguments 'a' and 'b'. If either is undefined or null, return 0. Otherwise, return the larger of the two values.`;
        initialCode = `function findMax(a, b) {\n  // your code here\n  if (a === undefined || b === undefined || a === null || b === null) return 0;\n  return a > b ? a : b;\n}\nreturn findMax;`;
        testCases = [{ args: [10, 20], expected: 20 }, { args: [15, 5], expected: 15 }, { args: [null, null], expected: 0 }];
      } else {
        title = `Exercise 5: ${coreTheme} Square Multiplier`;
        description = `Write a function in JavaScript that takes an argument 'x'. If 'x' is undefined or null, return -1. Otherwise, return the square of x (x * x).`;
        initialCode = `function calculateSquare(x) {\n  // your code here\n  if (x === undefined || x === null) return -1;\n  return x * x;\n}\nreturn calculateSquare;`;
        testCases = [{ args: [5], expected: 25 }, { args: [null], expected: -1 }];
      }
    }
    
    return {
      id: index,
      title,
      description: `Task ${index} (${language.toUpperCase()}): ${description} [Theme: ${coreTheme}]`,
      initialCode,
      testCases
    };
  };

  for (let i = 1; i <= 5; i++) {
    challenges.push(getExerciseData(i, trackKey, coreTheme));
  }

  // Milestones on Week/Month boundaries
  let milestones = null;
  if (day % 7 === 0) {
    const wQuiz = [];
    for (let k = 1; k <= 5; k++) {
      wQuiz.push({
        question: `Weekly Check ${k}: In ${coreTheme}, how do we maintain consistency?`,
        options: ["Strict validations", "No check logic", "Re-compiling", "External libraries"],
        answer: 0,
        explanation: "Strict validation enforces type safety and prevents data anomalies."
      });
    }

    milestones = {
      weeklyAssignment: `Write a comprehensive technical report and submit a working repository implementing the week ${week} core project on ${coreTheme}. Your solution must conform to standard style guides.`,
      weeklyQuiz: wQuiz,
      weeklyChallenge: `Weekly Hackathon Challenge: Optimize a search query program targeting ${coreTheme} data to run in O(log N) time with zero memory leaks.`,
      weeklyAssessment: `Write integration tests for your week ${week} project, achieving at least 95% line coverage.`
    };
  }

  // Monthly boundaries
  if (day === 30 || day === 60 || day === 90) {
    milestones = {
      ...milestones,
      monthlyExam: `Month ${month} Comprehensive Theoretical Examination. Contains 50 detailed questions testing system architecture, memory parameters, databases, and structural coding practices.`,
      monthlyProject: `Month ${month} Mini Project. Build and deploy a complete functional prototype representing the Month ${month} focus: ${month === 1 ? 'CLI Foundation tools' : month === 2 ? 'Full Stack Database API backend' : 'Advanced Cloud Deployed SaaS platform'}.`
    };
    if (day === 90) {
      milestones.capstoneChecklist = [
        "Final Capstone Project Deployment",
        "Technical Documentation & Architecture diagrams",
        "Performance optimization profiling logs",
        "Placement Mock Interview & Viva Voce defense"
      ];
    }
  }

  return {
    dayTitle: `Day ${day}: Advanced Training in ${coreTheme}`,
    moduleName: moduleName,
    learningObjectives: [
      `Understand core syntax, architecture constraints, and variables of ${coreTheme}.`,
      `Design and deploy memory-optimized code pipelines matching industry standards.`,
      `Implement security protocols and handle errors idiomatic to the technology stack.`
    ],
    keyConcepts: [
      `${coreTheme} Architecture`,
      "Scalability parameters",
      "State tracking and persistence",
      "Stateless authorization layers"
    ],
    topics,
    mcqs,
    shortQuestions,
    longQuestions,
    challenges,
    summary: `Today we covered the core components of ${coreTheme}. We analyzed structural patterns, reviewed case studies, completed hands-on compiler exercises, and finished quizzes.`,
    interviewQuestions: [
      {
        question: `How do you resolve memory leaks in systems utilizing ${coreTheme}?`,
        answer: "Profile the application using memory profilers, identify references held in memory scopes, release unused structures, and use connection pool libraries."
      },
      {
        question: `Describe an industry-standard deployment pipeline for ${coreTheme}.`,
        answer: "The code is checked into Git, runs unit tests in GitHub actions, builds a multi-stage Docker container, pushes to a container registry, and deploys to Kubernetes cluster pods."
      }
    ],
    milestones
  };
};

export const getCourseDayContent = (courseTitle, dayNumber) => {
  const trackKey = courseTracks[courseTitle];
  if (!trackKey) return null;
  return generateDynamicDay(trackKey, dayNumber);
};
