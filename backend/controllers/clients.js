import Client from "../src/model/Client.js";

export async function listClients(_req, res) {
  try {
    const items = await Client.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json([]);
  }
}

export async function createClient(req, res) {
  try {
    const payload = req.body || {};
    if (!payload.name) {
      return res.status(400).json({ error: "name is required" });
    }
    const created = await Client.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).json({ error: "Server error" });
  }
}

