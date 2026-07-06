import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, type, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="ml-0.5 text-primary">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-sm transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
