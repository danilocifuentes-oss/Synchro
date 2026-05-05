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
  CHRONICLE_OPENING_SCENE_ID,
  CHRONICLE_XP_CRITICAL_EXTRA,
  CHRONICLE_XP_ROLL_SUCCESS_DEFAULT,
  SOLO_FLAG_OPENING_VITALS,
} from "@/lib/soloCampaign/chronicleMechanics";
import { SOLO_CHAPTERS } from "@/lib/soloCampaign/chapters";
import type { SoloChapter, SoloOption, SoloScene } from "@/lib/soloCampaign/types";
import {
  SOLO_NARRATIVE_ARCHITECT_PROMPT_CONTENT_VERSION,
  SOLO_NARRATIVE_ARCHITECT_SYSTEM_PROMPT_ES,
} from "@/lib/soloCampaign/architectPromptCopy";

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
    variante_por_clan: scene.clanFlavor ?? null,
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

Tienes un JSON llamado artefacto "digest" con:
- cronica.shell: preludio común, stingers por máscara de clan (incluye _fallback si falta entrada), intros de clan al abrir cap. 1, contextos antes de algunos capítulos, versions de contenido persistido, y constantes mecánicas (escena inicial, PX por tirada, banderas).
- plataforma: clanes disponibles solo en CODEX/Campaña Solitaria vs todos los ClanId del motor.
- arbol_caps: cada capítulo con escenas; narracion, opcional adjuntos_cuando_bandera_activa (equivalente a flagAppends en código), variante_por_clan, opciones con requisitos, ramas siguiente_escena_* y efectos.

Tareas de análisis (devuelve secciones claras):
1) Grafo por capítulo: lista escena_inicio → cierre; detecta opciones muertas u hojas sin salida conocida dentro del mismo capítulo si next apunta fuera sin capítulo objetivo declarado aquí (sólo señálalo como riesgo).
2) Opciones discriminadas por clan/disciplina/habilidad: ¿quién puede ver qué sin trucos? ¿Hay trampas donde un clan sin disciplina sólo tiene un camino penalizado?
3) Coherencia tono/registry: ¿contexto previo contradice texto de primera escena del capítulo?
4) Lista de lacunas para completar contenido opcional si se desea simetría clan.

Cita IDs de escenas y opciones (id) cuando propongas cambios concretos.

Tras el bloque de instrucciones, el usuario te pegará un único objeto JSON (empieza tras la línea que dice ---DATOS_JSON---). Úsalo como fuente de verdad; no inventes escenas ni opciones que no aparezcan ahí.`;

async function main(): Promise<void> {
  const digest = {
    _meta: {
      artefacto: "solo-campaign-narrative-digest",
      generado_ISO: new Date().toISOString(),
      formato_version: 2,
      SOLO_NARRATIVE_ARCHITECT_PROMPT_CONTENT_VERSION,
      archivo_fuente_codigo: [
        "lib/soloCampaign/chapters/*.ts",
        "lib/soloCampaign/types.ts",
        "lib/soloCampaign/chronicleMechanics.ts",
        "lib/soloCampaign/architectPromptCopy.ts",
        "components/SoloCampaignApp.tsx",
      ],
      nota_instrucciones_IA:
        "COPIAR-PEGAR-IA.txt: ---INSTRUCCIONES--- (QA digest), ---SYSTEM_PROMPT_NARRATIVE_ARCHITECT--- (diseño/rewrite), ---DATOS_JSON---.",
    },
    plataforma: {
      clanes_solo_soportados_IDS: [...SOLO_SUPPORTED_CLANS],
      nota_clanFlavor:
        "Las capas opcionales clanFlavor sólo están definidas en algunas escenas y suelen incluir sólo Brujah/Ventrue/Toreador/Malkavian; otros linajes ven la narracion base.",
    },
    cronica: {
      shell: {
        mecanica_escena_primera_codex: {
          CHRONICLE_OPENING_SCENE_ID,
          CHRONICLE_HEALTH_TRACK_UI_CAJONES: CHRONICLE_HEALTH_TRACK_UI,
          CHRONICLE_XP_ROLL_SUCCESS_DEFAULT,
          CHRONICLE_XP_CRITICAL_EXTRA,
          bandera_estado_vital_aplicado: SOLO_FLAG_OPENING_VITALS,
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
    "Bloques: ---INSTRUCCIONES--- (revisión/QA del digest), ---SYSTEM_PROMPT_NARRATIVE_ARCHITECT--- (rol Narrative Architect + reglas Santiago en Cenizas), ---DATOS_JSON--- (volcado).",
    "",
    "---INSTRUCCIONES---",
    "",
    PROMPT_ANALISIS_ES.trim(),
    "",
    "---SYSTEM_PROMPT_NARRATIVE_ARCHITECT---",
    "",
    SOLO_NARRATIVE_ARCHITECT_SYSTEM_PROMPT_ES.trim(),
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
