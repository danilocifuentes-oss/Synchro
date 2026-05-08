import type { ClanId } from "@/lib/character";

/** Pantalla Codex V en Nexo muestra hasta 7 cajones de integridad (coherente con CharacterStatusPanel). */
export const CHRONICLE_HEALTH_TRACK_UI = 7 as const;

/** PX de crónica por tirada V5 exitosa (disciplina / habilidad / atributo / opción con pool). */
export const CHRONICLE_XP_ROLL_SUCCESS_DEFAULT = 2;

/** PX extra si el resultado es crítico (limpio o manchado). */
export const CHRONICLE_XP_CRITICAL_EXTRA = 1;

/** Título de capítulo en biblioteca: Ventrue por defecto; piel Malkavian en SOL. */
export function soloChapterHeadlineForClan(title: string, clan: ClanId): string {
  if (clan !== "malkavian") return title;
  return title.replace(/\bVENTRUE\b/g, "MALKAVIAN").replace(/\bVentrue\b/g, "Malkavian");
}
