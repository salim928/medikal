"use client";

import React, { useState, useRef, useEffect } from "react";

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  divider?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  onSelect: (value: string) => void;
  trigger: React.ReactNode;
}

export function Dropdown({ items, onSelect, trigger }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          {items.map((item, idx) => (
            <div key={idx}>
              {item.divider && <div className="border-t my-1" />}
              <button
                onClick={() => {
                  onSelect(item.value);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}