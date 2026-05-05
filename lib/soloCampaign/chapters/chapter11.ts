import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter11: SoloChapter = {
  id: "chapter11",
  title: "Santiago en Cenizas · Capítulo 11 · Descenso al Alcantarillado (linaje del Trono)",
  description: "Bóvedas de barro, Nosferatu y una llave de bronce para romper cadenas.",
  startSceneId: "n11_1",
  scenes: [
    {
      id: "n11_1",
      chapterId: "chapter11",
      title: "11.1 · Bajo Santiago · El laberinto de fango",
      text: `Huyes con Gato por venas coloniales de la ciudad. El barro arruina tu porte, pero no la urgencia.`,
      options: [
        { id: "n11_1_marks", type: "dialogue", text: "Seguir marcas de tiza.", requirement: { type: "none" }, nextSceneId: "n11_2", effects: [{ type: "setFlag", flag: "novel_ch11_marks" }] },
        { id: "n11_1_auspex", type: "discipline", discipline: "auspex", disciplineTitle: "Peso en la humedad", text: "Percibir movimiento en paredes.", requirement: { type: "discipline", discipline: "auspex", minLevel: 1 }, nextSceneId: "n11_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch11_auspex" }] },
        { id: "n11_1_athletics", type: "skill", skill: "atletismo", text: "Paso firme en el lodo.", requirement: { type: "skill", skill: "atletismo", minLevel: 1 }, nextSceneId: "n11_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch11_athletic_flow" }] },
        { id: "n11_1_fortitude", type: "discipline", discipline: "fortitude", disciplineTitle: "Pulmones muertos", text: "Ignorar metano y humedad rancia.", requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 }, nextSceneId: "n11_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch11_fortitude_air" }] },
      ],
    },
    {
      id: "n11_2",
      chapterId: "chapter11",
      title: "11.2 · El reino de las ratas",
      text: `El Choro te ofrece un trueque: libertad de seda y mármol a cambio de deuda con la mugre.`,
      options: [
        { id: "n11_2_trade", type: "dialogue", text: "Aceptar el trueque.", requirement: { type: "none" }, nextSceneId: "n11_end", effects: [{ type: "setFlag", flag: "novel_ch11_trade" }] },
        { id: "n11_2_refuse", type: "dialogue", text: "Negar el pacto por orgullo de linaje.", requirement: { type: "none" }, nextSceneId: "n11_end", effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "novel_ch11_refuse" }] },
        { id: "n11_2_presence", type: "discipline", discipline: "presence", disciplineTitle: "Negociación de alto nivel", text: "Imponer trato de igual a igual.", requirement: { type: "discipline", discipline: "presence", minLevel: 2 }, nextSceneId: "n11_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch11_presence_trade" }] },
        { id: "n11_2_insight", type: "skill", skill: "perspicacia", text: "Leer motivación real del Choro.", requirement: { type: "skill", skill: "perspicacia", minLevel: 1 }, nextSceneId: "n11_end", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch11_choro_read" }] },
      ],
    },
    {
      id: "n11_end",
      chapterId: "chapter11",
      title: "11.E · La llave de bronce",
      text: `El Choro te entrega una llave oxidada: la única herramienta para quebrar el vínculo bajo la Catedral.`,
      options: [{ id: "n11_end_continue", type: "dialogue", text: "Continuar al Capítulo 12", requirement: { type: "none" }, nextSceneId: "n11_end", effects: [{ type: "setFlag", flag: "chapter_pending_chapter12" }, { type: "setFlag", flag: "novel_ch11_key_taken" }] }],
    },
  ],
};
