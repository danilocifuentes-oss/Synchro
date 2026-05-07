import React from "react";

export default function IconOrnament({ className = "icon", title = "Ornamento" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 24" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M4 12h24M34 12h24M64 12h24M94 12h24" />
        <circle cx="16" cy="12" r="2" fill="currentColor" />
        <circle cx="46" cy="12" r="2" fill="currentColor" />
        <circle cx="76" cy="12" r="2" fill="currentColor" />
        <circle cx="106" cy="12" r="2" fill="currentColor" />
      </g>
    </svg>
  );
}

