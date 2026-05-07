"use client";

import React from "react";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { useSettings } from "@/context/SettingsContext";

export default function NexoChannelPanelPlaceholder() {
  const sysReduced = usePrefersReducedMotion();
  const { settings } = useSettings();
  const effectiveReduced = settings.reducedMotionOverride == null ? sysReduced : settings.reducedMotionOverride;

  const entryVariants = effectiveReduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.24 } } };

  return (
    <motion.article
      initial="hidden"
      animate="show"
      variants={entryVariants}
      className="rounded-md bg-[var(--panel)] p-6 sharp-border-inner min-h-[60vh]"
    >
      <header className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-grotesk">Nexo · Canal principal</div>
          <div className="text-xs text-[var(--accent-muted)]">Strand: Principal</div>
        </div>
        <div className="text-xs font-mono text-[var(--terminal)]">⚠︎ Amenaza: baja</div>
      </header>

      <section className="prose prose-invert max-w-none">
        <p className="text-[16px] leading-relaxed">
          Narración con Motor IA · Próximamente — aquí se renderizarán bloques largos de texto con buena lectura,
          tipografía y métricas optimizadas para narrativa.
        </p>
      </section>
    </motion.article>
  );
}

