"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsPanel() {
  const { settings, setSettings } = useSettings();

  return (
    <div className="sharp-border-inner w-72 rounded-md bg-[var(--panel)] p-3">
      <h4 className="mb-2 font-grotesk text-sm">Ajustes</h4>

      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-[var(--accent-muted)]">Scanline / CRT</div>
        <button
          type="button"
          className={`rounded px-2 py-1 ${settings.scanline ? "bg-[var(--terminal)] text-black" : "border"}`}
          onClick={() => setSettings({ scanline: !settings.scanline })}
        >
          {settings.scanline ? "On" : "Off"}
        </button>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-[var(--accent-muted)]">Tema</div>
        <select
          value={settings.theme}
          onChange={(e) => setSettings({ theme: e.target.value as "void" | "light" })}
          className="rounded border border-[rgba(255,255,255,0.03)] bg-transparent px-2 py-1 text-sm"
        >
          <option value="void">Techno-gótica</option>
          <option value="light">Claro (experimental)</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-[var(--accent-muted)]">Reduced motion</div>
        <select
          value={settings.reducedMotionOverride === null ? "system" : settings.reducedMotionOverride ? "on" : "off"}
          onChange={(e) =>
            setSettings({
              reducedMotionOverride: e.target.value === "system" ? null : e.target.value === "on",
            })
          }
          className="rounded border border-[rgba(255,255,255,0.03)] bg-transparent px-2 py-1 text-sm"
        >
          <option value="system">Sistema</option>
          <option value="on">Forzar reducido</option>
          <option value="off">Forzar animado</option>
        </select>
      </div>
    </div>
  );
}

