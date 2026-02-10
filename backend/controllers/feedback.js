import Feedback from "../src/model/Feedback.js";
import ServiceBooking from "../src/model/ServiceBooking.js";
import WorkOrder from "../src/model/WorkOrder.js";

/**
 * Submit feedback for a completed booking
 * POST /api/feedback
 */
export async function submitFeedback(req, res) {
  try {
    const { 
      bookingId, 
      overallRating, 
      serviceQuality, 
      punctuality, 
      professionalism,
      valueForMoney,
      review, 
      wouldRecommend 
    } = req.body;

    if (!bookingId || !overallRating) {
      return res.status(400).json({ 
        ok: false, 
        error: "Booking ID and overall rating are required" 
      });
    }

    // Verify booking exists and is completed
    const booking = await ServiceBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ ok: false, error: "Booking not found" });
    }
    
    if (booking.status !== "completed") {
      return res.status(400).json({ 
        ok: false, 
        error: "Feedback can only be submitted for completed services" 
      });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ bookingId });
    if (existingFeedback) {
      return res.status(400).json({ 
        ok: false, 
        error: "Feedback has already been submitted for this booking" 
      });
    }

    // Get work order if exists
    const workOrder = await WorkOrder.findOne({ bookingId });

    const feedback = await Feedback.create({
      bookingId,
      workOrderId: workOrder?._id,
      customer: {
        name: booking.customer.name,
        email: booking.customer.email
      },
      overallRating,
      serviceQuality,
      punctuality,
      professionalism,
      valueForMoney,
      review,
      wouldRecommend,
      submittedAt: new Date()
    });

    // Update work order feedback status
    if (workOrder) {
      workOrder.feedbackReceived = true;
      await workOrder.save();
    }

    res.status(201).json({ 
      ok: true, 
      message: "Thank you for your feedback!",
      id: feedback._id 
    });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        ok: false, 
        error: "Feedback has already been submitted for this booking" 
      });
    }
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Get feedback for a specific booking
 * GET /api/feedback/booking/:bookingId
 */
export async function getFeedbackByBooking(req, res) {
  try {
    const { bookingId } = req.params;

    const feedback = await Feedback.findOne({ bookingId }).lean();
    if (!feedback) {
      return res.status(404).json({ ok: false, error: "No feedback found" });
    }

    res.json({ ok: true, data: feedback });
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Get all feedback (admin)
 * GET /api/feedback?page=1&limit=20&minRating=4
 */
export async function getAllFeedback(req, res) {
  try {
    const { page = 1, limit = 20, minRating } = req.query;

    const filter = {};
    if (minRating) {
      filter.overallRating = { $gte: parseInt(minRating) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [feedbacks, total, avgRating] = await Promise.all([
      Feedback.find(filter)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("bookingId", "bookingNumber service.type")
        .lean(),
      Feedback.countDocuments(filter),
      Feedback.aggregate([
        { $group: { 
          _id: null, 
          avgOverall: { $avg: "$overallRating" },
          avgQuality: { $avg: "$serviceQuality" },
          avgPunctuality: { $avg: "$punctuality" },
          total: { $sum: 1 }
        }}
      ])
    ]);

    res.json({
      ok: true,
      data: feedbacks,
      stats: avgRating[0] || { avgOverall: 0, avgQuality: 0, avgPunctuality: 0, total: 0 },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Update feedback (admin response)
 * PATCH /api/feedback/:id
 */
export async function updateFeedback(req, res) {
  try {
    const { id } = req.params;
    const { adminResponse, isPublic } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ ok: false, error: "Feedback not found" });
    }

    if (adminResponse !== undefined) feedback.adminResponse = adminResponse;
    if (isPublic !== undefined) feedback.isPublic = isPublic;

    await feedback.save();

    res.json({ ok: true, data: feedback });
  } catch (err) {
    console.error("Error updating feedback:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}

/**
 * Get public testimonials
 * GET /api/feedback/testimonials
 */
export async function getPublicTestimonials(req, res) {
  try {
    const { limit = 10 } = req.query;

    const testimonials = await Feedback.find({ 
      isPublic: true,
      overallRating: { $gte: 4 }
    })
      .sort({ overallRating: -1, submittedAt: -1 })
      .limit(parseInt(limit))
      .select("customer.name overallRating review submittedAt")
      .lean();

    res.json({ ok: true, data: testimonials });
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}
