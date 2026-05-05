import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter04: SoloChapter = {
  id: "chapter04",
  title: "Santiago en Cenizas · Capítulo 4 · Archivos Desenterrados",
  description: "Biblioteca Nacional, Archivista, emboscada de seda y bifurcación de lealtades.",
  startSceneId: "n4_0",
  scenes: [
    {
      id: "n4_0",
      chapterId: "chapter04",
      title: "4.0 · El peso del secreto",
      text: `Interior de la Biblioteca Nacional. Madrugada. El zumbido de los deshumidificadores corta el silencio.

El nombre del Archivista te trajo aquí. La Biblioteca no es solo depósito de libros: es el osario donde los Ventrue de 1814 enterraron verdades que vuelven a respirar.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "chapter04_route_politica", equals: true },
          text: "Si vienes de la Ruta Política, entras por la puerta principal con credencial de la Intendencia.",
        },
        {
          requirement: { type: "flag", flag: "chapter04_route_medica", equals: true },
          text: "Si vienes de la Ruta Médica, te cuelas por ventilación con la herida de la hiel todavía pulsando.",
        },
      ],
      options: [
        {
          id: "n4_0_investigacion",
          type: "skill",
          skill: "investigacion",
          text: "Localizar la sección de mapas coloniales excluidos.",
          requirement: { type: "skill", skill: "investigacion", minLevel: 1 },
          nextSceneId: "n4_1",
          effects: [{ type: "setFlag", flag: "mapas_originales" }],
        },
        {
          id: "n4_0_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Hilo de sándalo",
          text: "Rastrear el aroma de sándalo hacia el subsuelo.",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "n4_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "oficina_secreta" }],
        },
        {
          id: "n4_0_sigilo",
          type: "skill",
          skill: "sigilo",
          text: "Evitar a los guardias nocturnos demasiado alerta.",
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n4_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "vigilancia_detectada" }],
        },
        {
          id: "n4_0_forzar",
          type: "dialogue",
          text: "Empujar hasta la sala sin método: confiar en arrogancia Ventrue para abrir puertas.",
          requirement: { type: "none" },
          nextSceneId: "n4_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "biblioteca_entrada_torpe" }],
        },
      ],
    },
    {
      id: "n4_1",
      chapterId: "chapter04",
      title: "4.1 · El encuentro con el Archivista",
      text: `Sala de Restauración. Luz de tungsteno. Un hombre de manos temblorosas y ojos vidriosos te espera.

Sobre la mesa descansa un documento fundacional con tinta carmesí antinatural. "La sangre de los Reyes siempre vuelve al lugar del crimen", susurra.`,
      options: [
        {
          id: "n4_1_diplomacia",
          type: "dialogue",
          text: "Vengo a entender el pacto de 1814.",
          requirement: { type: "none" },
          nextSceneId: "n4_2",
          effects: [{ type: "setFlag", flag: "lore_cuarentena" }, { type: "setFlag", flag: "novel_ch4_lineage_mapped" }],
        },
        {
          id: "n4_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Sin acertijos",
          text: "Forzarlo a entregar los archivos originales.",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n4_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "lista_traidores" }],
        },
        {
          id: "n4_1_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: "Notar que el Archivista está siendo chantajeado.",
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n4_2",
          effects: [{ type: "setFlag", flag: "traicion_ines" }],
        },
      ],
    },
    {
      id: "n4_2",
      chapterId: "chapter04",
      title: "4.2 · La emboscada de seda",
      text: `Pasillo de los Retratos. Luces de emergencia encendidas.

Doña Inés te corta el paso con dos ejecutores armados. "El conocimiento es una carga que tu linaje no puede soportar todavía".`,
      options: [
        {
          id: "n4_2_presence",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Majestad de supervivencia",
          text: "Obligar a los ejecutores a dudar y huir por una ventana.",
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n4_end",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "fugitivo_corte" }],
        },
        {
          id: "n4_2_engano",
          type: "dialogue",
          text: "Entregar un documento falso.",
          requirement: { type: "flag", flag: "mapas_originales", equals: true },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "doble_agente" }],
        },
        {
          id: "n4_2_fortitude",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Romper el cerco",
          text: "Arrollar a los guardias y escapar con pruebas.",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n4_end",
          effects: [{ type: "healthDamageDelta", delta: -2 }, { type: "setFlag", flag: "herida_escape" }],
        },
        {
          id: "n4_2_correr",
          type: "dialogue",
          text: "Correr hacia la salida de servicio: sin plan, solo pánico dirigido.",
          requirement: { type: "none" },
          nextSceneId: "n4_end",
          effects: [{ type: "healthDamageDelta", delta: -2 }, { type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "fugitivo_biblioteca_torpe" }],
        },
      ],
    },
    {
      id: "n4_end",
      chapterId: "chapter04",
      title: "4.E · La ciudad en llamas",
      text: `Azotea frente a la Biblioteca Nacional. Las sirenas de Plaza Italia empiezan a coser la madrugada.

Santiago ya no es tu cuna; es tu campo de batalla.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "fugitivo_corte", equals: true },
          text: "Como fugitivo, tu única opción viable es contactar a Gato.",
        },
        {
          requirement: { type: "flag", flag: "doble_agente", equals: true },
          text: "Como doble agente, debes preparar la mentira que le venderás al Príncipe.",
        },
      ],
      options: [
        {
          id: "n4_end_ruta_anarquista",
          type: "dialogue",
          text: "Ir a la zona de conflicto (ruta anarquista).",
          requirement: { type: "flag", flag: "fugitivo_corte", equals: true },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "chapter05_route_anarquista" }, { type: "setFlag", flag: "chapter_pending_chapter05" }],
        },
        {
          id: "n4_end_ruta_camarilla",
          type: "dialogue",
          text: "Reportar a la Torre de Sanhattan (ruta camarilla).",
          requirement: { type: "flag", flag: "doble_agente", equals: true },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "chapter05_route_camarilla" }, { type: "setFlag", flag: "chapter_pending_chapter05" }],
        },
        {
          id: "n4_end_default",
          type: "dialogue",
          text: "Continuar al Capítulo 5",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                { type: "flag", flag: "fugitivo_corte", equals: true },
                { type: "flag", flag: "doble_agente", equals: true },
              ],
            },
          },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter05" }],
        },
        {
          id: "n4_end_unlock_special",
          type: "dialogue",
          text: "Guardar la carta para chantajear a Doña Inés.",
          requirement: { type: "flag", flag: "traicion_ines", equals: true },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "chapter05_special_ines_blackmail" }],
        },
      ],
    },
  ],
};
