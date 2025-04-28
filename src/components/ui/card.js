import React from "react";

export function Card({
  children,
  className = "",
  shadow = "md",
  padding = "p-4",
  ...props
}) {
  const shadowVariants = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  return (
    <div
      className={`border rounded-lg bg-white ${padding} ${shadowVariants[shadow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

const CardContent = ({ children, className = "" }) => {
  return <div className={`mt-2 ${className}`}>{children}</div>;
};

export { CardContent };
