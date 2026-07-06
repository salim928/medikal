"use client";

import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-brand-600 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}