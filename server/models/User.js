import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  accountType: {
    type: String,
    enum: ['student', 'company'],
    default: 'student',
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
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
