import type { CharacterSheet } from "@/lib/character";
import { getActiveDisciplineKeys, type DisciplineKey } from "@/lib/sereno";

export type ChronicleXpPurchaseKind = "attribute" | "skill" | "discipline";

export const XP_COST_ATTRIBUTE_FACTOR = 4;
export const XP_COST_SKILL_FACTOR = 2;
export const XP_COST_DISCIPLINE_INCLAN_FACTOR = 5;
export const XP_COST_DISCIPLINE_OUTCLAN_FACTOR = 7;

export function xpCostForIncrease(kind: ChronicleXpPurchaseKind, nextValue: number, factorOverride?: number): number {
  const v = Math.max(0, Math.floor(nextValue));
  const factor =
    factorOverride ??
    (kind === "attribute"
      ? XP_COST_ATTRIBUTE_FACTOR
      : kind === "skill"
        ? XP_COST_SKILL_FACTOR
        : XP_COST_DISCIPLINE_INCLAN_FACTOR);
  return v * factor;
}

export function disciplineXpFactor(sheet: CharacterSheet, discipline: DisciplineKey): number | null {
  const active = getActiveDisciplineKeys(sheet.clan, sheet.caitiffDisciplinePicks);
  if (active.includes(discipline)) return XP_COST_DISCIPLINE_INCLAN_FACTOR;
  // El CODEX actual bloquea subir disciplinas no activas; si se habilita en el futuro, aplica factor outclan.
  return null;
}

export function maxAffordableTargetLevel(
  current: number,
  hardCeiling: number,
  xpAvailable: number,
  costFor: (nextValue: number) => number | null,
): number {
  let max = Math.min(hardCeiling, current);
  for (let trial = current + 1; trial <= hardCeiling; trial++) {
    const cost = costFor(trial);
    if (cost == null) break;
    if (cost > xpAvailable) break;
    max = trial;
  }
  return max;
}

