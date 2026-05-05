"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CharacterSheet, ClanId } from "@/lib/character";
import { CLAN_OPTIONS } from "@/lib/character";
import { disciplineLabel } from "@/lib/sereno";
import { ensureSoloProgress, isSoloSupportedClan } from "@/lib/soloCampaign/bootstrap";
import { getSoloChapter, getSoloScene } from "@/lib/soloCampaign/chapters";
import { checkOptionAvailability, listFailReasons } from "@/lib/soloCampaign/requirementEngine";
import { loadSheet, normalizeCharacterSheet, saveSheet } from "@/lib/character";
import { loadSoloProgress, saveSoloProgress } from "@/lib/soloCampaign/progressStore";
import type { SoloEndingId, SoloOption, SoloProgress, SoloRouteId, SoloSceneEffect } from "@/lib/soloCampaign/types";
import { parseOptionIaPanels, parseSceneIaPanels } from "@/lib/soloCampaign/soloIaPresentation";
import { getPendingNextChapter } from "@/lib/soloCampaign/soloProgressSelectors";
import { syncActiveBundleFromGlobals } from "@/lib/profileStore";
import { TechnicalHud } from "@/components/TechnicalHud";
import { SoloCampaignProvider, useSoloCampaign } from "@/context/SoloCampaignContext";
import { rollPoolV5, summarizeRollPlayerLog } from "@/lib/dice";
import { appendXpLog } from "@/lib/sessionMeta";
import {
  applyOpeningChronicleVitals,
  CHRONICLE_HEALTH_TRACK_UI,
  CHRONICLE_OPENING_SCENE_ID,
  CHRONICLE_XP_CRITICAL_EXTRA,
  CHRONICLE_XP_ROLL_SUCCESS_DEFAULT,
  SOLO_FLAG_OPENING_VITALS,
} from "@/lib/soloCampaign/chronicleMechanics";
import { applyPreRollResourceCost, soloOptionUsesDice } from "@/lib/soloCampaign/rollResourceCost";

const SOLO_BACK_STACK_LIMIT = 120;

function sumReputationDeltas(list: SoloOption["effects"]): number {
  if (!list?.length) return 0;
  return list.reduce((acc, e) => (e.type === "reputationDelta" ? acc + e.delta : acc), 0);
}

