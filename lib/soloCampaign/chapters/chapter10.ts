import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter10: SoloChapter = {
  id: "chapter10",
  title: "Santiago en Cenizas · Capítulo 10 · La Cacería Salvaje (linaje del Trono)",
  description: "Mapocho en matadero, compulsión del vínculo y una cripta que despierta.",
  startSceneId: "n10_1",
  scenes: [
    {
      id: "n10_1",
      chapterId: "chapter10",
      title: "10.1 · Olor a cacería",
      text: `El trayecto al centro es un descenso. El Sabat ya no se esconde y el aire huele a caza abierta.`,
      options: [
        { id: "n10_1_to_station", type: "dialogue", text: "Dirigirme a la Estación Mapocho.", requirement: { type: "none" }, nextSceneId: "n10_2", effects: [{ type: "setFlag", flag: "novel_ch10_to_station" }] },
        { id: "n10_1_fear", type: "dialogue", text: "Controlar el pavor un minuto.", requirement: { type: "none" }, nextSceneId: "n10_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch10_fear" }] },
        { id: "n10_1_streetwise", type: "skill", skill: "callejeo", text: "Evaluar perímetro y rutas.", requirement: { type: "skill", skill: "callejeo", minLevel: 1 }, nextSceneId: "n10_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch10_perimeter" }] },
        { id: "n10_1_fortitude", type: "discipline", discipline: "fortitude", disciplineTitle: "Blindaje mental", text: "Mitigar cacofonía de gritos y sirenas.", requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 }, nextSceneId: "n10_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch10_fortitude_focus" }] },
      ],
    },
    {
      id: "n10_2",
      chapterId: "chapter10",
      title: "10.2 · Matadero",
      text: `La estación cuelga cuerpos como advertencia. El vínculo te golpea: proteger el secreto, cueste lo que cueste.`,
      options: [
        { id: "n10_2_enter", type: "dialogue", text: "Entrar en el nido.", requirement: { type: "none" }, nextSceneId: "n10_3", effects: [{ type: "setFlag", flag: "novel_ch10_enter_tunnel" }] },
        { id: "n10_2_presence", type: "discipline", discipline: "presence", disciplineTitle: "Desafiar la compulsión", text: "Entrar bajo tus términos.", requirement: { type: "discipline", discipline: "presence", minLevel: 2 }, nextSceneId: "n10_3", effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "novel_ch10_bond_pull" }] },
        { id: "n10_2_stealth", type: "skill", skill: "sigilo", text: "Infiltración entre monstruos.", requirement: { type: "skill", skill: "sigilo", minLevel: 1 }, nextSceneId: "n10_3", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch10_stealth_entry" }] },
        { id: "n10_2_dominate", type: "discipline", discipline: "dominate", disciplineTitle: "¡Apartaos!", text: "Abrirte paso por mando.", requirement: { type: "discipline", discipline: "dominate", minLevel: 2 }, nextSceneId: "n10_3", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch10_dominate_corridor" }] },
      ],
    },
    {
      id: "n10_3",
      chapterId: "chapter10",
      title: "10.3 · Cripta",
      text: `Una cámara anterior a la conquista se abre. El frío azul rompe el vínculo por un segundo ante una autoridad más vieja.`,
      options: [
        { id: "n10_3_run", type: "dialogue", text: "Huir de la sombra.", requirement: { type: "none" }, nextSceneId: "n10_end", effects: [{ type: "setFlag", flag: "novel_ch10_run" }] },
        { id: "n10_3_stare", type: "dialogue", text: "Mirar al abismo.", requirement: { type: "none" }, nextSceneId: "n10_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch10_stare" }] },
        { id: "n10_3_occult", type: "skill", skill: "ocultismo", text: "Identificar la presencia.", requirement: { type: "skill", skill: "ocultismo", minLevel: 1 }, nextSceneId: "n10_end", effects: [{ type: "experienceDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch10_occult_read" }] },
        { id: "n10_3_auspex", type: "discipline", discipline: "auspex", disciplineTitle: "Ver el despertar", text: "Enfocar la silueta real.", requirement: { type: "discipline", discipline: "auspex", minLevel: 2 }, nextSceneId: "n10_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch10_auspex_witness" }] },
      ],
    },
    {
      id: "n10_end",
      chapterId: "chapter10",
      title: "10.E · El despertar comenzó",
      text: `La Cacería Salvaje terminó, pero algo peor arrancó debajo de Santiago.`,
      options: [{ id: "n10_end_continue", type: "dialogue", text: "Continuar al Capítulo 11", requirement: { type: "none" }, nextSceneId: "n10_end", effects: [{ type: "setFlag", flag: "chapter_pending_chapter11" }] }],
    },
  ],
};
