"use client";

import { useMemo } from "react";
import { getSoloChapter, SOLO_CHAPTERS } from "@/lib/soloCampaign/chapters";
import { useSoloCampaign } from "@/context/SoloCampaignContext";

/** Lista el capítulo actual y permite saltar de escena (ediciones / QA de texto). */
export function SoloSceneNav() {
  const { progress, jumpToScene } = useSoloCampaign();
  const chapter = useMemo(() => getSoloChapter(progress.chapterId), [progress.chapterId]);
  if (!chapter?.scenes.length) return null;
  const maxPlayedIdx = Math.max(
    0,
    ...chapter.scenes
      .map((s, idx) => ((progress.visitedSceneIds ?? []).includes(s.id) ? idx : -1))
      .filter((idx) => idx >= 0),
  );
  const currentIdx = chapter.scenes.findIndex((s) => s.id === progress.sceneId);
  const allowedScenes = chapter.scenes.slice(0, Math.max(maxPlayedIdx + 1, currentIdx + 1));
  const canGoPrev = currentIdx > 0;
  const canGoNext = currentIdx >= 0 && currentIdx < allowedScenes.length - 1;
  const chapterOrder = useMemo(
    () => new Map(SOLO_CHAPTERS.map((c, idx) => [c.id, idx])),
    [],
  );
  const currentChapterOrder = chapterOrder.get(progress.chapterId) ?? -1;
  const jumpOptions = useMemo(() => {
    return SOLO_CHAPTERS.flatMap((chap) => {
      const chapOrder = chapterOrder.get(chap.id) ?? -1;
      if (chapOrder < 0 || chapOrder > currentChapterOrder) return [];
      const chapterStartIdx = chap.scenes.findIndex((s) => s.id === chap.startSceneId);
      const maxVisitedIdx = Math.max(
        -1,
        ...chap.scenes
          .map((s, idx) => ((progress.visitedSceneIds ?? []).includes(s.id) ? idx : -1))
          .filter((idx) => idx >= 0),
      );
      const currentSceneIdx = chap.id === progress.chapterId
        ? chap.scenes.findIndex((s) => s.id === progress.sceneId)
        : -1;
      const guaranteedStartIdx = chapOrder < currentChapterOrder ? Math.max(chapterStartIdx, 0) : -1;
      const maxAllowedIdx = Math.max(maxVisitedIdx, currentSceneIdx, guaranteedStartIdx);
      if (maxAllowedIdx < 0) return [];
      return chap.scenes.slice(0, maxAllowedIdx + 1).map((s) => ({
        chapterId: chap.id,
        chapterTitle: chap.title,
        scene: s,
      }));
    });
  }, [chapterOrder, currentChapterOrder, progress.chapterId, progress.sceneId, progress.visitedSceneIds]);

  return (
    <section className="space-y-2 border-t border-white/[0.06] pt-3" aria-label="Navegación de escenas">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            if (!canGoPrev) return;
            jumpToScene(chapter.scenes[currentIdx - 1].id);
          }}
          disabled={!canGoPrev}
          className="rounded border border-white/[0.12] bg-black/55 px-2 py-2 text-[9px] uppercase tracking-[0.14em] text-neutral-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Retroceder
        </button>
        <button
          type="button"
          onClick={() => {
            if (!canGoNext) return;
            jumpToScene(chapter.scenes[currentIdx + 1].id);
          }}
          disabled={!canGoNext}
          className="rounded border border-white/[0.12] bg-black/55 px-2 py-2 text-[9px] uppercase tracking-[0.14em] text-neutral-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Avanzar →
        </button>
      </div>
      <label className="sr-only" htmlFor="solo-scene-jump">
        Ir a escena
      </label>
      <select
        id="solo-scene-jump"
        value={progress.sceneId}
        onChange={(e) => jumpToScene(e.target.value)}
        className="w-full max-w-full rounded border border-white/[0.12] bg-black/60 py-2 pl-2 pr-8 font-mono text-[10px] uppercase tracking-wide text-neutral-200 outline-none focus:border-[color:var(--terminal)]/45"
      >
        {jumpOptions.map(({ chapterId, chapterTitle, scene }) => (
          <option key={scene.id} value={scene.id}>
            [{chapterId.replace("chapter", "Cap. ")}] {scene.title || chapterTitle}
          </option>
        ))}
      </select>
      <p className="text-[7px] leading-snug text-neutral-600">
        Puedes saltar entre escenas ya jugadas, incluso de capítulos previos.
      </p>
    </section>
  );
}
