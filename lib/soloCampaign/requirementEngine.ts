import type { CharacterSheet } from "@/lib/character";
import { disciplineLabel } from "@/lib/sereno";
import type { SoloOption, SoloProgress, SoloRequirement } from "./types";

export type RequirementResult = {
  available: boolean;
  reason?: string;
};

function evalRequirement(req: SoloRequirement, sheet: CharacterSheet, progress?: SoloProgress): RequirementResult {
  switch (req.type) {
    case "none":
      return { available: true };
    case "clan":
      return req.clan === sheet.clan
        ? { available: true }
        : { available: false, reason: `Sólo para ${req.clan}.` };
    case "discipline": {
      const current = Number(sheet.disciplines?.[req.discipline] ?? 0);
      return current >= req.minLevel
        ? { available: true }
        : {
            available: false,
            reason: `${disciplineLabel(req.discipline)} ${current}/${req.minLevel}.`,
          };
    }
    case "skill": {
      const current = Number(sheet.skills?.[req.skill] ?? 0);
      return current >= req.minLevel
        ? { available: true }
        : { available: false, reason: `${req.skill} ${current}/${req.minLevel}.` };
    }
    case "attribute": {
      const current = Number(sheet.attributes?.[req.attribute] ?? 0);
      return current >= req.minLevel
        ? { available: true }
        : { available: false, reason: `${req.attribute} ${current}/${req.minLevel}.` };
    }
    case "flag": {
      const expected = req.equals ?? true;
      const current = progress?.flags?.[req.flag] === true;
      return current === expected ? { available: true } : { available: false, reason: `Bandera ${req.flag}.` };
    }
    case "route": {
      const activeRoute = progress?.activeRoute ?? "main";
      const ok = Array.isArray(req.route) ? req.route.includes(activeRoute) : req.route === activeRoute;
      return ok ? { available: true } : { available: false, reason: `Ruta ${activeRoute}.` };
    }
    case "stateTag": {
      const has = (progress?.stateTags ?? []).includes(req.tag);
      return has ? { available: true } : { available: false, reason: `Estado ${req.tag}.` };
    }
    case "any": {
      for (const child of req.requirements ?? []) {
        if (evalRequirement(child, sheet, progress).available) return { available: true };
      }
      return { available: false, reason: "Ninguna condición alternativa cumplida." };
    }
    case "all": {
      for (const child of req.requirements ?? []) {
        const r = evalRequirement(child, sheet, progress);
        if (!r.available) return r;
      }
      return { available: true };
    }
    case "not": {
      const r = evalRequirement(req.requirement, sheet, progress);
      return r.available ? { available: false, reason: "Condición excluyente activa." } : { available: true };
    }
    default:
      return { available: true };
  }
}

export function checkOptionAvailability(option: SoloOption, sheet: CharacterSheet, progress?: SoloProgress): RequirementResult {
  return evalRequirement(option.requirement, sheet, progress);
}

export function checkOptionVisibility(option: SoloOption, sheet: CharacterSheet, progress?: SoloProgress): RequirementResult {
  if (!option.visibilityRequirement) return { available: true };
  return evalRequirement(option.visibilityRequirement, sheet, progress);
}

export function listFailReasons(option: SoloOption, sheet: CharacterSheet, progress?: SoloProgress): string[] {
  const state = checkOptionAvailability(option, sheet, progress);
  return state.available || !state.reason ? [] : [state.reason];
}

/** Bloqueo visible: ficha (disciplina/habilidad/atributo/clan), no rama de historia. */
function isSheetConstraintFailureReason(reason: string | undefined): boolean {
  if (!reason) return false;
  if (reason.startsWith("Sólo para ")) return true;
  return /\s\d+\/\d+\.$/u.test(reason);
}

/** Opción inactiva por bifurcación / banderas / ruta: no se muestra como botón gris. */
function isStoryRouteFailureReason(reason: string | undefined): boolean {
  if (!reason || isSheetConstraintFailureReason(reason)) return false;
  return (
    reason === "Condición excluyente activa." ||
    reason === "Ninguna condición alternativa cumplida." ||
    reason.startsWith("Bandera ") ||
    reason.startsWith("Ruta ") ||
    reason.startsWith("Estado ")
  );
}

/**
 * Ocultar opción en la crónica libro: no cumple visibilidad o la rama narrativa no aplica.
 * Los candados por ficha siguen visibles (con el motivo mecánico).
 */
export function soloOptionHiddenFromPlayer(option: SoloOption, sheet: CharacterSheet, progress?: SoloProgress): boolean {
  if (!checkOptionVisibility(option, sheet, progress).available) return true;
  const { available, reason } = checkOptionAvailability(option, sheet, progress);
  if (available) return false;
  return isStoryRouteFailureReason(reason);
}

export function resolveDisciplineTierText(option: SoloOption, sheet: CharacterSheet): string {
  if (!option.discipline || !option.textByDisciplineLevel) return option.text;
  const current = Number(sheet.disciplines?.[option.discipline] ?? 0);
  const eligibleTier = Object.keys(option.textByDisciplineLevel)
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v) && v <= current)
    .sort((a, b) => b - a)[0];
  if (!eligibleTier) return option.text;
  return option.textByDisciplineLevel[eligibleTier] ?? option.text;
}
