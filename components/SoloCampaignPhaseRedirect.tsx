"use client";

import { useLayoutEffect } from "react";

/**
 * `/?v=solitario` sigue existiendo por enlaces viejos: abre el Nexo en hilo paralela.
 */
export function SoloCampaignPhaseRedirect({
  onRedirect,
}: {
  onRedirect: () => void;
}) {
  useLayoutEffect(() => {
    onRedirect();
  }, [onRedirect]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-600">
      Abriendo crónica…
    </div>
  );
}
