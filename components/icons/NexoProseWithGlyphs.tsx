"use client";

import { IconAvatarSigil, IconBlood, IconBook, IconPin, IconTerminal, IconThreat } from "@/components/icons";
import type { NexoGlyphKind } from "@/lib/icons/glyphSignals";
import { splitNexoGlyphInline } from "@/lib/icons/nexoGlyphTokens";

type Props = {
  text: string;
  /** σ 0–5 — glifo inquisición inline. */
  sigma?: number;
  /** Hambre — pulso en glifo sangre si aplica. */
  hunger?: number;
};

function InlineGlyph({
  kind,
  sigma,
  bloodPulse,
}: {
  kind: NexoGlyphKind;
  sigma: number;
  bloodPulse: boolean;
}) {
  const box = "icon inline-block h-4 w-4 shrink-0 align-middle mx-0.5";
  switch (kind) {
    case "inquisition":
      return <IconThreat className={`${box} text-[var(--crimson)]`} />;
    case "blood":
      return <IconBlood className={`${box} ${bloodPulse ? "nexo-glyph-blood-pulse" : ""}`} />;
    case "destiny":
      return <IconPin className={`${box} text-[color:var(--terminal)]`} />;
    case "terminal":
      return <IconTerminal className={box} />;
    case "circuit":
      return <IconBook className={box} />;
    case "vastago":
      return <IconAvatarSigil className={box} />;
    default:
      return null;
  }
}

/**
 * Párrafo seguro: solo texto + iconos React; reconoce `[[GLYPH:kind]]` con lista blanca.
 */
export function NexoProseWithGlyphs({ text, sigma = 0, hunger = 0 }: Props) {
  const bloodPulse = hunger > 2;
  const parts = splitNexoGlyphInline(text);
  return (
    <>
      {parts.map((p, i) =>
        p.type === "text" ? (
          <span key={i}>{p.value}</span>
        ) : (
          <InlineGlyph key={i} kind={p.kind} sigma={sigma} bloodPulse={bloodPulse} />
        ),
      )}
    </>
  );
}
