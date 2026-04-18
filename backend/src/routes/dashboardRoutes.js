import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireRole("admin", "employee"), dashboardController.summary);

export default router;

