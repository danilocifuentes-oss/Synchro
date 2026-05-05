import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter08: SoloChapter = {
  id: "chapter08",
  title: "Santiago en Cenizas · Capítulo 8 · La Noche de los Cuchillos Largos (Logic V3 · Ventrue)",
  description: "Doña Inés cierra la plaza, duelo en el centro y carrera hacia el pie del Santa Lucía.",
  startSceneId: "n8_0",
  scenes: [
    {
      id: "n8_0",
      chapterId: "chapter08",
      title: "8.0 · El umbral de la traición",
      text: `Portales de Plaza de Armas. Un viento extraño arrastra cenizas desde el Santa Lucía.

Dos camionetas negras bloquean las salidas. Doña Inés baja con una espada de duelo de brillo violáceo: "El Príncipe está decepcionado".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          text: "Sientes un vacío gélido en el pecho: la voz del Príncipe desapareció de tu mente.",
        },
        {
          requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true },
          text: "Una nueva arrogancia oscura te embriaga; ahora tú cargas el eco del nexo.",
        },
      ],
      options: [
        {
          id: "n8_0_celerity_ambush",
          type: "discipline",
          discipline: "celerity",
          disciplineTitle: "Emboscada fulminante",
          text: "Usar los portales para golpear primero.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "celerity", minLevel: 1 },
              { type: "flag", flag: "entrada_limpia", equals: true },
            ],
          },
          nextSceneId: "n8_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "duelo_singular" }],
        },
        {
          id: "n8_0_blackmail",
          type: "dialogue",
          text: "Intentar frenarla con la verdad sobre su traición.",
          requirement: { type: "flag", flag: "traicion_ines", equals: true },
          nextSceneId: "n8_1",
          effects: [{ type: "setFlag", flag: "tregua_ines" }],
        },
        {
          id: "n8_0_fortitude",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Aguante de mármol",
          text: "Resistir el envite inicial de los ejecutores.",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n8_1",
          effects: [{ type: "hungerDelta", delta: 2 }, { type: "healthDamageDelta", delta: -1 }],
        },
        {
          id: "n8_0_cuerpo_a_cuerpo",
          type: "dialogue",
          text: "Meterse en el tirón sin ventaja: pagar en carne lo que no pagas en dones.",
          requirement: { type: "none" },
          nextSceneId: "n8_1",
          effects: [{ type: "healthDamageDelta", delta: -2 }, { type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "plaza_desesperacion" }],
        },
      ],
    },
    {
      id: "n8_1",
      chapterId: "chapter08",
      title: "8.1 · El duelo de los reyes caídos",
      text: `Centro de Plaza de Armas, bajo la estatua ecuestre.

Inés ataca con una gracia imposible. El mundo se reduce al acero, el ozono y la distancia mínima entre su hoja y tu corazón.`,
      contextVariantByState: [
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "vinculo_sangre", equals: true },
              { type: "not", requirement: { type: "flag", flag: "vinculo_destruido", equals: true } },
            ],
          },
          text: "Tu cuerpo responde torpe: parte de ti aún se resiste a dañar la voz del Príncipe.",
        },
      ],
      options: [
        {
          id: "n8_1_potence",
          type: "discipline",
          discipline: "potence",
          disciplineTitle: "Quebrar su guardia",
          text: "Desarmar a Inés con un golpe seco.",
          requirement: { type: "discipline", discipline: "potence", minLevel: 1 },
          nextSceneId: "n8_2",
          effects: [{ type: "healthDamageDelta", delta: -1 }, { type: "setFlag", flag: "ines_vencida" }],
        },
        {
          id: "n8_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Nuevo soberano",
          text: "Ordenarle que se detenga y se arrodille.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "dominate", minLevel: 1 },
              { type: "flag", flag: "usurpador_del_vinculo", equals: true },
            ],
          },
          nextSceneId: "n8_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "ines_esclava" }],
        },
        {
          id: "n8_1_persuasion",
          type: "skill",
          skill: "persuasion",
          text: "Convencerla de que el Príncipe también la va a sacrificar.",
          requirement: { type: "skill", skill: "persuasion", minLevel: 1 },
          nextSceneId: "n8_2",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "ines_aliada_desesperada" }],
        },
        {
          id: "n8_1_pelea_sucia",
          type: "skill",
          skill: "pelea",
          text: "Quitarte la espada a empujones y rodillazos, sin elegancia de duelo.",
          requirement: { type: "skill", skill: "pelea", minLevel: 1 },
          nextSceneId: "n8_2",
          effects: [{ type: "healthDamageDelta", delta: -2 }, { type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "ines_vencida" }],
        },
        {
          id: "n8_1_supervivencia",
          type: "dialogue",
          text: "Sobrevivir al intercambio aunque pierdas elegancia: sangre en los adoquines.",
          requirement: { type: "none" },
          nextSceneId: "n8_2",
          effects: [{ type: "healthDamageDelta", delta: -3 }, { type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "ines_vencida" }],
        },
      ],
    },
    {
      id: "n8_2",
      chapterId: "chapter08",
      title: "8.2 · El cielo de Santiago arde",
      text: `La cima del Santa Lucía estalla en fuego fatuo azul y verde. Un terremoto abre grietas en el centro.

Gato aparece en una moto ensangrentado: "Es ahora o nunca. La ciudad se está hundiendo".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "cura_encontrada", equals: true },
          text: "Sabes que debes inyectar la muestra en el nexo del cerro antes de que la infección sea irreversible.",
        },
      ],
      options: [
        {
          id: "n8_2_leadership",
          type: "dialogue",
          text: "Reclutar restos de escolta para un asalto final al cerro.",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "ines_vencida", equals: true },
              { type: "flag", flag: "tregua_ines", equals: true },
            ],
          },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "gran_alianza" }],
        },
        {
          id: "n8_2_athletics",
          type: "skill",
          skill: "atletismo",
          text: "Cruzar la Alameda por tu cuenta entre fuego y barricadas.",
          requirement: { type: "skill", skill: "atletismo", minLevel: 1 },
          nextSceneId: "n8_end",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "asalto_solitario" }],
        },
        {
          id: "n8_2_investigation",
          type: "skill",
          skill: "investigacion",
          text: "Contactar familias Ventrue para retirar apoyo al Príncipe.",
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "investigacion", minLevel: 1 },
              { type: "flag", flag: "lista_traidores", equals: true },
            ],
          },
          nextSceneId: "n8_end",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "colapso_financiero" }],
        },
      ],
    },
    {
      id: "n8_end",
      chapterId: "chapter08",
      title: "8.E · El pie del cerro",
      text: `Terraza de Neptuno. El aire es casi irrespirable y tus colmillos duelen.

Arriba, en el Castillo Hidalgo, la silueta del Príncipe ya no parece humana: reclama Santiago como pira funeraria.`,
      options: [
        {
          id: "n8_end_trono_humo",
          type: "dialogue",
          text: "Liderar asalto frontal contra las manadas del Sabat.",
          requirement: { type: "flag", flag: "gran_alianza", equals: true },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "chapter09_route_trono_humo" }, { type: "setFlag", flag: "chapter_pending_chapter09" }],
        },
        {
          id: "n8_end_asesino",
          type: "dialogue",
          text: "Infiltrarte por los pasajes secretos del cerro.",
          requirement: { type: "flag", flag: "asalto_solitario", equals: true },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "chapter09_route_asesino" }, { type: "setFlag", flag: "chapter_pending_chapter09" }],
        },
        {
          id: "n8_end_venganza_seda",
          type: "dialogue",
          text: "Usar a Inés como escudo y arma contra el Príncipe.",
          requirement: { type: "flag", flag: "ines_esclava", equals: true },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "chapter09_route_venganza_seda" }, { type: "setFlag", flag: "chapter_pending_chapter09" }],
        },
        {
          id: "n8_end_default",
          type: "dialogue",
          text: "Continuar al Capítulo 9",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                { type: "flag", flag: "gran_alianza", equals: true },
                { type: "flag", flag: "asalto_solitario", equals: true },
                { type: "flag", flag: "ines_esclava", equals: true },
              ],
            },
          },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter09" }],
        },
      ],
    },
  ],
};
