import React from "react";

export default function IconTerminal({
  className = "icon",
  title = "Terminal",
  decorative,
}: {
  className?: string;
  title?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {!decorative ? <title>{title}</title> : null}
      <rect x="1" y="3" width="22" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 9l3 2-3 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 13h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

