"use client";

import { useMemo } from "react";
import { soloChapterHeadlineForClan } from "@/lib/soloCampaign/chronicleMechanics";
import { getSoloChapter } from "@/lib/soloCampaign/chapters";
import { useSoloCampaign } from "@/context/SoloCampaignContext";

/** Lista el capítulo actual y permite saltar de escena (ediciones / QA de texto). */
export function SoloSceneNav() {
  const { progress, jumpToScene } = useSoloCampaign();
  const chapter = useMemo(() => getSoloChapter(progress.chapterId), [progress.chapterId]);
  const headline = chapter ? soloChapterHeadlineForClan(chapter.title, progress.clan) : "";
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

  return (
    <section className="space-y-2 border-t border-white/[0.06] pt-3" aria-label="Navegación de escenas">
      <p className="text-[9px] uppercase tracking-[0.22em] text-neutral-600">Escenas · capítulo</p>
      <p className="truncate font-sans text-[10px] leading-snug text-neutral-500" title={headline}>
        {headline}
      </p>
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
        {allowedScenes.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>
      <p className="text-[7px] leading-snug text-neutral-600">
        Navegación acotada entre primera y última escena ya jugadas.
      </p>
    </section>
  );
}
