"use client";

import { useMemo } from "react";
import { chronicleInventoryLines } from "@/lib/soloCampaign/chronicleInventory";
import { useSoloCampaign } from "@/context/SoloCampaignContext";

/** Resumen de objetos y mandatos activos en la crónica (barra lateral Nexo · Paralela). */
export function SoloChronicleInventory() {
  const { progress } = useSoloCampaign();
  const lines = useMemo(() => chronicleInventoryLines(progress.flags), [progress.flags]);

  if (lines.length === 0) return null;

  return (
    <section className="space-y-2 border-t border-white/[0.06] pt-3" aria-label="Inventario de crónica">
      <p className="text-[9px] uppercase tracking-[0.22em] text-neutral-600">Mandatos · objetos</p>
      <ul className="space-y-1.5 text-[9px] leading-snug text-neutral-400">
        {lines.map((line) => (
          <li key={line} className="border-l border-white/[0.08] pl-2">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
