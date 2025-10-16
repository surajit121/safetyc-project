import { Router } from "express";
import { listProjects, createProject } from "../controllers/projects.js";
const router = Router();

router.get("/", listProjects);
router.post("/", createProject);

export default router;