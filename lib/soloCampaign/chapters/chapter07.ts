import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter07: SoloChapter = {
  id: "chapter07",
  title: "Santiago en Cenizas · Capítulo 7 · Ecos de la Tierra de Nod (linaje del Trono)",
  description: "Quinta Normal, túneles y el Archivista: la ciudad vieja habla desde el barro.",
  startSceneId: "n7_1",
  scenes: [
    {
      id: "n7_1",
      chapterId: "chapter07",
      title: "7.1 · Quinta Normal · Entrada al olvido",
      text: `La sangre negra vibra en tus venas. Bajas a los túneles pluviales de Quinta Normal: donde no llegan rascacielos ni relatos oficiales.`,
      options: [
        { id: "n7_1_enter", type: "dialogue", text: "Bajar a los túneles.", requirement: { type: "none" }, nextSceneId: "n7_2", effects: [{ type: "setFlag", flag: "novel_ch7_enter_cistern" }] },
        { id: "n7_1_auspex", type: "discipline", discipline: "auspex", disciplineTitle: "Memoria en sangre", text: "Seguir la intuición del vínculo oscuro.", requirement: { type: "discipline", discipline: "auspex", minLevel: 1 }, nextSceneId: "n7_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch7_blood_memory" }] },
        { id: "n7_1_research", type: "skill", skill: "investigacion", text: "Analizar arquitectura y rutas seguras.", requirement: { type: "skill", skill: "investigacion", minLevel: 1 }, nextSceneId: "n7_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch7_architecture_map" }] },
        { id: "n7_1_fortitude", type: "discipline", discipline: "fortitude", disciplineTitle: "Ignorar la inmundicia", text: "Blindarte contra hedor y humedad.", requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 }, nextSceneId: "n7_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch7_fortitude_stance" }] },
      ],
    },
    {
      id: "n7_2",
      chapterId: "chapter07",
      title: "7.2 · La biblioteca del caos",
      text: `Una cisterna convertida en mapa delirante de hilos rojos. El Archivista te recibe como embajador de seda en cueva de barro.`,
      options: [
        { id: "n7_2_listen", type: "dialogue", text: "Escuchar su red.", requirement: { type: "none" }, nextSceneId: "n7_end", effects: [{ type: "setFlag", flag: "novel_ch7_archivist_listen" }] },
        { id: "n7_2_presence", type: "discipline", discipline: "presence", disciplineTitle: "Exigir claridad", text: "Imponer voluntad para cortar acertijos.", requirement: { type: "discipline", discipline: "presence", minLevel: 2 }, nextSceneId: "n7_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch7_presence_clarity" }] },
        { id: "n7_2_insight", type: "skill", skill: "perspicacia", text: "Buscar el patrón en fotos y espinas.", requirement: { type: "skill", skill: "perspicacia", minLevel: 1 }, nextSceneId: "n7_end", effects: [{ type: "experienceDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch7_pattern_found" }] },
        { id: "n7_2_dominate", type: "discipline", discipline: "dominate", disciplineTitle: "Dime la verdad de 1814", text: "Forzar relato sin metáforas.", requirement: { type: "discipline", discipline: "dominate", minLevel: 2 }, nextSceneId: "n7_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch7_1814_truth" }] },
      ],
    },
    {
      id: "n7_end",
      chapterId: "chapter07",
      title: "7.E · Advertencia de Nod",
      text: `La visión te deja roto: Santiago bajo sol negro y diplomacia convertida en parche inútil.`,
      options: [{ id: "n7_end_continue", type: "dialogue", text: "Continuar al Capítulo 8", requirement: { type: "none" }, nextSceneId: "n7_end", effects: [{ type: "setFlag", flag: "chapter_pending_chapter08" }] }],
    },
  ],
};
