/**
 * Exporta la crónica solitaria cargada en el registro a CSV y Markdown editable.
 *
 * Uso: npm run solo:export-edicion
 *
 * Salida: share/solo-cronica-edicion/bloques-crónica.csv
 *         share/solo-cronica-edicion/cronica-completa.md
 *         share/solo-cronica-edicion/LEEME.txt
 *
 * Conserva ID_CLAVE al devolver el archivo para poder reimportar cambios por bloque.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SOLO_CHAPTERS } from "@/lib/soloCampaign/chapters";
import type { SoloChapter, SoloOption, SoloScene } from "@/lib/soloCampaign/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "share", "solo-cronica-edicion");
const OUT_CSV = path.join(OUT_DIR, "bloques-crónica.csv");
const OUT_MD = path.join(OUT_DIR, "cronica-completa.md");
const OUT_README = path.join(OUT_DIR, "LEEME.txt");

function csvField(raw: string): string {
  const s = raw.replace(/\r\n/g, "\n");
  if (/[\r\n",]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function csvLine(fields: string[]): string {
  return fields.map(csvField).join(",");
}

type OutRow = {
  idClave: string;
  capituloId: string;
  capituloTitulo: string;
  escenaId: string;
  escenaTitulo: string;
  tipoBloque: string;
  subId: string;
  textoEditar: string;
  /** JSON técnico (no lo reescribas como prosa; sirve para saber rama / requisito). */
  metaMaquina: string;
};

function metaOption(o: SoloOption): string {
  return JSON.stringify({
    tipo: o.type,
    disciplina: o.discipline ?? null,
    habilidad: o.skill ?? null,
    siguienteEscena: o.nextSceneId,
    siguienteEscenaFallo: o.nextSceneIdOnFail ?? null,
    siguienteEscenaCritico: o.nextSceneIdOnCritical ?? null,
    requisito: o.requirement,
    visibilidad: o.visibilityRequirement ?? null,
    unlockHint: o.unlockHint ?? null,
    disciplineTitle: o.disciplineTitle ?? null,
  });
}

function pushFatalOutcome(rows: OutRow[], chapter: SoloChapter, scene: SoloScene, option: SoloOption) {
  let i = 0;
  for (const e of option.effects ?? []) {
    if (e.type !== "fatalOutcome") continue;
    rows.push({
      idClave: `${chapter.id}|${scene.id}|opcion|${option.id}|fatal_titulo|${i}`,
      capituloId: chapter.id,
      capituloTitulo: chapter.title,
      escenaId: scene.id,
      escenaTitulo: scene.title,
      tipoBloque: "opcion_fatal_titulo",
      subId: `${option.id}#${i}`,
      textoEditar: e.title,
      metaMaquina: metaOption(option),
    });
    rows.push({
      idClave: `${chapter.id}|${scene.id}|opcion|${option.id}|fatal_cuerpo|${i}`,
      capituloId: chapter.id,
      capituloTitulo: chapter.title,
      escenaId: scene.id,
      escenaTitulo: scene.title,
      tipoBloque: "opcion_fatal_cuerpo",
      subId: `${option.id}#${i}`,
      textoEditar: e.body,
      metaMaquina: metaOption(option),
    });
    i += 1;
  }
}

