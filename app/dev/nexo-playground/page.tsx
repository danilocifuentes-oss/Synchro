"use client";

import React, { useEffect } from "react";
import { NexoWrapper } from "@/components/NexoWrapper";
import { SidebarMesa } from "@/components/SidebarMesa";
import NexoChannelPanelPlaceholder from "@/components/NexoChannelPanelPlaceholder";
import { sampleDisciplines } from "@/components/mockData";
import { useCharacter } from "@/context/CharacterContext";

export default function NexoPlayground() {
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
      <div className="app-container grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SidebarMesa
            disciplines={sampleDisciplines}
            onEnterNexo={() => console.log("nexo")}
            onOpenCodex={() => console.log("codex")}
            onLogout={() => console.log("logout")}
          />
        </div>
        <div className="lg:col-span-6">
          <NexoChannelPanelPlaceholder />
        </div>
        <div className="lg:col-span-3">
          <div className="sharp-border-inner rounded-md bg-[var(--panel)] p-4">
            <h4 className="text-xs text-[var(--accent-muted)]">Digest</h4>
            <p className="font-mono text-sm text-[var(--terminal)]">Visual QA playground</p>
          </div>
        </div>
      </div>
    </NexoWrapper>
  );
}

