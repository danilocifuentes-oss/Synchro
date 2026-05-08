import type { SoloProgress } from "./types";

export const SOLO_CHAPTER_PENDING_PREFIX = "chapter_pending_";

function chapterOrderKey(chapterId: string): number {
  const m = chapterId.match(/^chapter(\d+)$/i);
  if (!m) return Number.POSITIVE_INFINITY;
  return Number(m[1]);
}

export function getPendingNextChapter(progress: SoloProgress): string | null {
  const currentOrder = chapterOrderKey(progress.chapterId);
  const candidates: string[] = [];
  for (const [flag, enabled] of Object.entries(progress.flags ?? {})) {
    if (!enabled) continue;
    if (!flag.startsWith(SOLO_CHAPTER_PENDING_PREFIX)) continue;
    const target = flag.slice(SOLO_CHAPTER_PENDING_PREFIX.length);
    if (!target || target === progress.chapterId) continue;
    candidates.push(target);
  }
  if (!candidates.length) return null;
  /** Durante el epílogo (línea principal 7), no ofrecer salto al cap. paralelo 8 para no romper el veredicto. */
  const filtered =
    progress.chapterId === "chapter07" ? candidates.filter((id) => id !== "chapter08") : candidates;
  if (!filtered.length) return null;
  const future = filtered
    .map((id) => ({ id, order: chapterOrderKey(id) }))
    .filter((row) => Number.isFinite(row.order) && row.order > currentOrder)
    .sort((a, b) => a.order - b.order);
  if (future.length) return future[0].id;
  return filtered.sort((a, b) => a.localeCompare(b))[0] ?? null;
}
