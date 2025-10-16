import Project from "../src/model/Project.js";

export async function listProjects(_req, res) {
  try {
    const items = await Project.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json([]);
  }
}

export async function createProject(req, res) {
  try {
    const payload = req.body || {};
    if (!payload.name) {
      return res.status(400).json({ error: "name is required" });
    }
    const created = await Project.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Server error" });
  }
}