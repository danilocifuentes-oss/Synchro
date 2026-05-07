"use client";

import { useEffect, useState } from "react";

export default function usePrefersReducedMotion(): boolean {
  /** Evita flash de animación durante hidratación. */
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const readOverride = (): boolean | null => {
      try {
        const raw = localStorage.getItem("cronista_settings");
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { reducedMotionOverride?: boolean | null };
        return typeof parsed.reducedMotionOverride === "boolean" ? parsed.reducedMotionOverride : null;
      } catch {
        return null;
      }
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const override = readOverride();
      setReduced(override === null ? mq.matches : override);
    };
    apply();

    const handler = (_e: MediaQueryListEvent) => apply();
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "cronista_settings") apply();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return reduced;
}

