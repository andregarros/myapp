import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { rateLimit } from "../middleware/rateLimitMiddleware.js";
import { requireFields, validateAuthPayload } from "../middleware/validateMiddleware.js";

const router = Router();

router.post("/login", rateLimit({ windowMs: 10 * 60 * 1000, maxRequests: 5 }), requireFields(["email", "password"]), validateAuthPayload, authController.login);
router.post("/register", rateLimit({ windowMs: 10 * 60 * 1000, maxRequests: 5 }), requireFields(["name", "companyName", "email", "password"]), validateAuthPayload, authController.register);

export default router;
