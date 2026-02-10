import express from "express";
import { 
  createBooking, 
  getAllBookings, 
  getBookingById, 
  updateBooking,
  getBookingStats,
  trackBooking
} from "../controllers/bookings.js";

const router = express.Router();

// Public: Track booking by number + phone
router.get("/track", trackBooking);

// Admin: Dashboard stats
router.get("/stats", getBookingStats);

// CRUD operations
router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.patch("/:id", updateBooking);

export default router;
