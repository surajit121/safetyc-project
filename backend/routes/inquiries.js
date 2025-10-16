import { Router } from "express";
import { createInquiry } from "../controllers/inquiries.js";
const router = Router();

router.post("/", createInquiry);

export default router;
