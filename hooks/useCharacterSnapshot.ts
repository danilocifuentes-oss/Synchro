"use client";

import { useCallback } from "react";
import { useCharacter } from "@/context/CharacterContext";

export default function useCharacterSnapshot() {
  const { character } = useCharacter();

  const snapshot = useCallback(() => {
    return {
      ts: new Date().toISOString(),
      identity: character.identity,
      status: character.status,
    };
  }, [character]);

  const exportJson = useCallback(() => {
    const data = snapshot();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `character_snapshot_${character.identity.nombre || "anon"}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [character, snapshot]);

  const exportSimpleCsv = useCallback(() => {
    const data = snapshot();
    const rows = [
      ["ts", data.ts],
      ["nombre", data.identity.nombre],
      ["clan", data.identity.clan || ""],
      ["generación", data.identity.generación || data.identity.generacion || ""],
      ["ansia", String(data.status.ansia)],
      ["voluntad_current", String(data.status.voluntad.current)],
      ["voluntad_max", String(data.status.voluntad.max)],
      ["daño_current", String(data.status.daño.current)],
      ["daño_max", String(data.status.daño.max)],
      ["px", String(data.status.px ?? 0)],
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `character_snapshot_${character.identity.nombre || "anon"}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [character, snapshot]);

  return { snapshot, exportJson, exportSimpleCsv };
}

