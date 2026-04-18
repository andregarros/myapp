import { ApiError } from "../utils/errors.js";

const buckets = new Map();

function keyFromRequest(req) {
  const email = typeof req.body?.email === "string" ? req.body.email.toLowerCase() : "anonymous";
  return `${req.ip}:${email}`;
}

export function rateLimit({ windowMs, maxRequests }) {
  return (req, _res, next) => {
    const now = Date.now();
    const key = keyFromRequest(req);
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= maxRequests) {
      return next(new ApiError(429, "Muitas tentativas. Aguarde alguns minutos e tente novamente."));
    }

    bucket.count += 1;
    return next();
  };
}
