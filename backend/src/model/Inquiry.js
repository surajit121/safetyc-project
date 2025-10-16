import mongoose from "mongoose";
const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    source: { type: String, default: "website" }
  },
  { timestamps: true }
);
export default mongoose.model("Inquiry", InquirySchema);