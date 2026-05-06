"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

const BOOT_KEY = "nexo_immersive_boot_v1";

type Props = {
  children: ReactNode;
};

/**
 * Capa cero: pulso ambiental + arranque Schreck (una vez por pestaña) sin dependencias externas.
 */
export function NexoWrapper({ children }: Props) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"pending" | "boot" | "app">("pending");

  useEffect(() => {
    if (reduceMotion) {
      setPhase("app");
      return;
    }

    let shouldBoot = true;
    try {
      shouldBoot = !sessionStorage.getItem(BOOT_KEY);
    } catch {
      shouldBoot = true;
    }

    if (!shouldBoot) {
      setPhase("app");
      return;
    }

    setPhase("boot");
    const t = window.setTimeout(() => {
      setPhase("app");
      try {
        sessionStorage.setItem(BOOT_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 2000);

    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-void text-neutral-200">
      <div className="necro-ambient-bg" aria-hidden />

      {phase === "pending" ? (
        <div className="relative z-10 min-h-screen">{children}</div>
      ) : (
      <AnimatePresence mode="wait">
        {phase === "boot" ? (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void font-mono text-terminal"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 h-px bg-terminal shadow-[0_0_15px_rgba(57,255,20,0.55)]"
            />
            <p className="animate-pulse text-[10px] uppercase tracking-[0.45em]">
              Iniciando protocolo SchreckNet…
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative z-10 min-h-screen"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      )}
    </div>
  );
}
