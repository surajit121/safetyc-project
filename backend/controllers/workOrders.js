import WorkOrder from "../src/model/WorkOrder.js";
import ServiceBooking from "../src/model/ServiceBooking.js";
import { sendFeedbackRequest } from "../services/emailService.js";

/**
 * Create a new work order from a booking
 * POST /api/work-orders
 */
export async function createWorkOrder(req, res) {
  try {
    const { bookingId, tasks, materials, laborHours, laborRate, technicianNotes } = req.body;

    if (!bookingId) {
      return res.status(400).json({ ok: false, error: "Booking ID is required" });
    }

    // Get the booking
    const booking = await ServiceBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ ok: false, error: "Booking not found" });
    }

    // Check if work order already exists for this booking
    const existing = await WorkOrder.findOne({ bookingId });
    if (existing) {
      return res.status(400).json({ 
        ok: false, 
        error: "Work order already exists for this booking",
        workOrderId: existing._id,
        docketNumber: existing.docketNumber
      });
    }

    const workOrder = await WorkOrder.create({
      bookingId,
      customer: {
        name: booking.customer.name,
        phone: booking.customer.phone,
        address: booking.customer.address || booking.site?.location
      },
      serviceType: booking.service.type,
      tasks: tasks || [],
      materials: materials || [],
      laborHours: laborHours || 0,
      laborRate: laborRate || 0,
      technicianNotes,
      status: "draft"
    });

    // Update booking status to assigned/in-progress
    if (booking.status === "pending" || booking.status === "confirmed") {
      booking.status = "assigned";
      await booking.save();
    }

    res.status(201).json({
      ok: true,
      docketNumber: workOrder.docketNumber,
      id: workOrder._id
    });
  } catch (err) {
    console.error("Error creating work order:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Get all work orders with filters
 * GET /api/work-orders?status=in-progress&page=1&limit=20
 */
export async function getAllWorkOrders(req, res) {
  try {
    const { status, page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { docketNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [workOrders, total] = await Promise.all([
      WorkOrder.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("bookingId", "bookingNumber service.type")
        .lean(),
      WorkOrder.countDocuments(filter)
    ]);

    res.json({
      ok: true,
      data: workOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Error fetching work orders:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Get single work order by ID or docket number
 * GET /api/work-orders/:id
 */
export async function getWorkOrderById(req, res) {
  try {
    const { id } = req.params;

    let workOrder = await WorkOrder.findOne({ docketNumber: id })
      .populate("bookingId")
      .lean();
    if (!workOrder) {
      workOrder = await WorkOrder.findById(id)
        .populate("bookingId")
        .lean();
    }

    if (!workOrder) {
      return res.status(404).json({ ok: false, error: "Work order not found" });
    }

    res.json({ ok: true, data: workOrder });
  } catch (err) {
    console.error("Error fetching work order:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Update work order
 * PATCH /api/work-orders/:id
 */
export async function updateWorkOrder(req, res) {
  try {
    const { id } = req.params;
    const { 
      tasks, materials, laborHours, laborRate, 
      technicianNotes, additionalCharges, discount, status 
    } = req.body;

    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      return res.status(404).json({ ok: false, error: "Work order not found" });
    }

    // Update fields if provided
    if (tasks !== undefined) workOrder.tasks = tasks;
    if (materials !== undefined) workOrder.materials = materials;
    if (laborHours !== undefined) workOrder.laborHours = laborHours;
    if (laborRate !== undefined) workOrder.laborRate = laborRate;
    if (technicianNotes !== undefined) workOrder.technicianNotes = technicianNotes;
    if (additionalCharges !== undefined) workOrder.additionalCharges = additionalCharges;
    if (discount !== undefined) workOrder.discount = discount;

    // Handle status changes
    if (status) {
      workOrder.status = status;
      if (status === "in-progress" && !workOrder.startedAt) {
        workOrder.startedAt = new Date();
      }
      if (status === "completed" && !workOrder.completedAt) {
        workOrder.completedAt = new Date();
      }
    }

    await workOrder.save();

    res.json({ ok: true, data: workOrder });
  } catch (err) {
    console.error("Error updating work order:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Complete work order and trigger feedback request
 * POST /api/work-orders/:id/complete
 */
export async function completeWorkOrder(req, res) {
  try {
    const { id } = req.params;
    const { finalNotes } = req.body;

    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      return res.status(404).json({ ok: false, error: "Work order not found" });
    }

    // Update work order
    workOrder.status = "completed";
    workOrder.completedAt = new Date();
    if (finalNotes) workOrder.technicianNotes = finalNotes;
    await workOrder.save();

    // Update linked booking
    const booking = await ServiceBooking.findById(workOrder.bookingId);
    if (booking) {
      booking.status = "completed";
      booking.finalCost = workOrder.totalCost;
      await booking.save();

      // Send feedback request email
      if (!workOrder.feedbackRequested) {
        sendFeedbackRequest(booking, workOrder).then(() => {
          WorkOrder.updateOne(
            { _id: workOrder._id },
            { feedbackRequested: true }
          ).exec();
        });
      }
    }

    res.json({ 
      ok: true, 
      message: "Work order completed",
      data: workOrder 
    });
  } catch (err) {
    console.error("Error completing work order:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Get work order by booking ID
 * GET /api/work-orders/by-booking/:bookingId
 */
export async function getWorkOrderByBooking(req, res) {
  try {
    const { bookingId } = req.params;

    const workOrder = await WorkOrder.findOne({ bookingId }).lean();
    if (!workOrder) {
      return res.status(404).json({ ok: false, error: "No work order found for this booking" });
    }

    res.json({ ok: true, data: workOrder });
  } catch (err) {
    console.error("Error fetching work order by booking:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}
