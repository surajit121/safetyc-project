import express from "express";
import { 
  createWorkOrder, 
  getAllWorkOrders, 
  getWorkOrderById, 
  updateWorkOrder,
  completeWorkOrder,
  getWorkOrderByBooking
} from "../controllers/workOrders.js";

const router = express.Router();

// Get work order by booking ID
router.get("/by-booking/:bookingId", getWorkOrderByBooking);

// Complete work order
router.post("/:id/complete", completeWorkOrder);

// CRUD operations
router.post("/", createWorkOrder);
router.get("/", getAllWorkOrders);
router.get("/:id", getWorkOrderById);
router.patch("/:id", updateWorkOrder);

export default router;
