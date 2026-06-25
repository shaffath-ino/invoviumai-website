import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  accountType: {
    type: String,
    enum: ['student', 'company', 'admin'],
    default: 'student',
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  purchasedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  paymentHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
