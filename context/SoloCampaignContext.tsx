"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import { getSoloChapter } from "@/lib/soloCampaign/chapters";
import { saveSoloProgress } from "@/lib/soloCampaign/progressStore";
import type { SoloProgress } from "@/lib/soloCampaign/types";

/** +1 = avanza como pasar página (entra por la derecha); -1 = vuelve página (entra por la izquierda). */
export type SoloSceneSlideDirection = 1 | -1;
const SOLO_NAV_STACK_LIMIT = 120;

type CombinedState = {
  progress: SoloProgress;
  transitionSlide: SoloSceneSlideDirection;
};

type Action =
  | { type: "patch"; progress: SoloProgress }
  | { type: "navigate"; progress: SoloProgress; slide: SoloSceneSlideDirection }
  | { type: "jumpToScene"; sceneId: string };

function reducer(state: CombinedState, action: Action): CombinedState {
  switch (action.type) {
    case "patch":
      saveSoloProgress(action.progress);
      return { ...state, progress: action.progress };
    case "navigate":
      saveSoloProgress(action.progress);
      return { progress: action.progress, transitionSlide: action.slide };
    case "jumpToScene": {
      const prev = state.progress;
      const ch = getSoloChapter(prev.chapterId);
      if (!ch?.scenes.some((s) => s.id === action.sceneId)) return state;
      if (prev.sceneId === action.sceneId) return state;
      const oldIdx = ch.scenes.findIndex((s) => s.id === prev.sceneId);
      const newIdx = ch.scenes.findIndex((s) => s.id === action.sceneId);
      const slide: SoloSceneSlideDirection =
        oldIdx >= 0 && newIdx >= 0 ? (newIdx > oldIdx ? 1 : newIdx < oldIdx ? -1 : 1) : 1;
      const next: SoloProgress = {
        ...prev,
        sceneId: action.sceneId,
        updatedAt: Date.now(),
        visitedSceneIds: Array.from(new Set([...(prev.visitedSceneIds ?? []), action.sceneId])),
        soloSceneBackStack: [...(prev.soloSceneBackStack ?? []), { chapterId: prev.chapterId, sceneId: prev.sceneId }].slice(
          -SOLO_NAV_STACK_LIMIT,
        ),
        soloSceneForwardStack: [],
      };
      saveSoloProgress(next);
      return { progress: next, transitionSlide: slide };
    }
    default:
      return state;
  }
}

type SoloCampaignCtx = {
  progress: SoloProgress;
  transitionSlide: SoloSceneSlideDirection;
  /** Actualiza progreso sin animación de cambio de escena (preludio, flags, vitales…). */
  patchProgress: (next: SoloProgress) => void;
  /** Cambio de escena con dirección de slide (libro). */
  navigateProgress: (next: SoloProgress, slide: SoloSceneSlideDirection) => void;
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
  const [state, dispatch] = useReducer(reducer, initialProgress, (p): CombinedState => ({
    progress: p,
    transitionSlide: 1,
  }));

  const patchProgress = useCallback((next: SoloProgress) => {
    dispatch({ type: "patch", progress: next });
  }, []);

  const navigateProgress = useCallback((next: SoloProgress, slide: SoloSceneSlideDirection) => {
    dispatch({ type: "navigate", progress: next, slide });
  }, []);

  const jumpToScene = useCallback((sceneId: string) => {
    dispatch({ type: "jumpToScene", sceneId });
  }, []);

  const value = useMemo(
    () => ({
      progress: state.progress,
      transitionSlide: state.transitionSlide,
      patchProgress,
      navigateProgress,
      jumpToScene,
    }),
    [state.progress, state.transitionSlide, patchProgress, navigateProgress, jumpToScene],
  );

  return <SoloCampaignContext.Provider value={value}>{children}</SoloCampaignContext.Provider>;
}

export function useSoloCampaign() {
  const ctx = useContext(SoloCampaignContext);
  if (!ctx) throw new Error("useSoloCampaign fuera de SoloCampaignProvider");
  return ctx;
}
