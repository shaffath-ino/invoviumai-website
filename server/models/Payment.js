import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false // Optional if it's a general payment
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentId: {
    type: String,
    required: false // Received after successful payment
  },
  orderId: {
    type: String,
    required: true // Razorpay order ID
  },
  signature: {
    type: String,
    required: false // Razorpay signature
  },
  status: {
    type: String,
    enum: ['Created', 'Captured', 'Failed', 'Refunded', 'Pending_Verification'],
    default: 'Created'
  },
  method: {
    type: String,
    required: false
  },
  receiptUrl: {
    type: String,
    required: false
  },
  screenshotUrl: {
    type: String,
    required: false
  }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
