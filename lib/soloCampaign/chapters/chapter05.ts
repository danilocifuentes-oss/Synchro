import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter05: SoloChapter = {
  id: "chapter05",
  title: "Santiago en Cenizas · Capítulo 5 · Entre el Neón y la Barricada (linaje del Trono)",
  description: "Plaza Italia arde; el caos callejero fuerza decisiones entre máscara, hambre y gobierno.",
  startSceneId: "n5_1",
  scenes: [
    {
      id: "n5_1",
      chapterId: "chapter05",
      title: "5.1 · Plaza Italia · El eje de la furia",
      text: `La calle revienta. Te encuentras en la intersección de la Alameda con Vicuña Mackenna. El gas lacrimógeno irrita tu piel muerta mientras miles de humanos sangran adrenalina en la boca del desorden.`,
      options: [
        { id: "n5_1_mask", type: "dialogue", text: "Mantenerme bajo máscara.", requirement: { type: "none" }, nextSceneId: "n5_2", effects: [{ type: "setFlag", flag: "novel_ch5_mask" }] },
        { id: "n5_1_presence", type: "discipline", discipline: "presence", disciplineTitle: "Autoridad en el caos", text: "Emitir mando para que la multitud se aparte.", requirement: { type: "discipline", discipline: "presence", minLevel: 1 }, nextSceneId: "n5_2", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch5_presence_gato" }] },
        { id: "n5_1_insight", type: "skill", skill: "perspicacia", text: "Analizar la logística del motín.", requirement: { type: "skill", skill: "perspicacia", minLevel: 1 }, nextSceneId: "n5_2", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch5_mob_pattern" }] },
        { id: "n5_1_risky_feed", type: "dialogue", text: "Alimentación de riesgo en callejón.", requirement: { type: "none" }, nextSceneId: "n5_2", effects: [{ type: "humanityDelta", delta: -1 }, { type: "hungerDelta", delta: -1 }, { type: "setFlag", flag: "novel_ch5_risky_feed" }] },
      ],
    },
    {
      id: "n5_2",
      chapterId: "chapter05",
      title: "5.2 · El contacto anarquista",
      text: `Gato te mide con desprecio útil. Dice que el Príncipe te convirtió en chivo expiatorio y que los carniceros del Sabat ya operan con demasiada visibilidad.`,
      options: [
        { id: "n5_2_listen", type: "dialogue", text: "Escuchar su advertencia.", requirement: { type: "none" }, nextSceneId: "n5_3", effects: [{ type: "setFlag", flag: "novel_ch5_met_gato" }] },
        { id: "n5_2_dominate", type: "discipline", discipline: "dominate", disciplineTitle: "Dame nombres", text: "Forzarlo a ser específico.", requirement: { type: "discipline", discipline: "dominate", minLevel: 1 }, nextSceneId: "n5_3", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch5_dominate_names" }] },
        { id: "n5_2_etiquette", type: "skill", skill: "etiqueta", text: "Diplomacia de trinchera.", requirement: { type: "skill", skill: "etiqueta", minLevel: 1 }, nextSceneId: "n5_3", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch5_trench_diplomacy" }] },
        { id: "n5_2_auspex", type: "discipline", discipline: "auspex", disciplineTitle: "Rastrear las alturas", text: "Enfocar la azotea de la Telefónica.", requirement: { type: "discipline", discipline: "auspex", minLevel: 1 }, nextSceneId: "n5_3", effects: [{ type: "setFlag", flag: "novel_ch5_sabbat_roof" }] },
      ],
    },
    {
      id: "n5_3",
      chapterId: "chapter05",
      title: "5.3 · La decisión en el humo",
      text: `Una estudiante cae asfixiada. Un sabático pálido y deforme se prepara para despedazarla frente a teléfonos encendidos.`,
      options: [
        { id: "n5_3_save", type: "dialogue", text: "Intervenir y salvarla.", requirement: { type: "none" }, nextSceneId: "n5_end", effects: [{ type: "humanityDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch5_saved_student" }] },
        { id: "n5_3_pragmatic", type: "dialogue", text: "No intervenir.", requirement: { type: "none" }, nextSceneId: "n5_end", effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "novel_ch5_let_burn" }] },
        { id: "n5_3_presence2", type: "discipline", discipline: "presence", disciplineTitle: "Aterrorizar al agresor", text: "Forzarlo a huir.", requirement: { type: "discipline", discipline: "presence", minLevel: 2 }, nextSceneId: "n5_end", effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch5_presence_fear" }] },
        { id: "n5_3_stealth", type: "skill", skill: "sigilo", text: "Extracción silenciosa de la joven.", requirement: { type: "skill", skill: "sigilo", minLevel: 1 }, nextSceneId: "n5_end", effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch5_stealth_extract" }] },
      ],
    },
    {
      id: "n5_end",
      chapterId: "chapter05",
      title: "5.E · Neón y ceniza",
      text: `Sales de la zona cero con la certeza de que en Santiago ser Ventrue es una guerra de guerrillas por sostener un orden que tú mismo empiezas a cuestionar.`,
      options: [{ id: "n5_end_continue", type: "dialogue", text: "Continuar al Capítulo 6", requirement: { type: "none" }, nextSceneId: "n5_end", effects: [{ type: "setFlag", flag: "chapter_pending_chapter06" }] }],
    },
  ],
};
