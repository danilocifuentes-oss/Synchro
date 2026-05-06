import type { ClanId } from "@/lib/character";
import type { SoloChapter } from "@/lib/soloCampaign/types";
import { chapter01 } from "@/lib/soloCampaign/chapters/chapter01";
import { chapter02 } from "@/lib/soloCampaign/chapters/chapter02";
import { chapter03 } from "@/lib/soloCampaign/chapters/chapter03";
import { chapter04 } from "@/lib/soloCampaign/chapters/chapter04";
import { chapter05 } from "@/lib/soloCampaign/chapters/chapter05";
import { chapter06 } from "@/lib/soloCampaign/chapters/chapter06";
import { chapter07 } from "@/lib/soloCampaign/chapters/chapter07";
import { chapter08, resolveChapter08EntrySceneId } from "@/lib/soloCampaign/chapters/chapter08";
import { chapter09, resolveChapter09EntrySceneId } from "@/lib/soloCampaign/chapters/chapter09";
import { soloEpilogue } from "@/lib/soloCampaign/chapters/epilogue";

export type ChronicleDefinition = {
  id: string;
  title: string;
  supportedClans: ClanId[];
  startChapterId: string;
  chapters: SoloChapter[];
  /** Resolver opcional para capítulos con entrada dinámica según banderas. */
  entryResolvers?: Record<string, (flags?: Record<string, boolean>) => string>;
};

const DEFAULT_CHRONICLE: ChronicleDefinition = {
  id: "santiago-en-cenizas",
  title: "Santiago en Cenizas",
  supportedClans: ["brujah", "ventrue", "toreador", "malkavian"],
  startChapterId: chapter01.id,
  chapters: [chapter01, chapter02, chapter03, chapter04, chapter05, chapter06, chapter07, chapter08, chapter09, soloEpilogue],
  entryResolvers: {
    chapter08: resolveChapter08EntrySceneId,
    chapter09: resolveChapter09EntrySceneId,
  },
};

const CHRONICLE_REGISTRY: Record<string, ChronicleDefinition> = {
  [DEFAULT_CHRONICLE.id]: DEFAULT_CHRONICLE,
};

export const DEFAULT_CHRONICLE_ID = DEFAULT_CHRONICLE.id;

export function getChronicleDefinition(chronicleId = DEFAULT_CHRONICLE_ID): ChronicleDefinition {
  return CHRONICLE_REGISTRY[chronicleId] ?? DEFAULT_CHRONICLE;
}

export function listChronicles(): ChronicleDefinition[] {
  return Object.values(CHRONICLE_REGISTRY);
}

export function resolveChronicleChapterEntrySceneId(
  chapterId: string,
  flags?: Record<string, boolean>,
  chronicleId = DEFAULT_CHRONICLE_ID,
): string | null {
  const chronicle = getChronicleDefinition(chronicleId);
  const chapter = chronicle.chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;
  const dynamic = chronicle.entryResolvers?.[chapterId];
  return dynamic ? dynamic(flags) : chapter.startSceneId;
}
