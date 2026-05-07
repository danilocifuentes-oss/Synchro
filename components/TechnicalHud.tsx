"use client";

import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

type LegacyProps = {
  healthFilled: number;
  healthMax: number;
  hunger: number;
  willpowerCur?: number;
  willpowerMax?: number;
  compactLabels?: boolean;
  hideMetagameFooter?: boolean;
  className?: string;
};

type ModernProps = {
  ansia: number;
  voluntad: { current: number; max: number };
  daño: { current: number; max: number };
  compact?: boolean;
  className?: string;
};

type TechnicalHudProps = LegacyProps | ModernProps;

function fromLegacyProps(props: LegacyProps): ModernProps {
  const dañoActual = Math.max(0, props.healthMax - props.healthFilled);
  return {
    ansia: props.hunger,
    voluntad: { current: props.willpowerCur ?? 0, max: props.willpowerMax ?? 0 },
    daño: { current: dañoActual, max: props.healthMax },
    compact: props.compactLabels ?? false,
    className: props.className ?? "",
  };
}

export function TechnicalHud(props: TechnicalHudProps) {
  const reduced = usePrefersReducedMotion();
  const p = "healthFilled" in props ? fromLegacyProps(props) : props;
  const compact = p.compact ?? false;
  const className = p.className ?? "";

  const ansia = Math.max(0, Math.min(5, p.ansia));
  const voluntadCur = Math.max(0, p.voluntad.current);
  const voluntadMax = Math.max(0, p.voluntad.max);
  const dañoCur = Math.max(0, p.daño.current);
  const dañoMax = Math.max(1, p.daño.max);
  const votoPct = Math.round((voluntadCur / Math.max(1, voluntadMax)) * 100);
  const dañoPct = Math.round((dañoCur / dañoMax) * 100);

  return (
    <div
      className={`flex items-center gap-3 ${compact ? "text-xs" : "text-sm"} ${className}`.trim()}
      aria-label="Indicadores V5: Ansia, Voluntad, integridad"
    >
      <div className="sharp-border-inner flex items-center gap-2 rounded-md bg-[rgba(255,255,255,0.01)] p-2">
        <div className="font-mono text-[var(--terminal)]">
          {voluntadCur}/{voluntadMax}
        </div>
        <div className="h-2 w-24 overflow-hidden rounded bg-[rgba(255,255,255,0.02)]">
          <div
            style={{
              width: `${votoPct}%`,
              height: "100%",
              background: "var(--terminal)",
              transition: reduced ? "none" : "width 300ms ease",
            }}
          />
        </div>
      </div>

      <div className="sharp-border-inner flex items-center gap-2 rounded-md bg-[rgba(255,255,255,0.01)] p-2">
        <div className="font-mono text-[var(--crimson)]">{ansia}/5</div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded ${i < ansia ? "bg-[var(--crimson)]" : "bg-[rgba(255,255,255,0.02)]"}`}
            />
          ))}
        </div>
      </div>

      <div className="sharp-border-inner flex items-center gap-2 rounded-md bg-[rgba(255,255,255,0.01)] p-2">
        <div className="font-mono text-[var(--blood)]">
          {dañoCur}/{dañoMax}
        </div>
        <div className="h-2 w-20 overflow-hidden rounded bg-[rgba(255,255,255,0.02)]">
          <div
            style={{
              width: `${dañoPct}%`,
              height: "100%",
              background: "var(--blood)",
              transition: reduced ? "none" : "width 300ms ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TechnicalHud;
