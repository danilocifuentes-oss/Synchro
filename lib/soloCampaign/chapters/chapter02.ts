import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Capítulo 2: viñedo Los Olvidados (Valeria). */
export const chapter02: SoloChapter = {
  id: "chapter02",
  title: "Capítulo 2: Los Olvidados",
  description:
    "El viñedo de Valeria te espera. Aquí las leyes del Príncipe se diluyen en el barro y la sangre.",
  startSceneId: "c2_001",
  scenes: [
    {
      id: "c2_001",
      chapterId: "chapter02",
      title: "El Camino hacia el Norte",
      text:
        "La noche siguiente, la llovizna se ha convertido en una niebla líquida que se adhiere a la piel como mortaja. Tomas un taxi hacia el kilómetro 15 de la ruta a Lautaro. Las luces de Temuco se desvanecen tras de ti. Solo quedan pinos y araucarias como soldados muertos.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "valeria_invited", equals: true },
          text: "La invitación de Valeria arde en tu bolsillo.",
        },
        {
          requirement: { type: "flag", flag: "earth_affinity", equals: true },
          text: "La tierra parece tirar de ti con más fuerza conforme te alejas de la ciudad.",
        },
      ],
      options: [
        {
          id: "c2001_a",
          type: "dialogue",
          text: "Llegar directamente al viñedo sin desviarte",
          requirement: { type: "none" },
          nextSceneId: "c2_002",
          effects: [{ type: "hungerDelta", delta: 1 }],
        },
        {
          id: "c2001_b",
          type: "skill",
          skill: "sigilo",
          text: "Pedir al taxista que te deje antes y acercarte a pie por el bosque",
          requirement: { type: "skill", skill: "sigilo", minLevel: 2 },
          nextSceneId: "c2_002",
          effects: [
            { type: "addStateTag", tag: "cautious_approach" },
            { type: "experienceDelta", delta: 15 },
          ],
        },
        {
          id: "c2001_c",
          type: "clan",
          clan: "gangrel",
          text: "Dejar que el instinto te guíe a través del bosque",
          requirement: { type: "clan", clan: "gangrel" },
          nextSceneId: "c2_002",
          effects: [{ type: "setFlag", flag: "root_awakening" }],
        },
      ],
    },
    {
      id: "c2_002",
      chapterId: "chapter02",
      title: "El Viñedo de los Olvidados",
      text:
        "El viñedo emerge de la bruma: hileras de vides retorcidas como dedos esqueléticos y una casa patronal colonial que exhala opulencia decadente. Valeria te espera bajo el alero, cabello rojo brillando como sangre fresca bajo la luz tenue.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "valeria_affection", equals: true },
          text: "Su sonrisa es más cálida, casi íntima.",
        },
        {
          requirement: { type: "flag", flag: "valeria_distrust", equals: true },
          text: "Te recibe con cortesía fría, midiendo cada uno de tus movimientos.",
        },
      ],
      options: [
        {
          id: "c2002_a",
          type: "dialogue",
          text: "Saludarla con respeto y seguirla al interior",
          requirement: { type: "none" },
          nextSceneId: "c2_003",
          effects: [{ type: "setFlag", flag: "valeria_affection" }],
        },
        {
          id: "c2002_b",
          type: "discipline",
          discipline: "presence",
          text: "Usar Presencia para crear una atmósfera seductora desde el primer momento",
          requirement: { type: "discipline", discipline: "presence", minLevel: 2 },
          nextSceneId: "c2_003",
          effects: [{ type: "setFlag", flag: "valeria_affection" }],
        },
      ],
    },
    {
      id: "c2_003",
      chapterId: "chapter02",
      title: "El Vino de la Tierra",
      text:
        "El salón principal huele a madera vieja, uva fermentada y Vitae. Valeria sirve dos copas de un líquido espeso y oscuro: Vitae macerada con esencia de hualle y uva. «Prueba la Araucanía».",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "feeding_aesthetic", equals: true },
          text: "El sabor te resulta extrañamente poético, casi familiar.",
        },
      ],
      options: [
        {
          id: "c2003_a",
          type: "dialogue",
          text: "Beber y hablar de tu pasado en el norte",
          requirement: { type: "none" },
          nextSceneId: "c2_004",
          effects: [
            { type: "hungerDelta", delta: -2 },
            { type: "setFlag", flag: "shared_past" },
          ],
        },
        {
          id: "c2003_b",
          type: "discipline",
          discipline: "blood_sorcery",
          text: "Analizar ritualmente el vino con Taumaturgia de sangre",
          requirement: { type: "discipline", discipline: "blood_sorcery", minLevel: 2 },
          nextSceneId: "c2_004",
          effects: [
            { type: "experienceDelta", delta: 25 },
            { type: "setFlag", flag: "root_hint" },
          ],
        },
        {
          id: "c2003_c",
          type: "clan",
          clan: "tremere",
          text: "Intentar desentrañar los componentes mágicos del brebaje",
          requirement: { type: "clan", clan: "tremere" },
          nextSceneId: "c2_004",
          effects: [{ type: "setFlag", flag: "root_awakening" }],
        },
      ],
    },
    {
      id: "c2_004",
      chapterId: "chapter02",
      title: "Intercambio de Sombras",
      text:
        "Valeria se acerca. El aire se carga de electricidad. Sus dedos fríos recorren tu mandíbula y te guían hacia la planta superior. La habitación es un santuario de seda negra y penumbra. El intercambio de sangre abre un puente entre vuestras mentes.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "valeria_affection", equals: true },
          text: "El deseo es mutuo y voraz.",
        },
        {
          requirement: { type: "flag", flag: "shared_past", equals: true },
          text: "Ves destellos de su huida de Santiago y su soledad.",
        },
      ],
      options: [
        {
          id: "c2004_a",
          type: "dialogue",
          text: "Entregarte al intercambio con pasión controlada",
          requirement: { type: "none" },
          nextSceneId: "c2_005",
          effects: [
            { type: "setFlag", flag: "valeria_affection" },
            { type: "setFlag", flag: "root_awakening" },
            { type: "humanityDelta", delta: -1 },
          ],
        },
        {
          id: "c2004_b",
          type: "dialogue",
          text: "Resistir el impulso y mantener distancia emocional",
          requirement: { type: "humanityMin", min: 6 },
          nextSceneId: "c2_005",
          effects: [
            { type: "setFlag", flag: "valeria_affection" },
            { type: "humanityDelta", delta: 1 },
          ],
        },
        {
          id: "c2004_c",
          type: "discipline",
          discipline: "dominate",
          text: "Intentar tomar el control del intercambio",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 3 },
          nextSceneId: "c2_005",
          effects: [{ type: "setFlag", flag: "valeria_distrust" }],
        },
      ],
    },
    {
      id: "c2_005",
      chapterId: "chapter02",
      title: "La Voz de la Tierra",
      text:
        "Tras el éxtasis, Valeria mira hacia el bosque. «Hay algo en estos bosques que no es Cainita. La tierra está despertando y ha empezado a alimentarse de nosotros». Te pide que seas su aliado.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "root_awakening", equals: true },
          text: "Sientes una pequeña raíz latiendo débilmente bajo tu esternón.",
        },
      ],
      options: [
        {
          id: "c2005_a",
          type: "dialogue",
          text: "Aceptar ser su aliado contra lo que viene",
          requirement: { type: "none" },
          nextSceneId: "c2_006",
          effects: [
            { type: "setFlag", flag: "valeria_ally" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "c2005_b",
          type: "dialogue",
          text: "Mantenerte neutral por ahora",
          requirement: { type: "none" },
          nextSceneId: "c2_006",
          effects: [
            { type: "setFlag", flag: "valeria_neutral" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
      ],
    },
    {
      id: "c2_006",
      chapterId: "chapter02",
      title: "Fin del Capítulo 2",
      text:
        "El alba se acerca tras la cortina de agua. Te has unido —o al menos acercado— a Valeria. La trampa hermosa de Temuco se cierra lentamente a tu alrededor.",
      options: [],
    },
  ],
};
