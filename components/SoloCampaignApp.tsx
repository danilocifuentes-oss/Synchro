"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CharacterSheet, ClanId } from "@/lib/character";
import { CLAN_OPTIONS } from "@/lib/character";
import { disciplineLabel } from "@/lib/sereno";
import { ensureSoloProgress, isSoloSupportedClan } from "@/lib/soloCampaign/bootstrap";
import {
  getSoloChapter,
  getSoloScene,
  resolveChapterEntrySceneId,
} from "@/lib/soloCampaign/chapters";
import { checkOptionAvailability, listFailReasons, resolveSoloScenePlayerText } from "@/lib/soloCampaign/requirementEngine";
import { listPlayerVisibleSoloOptions } from "@/lib/soloCampaign/optionPresentation";
import { saveSheet } from "@/lib/character";
import type { SoloEndingId, SoloOption, SoloProgress, SoloRouteId, SoloSceneEffect } from "@/lib/soloCampaign/types";
import { parseOptionIaPanels, parseSceneIaPanels } from "@/lib/soloCampaign/soloIaPresentation";
import { getPendingNextChapter } from "@/lib/soloCampaign/soloProgressSelectors";
import { syncActiveBundleFromGlobals } from "@/lib/profileStore";
import { IconBook, IconTerminal } from "@/components/icons";
import SoloCampaignHeader from "@/components/SoloCampaignHeader";
import { SoloCampaignProvider, useSoloCampaign } from "@/context/SoloCampaignContext";
import { rollPoolV5, summarizeRollPlayerLog } from "@/lib/dice";
import { appendXpLog } from "@/lib/sessionMeta";
import {
  CHRONICLE_HEALTH_TRACK_UI,
  CHRONICLE_XP_CRITICAL_EXTRA,
  CHRONICLE_XP_ROLL_SUCCESS_DEFAULT,
  soloChapterHeadlineForClan,
} from "@/lib/soloCampaign/chronicleMechanics";
import { getChronicleDefinition } from "@/lib/soloCampaign/chronicleRegistry";
import {
  applyDisciplineRouseFromRoll,
  isDisciplineRollOption,
  soloOptionUsesDice,
} from "@/lib/soloCampaign/rollResourceCost";

const SOLO_BACK_STACK_LIMIT = 120;

const SOLO_ENDING_DISPLAY: Partial<Record<SoloEndingId, string>> = {
  ending_flourish: "Imperio vegetal",
  ending_resist: "Ceniza humana (legacy)",
  ending_resist_high: "Redención verde",
  ending_resist_low: "Príncipe herido",
  ending_seed: "Semilla errante",
  ending_throne: "Trono de zinc",
  ending_abyss: "Árbol de los Olvidados",
  ending_gangrel: "Hijo de la tierra",
  ending_purge: "Purga verde",
  endingA: "Final A",
  endingB: "Final B",
  endingC: "Final C",
  endingD: "Final D",
};

function formatSoloEndingDisplay(id: SoloEndingId | null): string {
  if (!id) return "";
  return SOLO_ENDING_DISPLAY[id] ?? id.replace(/^ending_/g, "").replace(/_/g, " ");
}

/** Texto legible para `chapter_pending_*` (evita "CONTINUAR EN CHAPTER03"). */
function pendingChapterButtonLabel(chapterId: string): string {
  const m = /^chapter(\d+)$/i.exec(chapterId);
  if (m) {
    const n = Number(m[1]);
    if (n === 7) return "Epílogo";
    if (n === 8) return "Paralelos";
    return `Capítulo ${n}`;
  }
  if (chapterId === "epilogue") return "Epílogo";
  return chapterId.replace(/_/g, " ");
}

function compactChapterRibbon(rawTitle: string, chapterId: string): string {
  const chronicleName = getChronicleDefinition().title;
  const chapterFromId = /^chapter0*(\d+)$/i.exec(chapterId)?.[1] ?? "?";
  const parsed = /CAP[ÍI]TULO\s+(\d+)\s*:\s*([^·]+)/i.exec(rawTitle);
  if (!parsed) return `${chronicleName} · Capítulo ${chapterFromId}`;
  const chapterNumber = parsed[1];
  const chapterName = parsed[2].replace(/\s*\([^)]*\)\s*$/g, "").trim();
  return `${chronicleName} · Capítulo ${chapterNumber} · ${chapterName}`;
}

function sumReputationDeltas(list: SoloOption["effects"]): number {
  if (!list?.length) return 0;
  return list.reduce((acc, e) => (e.type === "reputationDelta" ? acc + e.delta : acc), 0);
}

function partitionExperienceEffects(branchEffects: SoloSceneEffect[]): { sheetFx: SoloSceneEffect[]; xpFromNarrative: number } {
  let xpFromNarrative = 0;
  const sheetFx: SoloSceneEffect[] = [];
  for (const e of branchEffects) {
    if (e.type === "experienceDelta") xpFromNarrative += e.delta;
    else if (e.type === "fragmentationDelta") continue;
    else sheetFx.push(e);
  }
  return { sheetFx, xpFromNarrative };
}

const CLAN_TONE: Partial<Record<ClanId, string>> = {
  malkavian: "text-cyan-200",
  ventrue: "text-amber-200",
  brujah: "text-orange-200",
  toreador: "text-rose-200",
  nosferatu: "text-emerald-200",
  tremere: "text-indigo-200",
};

