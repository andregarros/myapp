import { store } from "../data/store.js";
import { ApiError } from "../utils/errors.js";

export function listNotifications(companyId) {
  return store.collection("notifications").filter((notification) => notification.companyId === companyId);
}

export function markNotificationAsRead(companyId, notificationId) {
  let updated;

  store.updateCollection("notifications", (items) =>
    items.map((notification) => {
      if (notification.id !== notificationId || notification.companyId !== companyId) {
        return notification;
      }

      updated = { ...notification, read: true };
      return updated;
    })
  );

  if (!updated) {
    throw new ApiError(404, "Notificacao nao encontrada.");
  }

  return updated;
}

