import mongoose from 'mongoose';
import Course from './models/Course.js';
import config from '../config.js';

const seedCourses = async () => {
  try {
    await mongoose.connect(config.MONGO_URI || 'mongodb://127.0.0.1:27017/invoviumai');

    const courses = [
      {
        title: 'Web Development Internship',
        description: 'Master full-stack web development with modern HTML5, CSS3, React.js, Node.js, Express, and MongoDB.',
        duration: '3 Months (90 Days)',
        price: 6000,
        overview: 'An elite, comprehensive full-stack software training track designed to prepare students for top tier development roles. Covers advanced frontend responsiveness, state engines, server-side REST APIs, database scaling, system security, and cloud continuous integration.',
        targetAudience: 'Aspiring Full-Stack Engineers, IT/CS College Students, Web Developers, and Software Engineers migrating to MERN Stack.',
        prerequisites: 'Basic logic and algorithmic fundamentals. Prior knowledge of HTML/CSS is helpful but not required.',
        learningOutcomes: [
          'Master Semantic HTML5 and responsive interfaces using Flexbox and Grid layouts.',
          'Build scalable single page applications (SPAs) with React.js, Context API, and state hooks.',
          'Design and deploy optimized Express.js web servers with custom middleware handlers.',
          'Model databases using MongoDB Atlas and Mongoose ODM references and aggregations.',
          'Implement secure stateless sessions with JSON Web Tokens (JWT) and Bcrypt encryption.',
          'Configure multi-stage Docker builds and build CI/CD deployment pipelines.'
        ],
        projectsInfo: {
          miniProjects: [
            'Month 1 Mini Project: Pixel-Perfect Dynamic Personal Portfolio Website with custom scroll animations and responsive CSS controls.',
            'Month 2 Mini Project: Secure Real-time Collaborative Task Board with frontend router, state Context management, and REST API storage.'
          ],
          capstoneProject: 'Final Capstone Project: Production-grade SaaS E-commerce Platform with JWT-based sessions, file storage, multi-criteria filters, and simulate payment gateways. Deployed on Vercel and Render.'
        },
        assessmentStructure: 'Daily 20 MCQs quizzes, weekly lab assignments, monthly practical evaluations, final capstone code reviews, and viva voce verification.',
        careerPreparation: 'Technical resume optimization, portfolio showcase sites, GitHub profiles styling, LinkedIn ranking upgrades, weekly mock tests, and HR/technical placement interviews.',
        certificationCriteria: 'Successful grade on 12 weekly assignments, completion of all 90 daily checks, passing marks in monthly exams, and approval of the Capstone project.',
        readinessScore: 96,
        recommendations: 'Dedicate 12-15 hours weekly to practical compiler exercises. Focus on understanding the Javascript event loop and database indexing models.',
        stages: [
          {
            level: 'Beginner',
            content: `**Focus: Core UI/UX design, Semantic Layouts, Advanced CSS Grid/Flexbox, responsive styling, and modern JS variables.**\n\n* **Week 1: Web Foundations & Semantic HTML5 (Days 1–7)**\n  * How servers parse HTML, semantic nodes, accessibility protocols, metadata configuration.\n* **Week 2: Advanced CSS Layouts (Days 8–14)**\n  * Flexbox, Grid properties, fluid spacing, CSS Custom Properties (variables), styling workflows.\n* **Week 3: Mobile-First Responsive Design (Days 15–21)**\n  * Media queries, responsive grid layouts, breakpoints, animations, keyframe designs.\n* **Week 4: JavaScript Core Programming (Days 22–30)**\n  * Statically/dynamically typed logic, variables (let, const), loop controls, function scopes, DOM selectors.\n  * **Assignment:** Build and deploy a pixel-perfect, responsive portfolio website on Vercel.`
          },
          {
            level: 'Intermediate',
            content: `**Focus: React component logic, navigation hooks, custom hooks, Express servers, and database integration.**\n\n* **Week 5: Asynchronous JS & API Integration (Days 31–37)**\n  * Promises, Event Loop mechanics, Async/Await syntax, fetching JSON APIs with Axios.\n* **Week 6: React.js Component Architecture (Days 38–44)**\n  * JSX, components, props, state engines (useState), lifecycle hooks (useEffect), and refs (useRef).\n* **Week 7: React Navigation & State Engines (Days 45–51)**\n  * Client-side routing (React Router DOM), global states (Context API), rapid styling (Tailwind CSS).\n* **Week 8: Node.js, Express & MongoDB (Days 52–60)**\n  * Server creation, routing middleware, Mongoose models, document references, CRUD logic.\n  * **Assignment:** Build a dynamic tasks dashboard connecting React front-end with an Express back-end.`
          },
          {
            level: 'Advanced',
            content: `**Focus: Security architectures, JWT authentication, unit testing, Docker, and SaaS deployments.**\n\n* **Week 9: Stateless Session Security & JWT (Days 61–67)**\n  * Bcrypt password encryption, stateless authorization filters with JSON Web Tokens (JWT), route protection.\n* **Week 10: Advanced API Engineering & uploads (Days 68–74)**\n  * Multi-part file uploads (Multer), MongoDB aggregations, text searches, and pagination mechanics.\n* **Week 11: Unit Testing & Performance (Days 75–81)**\n  * Testing router endpoints with Jest/Supertest, endpoint caching, security headers, database optimization.\n* **Week 12: Production Cloud Deployments (Days 82–90)**\n  * Docker container builds, Vercel/Render hosting pipelines, and Capstone Project defense.`
          }
        ]
      },
      {
        title: 'Python Internship',
        description: 'Master Python backend engineering, data structures, scrapers, APIs, and Django MVC patterns.',
        duration: '3 Months (90 Days)',
        price: 6000,
        overview: 'A premium, software engineering-oriented Python curriculum detailing clean code, PEP8 standard parameters, relational schema mapping, and Django REST framework APIs.',
        targetAudience: 'Aspiring Back-end Engineers, Software Architects, and automation specialists.',
        prerequisites: 'Analytical skills and basic algebraic logic. No prior programming needed.',
        learningOutcomes: [
          'Write professional, clean code complying with PEP8 guidelines.',
          'Manipulate advanced data collections (Lists, Dicts, Tuples, Sets) and loops.',
          'Scrape dynamic websites using BeautifulSoup and Requests libraries.',
          'Design relational schemas and write SQL queries in PostgreSQL.',
          'Build RESTful APIs using Flask and Django REST Framework (DRF).',
          'Deploy containerized Python backends to AWS and Heroku using Docker.'
        ],
        projectsInfo: {
          miniProjects: [
            'Month 1 Mini Project: CLI-based Task Management and Logging utility using Python OOP and JSON persistence.',
            'Month 2 Mini Project: High-Performance Concurrent Web Scraper capturing dynamic web data with parallel threading.'
          ],
          capstoneProject: 'Final Capstone Project: Multi-module Django REST API SaaS platform with secure JWT session filtering, file attachments, and PostgreSQL deployment.'
        },
        assessmentStructure: 'Daily coding challenges, weekly technical assignments, monthly examinations, and final Capstone project code defense.',
        careerPreparation: 'Technical interview simulations (Data structures & algorithms), resume building, LinkedIn branding, and mock interviews.',
        certificationCriteria: 'Passing score in all weekly coding assignments, all daily quiz checks, and successful defense of Capstone backend.',
        readinessScore: 95,
        recommendations: 'Understand python list comprehensions, generators, and reference variables mapping early in Month 1.',
        stages: [
          {
            level: 'Beginner',
            content: `**Focus: Python basic syntax, primitives, variables, collections, modular structures, and OOP principles.**\n\n* **Week 1: Foundations & Environments (Days 1–7)**\n  * Python compilers, virtualenv setups, variable declaration typings, basic logic operators.\n* **Week 2: Advanced Python Collections (Days 8–14)**\n  * Lists, Tuples, Dictionaries, Sets, slice indexing, collections mapping methods.\n* **Week 3: Functions & Scopes (Days 15–21)**\n  * Python functions, parameters mapping (*args, **kwargs), local vs. global scopes, lambda blocks.\n* **Week 4: Object-Oriented Programming (Days 22–30)**\n  * Classes declaration, self variables, inheritance properties, polymorph rules, dunder magic methods.\n  * **Assignment:** Build a CLI Employee records registry system using OOP practices.`
          },
          {
            level: 'Intermediate',
            content: `**Focus: Advanced file stream processing, website scraping, database modeling, and Flask micro-services.**\n\n* **Week 5: File Stream Operations & Errors (Days 31–37)**\n  * File open formats, reading CSV/JSON, exception hierarchies, clean logs outputs.\n* **Week 6: Pattern Matching & Web Scrapers (Days 38–44)**\n  * Regular expressions, fetching pages, parsing HTML DOM nodes with BeautifulSoup, rotators.\n* **Week 7: SQL databases & Queries (Days 45–51)**\n  * DBMS structures, PostgreSQL setup, relational tables, psycopg2 queries driver.\n* **Week 8: Flask Framework Essentials (Days 52–60)**\n  * Flask application setup, JSON endpoints routing, request handling, and basic server templates.\n  * **Assignment:** Create a weather API aggregator parsing external data and writing to a local DB.`
          },
          {
            level: 'Advanced',
            content: `**Focus: Django MVC design, Django ORM, REST API serializing, background queues, and Docker configurations.**\n\n* **Week 9: Django MVC Architecture (Days 61–67)**\n  * Django setups, project structures, models declarations, views configurations, URLs registry.\n* **Week 10: Django REST Framework (DRF) APIs (Days 68–74)**\n  * API views, serializers, validators, viewsets, JWT token authentications.\n* **Week 11: Backend Testing & Caching (Days 75–81)**\n  * Testing queries using Pytest, testing mocks, Redis caching systems, Gunicorn servers.\n* **Week 12: Docker & Cloud Hosting (Days 82–90)**\n  * Multi-stage Docker packaging, environment configurations, AWS/Heroku deployments, Capstone defense.`
          }
        ]
      },
      {
        title: 'Java Internship',
        description: 'Learn enterprise-grade Java, Spring Boot web services, microservices, and secure JWT auth.',
        duration: '3 Months (90 Days)',
        price: 6000,
        overview: 'A high-level software development curriculum focused on JDK internals, concurrent execution thread locks, relational mappings, and Spring Boot enterprise designs.',
        targetAudience: 'Aspiring Enterprise Developers, Java Backend Engineers, and IT professionals.',
        prerequisites: 'Strong logical reasoning. Prior familiarity with programming principles is recommended.',
        learningOutcomes: [
          'Explain JVM execution models, stack and heap spaces, and garbage collection mechanisms.',
          'Apply structural OOP principles, abstract interfaces, and design patterns in Java.',
          'Process collections APIs (Lists, Sets, Maps) and write Java 8 Lambda Streams.',
          'Code thread-safe concurrent tasks and manage ExecutorService thread pools.',
          'Build enterprise-ready web services with Spring Boot and Spring Data JPA.',
          'Architect decoupled backend networks using Eureka and Spring Cloud Gateway.'
        ],
        projectsInfo: {
          miniProjects: [
            'Month 1 Mini Project: Console-based Library Resource Management application with file-based NIO stream backups.',
            'Month 2 Mini Project: High-Throughput Thread-Safe Transaction Processor handling parallel account transfers.'
          ],
          capstoneProject: 'Final Capstone Project: Enterprise-grade Microservices E-commerce backend using product, billing, and auth services, Eureka discovery hub, Gateway routing, and Docker packaging.'
        },
        assessmentStructure: 'Daily MCQ quizzes, weekly programming lab tasks, monthly exams, and final Capstone project code review.',
        careerPreparation: 'Java system design review, design patterns practices, mock interviews, and enterprise resume styling.',
        certificationCriteria: 'Passing marks in weekly code evaluations, successful compilation of all daily compiler tasks, and deployment of Capstone microservices.',
        readinessScore: 96,
        recommendations: 'Pay special attention to heap allocations, database connection pooling, and JWT authorization filter rules in Month 2.',
        stages: [
          {
            level: 'Beginner',
            content: `**Focus: JVM architectures, Java syntax, variables, loop types, static methods, and class structures.**\n\n* **Week 1: Java SDK & Ecosystem (Days 1–7)**\n  * JVM memory parameters, javac compilers, primitive data types, mathematical operators.\n* **Week 2: Arrays & Conditional Logic (Days 8–14)**\n  * Double arrays, matrix manipulation, switch expressions, block scopes, iteration controls.\n* **Week 3: Core Object Orientation (Days 15–21)**\n  * Constructors, static keywords, methods overload, encapsulation practices, getters and setters.\n* **Week 4: Abstraction & Subclasses (Days 22–30)**\n  * Abstract classes, extends properties, interfaces implementations, multiple interfaces protocols.\n  * **Assignment:** Code a school registry console utility using OOP structures.`
          },
          {
            level: 'Intermediate',
            content: `**Focus: Exceptions hierarchy, collections framework, lambda pipelines, and multithreaded tasks.**\n\n* **Week 5: Exceptions & File NIO (Days 31–37)**\n  * Throw vs catch rules, try-with-resources blocks, NIO file readers and writers.\n* **Week 6: Collections API (Days 38–44)**\n  * List implementations, HashMaps, TreeSet elements, Custom Comparators, sorting structures.\n* **Week 7: Java 8+ Lambda Streams (Days 45–51)**\n  * Functional interfaces, Lambda expressions, map-filter-reduce pipelines, Optional variables handling.\n* **Week 8: Multithreading & DB connectivity (Days 52–60)**\n  * Runnable classes, Thread synchronization locks, thread pools, JDBC drivers, database query mappings.\n  * **Assignment:** Create a concurrent parser reading text files and persisting to a relational DB.`
          },
          {
            level: 'Advanced',
            content: `**Focus: Spring Boot REST APIs, Spring Data JPA, JWT filtering, Microservices, and cloud deployments.**\n\n* **Week 9: Spring Core & Data JPA (Days 61–67)**\n  * Dependency injection container, configurations, Hibernate entity mappings, SQL schema configurations.\n* **Week 10: Spring Boot Web APIs (Days 68–74)**\n  * Web controllers, service layers, repositories, input validation checks, REST standard formats.\n* **Week 11: Spring Security & JWT (Days 75–81)**\n  * Security filters, password crypt encrypt, custom JWT token verification filter setups.\n* **Week 12: Microservices & Docker Deploy (Days 82–90)**\n  * Eureka Service Discovery, Gateway configurations, Docker multi-stage packaging, Capstone defense.`
          }
        ]
      },
      {
        title: 'Golang Internship',
        description: 'Dive into high-performance backend systems with Go, channels, select, Chi routing, and GORM.',
        duration: '3 Months (90 Days)',
        price: 6000,
        overview: 'A premium compiled programming course focusing on Go modules, memory addresses, value vs. pointer types, goroutines, channel patterns, Chi routing, and GORM.',
        targetAudience: 'Software Developers, back-end engineers, Cloud Architects, and DevOps specialists.',
        prerequisites: 'Basic knowledge of software flow. Logical mindset is required.',
        learningOutcomes: [
          'Develop statically compiled, high-performance web applications using Go.',
          'Understand memory addresses, pointer dereferencing, and struct layouts.',
          'Manage slice capacity backing arrays and hash maps.',
          'Code concurrent processes using Goroutines, Channels, and WaitGroups.',
          'Build RESTful API backends with Chi router and GORM ORM database mapping.',
          'Package Go binaries inside lightweight scratch containers and deploy to Kubernetes.'
        ],
        projectsInfo: {
          miniProjects: [
            'Month 1 Mini Project: CLI-based server log parsing and reporting utility using Go file IO and structures.',
            'Month 2 Mini Project: Concurrency-driven URL crawler checks with synchronized channel groups.'
          ],
          capstoneProject: 'Final Capstone Project: High-throughput real-time chat service backend utilizing WebSockets, Redis pub-sub channels, and Docker packaging.'
        },
        assessmentStructure: 'Daily MCQ quizzes, weekly table-driven test tasks, monthly code reviews, and Capstone defense.',
        careerPreparation: 'High performance Go backend coding interview simulations, system architecture reviews, and GitHub styling.',
        certificationCriteria: 'Passing all weekly test tasks, all daily assessments, and delivering a concurrency-safe Capstone package.',
        readinessScore: 95,
        recommendations: 'Understand Go channels buffering and pointer memory receivers early in Month 1.',
        stages: [
          {
            level: 'Beginner',
            content: `**Focus: Go compiler runtime configurations, variables, memory pointers, slices capacity, and struct models.**\n\n* **Week 1: Go Workspace & Types (Days 1–7)**\n  * Module initialization (go mod init), variables scopes, compile/run parameters, basic types.\n* **Week 2: Pointers & Control Logic (Days 8–14)**\n  * Memory addresses, variable references, pointer pointers, single loop types (for loop).\n* **Week 3: Slices & Map collection (Days 15–21)**\n  * Backing arrays, slices sizing, map key-value mappings, for-range iterations.\n* **Week 4: Structs, Receivers & Interfaces (Days 22–30)**\n  * Custom structs, value vs. pointer receiver methods, interfaces implementation, composition structures.\n  * **Assignment:** Build a console-based directory index utility parsing JSON records.`
          },
          {
            level: 'Intermediate',
            content: `**Focus: Idiomatic error returns, defer operations, concurrent routines, channels, HTTP server setups.**\n\n* **Week 5: Go Error Models & Defer (Days 31–37)**\n  * Error interface returns, custom error types, defer stacks, panic and recover routines.\n* **Week 6: Goroutines & Channels (Days 38–44)**\n  * Runtime scheduling model, unbuffered channels, buffered pipelines, worker pool patterns.\n* **Week 7: Advanced Concurrency Control (Days 45–51)**\n  * Select blocks, WaitGroups synchronization, Mutex variables locking, atomic logic counters.\n* **Week 8: Standard Library HTTP Server (Days 52–60)**\n  * net/http package, parsing request headers, JSON formatting, Chi routing mappings.\n  * **Assignment:** Create a concurrent API link status checker returning JSON responses.`
          },
          {
            level: 'Advanced',
            content: `**Focus: GORM integrations, GORM migrations, authentication headers, table-driven tests, and Kubernetes.**\n\n* **Week 9: SQL Connection & GORM (Days 61–67)**\n  * SQL driver setups, GORM models migrations, transaction scopes, relationships queries.\n* **Week 10: API Middleware & JWT Auth (Days 68–74)**\n  * Custom route middleware, parsing and validating JWT headers, CORS configurations.\n* **Week 11: Table-Driven Testing & Profile (Days 75–81)**\n  * Testing packages, writing table unit tests, profiling CPU/Memory allocations.\n* **Week 12: Docker & Kubernetes orchestrations (Days 82–90)**\n  * Small binary Docker containers, Kubernetes deployment configs, and Capstone Project defense.`
          }
        ]
      },
      {
        title: 'Cyber Security Internship',
        description: 'Explore defensive security, networking protocols, OSINT, scanning, exploit framework, and OWASP Top 10.',
        duration: '3 Months (90 Days)',
        price: 6000,
        overview: 'A premium cybersecurity track designed to train security professionals in network auditing, Linux automation, vulnerability scanning, and pen-testing protocols.',
        targetAudience: 'Aspiring Security Analysts, Ethical Hackers, System Administrators, and Computer Network Students.',
        prerequisites: 'Basic system navigation knowledge. Linux command line familiarity is helpful but not mandatory.',
        learningOutcomes: [
          'Deconstruct packet structures, network protocols, and OSI model layers.',
          'Automate recon and configuration scripts using Bash/Linux scripting.',
          'Audit target domains using passive and active intelligence reconnaissance (OSINT).',
          'Deploy advanced Nmap scans, Nessus audits, and evaluate vulnerability CVSS metrics.',
          'Execute software exploit pipelines using Metasploit and crack target passwords.',
          'Discover and exploit OWASP Top 10 vulnerabilities, and compile professional security reports.'
        ],
        projectsInfo: {
          miniProjects: [
            'Month 1 Mini Project: Comprehensive Passive OSINT Intelligence Report on target organization.',
            'Month 2 Mini Project: Mock Corporate Network Vulnerability Scan & Assessment Report (OpenVAS/Nmap).'
          ],
          capstoneProject: 'Final Capstone Project: Full-scope Penetration Test on vulnerable network laboratory, incorporating exploit verification, web application auditing, and professional reporting.'
        },
        assessmentStructure: 'Daily MCQ quizzes, weekly technical lab assignments, monthly practical evaluations, and final pentest report defense.',
        careerPreparation: 'Certified Ethical Hacker (CEH) preparation guide, penetration report writing workshops, and defensive mock interviews.',
        certificationCriteria: '90%+ laboratory progress tracking, successful compromise of Month 2/Month 3 machines, and submitting a standard audit report.',
        readinessScore: 94,
        recommendations: 'Practice basic Linux navigation commands immediately. Build your labs inside safe virtualization environments (VirtualBox/VMware).',
        stages: [
          {
            level: 'Beginner',
            content: `**Focus: Cybersecurity concepts, networking protocols, packet analysis, Linux command line.**\n\n* **Week 1: Core Concepts & Networks (Days 1–7)**\n  * CIA triad definitions, ethical hacking rules, OSI/TCP models, network frame headers, DNS protocol details.\n* **Week 2: Network Traffic Audits (Days 8–14)**\n  * Wireshark basic navigation, writing capture filters, inspecting HTTP payloads, TCP Handshakes.\n* **Week 3: Linux Command Line (Days 15–21)**\n  * Linux directory structures, user permissions, process managers, text commands, Bash scripting variables.\n* **Week 4: Information Gathering (OSINT) (Days 22–30)**\n  * Google Dorking operations, DNS record harvesting, Shodan queries, and passive WHOIS lookups.\n  * **Assignment:** Deliver an intelligence profile outlining a target company's network space.`
          },
          {
            level: 'Intermediate',
            content: `**Focus: Scanning methods, CVE registries, exploit structures, and post-exploitation persistence.**\n\n* **Week 5: Scanning & Enumeration (Days 31–37)**\n  * Nmap ping sweeps, TCP Connect vs. Syn scans, OS fingerprinting, and script engine (NSE) commands.\n* **Week 6: Vulnerability Assessment (Days 38–44)**\n  * CVE definitions, CVSS metrics calculation, launching scans with automated tools (Nessus/OpenVAS).\n* **Week 7: Exploits & Password Cracking (Days 45–51)**\n  * Hashing functions, Dictionary attacks with John the Ripper, GPU accelerated cracking with Hashcat.\n* **Week 8: Metasploit & Pivoting (Days 52–60)**\n  * Metasploit modules, setting payloads, handling multi-handlers, basic Windows/Linux privilege checks.\n  * **Assignment:** Audit a vulnerable system, escalate privilege, and write a summary audit.`
          },
          {
            level: 'Advanced',
            content: `**Focus: Web security, Burp Suite, symmetric/asymmetric cryptography, malware, and forensic reports.**\n\n* **Week 9: Web Security Auditing (Days 61–67)**\n  * OWASP Top 10 vulnerabilities, exploiting raw SQL injection payloads, Reflected/Stored XSS scripts.\n* **Week 10: Burp Suite Proxy & SSL (Days 68–74)**\n  * Intercepting request threads, configuring client certs, WPA2 wireless handshake audits.\n* **Week 11: Malware Concepts & Reverse (Days 75–81)**\n  * Trojan files, payload distribution methods, static strings analysis, dynamic behavior checking.\n* **Week 12: Forensics & Penetration Reports (Days 82–90)**\n  * Gathering logs, investigating indicators of compromise, and writing corporate pentest summaries.`
          }
        ]
      }
    ];

    await Course.deleteMany();
    await Course.insertMany(courses);
    console.log('Courses seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();