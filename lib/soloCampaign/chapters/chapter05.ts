import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter05: SoloChapter = {
  id: "chapter05",
  title: "Santiago en Cenizas · Capítulo 5 · Entre el Neón y la Barricada (Logic V3 · Ventrue)",
  description: "Zona cero en Plaza Italia, trato con Gato y choque directo con una manada del Sabat.",
  startSceneId: "n5_0",
  scenes: [
    {
      id: "n5_0",
      chapterId: "chapter05",
      title: "5.0 · La zona cero",
      text: `Plaza Italia. Noche de disturbios masivos. Humo de barricadas y gas lacrimógeno.

El aire vibra con pánico y adrenalina. El neón de la Torre Telefónica tiñe el humo de un rojo que te resulta familiar.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "fugitivo_corte", equals: true },
          text: "Si eres fugitivo, te ocultas bajo capucha: cada bengala parece buscar tu rostro.",
        },
        {
          requirement: { type: "flag", flag: "doble_agente", equals: true },
          text: "Si eres doble agente, avanzas con seguridad diplomática mientras la traición de Inés te quema el pecho.",
        },
      ],
      options: [
        {
          id: "n5_0_callejeo",
          type: "skill",
          skill: "callejeo",
          text: "Localizar el rastro de Gato entre la multitud.",
          requirement: { type: "skill", skill: "callejeo", minLevel: 1 },
          nextSceneId: "n5_1",
          effects: [{ type: "setFlag", flag: "encuentro_gato" }],
        },
        {
          id: "n5_0_presence",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Calma impuesta",
          text: "Imponer calma en un radio pequeño para avanzar.",
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n5_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "rastro_detectado_sabat" }],
        },
        {
          id: "n5_0_feed_wound",
          type: "dialogue",
          text: "Intentar alimentarte de un herido del tumulto.",
          requirement: { type: "flag", flag: "herida_escape", equals: true },
          nextSceneId: "n5_1",
          effects: [
            { type: "healthDamageDelta", delta: 1 },
            { type: "humanityDelta", delta: -1 },
            { type: "hungerDelta", delta: -2 },
            { type: "setFlag", flag: "novel_ch5_feed_wound" },
          ],
        },
        {
          id: "n5_0_arrastrarse",
          type: "dialogue",
          text: "Avanzar a empujones entre el gas, sin ruta ni porte: sangre y barro.",
          requirement: { type: "none" },
          nextSceneId: "n5_1",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "plaza_avance_torpe" }],
        },
      ],
    },
    {
      id: "n5_1",
      chapterId: "chapter05",
      title: "5.1 · El precio de la información",
      text: `Interior de un edificio ocupado cerca de Derecho UChile.

Gato te mira con desprecio de clase. "El Príncipe quiere volver Santiago un matadero para despertar lo que hay debajo".`,
      contextVariantByState: [
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "lista_traidores", equals: true },
              { type: "flag", flag: "lore_cuarentena", equals: true },
            ],
          },
          text: "Cuando mencionas tus hallazgos de la Biblioteca, su actitud cambia: por primera vez te escucha de verdad.",
        },
      ],
      options: [
        {
          id: "n5_1_persuasion",
          type: "dialogue",
          text: "Convencerlo de que ambos tienen el mismo enemigo: Doña Inés.",
          requirement: { type: "none" },
          nextSceneId: "n5_2",
          effects: [{ type: "setFlag", flag: "alianza_anarquista" }],
        },
        {
          id: "n5_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Respuestas ahora",
          text: "Forzar a Gato a revelar el refugio del Sabat.",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n5_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "alerta_sabat" }],
        },
        {
          id: "n5_1_blackmail",
          type: "dialogue",
          text: "Mostrar pruebas de que Inés financia rebeldes.",
          requirement: { type: "flag", flag: "traicion_ines", equals: true },
          nextSceneId: "n5_2",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "escolta_anarquista" }],
        },
      ],
    },
    {
      id: "n5_2",
      chapterId: "chapter05",
      title: "5.2 · El ataque de la manada",
      text: `Calle Bellavista. El ruido de la plaza queda atrás y el silencio se vuelve mortal.

Tres figuras pálidas del Sabat caen desde balcones. Si dejaste rastro, ya te tenían rodeado.`,
      options: [
        {
          id: "n5_2_potence",
          type: "discipline",
          discipline: "potence",
          disciplineTitle: "Quebrar al alfa",
          text: "Enfrentar al líder de la manada mientras te rodean.",
          requirement: { type: "discipline", discipline: "potence", minLevel: 1 },
          nextSceneId: "n5_end",
          effects: [
            { type: "healthDamageDelta", delta: -2 },
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "chapter05_needs_blood" },
          ],
        },
        {
          id: "n5_2_majestad",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Majestad",
          text: "Emitir una ola de terror para hacer retroceder a la manada.",
          requirement: { type: "discipline", discipline: "presence", minLevel: 2 },
          nextSceneId: "n5_end",
          effects: [{ type: "hungerDelta", delta: 2 }, { type: "willpowerDelta", delta: -1 }],
        },
        {
          id: "n5_2_escape_cover",
          type: "skill",
          skill: "sigilo",
          text: "Dejar que la escolta de Gato cubra tu retirada.",
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "sigilo", minLevel: 1 },
              { type: "flag", flag: "escolta_anarquista", equals: true },
            ],
          },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "deuda_con_gato" }],
        },
        {
          id: "n5_2_arrancar",
          type: "dialogue",
          text: "Arrancar del cerco a puro instinto, aunque te desgarren.",
          requirement: { type: "none" },
          nextSceneId: "n5_end",
          effects: [
            { type: "healthDamageDelta", delta: -2 },
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "chapter05_needs_blood" },
          ],
        },
      ],
    },
    {
      id: "n5_end",
      chapterId: "chapter05",
      title: "5.E · La ciudad que nunca duerme",
      text: `Cerro Santa Lucía. Desde el mirador, Santiago parece un organismo enfermo.

La hiel, la traición de la Biblioteca y la furia de la plaza encajan en un mismo patrón. Una mujer de lavanda te observa entre los árboles.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "fugitivo_corte", equals: true },
          text: "Si eres fugitivo, sabes que no hay retorno posible.",
        },
        {
          requirement: { type: "flag", flag: "doble_agente", equals: true },
          text: "Si eres doble agente, tu informe al Príncipe será una obra maestra de mentiras.",
        },
      ],
      options: [
        {
          id: "n5_end_vina",
          type: "dialogue",
          text: "Aceptar la citación a reunión secreta en una viña.",
          requirement: { type: "flag", flag: "alianza_anarquista", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter06_route_vina_silencio" }, { type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
        {
          id: "n5_end_blood",
          type: "dialogue",
          text: "Buscar sangre pura de inmediato (ruta de sangre).",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "herida_escape", equals: true },
              { type: "flag", flag: "chapter05_needs_blood", equals: true },
            ],
          },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter06_route_sangre" }, { type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
        {
          id: "n5_end_thief",
          type: "dialogue",
          text: "Prepararte para robar en la mansión del Príncipe (ruta del ladrón).",
          requirement: { type: "flag", flag: "deuda_con_gato", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter06_route_ladron" }, { type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
        {
          id: "n5_end_default",
          type: "dialogue",
          text: "Continuar al Capítulo 6",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                { type: "flag", flag: "alianza_anarquista", equals: true },
                { type: "flag", flag: "herida_escape", equals: true },
                { type: "flag", flag: "chapter05_needs_blood", equals: true },
                { type: "flag", flag: "deuda_con_gato", equals: true },
              ],
            },
          },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
      ],
    },
  ],
};
