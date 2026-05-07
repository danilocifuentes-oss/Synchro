import React from "react";

export default function IconBlood({ className = "icon", title = "Sangre" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <path d="M12 2c-2 3.2-6 6.5-6 9.5A6 6 0 0 0 12 22a6 6 0 0 0 6-10.5c0-3-4-6.3-6-9.5z" fill="currentColor" />
    </svg>
  );
}

