import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from '../config.js';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payment.js';
import contactRoutes from './routes/contact.js';

const app = express();

// Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use('/offer-letters', express.static('public/offer-letters'));
app.use('/screenshots', express.static('public/screenshots'));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);

// Database connection
const PORT = config.PORT || 5000;
const MONGO_URI = config.MONGO_URI || 'mongodb://127.0.0.1:27017/inoviumai';

mongoose.connect(MONGO_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500
})
  .then(() => {
    console.log('Connected to MongoDB database (Optimized Pool)');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
