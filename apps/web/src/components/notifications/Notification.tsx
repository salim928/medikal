"use client";

import { useEffect } from "react";
import { Notification as NotificationType } from "@/stores/useNotificationStore";

interface NotificationProps extends NotificationType {
  onClose: () => void;
}

export function Notification({
  type,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-brand-50 border-brand-200",
  }[type];

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  }[type];

  const icon = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  }[type];

  return (
    <div className={`border rounded-lg p-4 ${bgColor} ${textColor} flex items-start gap-3 animate-in fade-in slide-in-from-right`}>
      <span className="font-bold text-lg">{icon}</span>
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="text-lg font-bold opacity-50 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}