function partitionExperienceEffects(branchEffects: SoloSceneEffect[]): { sheetFx: SoloSceneEffect[]; xpFromNarrative: number } {
  let xpFromNarrative = 0;
  const sheetFx: SoloSceneEffect[] = [];
  for (const e of branchEffects) {
    if (e.type === "experienceDelta") xpFromNarrative += e.delta;
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
  /** Tras persistir CODEX desde la campaña, actualiza Nexo/React (nombre, vitae, etc.). */
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

type SoloCommitDraft = {
  option: SoloOption;
  sheetBeforeDecision: CharacterSheet;
  /** Gasto opcional antes de tirar (disciplinas). */
  disciplineActivationHint?: "willpower" | "hunger";
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
};

/** Resuelve mecánica y banderas sin persistir (segundo clic aplica efectos visibles). */
function buildSoloCommitDraft(option: SoloOption, sheet: CharacterSheet, progress: SoloProgress): SoloCommitDraft {
  let nextSheet = sheet;
  const nextFlags = { ...progress.flags };
  let rollLine: string;
  let rollPassed = true;
  let targetSceneId = option.nextSceneId;
  let branchEffects: SoloSceneEffect[];
  let rollXpEarned = 0;
  let xpFromNarrative = 0;

  let disciplineActivationHint: "willpower" | "hunger" | undefined;

  if (soloOptionUsesDice(option)) {
    const wpBefore = nextSheet.willpowerCur;
    const hungerBeforePre = nextSheet.hunger;
    nextSheet = applyPreRollResourceCost(nextSheet, option);
    if (nextSheet.willpowerCur < wpBefore) disciplineActivationHint = "willpower";
    else if (nextSheet.hunger > hungerBeforePre) disciplineActivationHint = "hunger";

    const rollPlan = resolveSoloRollPlan(option, nextSheet);
    const roll = rollPoolV5(rollPlan.pool, nextSheet.hunger, rollPlan.difficulty);
    rollLine = `${rollPlan.label} · ${summarizeRollPlayerLog(roll)}`;
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
      nextSheet = { ...nextSheet, hunger: Math.max(0, Math.min(5, nextSheet.hunger + 1)) };
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
  const chapterAdvanceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    transitionLockRef.current = false;
  }, [progress.sceneId, progress.chapterId]);

  useEffect(() => {
    setPendingReveal(null);
    setLastRollLine("");
  }, [progress.sceneId, progress.chapterId]);
  const chapter = useMemo(() => getSoloChapter(progress.chapterId), [progress.chapterId]);
  const scene = useMemo(() => getSoloScene(progress.chapterId, progress.sceneId), [progress.chapterId, progress.sceneId]);
  const displayedOptions = useMemo(() => {
    if (!scene) return [];
    return scene.options;
  }, [scene]);
  const missingOptionCount = Math.max(0, 4 - displayedOptions.length);
  const pendingNextChapter = getPendingNextChapter(progress);
  const scenePanels = useMemo(
    () => (scene ? parseSceneIaPanels(scene.text) : { context: null as string | null, narration: "" }),
    [scene],
  );
  const clanLabel = CLAN_OPTIONS.find((c) => c.id === sheet.clan)?.label ?? sheet.clan;
  const openingVitalsApplied = Boolean(progress.flags[SOLO_FLAG_OPENING_VITALS]);

  useEffect(() => {
    if (!pendingNextChapter || !scene?.id.endsWith("_end")) return;
    const id = requestAnimationFrame(() => {
      chapterAdvanceRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [pendingNextChapter, scene?.id, reduceMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canNarrative = scene?.id === CHRONICLE_OPENING_SCENE_ID;
    if (!canNarrative || openingVitalsApplied) return;
    const latest = loadSoloProgress(profileId, sheet.clan);
    if (!latest) return;
    const stored = loadSheet();
    if (!stored) return;
    const nextSheet = applyOpeningChronicleVitals(normalizeCharacterSheet(stored));
    saveSheet(nextSheet);
    onSheetSynced?.(nextSheet);
    appendXpLog("Crónica: estado vital inicial aplicado en Teatinos (eco Codex sincronizado).");
    syncActiveBundleFromGlobals(profileId);
    const progFlag: SoloProgress = {
      ...latest,
      flags: { ...latest.flags, [SOLO_FLAG_OPENING_VITALS]: true },
      updatedAt: latest.updatedAt + 1,
    };
    patchProgress(progFlag);
  }, [scene?.id, openingVitalsApplied, profileId, sheet.clan, patchProgress, onSheetSynced]);

  const finalizeCommitDraft = useCallback(
    (draft: SoloCommitDraft) => {
      if (transitionLockRef.current) return;
      transitionLockRef.current = true;

      const { option, nextSheet, chronicleXpThisChoice } = draft;

      if (draft.disciplineActivationHint === "willpower") {
        appendXpLog("Crónica: activación de disciplina (−1 voluntad).");
      } else if (draft.disciplineActivationHint === "hunger") {
        appendXpLog("Crónica: activación de disciplina (+1 presión de hambre / Vitae).");
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
      navigateProgress(next, 1);
    },
    [navigateProgress, onSheetSynced, profileId, progress, sheet.name, sheet.clan],
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
    [finalizeCommitDraft, pendingReveal, progress, sheet],
  );

  const revertToPrevScene = () => {
    if (transitionLockRef.current) return;
    const stack = [...(progress.soloSceneBackStack ?? [])];
    if (!stack.length) return;
    const prev = stack.pop()!;
    transitionLockRef.current = true;

    const nextDecisionHistory = [...progress.decisionHistory];
    const last = nextDecisionHistory[nextDecisionHistory.length - 1];
    if (last?.sceneId === prev.sceneId) nextDecisionHistory.pop();

    const next: SoloProgress = {
      ...progress,
      chapterId: prev.chapterId,
      sceneId: prev.sceneId,
      soloSceneBackStack: stack,
      decisionHistory: nextDecisionHistory,
      updatedAt: progress.updatedAt + 1,
    };
    navigateProgress(next, -1);
    setLastRollLine("");
    setPendingReveal(null);
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

  return (
    <div
      className={
        embedded
          ? "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-black/20 font-mono text-neutral-300"
          : "flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#0f1118_0%,#050505_45%,#030303_100%)] font-mono text-neutral-300"
      }
    >
      {!embedded ? (
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] bg-black/85 px-2 py-2 sm:px-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <TechnicalHud
              healthFilled={hudFilled}
              healthMax={CHRONICLE_HEALTH_TRACK_UI}
              hunger={sheet.hunger}
              compactLabels
              hideMetagameFooter
              className="border-0 bg-transparent px-0 py-0"
            />
            <div className="min-w-0 truncate font-sans text-[10px] text-neutral-500">
              <span className="text-neutral-200">{sheet.name || "Sin nombre"}</span>
              <span className="text-neutral-600"> · </span>
              <span className={CLAN_TONE[sheet.clan] ?? "text-neutral-300"}>{clanLabel}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {(progress.soloSceneBackStack?.length ?? 0) > 0 ? (
              <button
                type="button"
                onClick={() => revertToPrevScene()}
                className="border border-dashed border-amber-800/60 bg-amber-950/25 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.16em] text-amber-200 hover:bg-amber-950/40"
              >
                ↩ Escena
              </button>
            ) : null}
            <button
              type="button"
              onClick={onExit}
              className="border border-neutral-700 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.16em] text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
            >
              Salir
            </button>
          </div>
        </header>
      ) : null}

      {embedded && (progress.soloSceneBackStack?.length ?? 0) > 0 ? (
        <div className="flex shrink-0 justify-end border-b border-white/[0.06] bg-black/45 px-2 py-1.5">
          <button
            type="button"
            onClick={() => revertToPrevScene()}
            className="border border-dashed border-amber-800/55 bg-amber-950/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-amber-200 hover:bg-amber-950/35"
          >
            ↩ Escena anterior
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
              aria-label={`Escena: ${scene.title}`}
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
                className={`min-h-0 flex-1 overflow-y-auto pb-2 ${embedded ? "px-3 py-3 sm:px-4" : "px-4 py-5 sm:px-8"}`}
              >
                <div className="solo-book-page mx-auto max-w-2xl space-y-6 rounded-sm border border-white/[0.07] bg-[linear-gradient(165deg,rgba(18,17,16,0.97)_0%,rgba(8,8,10,0.99)_40%,rgba(5,5,6,1)_100%)] px-5 py-6 shadow-[inset_10px_0_24px_-14px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-8 sm:py-8">
                  <p className="border-b border-white/[0.06] pb-3 font-sans text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                    <span className="text-neutral-400">{chapter.title}</span>
                    <span className="mx-2 text-neutral-700">·</span>
                    <span style={{ color: "var(--accent-clan, #a3a3a3)" }}>{scene.title}</span>
                  </p>
                  <section className="space-y-5" aria-labelledby={sceneHeadingId}>
                    <h2 id={sceneHeadingId} className="sr-only">
                      {scene.title}
                    </h2>
                    {scenePanels.context?.trim() ? (
                      <div
                        aria-label="Contexto de escena"
                        className="rounded-sm border border-white/[0.08] bg-black/35 px-4 py-3 font-sans text-[12px] leading-relaxed tracking-wide text-neutral-400"
                      >
                        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-500">Contexto</p>
                        <p className="whitespace-pre-line text-neutral-300">{scenePanels.context.trim()}</p>
                      </div>
                    ) : null}
                    <div className="solo-book-prose font-serif text-[15px] font-normal leading-[1.82] tracking-[0.015em] text-neutral-200">
                      <p className="whitespace-pre-line">
                        {(scenePanels.narration.trim() || scene.text.trim()) || "—"}
                      </p>
                    </div>
                  </section>
                </div>
              </div>

              <div className="shrink-0 border-t border-white/[0.06] bg-gradient-to-t from-black via-black/92 to-transparent px-3 pb-6 pt-4 sm:px-6">
                <div className="mx-auto max-w-2xl space-y-3">
                  {lastRollLine ? (
                    <p className="text-center font-sans text-[11px] leading-relaxed text-neutral-400">{lastRollLine}</p>
                  ) : null}

                  <div className="space-y-2.5">
                    {missingOptionCount > 0 ? (
                      <p className="border border-amber-900/50 bg-amber-950/25 px-3 py-2 text-[11px] text-amber-200">
                        Faltan {missingOptionCount} opciones para cumplir el mínimo de 4 en esta escena ({scene.id}).
                      </p>
                    ) : null}
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
                      const blockedSibling = pendingReveal !== null && pendingReveal.draft.option.id !== option.id;
                      const disabledChoice = !state.available || blockedSibling;

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
                            <p className="text-sm leading-relaxed text-neutral-200">{promptBody}</p>
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

                  {endingId ? (
                    <div className="border-t border-white/[0.04] pt-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">Final desbloqueado: {endingId}</p>
                    </div>
                  ) : null}

                  {pendingNextChapter ? (
                    <div
                      ref={chapterAdvanceRef}
                      className="flex flex-wrap gap-2 border-t border-white/[0.04] pt-4 scroll-mt-[min(220px,30vh)]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (transitionLockRef.current) return;
                          transitionLockRef.current = true;
                          const target = pendingNextChapter;
                          const targetStart = getSoloChapter(target)?.startSceneId;
                          if (!targetStart) {
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
                            updatedAt: progress.updatedAt + 1,
                          };
                          navigateProgress(next, 1);
                        }}
                        className="border border-neutral-700 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-neutral-400 hover:border-neutral-500"
                      >
                        Continuar en {pendingNextChapter}
                      </button>
                      <button
                        type="button"
                        onClick={() => onExit()}
                        className="border border-[var(--terminal)]/35 bg-neutral-950/80 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--terminal)]"
                      >
                        Volver al Nexo
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
