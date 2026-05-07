"use client";

import React from "react";
import TechnicalHud from "@/components/TechnicalHud";
import DiceRollerD10 from "@/components/DiceRollerD10";

type Props = {
  identity: { nombre: string; clan?: string };
  status: {
    ansia: number;
    voluntad: { current: number; max: number };
    daño: { current: number; max: number };
  };
  onRoll?: (value: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function SoloCampaignHeader({ identity, status, onRoll, onPrev, onNext }: Props) {
  return (
    <header className="mb-4 flex w-full items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="sharp-border-inner rounded-md bg-[rgba(255,255,255,0.01)] p-3">
          <div className="font-grotesk text-sm">{identity.nombre}</div>
          <div className="text-xs text-[var(--accent-muted)]">{identity.clan}</div>
        </div>

        <div>
          <TechnicalHud ansia={status.ansia} voluntad={status.voluntad} daño={status.daño} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          className="rounded border border-[rgba(255,255,255,0.04)] px-3 py-2"
          aria-label="Escena anterior"
        >
          Atrás
        </button>
        <DiceRollerD10 onResult={(v) => onRoll?.(v)} />
        <button
          type="button"
          onClick={onNext}
          className="rounded border border-[rgba(255,255,255,0.04)] px-3 py-2"
          aria-label="Siguiente escena"
        >
          Adelante
        </button>
      </div>
    </header>
  );
}

