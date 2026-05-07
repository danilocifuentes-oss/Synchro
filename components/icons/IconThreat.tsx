import React from "react";

export default function IconThreat({ className = "icon", title = "Amenaza" }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <path d="M12 3l2 5 5 .5-3.8 2.8L16 18l-4-2-4 2 .6-6.7L4 8.5 9 8l2-5z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

