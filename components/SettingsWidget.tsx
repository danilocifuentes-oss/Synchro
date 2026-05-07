"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SettingsPanel from "@/components/SettingsPanel";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

const LS_KEY = "cronista_settings_open_v1";

export default function SettingsWidget() {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw === "1";
    } catch {
      return false;
    }
  });
  const [pendingBadge, setPendingBadge] = useState(false);

  useEffect(() => {
    try {
      const buf = JSON.parse(localStorage.getItem("cronista_log_buffer") || "[]");
      setPendingBadge(Array.isArray(buf) && buf.length > 0);
    } catch {
      setPendingBadge(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, open ? "1" : "0");
    } catch {
      // noop
    }
  }, [open]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[60] flex items-end">
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Cerrar ajustes" : "Abrir ajustes"}
          onClick={() => setOpen((s) => !s)}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.04)] bg-[rgba(0,0,0,0.6)] text-[var(--terminal)] shadow-[0_0_12px_rgba(57,255,20,0.08),0_8px_30px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-2 focus:ring-[var(--terminal-dim)]"
          title="Ajustes"
        >
          <span className="select-none text-lg">{open ? "✕" : "⚙"}</span>
          {pendingBadge && !open ? (
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--crimson)] text-[10px] font-mono text-white shadow-[0_0_12px_rgba(57,255,20,0.08),0_8px_30px_rgba(0,0,0,0.6)]" />
          ) : null}
        </button>
      </div>

      {reduced ? (
        open ? (
          <div role="dialog" aria-modal="true" className="fixed bottom-20 right-4 z-50" style={{ transformOrigin: "bottom right" }}>
            <div className="p-2 backdrop-blur-sm">
              <SettingsPanel />
            </div>
          </div>
        ) : null
      ) : (
        <AnimatePresence>
          {open ? (
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed bottom-20 right-4 z-50"
            >
              <motion.div
                className="p-2 backdrop-blur-sm"
                initial={{ translateY: 8 }}
                animate={{ translateY: 0 }}
                exit={{ translateY: 8 }}
                transition={{ duration: 0.18 }}
              >
                <SettingsPanel />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </>
  );
}

