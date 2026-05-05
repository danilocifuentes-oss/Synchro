import type { SoloChapter } from "@/lib/soloCampaign/types";

export const soloEpilogue: SoloChapter = {
  id: "epilogue",
  title: "Santiago en Cenizas · Epílogo · Cenizas al Amanecer (linaje del Trono)",
  description: "Fin de ruta Ventrue: libertad sin corona y letargo con memoria.",
  startSceneId: "ne_1",
  scenes: [
    {
      id: "ne_1",
      chapterId: "epilogue",
      title: "E.1 · El juicio del sol",
      text: `El sol asoma tras la cordillera. Para los vivos es esperanza; para ti, sentencia. Eres un Ventrue sin corona, soberano de tu propia nada.`,
      options: [
        {
          id: "ne_1_ambition",
          type: "dialogue",
          text: "«Santiago sigue siendo mía».",
          requirement: { type: "none" },
          visibilityRequirement: { type: "route", route: ["q", "main"] },
          nextSceneId: "ne_final",
          effects: [{ type: "setFlag", flag: "novel_epilogue_ambition" }, { type: "setEnding", endingId: "endingA" }],
        },
        {
          id: "ne_1_redemption",
          type: "dialogue",
          text: "Buscar redención en el sueño.",
          requirement: { type: "none" },
          visibilityRequirement: { type: "route", route: ["w", "main"] },
          nextSceneId: "ne_final",
          effects: [{ type: "humanityDelta", delta: 1 }, { type: "setFlag", flag: "novel_epilogue_redemption" }, { type: "setEnding", endingId: "endingB" }],
        },
        {
          id: "ne_1_defiance",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Resistir hasta el último segundo",
          text: "Desafiar la luz un instante más.",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 2 },
          visibilityRequirement: { type: "route", route: ["e", "main"] },
          nextSceneId: "ne_final",
          effects: [{ type: "willpowerDelta", delta: -2 }, { type: "setFlag", flag: "novel_epilogue_defiance" }, { type: "setEnding", endingId: "endingC" }],
        },
        {
          id: "ne_1_ghost",
          type: "dialogue",
          text: "Desaparecer en la maquinaria.",
          requirement: { type: "none" },
          visibilityRequirement: { type: "route", route: ["r", "main"] },
          nextSceneId: "ne_final",
          effects: [{ type: "setFlag", flag: "novel_epilogue_ghost" }, { type: "setEnding", endingId: "endingD" }],
        },
      ],
    },
    {
      id: "ne_final",
      chapterId: "epilogue",
      title: "E.F · Letargo",
      text: `Cierras los ojos donde el sol no alcanza. La oscuridad te envuelve como el único trono que realmente te pertenece.`,
      options: [{ id: "ne_final_close", type: "dialogue", text: "Cerrar (volver al Nexo)", requirement: { type: "none" }, nextSceneId: "ne_final", effects: [{ type: "setFlag", flag: "novel_epilogue_complete" }] }],
    },
  ],
};
