"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  loadCampaignSyncSettings,
  saveCampaignSyncSettings,
  type CampaignSyncSettings,
} from "@/lib/campaignLocalSettings";
import {
  CLAN_ACCENTS,
  CLAN_OPTIONS,
  emptySheet,
  loadSheet,
  normalizeCharacterSheet,
  saveSheet,
  type CharacterSheet,
} from "@/lib/character";
import {
  appendMjDirective,
  loadActiveStrand,
  saveActiveStrand,
  loadNarrativeLog,
  saveNarrativeLog,
} from "@/lib/narrativeMemory";
import { STRAND_TAG, type NarrativeStrand } from "@/lib/narrativeStrands";
import { loadChronicle, peekPendingSynapticDisruption } from "@/lib/chronicleConfig";
import {
  appendXpLog,
  loadMeta,
  saveMeta,
} from "@/lib/sessionMeta";
import { tickImpulseRefill } from "@/lib/impulseUnits";
import { applyMandatoryServerChronicleReset, factoryResetLocalNexoPreserveGenesis } from "@/lib/clientNexoReset";
import {
  fetchServerClientResetEpoch,
  readLocalClientResetEpoch,
  writeLocalClientResetEpoch,
} from "@/lib/nexoSessionSync";
import type { NarrativeLogEntry } from "@/lib/narrativeTypes";
import { CharacterCreation } from "./CharacterCreation";
import { CampaignSyncBar } from "./CampaignSyncBar";
import { AdminConsole } from "./AdminConsole";
import { NexoChannelPanel } from "./NexoChannelPanel";
import { SidebarMesa } from "./SidebarMesa";
import { NexoChronicleDigest } from "./NexoChronicleDigest";
import { SchreckNetLogin } from "./SchreckNetLogin";
import { GameSessionProvider, useGameSession } from "@/context/GameSessionContext";
import { ForcedDestinyOverlay } from "./ForcedDestinyOverlay";
import { TechnicalHud } from "./TechnicalHud";
import {
  clearLocalPlayerProfilesOnly,
  createBlankProfile,
  ensureShadowPackNpcs,
  getActiveProfileId,
  loadBundle,
  listProfiles,
  migrateLegacyToProfiles,
  reconcileActiveProfileIfGlobalsStale,
  selectProfile,
  syncActiveBundleFromGlobals,
} from "@/lib/profileStore";
import { ProfileHub } from "./ProfileHub";
import { NarratorCommandCenter } from "./NarratorCommandCenter";
import { SoloCampaignProvider } from "@/context/SoloCampaignContext";
import { ensureSoloProgress, isSoloSupportedClan } from "@/lib/soloCampaign/bootstrap";
import { SoloCampaignApp } from "./SoloCampaignApp";
import { SoloSceneNav } from "./SoloSceneNav";
import { SoloCampaignPhaseRedirect } from "./SoloCampaignPhaseRedirect";
import type { Phase } from "@/lib/schreckPhase";
import {
  clearSchreckAuth,
  phaseToHref,
  queryParamToPhase,
  readAuthRole,
  writeAuthRole,
} from "@/lib/schreckNavigation";
import {
  clearOperatorSessionUnlock,
  isOperatorSessionUnlocked,
  setOperatorSessionUnlocked,
} from "@/lib/operatorSessionGate";
import { buildSoloNexoDigest } from "@/lib/soloCampaign/soloDigestNexo";
import { loadSoloProgress, saveSoloProgress } from "@/lib/soloCampaign/progressStore";

const HEALTH_MAX_UI = 7;

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function famineSealWallClock(): number {
  return Date.now();
}

function mergeStoredSheet(raw: CharacterSheet): CharacterSheet {
  return normalizeCharacterSheet(raw);
}

function persistActiveProfile(): void {
  const aid = getActiveProfileId();
  if (aid) syncActiveBundleFromGlobals(aid);
}

function applyGlobalsToUi(
  setSheet: (s: CharacterSheet) => void,
  setSheetLocked: (v: boolean) => void,
  setLogs: (v: NarrativeLogEntry[] | ((p: NarrativeLogEntry[]) => NarrativeLogEntry[])) => void,
  commitStrand?: (s: NarrativeStrand) => void,
) {
  const stored = loadSheet();
  if (stored) setSheet(mergeStoredSheet(stored));
  setSheetLocked(loadMeta().sheetLocked);
  const nar = loadNarrativeLog();
  setLogs(nar);
  commitStrand?.(loadActiveStrand());
}

