"use client";

import React, { useEffect } from "react";
import { NexoWrapper } from "@/components/NexoWrapper";
import { SidebarMesa } from "@/components/SidebarMesa";
import NexoChannelPanelPlaceholder from "@/components/NexoChannelPanelPlaceholder";
import { sampleDisciplines } from "@/components/mockData";
import { useCharacter } from "@/context/CharacterContext";

export default function NexoPreviewPage() {
  const { setIdentity, replaceStatus } = useCharacter();
  useEffect(() => {
    setIdentity({ nombre: "Ariadne", clan: "Toreador", generacion: "9ª" });
    replaceStatus({
      ansia: 2,
      voluntad: { current: 3, max: 5 },
      daño: { current: 1, max: 5 },
      px: 7,
    });
  }, [replaceStatus, setIdentity]);

  return (
    <NexoWrapper>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 app-container">
        <div className="lg:col-span-3">
          <SidebarMesa
            disciplines={sampleDisciplines}
            onEnterNexo={() => window.alert("Entrar al Nexo")}
            onOpenCodex={() => window.alert("Abrir Codex V")}
            onLogout={() => (window.location.href = "/")}
          />
        </div>

        <div className="lg:col-span-6">
          <NexoChannelPanelPlaceholder />
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-md bg-[var(--panel)] p-4 sharp-border-inner">
            <h4 className="text-xs text-[var(--accent-muted)]">Digest</h4>
            <p className="text-sm font-mono text-[var(--terminal)]">Resumen de crónica (placeholder)</p>
          </div>
        </div>
      </div>
    </NexoWrapper>
  );
}

