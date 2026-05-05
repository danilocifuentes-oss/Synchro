import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Capítulo 1 — «El Beso del Mapocho». Narrativa y tono centrados en la experiencia Ventrue (salón, tablero, máscara); segunda persona. */
export const chapter01: SoloChapter = {
  id: "chapter01",
  title: "Santiago en Cenizas · Capítulo 1 · El Beso del Mapocho (linaje del Trono)",
  description:
    "Primera noche: Teatinos, Bandera y el Mapocho. Sangre fría, orden sobre el caos y el tributo elegido bajo el puente.",
  startSceneId: "n1_1",
  scenes: [
    {
      id: "n1_1",
      chapterId: "chapter01",
      title: "1.1 · Teatinos · La dignidad entre el polvo",
      text: `Despiertas en la oscuridad de una imprenta abandonada en Teatinos. No recuerdas haberte acostado, pero el sabor metálico del frasco que recibiste en la calle Bandera todavía te escuece la garganta.

El refugio es un sótano húmedo que huele a tinta seca y a negligencia. Tus articulaciones no crujen, pero la ausencia de pulso al incorporarte es un vacío que te resulta inaceptable. Sientes que tu voluntad ya no te pertenece del todo, pero tu sangre —aunque fría— exige que impongas orden sobre este caos.`,
      options: [
        {
          id: "n1_1_surface",
          type: "dialogue",
          text: "«Esto es inaceptable»: ponerme en pie y sacudirme el polvo de la imprenta. Recuperar la compostura antes de que alguien me vea en este estado.",
          requirement: { type: "none" },
          nextSceneId: "n1_2",
          effects: [{ type: "setFlag", flag: "novel_ch1_teatinos_surface" }],
        },
        {
          id: "n1_1_recall",
          type: "dialogue",
          text: "Ejercer auto‑dominio: quedarme un minuto en la oscuridad analizando el sabor metálico. No actuar sin procesar la información.",
          requirement: { type: "none" },
          nextSceneId: "n1_2",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch1_teatinos_recall" },
          ],
        },
        {
          id: "n1_1_etiquette",
          type: "skill",
          skill: "etiqueta",
          text: "Recordar mi estatus: analizar si el anciano de Bandera me trató con el respeto debido a mi linaje.",
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          nextSceneId: "n1_2",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch1_bandera_etiquette" }],
        },
        {
          id: "n1_1_dominate_silence",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Orden al silencio",
          text: "Intentar que la ciudad arriba deje de distraerme: imponer quietud interior con la disciplina del linaje.",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n1_2",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch1_teatinos_dominate_focus" },
          ],
        },
      ],
    },
    {
      id: "n1_2",
      chapterId: "chapter01",
      title: "1.2 · Parque Forestal · Selección del tributo",
      text: `Santiago te recibe con smog y tráfico congestionado. Al llegar a las barandas del Parque Forestal, tus sentidos filtran el mundo de una forma nueva: ya no ves ciudadanos, ves recipientes de recursos.

El hambre es una marea negra, pero tu sangre es selectiva; no cualquier vida es digna de ser reclamada. Te duelen las encías; la mandíbula protesta. Si no canalizas esto, la Bestia hablará antes que tú.`,
      options: [
        {
          id: "n1_2_careful",
          type: "dialogue",
          text: "Análisis de mercado: elegir un objetivo con cuidado, midiendo su valor como si la ciudad fuera un tablero.",
          requirement: { type: "none" },
          nextSceneId: "n1_3",
          effects: [
            { type: "hungerDelta", delta: -1 },
            { type: "setFlag", flag: "novel_ch1_mapocho_careful" },
          ],
        },
        {
          id: "n1_2_dominate_gravity",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Gravedad silenciosa",
          text: "Gravedad social: volver mi quietud una invitación para que el espécimen más adecuado se acerque.",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n1_3",
          effects: [{ type: "setFlag", flag: "novel_ch1_mapocho_dominate_lure" }],
        },
        {
          id: "n1_2_insight",
          type: "skill",
          skill: "perspicacia",
          text: "Identificar la presa: buscar en la multitud a alguien cuyo pulso sugiera una vida de orden, algo que mi paladar pueda tolerar.",
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n1_3",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "novel_ch1_mapocho_insight" }],
        },
        {
          id: "n1_2_resist",
          type: "dialogue",
          text: "Resistir el impulso vulgar: mantener la máscara de civilidad un instante más antes de ceder a la necesidad.",
          requirement: { type: "none" },
          nextSceneId: "n1_3",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch1_mapocho_mask_hold" },
          ],
        },
      ],
    },
    {
      id: "n1_3",
      chapterId: "chapter01",
      title: "1.3 · El muchacho de la baranda",
      text: `—¿Buscando algo, flaco?

Un muchacho de unos veinte años, chaqueta deportiva sucia, gorra baja. El aroma de su vida es embriagador; su aspecto es tosco. Tu Hambre lucha con tu orgullo: coquetea con la muerte sin saberlo.`,
      options: [
        {
          id: "n1_3_lure",
          type: "dialogue",
          text: "Invitarlo al cauce: palabras medidas para bajar a la oscuridad del río bajo el puente.",
          requirement: { type: "none" },
          nextSceneId: "n1_end",
          effects: [
            { type: "hungerDelta", delta: -3 },
            { type: "humanityDelta", delta: 1 },
            { type: "healthDamageDelta", delta: -5 },
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch1_lure_downstairs" },
            { type: "setFlag", flag: "novel_ch1_feed_spare" },
          ],
        },
        {
          id: "n1_3_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "«Acompáñame»",
          text: "Orden silenciosa que anula su capacidad de negarse.",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n1_end",
          effects: [
            { type: "hungerDelta", delta: -3 },
            { type: "humanityDelta", delta: 1 },
            { type: "healthDamageDelta", delta: -5 },
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch1_dominate_lure" },
            { type: "setFlag", flag: "novel_ch1_feed_spare" },
          ],
        },
        {
          id: "n1_3_persuasion",
          type: "skill",
          skill: "persuasion",
          text: "Promesa de beneficio: mentir sobre una oportunidad de trabajo o dinero que solo puedo discutir en privado.",
          requirement: { type: "skill", skill: "persuasion", minLevel: 1 },
          nextSceneId: "n1_end",
          effects: [
            { type: "hungerDelta", delta: -3 },
            { type: "humanityDelta", delta: 1 },
            { type: "healthDamageDelta", delta: -5 },
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch1_deceit_lure" },
            { type: "setFlag", flag: "novel_ch1_feed_spare" },
          ],
        },
        {
          id: "n1_3_audit",
          type: "dialogue",
          text: "Evaluar la calidad antes de actuar: asegurarme de que su sangre no esté contaminada por el veneno de la calle.",
          requirement: { type: "none" },
          nextSceneId: "n1_end",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "hungerDelta", delta: -3 },
            { type: "humanityDelta", delta: 1 },
            { type: "healthDamageDelta", delta: -5 },
            { type: "setFlag", flag: "novel_ch1_prey_audit" },
            { type: "setFlag", flag: "novel_ch1_feed_spare" },
          ],
        },
      ],
    },
    {
      id: "n1_end",
      chapterId: "chapter01",
      title: "1.E · La mirada del testigo",
      text: `Bajo el puente, el Beso es un éxtasis seco. Bebes lo justo; dejas al muchacho vivo, con el recuerdo fracturado.

Al limpiarte la boca, alzas la vista: sobre el puente, una figura te observa con quietud de estatua. No es un humano común: es alguien que acaba de verte alimentarte como un animal en el barro —y reconoce qué linaje lo permite intentar enmendarlo al día siguiente.

El Mapocho te dio sustento; aquella mirada te cobra intereses.`,
      options: [
        {
          id: "n1_end_continue",
          type: "dialogue",
          text: "Ignorar la mirada y retirarme con la dignidad intacta.",
          requirement: { type: "none" },
          nextSceneId: "n1_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter02" }],
        },
        {
          id: "n1_end_stealth",
          type: "skill",
          skill: "sigilo",
          text: "Desaparecer entre sombras antes de que el testigo pueda identificarme del todo.",
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n1_end",
          effects: [
            { type: "setFlag", flag: "chapter_pending_chapter02" },
            { type: "setFlag", flag: "novel_ch1_hide_after_feed" },
          ],
        },
      ],
    },
  ],
};
