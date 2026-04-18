import { listNotifications, markNotificationAsRead } from "../services/notificationService.js";

export function list(req, res, next) {
  try {
    res.json(listNotifications(req.user.companyId));
  } catch (error) {
    next(error);
  }
}

export function markAsRead(req, res, next) {
  try {
    res.json(markNotificationAsRead(req.user.companyId, req.params.id));
  } catch (error) {
    next(error);
  }
}

