import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter08: SoloChapter = {
  id: "chapter08",
  title: "Santiago en Cenizas · Capítulo 8 · El Santuario Profanado (linaje del Trono)",
  description: "Teatinos marcado en sangre: el refugio cae y la neutralidad muere.",
  startSceneId: "n8_1",
  scenes: [
    {
      id: "n8_1",
      chapterId: "chapter08",
      title: "8.1 · Teatinos · Umbral cruzado",
      text: `La puerta de metal cuelga torcida. El goteo rítmico cae sobre cemento: marcaron tu casa y con eso marcaron tu cuerpo.`,
      options: [
        { id: "n8_1_enter_refuge", type: "dialogue", text: "Entrar con autoridad.", requirement: { type: "none" }, nextSceneId: "n8_2", effects: [{ type: "setFlag", flag: "novel_ch8_enter_refuge" }] },
        { id: "n8_1_auspex", type: "discipline", discipline: "auspex", disciplineTitle: "Tap. Tap. Tap.", text: "Ubicar la amenaza por oído.", requirement: { type: "discipline", discipline: "auspex", minLevel: 1 }, nextSceneId: "n8_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch8_auspex_drip" }] },
        { id: "n8_1_stealth", type: "skill", skill: "sigilo", text: "Flanquear desde sombras de imprenta.", requirement: { type: "skill", skill: "sigilo", minLevel: 1 }, nextSceneId: "n8_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch8_shadow_flank" }] },
        { id: "n8_1_fortitude", type: "discipline", discipline: "fortitude", disciplineTitle: "Prepararse para el impacto", text: "Tensar la resistencia sobrenatural.", requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 }, nextSceneId: "n8_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch8_brace" }] },
      ],
    },
    {
      id: "n8_2",
      chapterId: "chapter08",
      title: "8.2 · La sombra tatuada",
      text: `Mensaje en sangre: «LA MASCARADA ES LA JAULA». Una silueta sabática cae del techo y te llama pequeño activo.`,
      options: [
        { id: "n8_2_fight", type: "dialogue", text: "No negociar con carniceros.", requirement: { type: "none" }, nextSceneId: "n8_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch8_fight" }] },
        { id: "n8_2_celerity", type: "discipline", discipline: "celerity", disciplineTitle: "Moverse como el rayo", text: "Esquivar sus garras.", requirement: { type: "discipline", discipline: "celerity", minLevel: 1 }, nextSceneId: "n8_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch8_dodge" }] },
        { id: "n8_2_dominate", type: "discipline", discipline: "dominate", disciplineTitle: "¡Arrodíllate!", text: "Aplastar su voluntad.", requirement: { type: "discipline", discipline: "dominate", minLevel: 2 }, nextSceneId: "n8_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch8_dominate_kneel" }] },
        { id: "n8_2_brawl", type: "skill", skill: "pelea", text: "Contraataque con tuberías y hierro.", requirement: { type: "skill", skill: "pelea", minLevel: 1 }, nextSceneId: "n8_end", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch8_brawl_counter" }] },
      ],
    },
    {
      id: "n8_end",
      chapterId: "chapter08",
      title: "8.E · Cenizas de la rutina",
      text: `Gato te saca de la imprenta en llamas: el Sabat declaró guerra abierta y el Príncipe te usó como cebo.`,
      options: [{ id: "n8_end_continue", type: "dialogue", text: "Continuar al Capítulo 9", requirement: { type: "none" }, nextSceneId: "n8_end", effects: [{ type: "setFlag", flag: "chapter_pending_chapter09" }] }],
    },
  ],
};
