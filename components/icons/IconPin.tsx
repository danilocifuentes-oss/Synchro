import React from "react";

export default function IconPin({ className = "icon", title = "Escena" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <path d="M12 2a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="8" r="1.6" fill="currentColor" />
    </svg>
  );
}

