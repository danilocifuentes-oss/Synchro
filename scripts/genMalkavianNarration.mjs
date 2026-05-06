/**
 * Genera malkavianNarrationOverride.generated.ts desde cronicaMalkavianV31.txt
 * (mismo grafo que Ventrue; sustituye cuerpo de escena para clan Malkavian).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcPath = path.join(root, "lib/soloCampaign/chapters/malkavian/cronicaMalkavianV31.txt");
const outPath = path.join(root, "lib/soloCampaign/chapters/malkavian/malkavianNarrationOverride.generated.ts");

const raw = fs.readFileSync(srcPath, "utf8");
/** Sólo cabeceras al inicio de línea (evita coincidir "IR A [ESCENA 1.1]"). */
const headerRegex = /(?:^|\r?\n)\[ESCENA\s+([^\]]+)\]\s*:?\s*([^\n\r]*)/g;
const sections = [];
let match;
while ((match = headerRegex.exec(raw)) !== null) {
  const sceneKey = match[1].trim();
  const titleLine = match[2].trim();
  const startIdx = match.index + match[0].length;
  const rest = raw.slice(startIdx);
  const nextIdx = rest.search(/\r?\n\[ESCENA\s+/);
  const bodyRaw = nextIdx >= 0 ? rest.slice(0, nextIdx) : rest;
  sections.push({ sceneKey, titleLine, bodyRaw });
}

function cleanBody(s) {
  const lines = s.split(/\r?\n/);
  const out = [];
  let skipBlock = false;
  for (const line of lines) {
    const t = line.trim();
    if (/^\[ESCENA\s+/i.test(t)) continue;
    if (/^CAPÍTULO\s+\d+/i.test(t)) continue;
    if (
      t.startsWith("OPCIÓN ") ||
      t.startsWith("PUENTE:") ||
      t.startsWith("CONSECUENCIA:") ||
      t.startsWith("RESULTADO:") ||
      t.startsWith("CLAN:")
    ) {
      skipBlock = true;
      continue;
    }
    if (skipBlock && t === "") {
      skipBlock = false;
      continue;
    }
    if (skipBlock) continue;
    out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

const cleaned = new Map();
for (const sec of sections) {
  const body = cleanBody(sec.bodyRaw);
  let label = sec.titleLine ? `${sec.titleLine}\n\n${body}` : body;
  label = label.replace(/^\[ESCENA\s+[^\]]+\]\s*:?\s*[^\n]*(\n\n)?/i, "").trim();
  cleaned.set(sec.sceneKey.trim(), label.trim());
}

/** Escena del guion → ids del motor (Ventrue). Variantes comparten el mismo texto. */
const ESCENA_TO_SCENE_IDS = {
  "1.0": ["n1_0"],
  "1.1": ["n1_1"],
  "1.2": ["n1_2"],
  "1.3": ["n1_3"],
  "1.END": ["n1_cita_mascara"],
  "2.0": ["n2_0"],
  "2.1": ["n2_1"],
  "2.2": ["n2_2"],
  "2.3": ["n2_3"],
  "3.0": ["n3_0"],
  "3.1": ["n3_1"],
  "3.2": ["n3_2"],
  "3.END": ["n3_end"],
  "4.0": ["n4_0"],
  "4.1": ["n4_1"],
  "4.2": ["n4_2"],
  "4.END": ["n4_end"],
  "5.0": ["n5_0"],
  "5.1": ["n5_1"],
  "5.2": ["n5_2"],
  "5.END": ["n5_end"],
  "6.0": ["n6_0"],
  "6.1": ["n6_cat_cripta"],
  "6.2": ["n6_cat_ancla"],
  "6.END": ["n6_cat_cierre"],
  "7.0": ["n7_0"],
  "7.1": ["n7_1"],
  "7.2": ["n7_2"],
  "7.END": ["n7_end_arc", "n7_end"],
  "8.0": ["n8_andes_0", "n8_0"],
  "8.1": ["n8_andes_1", "n8_1"],
  "8.2": ["n8_andes_2", "n8_2"],
  "8.END": ["n8_andes_end", "n8_end"],
  "9.0": ["n9_hielo_0", "n9_0"],
  "9.1": ["n9_hielo_1", "n9_1"],
  "9.2": ["n9_hielo_2", "n9_2"],
  FINAL: ["ne_1", "ne_final"],
};

const override = {};
for (const [escena, ids] of Object.entries(ESCENA_TO_SCENE_IDS)) {
  const text = cleaned.get(escena);
  if (!text) {
    console.warn("Falta sección en TXT para escena:", escena);
    continue;
  }
  for (const id of ids) {
    override[id] = text;
  }
}

function escapeTemplate(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

const keys = Object.keys(override).sort();
let ts = `/** Auto-generado por scripts/genMalkavianNarration.mjs — no editar a mano. */\n\n`;
ts += `export const MALKAVIAN_NARRATION_BY_SCENE_ID: Record<string, string> = {\n`;
for (const k of keys) {
  ts += `  ${JSON.stringify(k)}: \`${escapeTemplate(override[k])}\`,\n`;
}
ts += `};\n`;

fs.writeFileSync(outPath, ts, "utf8");
console.log("Escrito", outPath, "claves:", keys.length);
