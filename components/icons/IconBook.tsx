import React from "react";

export default function IconBook({ className = "icon", title = "Codex" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4h11c.8 0 1.5.7 1.5 1.5V20c0 .8-.7 1.5-1.5 1.5h-11C4.7 21.5 4 20.8 4 20V5.5z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 8h10M7 11h10M7 14h6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

