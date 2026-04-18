import { Router } from "express";
import * as cartController from "../controllers/cartController.js";

const router = Router();

router.post("/checkout", cartController.checkout);

export default router;

