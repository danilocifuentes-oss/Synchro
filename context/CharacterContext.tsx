"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import useActionLogger from "@/hooks/useActionLogger";

export type CharacterStatus = {
  ansia: number;
  voluntad: { current: number; max: number };
  daño: { current: number; max: number };
  px?: number;
};

export type CharacterIdentity = {
  id?: string;
  nombre: string;
  clan?: string;
  /** Compatibilidad con variantes antiguas. */
  generacion?: string;
  /** Alias legado solicitado en algunos snippets. */
  generación?: string;
  avatar?: string;
};

export type CharacterState = {
  identity: CharacterIdentity;
  status: CharacterStatus;
};

const DEFAULT: CharacterState = {
  identity: { nombre: "Anónimo", clan: "Indefinido", generacion: "?" },
  status: { ansia: 0, voluntad: { current: 3, max: 5 }, daño: { current: 0, max: 5 }, px: 0 },
};

const CharacterContext = createContext<{
  character: CharacterState;
  setIdentity: (i: Partial<CharacterIdentity>) => void;
  applyDelta: (delta: Partial<{ ansia: number; voluntad: number; daño: number; px: number }>, note?: string) => void;
  replaceStatus: (s: Partial<CharacterStatus>) => void;
  saveNow: () => Promise<void>;
}>({
  character: DEFAULT,
  setIdentity: () => {},
  applyDelta: () => {},
  replaceStatus: () => {},
  saveNow: async () => {},
});

export function CharacterProvider({ children, initial }: { children: React.ReactNode; initial?: Partial<CharacterState> }) {
  const logger = useActionLogger({ endpoint: "/api/chronicle/log" });
  const [character, setCharacter] = useState<CharacterState>(() => {
    try {
      const raw = localStorage.getItem("cronista_character");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CharacterState>;
        return {
          identity: { ...DEFAULT.identity, ...(parsed.identity ?? {}) },
          status: {
            ...DEFAULT.status,
            ...(parsed.status ?? {}),
            voluntad: { ...DEFAULT.status.voluntad, ...(parsed.status?.voluntad ?? {}) },
            daño: { ...DEFAULT.status.daño, ...(parsed.status?.daño ?? {}) },
          },
        };
      }
    } catch {
      // noop
    }
    return {
      identity: { ...DEFAULT.identity, ...(initial?.identity ?? {}) },
      status: {
        ...DEFAULT.status,
        ...(initial?.status ?? {}),
        voluntad: { ...DEFAULT.status.voluntad, ...(initial?.status?.voluntad ?? {}) },
        daño: { ...DEFAULT.status.daño, ...(initial?.status?.daño ?? {}) },
      },
    };
  });

  // Debounce de autosave a servidor (1.2s)
  const saveTimer = useRef<number | null>(null);
  const pendingSave = useRef<CharacterState | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("cronista_character", JSON.stringify(character));
    } catch {
      // noop
    }

    pendingSave.current = character;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      if (pendingSave.current) void saveCharacterToServer(pendingSave.current);
      pendingSave.current = null;
      saveTimer.current = null;
    }, 1200) as unknown as number;
  }, [character]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, []);

  const saveCharacterToServer = async (payload: CharacterState) => {
    try {
      await fetch("/api/character/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      logger.push("character_saved", { id: payload.identity.id ?? null });
    } catch (e) {
      logger.push("character_save_failed", { error: String(e) });
    }
  };

  const saveNow = async () => {
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    if (pendingSave.current) {
      await saveCharacterToServer(pendingSave.current);
      pendingSave.current = null;
      return;
    }
    await saveCharacterToServer(character);
  };

  const setIdentity = (i: Partial<CharacterIdentity>) => {
    setCharacter((c) => {
      const next = { ...c, identity: { ...c.identity, ...i } };
      logger.push("identity_update", { before: c.identity, after: next.identity });
      return next;
    });
  };

  const replaceStatus = (s: Partial<CharacterStatus>) => {
    setCharacter((c) => {
      const next = {
        ...c,
        status: {
          ...c.status,
          ...s,
          voluntad: { ...c.status.voluntad, ...(s.voluntad ?? {}) },
          daño: { ...c.status.daño, ...(s.daño ?? {}) },
        },
      };
      logger.push("status_replace", { before: c.status, after: next.status });
      return next;
    });
  };

  const applyDelta = (delta: Partial<{ ansia: number; voluntad: number; daño: number; px: number }>, note?: string) => {
    setCharacter((c) => {
      const next: CharacterState = {
        ...c,
        status: {
          ...c.status,
          voluntad: { ...c.status.voluntad },
          daño: { ...c.status.daño },
        },
      };
      if (typeof delta.ansia === "number") next.status.ansia = Math.max(0, Math.min(5, next.status.ansia + delta.ansia));
      if (typeof delta.voluntad === "number") {
        next.status.voluntad.current = Math.max(
          0,
          Math.min(next.status.voluntad.max, next.status.voluntad.current + delta.voluntad),
        );
      }
      if (typeof delta.daño === "number") {
        next.status.daño.current = Math.max(0, Math.min(next.status.daño.max, next.status.daño.current + delta.daño));
      }
      if (typeof delta.px === "number") next.status.px = (next.status.px ?? 0) + delta.px;
      logger.push("apply_delta", { delta, note: note ?? null, next: next.status });
      return next;
    });
  };

  return (
    <CharacterContext.Provider value={{ character, setIdentity, applyDelta, replaceStatus, saveNow }}>
      {children}
    </CharacterContext.Provider>
  );
}

export const useCharacter = () => useContext(CharacterContext);

