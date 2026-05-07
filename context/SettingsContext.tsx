"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Settings = {
  scanline: boolean;
  reducedMotionOverride?: boolean | null;
  theme: "void" | "light";
};

const DEFAULT: Settings = { scanline: true, reducedMotionOverride: null, theme: "void" };

const SettingsContext = createContext<{
  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
}>({
  settings: DEFAULT,
  setSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem("cronista_settings");
      return raw ? (JSON.parse(raw) as Settings) : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cronista_settings", JSON.stringify(settings));
    } catch {
      // noop
    }

    if (settings.theme === "void") document.documentElement.classList.add("theme-void");
    else document.documentElement.classList.remove("theme-void");

    if (settings.scanline) document.documentElement.classList.add("scanline-enabled");
    else document.documentElement.classList.remove("scanline-enabled");
  }, [settings]);

  const setSettings = (partial: Partial<Settings>) => {
    setSettingsState((s) => ({ ...s, ...partial }));
  };

  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);

