import mongoose from 'mongoose';
import Course from './models/Course.js';
import config from '../config.js';

const updateCourses = async () => {
  try {
    await mongoose.connect(config.MONGO_URI || 'mongodb://127.0.0.1:27017/invoviumai');

    const webDevStages = [
      {
        level: 'Beginner',
        content: `**Focus: Building pixel-perfect, responsive user interfaces and learning core programming logic.**

* **Week 1: Web Foundations & Semantic HTML5**
  * How the web works (DNS, Hosting, Browsers).
  * Structuring pages with Semantic HTML5 (Forms, Tables, Accessibility/A11y).
* **Week 2: Advanced CSS3 & Responsive Design**
  * CSS Box Model, Flexbox, and CSS Grid.
  * Media queries and Mobile-first responsive design.
  * CSS Animations and Transitions.
* **Week 3: JavaScript Core (ES6+)**
  * Variables, Data Types, Arrays, and Objects.
  * Control flow (If/Else, Loops) and Functions.
  * DOM Manipulation and Event Listeners.
* **Week 4: Asynchronous JS & Version Control**
  * Promises, Async/Await, and fetching data using the Fetch API.
  * Git & GitHub (Branching, Merging, Pull Requests).
  * **Project 1:** Build and host a dynamic, responsive Personal Portfolio.`
      },
      {
        level: 'Intermediate',
        content: `**Focus: Mastering React.js, Backend Engineering, and Database Design.**

* **Week 5 & 6: React.js Fundamentals & Hooks**
  * Virtual DOM, JSX, Component architecture, Props, and State.
  * Deep dive into \`useState\`, \`useEffect\`, and \`useRef\`.
  * Client-side routing with React Router DOM.
* **Week 7: State Management & Modern Styling**
  * Global state management using Context API.
  * Integrating external REST APIs and handling loading/error states.
  * Implementing Tailwind CSS for rapid styling.
* **Week 8 & 9: Node.js, Express.js & MongoDB**
  * Setting up a Node.js server and understanding the Event Loop.
  * Building scalable Express.js routing and middleware.
  * NoSQL concepts and MongoDB Atlas setup using Mongoose ODM.
* **Week 10: Advanced Database Operations**
  * Performing CRUD operations securely.
  * Database relationships (References vs. Embedding) and Aggregations.
  * **Project 2:** Build a secure API with a database and React frontend.`
      },
      {
        level: 'Advanced',
        content: `**Focus: Security, Full-Stack Integration, Optimization, and Deployment.**

* **Week 11 & 12: Security & Authentication**
  * User Registration and Password Hashing using \`bcrypt\`.
  * Stateless Authentication using JSON Web Tokens (JWT).
  * Securing the app against XSS and CSRF attacks.
* **Week 13: Full-Stack Symbiosis (MERN Stack)**
  * Connecting the React frontend to the Express backend.
  * Handling CORS, sending tokens in headers, and managing sessions.
* **Week 14: Advanced Application Features**
  * Handling file/image uploads securely.
  * Implementing pagination, search, and filtering algorithms.
* **Week 15 & 16: Cloud Deployment & CI/CD**
  * Code refactoring, removing bottlenecks, and best practices.
  * Deploying Frontend to Vercel/Netlify.
  * Deploying Backend to Render/Railway.
  * **Final Capstone Project:** Build and deploy a complete Full-Stack SaaS application.`
      }
    ];

    await Course.updateOne(
      { title: 'Web Development Internship' },
      { $set: { stages: webDevStages } }
    );

    console.log('Web Development syllabus updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating courses:', error);
    process.exit(1);
  }
};

updateCourses();
