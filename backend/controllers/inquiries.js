import Inquiry from "../src/model/Inquiry.js";

export async function createInquiry(req, res) {
  try {
    const { name, email, phone, message, source } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "name, email and message are required" });
    }
    const created = await Inquiry.create({ name, email, phone, message, source });
    res.status(201).json({ ok: true, id: created._id });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
}