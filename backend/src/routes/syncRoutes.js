import { Router } from "express";
import * as syncController from "../controllers/syncController.js";

const router = Router();

router.post("/offline", syncController.sync);

export default router;

