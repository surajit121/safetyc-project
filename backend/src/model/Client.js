import mongoose from "mongoose";
const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    testimonial: { type: String },
    role: { type: String }
  },
  { timestamps: true }
);
export default mongoose.model("Client", ClientSchema);