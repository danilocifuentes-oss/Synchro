"use client";

import React, { useState } from "react";

type Props = {
  onResult?: (value: number) => void;
  label?: string;
};

export default function DiceRollerD10({ onResult, label = "Tirar d10" }: Props) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const roll = async () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);
    await new Promise((resolve) => setTimeout(resolve, 350));
    const value = Math.floor(Math.random() * 10) + 1;
    setResult(value);
    onResult?.(value);
    setRolling(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={roll}
        className="rounded bg-[var(--neon)] px-3 py-2 font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[var(--terminal-dim)]"
        aria-label={label}
      >
        {rolling ? "Tirando..." : label}
      </button>
      <div className="flex h-10 w-10 items-center justify-center rounded bg-[rgba(255,255,255,0.02)] font-mono text-[var(--terminal)]">
        {result ?? "-"}
      </div>
    </div>
  );
}

