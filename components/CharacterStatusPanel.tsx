"use client";

import React, { useMemo, useState } from "react";
import type { CharacterSheet } from "@/lib/character";
import { CLAN_ACCENTS, CLAN_OPTIONS } from "@/lib/character";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type Props = {
  /** Modo legacy: estado derivado desde la ficha completa. */
  sheet?: CharacterSheet;
  /** Modo compacto/standalone. */
  compact?: boolean;
  integridad?: { current: number; max: number };
  voluntad?: { current: number; max: number };
  ansia?: number;
  onToggleExpand?: () => void;
  isNarrator?: boolean;
};

const DEFAULT_HEALTH_MAX = 7;

/** Eco vital de la hoja: lectura compacta/expandible con compatibilidad legacy. */
export function CharacterStatusPanel({
  sheet,
  compact = false,
  integridad: integridadProp,
  voluntad: voluntadProp,
  ansia: ansiaProp,
  onToggleExpand,
  isNarrator = false,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(!compact);

  const derived = useMemo(() => {
    if (sheet) {
      const max = DEFAULT_HEALTH_MAX;
      const current = Math.max(0, max - Math.min(sheet.healthDamage, max));
      return {
        integridad: { current, max },
        voluntad: { current: sheet.willpowerCur, max: sheet.willpowerMax },
        ansia: Math.max(0, Math.min(5, sheet.hunger)),
      };
    }
    return {
      integridad: integridadProp ?? { current: 0, max: 5 },
      voluntad: voluntadProp ?? { current: 3, max: 5 },
      ansia: Math.max(0, Math.min(5, ansiaProp ?? 0)),
    };
  }, [sheet, integridadProp, voluntadProp, ansiaProp]);

  const integridad = derived.integridad;
  const voluntad = derived.voluntad;
  const ansia = derived.ansia;

  const wpPct = Math.round((voluntad.current / Math.max(1, voluntad.max)) * 100);
  const integPct = Math.round((integridad.current / Math.max(1, integridad.max)) * 100);
  const accent = sheet ? CLAN_ACCENTS[sheet.clan] : "#9ca3af";
  const linajeLabel = sheet ? CLAN_OPTIONS.find((c) => c.id === sheet.clan)?.label ?? sheet.clan : "—";

  const body = (
    <div className="rounded-md bg-[rgba(255,255,255,0.01)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-mono text-[var(--terminal)]">Estado</div>
        <div className="text-xs text-[var(--accent-muted)]">{ansia}/5 Ansia</div>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-[var(--accent-muted)]">Integridad</span>
          <span className="text-[11px] text-[var(--accent-muted)]">
            {integridad.current}/{integridad.max}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-[rgba(255,255,255,0.02)]">
          <div
            style={{
              width: `${integPct}%`,
              background: "var(--terminal)",
              height: "100%",
              transition: reduced ? "none" : "width 350ms ease",
            }}
            aria-hidden
          />
        </div>
      </div>

      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-[var(--accent-muted)]">Voluntad</span>
          <span className="text-[11px] text-[var(--accent-muted)]">
            {voluntad.current}/{voluntad.max}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-[rgba(255,255,255,0.02)]">
          <div
            style={{
              width: `${wpPct}%`,
              background: "var(--terminal)",
              height: "100%",
              transition: reduced ? "none" : "width 350ms ease",
            }}
            aria-hidden
          />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => i < ansia).map((on, idx) => (
          <div key={idx} className={`h-3 w-3 rounded ${on ? "bg-[var(--crimson)]" : "bg-[rgba(255,255,255,0.02)]"}`} />
        ))}
        <div className="ml-2 text-xs text-[var(--accent-muted)]">Ansia</div>
      </div>
    </div>
  );

  return (
    <aside className="w-full rounded-md border border-[#161616] bg-black/24 p-3 font-mono text-[10px] text-neutral-500 lg:w-60 lg:shrink-0">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-sans">Hoja — Estado</div>
        <button
          aria-expanded={open}
          onClick={() => {
            setOpen((v) => !v);
            onToggleExpand?.();
          }}
          className="rounded border border-[rgba(255,255,255,0.03)] px-2 py-1 text-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--terminal-dim)]"
        >
          {open ? "Ocultar" : "Abrir"}
        </button>
      </div>

      {open ? (
        body
      ) : (
        <div className="rounded-md bg-[rgba(255,255,255,0.01)] p-2">
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm text-[var(--terminal)]">
              V{voluntad.current}/{voluntad.max}
            </div>
            <div className="font-mono text-sm text-[var(--crimson)]">{ansia}</div>
          </div>
        </div>
      )}

      {isNarrator && sheet ? (
        <p className="mt-3 border-t border-[#161616] pt-3 text-[8px] leading-relaxed text-neutral-700" style={{ color: accent }}>
          <span className="font-sans font-medium text-neutral-400">{sheet.name || "—"}</span>
          <span className="text-neutral-600"> · </span>
          <span>{linajeLabel}</span>
          <span className="mt-2 block text-neutral-600">
            Pot. sangre {sheet.bloodPotency} · Humanidad {sheet.humanity}
            {sheet.freebiePool > 0 ? ` · Puntos libres ${sheet.freebiePool}` : null}
            {sheet.resonance ? ` · Resonancia ${sheet.resonance}` : null}
          </span>
        </p>
      ) : null}
    </aside>
  );
}

export default CharacterStatusPanel;
