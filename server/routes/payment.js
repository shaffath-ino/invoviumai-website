import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getAllPayments,
  refundPayment,
  razorpayWebhook,
  uploadScreenshot,
  verifyManualPayment,
  deletePayment,
  getPaymentById
} from '../controllers/paymentController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Student routes
router.post('/create-order', authenticateUser, createOrder);
router.post('/verify-payment', authenticateUser, verifyPayment);
router.get('/history', authenticateUser, getPaymentHistory);
router.post('/upload-screenshot', authenticateUser, uploadScreenshot);

// Admin routes
router.get('/all', authenticateUser, authorizeRoles('admin'), getAllPayments);
router.post('/refund', authenticateUser, authorizeRoles('admin'), refundPayment);
router.post('/verify-manual', authenticateUser, authorizeRoles('admin'), verifyManualPayment);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deletePayment);

// Webhook route (No auth, Razorpay validates signature)
router.post('/webhook', express.raw({ type: 'application/json' }), razorpayWebhook);

// Get single payment (Must be at the end to avoid matching other routes)
router.get('/:id', authenticateUser, getPaymentById);

export default router;
