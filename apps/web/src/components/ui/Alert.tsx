import React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "error" | "warning" | "success";
}

export const Alert: React.FC<AlertProps> = ({ children, variant = "default", className, ...props }) => {
  const variantClasses = {
    default: "bg-blue-50 border-blue-200 text-blue-900",
    error: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    success: "bg-green-50 border-green-200 text-green-900",
  };

  return (
    <div 
      className={`rounded-lg border p-4 ${variantClasses[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

export type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className, ...props }) => (
  <p className={`text-sm mt-2 ${className || ""}`} {...props}>{children}</p>
);
