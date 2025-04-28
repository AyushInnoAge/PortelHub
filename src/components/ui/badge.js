import React from "react";

export function Badge({ children, className = "bg-blue-500 text-white" }) {
  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${className}`}>
      {children}
    </span>
  );
}
