import type { CharacterSheet } from "@/lib/character";
import { getSoloChapter, getSoloScene } from "@/lib/soloCampaign/chapters";
import { loadSoloProgress } from "@/lib/soloCampaign/progressStore";

export type SoloNexoDigest = {
  chapterTitle: string;
  sceneTitle: string;
  /** Narración base de la escena, sin transformaciones. */
  sceneLead: string;
  /** Textos de opciones elegidas recientemente (voz del jugador). */
  echoLines: string[];
};

function optionLabelForDecision(chapterId: string, sceneId: string, optionId: string): string | null {
  const scene = getSoloScene(chapterId, sceneId);
  const opt = scene?.options.find((o) => o.id === optionId);
  return opt?.text?.trim() ?? null;
}

/** Contexto diegético para paneles Nexo (Continuidad / bitácora) ligado al save de campaña solitaria. */
export function buildSoloNexoDigest(profileId: string, sheet: CharacterSheet): SoloNexoDigest | null {
  const prog = loadSoloProgress(profileId, sheet.clan);
  if (!prog) return null;

  const chapter = getSoloChapter(prog.chapterId);
  const scene = getSoloScene(prog.chapterId, prog.sceneId);
  const sceneLead = scene?.text ?? "";

  const echoLines: string[] = [];
  for (const d of prog.decisionHistory.slice(-5)) {
    const label = optionLabelForDecision(prog.chapterId, d.sceneId, d.optionId);
    if (label) echoLines.push(label);
  }

  return {
    chapterTitle: chapter?.title ?? prog.chapterId,
    sceneTitle: scene?.title ?? prog.sceneId,
    sceneLead,
    echoLines: echoLines.slice(-4),
  };
}
