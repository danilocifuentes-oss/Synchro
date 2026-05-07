"use client";

import { type ReactNode } from "react";
import { CLAN_OPTIONS, type CharacterSheet } from "@/lib/character";
import { disciplineLabel, getActiveDisciplineKeys, type DisciplineKey } from "@/lib/sereno";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type Props = {
  accent: string;
  sheet: CharacterSheet;
  /** PX de crónica disponibles (campaña solitaria). */
  chronicleXp?: number;
  /** Amenaza Σ ciudad (0–5) — sincronizada con mesa / AdminConsole. */
  citySigma: number;
  healthFilled: number;
  healthMax: number;
  hunger: number;
  onEidolonVault: () => void;
  onCodex: () => void;
  onLogout: () => void;
  /** Campaña solitaria: selector de escena del capítulo actual. */
  soloSceneNav?: ReactNode;
};

type DisciplineItem = {
  id: DisciplineKey;
  name: string;
  glyph: string;
  level: number;
};

type V5Status = {
  ansia: number;
  voluntad: { current: number; max: number };
  dañoFisico: { current: number; max: number };
  pxCrónica?: number;
};

function disciplineGlyph(k: DisciplineKey): string {
  switch (k) {
    case "animalism": return "🐾";
    case "auspex": return "◉";
    case "blood_sorcery": return "🜏";
    case "celerity": return "⚡";
    case "dominate": return "⌘";
    case "fortitude": return "⛨";
    case "obfuscate": return "◧";
    case "potence": return "✦";
    case "presence": return "✶";
    case "protean": return "◇";
    default:
      return "◦";
  }
}

function clanLabel(clan: CharacterSheet["clan"]): string {
  return CLAN_OPTIONS.find((o) => o.id === clan)?.label ?? clan;
}

function generationTag(gen: CharacterSheet["generation"]): string {
  const g = String(gen).toUpperCase();
  return g.replace(/_/g, "·");
}

function IdentityCard({
  name,
  clan,
  generation,
  accent,
  onEnterNexo,
}: {
  name: string;
  clan: string;
  generation: string;
  accent: string;
  onEnterNexo?: () => void;
}) {
  return (
    <section className="rounded-md border border-white/[0.08] bg-[var(--glass)] p-3 sharp-border-inner">
      <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--terminal)]/70">Sujeto identificado</p>
      <h3 className="mt-1 truncate font-sans text-base font-semibold text-neutral-100">{name}</h3>
      <p className="text-[10px] uppercase tracking-wider text-neutral-500">
        <span style={{ color: accent }}>{clan}</span> · Gen {generation}
      </p>
      {onEnterNexo ? (
        <button
          type="button"
          onClick={onEnterNexo}
          className="mt-3 w-full rounded border border-[var(--terminal-dim)] px-2 py-2 text-xs text-[var(--terminal)] hover:bg-[var(--terminal-dim)]/20"
        >
          Entrar al Nexo
        </button>
      ) : null}
    </section>
  );
}

function V5StatusPanel({ status, reduced }: { status: V5Status; reduced: boolean }) {
  const voluntadPct = Math.max(
    0,
    Math.min(100, Math.round((status.voluntad.current / Math.max(1, status.voluntad.max)) * 100)),
  );
  const dañoPct = Math.max(
    0,
    Math.min(100, Math.round((status.dañoFisico.current / Math.max(1, status.dañoFisico.max)) * 100)),
  );
  const ansiaPct = Math.max(0, Math.min(100, Math.round((status.ansia / 5) * 100)));

  return (
    <section className="rounded-md border border-white/[0.08] bg-[var(--glass)] p-3 sharp-border-inner">
      <p className="mb-3 text-[9px] uppercase tracking-[0.22em] text-neutral-500">Estado V5</p>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-mono text-[var(--terminal)]">Ansia</span>
          <span className="text-[var(--accent-muted)]">{status.ansia}/5</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-white/[0.05]">
          <div
            className="h-full bg-[var(--crimson)]"
            style={{ width: `${ansiaPct}%`, transition: reduced ? "none" : "width 400ms ease" }}
            aria-hidden
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-mono text-[var(--terminal)]">Voluntad</span>
          <span className="text-[var(--accent-muted)]">
            {status.voluntad.current}/{status.voluntad.max}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-white/[0.05]">
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
          <span className="text-[var(--accent-muted)]">
            {status.dañoFisico.current}/{status.dañoFisico.max}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-white/[0.05]">
          <div
            className="h-full bg-[var(--blood)]"
            style={{ width: `${dañoPct}%`, transition: reduced ? "none" : "width 400ms ease" }}
            aria-hidden
          />
        </div>
      </div>

      {typeof status.pxCrónica !== "undefined" ? (
        <p className="mt-3 text-xs text-[var(--accent-muted)]">
          PX: <span className="font-mono text-[var(--terminal)]">{status.pxCrónica}</span>
        </p>
      ) : null}
    </section>
  );
}

