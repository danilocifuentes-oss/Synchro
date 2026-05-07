import React from "react";
import Link from "next/link";
import { NexoWrapper } from "@/components/NexoWrapper";
import { IconBookAnimated, IconTerminalAnimated } from "@/components/icons/animated";
import { IconOrnament } from "@/components/icons";

export default function CodexPage() {
  return (
    <NexoWrapper>
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <header className="sharp-border-inner card-inner-glow rounded bg-[var(--panel)] p-4">
          <h1 className="mb-1 inline-flex items-center gap-2 font-grotesk text-2xl">
            <IconBookAnimated className="icon" />
            <span>Codex V</span>
            <IconOrnament className="icon w-[64px]" />
          </h1>
          <p className="text-sm text-[var(--accent-muted)]">
            Archivo narrativo activo. Usa esta vista para revisar entradas, ecos y continuidad de crónica.
          </p>
        </header>
        <section className="sharp-border-inner card-inner-glow rounded bg-[var(--panel)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--accent-muted)]">Entradas recientes</p>
          <ul className="space-y-2 text-sm text-neutral-200">
            <li className="rounded border border-white/[0.08] bg-black/25 p-3">Linajes y jerarquías en disputa.</li>
            <li className="rounded border border-white/[0.08] bg-black/25 p-3">Reglas de Despertar y coste alternativo de Voluntad.</li>
            <li className="rounded border border-white/[0.08] bg-black/25 p-3">Estado de presión Σ y alertas de cacería.</li>
          </ul>
          <Link
            href="/"
            className="btn-glow mt-4 inline-flex items-center gap-2 rounded border border-[var(--terminal)]/35 bg-neutral-950/80 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--terminal)]"
          >
            <IconTerminalAnimated className="icon" />
            <span>Volver</span>
          </Link>
        </section>
      </div>
    </NexoWrapper>
  );
}

