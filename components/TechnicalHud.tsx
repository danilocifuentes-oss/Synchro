"use client";

import { motion } from "framer-motion";

type Props = {
  healthFilled: number;
  healthMax: number;
  hunger: number;
  /** Voluntad actual / máximo (V5). Si se omite, no se muestra la fila. */
  willpowerCur?: number;
  willpowerMax?: number;
  /** Texto breve junto a cada hilera (orden: ansia · voluntad · daño). */
  compactLabels?: boolean;
  /** Oculta el pie explicativo (menos metajuego en HUD compacto). */
  hideMetagameFooter?: boolean;
  className?: string;
};

export function TechnicalHud({
  healthFilled,
  healthMax,
  hunger,
  willpowerCur,
  willpowerMax,
  compactLabels = false,
  hideMetagameFooter = false,
  className = "",
}: Props) {
  const h = Math.max(0, Math.min(5, hunger));
  const hf = Math.max(0, Math.min(healthMax, healthFilled));
  const wpMax = willpowerMax ?? 0;
  const wpCur = Math.max(0, Math.min(wpMax, willpowerCur ?? 0));
  const showWp = typeof willpowerCur === "number" && typeof willpowerMax === "number" && willpowerMax > 0;

  const ansiaHelp =
    "Ansia (Hambre 0–5): cuántos dados rojos entran en tus tiradas de pool; sube con Despertar fallido, narración o escenas.";
  const wpHelp =
    "Voluntad: cajas para resistir o pagar costes puntuales en mesa; la crónica solitaria no las gasta ya en el Despertar (ahora es tirada d10).";
  const dmgHelp =
    "Daño (integridad física): marcas de herida; recuperas cuando la mesa o la crónica lo indiquen.";

  const labelAnsia = compactLabels ? "Ansia" : "Ansia · dados rojos (0–5)";
  const labelVol = compactLabels ? "Voluntad" : "Voluntad · cajas";
  const labelDmg = compactLabels ? "Daño" : "Daño físico";

  return (
    <div
      className={`flex shrink-0 flex-col gap-3 rounded-lg border border-neutral-900/80 bg-black/35 px-2.5 py-2.5 backdrop-blur-[2px] ${className}`.trim()}
      aria-label="Indicadores V5: Ansia, Voluntad, integridad"
    >
      <div className="space-y-1.5">
        <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-red-950/95" title={ansiaHelp}>
          {labelAnsia}
        </p>
        <motion.div layout className="flex flex-wrap gap-1" aria-hidden title={ansiaHelp}>
          {Array.from({ length: 5 }, (_, i) => (
            <motion.span
              key={`r-${i}`}
              layout
              initial={false}
              animate={{
                opacity: i < h ? 1 : 0.42,
                scale: i < h ? 1.05 : 0.93,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                i < h
                  ? "bg-[var(--blood)] shadow-[0_0_10px_rgba(139,0,0,0.45)] ring-1 ring-red-950/35"
                  : "border border-red-950/70 bg-transparent"
              }`}
            />
          ))}
        </motion.div>
      </div>

      {showWp ? (
        <div className="space-y-1.5">
          <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-[color:var(--terminal)]/85" title={wpHelp}>
            {labelVol}
          </p>
          <motion.div layout className="flex flex-wrap gap-1" aria-hidden title={wpHelp}>
            {Array.from({ length: wpMax }, (_, i) => (
              <motion.span
                key={`wp-${i}`}
                layout
                initial={false}
                animate={{ opacity: i < wpCur ? 1 : 0.35, scale: i < wpCur ? 1 : 0.94 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  i < wpCur
                    ? "bg-[color:var(--terminal)]/90 shadow-[0_0_8px_rgba(167,139,250,0.28)] ring-1 ring-[color:var(--terminal)]/35"
                    : "border border-neutral-800 bg-transparent"
                }`}
              />
            ))}
          </motion.div>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-emerald-800/95" title={dmgHelp}>
          {labelDmg}
        </p>
        <motion.div layout className="flex flex-wrap gap-1" aria-hidden title={dmgHelp}>
          {Array.from({ length: healthMax }, (_, i) => (
            <motion.span
              key={`v-${i}`}
              layout
              initial={false}
              animate={{ opacity: i < hf ? 1 : 0.42, scale: i < hf ? 1 : 0.94 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                i < hf
                  ? "bg-emerald-500/95 shadow-[0_0_10px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/30"
                  : "border border-emerald-950/65 bg-transparent"
              }`}
            />
          ))}
        </motion.div>
      </div>
      {!hideMetagameFooter ? (
        <p className="border-t border-white/[0.04] pt-2 text-[8px] leading-snug tracking-wide text-neutral-600">
          Despertar (disciplinas): 1d10, 6+ no sube Ansia; luego la tirada de disciplina usa tus dados normales + dados rojos =
          Ansia actual. Fracaso de pool no sube Ansia salvo escenas marcadas.
        </p>
      ) : null}
    </div>
  );
}
