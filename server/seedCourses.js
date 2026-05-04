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
            content: 'HTML, CSS, JavaScript fundamentals, Git version control, Basic React concepts'
          },
          {
            level: 'Intermediate',
            content: 'Advanced React, Node.js, Express.js, MongoDB, RESTful APIs'
          },
          {
            level: 'Advanced',
            content: 'Full-stack application development, Authentication, Deployment, Performance optimization'
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