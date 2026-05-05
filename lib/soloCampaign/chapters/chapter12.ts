import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter12: SoloChapter = {
  id: "chapter12",
  title: "Santiago en Cenizas · Capítulo 12 · La Última Noche del Sol (linaje del Trono)",
  description: "Plaza de Armas, Catedral y relicario: libertad a precio de humanidad.",
  startSceneId: "n12_1",
  scenes: [
    {
      id: "n12_1",
      chapterId: "chapter12",
      title: "12.1 · Plaza de Armas · El umbral sagrado",
      text: `Sales de alcantarillas a un purgatorio iluminado. La llave de bronce pesa como sentencia.`,
      options: [
        { id: "n12_1_enter", type: "dialogue", text: "Entrar con determinación.", requirement: { type: "none" }, nextSceneId: "n12_2", effects: [{ type: "setFlag", flag: "novel_ch12_enter_cathedral" }] },
        { id: "n12_1_fortitude", type: "discipline", discipline: "fortitude", disciplineTitle: "Soportar la presión", text: "Blindarte contra el llamado del vínculo.", requirement: { type: "discipline", discipline: "fortitude", minLevel: 2 }, nextSceneId: "n12_2", effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "novel_ch12_fortitude_push" }] },
        { id: "n12_1_etiquette", type: "skill", skill: "etiqueta", text: "Ocultarte en la fe como fiel tardío.", requirement: { type: "skill", skill: "etiqueta", minLevel: 1 }, nextSceneId: "n12_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch12_etiquette_cover" }] },
        { id: "n12_1_auspex", type: "discipline", discipline: "auspex", disciplineTitle: "Percibir los juicios", text: "Sentir la vigilancia de piedra.", requirement: { type: "discipline", discipline: "auspex", minLevel: 1 }, nextSceneId: "n12_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch12_auspex_judged" }] },
      ],
    },
    {
      id: "n12_2",
      chapterId: "chapter12",
      title: "12.2 · El osario del mandato",
      text: `Un relicario de plata guarda sustancia roja con olor a mandato absoluto. Es el nexo místico del Príncipe.`,
      options: [
        { id: "n12_2_break", type: "dialogue", text: "Romper el relicario.", requirement: { type: "none" }, nextSceneId: "n12_end", effects: [{ type: "humanityDelta", delta: -2 }, { type: "setFlag", flag: "novel_ch12_break_relic" }] },
        { id: "n12_2_hesitate", type: "dialogue", text: "Dudar ante la profanación.", requirement: { type: "none" }, nextSceneId: "n12_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch12_hesitate" }] },
        { id: "n12_2_dominate", type: "discipline", discipline: "dominate", disciplineTitle: "Reclamar el fragmento", text: "Disolver mando sin destruirte.", requirement: { type: "discipline", discipline: "dominate", minLevel: 2 }, nextSceneId: "n12_end", effects: [{ type: "hungerDelta", delta: 2 }, { type: "setFlag", flag: "novel_ch12_dominate_relic" }] },
        { id: "n12_2_occult", type: "skill", skill: "ocultismo", text: "Analizar el pacto.", requirement: { type: "skill", skill: "ocultismo", minLevel: 1 }, nextSceneId: "n12_end", effects: [{ type: "experienceDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch12_occult_pact" }] },
      ],
    },
    {
      id: "n12_end",
      chapterId: "chapter12",
      title: "12.E · El sacrificio de la Humanidad",
      text: `El muchacho del Mapocho era la fuente del vínculo. Cierras el círculo y la onda de dolor te libera.`,
      options: [{ id: "n12_end_continue", type: "dialogue", text: "Continuar al Capítulo 13", requirement: { type: "none" }, nextSceneId: "n12_end", effects: [{ type: "setFlag", flag: "chapter_pending_chapter13" }] }],
    },
  ],
};
