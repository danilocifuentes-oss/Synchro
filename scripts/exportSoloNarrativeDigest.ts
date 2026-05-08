/**
 * Volcado del sistema narrativo de la campaña solitaria → JSON reproducible para revisión humana / LLMs.
 *
 * Ejecutar desde la raíz del repo:
 *   npm run solo:narrative-digest
 *
 * Salidas:
 *   content/solo-campaign/narrative-digest.json  (solo local; suele estar en .gitignore)
 *   content/solo-campaign/COPIAR-PEGAR-IA.txt   (instrucciones + JSON; Ctrl+A para IA)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SOLO_SUPPORTED_CLANS } from "@/lib/soloCampaign/bootstrap";
import {
  CHRONICLE_HEALTH_TRACK_UI,
  CHRONICLE_XP_CRITICAL_EXTRA,
  CHRONICLE_XP_ROLL_SUCCESS_DEFAULT,
} from "@/lib/soloCampaign/chronicleMechanics";
import { SOLO_CHAPTERS } from "@/lib/soloCampaign/chapters";
import type { SoloChapter, SoloOption, SoloScene } from "@/lib/soloCampaign/types";

/** Alineado con la UI: capítulos TS + overrides Malkavian; sin capa clanFlavor en datos. */
const DIGEST_IA_CONTEXT_ES_VERSION = 2 as const;

const DIGEST_IA_CONTEXT_ES = `
Fuente de verdad de la campaña solitaria en Codex V (lo que renderiza el front):

1) Cuerpo de escena: capítulos activos en \`lib/soloCampaign/chapters/\`, ensamblados en \`chronicleRegistry.ts\`.
2) Clan Malkavian: \`resolveSoloScenePlayerText\` puede sustituir el \`text\` de la escena por \`MALKAVIAN_NARRATION_BY_SCENE_ID[scene.id]\` (\`lib/soloCampaign/chapters/malkavian/malkavianNarrationOverride.generated.ts\`). Otros clanes soportados leen la narración base de los capítulos.
3) Títulos de capítulo en biblioteca: \`soloChapterHeadlineForClan\` sustituye la palabra VENTRUE por MALKAVIAN en el título si el jugador es Malkavian (\`chronicleMechanics.ts\`).
4) No existe \`clanFlavor\` por escena en el modelo: la prosa vive en \`SoloScene.text\` salvo overrides Malkavian en \`MALKAVIAN_NARRATION_BY_SCENE_ID\`.

Al reescribir o proponer texto nuevo, debe poder colgarse de \`SoloScene.text\` / overrides generados o de la mecánica anterior; no inventar un segundo JSON paralelo de «novela».
`.trim();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "content", "solo-campaign");
const OUT_FILE = path.join(OUT_DIR, "narrative-digest.json");
const OUT_PASTE_IA = path.join(OUT_DIR, "COPIAR-PEGAR-IA.txt");

function summarizeOption(option: SoloOption): Record<string, unknown> {
  return {
    id: option.id,
    type: option.type,
    texto_jugador: option.text,
    disciplina_etiqueta: option.disciplineTitle ?? null,
    texto_por_dot_disciplina: option.textByDisciplineLevel ?? null,
    requisito: option.requirement,
    requisito_visibilidad: option.visibilityRequirement ?? null,
    pista_desbloqueo: option.unlockHint ?? null,
    siguiente_escena_exito: option.nextSceneId,
    siguiente_escena_fallo: option.nextSceneIdOnFail ?? null,
    siguiente_escena_critico: option.nextSceneIdOnCritical ?? null,
    disciplina: option.discipline ?? null,
    habilidad: option.skill ?? null,
    clan_requerido_opcion: option.clan ?? null,
    efectos: option.effects ?? [],
    efectos_fallo: option.effectsOnFail ?? [],
    efectos_critico: option.effectsOnCritical ?? [],
    px_exito_roll: option.experienceOnSuccessfulRoll ?? null,
  };
}

function summarizeScene(scene: SoloScene): Record<string, unknown> {
  return {
    id: scene.id,
    chapterId: scene.chapterId,
    titulo: scene.title,
    narracion: scene.text,
    contexto_previo_por_estado: scene.contextLeadInByState ?? [],
    adjuntos_cuando_bandera_activa: scene.flagAppends ?? [],
    contexto_por_estado: scene.contextVariantByState ?? [],
    opciones: scene.options.map(summarizeOption),
  };
}

function buildGraphDiagnostics(chapters: SoloChapter[]): {
  totalScenes: number;
  danglingTransitions: { chapterId: string; sceneId: string; optionId: string; target: string }[];
  selfLoops: { chapterId: string; sceneId: string; optionId: string }[];
  endingCoverage: Record<string, number>;
  fatalOutcomes: { chapterId: string; sceneId: string; optionId: string; id: string }[];
} {
  const sceneIdsByChapter = new Map<string, Set<string>>();
  for (const ch of chapters) {
    sceneIdsByChapter.set(ch.id, new Set(ch.scenes.map((s) => s.id)));
  }
  const danglingTransitions: { chapterId: string; sceneId: string; optionId: string; target: string }[] = [];
  const selfLoops: { chapterId: string; sceneId: string; optionId: string }[] = [];
  const endingCoverage: Record<string, number> = { endingA: 0, endingB: 0, endingC: 0, endingD: 0 };
  const fatalOutcomes: { chapterId: string; sceneId: string; optionId: string; id: string }[] = [];
  for (const ch of chapters) {
    const ids = sceneIdsByChapter.get(ch.id) ?? new Set<string>();
    for (const scene of ch.scenes) {
      for (const option of scene.options) {
        if (!ids.has(option.nextSceneId) && option.nextSceneId !== scene.id) {
          danglingTransitions.push({ chapterId: ch.id, sceneId: scene.id, optionId: option.id, target: option.nextSceneId });
        }
        if (option.nextSceneId === scene.id) selfLoops.push({ chapterId: ch.id, sceneId: scene.id, optionId: option.id });
        for (const fx of option.effects ?? []) {
          if (fx.type === "setEnding") endingCoverage[fx.endingId] = (endingCoverage[fx.endingId] ?? 0) + 1;
          if (fx.type === "fatalOutcome") fatalOutcomes.push({ chapterId: ch.id, sceneId: scene.id, optionId: option.id, id: fx.id });
        }
      }
    }
  }
  return { totalScenes: chapters.reduce((acc, c) => acc + c.scenes.length, 0), danglingTransitions, selfLoops, endingCoverage, fatalOutcomes };
}

