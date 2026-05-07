import type { CharacterSheet } from "@/lib/character";
import { rollD10 } from "@/lib/dice";
import type { SoloOption } from "@/lib/soloCampaign/types";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Tirada V5 cuando la opción exige pool (disciplina, habilidad, atributo o clan con requisito). */
export function soloOptionUsesDice(option: SoloOption): boolean {
  return option.requirement.type !== "none";
}

/** Opción cuyo pool activa **Despertar** (1d10) antes de la tirada de disciplina. */
export function isDisciplineRollOption(option: SoloOption): boolean {
  if (option.requirement.type === "discipline") return true;
  if (option.type === "discipline" && option.discipline) return true;
  return false;
}

/**
 * V5 — Rouse / Despertar: una cara de d10; 6+ el cuerpo obedece sin añadir Ansia; 1–5 sube Ansia 1 (techo 5).
 * La tirada de pool usa inmediatamente después el valor actual de Ansia como dados de hambre (rojos).
 */
export function applyDisciplineRouseFromRoll(sheet: CharacterSheet): {
  sheet: CharacterSheet;
  die: number;
  hungerIncreased: boolean;
} {
  const die = rollD10();
  const success = die >= 6;
  if (success) return { sheet, die, hungerIncreased: false };
  return {
    sheet: { ...sheet, hunger: clamp(sheet.hunger + 1, 0, 5) },
    die,
    hungerIncreased: true,
  };
}

/**
 * Compatibilidad: solo aplica Despertar a disciplinas; resto sin coste previo aquí.
 * @deprecated Preferir `applyDisciplineRouseFromRoll` cuando necesites el resultado del dado.
 */
export function applyPreRollResourceCost(sheet: CharacterSheet, option: SoloOption): CharacterSheet {
  if (!isDisciplineRollOption(option)) return sheet;
  return applyDisciplineRouseFromRoll(sheet).sheet;
}

/** Reservado para UI futura (reintento de tirada): coste típico en voluntad. */
export const SOLO_REROLL_WILLPOWER_COST = 1 as const;