export default function CronistaApp() {
  return (
    <GameSessionProvider>
      <CronistaAppInner />
    </GameSessionProvider>
  );
}

function CronistaAppInner() {
  const [phase, setPhase] = useState<Phase>("login");
  const [sheet, setSheet] = useState<CharacterSheet>(() => emptySheet());
  const [sheetLocked, setSheetLocked] = useState<boolean>(() =>
    typeof window === "undefined" ? false : loadMeta().sheetLocked,
  );
  const [logs, setLogs] = useState<NarrativeLogEntry[]>(() => []);
  const [nexoLlmReady, setNexoLlmReady] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [inquisitionThreat, setInquisitionThreat] = useState(2);
  const [mjCmd, setMjCmd] = useState("");
  const [profileIndexTick, setProfileIndexTick] = useState(0);
  /** Re-render impulsos / letargo tras gastar o pasar el ciclo. */
  /** Multimesa: mismo `campaignId` + Upstash fusiona turnos en el hilo activo. */
  const [campaignSync, setCampaignSync] = useState<CampaignSyncSettings>(() => loadCampaignSyncSettings());
  const [remoteCampaignStore, setRemoteCampaignStore] = useState(false);
  const campaignSyncRef = useRef(campaignSync);
  campaignSyncRef.current = campaignSync;
  const [activeStrand, setActiveStrand] = useState<NarrativeStrand>(() =>
    typeof window === "undefined" ? "principal" : loadActiveStrand(),
  );
  const activeStrandRef = useRef<NarrativeStrand>(
    typeof window === "undefined" ? "principal" : loadActiveStrand(),
  );

  const commitStrand = useCallback((s: NarrativeStrand) => {
    activeStrandRef.current = s;
    setActiveStrand(s);
    saveActiveStrand(s);
    const aid = getActiveProfileId();
    if (aid) queueMicrotask(() => syncActiveBundleFromGlobals(aid));
  }, []);

  /** Navega y escribe entrada en historial (`?v=`) para atrás/adelante en el mismo origen. */
  const navigateToPhase = useCallback((next: Phase, opts?: { replace?: boolean; preserveStrand?: boolean }) => {
    if (typeof window !== "undefined") {
      const href = phaseToHref(next);
      if (opts?.replace) {
        window.history.replaceState({ phase: next }, "", href);
      } else {
        window.history.pushState({ phase: next }, "", href);
      }
    }
    if (next === "nexus" && phase !== "nexus" && !opts?.preserveStrand) {
      commitStrand("principal");
    }
    setPhase(next);
  }, [commitStrand, phase]);

  /** `/?v=solitario` → Nexo + paralela. */
  const replaceSoloBookmarkWithNexus = useCallback(() => {
    commitStrand("paralela");
    navigateToPhase("nexus", { replace: true, preserveStrand: true });
  }, [commitStrand, navigateToPhase]);

  const historyBootRef = useRef(false);

  const {
    isNarrator,
    setIsNarrator,
    famineIntervalMinutes,
    setFamineIntervalMinutes: setFamineIntervalMinutesCtx,
    rollDifficulty,
    setRollDifficulty,
    forcedRoll,
    requestForcedRoll,
    clearForcedRoll,
  } = useGameSession();

  const accent = useMemo(() => CLAN_ACCENTS[sheet.clan], [sheet.clan]);

  const clanLabelDisplay = useMemo(
    () => CLAN_OPTIONS.find((c) => c.id === sheet.clan)?.label ?? sheet.clan,
    [sheet.clan],
  );
  const identityHint = `${sheet.name?.trim() || "Sin nombre"} · ${clanLabelDisplay}`;

  const hubProfiles = useMemo(() => {
    void profileIndexTick;
    return listProfiles();
  }, [profileIndexTick]);

  const healthHudFilled = HEALTH_MAX_UI - Math.min(sheet.healthDamage, HEALTH_MAX_UI);
  const nexusActiveProfileId = getActiveProfileId();

  /**
   * Tras recarga: primero alinear `localStorage` global con el bundle si quedó plantilla vacía;
   * luego **siempre** volcar globals → React (el estado inicial es `emptySheet()` y no lee solo).
   * Si el hilo es SOL pero el linaje no tiene crónica jugable (p. ej. LIN_IND), pasar al canal NEX sin pantalla bloqueante.
   */
  useLayoutEffect(() => {
    if (phase === "login") return;
    reconcileActiveProfileIfGlobalsStale();
    applyGlobalsToUi(setSheet, setSheetLocked, setLogs, commitStrand);
    if (phase !== "nexus") return;
    const clan = loadSheet()?.clan ?? sheet.clan;
    if (
      activeStrand === "paralela" &&
      getActiveProfileId() &&
      clan &&
      !isSoloSupportedClan(clan)
    ) {
      commitStrand("principal");
    }
  }, [phase, activeStrand, sheet.clan, profileIndexTick, commitStrand]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/nexo-capabilities", { cache: "no-store" });
        const j = (await res.json()) as { llmReady?: boolean };
        if (!cancelled && res.ok) setNexoLlmReady(Boolean(j.llmReady));
      } catch {
        if (!cancelled) setNexoLlmReady(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Detecta Upstash en servidor (GET devuelve storeDisabled: false). */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/campaign/entry?campaignId=nexo-ping-store&strand=principal&limit=1`, {
          cache: "no-store",
        });
        const j = (await res.json()) as { storeDisabled?: boolean };
        if (!cancelled && res.ok && j.storeDisabled === false) setRemoteCampaignStore(true);
      } catch {
        /* solo-local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Mandato servidor: nueva crónica global (epoch) — limpia todo y recarga. */
  useEffect(() => {
    let cancelled = false;
    async function checkClientResetEpoch() {
      try {
        const server = await fetchServerClientResetEpoch();
        if (cancelled) return;
        const local = readLocalClientResetEpoch();
        if (server > local) {
          applyMandatoryServerChronicleReset();
          writeLocalClientResetEpoch(server);
          window.location.reload();
        }
      } catch {
        /* red caída: reintentar en el próximo intervalo */
      }
    }
    void checkClientResetEpoch();
    const id = window.setInterval(checkClientResetEpoch, 45_000);
    const onVis = () => {
      if (document.visibilityState === "visible") void checkClientResetEpoch();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const saved = loadNarrativeLog();
    if (saved.length === 0) return;
    queueMicrotask(() => {
      setLogs(saved);
    });
  }, []);

  /** Primera carga cliente: reconciliar `?v=` con sesión y roles. */
  useEffect(() => {
    if (historyBootRef.current) return;
    historyBootRef.current = true;
    if (typeof window === "undefined") return;

    const role = readAuthRole();
    const vRaw = new URLSearchParams(window.location.search).get("v");
    const fromUrl = queryParamToPhase(vRaw);

    if (!role) {
      if (vRaw) window.history.replaceState(null, "", "/");
      setPhase("login");
      setIsNarrator(false);
      return;
    }

    const narrator = role === "narrator";
    setIsNarrator(narrator);

    let target: Phase = fromUrl ?? (narrator ? "commandCenter" : "profileHub");

    if (target === "commandCenter" && !isOperatorSessionUnlocked()) {
      target = "profileHub";
      if (narrator) {
        try {
          window.history.replaceState({ phase: "profileHub" }, "", phaseToHref("profileHub"));
        } catch {
          /* */
        }
      }
    }
    if (target === "commandCenter" && !narrator) target = "profileHub";
    if ((target === "nexus" || target === "soloCampaign") && !narrator && !getActiveProfileId()) target = "profileHub";

    const hrefWant = phaseToHref(target);
    if (`${window.location.pathname}${window.location.search}` !== hrefWant) {
      window.history.replaceState({ phase: target }, "", hrefWant);
    }
    setPhase(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- arranque único del historial Nexo
  }, []);

  useEffect(() => {
    function syncFromHistory() {
      const vRaw = new URLSearchParams(window.location.search).get("v");
      if (!vRaw) {
        clearSchreckAuth();
        setIsNarrator(false);
        setPhase("login");
        return;
      }
      const fromUrl = queryParamToPhase(vRaw);
      const role = readAuthRole();
      if (!fromUrl || !role) {
        window.history.replaceState(null, "", "/");
        clearSchreckAuth();
        setIsNarrator(false);
        setPhase("login");
        return;
      }

      const narrator = role === "narrator";
      setIsNarrator(narrator);

      let target: Phase = fromUrl;

      if (target === "commandCenter" && (!narrator || !isOperatorSessionUnlocked())) {
        window.history.replaceState({ phase: "profileHub" }, "", phaseToHref("profileHub"));
        target = "profileHub";
      } else if ((target === "nexus" || target === "soloCampaign") && !narrator && !getActiveProfileId()) {
        window.history.replaceState({ phase: "profileHub" }, "", phaseToHref("profileHub"));
        target = "profileHub";
      }

      setPhase(target);
    }

    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, [setIsNarrator]);

  useEffect(() => {
    if (phase !== "nexus") return;
    const m = loadMeta();
    setFamineIntervalMinutesCtx(
      typeof m.famineIntervalMinutes === "number"
        ? Math.max(5, Math.min(240, m.famineIntervalMinutes))
        : 60,
    );
  }, [phase, setFamineIntervalMinutesCtx]);

  useEffect(() => {
    if (phase !== "nexus") return;
    const sync = () => {
      const next = tickImpulseRefill(loadMeta());
      saveMeta(next);
      const aid = getActiveProfileId();
      if (aid) syncActiveBundleFromGlobals(aid);
    };
    sync();
    const id = window.setInterval(sync, 60_000);
    return () => window.clearInterval(id);
  }, [phase]);

  const handleSheetMutation = useCallback(
    (next: CharacterSheet, logLine?: string) => {
      saveSheet(next);
      setSheet(next);
      const lockedNow = typeof window !== "undefined" ? loadMeta().sheetLocked : false;
      if (lockedNow && logLine) {
        appendXpLog(logLine);
      }
      const aid = getActiveProfileId();
      if (aid) syncActiveBundleFromGlobals(aid);
    },
    [],
  );

  const applyLogin = () => {
    migrateLegacyToProfiles();
    writeAuthRole("player");
    setIsNarrator(false);
    clearOperatorSessionUnlock();
    navigateToPhase("profileHub");
  };

  const applyRootAccess = () => {
    migrateLegacyToProfiles();
    writeAuthRole("narrator");
    setIsNarrator(true);
    setOperatorSessionUnlocked();
    ensureShadowPackNpcs();
    setProfileIndexTick((n) => n + 1);
    navigateToPhase("commandCenter");
  };

  const finishChargen = (w: CharacterSheet) => {
    const finalized = normalizeCharacterSheet(w);
    saveSheet(finalized);
    setSheet(finalized);
    const meta = loadMeta();
    const firstSeal = !meta.sheetLocked;
    saveMeta({
      ...meta,
      sheetLocked: true,
      lastFamineTickAt: firstSeal ? famineSealWallClock() : meta.lastFamineTickAt,
    });
    appendXpLog(
      firstSeal ? `[CODEX_COMMIT]: ${finalized.name || "NULL"}` : `[CODEX_RELAY]: MJ · ${finalized.name || "NULL"}`,
    );
    setSheetLocked(true);
    navigateToPhase("nexus");
    const aid = getActiveProfileId();
    if (aid) syncActiveBundleFromGlobals(aid);
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      const meta = loadMeta();
      const intervalMs = meta.famineIntervalMinutes * 60_000;
      if (intervalMs <= 0) return;
      if (Date.now() - meta.lastFamineTickAt < intervalMs) return;

      const current = loadSheet();
      if (!current) return;

      if (current.hunger >= 5) {
        saveMeta({ ...meta, lastFamineTickAt: Date.now() });
        return;
      }

      const nextHunger = Math.min(5, current.hunger + 1);
      const nextSheet = { ...current, hunger: nextHunger };
      saveSheet(nextSheet);
      setSheet(nextSheet);
      saveMeta({ ...meta, lastFamineTickAt: Date.now() });
      appendXpLog(`[CLOCK_TICK]: Σh+1 → ${nextHunger}/5`);
    }, 45000);

    return () => window.clearInterval(id);
  }, []);

  function pushLog(part: Omit<NarrativeLogEntry, "id" | "ts"> & { ts?: number; id?: string }) {
    const strand = part.strand ?? activeStrandRef.current;
    const entry: NarrativeLogEntry = {
      id: part.id?.trim() ? part.id.trim() : uid(),
      ts: part.ts ?? Date.now(),
      role: part.role,
      text: part.text,
      strand,
      ...(part.cronistaOut ? { cronistaOut: true } : {}),
      ...(Array.isArray(part.suggestions) && part.suggestions.length
        ? { suggestions: part.suggestions.slice(0, 8) }
        : {}),
      ...(part.rollPrompt ? { rollPrompt: part.rollPrompt } : {}),
      ...(part.beastTone ? { beastTone: true } : {}),
    };
    setLogs((prev) => {
      const next = [...prev, entry];
      saveNarrativeLog(next);
      queueMicrotask(() => {
        const aid = getActiveProfileId();
        if (aid) syncActiveBundleFromGlobals(aid);
      });
      return next;
    });
  }

  const genesisSnap = useMemo(() => loadChronicle(), [logs.length, profileIndexTick]);
  const pendingSynapticPreview = peekPendingSynapticDisruption()?.trim() ?? "";

  const soloNexoDigest = useMemo(() => {
    const aid = getActiveProfileId();
    if (!aid) return null;
    return buildSoloNexoDigest(aid, sheet);
  }, [sheet, profileIndexTick, phase]);

  const chronicleAsideProps = {
    chronicle: genesisSnap,
    inquisitionThreat,
    pendingSynaptic: pendingSynapticPreview,
    soloDigest: soloNexoDigest,
  } as const;

  useEffect(() => {
    if (phase !== "commandCenter") return;
    if (isOperatorSessionUnlocked()) return;
    navigateToPhase("profileHub", { replace: true });
  }, [phase, navigateToPhase]);

  const emitMj = () => {
    const cmd = mjCmd.trim();
    if (!cmd || !isNarrator) return;
    appendMjDirective(cmd);
    pushLog({ role: "sistema", text: `//_MJ · ${cmd}` });
    setMjCmd("");
    setAdminOpen(false);
  };

  const tweakRemoteSimulation = () => {
    if (!isNarrator) return;
    handleSheetMutation({ ...sheet, hunger: Math.min(5, sheet.hunger + 1) }, "[SIM]: Σh+1");
  };

  const persistFamine = (minutes: number) => {
    const clamped = Math.max(5, Math.min(240, minutes));
    saveMeta({
      ...loadMeta(),
      famineIntervalMinutes: clamped,
    });
    setFamineIntervalMinutesCtx(clamped);
    appendXpLog(`[CLOCK_CONFIG]:Δ=${clamped}m`);
  };

  const mainFrameClass = "flex min-h-screen flex-col bg-black";

  const goToLogin = () => {
    persistActiveProfile();
    clearSchreckAuth();
    clearOperatorSessionUnlock();
    setIsNarrator(false);
    navigateToPhase("login", { replace: true });
  };

  const goToProfileHub = () => {
    persistActiveProfile();
    navigateToPhase("profileHub");
  };

  const enterProfile = (id: string) => {
    if (!selectProfile(id)) return;
    applyGlobalsToUi(setSheet, setSheetLocked, setLogs, commitStrand);
    navigateToPhase("nexus");
    appendXpLog(`Sesión cargada · ${loadSheet()?.name?.trim() || id}`);
  };

  const startBlankSheet = () => {
    createBlankProfile();
    applyGlobalsToUi(setSheet, setSheetLocked, setLogs, commitStrand);
    navigateToPhase("chargen");
  };

  if (phase === "login") {
    return <SchreckNetLogin onAuthenticate={applyLogin} onRootAccess={applyRootAccess} />;
  }

  if (phase === "commandCenter") {
    return (
      <NarratorCommandCenter
        profiles={hubProfiles}
        onProfilesChange={() => setProfileIndexTick((n) => n + 1)}
        onFactoryReset={() => {
          factoryResetLocalNexoPreserveGenesis();
          applyGlobalsToUi(setSheet, setSheetLocked, setLogs, commitStrand);
          setProfileIndexTick((n) => n + 1);
          setInquisitionThreat(2);
          navigateToPhase("profileHub");
        }}
        onGoHub={() => navigateToPhase("profileHub")}
        onGoNexus={() => {
          const id = getActiveProfileId();
          if (!id) {
            window.alert("No hay perfil activo. Abre REGISTRO_CV y selecciona un CV.");
            return;
          }
          if (!selectProfile(id)) return;
          applyGlobalsToUi(setSheet, setSheetLocked, setLogs, commitStrand);
          navigateToPhase("nexus");
        }}
        onRefreshGlobals={() =>
          applyGlobalsToUi(setSheet, setSheetLocked, setLogs, commitStrand)
        }
      />
    );
  }

  if (phase === "profileHub") {
    return (
      <ProfileHub
        profiles={hubProfiles}
        activeProfileId={getActiveProfileId()}
        onPlayProfile={(id) => enterProfile(id)}
        onNewSheetBlank={startBlankSheet}
        onLogout={goToLogin}
        onClearLocalProfiles={() => {
          clearLocalPlayerProfilesOnly();
          applyGlobalsToUi(setSheet, setSheetLocked, setLogs, commitStrand);
          setProfileIndexTick((n) => n + 1);
        }}
      />
    );
  }

  if (phase === "soloCampaign") {
    if (!getActiveProfileId()) {
      navigateToPhase("profileHub", { replace: true });
      return null;
    }
    return <SoloCampaignPhaseRedirect onRedirect={replaceSoloBookmarkWithNexus} />;
  }

  if (phase === "chargen") {
    const meta = loadMeta();
    const stored = loadSheet();
    const activeId = getActiveProfileId();
    const activeBundleSheet = activeId ? loadBundle(activeId)?.sheet ?? null : null;
    const safeStored = stored && stored.name?.trim() ? stored : activeBundleSheet;
    const mechanicalLocked = Boolean(meta.sheetLocked && !isNarrator && stored?.name?.trim());

    const initialForChargen: CharacterSheet =
      meta.sheetLocked && isNarrator && safeStored
        ? mergeStoredSheet(safeStored)
        : safeStored && safeStored.name?.trim()
          ? mergeStoredSheet(safeStored)
          : emptySheet();

    function persistCodexNarrative(s: CharacterSheet) {
      const next = normalizeCharacterSheet(s);
      saveSheet(next);
      setSheet(next);
      persistActiveProfile();
      navigateToPhase("nexus");
      appendXpLog(`Identidad marcada · ${next.name?.trim() || "—"}`);
    }

    const pid = activeId;
    const soloProg = pid ? loadSoloProgress(pid, initialForChargen.clan) : null;
    const soloXp = soloProg?.chronicleExperience ?? 0;

    function spendChronicleXp(cost: number): boolean {
      if (!pid) return false;
      const latest = loadSoloProgress(pid, initialForChargen.clan);
      if (!latest) return false;
      const pool = Math.max(0, Math.floor(latest.chronicleExperience ?? 0));
      const c = Math.max(0, Math.floor(cost));
      if (c <= 0 || pool < c) return false;
      const next = { ...latest, chronicleExperience: pool - c, updatedAt: latest.updatedAt + 1 };
      saveSoloProgress(next);
      syncActiveBundleFromGlobals(pid);
      return true;
    }

    return (
      <div className="min-h-screen bg-[#050505]">
        <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 font-sans text-[10px] text-neutral-500">
          <span className="tracking-[0.28em] text-neutral-400">Codex V</span>
          <button
            type="button"
            onClick={() => navigateToPhase("nexus", { replace: true })}
            className="rounded border border-white/10 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-neutral-400 transition hover:border-neutral-600 hover:text-neutral-200"
          >
            Volver al Nexo
          </button>
        </header>
        <CharacterCreation
          initial={initialForChargen}
          mechanicalLocked={mechanicalLocked}
          chronicleXpAvailable={soloXp}
          onSpendChronicleXp={spendChronicleXp}
          onSave={(s) => {
            if (mechanicalLocked) {
              persistCodexNarrative(s);
              return;
            }
            finishChargen(s);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${mainFrameClass} text-neutral-200`}
      style={{ ["--accent-clan"]: accent } as CSSProperties}
    >
      <ForcedDestinyOverlay
        forced={forcedRoll}
        sheet={sheet}
        hungerLevel={sheet.hunger}
        onConsume={(line) => {
          appendXpLog(line);
          pushLog({ role: "sistema", text: line });
          clearForcedRoll();
        }}
      />

      <header className="flex shrink-0 flex-col gap-3 border-b border-[#1a1a1e] bg-[#050506] px-3 py-3 font-sans text-[10px] text-neutral-500 sm:px-4 sm:py-4 sm:gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-6 xl:px-6">
        <div className="min-w-0 flex-1 space-y-1.5 xl:hidden">
          <p className="text-[11px] font-light tracking-[0.32em] text-neutral-300">Codex V · ciudad</p>
          <p className="truncate text-[13px] font-medium tracking-tight text-neutral-100">
            <span style={{ color: accent }}>{sheet.name?.trim() || "Sin nombre"}</span>
            <span className="text-neutral-600"> · </span>
            <span className="text-neutral-400">{clanLabelDisplay}</span>
          </p>
          {isNarrator ? (
            <p className="text-[9px] tracking-wide text-neutral-600">
              σ {inquisitionThreat} · Reloj {famineIntervalMinutes}m
            </p>
          ) : null}
        </div>
        <div
          className="hidden min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-neutral-600 xl:flex"
          aria-label="Estado de sesión"
        >
          <span className="font-serif text-sm font-semibold tracking-[0.38em] text-neutral-100">CODEX V</span>
          <span className="text-neutral-700">·</span>
          <span style={{ color: accent }} className="font-medium text-neutral-300">
            {STRAND_TAG[activeStrand]}
          </span>
          {isNarrator ? (
            <span className="text-neutral-600">
              σ {inquisitionThreat} · Reloj {famineIntervalMinutes}m
            </span>
          ) : null}
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-2.5 border-t border-white/[0.04] pt-3 sm:gap-3 xl:w-auto xl:border-t-0 xl:pt-0">
          <TechnicalHud
            healthFilled={healthHudFilled}
            healthMax={HEALTH_MAX_UI}
            hunger={sheet.hunger}
            compactLabels
            hideMetagameFooter
            className="xl:hidden"
          />
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => {
                persistActiveProfile();
                navigateToPhase("chargen");
              }}
              className="border border-white/10 bg-black/40 px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-neutral-300 hover:border-[color:var(--accent-clan)]/40"
            >
              CODEX
            </button>
            <button
              type="button"
              onClick={goToProfileHub}
              className="border border-white/[0.06] px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-neutral-500 hover:border-neutral-700 hover:text-neutral-300"
            >
              CRIPTA
            </button>
            <button
              type="button"
              onClick={goToLogin}
              className="border border-[var(--blood)]/35 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-[var(--blood)] hover:bg-[var(--blood)]/10"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {isNarrator && remoteCampaignStore ? (
        <CampaignSyncBar
          value={campaignSync}
          onChange={(next) => {
            saveCampaignSyncSettings(next);
            setCampaignSync(next);
          }}
          remoteStoreReady={remoteCampaignStore}
        />
      ) : null}

      {(() => {
        const soloShellActive =
          activeStrand === "paralela" &&
          Boolean(nexusActiveProfileId) &&
          isSoloSupportedClan(sheet.clan);

        const nexoCenterColumn = (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden px-3 py-3 sm:px-4 sm:py-4 xl:gap-5 xl:px-6 xl:py-5">
            <NexoChannelPanel
              accent={accent}
              activeStrand={activeStrand}
              onStrandChange={(nextStrand) => {
                if (nextStrand !== "paralela") {
                  commitStrand(nextStrand);
                  return;
                }
                const id = getActiveProfileId();
                if (!id) {
                  goToProfileHub();
                  return;
                }
                reconcileActiveProfileIfGlobalsStale();
                applyGlobalsToUi(setSheet, setSheetLocked, setLogs, commitStrand);
                const clanNow = loadSheet()?.clan ?? sheet.clan;
                if (!isSoloSupportedClan(clanNow)) {
                  navigateToPhase("chargen");
                  return;
                }
                commitStrand("paralela");
              }}
              identityHint={identityHint}
              showTechnicalAnchors={isNarrator}
              glyphContext={{ inquisitionThreat, hunger: sheet.hunger }}
              llmReady={nexoLlmReady}
            >
              {activeStrand === "paralela" ? (
                nexusActiveProfileId ? (
                  isSoloSupportedClan(sheet.clan) ? (
                    <SoloCampaignApp
                      key={nexusActiveProfileId}
                      profileId={nexusActiveProfileId}
                      sheet={sheet}
                      embedded
                      providerWrapped={soloShellActive}
                      emitParalelaNarration={(text) => pushLog({ role: "narrador", text, strand: "paralela" })}
                      onExit={() => commitStrand("principal")}
                      onSheetSynced={(next) => {
                        setSheet(mergeStoredSheet(next));
                        persistActiveProfile();
                      }}
                    />
                  ) : null
                ) : (
                  <div className="flex min-h-[min(40vh,22rem)] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                    <p className="max-w-sm font-sans text-sm leading-relaxed text-neutral-400">
                      La campaña solitaria usa tu ficha activa. Elige o crea un personaje en CRIPTA.
                    </p>
                    <button
                      type="button"
                      onClick={goToProfileHub}
                      className="border border-[var(--terminal)]/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--terminal)] hover:bg-[var(--terminal)]/10"
                    >
                      Ir al registro
                    </button>
                  </div>
                )
              ) : null}
            </NexoChannelPanel>
            <details className="xl:hidden rounded-xl border border-white/[0.06] bg-black/35 px-4 py-3">
              <summary className="cursor-pointer text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Eco del mundo
              </summary>
              <div className="mt-3 max-h-[48vh] overflow-y-auto rounded-lg border border-white/[0.04]">
                <NexoChronicleDigest {...chronicleAsideProps} />
              </div>
            </details>
          </div>
        );

        const threeColumns = (
          <div className="flex min-h-0 flex-1 flex-col xl:flex-row xl:items-stretch">
          {(() => {
            const pid = getActiveProfileId();
            const prog = pid && isSoloSupportedClan(sheet.clan) ? loadSoloProgress(pid, sheet.clan) : null;
            const xp = prog?.chronicleExperience ?? 0;
            return (
              <SidebarMesa
                accent={accent}
                sheet={sheet}
                chronicleXp={xp}
                citySigma={inquisitionThreat}
                healthFilled={healthHudFilled}
                healthMax={HEALTH_MAX_UI}
                hunger={sheet.hunger}
                soloSceneNav={soloShellActive ? <SoloSceneNav /> : undefined}
                onEidolonVault={goToProfileHub}
                onCodex={() => {
                  persistActiveProfile();
                  navigateToPhase("chargen");
                }}
                onLogout={goToLogin}
              />
            );
          })()}

            {nexoCenterColumn}

            <aside className="hidden min-h-0 shrink-0 self-stretch border-l border-white/[0.06] bg-[linear-gradient(180deg,#060607,#0a0a0d)] xl:flex xl:w-[min(24vw,18rem)] xl:max-w-xs xl:flex-col xl:overflow-hidden 2xl:w-[min(18vw,20rem)] 2xl:max-w-sm">
              <div className="border-b border-white/[0.05] px-5 py-4 font-sans text-[10px] font-light uppercase tracking-[0.35em] text-neutral-500">
                Eco
              </div>
              <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                <NexoChronicleDigest {...chronicleAsideProps} />
              </div>
            </aside>
          </div>
        );

        if (soloShellActive && nexusActiveProfileId) {
          return (
            <SoloCampaignProvider
              key={nexusActiveProfileId}
              initialProgress={ensureSoloProgress(nexusActiveProfileId, sheet)}
            >
              {threeColumns}
            </SoloCampaignProvider>
          );
        }

        return threeColumns;
      })()}

      <AdminConsole
        open={adminOpen}
        onToggle={() => setAdminOpen((x) => !x)}
        isNarrator={isNarrator}
        onToggleNarrator={(v) => setIsNarrator(v)}
        inquisitionThreat={inquisitionThreat}
        onThreat={setInquisitionThreat}
        famineIntervalMinutes={famineIntervalMinutes}
        onFamineChange={persistFamine}
        forcedDifficulty={rollDifficulty}
        onForcedDifficulty={setRollDifficulty}
        command={mjCmd}
        onCommand={setMjCmd}
        onEmitCommand={emitMj}
        onStressHunger={tweakRemoteSimulation}
        onForcedFrenesy={() => requestForcedRoll("frenesy", rollDifficulty)}
        onForcedRage={() => requestForcedRoll("enardecimiento", rollDifficulty)}
      />

    </div>
  );
}
