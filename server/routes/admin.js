import express from 'express';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import Job from '../models/Job.js';
import jwt from 'jsonwebtoken';
import config from '../../config.js';

const router = express.Router();

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId);
    
    if (!user || user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Routes for Students
router.get('/students', verifyAdmin, async (req, res) => {
  try {
    const students = await User.find({ accountType: 'student' }).select('-password');
    // Fetch enrollments for each student
    const enrollments = await Enrollment.find().populate('courseId');
    
    const studentsWithEnrollments = students.map(student => {
      const studentEnrollments = enrollments.filter(e => e.userId.toString() === student._id.toString());
      return {
        ...student.toObject(),
        enrollments: studentEnrollments
      };
    });

    res.json(studentsWithEnrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Job CRUD operations
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/jobs', verifyAdmin, async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/jobs/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/jobs/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
