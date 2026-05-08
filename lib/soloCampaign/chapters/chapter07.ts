import type { SoloChapter, SoloRequirement } from "@/lib/soloCampaign/types";

/** Infección telúrica acumulada en la crónica (sustituye la bandera «root_infection_level» del guion). */
const ROOT_TAINT_REQ: SoloRequirement = {
  type: "any",
  requirements: [
    { type: "flag", flag: "root_merge", equals: true },
    { type: "flag", flag: "root_thrumming", equals: true },
    { type: "flag", flag: "root_awakening", equals: true },
  ],
};

/** Humanidad media para la rama «Príncipe herido» (5–7 inclusive). */
const HUMANITY_RESIST_LOW_BRANCH: SoloRequirement = {
  type: "all",
  requirements: [
    { type: "humanityMin", min: 5 },
    { type: "not", requirement: { type: "humanityMin", min: 8 } },
  ],
};

/** Epílogo: finales según Humanidad, infección y lealtades. */
export const chapter07: SoloChapter = {
  id: "chapter07",
  title: "Epílogo: La Cosecha Eterna",
  description: "Finales ramificados según Humanidad, infección y lealtades.",
  startSceneId: "end_001",
  scenes: [
    {
      id: "end_001",
      chapterId: "chapter07",
      title: "El juicio final de la tierra",
      text: "Todo ha terminado. La Araucanía evalúa tu cosecha.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "betrayed_valeria", equals: true },
          text: "La traición aún sabe a ceniza en tu boca.",
        },
        {
          requirement: { type: "humanityMin", min: 7 },
          text: "Aún queda humanidad que se niega a ser solo composta.",
        },
      ],
      options: [
        {
          id: "end_flourish",
          type: "dialogue",
          text: "Fundirse con Valeria y la tierra",
          requirement: { type: "flag", flag: "valeria_ally", equals: true },
          nextSceneId: "ending_flourish",
          effects: [{ type: "setEnding", endingId: "ending_flourish" }],
        },
        {
          id: "end_resist_high",
          type: "dialogue",
          text: "Resistir y purgar la raíz (alta Humanidad)",
          requirement: { type: "humanityMin", min: 8 },
          nextSceneId: "ending_resist_high",
          effects: [{ type: "setEnding", endingId: "ending_resist_high" }],
        },
        {
          id: "end_resist_low",
          type: "dialogue",
          text: "Intentar resistir con Humanidad media",
          requirement: HUMANITY_RESIST_LOW_BRANCH,
          nextSceneId: "ending_resist_low",
          effects: [{ type: "setEnding", endingId: "ending_resist_low" }],
        },
        {
          id: "end_seed",
          type: "dialogue",
          text: "Convertirte en semilla errante",
          requirement: { type: "none" },
          nextSceneId: "ending_seed",
          effects: [{ type: "setEnding", endingId: "ending_seed" }],
        },
        {
          id: "end_gangrel",
          type: "dialogue",
          text: "Convertirte en hijo de la tierra (Gangrel)",
          requirement: { type: "flag", flag: "gangrel_earth_child", equals: true },
          nextSceneId: "ending_gangrel",
          effects: [{ type: "setEnding", endingId: "ending_gangrel" }],
        },
        {
          id: "end_throne",
          type: "dialogue",
          text: "Reclamar el trono de zinc",
          requirement: { type: "flag", flag: "prince_reputation", equals: true },
          nextSceneId: "ending_throne",
          effects: [{ type: "setEnding", endingId: "ending_throne" }],
        },
        {
          id: "end_abyss",
          type: "dialogue",
          text: "Abrazar el abismo vegetal",
          requirement: ROOT_TAINT_REQ,
          nextSceneId: "ending_abyss",
          effects: [{ type: "setEnding", endingId: "ending_abyss" }],
        },
      ],
    },
    {
      id: "ending_flourish",
      chapterId: "chapter07",
      title: "Imperio vegetal",
      text:
        "Tú y Valeria son los primeros de una nueva estirpe. Temuco es solo el comienzo.",
      options: [],
    },
    {
      id: "ending_resist_high",
      chapterId: "chapter07",
      title: "Redención verde",
      text:
        "Destruyes la infección principal. Conservas tu humanidad. Te conviertes en guardián secreto de Temuco contra futuros horrores telúricos. Valeria te observa desde lejos… con orgullo.",
      options: [],
    },
    {
      id: "ending_resist_low",
      chapterId: "chapter07",
      title: "Príncipe herido",
      text:
        "Salvas la Corte pero pierdes gran parte de ti. Eres la nueva Princesa o el nuevo Príncipe de una ciudad que lentamente se marchita. Sabes que solo postergaste lo inevitable.",
      options: [],
    },
    {
      id: "ending_seed",
      chapterId: "chapter07",
      title: "Heraldo de la plaga",
      text: "Llevas la semilla al norte. Donde pasas, los bosques despiertan.",
      options: [],
    },
    {
      id: "ending_gangrel",
      chapterId: "chapter07",
      title: "Hijo primigenio de la Araucanía",
      text:
        "Te conviertes en algo entre Gangrel y espíritu del bosque. Mateo te reconoce como igual. Juntos emprenden la verdadera cosecha.",
      options: [],
    },
    {
      id: "ending_throne",
      chapterId: "chapter07",
      title: "Rey de zinc y raíces",
      text:
        "Te sientas en el trono. Todos te temen. Pero por las noches las raíces susurran bajo el parqué. Sabes que solo eres un jardinero temporal.",
      options: [],
    },
    {
      id: "ending_abyss",
      chapterId: "chapter07",
      title: "Árbol de los Olvidados",
      text:
        "Ya no queda rastro de ti. Solo un árbol negro y retorcido en el corazón del bosque, con forma vagamente humana. A través de sus ramas la Araucanía canta eternamente.",
      options: [],
    },
  ],
};
