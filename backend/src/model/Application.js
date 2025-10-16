import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: Number },
    jobTitle: { type: String },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 254,
      match: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
    },
    message: { type: String, trim: true, maxlength: 2000 },
    dob: { type: String, required: true, trim: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    pincode: { type: String, required: true, trim: true, minlength: 4, maxlength: 10 },
  whatsapp: { type: String, trim: true, maxlength: 30 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
    address: { type: String, trim: true, maxlength: 300 },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
