import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { sendEmail } from '../utils/sendEmail.js';

// Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Validate account existence preemptively
    const existingUser = await User.findOne({ email });
    if (type === 'signup' && existingUser) {
      return res.status(400).json({ 
        error: `This email is already registered as a ${existingUser.accountType}. One email cannot be used for both.` 
      });
    }
    if (type === 'forgot' && !existingUser) {
      return res.status(400).json({ 
        error: 'This email is not registered in our system. Please sign up instead.' 
      });
    }

    // Check if OTP was sent recently (Rate limiting resend to 30s)
    const existingOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (existingOtp) {
      const timeDiff = new Date() - new Date(existingOtp.createdAt);
      if (timeDiff < 30 * 1000) {
        return res.status(429).json({ error: 'Please wait 30 seconds before resending OTP' });
      }
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save strictly as one OTP document per active process or overwrite previous unverified?
    // Delete older unverified OTPs for this email to keep db clean
    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp: otpCode,
      expiresAt,
    });

    const emailSent = await sendEmail(
      email,
      'Your Verification OTP',
      otpCode
    );

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send OTP email' });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > otpDoc.expiresAt) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    if (otpDoc.verified) {
      return res.status(400).json({ error: 'OTP has already been used' });
    }

    // Mark as verified
    otpDoc.verified = true;
    await otpDoc.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Signup
export const signup = async (req, res) => {
  try {
    const { accountType, name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: `This email is already registered as a ${existingUser.accountType}. One email cannot be used for both.` });
    }

    // Check if OTP was verified
    const otpDoc = await OTP.findOne({ email, verified: true }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res.status(400).json({ error: 'Please verify OTP before signing up' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      accountType: accountType || 'student',
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    // Delete OTP document as it is already used for signup
    await OTP.deleteMany({ email });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User completely not found' });
    }

    // Check if OTP was verified
    const otpDoc = await OTP.findOne({ email, verified: true }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res.status(400).json({ error: 'Please verify your email with OTP first' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    user.password = hashedPassword;
    await user.save();

    // Delete OTP document as it is successfully used
    await OTP.deleteMany({ email });

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
