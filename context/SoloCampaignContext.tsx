"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getSoloChapter } from "@/lib/soloCampaign/chapters";
import { saveSoloProgress } from "@/lib/soloCampaign/progressStore";
import type { SoloProgress } from "@/lib/soloCampaign/types";

type SoloCampaignCtx = {
  progress: SoloProgress;
  setProgress: (next: SoloProgress) => void;
  /** Salto directo a otra escena del capítulo actual (revisión de texto / corrección). */
  jumpToScene: (sceneId: string) => void;
};

const SoloCampaignContext = createContext<SoloCampaignCtx | null>(null);

export function SoloCampaignProvider({
  initialProgress,
  children,
}: {
  initialProgress: SoloProgress;
  children: ReactNode;
}) {
  const [progress, setProgressState] = useState<SoloProgress>(initialProgress);

  const jumpToScene = useCallback((sceneId: string) => {
    setProgressState((prev) => {
      const ch = getSoloChapter(prev.chapterId);
      if (!ch?.scenes.some((s) => s.id === sceneId)) return prev;
      const next: SoloProgress = {
        ...prev,
        sceneId,
        updatedAt: Date.now(),
        visitedSceneIds: Array.from(new Set([...(prev.visitedSceneIds ?? []), sceneId])),
      };
      saveSoloProgress(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      progress,
      setProgress: setProgressState,
      jumpToScene,
    }),
    [progress, jumpToScene],
  );
  return <SoloCampaignContext.Provider value={value}>{children}</SoloCampaignContext.Provider>;
}

export function useSoloCampaign() {
  const ctx = useContext(SoloCampaignContext);
  if (!ctx) throw new Error("useSoloCampaign fuera de SoloCampaignProvider");
  return ctx;
}
