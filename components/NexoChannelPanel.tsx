"use client";

import type { ReactNode } from "react";
import {
  NARRATIVE_STRANDS,
  STRAND_ACCENT,
  STRAND_LABEL,
  STRAND_TAG,
  type NarrativeStrand,
} from "@/lib/narrativeStrands";
import { IconThreat } from "@/components/icons";

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
        className="shrink-0 space-y-2 border-b border-[#222] px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.28em] sm:px-4 sm:tracking-[0.32em]"
        style={{ color: accent }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          {showTechnicalAnchors ? (
            <span className="gothic-title text-[10px] font-medium normal-case tracking-tight text-neutral-400 sm:text-[11px]">
              {"//_STREAM · CRÓNICA"}
            </span>
          ) : identityHint ? (
            <span className="max-w-[min(100%,28rem)] truncate font-sans text-[11px] font-normal normal-case tracking-tight text-neutral-400 sm:text-[12px]">
              {identityHint}
            </span>
          ) : (
            <span className="sr-only">Canal Nexo</span>
          )}
        </div>
        {glyphContext ? (
          showTechnicalAnchors ? (
            <div className="flex items-center gap-2 font-mono text-[9px] font-normal normal-case tracking-wide text-neutral-500">
              <IconThreat className="h-4 w-4 text-[var(--crimson)]" />
              <span>
                Amenaza σ {glyphContext.inquisitionThreat} · Hambre {glyphContext.hunger}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 opacity-75" aria-hidden>
              <IconThreat className="h-3.5 w-3.5 text-[var(--crimson)]" />
            </div>
          )
        ) : null}
        <div className="flex flex-wrap gap-1.5 normal-case tracking-normal sm:gap-2">
          {NARRATIVE_STRANDS.map((s) => {
            const on = s === activeStrand;
            return (
              <button
                key={s}
                type="button"
                aria-label={STRAND_LABEL[s]}
                onClick={() => onStrandChange(s)}
                className={`rounded border px-2 py-1.5 text-[9px] font-mono transition-colors sm:px-2.5 sm:py-1 sm:text-[8px] ${
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
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 text-center">
            <div className="w-full max-w-md rounded-md border border-white/[0.08] bg-black/30 px-5 py-5 sm:px-6 sm:py-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--neon)]">
                Narración con Motor IA
              </p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-neutral-300">Próximamente.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
