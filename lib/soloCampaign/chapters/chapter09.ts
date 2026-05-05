import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter09: SoloChapter = {
  id: "chapter09",
  title: "Santiago en Cenizas · Capítulo 9 · El Vínculo que Quema (linaje del Trono)",
  description: "Periferia sur, hambre y la humillación química del Vínculo.",
  startSceneId: "n9_1",
  scenes: [
    {
      id: "n9_1",
      chapterId: "chapter09",
      title: "9.1 · Toma · La correa de sangre",
      text: `Gato nombra lo que te rompía por dentro: la copa fue una correa. Tu voluntad Ventrue quedó hipotecada.`,
      options: [
        { id: "n9_1_truth", type: "dialogue", text: "Aceptar la verdad.", requirement: { type: "none" }, nextSceneId: "n9_2", effects: [{ type: "setFlag", flag: "novel_ch9_bond_known" }] },
        { id: "n9_1_fortitude", type: "discipline", discipline: "fortitude", disciplineTitle: "Resistir la compulsión", text: "Levantar un muro contra el afecto impuesto.", requirement: { type: "discipline", discipline: "fortitude", minLevel: 2 }, nextSceneId: "n9_2", effects: [{ type: "willpowerDelta", delta: -2 }, { type: "setFlag", flag: "novel_ch9_bond_resist" }] },
        { id: "n9_1_insight", type: "skill", skill: "perspicacia", text: "Analizar la química del vínculo.", requirement: { type: "skill", skill: "perspicacia", minLevel: 1 }, nextSceneId: "n9_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch9_bond_analysis" }] },
        { id: "n9_1_deny", type: "dialogue", text: "Negación aristocrática.", requirement: { type: "none" }, nextSceneId: "n9_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch9_bond_deny" }] },
      ],
    },
    {
      id: "n9_2",
      chapterId: "chapter09",
      title: "9.2 · El banquete de la miseria",
      text: `Un obrero duerme profundo. Tu paladar se rebela ante su origen, tu hambre no.`,
      options: [
        { id: "n9_2_gentle", type: "dialogue", text: "Alimentación quirúrgica.", requirement: { type: "none" }, nextSceneId: "n9_end", effects: [{ type: "hungerDelta", delta: -2 }, { type: "humanityDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch9_feed_gentle" }] },
        { id: "n9_2_dominate", type: "discipline", discipline: "dominate", disciplineTitle: "Sedación absoluta", text: "Asegurar sueño sin dolor.", requirement: { type: "discipline", discipline: "dominate", minLevel: 1 }, nextSceneId: "n9_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch9_dominate_clean_feed" }] },
        { id: "n9_2_medicine", type: "skill", skill: "medicina", text: "Optimizar recuperación del mortal.", requirement: { type: "skill", skill: "medicina", minLevel: 1 }, nextSceneId: "n9_end", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch9_medical_feed" }] },
        { id: "n9_2_deep", type: "dialogue", text: "Ceder al hambre profunda.", requirement: { type: "none" }, nextSceneId: "n9_end", effects: [{ type: "humanityDelta", delta: -1 }, { type: "hungerDelta", delta: -3 }, { type: "setFlag", flag: "novel_ch9_feed_deep" }] },
      ],
    },
    {
      id: "n9_end",
      chapterId: "chapter09",
      title: "9.E · La resolución del paria",
      text: `La visión del pacto de 1814 te orienta: volverás al centro no como mensajero obediente, sino para quemar cadenas.`,
      options: [{ id: "n9_end_continue", type: "dialogue", text: "Continuar al Capítulo 10", requirement: { type: "none" }, nextSceneId: "n9_end", effects: [{ type: "setFlag", flag: "chapter_pending_chapter10" }] }],
    },
  ],
};
