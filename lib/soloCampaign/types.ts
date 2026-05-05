import type { CharacterSheet, ClanId } from "@/lib/character";
import type { DisciplineKey } from "@/lib/sereno";

export type SoloRouteId = "main" | "q" | "w" | "e" | "r";
export type SoloEndingId = "endingA" | "endingB" | "endingC" | "endingD";

export type SoloRequirement =
  | { type: "none" }
  | { type: "clan"; clan: ClanId }
  | { type: "discipline"; discipline: DisciplineKey; minLevel: number }
  | { type: "skill"; skill: string; minLevel: number }
  | { type: "attribute"; attribute: keyof CharacterSheet["attributes"]; minLevel: number }
  /** Humanidad actual del progreso de crónica (V5 típico 7–10 = «alta»). */
  | { type: "humanityMin"; min: number }
  | { type: "flag"; flag: string; equals?: boolean }
  | { type: "route"; route: SoloRouteId | SoloRouteId[] }
  | { type: "stateTag"; tag: string }
  | { type: "any"; requirements: SoloRequirement[] }
  | { type: "all"; requirements: SoloRequirement[] }
  | { type: "not"; requirement: SoloRequirement };

export type SoloOptionType = "dialogue" | "discipline" | "skill" | "clan";

export type SoloSceneEffect =
  | { type: "setFlag"; flag: string; value?: boolean }
  | { type: "hungerDelta"; delta: number }
  | { type: "humanityDelta"; delta: number }
  | { type: "reputationDelta"; delta: number }
  /** Daño a integridad física (positivo = más herido; negativo = recupera cajones). Tope alineado con HUD Nexo (7). */
  | { type: "healthDamageDelta"; delta: number }
  /** Fuerza de voluntad actual (no supera máximo de ficha). */
  | { type: "willpowerDelta"; delta: number }
  /** Experiencia de crónica (PX narrativos, acumulados en `SoloProgress.chronicleExperience`). */
  | { type: "experienceDelta"; delta: number }
  | { type: "setRoute"; route: SoloRouteId }
  | { type: "addStateTag"; tag: string }
  | { type: "removeStateTag"; tag: string }
  | { type: "setEnding"; endingId: SoloEndingId }
  | { type: "fatalOutcome"; id: string; title: string; body: string }
  | { type: "log"; text: string };

export type SoloOption = {
  id: string;
  type: SoloOptionType;
  text: string;
  disciplineTitle?: string;
  textByDisciplineLevel?: Record<number, string>;
  requirement: SoloRequirement;
  nextSceneId: string;
  /** Rama opcional cuando la tirada falla (si no existe, usa nextSceneId). */
  nextSceneIdOnFail?: string;
  /** Rama opcional en crítico limpio/manchado (si no existe, usa nextSceneId). */
  nextSceneIdOnCritical?: string;
  discipline?: DisciplineKey;
  skill?: string;
  clan?: ClanId;
  /** Si existe, la opción se muestra sólo cuando se cumpla este requisito. */
  visibilityRequirement?: SoloRequirement;
  /** Sugerencia narrativa para rutas/bloqueos futuros. */
  unlockHint?: string;
  effects?: SoloSceneEffect[];
  effectsOnFail?: SoloSceneEffect[];
  effectsOnCritical?: SoloSceneEffect[];
  /**
   * PX de crónica si la tirada asociada a esta opción tiene éxito.
   * Omitir para usar `CHRONICLE_XP_ROLL_SUCCESS_DEFAULT` en mecánica global.
   */
  experienceOnSuccessfulRoll?: number;
};

export type SoloScene = {
  id: string;
  chapterId: string;
  title: string;
  text: string;
  /**
   * Párrafos que se anteponen al `text` cuando el requisito se cumple (orden del arreglo).
   * Útil para inserciones de llegada antes del cuerpo común de la escena.
   */
  contextLeadInByState?: readonly { requirement: SoloRequirement; text: string }[];
  /**
   * Párrafos adicionales (tras `text`) cuando `progress.flags[flag]` ya es true — hooks entre capítulos sin duplicar escenas enteras.
   */
  flagAppends?: readonly { flag: string; text: string }[];
  /** Variante contextual por estado persistido (rutas y consecuencias acumuladas). */
  contextVariantByState?: readonly { requirement: SoloRequirement; text: string }[];
  clanFlavor?: Partial<Record<ClanId, string>>;
  options: SoloOption[];
};

export type SoloChapter = {
  id: string;
  title: string;
  description: string;
  startSceneId: string;
  scenes: SoloScene[];
};

export type SoloProgress = {
  version: 1;
  profileId: string;
  playerName: string;
  clan: ClanId;
  humanity: number;
  reputation: number;
  /** Experiencia ganada en campaña solitaria (tiradas, hitos); independiente del pool de compra del Codex. */
  chronicleExperience: number;
  chapterId: string;
  sceneId: string;
  activeRoute?: SoloRouteId;
  stateTags?: string[];
  endingId?: SoloEndingId | null;
  fatalOutcome?: { id: string; title: string; body: string } | null;
  /** Campo legado; reservado para migraciones de progreso. */
  chroniclePreludeSeenVersion?: number;
  /** Campo legado; reservado para migraciones de progreso. */
  chronicleClanPresentationSeenVersion?: number;
  /** Campo legado; reservado para migraciones de progreso. */
  chapterContextSeen?: Record<string, number>;
  flags: Record<string, boolean>;
  visitedSceneIds: string[];
  /**
   * Pila temporal (QA): posición antes de cada avance manual de escena, para poder retroceder.
   */
  soloSceneBackStack?: { chapterId: string; sceneId: string }[];
  decisionHistory: {
    sceneId: string;
    optionId: string;
    routeAtDecision?: SoloRouteId;
    ts: number;
    rollSummary?: string;
    rollPassed?: boolean;
  }[];
  updatedAt: number;
};
