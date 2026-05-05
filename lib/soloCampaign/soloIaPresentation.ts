/**
 * Divide el texto tipo “arquitectura IA”: jugador sólo ve elección/narración;
 * PUENTE, CONSECUENCIA y RESULTADO son instrucciones de contenido/motor — no UI.
 */

export type ParsedScenePanels = {
  context: string | null;
  /** Prosa jugable principal (sin CONTEXT ni notas de diseño). */
  narration: string;
};

export type ParsedOptionPanels = {
  /** Una o dos líneas: verbo jugable (+ tipo implícito vía etiqueta fuera del texto). */
  promptBody: string;
  /** Prosa entre CONSECUENCIA y RESULTADO (solo para UI entre dos pulsaciones). */
  consequence: string | null;
};

function normalizeNewlines(raw: string): string {
  return raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

/** Primer índice donde empieza un bloque de notas (PUENTE / CONSECUENCIA / RESULTADO). */
function firstIaOptionBlockIndex(raw: string): number {
  const re = /(?:^|\n)\s*(?:PUENTE|CONSECUENCIA|RESULTADO)\s*:/gi;
  let min = raw.length;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    if (m.index < min) min = m.index;
  }
  return min;
}

function stripLeadingOpcionBanner(block: string): string {
  return block.replace(/^OPCIÓN\s+[A-Z0-9.]+\s*(?:\[[^\]]+\])?\s*:\s*/im, "").trim();
}

/**
 * Quita encabezados de ruta para dev/IA (“Salida — RUTA…”, “Camino estándar…”, líneas sólo con condiciones).
 */
export function stripDeveloperRoutingFromPlayerOption(text: string): string {
  const original = text.replace(/\r/g, "\n").trim();
  if (!original) return "";

  const devHeadingLine = (rawLine: string): boolean => {
    const L = rawLine.trim();
    if (!L) return true;
    if (/^salida\s*[—–\-]/i.test(L)) return true;
    if (/^salida\s*:\s*/i.test(L)) return true;
    if (/^camino\s+estándar\b/i.test(L) || /^camino\s+estandar\b/i.test(L)) return true;
    if (/^cierre\b.*\b(forzado|forzosa|forzoso)\b/i.test(L)) return true;
    if (
      /^\([^)]*(?:prioridad|beso_|rastro_|info_|setflag|setFlag|ruta\s+del\b|cap[ií]tulo\b|escena\b)[^)]*\)\s*\.?\s*$/i.test(L)
    )
      return true;
    return false;
  };

  const lines = original.split("\n");
  while (lines.length > 0 && devHeadingLine(lines[0] ?? "")) {
    lines.shift();
  }

  let joined = lines.join("\n").trim();

  joined = joined.replace(
    /^([^\n]+?)\s*\([^)]*(?:prioridad|si\s+[^)]*_|ruta\b|cap[ií]tulo\b|setflag\b)[^)]*\)\s*[.…]?\s*/iu,
    "$1",
  );

  const out = joined.trim();
  return out || original;
}

/** Texto después de CONSECUENCIA: hasta antes de RESULTADO: (bloque IA, línea aparte habitual). */
function extractIaConsequence(raw: string): string | null {
  const m = /\n\s*CONSECUENCIA\s*:\s*([\s\S]*?)(?=\n\s*RESULTADO\s*:|$)/i.exec(raw);
  const t = m?.[1]?.trim();
  return t?.length ? t : null;
}

/** Escena tipo CONTEXTO / NARRACIÓN / (notas tipo BIFURCACIÓN para diseño → no jugador). */
export function parseSceneIaPanels(raw: string): ParsedScenePanels {
  const text = normalizeNewlines(raw);
  if (!text) return { context: null, narration: "" };

  const bifIdx = text.search(/\n\s*BIFURCACIÓN\b/i);
  const head = bifIdx >= 0 ? text.slice(0, bifIdx).trim() : text;

  const narMatch = /\bNARRACIÓN\s*:/i.exec(head);
  if (!narMatch) {
    if (/\bCONTEXTO\s*:/i.test(head)) {
      const ctxOnly = head.replace(/^\s*CONTEXTO\s*:\s*/i, "").trim();
      return { context: ctxOnly || null, narration: "" };
    }
    return { context: null, narration: head };
  }

  const beforeNar = head.slice(0, narMatch.index ?? 0).trim();
  const afterNarMark = narMatch.index! + narMatch[0].length;
  let narrationBlock = head.slice(afterNarMark).trim();

  let contextText: string | null = null;
  const ctxMatch = /\bCONTEXTO\s*:/i.exec(beforeNar);
  if (ctxMatch) {
    const afterCtx = beforeNar.slice(ctxMatch.index! + ctxMatch[0].length).trim();
    contextText = afterCtx || null;
  }

  narrationBlock = narrationBlock.replace(/^CONTEXTO\s*:\s*/i, "").trim();

  return { context: contextText, narration: narrationBlock || head };
}

/** Opciones: solo la parte jugable ante “OPCIÓN …”. PUENTE / CONSECUENCIA / RESULTADO son notas para el motor / IA — no jugador. */
export function parseOptionIaPanels(fullText: string): ParsedOptionPanels {
  const raw = normalizeNewlines(fullText);
  if (!raw) return { promptBody: "", consequence: null };

  let cut = firstIaOptionBlockIndex(raw);
  if (cut >= raw.length) {
    const inline = /\s+(?:PUENTE|CONSECUENCIA|RESULTADO)\s*:/i.exec(raw);
    if (inline?.index !== undefined) cut = inline.index;
  }

  let promptBody = stripLeadingOpcionBanner(raw.slice(0, cut).trim()).trim();
  promptBody = stripDeveloperRoutingFromPlayerOption(promptBody);
  const consequence = extractIaConsequence(raw);

  return { promptBody, consequence };
}
