import React from "react";

export function Avatar({ src = "https://via.placeholder.com/150", alt = "Profile", className = "w-10 h-10" }) {
  return (
    <div className={`overflow-hidden rounded-full bg-gray-300 ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
