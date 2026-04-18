import { getSubscription, renewSubscription } from "../services/subscriptionService.js";

export function summary(req, res, next) {
  try {
    res.json(getSubscription(req.user.companyId));
  } catch (error) {
    next(error);
  }
}

export function renew(req, res, next) {
  try {
    res.json(renewSubscription(req.user.companyId, req.user));
  } catch (error) {
    next(error);
  }
}
