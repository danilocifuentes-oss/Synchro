import React from "react";

export default function IconAvatarSigil({ className = "icon", title = "Sigil" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <path d="M12 3c-3 0-5 2-6 4.5C6 11 12 21 12 21s6-10 6-13.5C17 5 15 3 12 3z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 10c0 1.7 1.7 3 3 3s3-1.3 3-3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

