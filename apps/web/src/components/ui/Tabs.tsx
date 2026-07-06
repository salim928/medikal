"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function Tabs({ tabs, defaultValue, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <div>
      {/* Tab List */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap",
              activeTab === tab.value
                ? "text-brand-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  );
}