import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import config from '../../config.js';
import { sendPaymentEmail } from '../utils/sendEmail.js';

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: config.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    
    // Convert amount to paise
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Save initial payment record
    const payment = new Payment({
      userId: req.user._id,
      courseId,
      amount,
      orderId: order.id,
      status: 'Created'
    });
    await payment.save();

    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, enrollmentId } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Update Payment status
      const payment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          paymentId: razorpay_payment_id, 
          signature: razorpay_signature, 
          status: 'Captured' 
        },
        { new: true }
      ).populate('courseId');

      // Add to user's payment history and purchased courses
      if (payment) {
        const updateData = { $addToSet: { paymentHistory: payment._id } };
        if (courseId) {
          updateData.$addToSet.purchasedCourses = courseId;
        }
        await User.findByIdAndUpdate(req.user._id, updateData);
        
        // Also update enrollment status if enrollmentId is provided
        if (enrollmentId) {
          await Enrollment.findByIdAndUpdate(enrollmentId, { status: 'Paid', 'paymentDetails.amount': payment.amount, 'paymentDetails.transactionId': payment.paymentId, 'paymentDetails.paymentDate': new Date() });
        }
        
        // Send Email
        await sendPaymentEmail(req.user.email, {
          amount: payment.amount,
          paymentId: payment.paymentId,
          orderId: payment.orderId,
          studentName: req.user.name,
          courseName: payment.courseId ? payment.courseId.title : 'Web Development Internship',
          invoiceNumber: payment._id.toString().toUpperCase()
        });
      }

      return res.status(200).json({ message: "Payment verified successfully", payment });
    } else {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'Failed' }
      );
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};

// Get Payment History for Student
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('courseId', 'title description price')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment history", error: error.message });
  }
};

// Get Single Payment
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('courseId', 'title price')
      .populate('userId', 'name email')
      .lean();
      
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    
    // Ensure the user owns the payment or is an admin
    if (payment.userId._id.toString() !== req.user._id.toString() && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: "Not authorized to view this payment" });
    }
    
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment details", error: error.message });
  }
};

// Get All Payments (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all payments", error: error.message });
  }
};

// Refund Payment (Admin)
export const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined
    });

    await Payment.findOneAndUpdate(
      { paymentId },
      { status: 'Refunded' }
    );

    res.status(200).json({ message: "Refund processed successfully", refund });
  } catch (error) {
    console.error('Razorpay Refund Error:', error);
    res.status(500).json({ message: "Failed to process refund", error: error.message });
  }
};

// Upload Screenshot (Manual Payment)
export const uploadScreenshot = async (req, res) => {
  try {
    const { courseId, enrollmentId, screenshotBase64 } = req.body;
    
    // Parse base64 string
    const matches = screenshotBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: "Invalid base64 string" });
    }
    
    const extension = matches[1].split('/')[1];
    const base64Data = matches[2];
    const filename = `screenshot_${Date.now()}_${req.user._id}.${extension}`;
    
    const dir = 'public/screenshots';
    await fs.mkdir(dir, { recursive: true });
    
    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, base64Data, 'base64');
    
    const screenshotUrl = `/screenshots/${filename}`;
    
    // Create payment record
    const payment = new Payment({
      userId: req.user._id,
      courseId,
      amount: 0,
      orderId: `manual_${Date.now()}`,
      status: 'Pending_Verification',
      method: 'manual',
      screenshotUrl
    });
    
    // Get amount from course if courseId is present
    if (courseId) {
      const course = await Course.findById(courseId).lean();
      if (course) payment.amount = course.price;
    } else {
      payment.amount = req.body.amount || 5000; // Fallback for project payment
    }
    
    await payment.save();

    // Update enrollment status
    if (enrollmentId) {
        await Enrollment.findByIdAndUpdate(enrollmentId, { 
          status: 'Pending_Verification', 
          'paymentDetails.amount': payment.amount, 
          'paymentDetails.paymentDate': new Date() 
        });
    }
    
    // Add to user's payment history and purchased courses
    const updateData = { $addToSet: { paymentHistory: payment._id } };
    if (courseId) {
      updateData.$addToSet.purchasedCourses = courseId;
    }
    await User.findByIdAndUpdate(req.user._id, updateData);

    res.status(200).json({ message: "Screenshot uploaded successfully, pending verification.", payment });
  } catch (error) {
    console.error('Upload Screenshot Error:', error);
    res.status(500).json({ message: "Failed to upload screenshot", error: error.message });
  }
};

// Verify Manual Payment (Admin)
export const verifyManualPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId).populate('courseId').populate('userId');
    
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = 'Captured';
    payment.paymentId = `manual_verified_${Date.now()}`;
    await payment.save();

    // Find enrollment to update status if courseId exists
    if (payment.courseId) {
      const enrollment = await Enrollment.findOne({ userId: payment.userId, courseId: payment.courseId });
      
      if (enrollment) {
        await Enrollment.findByIdAndUpdate(enrollment._id, { 
          status: 'Paid', 
          'paymentDetails.amount': payment.amount,
          'paymentDetails.transactionId': payment.paymentId,
          'paymentDetails.paymentDate': new Date() 
        });
      }
    }

    // Send Email
    if (payment.userId && payment.userId.email) {
      await sendPaymentEmail(payment.userId.email, {
        amount: payment.amount,
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        studentName: payment.userId.name,
        courseName: payment.courseId ? payment.courseId.title : 'Web Development Internship',
        invoiceNumber: payment._id.toString().toUpperCase()
      });
    }

    res.status(200).json({ message: "Manual payment verified successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify manual payment", error: error.message });
  }
};

// Delete Payment (Admin)
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Remove from User history
    await User.findByIdAndUpdate(payment.userId, {
      $pull: { paymentHistory: payment._id }
    });

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete payment", error: error.message });
  }
};

// Razorpay Webhook
export const razorpayWebhook = async (req, res) => {
  try {
    const secret = config.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body.toString())
      .digest('hex');

    if (expectedSignature === signature) {
      const event = JSON.parse(req.body);

      // Handle events
      if (event.event === 'payment.captured') {
        const paymentData = event.payload.payment.entity;
        await Payment.findOneAndUpdate(
          { orderId: paymentData.order_id },
          { status: 'Captured', paymentId: paymentData.id, method: paymentData.method }
        );
      } else if (event.event === 'payment.failed') {
        const paymentData = event.payload.payment.entity;
        await Payment.findOneAndUpdate(
          { orderId: paymentData.order_id },
          { status: 'Failed' }
        );
      }
      
      res.status(200).send('Webhook handled');
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Webhook error');
  }
};
