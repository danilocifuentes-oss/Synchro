import type { SoloChapter, SoloScene } from "@/lib/soloCampaign/types";
import { getChronicleDefinition, resolveChronicleChapterEntrySceneId } from "@/lib/soloCampaign/chronicleRegistry";

export const SOLO_CHAPTERS: SoloChapter[] = getChronicleDefinition().chapters;

export function resolveChapterEntrySceneId(chapterId: string, flags?: Record<string, boolean>): string | null {
  return resolveChronicleChapterEntrySceneId(chapterId, flags);
}

/** Compat API (legacy): conservar para no romper llamadas existentes. */
export function resolveChapter08EntrySceneId(flags?: Record<string, boolean>): string {
  return resolveChronicleChapterEntrySceneId("chapter08", flags) ?? "n8_0";
}

/** Compat API (legacy): conservar para no romper llamadas existentes. */
export function resolveChapter09EntrySceneId(flags?: Record<string, boolean>): string {
  return resolveChronicleChapterEntrySceneId("chapter09", flags) ?? "n9_0";
}

export function getSoloChapter(chapterId: string): SoloChapter | null {
  return SOLO_CHAPTERS.find((c) => c.id === chapterId) ?? null;
}

export function getSoloScene(chapterId: string, sceneId: string): SoloScene | null {
  const chapter = getSoloChapter(chapterId);
  if (!chapter) return null;
  return chapter.scenes.find((s) => s.id === sceneId) ?? null;
}
