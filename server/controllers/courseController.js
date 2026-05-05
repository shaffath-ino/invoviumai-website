import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Enroll in a course
const enrollCourse = async (req, res) => {
  try {
    console.log('Enroll Course Request Body:', req.body);
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET || 'fallback_secret');
    console.log('Decoded JWT:', decoded);
    const { courseId } = req.body;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId: decoded.userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      userId: decoded.userId,
      courseId
    });

    await enrollment.save();
    res.json({ message: 'Enrolled successfully', enrollmentId: enrollment._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Simulate payment
const processPayment = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET || 'fallback_secret');
    const { enrollmentId } = req.body;

    const enrollment = await Enrollment.findOne({ _id: enrollmentId, userId: decoded.userId });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const course = await Course.findById(enrollment.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Simulate payment success and mark as paid (waiting for offer letter)
    enrollment.status = 'paid';
    enrollment.currentStage = 'Beginner';
    enrollment.paymentDetails = {
      amount: course.price,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentDate: new Date()
    };

    await enrollment.save();
    res.json({ message: 'Payment successful, please generate your offer letter', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate offer letter
const generateOfferLetter = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET || 'fallback_secret');
    const { enrollmentId, college, startDate } = req.body;

    const enrollment = await Enrollment.findOne({ _id: enrollmentId, userId: decoded.userId }).populate('courseId').populate('userId');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    // Automate duration and end date
    const durationString = enrollment.courseId.duration || '3 months';
    const monthsMatch = durationString.match(/(\d+)/);
    const monthsCount = monthsMatch ? parseInt(monthsMatch[1], 10) : 3;
    
    const startObj = new Date(startDate);
    const endObj = new Date(startObj);
    endObj.setMonth(startObj.getMonth() + monthsCount);

    const automatedCourseDuration = durationString;
    const automatedEndDate = endObj.toISOString();

    // Update enrollment with additional details
    enrollment.additionalDetails = { 
      college, 
      courseDuration: automatedCourseDuration, 
      startDate, 
      endDate: automatedEndDate 
    };
    enrollment.status = 'activated';

    // Generate PDF
    const doc = new PDFDocument();
    const fileName = `offer_letter_${enrollment._id}.pdf`;
    const filePath = path.join(__dirname, '../public/offer-letters', fileName);

    // Ensure directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // PDF content
    doc.fontSize(20).text('Internship Offer Letter', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Dear ${enrollment.userId.name},`);
    doc.moveDown();
    doc.text(`Congratulations! You have been selected for the internship program in ${enrollment.courseId.title}.`);
    doc.moveDown();
    doc.text(`Course Details:`);
    doc.text(`- Title: ${enrollment.courseId.title}`);
    doc.text(`- Description: ${enrollment.courseId.description}`);
    doc.text(`- Duration: ${enrollment.courseId.duration}`);
    doc.text(`- College: ${college}`);
    doc.text(`- Internship Duration: ${automatedCourseDuration}`);
    doc.text(`- Start Date: ${new Date(startDate).toDateString()}`);
    doc.text(`- End Date: ${new Date(automatedEndDate).toDateString()}`);
    doc.moveDown();
    doc.text('Best regards,');
    doc.text('InoviumAI Team');

    doc.end();

    stream.on('finish', async () => {
      enrollment.offerLetterPath = `/offer-letters/${fileName}`;
      await enrollment.save();
      res.json({ message: 'Offer letter generated', filePath: enrollment.offerLetterPath });
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's enrolled courses
const getMyCourses = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET || 'fallback_secret');

    const enrollments = await Enrollment.find({ userId: decoded.userId })
      .populate('courseId')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download offer letter
const downloadOfferLetter = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET || 'fallback_secret');
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({ userId: decoded.userId, courseId, status: 'activated' });
    if (!enrollment || !enrollment.offerLetterPath) {
      return res.status(404).json({ message: 'Offer letter not found' });
    }

    const filePath = path.join(__dirname, '../public', enrollment.offerLetterPath);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update current stage
const updateCurrentStage = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET || 'fallback_secret');
    const { enrollmentId, currentStage } = req.body;

    const enrollment = await Enrollment.findOneAndUpdate(
      { _id: enrollmentId, userId: decoded.userId },
      { currentStage },
      { new: true }
    );

    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    res.json({ message: 'Stage updated', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  getCourses,
  getCourseById,
  enrollCourse,
  processPayment,
  generateOfferLetter,
  getMyCourses,
  downloadOfferLetter,
  updateCurrentStage
};