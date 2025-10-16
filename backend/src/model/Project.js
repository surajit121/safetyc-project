import mongoose from "mongoose";
const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sector: { type: String },
    summary: { type: String },
    servicesUsed: [{ type: String }],
    clientName: { type: String },
    year: { type: Number }
  },
  { timestamps: true }
);
export default mongoose.model("Project", ProjectSchema);