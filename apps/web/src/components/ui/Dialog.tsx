"use client";

import React from "react";
import { Modal } from "./Modal";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "destructive";
  }[];
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
}: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}

      {actions && (
        <div className="flex gap-2 justify-end mt-6">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                action.variant === "destructive"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : action.variant === "secondary"
                  ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}