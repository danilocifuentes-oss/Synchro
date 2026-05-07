import React from "react";

export default function IconSkull({ className = "icon", title = "Sigilo" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <path d="M12 2c-2 0-4 1.2-4 3.5v1C8 8 6.5 9 6.5 11c0 1.8 1 3 1 4.5S8.5 19 12 19s3.5-1 4-2.5 1-2.7 1-4.5c0-2-1.5-3-1.5-4.5v-1C16 3.2 14 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9" cy="10.5" r="0.9" fill="currentColor" />
      <circle cx="15" cy="10.5" r="0.9" fill="currentColor" />
      <path d="M9 15s1 .8 3 .8 3-.8 3-.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

