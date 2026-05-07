import React from "react";
import { NexoWrapper } from "@/components/NexoWrapper";

export default function CodexPage() {
  return (
    <NexoWrapper>
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="font-grotesk text-2xl">Codex V - Pagina completa</h1>
        <p className="mb-4 text-sm text-[var(--accent-muted)]">
          Aqui se compilan las entradas del Codex. Reemplaza este bloque con el contenido real.
        </p>
        <div className="sharp-border-inner rounded bg-[var(--panel)] p-4">Contenido del Codex (placeholder)</div>
      </div>
    </NexoWrapper>
  );
}

