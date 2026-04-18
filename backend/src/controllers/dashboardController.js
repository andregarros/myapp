import { getDashboard } from "../services/dashboardService.js";

export function summary(req, res, next) {
  try {
    res.json(getDashboard(req.user.companyId));
  } catch (error) {
    next(error);
  }
}

