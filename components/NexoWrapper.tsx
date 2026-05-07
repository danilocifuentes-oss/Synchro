"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import TerminalLogStream, { type TerminalLogLine } from "@/components/TerminalLogStream";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { useSettings } from "@/context/SettingsContext";

const BOOT_KEY = "nexo_immersive_boot_v1";

type Props = {
  children: ReactNode;
};

/**
 * Capa cero: pulso ambiental + arranque Schreck (una vez por pestaña) sin dependencias externas.
 */
export function NexoWrapper({ children }: Props) {
  const sysReducedMotion = usePrefersReducedMotion();
  const { settings } = useSettings();
  const effectiveReduced = settings.reducedMotionOverride == null ? sysReducedMotion : settings.reducedMotionOverride;
  const [phase, setPhase] = useState<"pending" | "boot" | "app">("pending");

  const bootLines = useMemo<TerminalLogLine[]>(() => {
    const now = new Date();
    const t0 = new Date(now);
    const t1 = new Date(now.getTime() + 350);
    const t2 = new Date(now.getTime() + 700);
    return [
      { id: "l1", text: "Iniciando subsistema SchreckNet...", tone: "info", createdAt: t0.toLocaleTimeString() },
      { id: "l2", text: "Cargando mallas de identidad...", tone: "warn", createdAt: t1.toLocaleTimeString() },
      { id: "l3", text: "Estableciendo nodo: CRONISTA/NEO...", tone: "info", createdAt: t2.toLocaleTimeString() },
    ];
  }, []);

  useEffect(() => {
    if (effectiveReduced) {
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
  }, [effectiveReduced]);

  return (
    <div className="theme-void relative min-h-screen overflow-x-hidden bg-void text-neutral-200">
      <div className="necro-ambient-bg" aria-hidden />
      <div className="scan-overlay fixed inset-0 pointer-events-none" aria-hidden />

      {phase === "pending" ? (
        <div className="relative z-10 min-h-screen">{children}</div>
      ) : (
        <AnimatePresence mode="wait">
          {phase === "boot" && !effectiveReduced ? (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="boot-overlay fixed inset-0 z-[200] flex items-center justify-center bg-[linear-gradient(180deg,rgba(5,5,5,0.95),rgba(0,0,0,0.85))]"
            >
              <motion.div
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                className="boot-card sharp-border-inner w-[min(760px,92%)] border border-[var(--terminal)]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-7 font-mono text-[var(--terminal)] shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
              >
                <p className="mb-4 text-sm text-[var(--terminal)]">Iniciando protocolo...</p>
                <TerminalLogStream lines={bootLines} className="text-[var(--terminal)]" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={effectiveReduced ? { duration: 0 } : { duration: 0.55, ease: "easeOut" }}
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
