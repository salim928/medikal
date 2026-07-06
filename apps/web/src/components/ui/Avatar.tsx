"use client";

import React from "react";

interface AvatarProps {
  src?: string;
  alt: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, alt, initials, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center`}
    >
      {initials || alt.substring(0, 2).toUpperCase()}
    </div>
  );
}