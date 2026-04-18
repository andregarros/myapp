import { ensureActiveSubscription } from "../services/subscriptionService.js";

export function requireActiveSubscription(req, _res, next) {
  try {
    ensureActiveSubscription(req.user.companyId);
    next();
  } catch (error) {
    next(error);
  }
}
