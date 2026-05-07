"use client";

import React, { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { useSettings } from "@/context/SettingsContext";

type Props = {
  children?: React.ReactNode;
  /** Milisegundos para activar `onHold`. */
  holdMs?: number;
  /** Click/tap normal (sin completar hold). */
  onPress?: () => void;
  /** Acción tras mantener presionado el tiempo requerido. */
  onHold?: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

export default function ActionRevealButton({
  children,
  holdMs = 800,
  onPress,
  onHold,
  className = "",
  ariaLabel = "Acción",
  disabled = false,
}: Props) {
  const sysReduced = usePrefersReducedMotion();
  const { settings } = useSettings();
  const effectiveReduced = settings.reducedMotionOverride == null ? sysReduced : settings.reducedMotionOverride;
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const heldRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const startHold = () => {
    if (disabled) return;
    heldRef.current = false;
    startRef.current = performance.now();

    if (effectiveReduced) {
      setProgress(100);
      heldRef.current = true;
      onHold?.();
      return;
    }

    setProgress(0);
    timerRef.current = window.setInterval(() => {
      if (!startRef.current) return;
      const elapsed = performance.now() - startRef.current;
      const pct = Math.min(100, Math.round((elapsed / holdMs) * 100));
      setProgress(pct);
      if (elapsed >= holdMs) {
        heldRef.current = true;
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
        onHold?.();
      }
    }, 16);
  };

  const cancelHold = (triggerClick = false) => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
    setProgress(0);

    if (!heldRef.current && triggerClick) onPress?.();
    heldRef.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startHold();
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    cancelHold(true);
  };
  const handleMouseLeave = () => cancelHold(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startHold();
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    cancelHold(!heldRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      if (!startRef.current) startHold();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      onPress?.();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      cancelHold(!heldRef.current);
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={false}
      disabled={disabled}
      className={`relative overflow-hidden rounded px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--terminal-dim)] ${className}`.trim()}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-transparent" aria-hidden>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--terminal), var(--neon))",
            transition: effectiveReduced ? "none" : "width 60ms linear",
          }}
        />
      </div>
      <span className="relative z-10">{children ?? "Acción"}</span>
    </button>
  );
}

