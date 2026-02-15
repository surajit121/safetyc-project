import mongoose from "mongoose";

// Auto-generate booking number: SB-YYYY-XXXX
const generateBookingNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `SB-${year}-`;
  
  const lastBooking = await mongoose.model("ServiceBooking")
    .findOne({ bookingNumber: { $regex: `^${prefix}` } })
    .sort({ bookingNumber: -1 });
  
  let nextNum = 1;
  if (lastBooking) {
    const lastNum = parseInt(lastBooking.bookingNumber.split("-")[2], 10);
    nextNum = lastNum + 1;
  }
  
  return `${prefix}${String(nextNum).padStart(4, "0")}`;
};

const ServiceBookingSchema = new mongoose.Schema(
  {
    bookingNumber: { 
      type: String, 
      unique: true,
      index: true 
    },
    
    // Customer Information
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String }
    },
    
    // Service Details
    service: {
      type: { type: String, required: true },      // e.g., "CCTV Surveillance"
      category: { type: String, required: true },  // e.g., "cctv-surveillance"
      requestType: { 
        type: String, 
        enum: ["new-installation", "service-repair"], 
        default: "new-installation" 
      },
      details: { type: mongoose.Schema.Types.Mixed } // Service-specific options
    },
    
    // Site Information
    site: {
      type: { type: String },        // Home, Office, Factory, Event
      location: { type: String },
      areaSize: { type: Number }     // sq ft
    },
    
    // Workflow Status
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "assigned", "in-progress", "completed", "cancelled"],
      default: "pending",
      index: true
    },
    
    priority: {
      type: String,
      enum: ["normal", "urgent"],
      default: "normal"
    },
    
    // Assignment
    assignedTechnician: { type: String },
    scheduledDate: { type: Date },
    
    // Pricing
    estimatedCost: { type: Number },
    finalCost: { type: Number },
    
    // Notes
    notes: { type: String },
    adminNotes: { type: String },
    
    // Email tracking
    confirmationEmailSent: { type: Boolean, default: false },
    statusUpdateEmailSent: { type: Date }
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate booking number
ServiceBookingSchema.pre("save", async function(next) {
  if (!this.bookingNumber) {
    this.bookingNumber = await generateBookingNumber();
  }
  next();
});

// Index for efficient queries
ServiceBookingSchema.index({ createdAt: -1 });
ServiceBookingSchema.index({ "customer.email": 1 });
ServiceBookingSchema.index({ "customer.phone": 1 });

export default mongoose.model("ServiceBooking", ServiceBookingSchema);