type Props = {
  profileId: string;
  sheet: CharacterSheet;
  onExit: () => void;
  /** Tras persistir la ficha (Codex V) desde la campaña, actualiza Nexo/React (nombre, vitae, etc.). */
  onSheetSynced?: (next: CharacterSheet) => void;
  /** Incrustado en el marco Nexo (canal + digest): sin segunda columna de estado duplicada. */
  embedded?: boolean;
  /** Inyecta texto al hilo paralelo del SchreckNet (eco narrativo). */
  emitParalelaNarration?: (text: string) => void;
  /** El `SoloCampaignProvider` ya envuelve el marco (barra lateral + canal); no duplicar. */
  providerWrapped?: boolean;
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Opción de disciplina con tirada: el jugador puede elegir d10 o −1 Voluntad (sin subir Ansia por Despertar) si tiene cajas. */
function needsDespertarChoice(option: SoloOption, sheet: CharacterSheet): boolean {
  return isDisciplineRollOption(option) && soloOptionUsesDice(option) && sheet.willpowerCur >= 1;
}

type SoloCommitDraft = {
  option: SoloOption;
  sheetBeforeDecision: CharacterSheet;
  /** Resultado del Despertar (solo disciplinas con dados). */
  disciplineActivationHint?: "rouse_ansia" | "rouse_estable" | "rouse_willpower";
  rollLine: string;
  rollPassed: boolean;
  targetSceneId: string;
  branchEffects: SoloSceneEffect[];
  nextSheet: CharacterSheet;
  nextFlags: Record<string, boolean>;
  chronicleXpThisChoice: number;
  reputationGain: number;
  nextActiveRoute: SoloRouteId;
  nextStateTags: string[];
  nextEndingId: SoloEndingId | null;
  nextFatalOutcome: SoloProgress["fatalOutcome"];
  nextSceneId: string;
  nextFragmentation: number;
};

/** Resuelve mecánica y banderas sin persistir (segundo clic aplica efectos visibles). */
function buildSoloCommitDraft(
  option: SoloOption,
  sheet: CharacterSheet,
  progress: SoloProgress,
  /** Solo aplica a disciplinas con tirada: `willpower` gasta 1 caja y no tira Despertar. */
  rouseResolution?: "roll" | "willpower",
): SoloCommitDraft {
  let nextSheet = sheet;
  const nextFlags = { ...progress.flags };
  let rollLine: string;
  let rollPassed = true;
  let targetSceneId = option.nextSceneId;
  let branchEffects: SoloSceneEffect[];
  let rollXpEarned = 0;
  let xpFromNarrative = 0;

  let disciplineActivationHint: "rouse_ansia" | "rouse_estable" | "rouse_willpower" | undefined;

  if (soloOptionUsesDice(option)) {
    let rouseLead = "";
    if (isDisciplineRollOption(option)) {
      const payWillpower = rouseResolution === "willpower" && sheet.willpowerCur >= 1;
      if (payWillpower) {
        nextSheet = {
          ...nextSheet,
          willpowerCur: clamp(nextSheet.willpowerCur - 1, 0, nextSheet.willpowerMax),
        };
        disciplineActivationHint = "rouse_willpower";
        rouseLead = "Despertar: −1 Voluntad · sangre estable (sin subir Ansia) · ";
      } else {
        const rouse = applyDisciplineRouseFromRoll(nextSheet);
        nextSheet = rouse.sheet;
        disciplineActivationHint = rouse.hungerIncreased ? "rouse_ansia" : "rouse_estable";
        rouseLead = rouse.hungerIncreased
          ? `Despertar d10: ${rouse.die} · Ansia +1 · `
          : `Despertar d10: ${rouse.die} · Sin subir Ansia · `;
      }
    }

    const rollPlan = resolveSoloRollPlan(option, nextSheet);
    const roll = rollPoolV5(rollPlan.pool, nextSheet.hunger, rollPlan.difficulty);
    rollLine = `${rouseLead}${rollPlan.label} · ${summarizeRollPlayerLog(roll)}`;
    rollPassed = roll.passed;
    const isCritical = roll.criticalNormal || roll.messyCritical;
    branchEffects = roll.passed
      ? isCritical
        ? [...(option.effects ?? []), ...(option.effectsOnCritical ?? [])]
        : option.effects ?? []
      : [...(option.effects ?? []), ...(option.effectsOnFail ?? [])];
    const partRoll = partitionExperienceEffects(branchEffects);
    xpFromNarrative = partRoll.xpFromNarrative;
    for (const effect of partRoll.sheetFx) {
      nextSheet = applySceneEffectDraft(nextSheet, nextFlags, effect);
    }
    if (rollPassed) {
      rollXpEarned = option.experienceOnSuccessfulRoll ?? CHRONICLE_XP_ROLL_SUCCESS_DEFAULT;
      if (isCritical) rollXpEarned += CHRONICLE_XP_CRITICAL_EXTRA;
    }
    if (!roll.passed) {
      nextFlags[`roll_fail_${option.id}`] = true;
      if (roll.fracasoBestial) {
        nextSheet = { ...nextSheet, humanity: Math.max(0, Math.min(10, nextSheet.humanity - 1)) };
      }
    } else if (isCritical) {
      nextFlags[`roll_crit_${option.id}`] = true;
    }
    targetSceneId = !roll.passed
      ? option.nextSceneIdOnFail ?? option.nextSceneId
      : isCritical
        ? option.nextSceneIdOnCritical ?? option.nextSceneId
        : option.nextSceneId;
  } else {
    rollLine = "Elección directa";
    branchEffects = option.effects ?? [];
    const partDlg = partitionExperienceEffects(branchEffects);
    xpFromNarrative = partDlg.xpFromNarrative;
    for (const effect of partDlg.sheetFx) {
      nextSheet = applySceneEffectDraft(nextSheet, nextFlags, effect);
    }
  }

  const chronicleXpThisChoice = xpFromNarrative + rollXpEarned;
  const nextScene = getSoloScene(progress.chapterId, targetSceneId);
  const nextSceneId = nextScene?.id ?? progress.sceneId;
  const reputationGain = sumReputationDeltas(branchEffects);
  let nextActiveRoute: SoloRouteId = progress.activeRoute ?? "main";
  let nextStateTags = [...(progress.stateTags ?? [])];
  let nextEndingId: SoloEndingId | null = progress.endingId ?? null;
  let nextFatalOutcome = progress.fatalOutcome ?? null;
  for (const effect of branchEffects) {
    if (effect.type === "setRoute") nextActiveRoute = effect.route;
    if (effect.type === "addStateTag" && !nextStateTags.includes(effect.tag)) nextStateTags.push(effect.tag);
    if (effect.type === "removeStateTag") nextStateTags = nextStateTags.filter((t) => t !== effect.tag);
    if (effect.type === "setEnding") nextEndingId = effect.endingId;
    if (effect.type === "fatalOutcome") nextFatalOutcome = { id: effect.id, title: effect.title, body: effect.body };
  }

  let fragDelta = 0;
  for (const effect of branchEffects) {
    if (effect.type === "fragmentationDelta") fragDelta += effect.delta;
  }
  const nextFragmentation = clamp((progress.fragmentation ?? 0) + fragDelta, 0, 10);

  return {
    option,
    sheetBeforeDecision: sheet,
    disciplineActivationHint,
    rollLine,
    rollPassed,
    targetSceneId,
    branchEffects,
    nextSheet,
    nextFlags,
    chronicleXpThisChoice,
    reputationGain,
    nextActiveRoute,
    nextStateTags,
    nextEndingId,
    nextFatalOutcome,
    nextSceneId,
    nextFragmentation,
  };
}

function applySceneEffectDraft(base: CharacterSheet, flags: Record<string, boolean>, effect: NonNullable<SoloOption["effects"]>[number]) {
  let next = base;
  if (effect.type === "setFlag") flags[effect.flag] = effect.value ?? true;
  if (effect.type === "hungerDelta") {
    next = { ...next, hunger: Math.max(0, Math.min(5, next.hunger + effect.delta)) };
  }
  if (effect.type === "humanityDelta") {
    next = { ...next, humanity: Math.max(0, Math.min(10, next.humanity + effect.delta)) };
  }
  if (effect.type === "healthDamageDelta") {
    const cap = CHRONICLE_HEALTH_TRACK_UI;
    next = {
      ...next,
      healthDamage: Math.max(0, Math.min(cap, next.healthDamage + effect.delta)),
    };
  }
  if (effect.type === "willpowerDelta") {
    next = {
      ...next,
      willpowerCur: clamp(next.willpowerCur + effect.delta, 0, next.willpowerMax),
    };
  }
  return next;
}

function resolveSoloRollPlan(option: SoloOption, sheet: CharacterSheet): { pool: number; difficulty: number; label: string } {
  const req = option.requirement;
  if (req.type === "discipline") {
    const dots = Number(sheet.disciplines?.[req.discipline] ?? 0);
    return {
      pool: clamp(2 + dots, 1, 10),
      difficulty: clamp(2 + req.minLevel, 2, 6),
      label: `Disciplina · ${disciplineLabel(req.discipline)}`,
    };
  }
  if (req.type === "skill") {
    const skillDots = Number(sheet.skills?.[req.skill] ?? 0);
    return {
      pool: clamp(Number(sheet.attributes.res ?? 1) + skillDots, 1, 12),
      difficulty: clamp(2 + req.minLevel, 2, 6),
      label: `Habilidad · ${req.skill}`,
    };
  }
  if (req.type === "attribute") {
    const attrDots = Number(sheet.attributes?.[req.attribute] ?? 0);
    return {
      pool: clamp(attrDots + Number(sheet.attributes.res ?? 1), 1, 12),
      difficulty: clamp(2 + req.minLevel, 2, 6),
      label: `Atributo · ${req.attribute}`,
    };
  }
  if (option.type === "discipline" && option.discipline) {
    const dots = Number(sheet.disciplines?.[option.discipline] ?? 0);
    return {
      pool: clamp(2 + dots, 1, 10),
      difficulty: 3,
      label: `Disciplina · ${disciplineLabel(option.discipline)}`,
    };
  }
  if (option.type === "skill" && option.skill) {
    const skillDots = Number(sheet.skills?.[option.skill] ?? 0);
    return {
      pool: clamp(Number(sheet.attributes.res ?? 1) + skillDots, 1, 12),
      difficulty: 3,
      label: `Habilidad · ${option.skill}`,
    };
  }
  return {
    pool: clamp(Number(sheet.attributes.com ?? 1) + Number(sheet.attributes.res ?? 1), 1, 12),
    difficulty: option.type === "clan" ? 3 : 2,
    label: "Resolución social",
  };
}

export function SoloCampaignApp({
  profileId,
  sheet,
  onExit,
  onSheetSynced,
  embedded = false,
  emitParalelaNarration,
  providerWrapped = false,
}: Props) {
  const isSupported = isSoloSupportedClan(sheet.clan);
  /** Estado inicial sólo en montaje (el componente lleva key de perfil; no reprocesar al mutar hambre en vivo). */
  const [initialProgress] = useState(() => ensureSoloProgress(profileId, sheet));

  /** El padre (Nexo) no monta SOL para linajes no jugables; retorno nulo por si se reutiliza el componente. */
  if (!isSupported) {
    return null;
  }

  const screen = (
    <SoloCampaignScreen
      profileId={profileId}
      sheet={sheet}
      onExit={onExit}
      onSheetSynced={onSheetSynced}
      embedded={embedded}
      emitParalelaNarration={emitParalelaNarration}
    />
  );

  if (providerWrapped) {
    return screen;
  }

  return (
    <SoloCampaignProvider key={profileId} initialProgress={initialProgress}>
      {screen}
    </SoloCampaignProvider>
  );
}

function SoloCampaignScreen({
  profileId,
  sheet,
  onExit,
  onSheetSynced,
  embedded = false,
  emitParalelaNarration,
}: Props) {
  const { progress, transitionSlide, patchProgress, navigateProgress } = useSoloCampaign();
  const transitionLockRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const [lastRollLine, setLastRollLine] = useState<string>("");
  const [pendingReveal, setPendingReveal] = useState<{
    draft: SoloCommitDraft;
    consequenceText: string;
  } | null>(null);
  /** Elección Despertar (d10 vs Voluntad) antes de resolver la tirada de disciplina. */
  const [pendingDespertarChoice, setPendingDespertarChoice] = useState<SoloOption | null>(null);
  const chapterAdvanceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    transitionLockRef.current = false;
  }, [progress.sceneId, progress.chapterId, progress.updatedAt]);

  useEffect(() => {
    setPendingReveal(null);
    setPendingDespertarChoice(null);
    setLastRollLine("");
  }, [progress.sceneId, progress.chapterId]);
  const chapter = useMemo(() => getSoloChapter(progress.chapterId), [progress.chapterId]);
  const scene = useMemo(() => getSoloScene(progress.chapterId, progress.sceneId), [progress.chapterId, progress.sceneId]);
  const displayedOptions = useMemo(() => {
    if (!scene) return [];
    return listPlayerVisibleSoloOptions(scene.options, sheet, progress);
  }, [scene, sheet, progress]);
  const pendingNextChapter = getPendingNextChapter(progress);
  const collapseEndOptions = Boolean(
    pendingNextChapter &&
      (Boolean(scene?.id.endsWith("_end")) || (scene?.options?.length ?? 0) === 0),
  );
  const atNarrativeEndingScene = progress.sceneId.startsWith("ending_");
  const showAdvanceToNextChapter =
    Boolean(pendingNextChapter) &&
    (progress.endingId ?? null) == null &&
    !atNarrativeEndingScene;
  const scenePanels = useMemo(() => {
    if (!scene) return { context: null as string | null, narration: "" };
    const raw = resolveSoloScenePlayerText(scene, sheet, progress);
    return parseSceneIaPanels(raw);
  }, [scene, sheet, progress]);
  /** Cierre de capítulo sin prosa: evita panel al scroll y el guión "—" placeholder. */
  const compactChapterGate = Boolean(
    collapseEndOptions &&
      !scenePanels.context?.trim() &&
      !(scenePanels.narration.trim() || scene?.text.trim()),
  );
  const clanLabel = CLAN_OPTIONS.find((c) => c.id === sheet.clan)?.label ?? sheet.clan;
  const chapterHeadline = chapter ? soloChapterHeadlineForClan(chapter.title, sheet.clan) : "";
  const chapterRibbon = chapter ? compactChapterRibbon(chapterHeadline, chapter.id) : "";

  useEffect(() => {
    if (!showAdvanceToNextChapter) return;
    const atEndId = Boolean(scene?.id.endsWith("_end"));
    const gateNoBranches = (scene?.options?.length ?? 0) === 0;
    if (!atEndId && !gateNoBranches) return;
    const id = requestAnimationFrame(() => {
      chapterAdvanceRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [showAdvanceToNextChapter, scene?.id, scene?.options?.length, reduceMotion]);

  const finalizeCommitDraft = useCallback(
    (draft: SoloCommitDraft) => {
      if (transitionLockRef.current) return;
      transitionLockRef.current = true;

      const { option, nextSheet, chronicleXpThisChoice } = draft;

      if (draft.disciplineActivationHint === "rouse_ansia") {
        appendXpLog("Crónica: Despertar fallido — +1 Ansia.");
      }
      if (draft.disciplineActivationHint === "rouse_willpower") {
        appendXpLog("Crónica: Despertar estabilizado con −1 Voluntad (sin subir Ansia).");
      }

      setLastRollLine(draft.rollLine);

      if (nextSheet !== draft.sheetBeforeDecision) {
        saveSheet(nextSheet);
        syncActiveBundleFromGlobals(profileId);
        onSheetSynced?.(nextSheet);
      }
      if (chronicleXpThisChoice > 0) appendXpLog(`Crónica +${chronicleXpThisChoice} PX`);
      if (chronicleXpThisChoice > 0 || nextSheet !== draft.sheetBeforeDecision) syncActiveBundleFromGlobals(profileId);

      const tick = progress.updatedAt + 1;
      const backSnap = { chapterId: progress.chapterId, sceneId: progress.sceneId };
      const prevStack = progress.soloSceneBackStack ?? [];

      const next: SoloProgress = {
        ...progress,
        playerName: sheet.name?.trim() || progress.playerName,
        clan: sheet.clan,
        humanity: nextSheet.humanity,
        fragmentation: draft.nextFragmentation,
        chronicleExperience: Math.max(0, (progress.chronicleExperience ?? 0) + chronicleXpThisChoice),
        reputation: progress.reputation + draft.reputationGain,
        sceneId: draft.nextSceneId,
        activeRoute: draft.nextActiveRoute,
        stateTags: draft.nextStateTags,
        endingId: draft.nextEndingId,
        fatalOutcome: draft.nextFatalOutcome,
        flags: draft.nextFlags,
        visitedSceneIds: Array.from(new Set([...(progress.visitedSceneIds ?? []), draft.nextSceneId])),
        soloSceneBackStack: [...prevStack, backSnap].slice(-SOLO_BACK_STACK_LIMIT),
        soloSceneForwardStack: [],
        decisionHistory: [
          ...progress.decisionHistory,
          {
            sceneId: progress.sceneId,
            optionId: option.id,
            routeAtDecision: progress.activeRoute ?? "main",
            ts: tick,
            rollSummary: draft.rollLine,
            rollPassed: draft.rollPassed,
          },
        ].slice(-120),
        updatedAt: tick,
      };
      setPendingReveal(null);
      setPendingDespertarChoice(null);
      navigateProgress(next, 1);
    },
    [navigateProgress, onSheetSynced, profileId, progress, sheet.name, sheet.clan],
  );

  const commitOptionAfterDespertar = useCallback(
    (option: SoloOption, rouseMode: "roll" | "willpower") => {
      if (transitionLockRef.current) return;
      if (!checkOptionAvailability(option, sheet, progress).available) return;
      if (rouseMode === "willpower" && sheet.willpowerCur < 1) return;
      if (pendingReveal !== null && pendingReveal.draft.option.id !== option.id) return;

      setPendingDespertarChoice(null);

      const { consequence } = parseOptionIaPanels(option.text);
      const consec = consequence?.trim() ?? null;
      const draft = buildSoloCommitDraft(option, sheet, progress, rouseMode);

      if (!consec) {
        finalizeCommitDraft(draft);
        return;
      }

      setPendingReveal({ draft, consequenceText: consec });
      setLastRollLine(draft.rollLine);
    },
    [finalizeCommitDraft, pendingReveal, progress, sheet],
  );

  const activateOptionChoice = useCallback(
    (option: SoloOption) => {
      if (transitionLockRef.current) return;
      if (!checkOptionAvailability(option, sheet, progress).available) return;

      if (pendingReveal?.draft.option.id === option.id) {
        finalizeCommitDraft(pendingReveal.draft);
        return;
      }
      if (pendingReveal !== null && pendingReveal.draft.option.id !== option.id) return;

      if (pendingDespertarChoice && pendingDespertarChoice.id !== option.id) return;

      if (needsDespertarChoice(option, sheet) && pendingDespertarChoice?.id !== option.id) {
        setPendingDespertarChoice(option);
        return;
      }

      const { consequence } = parseOptionIaPanels(option.text);
      const consec = consequence?.trim() ?? null;
      const draft = buildSoloCommitDraft(option, sheet, progress);

      if (!consec) {
        finalizeCommitDraft(draft);
        return;
      }

      setPendingReveal({ draft, consequenceText: consec });
      setLastRollLine(draft.rollLine);
    },
    [finalizeCommitDraft, pendingReveal, pendingDespertarChoice, progress, sheet],
  );

  const revertToPrevScene = () => {
    if (transitionLockRef.current) return;
    const stack = [...(progress.soloSceneBackStack ?? [])];
    if (!stack.length) return;
    const prev = stack.pop()!;
    const fwd = [...(progress.soloSceneForwardStack ?? []), { chapterId: progress.chapterId, sceneId: progress.sceneId }].slice(
      -SOLO_BACK_STACK_LIMIT,
    );
    transitionLockRef.current = true;

    const nextDecisionHistory = [...progress.decisionHistory];
    const last = nextDecisionHistory[nextDecisionHistory.length - 1];
    if (last?.sceneId === prev.sceneId) nextDecisionHistory.pop();

    const next: SoloProgress = {
      ...progress,
      chapterId: prev.chapterId,
      sceneId: prev.sceneId,
      soloSceneBackStack: stack,
      soloSceneForwardStack: fwd,
      decisionHistory: nextDecisionHistory,
      updatedAt: progress.updatedAt + 1,
    };
    navigateProgress(next, -1);
    setLastRollLine("");
    setPendingReveal(null);
    setPendingDespertarChoice(null);
  };

  const advanceToNextPlayedScene = () => {
    if (transitionLockRef.current) return;
    const fwd = [...(progress.soloSceneForwardStack ?? [])];
    if (!fwd.length) return;
    const target = fwd.pop()!;
    const back = [...(progress.soloSceneBackStack ?? []), { chapterId: progress.chapterId, sceneId: progress.sceneId }].slice(
      -SOLO_BACK_STACK_LIMIT,
    );
    transitionLockRef.current = true;
    const next: SoloProgress = {
      ...progress,
      chapterId: target.chapterId,
      sceneId: target.sceneId,
      soloSceneBackStack: back,
      soloSceneForwardStack: fwd,
      updatedAt: progress.updatedAt + 1,
    };
    navigateProgress(next, 1);
    setLastRollLine("");
    setPendingReveal(null);
    setPendingDespertarChoice(null);
  };

  if (!chapter || !scene) {
    return (
      <div
        className={`bg-[#050505] px-4 py-10 font-mono text-neutral-300 ${
          embedded ? "flex min-h-0 flex-1 flex-col overflow-y-auto" : "min-h-screen"
        }`}
      >
        <div className="mx-auto max-w-2xl space-y-4 border border-red-900/40 bg-black/50 p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-red-300">Campaña Solitaria</p>
          <p>No se pudo cargar la escena actual. Vuelve al Nexo o al registro de fichas y revisa el personaje.</p>
          <button
            type="button"
            onClick={onExit}
            className="border border-neutral-700 px-3 py-2 text-[10px] uppercase tracking-[0.2em]"
          >
            Volver al Nexo
          </button>
        </div>
      </div>
    );
  }

  const sceneHeadingId = `solo-scene-title-${scene.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const hudFilled = CHRONICLE_HEALTH_TRACK_UI - Math.min(sheet.healthDamage, CHRONICLE_HEALTH_TRACK_UI);
  const fatalOutcome = progress.fatalOutcome ?? null;
  const endingId = progress.endingId ?? null;
  const sceneHasBranchOptions = (scene.options?.length ?? 0) > 0;
  const showEmptyChoicesHint =
    !collapseEndOptions && !endingId && !showAdvanceToNextChapter && displayedOptions.length === 0;

  return (
    <div
      className={
        embedded
          ? "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-black/20 font-mono text-neutral-300"
          : "flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#0f1118_0%,#050505_45%,#030303_100%)] font-mono text-neutral-300"
      }
    >
      {!embedded ? (
        <header className="shrink-0 border-b border-white/[0.06] bg-black/85 px-2.5 py-2.5 sm:px-3">
          <SoloCampaignHeader
            identity={{ nombre: sheet.name || "Sin nombre", clan: clanLabel }}
            status={{
              ansia: sheet.hunger,
              voluntad: { current: sheet.willpowerCur, max: sheet.willpowerMax },
              daño: { current: sheet.healthDamage, max: CHRONICLE_HEALTH_TRACK_UI },
            }}
            onRoll={(value) => {
              setLastRollLine(`Tirada manual d10: ${value}`);
            }}
            onPrev={(progress.soloSceneBackStack?.length ?? 0) > 0 ? revertToPrevScene : undefined}
            onNext={(progress.soloSceneForwardStack?.length ?? 0) > 0 ? advanceToNextPlayedScene : undefined}
          />
          <div className="mt-1 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={onExit}
              className="border border-neutral-700 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
            >
              Salir del Nexo
            </button>
          </div>
        </header>
      ) : null}

      {embedded && ((progress.soloSceneBackStack?.length ?? 0) > 0 || (progress.soloSceneForwardStack?.length ?? 0) > 0) ? (
        <div className="sticky top-0 z-10 flex shrink-0 flex-wrap justify-end gap-2 border-b border-white/[0.06] bg-black/85 px-2.5 py-2.5 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => revertToPrevScene()}
            disabled={(progress.soloSceneBackStack?.length ?? 0) === 0}
            className="border border-dashed border-amber-800/55 bg-amber-950/20 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-amber-200 hover:bg-amber-950/35 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↩ Escena anterior
          </button>
          <button
            type="button"
            onClick={() => advanceToNextPlayedScene()}
            disabled={(progress.soloSceneForwardStack?.length ?? 0) === 0}
            className="border border-dashed border-emerald-800/55 bg-emerald-950/20 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-emerald-200 hover:bg-emerald-950/35 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Escena siguiente ↪
          </button>
        </div>
      ) : null}

      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-hidden"
        aria-label="Historia y opciones"
      >
        {fatalOutcome ? (
          <div className={`min-h-0 flex-1 overflow-y-auto ${embedded ? "px-3 py-3 sm:px-4" : "px-4 py-5 sm:px-8"}`}>
            <section className="mx-auto max-w-2xl space-y-4 border border-red-900/50 bg-black/55 p-6 sharp-border-inner">
              <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-red-300">Muerte definitiva · {fatalOutcome.id}</p>
              <h2 className="text-lg text-red-100">{fatalOutcome.title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-300">{fatalOutcome.body}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onExit()}
                  className="border border-[var(--terminal)]/35 bg-neutral-950/80 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--terminal)]"
                >
                  Volver al Nexo
                </button>
              </div>
            </section>
          </div>
        ) : (
          <AnimatePresence mode="wait" custom={transitionSlide}>
            <motion.div
              key={`${progress.chapterId}:${progress.sceneId}`}
              role="article"
              aria-labelledby={sceneHeadingId}
              className="solo-book-spread flex min-h-0 min-w-0 flex-1 flex-col"
              custom={transitionSlide}
              variants={
                reduceMotion
                  ? {
                      enter: { opacity: 0 },
                      center: { opacity: 1, transition: { duration: 0 } },
                      exit: { opacity: 0, transition: { duration: 0 } },
                    }
                  : {
                      enter: (dir: 1 | -1) => ({
                        x: dir === 1 ? "105%" : "-105%",
                        opacity: 0,
                        filter: "blur(5px)",
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                      },
                      exit: (dir: 1 | -1) => ({
                        x: dir === 1 ? "-42%" : "42%",
                        opacity: 0,
                        filter: "blur(4px)",
                        transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] },
                      }),
                    }
              }
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div
                className={`min-h-0 overflow-y-auto pb-2 ${compactChapterGate ? "flex-none" : "flex-1"} ${embedded ? "px-2.5 py-2.5 sm:px-4 sm:py-3" : "px-3 py-4 sm:px-6 sm:py-5 lg:px-8"}`}
              >
                <div
                  className={`solo-book-page mx-auto max-w-3xl rounded-sm border border-white/[0.07] bg-[linear-gradient(165deg,rgba(18,17,16,0.97)_0%,rgba(8,8,10,0.99)_40%,rgba(5,5,6,1)_100%)] shadow-[inset_10px_0_24px_-14px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-6 sm:py-6 lg:px-8 lg:py-8 ${compactChapterGate ? "space-y-0 px-4 py-3 sm:py-4" : "space-y-5 px-4 py-5 sm:px-6 sm:py-6"}`}
                >
                  <p className="border-b border-white/[0.06] pb-3 font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                    <span className="text-neutral-400">{chapterRibbon}</span>
                  </p>
                  <section className="space-y-5">
                    <h2 id={sceneHeadingId} className="sr-only">
                      {scene.title}
                    </h2>
                    {scenePanels.context?.trim() ? (
                      <div
                        aria-label="Contexto de escena"
                        className="rounded-sm border border-white/[0.08] bg-black/35 px-4 py-3 font-sans text-[12px] leading-relaxed tracking-wide text-neutral-400"
                      >
                        <p className="whitespace-pre-line text-neutral-300">{scenePanels.context.trim()}</p>
                      </div>
                    ) : null}
                    {scenePanels.narration.trim() || scene.text.trim() ? (
                      <div className="solo-book-prose font-serif text-[14px] font-normal leading-[1.78] tracking-[0.01em] text-neutral-200 sm:text-[15px] sm:leading-[1.82] sm:tracking-[0.015em]">
                        <p className="whitespace-pre-line">
                          {scenePanels.narration.trim() || scene.text.trim()}
                        </p>
                      </div>
                    ) : compactChapterGate ? null : (
                      <div className="solo-book-prose font-serif text-[14px] font-normal leading-[1.78] tracking-[0.01em] text-neutral-200 sm:text-[15px] sm:leading-[1.82] sm:tracking-[0.015em]">
                        <p className="whitespace-pre-line">—</p>
                      </div>
                    )}
                  </section>
                </div>
              </div>

              <div className="shrink-0 border-t border-white/[0.06] bg-gradient-to-t from-black via-black/92 to-transparent px-2.5 pb-5 pt-3 sm:px-5 sm:pb-6 sm:pt-4">
                <div className="mx-auto max-w-3xl space-y-3">
                  {lastRollLine ? (
                    <p className="text-center font-sans text-[11px] leading-relaxed text-neutral-400">{lastRollLine}</p>
                  ) : null}

                  {!collapseEndOptions ? (
                    displayedOptions.length > 0 ? (
                    <div className="space-y-2.5">
                      {displayedOptions.map((option) => {
                      const parsedOpt = parseOptionIaPanels(option.text);

                      const state = checkOptionAvailability(option, sheet, progress);
                      const fail = listFailReasons(option, sheet, progress);
                      const promptBody =
                        parsedOpt.promptBody.trim() ||
                        option.text.trim().slice(0, 400) ||
                        "Acción disponible.";
                      let mechanicCue: string | null = null;
                      if (option.discipline !== undefined)
                        mechanicCue = disciplineLabel(option.discipline).replace(/\s*\([^)]*\)\s*/g, "").trim();
                      else if (option.skill !== undefined) mechanicCue = option.skill;
                      const choiceLabelShort = mechanicCue ? `${promptBody} · ${mechanicCue}` : promptBody;

                      const awaitingSecondTap = pendingReveal?.draft.option.id === option.id;
                      const blockedByReveal = pendingReveal !== null && pendingReveal.draft.option.id !== option.id;
                      const blockedByDespertar =
                        pendingDespertarChoice !== null && pendingDespertarChoice.id !== option.id;
                      const blockedSibling = blockedByReveal || blockedByDespertar;
                      const showDespertarPanel =
                        needsDespertarChoice(option, sheet) && pendingDespertarChoice?.id === option.id;
                      const disabledChoice = !state.available || blockedSibling;

                      if (showDespertarPanel) {
                        return (
                          <div
                            key={option.id}
                            role="group"
                            aria-label={`Despertar · ${choiceLabelShort}`}
                            className="w-full rounded border border-[var(--terminal)]/40 bg-gradient-to-b from-black/55 to-black/40 px-4 py-3.5 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                          >
                            {mechanicCue ? (
                              <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">
                                <span className="rounded border border-[var(--terminal)]/35 bg-black/55 px-1.5 py-0.5 text-neutral-300">
                                  Disciplina
                                </span>
                                <span className="normal-case tracking-normal text-[11px] text-neutral-400">{mechanicCue}</span>
                                <span className="rounded border border-white/[0.08] bg-black/40 px-1.5 py-0.5 text-[10px] font-sans normal-case tracking-normal text-neutral-500">
                                  Despertar
                                </span>
                              </div>
                            ) : null}
                            <p className="text-sm leading-relaxed text-neutral-200">{promptBody}</p>
                            <p className="mt-2 font-sans text-[11px] leading-relaxed text-neutral-500">
                              Con el d10, si sacas 1–5 sube tu Ansia. Puedes gastar 1 Voluntad para estabilizar la sangre sin
                              tirar ni subir Ansia por el Despertar.
                            </p>
                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <button
                                type="button"
                                onClick={() => commitOptionAfterDespertar(option, "roll")}
                                className="border border-neutral-600/90 bg-black/50 px-3 py-2.5 text-left font-sans text-[12px] text-neutral-100 transition hover:border-[var(--terminal)]/50 hover:bg-black/70"
                              >
                                <span className="block text-[9px] uppercase tracking-[0.2em] text-neutral-500">Tirar</span>
                                Despertar (d10)
                              </button>
                              <button
                                type="button"
                                disabled={sheet.willpowerCur < 1}
                                onClick={() => commitOptionAfterDespertar(option, "willpower")}
                                className="border border-neutral-600/90 bg-black/50 px-3 py-2.5 text-left font-sans text-[12px] text-neutral-100 transition enabled:hover:border-[var(--terminal)]/50 enabled:hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-45"
                              >
                                <span className="block text-[9px] uppercase tracking-[0.2em] text-neutral-500">Gastar</span>
                                <span className="text-emerald-200/90">−1 Voluntad</span>
                                <span className="block text-[10px] font-normal text-neutral-500">Sin tirada · sin Ansia por Despertar</span>
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPendingDespertarChoice(null)}
                              className="mt-2.5 w-full border border-transparent py-1.5 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-neutral-500 transition hover:text-neutral-400"
                            >
                              Cancelar
                            </button>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={option.id}
                          type="button"
                          disabled={disabledChoice}
                          aria-pressed={awaitingSecondTap}
                          aria-label={state.available ? choiceLabelShort : `${choiceLabelShort}. No disponible.`}
                          aria-describedby={!state.available && fail.length ? `${option.id}-why` : undefined}
                          onClick={() => activateOptionChoice(option)}
                          className={`w-full border px-4 py-3 text-left transition duration-150 ${
                            disabledChoice && !blockedSibling
                              ? "cursor-not-allowed border-neutral-800/80 bg-black/20 opacity-55"
                              : awaitingSecondTap
                                ? "solo-choice-await-pulse border-[var(--terminal)]/45 bg-black/50"
                              : blockedSibling
                                ? "cursor-not-allowed border-neutral-800/80 bg-black/15 opacity-40"
                              : "border-neutral-700/90 bg-black/40 hover:border-[var(--terminal)]/55 hover:bg-black/65"
                          } ${awaitingSecondTap && !disabledChoice ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--terminal)]/55" : ""}`}
                        >
                          {mechanicCue ? (
                            <div
                              className={`mb-2 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] ${awaitingSecondTap ? "text-neutral-600" : "text-neutral-500"}`}
                            >
                              <span className="rounded border border-neutral-700/80 bg-black/55 px-1.5 py-0.5 text-neutral-300">
                                {option.discipline !== undefined ? "Disciplina" : option.skill !== undefined ? "Habilidad" : "Acción"}
                              </span>
                              <span className="normal-case tracking-normal text-[11px] text-neutral-400">{mechanicCue}</span>
                            </div>
                          ) : null}
                          {awaitingSecondTap && pendingReveal ? (
                            <p className="solo-book-prose whitespace-pre-line text-[15px] font-normal leading-[1.82] tracking-[0.015em] text-neutral-100">
                              {pendingReveal.consequenceText}
                            </p>
                          ) : (
                            <>
                              <p className="text-sm leading-relaxed text-neutral-200">{promptBody}</p>
                              {needsDespertarChoice(option, sheet) ? (
                                <p className="mt-2 font-sans text-[10px] leading-snug text-neutral-600">
                                  Al pulsar, eliges tirar el Despertar (d10) o gastar 1 Voluntad para no subir Ansia por el
                                  Despertar.
                                </p>
                              ) : null}
                            </>
                          )}
                          {!state.available && fail.length ? (
                            <p id={`${option.id}-why`} className="mt-2 text-[11px] text-neutral-500">
                              {fail[0]}
                            </p>
                          ) : null}
                        </button>
                      );
                      })}
                    </div>
                    ) : showEmptyChoicesHint ? (
                      <div
                        role="status"
                        className="rounded border border-dashed border-neutral-700/55 bg-black/35 px-4 py-4 text-center"
                      >
                        <p className="font-sans text-[11px] leading-relaxed text-neutral-500">
                          {sceneHasBranchOptions ? (
                            <>
                              Ninguna opción cumple los requisitos con tu ficha y progreso actual. Prueba volver a la escena
                              anterior o sal al Nexo.
                            </>
                          ) : (
                            <>
                              Esta escena no ofrece elecciones. Si esperabas un avance de capítulo y no aparece abajo, sal al
                              Nexo y vuelve a cargar el personaje.
                            </>
                          )}
                        </p>
                      </div>
                    ) : null
                  ) : null}

                  {endingId ? (
                    <div className="border-t border-white/[0.04] pt-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                        Final desbloqueado: {formatSoloEndingDisplay(endingId)}
                      </p>
                    </div>
                  ) : null}

                  {showAdvanceToNextChapter && pendingNextChapter ? (
                    <div
                      ref={chapterAdvanceRef}
                      className="flex flex-wrap gap-2 border-t border-white/[0.04] pt-4 scroll-mt-[min(220px,30vh)]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (transitionLockRef.current) return;
                          const target = pendingNextChapter;
                          if (!target) {
                            return;
                          }
                          transitionLockRef.current = true;
                          const targetChapter = getSoloChapter(target);
                          const targetStart = resolveChapterEntrySceneId(target, progress.flags) ?? targetChapter?.startSceneId ?? null;
                          if (!targetChapter || !targetStart) {
                            transitionLockRef.current = false;
                            return;
                          }
                          const backSnap = { chapterId: progress.chapterId, sceneId: progress.sceneId };
                          const prevStack = progress.soloSceneBackStack ?? [];
                          const consumedFlag = `chapter_pending_${target}`;
                          const next: SoloProgress = {
                            ...progress,
                            chapterId: target,
                            sceneId: targetStart,
                            flags: { ...progress.flags, [consumedFlag]: false },
                            visitedSceneIds: Array.from(new Set([...(progress.visitedSceneIds ?? []), targetStart])),
                            soloSceneBackStack: [...prevStack, backSnap].slice(-SOLO_BACK_STACK_LIMIT),
                            soloSceneForwardStack: [],
                            updatedAt: progress.updatedAt + 1,
                          };
                          navigateProgress(next, 1);
                        }}
                        className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-neutral-400 hover:border-neutral-500"
                      >
                        <IconBook decorative className="icon !h-[16px] !w-[16px] shrink-0 opacity-85" />
                        <span>Continuar en {pendingChapterButtonLabel(pendingNextChapter)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onExit()}
                        className="inline-flex items-center gap-2 border border-[var(--terminal)]/35 bg-neutral-950/80 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--terminal)]"
                      >
                        <IconTerminal decorative className="icon !h-[16px] !w-[16px] shrink-0 opacity-90" />
                        <span>Volver al Nexo</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
