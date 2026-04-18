import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET || "smart-market-secret";
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
const configuredOrigins = (process.env.ALLOWED_ORIGINS || process.env.WEB_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...configuredOrigins, ...(vercelUrl ? [vercelUrl] : [])])];

if (nodeEnv === "production" && (!process.env.JWT_SECRET || jwtSecret === "smart-market-secret")) {
  throw new Error("JWT_SECRET seguro e obrigatorio em producao.");
}

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv,
  jwtSecret,
  isVercel: Boolean(process.env.VERCEL),
  dataStoreMode: process.env.DATA_STORE_MODE || (process.env.VERCEL ? "memory" : "file"),
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:4000/api",
  webUrl: process.env.WEB_URL || "http://localhost:5173",
  allowedOrigins,
};
