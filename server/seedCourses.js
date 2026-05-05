import mongoose from 'mongoose';
import Course from './models/Course.js';
import config from '../config.js';

const seedCourses = async () => {
  try {
    await mongoose.connect(config.MONGO_URI || 'mongodb://127.0.0.1:27017/inoviumai');

    const courses = [
      {
        title: 'AI & Machine Learning Internship',
        description: 'Learn the fundamentals of AI and ML through hands-on projects and real-world applications.',
        duration: '3 months',
        price: 5000,
        stages: [
          {
            level: 'Beginner',
            content: 'Introduction to Python, Data Structures, Basic Algorithms, Introduction to AI concepts'
          },
          {
            level: 'Intermediate',
            content: 'Machine Learning algorithms, Neural Networks, Deep Learning basics, TensorFlow/PyTorch introduction'
          },
          {
            level: 'Advanced',
            content: 'Advanced ML techniques, Computer Vision, NLP, Real-world project implementation'
          }
        ]
      },
      {
        title: 'Web Development Internship',
        description: 'Master full-stack web development with modern technologies and frameworks.',
        duration: '4 months',
        price: 6000,
        stages: [
          {
            level: 'Beginner',
            content: `**Focus: Building pixel-perfect, responsive user interfaces and learning core programming logic.**\n\n* **Week 1: Web Foundations & Semantic HTML5**\n  * How the web works (DNS, Hosting, Browsers).\n  * Structuring pages with Semantic HTML5.\n* **Week 2: Advanced CSS3 & Responsive Design**\n  * CSS Box Model, Flexbox, and CSS Grid.\n  * Media queries and Mobile-first responsive design.\n* **Week 3: JavaScript Core (ES6+)**\n  * Variables, Data Types, Arrays, and Objects.\n  * Control flow and Functions.\n* **Week 4: Asynchronous JS & Version Control**\n  * Promises, Async/Await, and Fetch API.\n  * Git & GitHub (Branching, Merging).\n  * **Project 1:** Build and host a dynamic Personal Portfolio.`
          },
          {
            level: 'Intermediate',
            content: `**Focus: Mastering React.js, Backend Engineering, and Database Design.**\n\n* **Week 5 & 6: React.js Fundamentals & Hooks**\n  * Virtual DOM, JSX, Component architecture.\n  * Deep dive into \`useState\`, \`useEffect\`.\n* **Week 7: State Management & Modern Styling**\n  * Global state management using Context API.\n  * Integrating external REST APIs.\n* **Week 8 & 9: Node.js, Express.js & MongoDB**\n  * Setting up a Node.js server.\n  * Building scalable Express.js routing.\n  * MongoDB Atlas setup using Mongoose.\n* **Week 10: Advanced Database Operations**\n  * Performing CRUD operations securely.\n  * Database relationships and Aggregations.\n  * **Project 2:** Build a secure API with a database and React frontend.`
          },
          {
            level: 'Advanced',
            content: `**Focus: Security, Full-Stack Integration, Optimization, and Deployment.**\n\n* **Week 11 & 12: Security & Authentication**\n  * User Registration and Password Hashing (\`bcrypt\`).\n  * Stateless Authentication using JWT.\n* **Week 13: Full-Stack Symbiosis (MERN Stack)**\n  * Connecting React frontend to Express backend.\n  * Handling CORS and sessions.\n* **Week 14: Advanced Application Features**\n  * Handling file/image uploads securely.\n  * Implementing pagination, search, and filtering.\n* **Week 15 & 16: Cloud Deployment & CI/CD**\n  * Deploying Frontend to Vercel/Netlify.\n  * Deploying Backend to Render/Railway.\n  * **Final Capstone Project:** Build and deploy a complete Full-Stack SaaS application.`
          }
        ]
      },
      {
        title: 'Data Science Internship',
        description: 'Dive into data analysis, visualization, and statistical modeling.',
        duration: '3 months',
        price: 5500,
        stages: [
          {
            level: 'Beginner',
            content: 'Python for data science, NumPy, Pandas, Basic statistics, Data visualization with Matplotlib'
          },
          {
            level: 'Intermediate',
            content: 'Advanced Pandas, SQL, Data cleaning, Exploratory data analysis, Statistical modeling'
          },
          {
            level: 'Advanced',
            content: 'Machine Learning for data science, Big data tools, Real-world data projects'
          }
        ]
      }
    ];

    await Course.insertMany(courses);
    console.log('Courses seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();