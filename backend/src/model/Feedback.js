import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    // Links
    bookingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ServiceBooking",
      required: true,
      index: true
    },
    workOrderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "WorkOrder",
      index: true
    },
    
    // Customer info snapshot
    customer: {
      name: { type: String, required: true },
      email: { type: String }
    },
    
    // Ratings (1-5 stars)
    overallRating: { 
      type: Number, 
      required: true,
      min: 1, 
      max: 5 
    },
    serviceQuality: { 
      type: Number, 
      min: 1, 
      max: 5 
    },
    punctuality: { 
      type: Number, 
      min: 1, 
      max: 5 
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5
    },
    
    // Written feedback
    review: { type: String },
    
    // Quick metrics
    wouldRecommend: { type: Boolean },
    
    // Moderation
    isPublic: { type: Boolean, default: false },
    adminResponse: { type: String },
    
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Prevent duplicate feedback per booking
FeedbackSchema.index({ bookingId: 1 }, { unique: true });

export default mongoose.model("Feedback", FeedbackSchema);
