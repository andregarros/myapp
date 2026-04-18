import { Router } from "express";
import * as subscriptionController from "../controllers/subscriptionController.js";

const router = Router();

router.get("/", subscriptionController.summary);
router.post("/renew", subscriptionController.renew);

export default router;
