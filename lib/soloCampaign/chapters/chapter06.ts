import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter06: SoloChapter = {
  id: "chapter06",
  title: "Santiago en Cenizas · Capítulo 6 · La Viña del Silencio",
  description: "Valle del Maipo, brindis negro, pacto de sombras y bifurcación hacia el corazón de la ciudad.",
  startSceneId: "n6_0",
  scenes: [
    {
      id: "n6_0",
      chapterId: "chapter06",
      title: "6.0 · El Valle del Maipo",
      text: `Viña del Silencio, alrededores de Buin. Madrugada profunda. El aire huele a tierra mojada y lavanda.

Elena te conduce hasta una casona patronal: "Adentro, la sangre es más espesa que la política. No bebas nada que no sepas de dónde viene".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "chapter06_route_vina_silencio", equals: true },
          text: "Llegas por citación secreta tras la noche de disturbios.",
        },
        {
          requirement: { type: "flag", flag: "fugitivo_corte", equals: true },
          text: "Si vienes como fugitivo, entras con la guardia en alto, esperando una trampa en cada pasillo.",
        },
        {
          requirement: { type: "flag", flag: "doble_agente", equals: true },
          text: "Si eres doble agente, buscas aliados contra Inés mientras sonríes para la Corte.",
        },
      ],
      options: [
        {
          id: "n6_0_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: "Analizar la disposición de los invitados en el salón.",
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          nextSceneId: "n6_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "mapa_politico_vina" }],
        },
        {
          id: "n6_0_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Vibración bajo el suelo",
          text: "Sentir las vibraciones del lugar.",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "n6_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "secreto_bajo_vina" }],
        },
        {
          id: "n6_0_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: "Buscar señales de hiel en las copas de los invitados.",
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n6_1",
          effects: [{ type: "setFlag", flag: "elite_infectada" }],
        },
        {
          id: "n6_0_fachada",
          type: "dialogue",
          text: "Dejarte llevar al salón actuando el papel de invitado: sin lectura fina, solo instinto de supervivencia.",
          requirement: { type: "none" },
          nextSceneId: "n6_1",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "vina_entrada_fachada" }],
        },
      ],
    },
    {
      id: "n6_1",
      chapterId: "chapter06",
      title: "6.1 · El brindis negro",
      text: `Comedor principal. Una mesa larga con una sola jarra de cristal negro al centro.

El Príncipe alza la voz: "Santiago necesita unidad, y la unidad requiere un sacrificio compartido". Elena te ofrece la copa.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "traicion_ines", equals: true },
          text: "Si conoces la traición de Inés, notas que Elena te observa con intensidad depredadora, esperando tu fallo.",
        },
      ],
      options: [
        {
          id: "n6_1_beber",
          type: "dialogue",
          text: "Beber la copa para mantener tu cobertura.",
          requirement: { type: "none" },
          nextSceneId: "n6_2",
          effects: [{ type: "setFlag", flag: "vinculo_sangre" }, { type: "willpowerDelta", delta: -2 }],
        },
        {
          id: "n6_1_persuasion",
          type: "dialogue",
          text: "Cuestionar el origen de la cosecha frente a todos.",
          requirement: { type: "none" },
          nextSceneId: "n6_2",
          effects: [{ type: "setFlag", flag: "disidente_publico" }],
        },
        {
          id: "n6_1_dominate_reveal",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Usted primero",
          text: "Obligar a otro invitado a beber primero.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "dominate", minLevel: 1 },
              { type: "flag", flag: "elite_infectada", equals: true },
            ],
          },
          nextSceneId: "n6_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "veneno_revelado" }],
        },
      ],
    },
    {
      id: "n6_2",
      chapterId: "chapter06",
      title: "6.2 · El pacto de las sombras",
      text: `Balcón de la viña. Vista a los campos oscuros.

El Príncipe te llama aparte: "El Sabat no es el problema. Lo que viene es la Gehena, y Santiago es el primer sello". Te entrega una llave de bronce.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "secreto_bajo_vina", equals: true },
          text: "La llave vibra en tu mano con la misma frecuencia del latido que sentiste bajo el suelo.",
        },
      ],
      options: [
        {
          id: "n6_2_investigacion",
          type: "dialogue",
          text: "Preguntar por el Archivista y la llave.",
          requirement: { type: "none" },
          nextSceneId: "n6_end",
          effects: [{ type: "setFlag", flag: "mision_catedral" }],
        },
        {
          id: "n6_2_politica",
          type: "skill",
          skill: "politica",
          text: "Exigir territorio propio a cambio de silencio.",
          requirement: { type: "skill", skill: "politica", minLevel: 1 },
          nextSceneId: "n6_end",
          effects: [{ type: "setFlag", flag: "dueno_lastarria" }],
        },
        {
          id: "n6_2_auspex_vinculo",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Cruzar el puente mental",
          text: "Usar el vínculo para leer la mente del Príncipe.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "auspex", minLevel: 1 },
              { type: "flag", flag: "vinculo_sangre", equals: true },
            ],
          },
          nextSceneId: "n6_end",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "traicion_principe_vista" }],
        },
      ],
    },
    {
      id: "n6_end",
      chapterId: "chapter06",
      title: "6.E · Hacia el corazón de la ciudad",
      text: `El coche te espera para volver al centro. El amanecer está a minutos.

Elena abre la puerta: "El tiempo de los secretos terminó. Ahora empieza el tiempo de la sangre".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "mision_catedral", equals: true },
          text: "La llave de bronce quema en tu bolsillo como una orden viva.",
        },
        {
          requirement: { type: "flag", flag: "vinculo_sangre", equals: true },
          text: "Sientes una necesidad física de complacer al Príncipe y eso te produce asco.",
        },
      ],
      options: [
        {
          id: "n6_end_to_ch7_main",
          type: "dialogue",
          text: "Ir hacia Plaza de Armas (misión de Catedral).",
          requirement: { type: "flag", flag: "mision_catedral", equals: true },
          nextSceneId: "n6_end",
          effects: [{ type: "setFlag", flag: "chapter07_route_vinculo_quema" }, { type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
        {
          id: "n6_end_to_ch7_rebelde",
          type: "dialogue",
          text: "Buscar a Gato para una alianza desesperada.",
          requirement: { type: "flag", flag: "traicion_principe_vista", equals: true },
          nextSceneId: "n6_end",
          effects: [{ type: "setFlag", flag: "chapter07_route_rebelde" }, { type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
        {
          id: "n6_end_to_ch7_escape",
          type: "dialogue",
          text: "Escapar de la guerra interna del Maipo.",
          requirement: { type: "flag", flag: "veneno_revelado", equals: true },
          nextSceneId: "n6_end",
          effects: [{ type: "setFlag", flag: "chapter07_route_escape_maipo" }, { type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
        {
          id: "n6_end_default",
          type: "dialogue",
          text: "Continuar al Capítulo 7",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                { type: "flag", flag: "mision_catedral", equals: true },
                { type: "flag", flag: "traicion_principe_vista", equals: true },
                { type: "flag", flag: "veneno_revelado", equals: true },
              ],
            },
          },
          nextSceneId: "n6_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
      ],
    },
  ],
};
