import type { SoloChapter, SoloScene } from "@/lib/soloCampaign/types";
import { getChronicleDefinition, resolveChronicleChapterEntrySceneId } from "@/lib/soloCampaign/chronicleRegistry";

export const SOLO_CHAPTERS: SoloChapter[] = getChronicleDefinition().chapters;

export function resolveChapterEntrySceneId(chapterId: string, flags?: Record<string, boolean>): string | null {
  return resolveChronicleChapterEntrySceneId(chapterId, flags);
}

export function getSoloChapter(chapterId: string): SoloChapter | null {
  return SOLO_CHAPTERS.find((c) => c.id === chapterId) ?? null;
}

export function getSoloScene(chapterId: string, sceneId: string): SoloScene | null {
  const chapter = getSoloChapter(chapterId);
  if (!chapter) return null;
  return chapter.scenes.find((s) => s.id === sceneId) ?? null;
}
