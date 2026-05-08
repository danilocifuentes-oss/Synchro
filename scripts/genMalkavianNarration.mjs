/**
 * Genera `malkavianNarrationOverride.generated.ts` con mapa vacío.
 * Para sustituir `SoloScene.text` en clan Malkavian, añade entradas `{ [sceneId]: "…" }` en el .ts
 * o amplía este script con una fuente propia.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outPath = path.join(root, "lib/soloCampaign/chapters/malkavian/malkavianNarrationOverride.generated.ts");

const ts = `/**
 * Overrides narrativos Malkavian por id de escena.
 * Generado por scripts/genMalkavianNarration.mjs — se puede editar a mano.
 */
export const MALKAVIAN_NARRATION_BY_SCENE_ID: Record<string, string> = {};
`;

fs.writeFileSync(outPath, ts, "utf8");
console.log("Escrito:", path.relative(root, outPath));
