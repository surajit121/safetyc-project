import { Router } from "express";
import { getService, listServices, upsertService } from "../controllers/services.js";

const router = Router();

router.get("/", listServices);
router.get("/:slug", getService);
router.post("/", upsertService);

export default router;

