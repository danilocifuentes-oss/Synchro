"use client";

import { useMemo } from "react";
import { getSoloChapter } from "@/lib/soloCampaign/chapters";
import { useSoloCampaign } from "@/context/SoloCampaignContext";

/** Lista el capítulo actual y permite saltar de escena (ediciones / QA de texto). */
export function SoloSceneNav() {
  const { progress, jumpToScene } = useSoloCampaign();
  const chapter = useMemo(() => getSoloChapter(progress.chapterId), [progress.chapterId]);
  if (!chapter?.scenes.length) return null;

  return (
    <section className="space-y-2 border-t border-white/[0.06] pt-3" aria-label="Navegación de escenas">
      <p className="text-[9px] uppercase tracking-[0.22em] text-neutral-600">Escenas · capítulo</p>
      <p className="truncate font-sans text-[10px] leading-snug text-neutral-500" title={chapter.title}>
        {chapter.title}
      </p>
      <label className="sr-only" htmlFor="solo-scene-jump">
        Ir a escena
      </label>
      <select
        id="solo-scene-jump"
        value={progress.sceneId}
        onChange={(e) => jumpToScene(e.target.value)}
        className="w-full max-w-full rounded border border-white/[0.12] bg-black/60 py-2 pl-2 pr-8 font-mono text-[10px] uppercase tracking-wide text-neutral-200 outline-none focus:border-[color:var(--terminal)]/45"
      >
        {chapter.scenes.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>
      <p className="text-[7px] leading-snug text-neutral-600">
        Salto dentro del mismo capítulo; no altera flags guardados.
      </p>
    </section>
  );
}
