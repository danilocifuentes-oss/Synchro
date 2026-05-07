"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TechnicalHud from "@/components/TechnicalHud";
import DiceRollerD10 from "@/components/DiceRollerD10";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { useSettings } from "@/context/SettingsContext";
import { IconAvatarSigil } from "@/components/icons";
import { IconBookAnimated } from "@/components/icons/animated";
import CodexModal from "@/components/CodexModal";

type Props = {
  identity: { nombre: string; clan?: string };
  status: {
    ansia: number;
    voluntad: { current: number; max: number };
    daño: { current: number; max: number };
  };
  onRoll?: (value: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function SoloCampaignHeader({ identity, status, onRoll, onPrev, onNext }: Props) {
  const router = useRouter();
  const sysReduced = usePrefersReducedMotion();
  const { settings } = useSettings();
  const effectiveReduced = settings.reducedMotionOverride == null ? sysReduced : settings.reducedMotionOverride;
  const [codexOpen, setCodexOpen] = useState(false);
  const iconHover = effectiveReduced ? {} : { whileHover: { scale: 1.06, y: -2 }, transition: { duration: 0.14 } };

  return (
    <>
      <header className="mb-4 flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            className="sharp-border-inner rounded-md bg-[rgba(255,255,255,0.01)] p-3"
            {...(effectiveReduced ? {} : iconHover)}
          >
            <div className="flex items-center gap-2 font-grotesk text-sm">
              <IconAvatarSigil className="icon" />
              <span>{identity.nombre}</span>
            </div>
            <div className="text-xs text-[var(--accent-muted)]">{identity.clan}</div>
          </motion.div>

          <div>
            <TechnicalHud ansia={status.ansia} voluntad={status.voluntad} daño={status.daño} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={() => setCodexOpen(true)}
            className="flex items-center gap-2 rounded border border-[rgba(255,255,255,0.04)] px-3 py-2"
            aria-label="Abrir Codex V"
            {...(effectiveReduced ? {} : iconHover)}
          >
            <IconBookAnimated className="icon" />
            <span>Codex V</span>
          </motion.button>
          <button
            type="button"
            onClick={onPrev}
            className="rounded border border-[rgba(255,255,255,0.04)] px-3 py-2"
            aria-label="Escena anterior"
          >
            Atrás
          </button>
          <DiceRollerD10 onResult={(v) => onRoll?.(v)} />
          <button
            type="button"
            onClick={onNext}
            className="rounded border border-[rgba(255,255,255,0.04)] px-3 py-2"
            aria-label="Siguiente escena"
          >
            Adelante
          </button>
        </div>
      </header>

      {codexOpen ? (
        <CodexModal
          onClose={() => setCodexOpen(false)}
          onNavigate={() => {
            setCodexOpen(false);
            router.push("/codex");
          }}
        />
      ) : null}
    </>
  );
}

