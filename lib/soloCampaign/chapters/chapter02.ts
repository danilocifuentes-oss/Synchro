import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Plantilla V2 de continuación: consume rutas del capítulo 1 y mantiene ramificación. */
export const chapter02: SoloChapter = {
  id: "chapter02",
  title: "NUEVA CRÓNICA · CAPÍTULO 2",
  description: "Continuación plantilla conectada a rutas previas (diplomacia, violencia, intriga).",
  startSceneId: "n2_0",
  scenes: [
    {
      id: "n2_0",
      chapterId: "chapter02",
      title: "[ESCENA 2.0]: LLEGADA",
      text: `CONTEXTO: Apertura del capítulo 2.

NARRACIÓN: El capítulo inicia leyendo las consecuencias de la ruta elegida en el capítulo anterior.`,
      contextVariantByState: [
        {
          requirement: { type: "stateTag", tag: "ruta_cap2_diplomacia" },
          text: "Tu llegada está marcada por acuerdos frágiles y puertas entreabiertas.",
        },
        {
          requirement: { type: "stateTag", tag: "ruta_cap2_violencia" },
          text: "Tu reputación precede tus pasos y el entorno responde con tensión.",
        },
        {
          requirement: { type: "stateTag", tag: "ruta_cap2_intriga" },
          text: "Tienes ventaja informativa, pero nadie revela sus cartas completas.",
        },
      ],
      options: [
        {
          id: "n2_0_analizar",
          type: "skill",
          skill: "perspicacia",
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          text: `OPCIÓN A [HABILIDAD: PERSPICACIA]: Analizar intenciones antes de actuar.

PUENTE: Tomas distancia y evalúas vínculos, riesgos y silencios.

CONSECUENCIA: Identificas una ventana táctica para el siguiente movimiento.

RESULTADO: setFlag: cap2_ventaja_analitica | IR A [ESCENA 2.1]`,
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "cap2_ventaja_analitica" }],
        },
        {
          id: "n2_0_imponer",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          text: `OPCIÓN B [DISCIPLINA: DOMINACIÓN]: Forzar obediencia inmediata para cerrar el margen de error.

PUENTE: Tu autoridad presiona el entorno y corta la negociación.

CONSECUENCIA: Ganas control en el corto plazo, pero aumentas resistencia futura.

RESULTADO: setFlag: cap2_control_forzado | IR A [ESCENA 2.1]`,
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "cap2_control_forzado" }],
        },
        {
          id: "n2_0_estandar",
          type: "dialogue",
          requirement: { type: "none" },
          text: `OPCIÓN C [CAMINO ESTÁNDAR]: Avanzar con cautela sin exponer ventaja.

PUENTE: Mantienes bajo perfil y sostienes una lectura conservadora del terreno.

CONSECUENCIA: No obtienes ventaja inmediata, pero tampoco te sobreexpones.

RESULTADO: IR A [ESCENA 2.1]`,
          nextSceneId: "n2_1",
        },
      ],
    },
    {
      id: "n2_1",
      chapterId: "chapter02",
      title: "[ESCENA 2.1]: PUNTO DE QUIEBRE",
      text: `CONTEXTO: El conflicto central del capítulo alcanza su punto de decisión.

NARRACIÓN: Debes decidir qué legado deja este capítulo para el resto de la crónica.`,
      options: [
        {
          id: "n2_1_salida_politica",
          type: "dialogue",
          requirement: {
            type: "any",
            requirements: [
              { type: "stateTag", tag: "ruta_cap2_diplomacia" },
              { type: "flag", flag: "cap2_ventaja_analitica", equals: true },
            ],
          },
          text: `OPCIÓN A [SALIDA POLÍTICA]: Priorizar estabilidad y control de daños.

RESULTADO: chapter_pending_chapter03 | ruta_cap3_politica`,
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "chapter_pending_chapter03" },
            { type: "addStateTag", tag: "ruta_cap3_politica" },
            { type: "setRoute", route: "main" },
          ],
        },
        {
          id: "n2_1_salida_coercitiva",
          type: "dialogue",
          requirement: {
            type: "any",
            requirements: [
              { type: "stateTag", tag: "ruta_cap2_violencia" },
              { type: "flag", flag: "cap2_control_forzado", equals: true },
            ],
          },
          text: `OPCIÓN B [SALIDA COERCITIVA]: Resolver por imposición y riesgo calculado.

RESULTADO: chapter_pending_chapter03 | ruta_cap3_coercitiva`,
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "chapter_pending_chapter03" },
            { type: "addStateTag", tag: "ruta_cap3_coercitiva" },
            { type: "setRoute", route: "w" },
          ],
        },
        {
          id: "n2_1_salida_sombra",
          type: "dialogue",
          requirement: { type: "stateTag", tag: "ruta_cap2_intriga" },
          text: `OPCIÓN C [SALIDA EN SOMBRAS]: Mantener el control desde la incertidumbre.

RESULTADO: chapter_pending_chapter03 | ruta_cap3_sombras`,
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "chapter_pending_chapter03" },
            { type: "addStateTag", tag: "ruta_cap3_sombras" },
            { type: "setRoute", route: "q" },
          ],
        },
        {
          id: "n2_1_colapso",
          type: "dialogue",
          requirement: { type: "humanityMin", min: 1 },
          text: `RIESGO: Forzar la resolución sin respaldo ni salida.`,
          nextSceneId: "n2_end",
          effects: [
            {
              type: "fatalOutcome",
              id: "colapso_operativo_cap2",
              title: "Colapso operativo",
              body: "La operación pierde coherencia y se vuelve insostenible en pleno capítulo 2.",
            },
          ],
        },
      ],
    },
    {
      id: "n2_end",
      chapterId: "chapter02",
      title: "Cierre del capítulo",
      text: `CONTEXTO: Tránsito hacia capítulo 3.

NARRACIÓN: El capítulo termina con una ruta consolidada para la siguiente etapa.`,
      options: [],
    },
  ],
};

