import Service from "../src/model/Service.js";


export async function listServices(_req, res) {
  try {
    const items = await Service.find().sort({ createdAt: -1 });
    // Always return a plain array
    return res.json(Array.isArray(items) ? items : []);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json([]);
  }
}

export async function getService(req, res) {
  try {
    const item = await Service.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  } catch (err) {
    console.error("Error fetching service:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function upsertService(req, res) {
  try {
    const { slug, ...rest } = req.body;
    const updated = await Service.findOneAndUpdate(
      { slug }, { slug, ...rest }, { new: true, upsert: true }
    );
    return res.json(updated);
  } catch (err) {
    console.error("Error saving service:", err);
    res.status(500).json({ error: "Server error" });
  }
}