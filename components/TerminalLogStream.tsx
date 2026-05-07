"use client";

import { useEffect, useRef } from "react";

type LineTone = "info" | "warn" | "error";

export type TerminalLogLine = {
  id: string;
  text: string;
  tone?: LineTone;
  createdAt?: string;
};

export default function TerminalLogStream({
  lines = [],
  className = "",
}: {
  lines?: TerminalLogLine[];
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  const toneClass = (tone?: LineTone): string => {
    if (tone === "error") return "text-[var(--crimson)]";
    if (tone === "warn") return "text-amber-300";
    return "text-[var(--terminal)]";
  };

  return (
    <div
      ref={listRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      className={`max-h-48 overflow-auto space-y-1 bg-transparent p-4 font-mono text-sm ${className}`}
    >
      {lines.map((line) => (
        <div key={line.id} className="leading-tight">
          <span className="opacity-60">[{line.createdAt ?? "--:--:--"}]</span>{" "}
          <span className={toneClass(line.tone)}>{line.text}</span>
        </div>
      ))}
    </div>
  );
}

