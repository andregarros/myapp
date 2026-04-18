import { Router } from "express";
import * as historyController from "../controllers/historyController.js";

const router = Router();

router.get("/", historyController.list);

export default router;