function collectChapter(chapter: SoloChapter): OutRow[] {
  const rows: OutRow[] = [];

  rows.push({
    idClave: `${chapter.id}|__capitulo__|descripcion`,
    capituloId: chapter.id,
    capituloTitulo: chapter.title,
    escenaId: "__capitulo__",
    escenaTitulo: "",
    tipoBloque: "capitulo_descripcion",
    subId: "",
    textoEditar: chapter.description ?? "",
    metaMaquina: "",
  });

  for (const scene of chapter.scenes) {
    rows.push({
      idClave: `${chapter.id}|${scene.id}|escena|cuerpo`,
      capituloId: chapter.id,
      capituloTitulo: chapter.title,
      escenaId: scene.id,
      escenaTitulo: scene.title,
      tipoBloque: "escena_texto_completo",
      subId: "",
      textoEditar: scene.text ?? "",
      metaMaquina: "",
    });

    scene.contextLeadInByState?.forEach((entry, idx) => {
      rows.push({
        idClave: `${chapter.id}|${scene.id}|escena|lead_in|${idx}`,
        capituloId: chapter.id,
        capituloTitulo: chapter.title,
        escenaId: scene.id,
        escenaTitulo: scene.title,
        tipoBloque: "escena_contexto_previo_estado",
        subId: String(idx),
        textoEditar: entry.text,
        metaMaquina: JSON.stringify({ requirement: entry.requirement }),
      });
    });

    scene.contextVariantByState?.forEach((entry, idx) => {
      rows.push({
        idClave: `${chapter.id}|${scene.id}|escena|variante_ctx|${idx}`,
        capituloId: chapter.id,
        capituloTitulo: chapter.title,
        escenaId: scene.id,
        escenaTitulo: scene.title,
        tipoBloque: "escena_variante_contexto",
        subId: String(idx),
        textoEditar: entry.text,
        metaMaquina: JSON.stringify({ requirement: entry.requirement }),
      });
    });

    scene.flagAppends?.forEach((entry, idx) => {
      rows.push({
        idClave: `${chapter.id}|${scene.id}|escena|append_bandera|${entry.flag}|${idx}`,
        capituloId: chapter.id,
        capituloTitulo: chapter.title,
        escenaId: scene.id,
        escenaTitulo: scene.title,
        tipoBloque: "escena_adjunto_si_bandera",
        subId: `${entry.flag}#${idx}`,
        textoEditar: entry.text,
        metaMaquina: JSON.stringify({ flag: entry.flag }),
      });
    });

    for (const option of scene.options) {
      rows.push({
        idClave: `${chapter.id}|${scene.id}|opcion|${option.id}|texto`,
        capituloId: chapter.id,
        capituloTitulo: chapter.title,
        escenaId: scene.id,
        escenaTitulo: scene.title,
        tipoBloque: "opcion_texto_completo",
        subId: option.id,
        textoEditar: option.text ?? "",
        metaMaquina: metaOption(option),
      });
      pushFatalOutcome(rows, chapter, scene, option);
    }
  }

  return rows;
}

const HEADER = [
  "ID_CLAVE",
  "CAPITULO_ID",
  "CAPITULO_TITULO",
  "ESCENA_ID",
  "ESCENA_TITULO",
  "TIPO_BLOQUE",
  "SUB_ID",
  "TEXTO_EDITAR",
  "META_MAQUINA_JSON",
] as const;

const TIPO_BLOQUE_ETIQUETA: Record<string, string> = {
  capitulo_descripcion: "Descripción del capítulo",
  escena_texto_completo: "Cuerpo de escena (texto completo)",
  escena_contexto_previo_estado: "Contexto previo por estado",
  escena_variante_contexto: "Variante de contexto",
  escena_adjunto_si_bandera: "Adjunto si bandera activa",
  opcion_texto_completo: "Opción (texto IA completo: OPCIÓN, PUENTE, CONSECUENCIA…)",
  opcion_fatal_titulo: "Muerte definitiva — título",
  opcion_fatal_cuerpo: "Muerte definitiva — cuerpo",
};

function pickFence(body: string): string {
  let f = "```";
  while (body.includes(f)) f = "`" + f;
  return f;
}

function fencedTextBlock(body: string): string {
  const fence = pickFence(body);
  return `${fence}text\n${body}\n${fence}`;
}

function buildMarkdown(rows: OutRow[]): string {
  const out: string[] = [];
  out.push("# Santiago en Cenizas — texto editorial (capítulos 1–9)\n");
  out.push(
    "> **Importante:** conserva cada **ID_CLAVE** tal cual si luego quieres reimportar los textos al código.\n",
  );
  out.push("> Mismo contenido que `bloques-crónica.csv`, ordenado por capítulo y escena.\n");

  let curChapter = "";
  let curScene = "";

  const pushBlank = () => out.push("");

  for (const r of rows) {
    if (r.capituloId !== curChapter) {
      curChapter = r.capituloId;
      curScene = "";
      pushBlank();
      out.push(`## Capítulo · \`${curChapter}\` — ${r.capituloTitulo}\n`);
    }

    if (r.escenaId === "__capitulo__") {
      pushBlank();
      out.push(`### Descripción del capítulo\n`);
      out.push(`- **Tipo:** \`${r.tipoBloque}\``);
      out.push(`- **ID_CLAVE:** \`${r.idClave}\``);
      if (r.metaMaquina.trim()) out.push(`- **META:** \`${r.metaMaquina.replace(/`/g, "'")}\``);
      pushBlank();
      out.push(fencedTextBlock(r.textoEditar));
      pushBlank();
      continue;
    }

    if (r.escenaId !== curScene) {
      curScene = r.escenaId;
      pushBlank();
      out.push(`### Escena · \`${curScene}\` — ${r.escenaTitulo}\n`);
    }

    const etiqueta = TIPO_BLOQUE_ETIQUETA[r.tipoBloque] ?? r.tipoBloque;
    pushBlank();
    out.push(`#### ${etiqueta}\n`);
    out.push(`- **ID_CLAVE:** \`${r.idClave}\``);
    out.push(`- **TIPO_BLOQUE:** \`${r.tipoBloque}\``);
    if (r.subId) out.push(`- **SUB_ID:** \`${r.subId.replace(/`/g, "'")}\``);
    if (r.metaMaquina.trim()) {
      pushBlank();
      out.push("Meta (no reescribir como prosa; referencia técnica):");
      pushBlank();
      out.push(fencedTextBlock(r.metaMaquina));
    }
    pushBlank();
    out.push("**TEXTO_EDITAR**\n");
    pushBlank();
    out.push(fencedTextBlock(r.textoEditar));
    pushBlank();
  }

  return out.join("\n");
}

