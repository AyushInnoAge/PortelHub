import React from "react";

export function Button({ children, variant = "default", className = "", ...props }) {
  const baseStyles = "px-4 py-2 rounded-md font-semibold focus:outline-none transition-all duration-200";

  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
      disabled={variant === "disabled"}
      {...props}
    >
      {children}
    </button>
  );
}
