import mongoose from "mongoose";

// Auto-generate docket number: WO-YYYY-XXXX
const generateDocketNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `WO-${year}-`;
  
  const lastOrder = await mongoose.model("WorkOrder")
    .findOne({ docketNumber: { $regex: `^${prefix}` } })
    .sort({ docketNumber: -1 });
  
  let nextNum = 1;
  if (lastOrder) {
    const lastNum = parseInt(lastOrder.docketNumber.split("-")[2], 10);
    nextNum = lastNum + 1;
  }
  
  return `${prefix}${String(nextNum).padStart(4, "0")}`;
};

const WorkOrderSchema = new mongoose.Schema(
  {
    docketNumber: { 
      type: String, 
      unique: true,
      index: true 
    },
    
    // Link to booking
    bookingId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "ServiceBooking",
      required: true,
      index: true
    },
    
    // Customer snapshot (for quick access and printing)
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String }
    },
    
    serviceType: { type: String, required: true },
    
    // Task checklist
    tasks: [{
      description: { type: String, required: true },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date }
    }],
    
    // Materials used
    materials: [{
      item: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      unitCost: { type: Number, default: 0 }
    }],
    
    // Labor tracking
    laborHours: { type: Number, default: 0 },
    laborRate: { type: Number, default: 0 },
    
    // Cost calculation
    materialsCost: { type: Number, default: 0 },
    laborCost: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    
    // Notes
    technicianNotes: { type: String },
    customerSignature: { type: String }, // Base64 or file path
    
    // Status
    status: {
      type: String,
      enum: ["draft", "in-progress", "completed", "invoiced"],
      default: "draft",
      index: true
    },
    
    // Completion tracking
    startedAt: { type: Date },
    completedAt: { type: Date },
    
    // Feedback link
    feedbackRequested: { type: Boolean, default: false },
    feedbackReceived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate docket number and calculate costs
WorkOrderSchema.pre("save", async function(next) {
  // Generate docket number
  if (!this.docketNumber) {
    this.docketNumber = await generateDocketNumber();
  }
  
  // Calculate costs
  this.materialsCost = this.materials.reduce(
    (sum, m) => sum + (m.quantity * m.unitCost), 0
  );
  this.laborCost = this.laborHours * this.laborRate;
  this.totalCost = this.materialsCost + this.laborCost + 
                   this.additionalCharges - this.discount;
  
  next();
});

// Index for efficient queries
WorkOrderSchema.index({ createdAt: -1 });
WorkOrderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("WorkOrder", WorkOrderSchema);
