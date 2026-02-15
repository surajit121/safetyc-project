import ServiceBooking from "../src/model/ServiceBooking.js";
import { sendBookingConfirmation, sendStatusUpdate } from "../services/emailService.js";

/**
 * Create a new service booking
 * POST /api/bookings
 */
export async function createBooking(req, res) {
  try {
    const { customer, service, site, notes, priority } = req.body || {};
    
    // Validation
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ 
        ok: false, 
        error: "Customer name, email, and phone are required" 
      });
    }
    if (!service?.type || !service?.category) {
      return res.status(400).json({ 
        ok: false, 
        error: "Service type and category are required" 
      });
    }

    const booking = await ServiceBooking.create({
      customer,
      service,
      site,
      notes,
      priority: priority || "normal",
      status: "pending"
    });

    // Send confirmation email (non-blocking)
    sendBookingConfirmation(booking).then(sent => {
      if (sent) {
        ServiceBooking.updateOne(
          { _id: booking._id }, 
          { confirmationEmailSent: true }
        ).exec();
      }
    });

    res.status(201).json({ 
      ok: true, 
      bookingNumber: booking.bookingNumber,
      id: booking._id 
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Get all bookings with optional filters
 * GET /api/bookings?status=pending&page=1&limit=20
 */
export async function getAllBookings(req, res) {
  try {
    const { status, priority, page = 1, limit = 20, search } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { bookingNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [bookings, total] = await Promise.all([
      ServiceBooking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ServiceBooking.countDocuments(filter)
    ]);

    res.json({ 
      ok: true, 
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Get single booking by ID or booking number
 * GET /api/bookings/:id
 */
export async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    
    // Try finding by bookingNumber first, then by _id
    let booking = await ServiceBooking.findOne({ bookingNumber: id }).lean();
    if (!booking) {
      booking = await ServiceBooking.findById(id).lean();
    }
    
    if (!booking) {
      return res.status(404).json({ ok: false, error: "Booking not found" });
    }

    res.json({ ok: true, data: booking });
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Update booking status and details
 * PATCH /api/bookings/:id
 */
export async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const { status, assignedTechnician, scheduledDate, estimatedCost, adminNotes, priority } = req.body;

    const booking = await ServiceBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ ok: false, error: "Booking not found" });
    }

    const previousStatus = booking.status;

    // Update fields
    if (status) booking.status = status;
    if (assignedTechnician !== undefined) booking.assignedTechnician = assignedTechnician;
    if (scheduledDate !== undefined) booking.scheduledDate = scheduledDate;
    if (estimatedCost !== undefined) booking.estimatedCost = estimatedCost;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;
    if (priority !== undefined) booking.priority = priority;

    await booking.save();

    // Send status update email if status changed
    if (status && status !== previousStatus) {
      sendStatusUpdate(booking, status);
      booking.statusUpdateEmailSent = new Date();
      await booking.save();
    }

    res.json({ ok: true, data: booking });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Get dashboard statistics
 * GET /api/bookings/stats
 */
export async function getBookingStats(req, res) {
  try {
    const now = new Date();
    
    // Today start
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Current month start
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Last month range
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      statusCounts, 
      todayBookings, 
      recentBookings,
      thisMonthCounts,
      lastMonthCounts,
      thisMonthTotal,
      lastMonthTotal
    ] = await Promise.all([
      // Overall status counts
      ServiceBooking.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      // Today's count
      ServiceBooking.countDocuments({ createdAt: { $gte: today } }),
      // Recent 5 bookings
      ServiceBooking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("bookingNumber customer.name service.type status createdAt")
        .lean(),
      // This month status counts
      ServiceBooking.aggregate([
        { $match: { createdAt: { $gte: thisMonthStart } } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      // Last month status counts
      ServiceBooking.aggregate([
        { $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      // This month total
      ServiceBooking.countDocuments({ createdAt: { $gte: thisMonthStart } }),
      // Last month total
      ServiceBooking.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } })
    ]);

    const stats = {
      pending: 0,
      confirmed: 0,
      assigned: 0,
      "in-progress": 0,
      completed: 0,
      cancelled: 0,
      todayBookings,
      recentBookings
    };

    statusCounts.forEach(s => {
      stats[s._id] = s.count;
    });

    // Build monthly counts maps
    const thisMonthMap = {};
    thisMonthCounts.forEach(s => { thisMonthMap[s._id] = s.count; });
    
    const lastMonthMap = {};
    lastMonthCounts.forEach(s => { lastMonthMap[s._id] = s.count; });

    // Calculate percentage change: ((current - previous) / previous) * 100
    const calcGrowth = (current, previous) => {
      if (previous === 0 && current === 0) return 0;
      if (previous === 0) return 100; // went from 0 to something
      return Math.round(((current - previous) / previous) * 100);
    };

    stats.monthlyGrowth = {
      pending: calcGrowth(thisMonthMap.pending || 0, lastMonthMap.pending || 0),
      "in-progress": calcGrowth(thisMonthMap["in-progress"] || 0, lastMonthMap["in-progress"] || 0),
      completed: calcGrowth(thisMonthMap.completed || 0, lastMonthMap.completed || 0),
      total: calcGrowth(thisMonthTotal, lastMonthTotal)
    };

    res.json({ ok: true, data: stats });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Track booking by number and phone (public endpoint)
 * GET /api/bookings/track?bookingNumber=SB-2026-0001&phone=1234567890
 */
export async function trackBooking(req, res) {
  try {
    const { bookingNumber, phone } = req.query;
    
    if (!bookingNumber || !phone) {
      return res.status(400).json({ 
        ok: false, 
        error: "Booking number and phone are required" 
      });
    }

    const booking = await ServiceBooking.findOne({ 
      bookingNumber,
      "customer.phone": phone 
    }).select("-adminNotes").lean();

    if (!booking) {
      return res.status(404).json({ 
        ok: false, 
        error: "Booking not found. Please check your booking number and phone." 
      });
    }

    res.json({ ok: true, data: booking });
  } catch (err) {
    console.error("Error tracking booking:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}
