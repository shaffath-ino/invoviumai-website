import express from 'express';
import {
  getCourses,
  enrollCourse,
  processPayment,
  generateOfferLetter,
  getMyCourses,
  downloadOfferLetter,
  updateCurrentStage
} from '../controllers/courseController.js';

const router = express.Router();

router.get('/courses', getCourses);
router.post('/enroll', enrollCourse);
router.post('/payment', processPayment);
router.post('/generate-offer-letter', generateOfferLetter);
router.get('/my-courses', getMyCourses);
router.get('/download-offer-letter/:courseId', downloadOfferLetter);
router.put('/update-stage', updateCurrentStage);

export default router;