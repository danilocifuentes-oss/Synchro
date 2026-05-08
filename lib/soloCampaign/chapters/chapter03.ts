import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Capítulo 3: sur, horror telúrico (Valeria). */
export const chapter03: SoloChapter = {
  id: "chapter03",
  title: "Capítulo 3: Carreteras de Ceniza",
  description:
    "Valeria te lleva al sur. La tierra muestra su verdadero rostro por primera vez.",
  startSceneId: "c3_001",
  scenes: [
    {
      id: "c3_001",
      chapterId: "chapter03",
      title: "El Camino del Sur",
      text:
        "Despiertas con el cuerpo de Valeria aún enredado al tuyo. La lluvia es solo una llovizna conspiradora. «Esta noche iremos al sur», susurra ella. «Nada de Príncipe ni Voss». Te lanza las llaves de su camioneta.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "valeria_ally", equals: true },
          text: "Su confianza en ti es palpable.",
        },
        {
          requirement: { type: "flag", flag: "root_awakening", equals: true },
          text: "La pequeña raíz bajo tu esternón late suavemente, como si supiera hacia dónde os dirigís.",
        },
      ],
      options: [
        {
          id: "c3001_a",
          type: "dialogue",
          text: "Conducir en silencio y observar el paisaje",
          requirement: { type: "none" },
          nextSceneId: "c3_002",
          effects: [{ type: "hungerDelta", delta: 1 }],
        },
        {
          id: "c3001_b",
          type: "discipline",
          discipline: "auspex",
          text: "Usar Auspex para percibir presencias en el bosque mientras conduces",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 2 },
          nextSceneId: "c3_002",
          effects: [
            { type: "experienceDelta", delta: 20 },
            { type: "setFlag", flag: "forest_awareness" },
          ],
        },
        {
          id: "c3001_c",
          type: "clan",
          clan: "gangrel",
          text: "Dejar que tus instintos salvajes guíen el vehículo por caminos secundarios",
          requirement: { type: "clan", clan: "gangrel" },
          nextSceneId: "c3_002",
          effects: [
            { type: "fragmentationDelta", delta: 1 },
            { type: "setFlag", flag: "root_thrumming" },
          ],
        },
      ],
    },
    {
      id: "c3_002",
      chapterId: "chapter03",
      title: "El Árbol que Come",
      text:
        "Pasado el kilómetro 38, el pavimento queda atrás. Los faros iluminan una casona en ruinas estrangulada por vides salvajes. En un claro, las raíces son más gruesas que troncos. Allí yace el horror: un torso Cainita medio hundido, la mitad inferior reemplazada por nudos negros palpitantes.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "forest_awareness", equals: true },
          text: "Sentiste esta aberración antes de verla.",
        },
        {
          requirement: { type: "flag", flag: "root_awakening", equals: true },
          text: "La raíz en tu pecho responde con un latido ansioso.",
        },
      ],
      options: [
        {
          id: "c3002_a",
          type: "dialogue",
          text: "Observar en silencio y dejar que Valeria hable",
          requirement: { type: "none" },
          nextSceneId: "c3_003",
          effects: [{ type: "setFlag", flag: "valeria_affection" }],
        },
        {
          id: "c3002_b",
          type: "discipline",
          discipline: "auspex",
          text: "Usar Auspex para intentar leer los últimos momentos de la víctima",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 3 },
          nextSceneId: "c3_003",
          effects: [
            { type: "experienceDelta", delta: 30 },
            { type: "setFlag", flag: "root_vision" },
          ],
        },
        {
          id: "c3002_c",
          type: "skill",
          skill: "oficios",
          text: "Intentar quemar el cuerpo con fuego (riesgo)",
          requirement: { type: "skill", skill: "oficios", minLevel: 2 },
          nextSceneId: "c3_003",
          nextSceneIdOnFail: "c3_002_fail",
          effects: [{ type: "humanityDelta", delta: -1 }],
        },
        {
          id: "c3002_d",
          type: "clan",
          clan: "tremere",
          text: "Realizar un ritual rápido para analizar la anomalía",
          requirement: { type: "clan", clan: "tremere" },
          nextSceneId: "c3_003",
          effects: [
            { type: "fragmentationDelta", delta: 1 },
            { type: "setFlag", flag: "root_thrumming" },
          ],
        },
      ],
    },
    {
      id: "c3_002_fail",
      chapterId: "chapter03",
      title: "El Fuego que No Quema",
      text:
        "Las llamas se apagan casi al instante. Las raíces se retuercen, como si se alimentaran del fuego mismo.",
      options: [
        {
          id: "c3002f_a",
          type: "dialogue",
          text: "Retroceder aterrado",
          requirement: { type: "none" },
          nextSceneId: "c3_003",
          effects: [{ type: "humanityDelta", delta: -2 }],
        },
      ],
    },
    {
      id: "c3_003",
      chapterId: "chapter03",
      title: "La Raíz se Mueve",
      text:
        "Una raíz gruesa se mueve con un crujido húmedo, acercándose a ustedes. La Bestia dentro de ti no ruge de hambre, sino de puro terror primordial.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "root_vision", equals: true },
          text: "Viste cómo esta misma fuerza consumió al Cainita.",
        },
      ],
      options: [
        {
          id: "c3003_a",
          type: "dialogue",
          text: "Retroceder con Valeria y regresar al viñedo",
          requirement: { type: "none" },
          nextSceneId: "c3_004",
          effects: [
            { type: "setFlag", flag: "horror_witnessed" },
            { type: "setFlag", flag: "chapter_pending_chapter04" },
          ],
        },
        {
          id: "c3003_b",
          type: "discipline",
          discipline: "animalism",
          text: "Intentar calmar o comunicarte con la entidad vegetal",
          requirement: { type: "discipline", discipline: "animalism", minLevel: 3 },
          nextSceneId: "c3_003_animalism",
          effects: [
            { type: "fragmentationDelta", delta: 2 },
            { type: "setFlag", flag: "root_merge" },
          ],
        },
        {
          id: "c3003_c",
          type: "clan",
          clan: "gangrel",
          text: "Ofrecer tu propia sangre a la raíz como prueba",
          requirement: { type: "clan", clan: "gangrel" },
          nextSceneId: "c3_003_gangrel",
          effects: [
            { type: "fragmentationDelta", delta: 2 },
            { type: "humanityDelta", delta: -2 },
            { type: "setFlag", flag: "root_merge" },
          ],
        },
      ],
    },
    {
      id: "c3_003_animalism",
      chapterId: "chapter03",
      title: "Susurro Vegetal",
      text:
        "Por un instante sientes una respuesta: hambre antigua, ira telúrica y la certeza de que los Cainitas son intrusos.",
      options: [
        {
          id: "c3003a_a",
          type: "dialogue",
          text: "Compartir la visión con Valeria",
          requirement: { type: "none" },
          nextSceneId: "c3_004",
          effects: [
            { type: "setFlag", flag: "horror_witnessed" },
            { type: "setFlag", flag: "chapter_pending_chapter04" },
            { type: "setFlag", flag: "valeria_affection" },
          ],
        },
      ],
    },
    {
      id: "c3_003_gangrel",
      chapterId: "chapter03",
      title: "Ofrenda de Sangre",
      text:
        "La raíz bebe de ti. Sientes cómo tu Vitae alimenta algo mucho más antiguo.",
      options: [
        {
          id: "c3003g_a",
          type: "dialogue",
          text: "Regresar con Valeria",
          requirement: { type: "none" },
          nextSceneId: "c3_004",
          effects: [
            { type: "setFlag", flag: "earth_affinity" },
            { type: "setFlag", flag: "horror_witnessed" },
            { type: "setFlag", flag: "chapter_pending_chapter04" },
          ],
        },
      ],
    },
    {
      id: "c3_004",
      chapterId: "chapter03",
      title: "Fin del Capítulo 3",
      text:
        "El viaje de regreso transcurre en un silencio pesado. La tierra ya los ha probado. Y ha encontrado su sabor.",
      options: [],
    },
  ],
};
