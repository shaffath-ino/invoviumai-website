import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';

dotenv.config({ path: '../.env' });

const jobs = [
  { 
    title: "AI & ML Engineer (Freshers)", 
    dept: "Engineering", 
    type: "Full Time", 
    location: "Chennai (Mandaveli) On-site", 
    link: "/careers/1", // We will route to actual ID later
    experience: "0 - 1 years",
    salary: "6 - 10 Lacs P.A.",
    openings: 12,
    description: "Role: AI & ML Engineer (Freshers)\nCompensation: 6 - 10 LPA + ESOPs Eligibility\nOpen Roles: 12\nEligible Batches: 2026 / 2025\n\nA research-driven engineering environment focused on building AI systems and advancing foundational machine learning capabilities. Opportunity to contribute to the development of foundation models and the infrastructure required for large-scale training and inference.",
    responsibilities: [
      "Design and develop compiler frameworks that optimize AI model execution at the kernel, graph, and operator levels.",
      "Architect scalable transformer-based infrastructures for distributed multi-node training and efficient inference.",
      "Build end-to-end AI pipelines including graph optimizations, memory scheduling, and compute distribution.",
      "Collaborate with research teams to translate mathematical models into optimized execution graphs and intermediate representations (IRs).",
      "Implement custom kernels, quantization strategies, and low-level performance optimizations in C/C++ and CUDA.",
      "Analyze and tune runtime performance bottlenecks focusing on parallelization, vectorization, and memory management.",
      "Develop domain-specific compiler passes for tensor operations, automatic differentiation, and operator fusion.",
      "Conduct systematic experiments to explore scaling laws, precision formats, and architectural optimizations for improved computational efficiency.",
      "Contribute to the development and optimization of deep learning frameworks and execution runtimes, focusing on tensor computation graphs, distributed training pipelines, and execution scheduling.",
      "Work on data and training infrastructure including dataset preparation pipelines, tokenization strategies, preprocessing workflows, and evaluation systems for large-scale model training.",
      "Participate in model efficiency research including quantization techniques, sparsity methods, precision formats, and inference optimization for large-scale neural networks."
    ],
    requirements: [
      "Strong proficiency in C, C++ or Java, with good command over pointers, memory management, performance optimization, and systems-level programming.",
      "Solid foundation in Mathematics - calculus, probability, statistics, and linear algebra.",
      "Strong logical reasoning, problem-solving ability, high intelligence (IQ), and an analytical mindset.",
      "Ability to operate effectively in a research-driven, high-intensity environment with cross-functional collaboration.",
      "Experience or strong interest in compiler construction, runtime systems, and code generation.",
      "Proficiency or willingness to learn CUDA and Rust for high-performance and systems-level development.",
      "Understanding of computer architecture, operating systems, parallel computing, and memory hierarchy.",
      "Familiarity with deep learning frameworks, transformer architectures, or distributed training systems."
    ],
    benefits: [
      "Competitive salary package",
      "Employee Stock Ownership Plan (ESOP) eligibility upon confirmation",
      "Health insurance coverage",
      "Personal accident and life insurance coverage",
      "Generous parental leave policy",
      "Accommodation / transportation allowance",
      "Complimentary lunch and dinner"
    ]
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/invoviumai')
  .then(async () => {
    console.log('Connected to DB');
    await Job.deleteMany();
    
    // Create new jobs and update their links with their actual ObjectIds
    for (let jobData of jobs) {
      const job = new Job(jobData);
      job.link = `/careers/${job._id}`;
      await job.save();
    }
    
    console.log('Detailed Job seeded successfully');
    process.exit();
  })
  .catch(err => {
    console.error('Error connecting to DB', err);
    process.exit(1);
  });
