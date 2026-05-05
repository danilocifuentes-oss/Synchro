import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter06: SoloChapter = {
  id: "chapter06",
  title: "Santiago en Cenizas · Capítulo 6 · La Máscara del Diplomático (linaje del Trono)",
  description: "Viña del Silencio, mesa de sangre y una copa negra que ata voluntades.",
  startSceneId: "n6_1",
  scenes: [
    {
      id: "n6_1",
      chapterId: "chapter06",
      title: "6.1 · La invitación de seda",
      text: `Llega un sobre en papel crema con olor a lavanda. El Príncipe requiere tu presencia en la Viña del Silencio.`,
      options: [
        { id: "n6_1_accept", type: "dialogue", text: "Aceptar el protocolo.", requirement: { type: "none" }, nextSceneId: "n6_2", effects: [{ type: "setFlag", flag: "novel_ch6_invite_accept" }] },
        { id: "n6_1_resist", type: "dialogue", text: "Analizar la amenaza y tragar el impulso de huir.", requirement: { type: "none" }, nextSceneId: "n6_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch6_invite_resist" }] },
        { id: "n6_1_etiquette", type: "skill", skill: "etiqueta", text: "Investigar etiqueta y asistentes antes de llegar.", requirement: { type: "skill", skill: "etiqueta", minLevel: 1 }, nextSceneId: "n6_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch6_guest_probe" }] },
        { id: "n6_1_streetwise", type: "skill", skill: "callejeo", text: "Consultar a Gato sobre la reunión.", requirement: { type: "skill", skill: "callejeo", minLevel: 1 }, nextSceneId: "n6_2", effects: [{ type: "experienceDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch6_gato_take" }] },
      ],
    },
    {
      id: "n6_2",
      chapterId: "chapter06",
      title: "6.2 · Mesa larga · Copas rojas",
      text: `En una casona del Maipo, seis invitados catan sangre por cosecha. El Príncipe preside como si el esmoquin fuera armadura.`,
      options: [
        { id: "n6_2_observe", type: "dialogue", text: "Observación analítica.", requirement: { type: "none" }, nextSceneId: "n6_3", effects: [{ type: "setFlag", flag: "novel_ch6_table_observe" }] },
        { id: "n6_2_presence", type: "discipline", discipline: "presence", disciplineTitle: "Etiqueta con filo", text: "Hacerte notar en la mesa.", requirement: { type: "discipline", discipline: "presence", minLevel: 1 }, nextSceneId: "n6_3", effects: [{ type: "setFlag", flag: "novel_ch6_presence_table" }] },
        { id: "n6_2_insight", type: "skill", skill: "perspicacia", text: "Evaluar tensión entre comensales.", requirement: { type: "skill", skill: "perspicacia", minLevel: 1 }, nextSceneId: "n6_3", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch6_tension_read" }] },
        { id: "n6_2_auspex", type: "discipline", discipline: "auspex", disciplineTitle: "Latidos ajenos", text: "Percibir quién miente.", requirement: { type: "discipline", discipline: "auspex", minLevel: 1 }, nextSceneId: "n6_3", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch6_auspex_liar" }] },
      ],
    },
    {
      id: "n6_3",
      chapterId: "chapter06",
      title: "6.3 · La copa de cristal negro",
      text: `Doña Inés trae la copa negra. El Príncipe ordena beber: sello de tregua y cadena de embajador.`,
      options: [
        { id: "n6_3_drink", type: "dialogue", text: "Beber por deber.", requirement: { type: "none" }, nextSceneId: "n6_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch6_black_cup" }] },
        { id: "n6_3_delay", type: "discipline", discipline: "dominate", disciplineTitle: "Demorar el golpe", text: "Pedir un minuto sin réplica.", requirement: { type: "discipline", discipline: "dominate", minLevel: 1 }, nextSceneId: "n6_end", effects: [{ type: "hungerDelta", delta: 2 }, { type: "setFlag", flag: "novel_ch6_black_cup_delay" }] },
        { id: "n6_3_politics", type: "skill", skill: "politica", text: "Cuestionar los términos del mandato.", requirement: { type: "skill", skill: "politica", minLevel: 1 }, nextSceneId: "n6_end", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch6_terms_asked" }] },
        { id: "n6_3_analyze", type: "dialogue", text: "Analizar el contenido de la mezcla.", requirement: { type: "none" }, nextSceneId: "n6_end", effects: [{ type: "experienceDelta", delta: 2 }, { type: "setFlag", flag: "novel_ch6_blend_probe" }] },
      ],
    },
    {
      id: "n6_end",
      chapterId: "chapter06",
      title: "6.E · Marca en las venas",
      text: `Abandonas la Viña con una pesadez nueva: rostro del Príncipe y esclavo de su voluntad en la misma respiración.`,
      options: [{ id: "n6_end_continue", type: "dialogue", text: "Continuar al Capítulo 7", requirement: { type: "none" }, nextSceneId: "n6_end", effects: [{ type: "setFlag", flag: "chapter_pending_chapter07" }] }],
    },
  ],
};