function main() {
  const chapters = [...SOLO_CHAPTERS].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

  const rows: OutRow[] = [];
  for (const ch of chapters) rows.push(...collectChapter(ch));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const lines: string[] = [];
  lines.push(csvLine([...HEADER]));
  for (const r of rows) {
    lines.push(
      csvLine([
        r.idClave,
        r.capituloId,
        r.capituloTitulo,
        r.escenaId,
        r.escenaTitulo,
        r.tipoBloque,
        r.subId,
        r.textoEditar,
        r.metaMaquina,
      ]),
    );
  }

  const bom = "\uFEFF";
  fs.writeFileSync(OUT_CSV, bom + lines.join("\r\n"), "utf8");

  fs.writeFileSync(OUT_MD, buildMarkdown(rows), "utf8");

  const readme = `
Santiago en Cenizas — edición masiva de textos (capítulos 1–9)
==============================================================

Archivos:
  - bloques-crónica.csv   → Excel / LibreOffice (UTF-8, con BOM).
  - cronica-completa.md   → mismo contenido en Markdown (editor de texto / Git).
  - Este LEEME.txt        → instrucciones breves.

Columnas importantes
--------------------
ID_CLAVE
  Referencia estable del bloque. No la cambies si vas a devolver el archivo para
  reimportar textos al código automáticamente.

TEXTO_EDITAR
  Todo lo que ves en pantalla / en los .ts para ese bloque:
  - En escenas: suele incluir CONTEXTO:, NARRACIÓN:, etc.
  - En opciones: suele incluir OPCIÓN …, PUENTE:, CONSECUENCIA:, RESULTADO:, etc.

META_MAQUINA_JSON
  Datos para ramificación (requisitos, siguiente escena, tipo de opción).
  No lo uses como narrativa; puedes ignorarlo salvo que quieras contexto técnico.

TIPO_BLOQUE (referencia rápida)
-------------------------------
capitulo_descripcion          → descripción del capítulo en la definición.
escena_texto_completo         → campo principal text de la escena.
escena_contexto_previo_estado → inserto antes del cuerpo si hay estado.
escena_variante_contexto      → párrafo contextual por banderas/ruta.
escena_adjunto_si_bandera     → texto extra cuando una bandera ya está activa.
opcion_texto_completo         → texto IA completo de la opción.
opcion_fatal_titulo / _cuerpo → texto de muerte definitiva ligada a una opción.

Ventrue y otros clanes
------------------------
Esta planilla es la crónica base cargada desde chapter01.ts … chapter09.ts.
Ventrue usa estos mismos textos en Codex V. El clan Malkavian puede tener overrides
generados aparte; no están fusionados en este CSV.

Epílogo
-------
No forma parte de esta exportación (solo caps 1–9). Si lo necesitas, dímelo.

Regenerar desde el código
--------------------------
  npm run solo:export-edicion
`.trimStart();

  fs.writeFileSync(OUT_README, readme, "utf8");

  console.log(`Escrito: ${OUT_CSV}`);
  console.log(`Escrito: ${OUT_MD}`);
  console.log(`Filas de contenido: ${rows.length}`);
  console.log(`Escrito: ${OUT_README}`);
}

main();
