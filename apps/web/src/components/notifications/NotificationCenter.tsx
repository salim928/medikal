"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { Notification } from "@/components/notifications/Notification";

export function NotificationCenter() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}