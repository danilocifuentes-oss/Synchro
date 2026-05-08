import type { SoloChapter, SoloRequirement } from "@/lib/soloCampaign/types";

/** Infección telúrica ya anclada en la crónica. */
const ROOT_TAINT_REQ: SoloRequirement = {
  type: "any",
  requirements: [
    { type: "flag", flag: "root_merge", equals: true },
    { type: "flag", flag: "root_thrumming", equals: true },
    { type: "flag", flag: "root_awakening", equals: true },
  ],
};

/** Capítulo 6: última Corte, acusación, cosecha. */
export const chapter06: SoloChapter = {
  id: "chapter06",
  title: "Capítulo 6: Ceniza que Florece",
  description: "La última Corte. La tierra reclama su cosecha.",
  startSceneId: "c6_001",
  scenes: [
    {
      id: "c6_001",
      chapterId: "chapter06",
      title: "La Última Corte",
      text:
        "La noche de la reunión llega envuelta en electricidad estática y presagios. Valeria conduce con determinación gélida. El salón de la mansión colonial está más oscuro que nunca. El Príncipe, rígido de terror, los espera. Voss y los demás Primogénitos los miran como verdugos.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "voss_hostile", equals: true },
          text: "Voss ya tiene el cuchillo de plata desenvainado.",
        },
        {
          requirement: ROOT_TAINT_REQ,
          text: "La raíz en tu pecho late con fuerza, casi audible.",
        },
        {
          requirement: { type: "flag", flag: "embrace_earth", equals: true },
          text: "Sientes que la tierra misma espera tu señal.",
        },
      ],
      options: [
        {
          id: "c6001_a",
          type: "dialogue",
          text: "Mantener silencio y observar cómo se desarrolla la acusación",
          requirement: { type: "none" },
          nextSceneId: "c6_002",
          effects: [{ type: "setFlag", flag: "court_tension_high" }],
        },
        {
          id: "c6001_b",
          type: "discipline",
          discipline: "presence",
          text: "Usar Presencia para calmar la sala y ganar tiempo",
          requirement: { type: "discipline", discipline: "presence", minLevel: 3 },
          nextSceneId: "c6_002",
          effects: [{ type: "experienceDelta", delta: 30 }],
        },
      ],
    },
    {
      id: "c6_002",
      chapterId: "chapter06",
      title: "La Acusación",
      text:
        "El Príncipe señala los restos de Ramiro el Nosferatu: ropas llenas de raíces blancas palpitantes. «Desde tu llegada, la ciudad devora a los míos. ¿Qué trajiste en tu sangre?» El Malkavian ríe: «Las raíces ya están en sus pechos…»",
      options: [
        {
          id: "c6002_a",
          type: "dialogue",
          text: "Defenderte y culpar a la tierra misma",
          requirement: { type: "none" },
          nextSceneId: "c6_003",
          effects: [{ type: "setFlag", flag: "valeria_affection" }],
        },
        {
          id: "c6002_b",
          type: "dialogue",
          text: "Culpar a Valeria y ofrecerte como leal al Príncipe",
          requirement: { type: "flag", flag: "prince_cautious", equals: true },
          nextSceneId: "c6_003_betray",
          effects: [
            { type: "setFlag", flag: "valeria_distrust" },
            { type: "reputationDelta", delta: 3 },
            { type: "setFlag", flag: "prince_reputation" },
          ],
        },
        {
          id: "c6002_c",
          type: "discipline",
          discipline: "dominate",
          text: "Intentar Dominar al Príncipe para que los deje marchar",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 4 },
          nextSceneId: "c6_003",
          nextSceneIdOnFail: "c6_002_fail",
          effects: [{ type: "setFlag", flag: "court_hostile" }],
        },
      ],
    },
    {
      id: "c6_002_fail",
      chapterId: "chapter06",
      title: "Fracaso del Dominio",
      text: "El Príncipe resiste y ordena el ataque. Voss se lanza hacia ti.",
      options: [
        {
          id: "c6002f_a",
          type: "dialogue",
          text: "Luchar",
          requirement: { type: "none" },
          nextSceneId: "c6_004",
        },
      ],
    },
    {
      id: "c6_003",
      chapterId: "chapter06",
      title: "La Revelación de la Tierra",
      text:
        "Valeria se pone a tu lado. La raíz en tu pecho despierta por completo. Tu voz se convierte en el coro ancestral: «La época de los parásitos ha terminado». El Príncipe dispara. En vez de sangre, brota savia oscura.",
      options: [
        {
          id: "c6003_a",
          type: "dialogue",
          text: "Dejar que la raíz tome el control y desate la cosecha",
          requirement: ROOT_TAINT_REQ,
          nextSceneId: "c6_004",
          effects: [
            { type: "fragmentationDelta", delta: 3 },
            { type: "setFlag", flag: "root_merge" },
          ],
        },
        {
          id: "c6003_b",
          type: "dialogue",
          text: "Luchar junto a Valeria contra la Corte",
          requirement: { type: "flag", flag: "valeria_ally", equals: true },
          nextSceneId: "c6_004",
          effects: [{ type: "setFlag", flag: "valeria_affection" }],
        },
        {
          id: "c6003_c",
          type: "dialogue",
          text: "Arrojarte al conflicto sin apoyarte del todo en la raíz ni en la alianza",
          requirement: { type: "none" },
          nextSceneId: "c6_004",
        },
      ],
    },
    {
      id: "c6_003_betray",
      chapterId: "chapter06",
      title: "Traición",
      text: "Valeria te mira con horror cuando la entregas. La Corte se vuelve contra ella.",
      options: [
        {
          id: "c6003b_a",
          type: "dialogue",
          text: "Aprovechar el caos para huir",
          requirement: { type: "none" },
          nextSceneId: "c6_005",
          effects: [
            { type: "setFlag", flag: "betrayed_valeria" },
            { type: "setFlag", flag: "chapter_pending_chapter07" },
          ],
        },
      ],
    },
    {
      id: "c6_004",
      chapterId: "chapter06",
      title: "La Cosecha de la Corte",
      text:
        "El salón se transforma en un vórtice orgánico. Tus dedos se endurecen como ramas de hualle. Voss cae. El Malkavian ofrece su cráneo. Las raíces brotan del suelo y reclaman al Príncipe.",
      options: [
        {
          id: "c6004_a",
          type: "dialogue",
          text: "Abrazar completamente a la tierra junto a Valeria",
          requirement: { type: "flag", flag: "valeria_ally", equals: true },
          nextSceneId: "c6_005",
          effects: [
            { type: "setFlag", flag: "ending_flourish" },
            { type: "setFlag", flag: "chapter_pending_chapter07" },
          ],
        },
        {
          id: "c6004_b",
          type: "dialogue",
          text: "Intentar contener la raíz y salvar lo que queda de la Corte",
          requirement: { type: "humanityMin", min: 5 },
          nextSceneId: "c6_005",
          effects: [
            { type: "humanityDelta", delta: 2 },
            { type: "setFlag", flag: "ending_resist" },
            { type: "setFlag", flag: "chapter_pending_chapter07" },
          ],
        },
        {
          id: "c6004_c",
          type: "dialogue",
          text: "Dejarte arrastrar por la cosecha sin elegir un nombre para lo que viene",
          requirement: { type: "none" },
          nextSceneId: "c6_005",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
      ],
    },
    {
      id: "c6_005",
      chapterId: "chapter06",
      title: "Fin del Capítulo 6",
      text: "La mansión es devorada por la vegetación. La lluvia cesa. La Araucanía ha hablado. La cosecha ha comenzado.",
      options: [],
    },
  ],
};
