"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    __CRONISTA_ANNOUNCE?: (msg: string) => void;
  }
}

export default function AriaLiveLog({ bufferSize = 50 }: { bufferSize?: number }) {
  const [lines, setLines] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const buf = JSON.parse(localStorage.getItem("cronista_a11y_log") || "[]");
      setLines((buf as string[]).slice(-bufferSize).reverse());
    } catch {
      // noop
    }
  }, [bufferSize]);

  const push = (text: string) => {
    const t = `${new Date().toLocaleTimeString()} — ${text}`;
    setLines((s) => [t, ...s].slice(0, bufferSize));
    try {
      const buf = JSON.parse(localStorage.getItem("cronista_a11y_log") || "[]");
      (buf as string[]).push(t);
      localStorage.setItem("cronista_a11y_log", JSON.stringify((buf as string[]).slice(-500)));
    } catch {
      // noop
    }
    if (ref.current) ref.current.textContent = t;
  };

  useEffect(() => {
    window.__CRONISTA_ANNOUNCE = (msg: string) => push(msg);
    return () => {
      delete window.__CRONISTA_ANNOUNCE;
    };
  });

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        <div ref={ref} />
      </div>
      <div className="hidden" aria-hidden>
        {lines.length}
      </div>
    </>
  );
}

