"use client";

import type { ReactNode } from "react";
import {
  NARRATIVE_STRANDS,
  STRAND_ACCENT,
  STRAND_LABEL,
  STRAND_TAG,
  type NarrativeStrand,
} from "@/lib/narrativeStrands";
import { NexusLibrary } from "@/components/icons/NexusLibrary";

export type NexoGlyphContext = {
  inquisitionThreat: number;
  hunger: number;
};

type Props = {
  accent: string;
  activeStrand: NarrativeStrand;
  onStrandChange: (s: NarrativeStrand) => void;
  identityHint?: string;
  showTechnicalAnchors?: boolean;
  glyphContext?: NexoGlyphContext;
  /** true si el servidor expone al menos una API de IA (ver /api/nexo-capabilities). */
  llmReady: boolean;
  /** Contenido del canal (p. ej. campaña solitaria). Si es null/undefined, se muestra el estado vacío del hilo. */
  children?: ReactNode;
};

/**
 * Sustituye al antiguo stream NEXO (NarrativeFlow + simulación).
 * Sin API: canal bloqueado. Con API: anuncio de multijugador futuro; la mesa aún no está cableada.
 */
export function NexoChannelPanel({
  accent,
  activeStrand,
  onStrandChange,
  identityHint,
  showTechnicalAnchors = false,
  glyphContext,
  llmReady,
  children,
}: Props) {
  const strandBorder = STRAND_ACCENT[activeStrand];

  return (
    <section
      className="nexo-stream-panel nexo-gothic-shell flex min-h-0 flex-1 flex-col overflow-hidden border border-[#2a2a30]/80 bg-black/25 shadow-[inset_0_1px_0_rgba(192,38,211,0.06)]"
      style={{ borderColor: `${strandBorder}55` }}
      aria-label="Canal Nexo"
    >
      <header
        className="shrink-0 space-y-2 border-b border-[#222] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.32em]"
        style={{ color: accent }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          {showTechnicalAnchors ? (
            <span className="gothic-title text-[10px] font-medium normal-case tracking-tight text-neutral-400">
              {"//_STREAM · CRÓNICA"}
            </span>
          ) : identityHint ? (
            <span className="max-w-[min(100%,28rem)] truncate font-sans text-[11px] font-normal normal-case tracking-tight text-neutral-400">
              {identityHint}
            </span>
          ) : (
            <span className="sr-only">Canal Nexo</span>
          )}
        </div>
        {glyphContext ? (
          showTechnicalAnchors ? (
            <div className="flex items-center gap-2 font-mono text-[8px] font-normal normal-case tracking-wide text-neutral-500">
              <NexusLibrary.Inquisicion sigma={glyphContext.inquisitionThreat} className="h-4 w-4" />
              <span>
                Amenaza σ {glyphContext.inquisitionThreat} · Hambre {glyphContext.hunger}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 opacity-75" aria-hidden>
              <NexusLibrary.Inquisicion sigma={glyphContext.inquisitionThreat} className="h-3.5 w-3.5" />
            </div>
          )
        ) : null}
        <div className="flex flex-wrap gap-1.5 normal-case tracking-normal">
          {NARRATIVE_STRANDS.map((s) => {
            const on = s === activeStrand;
            return (
              <button
                key={s}
                type="button"
                aria-label={STRAND_LABEL[s]}
                onClick={() => onStrandChange(s)}
                className={`rounded border px-2 py-1 text-[8px] font-mono transition-colors ${
                  on ? "text-neutral-100" : "border-[#2a2a2a] text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
                }`}
                style={
                  on
                    ? {
                        borderColor: STRAND_ACCENT[s],
                        backgroundColor: `${STRAND_ACCENT[s]}18`,
                        color: STRAND_ACCENT[s],
                      }
                    : undefined
                }
              >
                <span className="opacity-80">{STRAND_TAG[s]}</span> {STRAND_LABEL[s]}
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children != null ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
            {!llmReady ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-600">Canal Nexo · sin motor</p>
                <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-neutral-400">
                  No hay API de narración configurada en este despliegue. La mesa común permanece cerrada: no hay texto automático ni campo para escribir aquí.
                </p>
                <p className="mt-4 max-w-md font-sans text-[13px] leading-relaxed text-neutral-500">
                  Para jugar ahora, usa el hilo{" "}
                  <span className="font-medium text-[color:var(--accent-clan)]">SOL · Campaña solitaria</span>.
                </p>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--neon)]">Motor IA · detectado</p>
                <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-neutral-300">
                  Las claves de IA están disponibles en el servidor. El modo multijugador con narración compartida se activará en una versión posterior; esta build se centra en la campaña solitaria.
                </p>
                <p className="mt-4 max-w-sm font-sans text-[12px] text-neutral-500">
                  Mientras tanto, el canal común permanece inactivo para evitar respuestas simuladas heredadas de versiones anteriores.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
