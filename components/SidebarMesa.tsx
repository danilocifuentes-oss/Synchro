"use client";

import React from "react";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { useSettings } from "@/context/SettingsContext";
import { useCharacter } from "@/context/CharacterContext";
import { MaterialSchreckIcon } from "@/components/icons/NexusLibrary";

type Discipline = {
  id: string;
  name: string;
  glyph?: string;
  level: number;
};

function disciplineIconName(id: string): string {
  const k = id.toLowerCase();
  if (k.includes("dominate")) return "neurology";
  if (k.includes("obfuscate")) return "visibility_off";
  if (k.includes("celerity")) return "bolt";
  if (k.includes("fortitude")) return "security";
  if (k.includes("auspex")) return "visibility";
  if (k.includes("presence")) return "flare";
  if (k.includes("protean")) return "pets";
  if (k.includes("blood")) return "water_drop";
  return "fiber_manual_record";
}

export function SidebarMesa({
  disciplines = [],
  onEnterNexo,
  onOpenCodex,
  onLogout,
}: {
  disciplines?: Discipline[];
  onEnterNexo?: () => void;
  onOpenCodex?: () => void;
  onLogout?: () => void;
}) {
  const sysReduced = usePrefersReducedMotion();
  const { settings } = useSettings();
  const effectiveReduced = settings.reducedMotionOverride == null ? sysReduced : settings.reducedMotionOverride;
  const { character } = useCharacter();
  const identity = character.identity;
  const status = character.status;

  const containerVariants = {
    hidden: { opacity: 0, x: -8 },
    show: { opacity: 1, x: 0, transition: { staggerChildren: 0.06, when: "beforeChildren", duration: 0.22 } },
  };
  const cardVariant = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.2 } } };

  return (
    <motion.aside
      className="sticky top-6 flex w-full max-w-xs flex-col gap-4 bg-[var(--panel)] p-4 sharp-border-inner"
      initial="hidden"
      animate="show"
      variants={effectiveReduced ? { hidden: {}, show: {} } : containerVariants}
    >
      <motion.div variants={effectiveReduced ? { hidden: {}, show: {} } : cardVariant}>
        <IdentityCard identity={identity} onEnterNexo={onEnterNexo} />
      </motion.div>

      <motion.div variants={effectiveReduced ? { hidden: {}, show: {} } : cardVariant}>
        <V5StatusPanel status={status} reduced={effectiveReduced} />
      </motion.div>

      <motion.div variants={effectiveReduced ? { hidden: {}, show: {} } : cardVariant}>
        <DisciplinesGrid disciplines={disciplines} />
      </motion.div>

      <motion.div className="mt-auto" variants={effectiveReduced ? { hidden: {}, show: {} } : cardVariant}>
        <QuickControls onOpenCodex={onOpenCodex} onLogout={onLogout} />
      </motion.div>
    </motion.aside>
  );
}

function IdentityCard({
  identity,
  onEnterNexo,
}: {
  identity: { nombre: string; clan?: string; generacion?: string; generación?: string; avatar?: string };
  onEnterNexo?: () => void;
}) {
  return (
    <div className="rounded-md bg-[rgba(255,255,255,0.01)] p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-[rgba(255,255,255,0.02)]">
          {identity.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={identity.avatar} alt={`${identity.nombre} avatar`} className="h-full w-full object-cover" />
          ) : (
            <div className="font-mono text-[var(--terminal)]">{identity.nombre?.charAt(0)?.toUpperCase()}</div>
          )}
        </div>
        <div className="flex-1">
          <div className="font-grotesk text-sm leading-tight">{identity.nombre}</div>
          <div className="text-xs text-[var(--accent-muted)]">
            {identity.clan ?? "Clan desconocido"} • {identity.generación ?? identity.generacion ?? "Generación ?"}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onEnterNexo}
          className="flex-1 rounded bg-[var(--terminal)] px-3 py-2 text-sm font-semibold text-black hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--terminal-dim)]"
          aria-label="Entrar al Nexo"
        >
          <span className="inline-flex items-center gap-1.5">
            <MaterialSchreckIcon name="terminal" className="!text-black" />
            <span>Entrar al Nexo</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => window.alert("Abrir hoja")}
          className="rounded border border-[rgba(255,255,255,0.04)] px-2 py-2 text-sm"
          aria-label="Ver hoja"
        >
          <span className="inline-flex items-center gap-1">
            <MaterialSchreckIcon name="menu_book" />
            <span>Hoja</span>
          </span>
        </button>
      </div>
    </div>
  );
}

