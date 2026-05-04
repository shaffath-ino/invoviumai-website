import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['enrolled', 'paid', 'activated'],
    default: 'enrolled'
  },
  paymentDetails: {
    amount: Number,
    transactionId: String,
    paymentDate: Date
  },
  offerLetterPath: {
    type: String
  },
  additionalDetails: {
    college: String,
    courseDuration: String,
    startDate: Date,
    endDate: Date
  },
  currentStage: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  }
}, {
  timestamps: true
});

export default mongoose.model('Enrollment', enrollmentSchema);