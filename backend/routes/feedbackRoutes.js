import express from "express";
import { 
  submitFeedback, 
  getFeedbackByBooking, 
  getAllFeedback, 
  updateFeedback,
  getPublicTestimonials
} from "../controllers/feedback.js";

const router = express.Router();

// Public: Get testimonials
router.get("/testimonials", getPublicTestimonials);

// Public: Submit feedback
router.post("/", submitFeedback);

// Admin: Get all feedback
router.get("/", getAllFeedback);

// Get feedback by booking
router.get("/booking/:bookingId", getFeedbackByBooking);

// Admin: Update feedback (respond, make public)
router.patch("/:id", updateFeedback);

export default router;
