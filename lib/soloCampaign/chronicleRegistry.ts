import type { ClanId } from "@/lib/character";
import type { SoloChapter } from "@/lib/soloCampaign/types";
import { chapter00 } from "@/lib/soloCampaign/chapters/chapter00";
import { chapter01 } from "@/lib/soloCampaign/chapters/chapter01";
import { chapter02 } from "@/lib/soloCampaign/chapters/chapter02";
import { chapter03 } from "@/lib/soloCampaign/chapters/chapter03";
import { chapter04 } from "@/lib/soloCampaign/chapters/chapter04";
import { chapter05 } from "@/lib/soloCampaign/chapters/chapter05";
import { chapter06 } from "@/lib/soloCampaign/chapters/chapter06";
import { chapter07 } from "@/lib/soloCampaign/chapters/chapter07";
import { chapter08 } from "@/lib/soloCampaign/chapters/chapter08";

export type ChronicleDefinition = {
  id: string;
  title: string;
  supportedClans: ClanId[];
  startChapterId: string;
  chapters: SoloChapter[];
  /** Resolver opcional para capítulos con entrada dinámica según banderas. */
  entryResolvers?: Record<string, (flags?: Record<string, boolean>) => string | null>;
};

function flagOn(flags: Record<string, boolean> | undefined, key: string): boolean {
  return flags?.[key] === true;
}

/**
 * Entrada por capítulo alineada con banderas `chapter_pending_*` y rutas paralelas.
 * `null` deja que la UI caiga en `startSceneId` del capítulo (ver `SoloCampaignApp`).
 */
export const TEMUCO_ARAUCANIA_ENTRY_RESOLVERS: NonNullable<ChronicleDefinition["entryResolvers"]> = {
  chapter01: (flags) => (flagOn(flags, "chapter_pending_chapter01") ? "c1_001" : null),
  chapter02: (flags) =>
    flagOn(flags, "chapter_pending_chapter02") && flagOn(flags, "valeria_invited") ? "c2_001" : null,
  chapter03: (flags) => (flagOn(flags, "chapter_pending_chapter03") ? "c3_001" : null),
  chapter04: (flags) => (flagOn(flags, "chapter_pending_chapter04") ? "c4_001" : null),
  chapter05: (flags) => (flagOn(flags, "chapter_pending_chapter05") ? "c5_001" : null),
  chapter06: (flags) => (flagOn(flags, "chapter_pending_chapter06") ? "c6_001" : null),
  chapter07: (flags) => (flagOn(flags, "chapter_pending_chapter07") ? "end_001" : null),
  /** Paralelos: `inquisition_diversion` solo aplica dentro del cap. 8; la entrada usa tierra o anarquía. */
  chapter08: (flags) =>
    flagOn(flags, "anarch_alliance") || flagOn(flags, "marked_by_earth") ? "side_001" : null,
};

const SHARED_CHAPTERS: SoloChapter[] = [
  chapter00,
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
  chapter06,
  chapter07,
  chapter08,
];

const DEFAULT_CHRONICLE: ChronicleDefinition = {
  id: "cronica-temuco-araucania",
  title: "Temuco: ceniza, Corte y tierra despierta",
  supportedClans: ["brujah", "ventrue", "toreador", "malkavian", "nosferatu", "tremere", "gangrel"],
  startChapterId: chapter00.id,
  chapters: SHARED_CHAPTERS,
  entryResolvers: TEMUCO_ARAUCANIA_ENTRY_RESOLVERS,
};

/** Crónica «Lluvia sobre Ceniza»: mismos capítulos TS; clanes ampliados; mismos resolutores de entrada. */
export const CHRONICLE_LLUVIA_SOBRE_CENIZA: ChronicleDefinition = {
  id: "lluvia-sobre-ceniza",
  title: "Lluvia sobre Ceniza",
  supportedClans: [
    "ventrue",
    "toreador",
    "gangrel",
    "malkavian",
    "nosferatu",
    "brujah",
    "tremere",
    "thin_blood",
    "caitiff",
    "other",
  ],
  /** Equivale al antiguo `chapter0` del manifiesto: en código es `chapter00`. */
  startChapterId: chapter00.id,
  chapters: SHARED_CHAPTERS,
  entryResolvers: TEMUCO_ARAUCANIA_ENTRY_RESOLVERS,
};

const CHRONICLE_REGISTRY: Record<string, ChronicleDefinition> = {
  [DEFAULT_CHRONICLE.id]: DEFAULT_CHRONICLE,
  [CHRONICLE_LLUVIA_SOBRE_CENIZA.id]: CHRONICLE_LLUVIA_SOBRE_CENIZA,
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
