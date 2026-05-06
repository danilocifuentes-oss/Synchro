import { SOLO_CHAPTERS } from "@/lib/soloCampaign/chapters";
import type { SoloOption, SoloRequirement, SoloScene } from "@/lib/soloCampaign/types";

function collectFlagsFromRequirement(req: SoloRequirement, acc: Set<string>) {
  switch (req.type) {
    case "flag":
      acc.add(req.flag);
      return;
    case "any":
    case "all":
      for (const child of req.requirements) collectFlagsFromRequirement(child, acc);
      return;
    case "not":
      collectFlagsFromRequirement(req.requirement, acc);
      return;
    default:
      return;
  }
}

function collectSetFlags(option: SoloOption): string[] {
  const out: string[] = [];
  for (const fx of option.effects ?? []) {
    if (fx.type === "setFlag") out.push(fx.flag);
  }
  for (const fx of option.effectsOnFail ?? []) {
    if (fx.type === "setFlag") out.push(fx.flag);
  }
  for (const fx of option.effectsOnCritical ?? []) {
    if (fx.type === "setFlag") out.push(fx.flag);
  }
  return out;
}

function hasUnconditionalPendingJump(option: SoloOption): boolean {
  if (option.requirement.type !== "none") return false;
  if (option.visibilityRequirement) return false;
  return collectSetFlags(option).some((f) => f.startsWith("chapter_pending_"));
}

const errors: string[] = [];
const warnings: string[] = [];

const chapterIds = new Set<string>();
for (const chapter of SOLO_CHAPTERS) {
  if (chapterIds.has(chapter.id)) errors.push(`Capítulo duplicado: ${chapter.id}`);
  chapterIds.add(chapter.id);
}

const setFlags = new Set<string>();
const requiredFlags = new Set<string>();

for (const chapter of SOLO_CHAPTERS) {
  const sceneIds = new Set<string>();
  const sceneMap = new Map<string, SoloScene>();
  for (const scene of chapter.scenes) {
    if (sceneIds.has(scene.id)) errors.push(`Escena duplicada en ${chapter.id}: ${scene.id}`);
    sceneIds.add(scene.id);
    sceneMap.set(scene.id, scene);
  }

  if (!sceneMap.has(chapter.startSceneId)) {
    errors.push(`startSceneId inexistente en ${chapter.id}: ${chapter.startSceneId}`);
  }

  for (const scene of chapter.scenes) {
    let unconditionalPendingCount = 0;
    for (const option of scene.options) {
      if (!sceneMap.has(option.nextSceneId)) {
        errors.push(`nextSceneId inválido en ${chapter.id}/${scene.id} -> ${option.id}: ${option.nextSceneId}`);
      }

      if (hasUnconditionalPendingJump(option)) unconditionalPendingCount += 1;

      collectFlagsFromRequirement(option.requirement, requiredFlags);
      if (option.visibilityRequirement) collectFlagsFromRequirement(option.visibilityRequirement, requiredFlags);
      for (const f of collectSetFlags(option)) setFlags.add(f);
    }

    if (scene.id.endsWith("_end") && unconditionalPendingCount > 1) {
      warnings.push(
        `Escena final con múltiples saltos incondicionales (${unconditionalPendingCount}) en ${chapter.id}/${scene.id}.`,
      );
    }
  }
}

for (const flag of requiredFlags) {
  if (!setFlags.has(flag) && !flag.startsWith("chapter_pending_")) {
    warnings.push(`Bandera requerida pero no seteada en capítulos: ${flag}`);
  }
}

if (warnings.length) {
  console.log("=== SOLO CHRONICLE WARNINGS ===");
  for (const w of warnings) console.log(`- ${w}`);
}

if (errors.length) {
  console.error("=== SOLO CHRONICLE ERRORS ===");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log("Solo chronicle validation OK.");
