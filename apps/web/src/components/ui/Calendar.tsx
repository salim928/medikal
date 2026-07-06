"use client";

import React, { useState } from "react";
import { Button } from "./Button";

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function Calendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="font-semibold">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isSelected =
            selectedDate &&
            date.toDateString() === selectedDate.toDateString();
          const isDisabled = isDateDisabled(day);

          return (
            <button
              key={day}
              onClick={() => !isDisabled && onSelectDate(date)}
              disabled={isDisabled}
              className={`p-2 rounded text-sm font-medium transition ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : isDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}