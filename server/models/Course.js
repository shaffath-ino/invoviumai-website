import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stages: [{
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],
  overview: {
    type: String
  },
  targetAudience: {
    type: String
  },
  prerequisites: {
    type: String
  },
  learningOutcomes: [{
    type: String
  }],
  projectsInfo: {
    miniProjects: [{
      type: String
    }],
    capstoneProject: {
      type: String
    }
  },
  assessmentStructure: {
    type: String
  },
  careerPreparation: {
    type: String
  },
  certificationCriteria: {
    type: String
  },
  readinessScore: {
    type: Number,
    min: 0,
    max: 100
  },
  recommendations: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);