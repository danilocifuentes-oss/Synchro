import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter13: SoloChapter = {
  id: "chapter13",
  title: "Santiago en Cenizas · Capítulo 13 · El Trono de Humo (linaje del Trono)",
  description: "Sanhattan, helipuerto y la verdad del filtro: elegir corona o sombra.",
  startSceneId: "n13_1",
  scenes: [
    {
      id: "n13_1",
      chapterId: "chapter13",
      title: "13.1 · Sanhattan · El ascenso al Olimpo",
      text: `Subes a la Gran Torre con un vacío en el pecho: la cadena del vínculo quedó muda, pero su cicatriz no.`,
      options: [
        { id: "n13_1_tower", type: "dialogue", text: "El Vínculo se ha roto.", requirement: { type: "none" }, nextSceneId: "n13_2", effects: [{ type: "setFlag", flag: "novel_ch13_tower" }] },
        { id: "n13_1_doubt", type: "dialogue", text: "Dudar ante el abismo.", requirement: { type: "none" }, nextSceneId: "n13_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch13_doubt" }] },
        { id: "n13_1_stealth", type: "skill", skill: "sigilo", text: "Acechar desde la periferia.", requirement: { type: "skill", skill: "sigilo", minLevel: 1 }, nextSceneId: "n13_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch13_stealth_watch" }] },
        { id: "n13_1_auspex", type: "discipline", discipline: "auspex", disciplineTitle: "Ver su cansancio", text: "Confirmar miedo bajo su seda.", requirement: { type: "discipline", discipline: "auspex", minLevel: 2 }, nextSceneId: "n13_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch13_auspex_prince_fear" }] },
      ],
    },
    {
      id: "n13_2",
      chapterId: "chapter13",
      title: "13.2 · Helipuerto · La verdad del filtro",
      text: `El Príncipe te llama experimento de control de daños: fuiste diseñado para absorber infección vieja y ser exprimido después.`,
      options: [
        { id: "n13_2_refuse", type: "dialogue", text: "No quiero tu trono.", requirement: { type: "none" }, nextSceneId: "n13_end", effects: [{ type: "setFlag", flag: "novel_ch13_refuse" }] },
        { id: "n13_2_attack", type: "discipline", discipline: "potence", disciplineTitle: "Explosión de odio", text: "Lanzarte con furia total.", requirement: { type: "discipline", discipline: "potence", minLevel: 2 }, nextSceneId: "n13_end", effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "novel_ch13_attack" }] },
        { id: "n13_2_dominate", type: "discipline", discipline: "dominate", disciplineTitle: "Disputar el mando", text: "Quebrar su voluntad ejecutiva.", requirement: { type: "discipline", discipline: "dominate", minLevel: 2 }, nextSceneId: "n13_end", effects: [{ type: "hungerDelta", delta: 2 }, { type: "setFlag", flag: "novel_ch13_dominate_duel" }] },
        { id: "n13_2_politics", type: "skill", skill: "politica", text: "Negociar exilio financiado.", requirement: { type: "skill", skill: "politica", minLevel: 1 }, nextSceneId: "n13_end", effects: [{ type: "willpowerDelta", delta: 2 }, { type: "setFlag", flag: "novel_ch13_political_exit" }] },
      ],
    },
    {
      id: "n13_end",
      chapterId: "chapter13",
      title: "13.E · La caída voluntaria",
      text: `No eres activo contable ni embajador: solo un fantasma que se niega a ser borrado.`,
      options: [{ id: "n13_end_continue", type: "dialogue", text: "Ir al Epílogo", requirement: { type: "none" }, nextSceneId: "n13_end", effects: [{ type: "setFlag", flag: "chapter_pending_epilogue" }] }],
    },
  ],
};