function summarizeChapter(ch: SoloChapter): Record<string, unknown> {
  return {
    id: ch.id,
    titulo_capitulo: ch.title,
    descripcion_resumen: ch.description,
    escena_inicio: ch.startSceneId,
    escenas: ch.scenes.map(summarizeScene),
  };
}


const PROMPT_ANALISIS_ES = `Actúas como editor de narrative design y QA de una campaña IF en español (V:tM V5 fan, segunda persona).

El JSON "digest" refleja el árbol exportado desde código (arbol_caps). La UI añade capas fuera de este JSON: overrides Malkavian por id de escena y sustitución de palabras en títulos (ver bloque ---CONTEXTO_UI---).

Estructura:
- cronica.shell: constantes mecánicas de PX y tope de salud en HUD Codex.
- plataforma: clanes con campaña solitaria activa.
- arbol_caps: capítulos con escenas; narracion (base Ventrue/ruta principal), adjuntos_cuando_bandera_activa, contexto_por_estado, opciones con requisitos y efectos.
- qa_grafo: diagnósticos automáticos.

Tareas:
1) Grafo: escena_inicio por capítulo, transiciones sospechosas, endings/fatal.
2) Opciones visibles: discriminación por disciplina, habilidad, banderas — sin asumir variante por clan en el JSON.
3) Coherencia: lead-ins y variantes vs cuerpo de escena.

Cita ids de escena y opción al proponer cambios.

Tras ---DATOS_JSON--- el usuario pega un único JSON; no inventes nodos que no estén ahí.`;

async function main(): Promise<void> {
  const digest = {
    _meta: {
      artefacto: "solo-campaign-narrative-digest",
      generado_ISO: new Date().toISOString(),
      formato_version: 2,
      DIGEST_IA_CONTEXT_ES_VERSION,
      archivo_fuente_codigo: [
        "lib/soloCampaign/chronicleRegistry.ts",
        "lib/soloCampaign/chapters/*.ts (capítulos activos)",
        "lib/soloCampaign/chapters/malkavian/malkavianNarrationOverride.generated.ts",
        "lib/soloCampaign/requirementEngine.ts",
        "lib/soloCampaign/chronicleMechanics.ts (soloChapterHeadlineForClan)",
        "components/SoloCampaignApp.tsx",
      ],
      nota_instrucciones_IA:
        "COPIAR-PEGAR-IA.txt: ---INSTRUCCIONES--- (QA), ---CONTEXTO_UI--- (cómo el front monta texto), ---DATOS_JSON---.",
    },
    plataforma: {
      clanes_solo_soportados_IDS: [...SOLO_SUPPORTED_CLANS],
      nota_montaje_UI:
        "Cuerpo: narración base en capítulos TS; clan Malkavian puede reemplazar vía MALKAVIAN_NARRATION_BY_SCENE_ID. Título: soloChapterHeadlineForClan. Ruta actual: prólogo Temuco + caps. 1–3.",
    },
    cronica: {
      shell: {
        mecanica_codex_solo: {
          CHRONICLE_HEALTH_TRACK_UI_CAJONES: CHRONICLE_HEALTH_TRACK_UI,
          CHRONICLE_XP_ROLL_SUCCESS_DEFAULT,
          CHRONICLE_XP_CRITICAL_EXTRA,
        },
      },
    },
    arbol_caps: SOLO_CHAPTERS.map(summarizeChapter),
    qa_grafo: buildGraphDiagnostics(SOLO_CHAPTERS),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const jsonPretty = JSON.stringify(digest, null, 2);
  fs.writeFileSync(OUT_FILE, jsonPretty, "utf8");
  console.log(`Escrito: ${path.relative(ROOT, OUT_FILE)} (${Math.round(fs.statSync(OUT_FILE).size / 1024)} KiB)`);

  const cabecera = [
    "=== PAQUETE ÚNICO PARA CHAT DE IA (V:tM · campaña solitaria) ===",
    "",
    "1) Abre este archivo.",
    "2) Selecciona TODO el texto (Ctrl+A / Cmd+A).",
    "3) Copia y pega en un solo mensaje a la IA.",
    "",
    "Bloques: ---INSTRUCCIONES--- (QA digest), ---CONTEXTO_UI--- (alineación con el front), ---DATOS_JSON--- (volcado).",
    "",
    "---INSTRUCCIONES---",
    "",
    PROMPT_ANALISIS_ES.trim(),
    "",
    "---CONTEXTO_UI---",
    "",
    DIGEST_IA_CONTEXT_ES,
    "",
    "---DATOS_JSON---",
    "",
    jsonPretty,
    "",
  ].join("\n");

  fs.writeFileSync(OUT_PASTE_IA, cabecera, "utf8");
  console.log(`Escrito: ${path.relative(ROOT, OUT_PASTE_IA)} (${Math.round(fs.statSync(OUT_PASTE_IA).size / 1024)} KiB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
