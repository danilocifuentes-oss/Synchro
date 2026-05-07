"use client";

import { useEffect } from "react";

export default function useKeyboardShortcuts(bindings: { [key: string]: (e?: KeyboardEvent) => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = [];
      if (e.ctrlKey) key.push("Ctrl");
      if (e.metaKey) key.push("Meta");
      if (e.altKey) key.push("Alt");
      if (e.shiftKey) key.push("Shift");
      key.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      const joined = key.join("+");
      const fn = bindings[joined] || bindings[e.key] || bindings[joined.toLowerCase()];
      if (fn) {
        e.preventDefault();
        fn(e);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [bindings]);
}