function V5StatusPanel({
  status,
  reduced,
}: {
  status: { ansia: number; voluntad: { current: number; max: number }; daño: { current: number; max: number }; px?: number };
  reduced: boolean;
}) {
  const voluntadPct = Math.max(0, Math.min(100, Math.round((status.voluntad.current / Math.max(1, status.voluntad.max)) * 100)));
  const danoPct = Math.max(0, Math.min(100, Math.round((status.daño.current / Math.max(1, status.daño.max)) * 100)));

  return (
    <div className="rounded-md bg-[rgba(255,255,255,0.01)] p-3">
      <h3 className="mb-2 text-xs font-semibold text-[var(--accent-muted)]">Estado V5</h3>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-mono text-[var(--terminal)]">Ansia</span>
          <span className="text-xs text-[var(--accent-muted)]">{status.ansia}/5</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-[rgba(255,255,255,0.02)]">
          <div
            className="h-full bg-[var(--crimson)]"
            style={{
              width: `${(status.ansia / 5) * 100}%`,
              transition: reduced ? "none" : "width 400ms ease",
            }}
            aria-hidden
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-mono text-[var(--terminal)]">Voluntad</span>
          <span className="text-xs text-[var(--accent-muted)]">
            {status.voluntad.current}/{status.voluntad.max}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-[rgba(255,255,255,0.02)]">
          <div
            className="h-full bg-[var(--terminal)]"
            style={{ width: `${voluntadPct}%`, transition: reduced ? "none" : "width 400ms ease" }}
            aria-hidden
          />
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-mono text-[var(--terminal)]">Daño físico</span>
          <span className="text-xs text-[var(--accent-muted)]">
            {status.daño.current}/{status.daño.max}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-[rgba(255,255,255,0.02)]">
          <div
            className="h-full bg-[var(--blood)]"
            style={{ width: `${danoPct}%`, transition: reduced ? "none" : "width 400ms ease" }}
            aria-hidden
          />
        </div>
      </div>

      {typeof status.px !== "undefined" ? (
        <div className="mt-3 text-xs text-[var(--accent-muted)]">
          PX: <span className="font-mono text-[var(--terminal)]">{status.px}</span>
        </div>
      ) : null}
    </div>
  );
}

function DisciplinesGrid({ disciplines }: { disciplines: Discipline[] }) {
  return (
    <div className="rounded-md bg-[rgba(255,255,255,0.01)] p-3">
      <h4 className="mb-2 text-xs font-semibold text-[var(--accent-muted)]">Disciplinas</h4>
      <div className="grid grid-cols-4 gap-2">
        {disciplines.map((d) => (
          <button
            key={d.id}
            type="button"
            className="flex flex-col items-center rounded bg-[rgba(255,255,255,0.02)] p-2 text-center hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[var(--terminal-dim)]"
            aria-label={`${d.name} nivel ${d.level}`}
            title={`${d.name} — nivel ${d.level}`}
            onClick={() => window.alert(`Abrir disciplina ${d.name}`)}
          >
            <div className="mb-1 flex h-8 w-8 items-center justify-center text-lg text-[var(--neon)]">
              {d.glyph ? <span>{d.glyph}</span> : <MaterialSchreckIcon name={disciplineIconName(d.id)} />}
            </div>
            <div className="text-[10px] text-[var(--accent-muted)]">{d.level}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuickControls({ onOpenCodex, onLogout }: { onOpenCodex?: () => void; onLogout?: () => void }) {
  return (
    <div className="mt-auto rounded-md bg-[rgba(255,255,255,0.01)] p-3">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => (onOpenCodex ? onOpenCodex() : window.alert("Abrir CODEX"))}
          className="w-full rounded bg-[var(--terminal)] px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[var(--terminal-dim)]"
          aria-label="Abrir Codex"
        >
          <span className="inline-flex items-center gap-1.5">
            <MaterialSchreckIcon name="menu_book" className="!text-black" />
            <span>CODEX</span>
          </span>
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.alert("Abrir Bóveda")}
            className="flex-1 rounded border border-[rgba(255,255,255,0.04)] px-3 py-2 text-sm"
            aria-label="Abrir bóveda"
          >
            <span className="inline-flex items-center gap-1.5">
              <MaterialSchreckIcon name="lock" />
              <span>Bóveda</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => (onLogout ? onLogout() : (window.location.href = "/"))}
            className="rounded border border-[var(--blood)] px-3 py-2 text-sm text-[var(--blood)]"
            aria-label="Cerrar sesión"
          >
            <span className="inline-flex items-center gap-1.5">
              <MaterialSchreckIcon name="logout" />
              <span>Logout</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarMesa;

