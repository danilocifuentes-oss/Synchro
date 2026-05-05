/**
 * Divide el texto tipo "Arquitectura IA" entre lo que debe ver el jugador
 * y la guía PUENTE/RESULTADO pensada como mecánica back.
 */

export type ParsedScenePanels = {
  context: string | null;
  /** Prosa jugable principal (sin CONTEXT ni notas de diseño). */
  narration: string;
};

export type ParsedOptionPanels = {
  /** Una o dos líneas: verbo jugable (+ tipo implícito vía etiqueta fuera del texto). */
  promptBody: string;
  /** Narrativa resultado si existe bloque CONSECUENCIA. */
  consequence: string | null;
  /** True si había marcadores PUENTE/CONSECUENCIA/RESULTADO u OPCIÓN con subbloques. */
  hasIaMarkers: boolean;
};

function normalizeNewlines(raw: string): string {
  return raw.replace(/\r\n/g, "\n").trim();
}

function stripLeadingOpcionBanner(block: string): string {
  return block.replace(/^OPCIÓN\s+[A-Z0-9.]+\s*(?:\[[^\]]+\])?\s*:\s*/im, "").trim();
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

/** Opciones tipo OPCIÓN … / PUENTE / CONSECUENCIA / RESULTADO. */
export function parseOptionIaPanels(fullText: string): ParsedOptionPanels {
  const raw = normalizeNewlines(fullText);
  if (!raw) return { promptBody: "", consequence: null, hasIaMarkers: false };

  const lower = raw.toLowerCase();
  const idxPuente = lower.search(/\n\s*PUENTE\s*:/);
  const idxConsec = lower.search(/\n\s*CONSECUENCIA\s*:/);

  const hasMarkers = idxPuente >= 0 || idxConsec >= 0 || /\n\s*RESULTADO\s*:/i.test(raw);
  if (!hasMarkers) {
    return {
      promptBody: stripLeadingOpcionBanner(raw),
      consequence: null,
      hasIaMarkers: /^OPCIÓN\b/i.test(raw),
    };
  }

  let cutPrompt = raw.length;
  for (const i of [idxPuente, idxConsec]) {
    if (i >= 0 && i < cutPrompt) cutPrompt = i;
  }
  let promptSlice = stripLeadingOpcionBanner(raw.slice(0, cutPrompt).trim());

  const singleLineOpcion = /^OPCIÓN\s+[A-Z0-9.]+\s*(?:\[[^\]]+\])?\s*:\s*(.+)$/im.exec(promptSlice.split("\n")[0] ?? "");
  if ((promptSlice.split("\n").length === 1 || !promptSlice) && singleLineOpcion?.[1]) {
    promptSlice = singleLineOpcion[1].trim();
  }

  const consecBlock = /\n\s*CONSECUENCIA\s*:\s*([\s\S]*?)(?=\n\s*RESULTADO\s*:|$)/i.exec(raw);
  const consequence = consecBlock?.[1]?.trim().length ? consecBlock[1].trim() : null;

  return {
    promptBody: promptSlice || stripLeadingOpcionBanner(raw.split("\n")[0] ?? raw),
    consequence,
    hasIaMarkers: true,
  };
}
