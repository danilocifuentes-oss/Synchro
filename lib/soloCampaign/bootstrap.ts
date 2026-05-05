import type { CharacterSheet, ClanId } from "@/lib/character";
import { loadSoloProgress, saveSoloProgress } from "@/lib/soloCampaign/progressStore";
import type { SoloProgress } from "@/lib/soloCampaign/types";

export const SOLO_SUPPORTED_CLANS: ClanId[] = ["brujah", "ventrue", "toreador", "malkavian"];

export function isSoloSupportedClan(clan: ClanId): boolean {
  return SOLO_SUPPORTED_CLANS.includes(clan);
}

function startSceneForClan(): string {
  return "n1_1";
}

/** Garantiza un `SoloProgress` persistido para perfil + clan (usado al montar el Nexo en SOL). */
export function ensureSoloProgress(profileId: string, sheet: CharacterSheet): SoloProgress {
  const startSceneId = startSceneForClan();
  const existing = loadSoloProgress(profileId, sheet.clan);
  if (existing) return existing;

  /** No crear save nuevo para linajes sin crónica (evita basura en localStorage); solo objeto en memoria para hooks. */
  if (!isSoloSupportedClan(sheet.clan)) {
    return {
      version: 1,
      profileId,
      playerName: sheet.name?.trim() || "Sin nombre",
      clan: sheet.clan,
      humanity: sheet.humanity,
      reputation: 0,
      chronicleExperience: 0,
      chapterId: "chapter01",
      sceneId: startSceneId,
      activeRoute: "main",
      stateTags: [],
      endingId: null,
      fatalOutcome: null,
      chroniclePreludeSeenVersion: 0,
      chapterContextSeen: {},
      chronicleClanPresentationSeenVersion: 0,
      flags: { clan_intro_seen: false },
      visitedSceneIds: [startSceneId],
      soloSceneBackStack: [],
      decisionHistory: [],
      updatedAt: Date.now(),
    };
  }

  const base: SoloProgress = {
    version: 1,
    profileId,
    playerName: sheet.name?.trim() || "Sin nombre",
    clan: sheet.clan,
    humanity: sheet.humanity,
    reputation: 0,
    chronicleExperience: 0,
    chapterId: "chapter01",
    sceneId: startSceneId,
    activeRoute: "main",
    stateTags: [],
    endingId: null,
    fatalOutcome: null,
    chroniclePreludeSeenVersion: 0,
    chapterContextSeen: {},
    chronicleClanPresentationSeenVersion: 0,
    flags: { clan_intro_seen: false },
    visitedSceneIds: [startSceneId],
    soloSceneBackStack: [],
    decisionHistory: [],
    updatedAt: Date.now(),
  };
  saveSoloProgress(base);
  return base;
}
