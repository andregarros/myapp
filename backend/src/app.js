import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import syncRoutes from "./routes/syncRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { requireActiveSubscription } from "./middleware/subscriptionMiddleware.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../../dist");

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origem nao permitida pelo CORS."));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "smart-market-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/subscription", requireAuth, subscriptionRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/products", requireAuth, requireActiveSubscription, productRoutes);
app.use("/api/cart", requireAuth, requireActiveSubscription, cartRoutes);
app.use("/api/history", requireAuth, requireActiveSubscription, historyRoutes);
app.use("/api/notifications", requireAuth, requireActiveSubscription, notificationRoutes);
app.use("/api/sync", requireAuth, requireActiveSubscription, syncRoutes);

app.use(express.static(distDir));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path === "/health") {
    next();
    return;
  }

  res.sendFile(path.join(distDir, "index.html"));
});

app.use(errorHandler);

export default app;
