import { Router } from "express";
import * as notificationController from "../controllers/notificationController.js";

const router = Router();

router.get("/", notificationController.list);
router.patch("/:id/read", notificationController.markAsRead);

export default router;

