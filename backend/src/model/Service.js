import mongoose from "mongoose";
const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String },
    highlights: [{ type: String }]
  },
  { timestamps: true }
);
export default mongoose.model("Service", ServiceSchema);