"use client";

import { useMemo } from "react";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";

export default function GlobalKeyboardShortcuts() {
  const bindings = useMemo(
    () => ({
      g: () => console.log("Go to Nexo quick"),
      Escape: () => window.__CRONISTA_ANNOUNCE?.("Escape pulsado."),
      "Ctrl+Alt+l": () => window.__CRONISTA_ANNOUNCE?.("Panel de logs abierto"),
    }),
    [],
  );

  useKeyboardShortcuts(bindings);
  return null;
}