function DisciplinesGrid({ disciplines }: { disciplines: DisciplineItem[] }) {
  return (
    <section className="rounded-md border border-white/[0.08] bg-[var(--glass)] p-3 sharp-border-inner">
      <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-neutral-500">Disciplinas</p>
      <div className="grid grid-cols-3 gap-2">
        {disciplines.map((d) => (
          <button
            key={d.id}
            type="button"
            className="flex flex-col items-center rounded bg-white/[0.03] p-2 text-center hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--terminal-dim)]"
            aria-label={`${d.name} nivel ${d.level}`}
            title={`${d.name} — nivel ${d.level}`}
          >
            <span className="text-base leading-none text-[var(--terminal)]">{d.glyph}</span>
            <span className="mt-1 text-[8px] uppercase tracking-wide text-neutral-500">{d.name.slice(0, 10)}</span>
            <span className="text-xs font-mono text-neutral-300">{d.level}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function QuickControls({
  onOpenCodex,
  onOpenVault,
  onLogout,
}: {
  onOpenCodex?: () => void;
  onOpenVault?: () => void;
  onLogout?: () => void;
}) {
  return (
    <section className="space-y-2 border-t border-white/[0.08] pt-3">
      <button
        type="button"
        onClick={onOpenCodex}
        className="w-full rounded bg-[var(--terminal)] px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[var(--terminal-dim)]"
      >
        CODEX
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onOpenVault}
          className="flex-1 rounded border border-white/[0.08] px-3 py-2 text-sm text-neutral-300"
        >
          Bóveda
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded border border-[var(--blood)] px-3 py-2 text-sm text-[var(--blood)]"
        >
          Logout
        </button>
      </div>
    </section>
  );
}

export function SidebarMesa({
  accent,
  sheet,
  chronicleXp,
  citySigma,
  healthFilled,
  healthMax,
  hunger,
  onEidolonVault,
  onCodex,
  onLogout,
  soloSceneNav,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const disciplineKeys = getActiveDisciplineKeys(sheet.clan, sheet.caitiffDisciplinePicks);
  const disciplines: DisciplineItem[] = disciplineKeys.map((dk) => ({
    id: dk,
    name: disciplineLabel(dk),
    glyph: disciplineGlyph(dk),
    level: Math.max(0, Math.round(sheet.disciplines[dk] ?? 0)),
  }));

  const status: V5Status = {
    ansia: Math.max(0, Math.min(5, hunger)),
    voluntad: { current: sheet.willpowerCur, max: sheet.willpowerMax },
    dañoFisico: { current: Math.max(0, healthMax - healthFilled), max: healthMax },
    pxCrónica: typeof chronicleXp === "number" ? Math.max(0, Math.floor(chronicleXp)) : undefined,
  };

  const sigma = Math.max(0, Math.min(5, Math.round(citySigma)));

  return (
    <aside
      className="sticky top-0 hidden min-h-0 w-[min(16rem,100%)] shrink-0 flex-col border-r border-white/[0.06] bg-[var(--void)] font-mono xl:flex"
      aria-label="Terminal mesa SchreckNet"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <IdentityCard
          name={sheet.name?.trim() || "Sin nombre"}
          clan={clanLabel(sheet.clan)}
          generation={generationTag(sheet.generation)}
          accent={accent}
        />

        <V5StatusPanel status={status} reduced={reduced} />

        <DisciplinesGrid disciplines={disciplines} />

        {soloSceneNav ? <div className="space-y-2">{soloSceneNav}</div> : null}

        <QuickControls onOpenCodex={onCodex} onOpenVault={onEidolonVault} onLogout={onLogout} />

        <section className="mt-auto rounded-md border border-white/[0.08] bg-[var(--danger-glow)] p-3 sharp-border-inner">
          <p className="text-[9px] uppercase tracking-[0.22em] text-neutral-400">Alerta Σ</p>
          <p className={`mt-1 font-mono text-sm ${sigma > 3 ? "text-[var(--blood)]" : "text-[var(--terminal)]"}`}>
            LEVEL_{sigma}
          </p>
          {sigma > 3 ? (
            <p className="mt-2 text-[10px] leading-snug text-[var(--blood)]">
              Interferencia detectada: Protocolo Silencio activado.
            </p>
          ) : null}
        </section>
      </div>
    </aside>
  );
}
