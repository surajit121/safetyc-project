import { Router } from "express";
import { createApplication } from "../controllers/applications.js";
const router = Router();

router.post("/", createApplication);

export default router;
