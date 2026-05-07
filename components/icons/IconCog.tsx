import React from "react";

export default function IconCog({ className = "icon", title = "Ajustes" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M19.4 13.5a7.2 7.2 0 0 0 0-3l1.8-1.1-1.7-2.9-2.1.6a6.9 6.9 0 0 0-2.2-1.3L14.2 2h-4.4l-.9 2.7a6.9 6.9 0 0 0-2.2 1.3l-2.1-.6L2.8 9.4 4.6 10.5a7.2 7.2 0 0 0 0 3L2.8 15.6l1.7 2.9 2.1-.6c.64.48 1.35.86 2.12 1.12L9.8 22h4.4l.9-2.7c.77-.26 1.48-.64 2.12-1.12l2.1.6 1.7-2.9z" />
      </g>
    </svg>
  );
}

