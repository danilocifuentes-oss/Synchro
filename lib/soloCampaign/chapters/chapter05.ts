import type { SoloChapter, SoloRequirement } from "@/lib/soloCampaign/types";

/** Raíz o infección telúrica ya presente en la crónica (sustituye «root_infection_level» del guion). */
const ROOT_TAINT_REQ: SoloRequirement = {
  type: "any",
  requirements: [
    { type: "flag", flag: "root_merge", equals: true },
    { type: "flag", flag: "root_thrumming", equals: true },
    { type: "flag", flag: "root_awakening", equals: true },
  ],
};

/** Capítulo 5: marca bajo la piel, pacto con Valeria, sueño de ceniza, Corte. */
export const chapter05: SoloChapter = {
  id: "chapter05",
  title: "Capítulo 5: Noche sin Fin",
  description: "La marca bajo la piel. El pacto de la carne. La tierra reclama su semilla.",
  startSceneId: "c5_001",
  scenes: [
    {
      id: "c5_001",
      chapterId: "chapter05",
      title: "La Marca Bajo la Piel",
      text:
        "El viaje de regreso al viñedo transcurre en un silencio plomizo. Al llegar, Valeria apaga el motor y te observa en la penumbra de la cabina. Sientes la raíz bajo tu esternón: delgada, vibrante, reclamando territorio.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "marked_by_earth", equals: true },
          text: "La voz de la Araucanía aún resuena en tu cráneo.",
        },
        {
          requirement: ROOT_TAINT_REQ,
          text: "La raíz late con un ritmo terroso que no debería existir en un muerto.",
        },
      ],
      options: [
        {
          id: "c5001_a",
          type: "dialogue",
          text: "Contarle a Valeria cada detalle de la visión sin omitir nada",
          requirement: { type: "none" },
          nextSceneId: "c5_002",
          effects: [
            { type: "setFlag", flag: "valeria_affection" },
            { type: "fragmentationDelta", delta: 1 },
            { type: "setFlag", flag: "root_thrumming" },
          ],
        },
        {
          id: "c5001_b",
          type: "discipline",
          discipline: "auspex",
          text: "Intentar suprimir la raíz con fuerza de voluntad y Auspex",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 3 },
          nextSceneId: "c5_002",
          effects: [{ type: "humanityDelta", delta: 1 }],
        },
        {
          id: "c5001_c",
          type: "clan",
          clan: "malkavian",
          text: "Dejar que las voces se mezclen y compartir la locura",
          requirement: { type: "clan", clan: "malkavian" },
          nextSceneId: "c5_002",
          effects: [
            { type: "fragmentationDelta", delta: 3 },
            { type: "setFlag", flag: "root_merge" },
          ],
        },
      ],
    },
    {
      id: "c5_002",
      chapterId: "chapter05",
      title: "El Pacto de la Carne",
      text:
        "Valeria desabrocha tu camisa con urgencia desesperada y coloca su palma gélida sobre la raíz. «Late», murmura con espanto. La distancia entre los dos se evapora. La habitación se llena de penumbras y deseo animal.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "valeria_affection", equals: true },
          text: "El acto es más que placer: es supervivencia, es alianza, es rendición.",
        },
        {
          requirement: { type: "humanityMin", min: 5 },
          text: "Aún conservas suficiente humanidad para sentir culpa y éxtasis al mismo tiempo.",
        },
      ],
      options: [
        {
          id: "c5002_a",
          type: "dialogue",
          text: "Entregarte completamente al intercambio de Vitae y carne",
          requirement: { type: "none" },
          nextSceneId: "c5_003",
          effects: [
            { type: "setFlag", flag: "valeria_affection" },
            { type: "fragmentationDelta", delta: 2 },
            { type: "setFlag", flag: "root_merge" },
            { type: "humanityDelta", delta: -2 },
          ],
        },
        {
          id: "c5002_b",
          type: "dialogue",
          text: "Mantener el control y transformar el acto en algo más tierno",
          requirement: { type: "humanityMin", min: 7 },
          nextSceneId: "c5_003",
          effects: [
            { type: "setFlag", flag: "valeria_affection" },
            { type: "humanityDelta", delta: 1 },
          ],
        },
        {
          id: "c5002_c",
          type: "discipline",
          discipline: "dominate",
          text: "Tomar el control absoluto del encuentro",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 3 },
          nextSceneId: "c5_003",
          effects: [{ type: "setFlag", flag: "valeria_distrust" }],
        },
      ],
    },
    {
      id: "c5_003",
      chapterId: "chapter05",
      title: "El Sueño de la Ceniza",
      text:
        "Antes del alba, el sueño te arrastra. Caminas por un bosque infinito donde raíces se entrelazan como venas sobre tu cabeza. La voz regresa, multiplicada por mil gargantas: «Entrégate. Serás el primero de los nuevos hijos». La raíz en tu pecho se ramifica con un dolor que roza el éxtasis.",
      contextLeadInByState: [
        {
          requirement: ROOT_TAINT_REQ,
          text: "Despiertas con la piel del pecho oscurecida por capilares negros que desaparecen lentamente.",
        },
      ],
      options: [
        {
          id: "c5003_a",
          type: "dialogue",
          text: "Contarle el sueño a Valeria y aceptar su temor",
          requirement: { type: "none" },
          nextSceneId: "c5_004",
          effects: [{ type: "setFlag", flag: "valeria_affection" }, { type: "setFlag", flag: "dream_shared" }],
        },
        {
          id: "c5003_b",
          type: "dialogue",
          text: "Ocultar parte del sueño para protegerla",
          requirement: { type: "none" },
          nextSceneId: "c5_004",
          effects: [{ type: "setFlag", flag: "valeria_distrust" }],
        },
      ],
    },
    {
      id: "c5_004",
      chapterId: "chapter05",
      title: "La Reunión Urgente",
      text:
        "Valeria te advierte: el Príncipe ha convocado a la Corte. Otro Cainita ha desaparecido dejando solo ceniza y vides negras. Voss sospecha de ustedes.",
      options: [
        {
          id: "c5004_a",
          type: "dialogue",
          text: "Prepararte para fingir lealtad al Príncipe",
          requirement: { type: "none" },
          nextSceneId: "c5_005",
          effects: [
            { type: "setFlag", flag: "chapter_pending_chapter06" },
            { type: "setFlag", flag: "prince_cautious" },
          ],
        },
        {
          id: "c5004_b",
          type: "dialogue",
          text: "Decidir abiertamente abrazar lo que la tierra ofrece",
          requirement: ROOT_TAINT_REQ,
          nextSceneId: "c5_005",
          effects: [
            { type: "fragmentationDelta", delta: 1 },
            { type: "setFlag", flag: "embrace_earth" },
            { type: "setFlag", flag: "chapter_pending_chapter06" },
          ],
        },
      ],
    },
    {
      id: "c5_005",
      chapterId: "chapter05",
      title: "Fin del Capítulo 5",
      text: "La noche termina con la raíz latiendo en tu pecho y la certeza de que la última Corte se acerca. La ceniza ya comienza a florecer.",
      options: [],
    },
  ],
};
