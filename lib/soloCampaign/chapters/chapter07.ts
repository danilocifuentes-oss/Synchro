import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter07: SoloChapter = {
  id: "chapter07",
  title: "Santiago en Cenizas · Capítulo 7 · El Vínculo que Quema",
  description:
    "Después del colapso del Ancla (cap. 6 bis): Santiago en llamas / ascenso del tirano. Carriles clásicos: plaza, descenso al osario y pacto con el secreto bajo el altar.",
  startSceneId: "n7_0",
  scenes: [
    {
      id: "n7_0",
      chapterId: "chapter07",
      title: "7.0 · La plaza de las sombras",
      text: `Plaza de Armas, 03:30. La Catedral se alza como una muralla de piedra fría.

La Llave de Bronce vibra en tu mano al ritmo de un latido que emana del subsuelo. Gato te observa desde los portales: "Si entras ahí, asegúrate de salir siendo tú mismo".`,
      contextLeadInByState: [
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true },
              { type: "flag", flag: "chapter07_route_santiago_en_llamas", equals: true },
            ],
          },
          text: `Ya dejaste atrás el subsuelo de la Catedral: el altar se hundió tras tu paso y la plaza huele a pólvora humeda. El acto final pide banderas donde aún respiran camaradas.

Capítulo 7 — Santiago en llamas.`,
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true },
              { type: "flag", flag: "chapter07_route_ascenso_tirano", equals: true },
            ],
          },
          text: `La piedra cayó atrás pero el vínculo aún mastica tu nombre: eres el nexo que el Príncipe quiso monopolizar. Los leales van a venir a cobrar la deuda con hierro y rito.

Capítulo 7 — El ascenso del tirano.`,
        },
      ],
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_sangre", equals: true },
          text: "Cada pensamiento de traición hacia el Príncipe se siente como una puñalada en tus sienes.",
        },
      ],
      options: [
        {
          id: "n7_0_sigilo",
          type: "skill",
          skill: "sigilo",
          text: "Evadir a los Vigilantes y entrar sin ser detectado.",
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          visibilityRequirement: { type: "not", requirement: { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true } },
          nextSceneId: "n7_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "entrada_limpia" }],
        },
        {
          id: "n7_0_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Llaves maestras",
          text: "Forzar al sacristán a abrirte el camino.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "dominate", minLevel: 1 },
              { type: "flag", flag: "mision_castigo", equals: true },
            ],
          },
          visibilityRequirement: { type: "not", requirement: { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true } },
          nextSceneId: "n7_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "llaves_maestras" }],
        },
        {
          id: "n7_0_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Venas bajo el altar",
          text: "Sentir el flujo de la hiel bajo el altar mayor.",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          visibilityRequirement: { type: "not", requirement: { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true } },
          nextSceneId: "n7_1",
          effects: [{ type: "setFlag", flag: "pacto_iglesia_revelado" }],
        },
        {
          id: "n7_0_entrada_franca",
          type: "dialogue",
          text: "Cruzar la nave como quien no tiene nada que esconder: máxima exposición, mínima sutileza.",
          requirement: { type: "none" },
          visibilityRequirement: { type: "not", requirement: { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true } },
          nextSceneId: "n7_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "catedral_entrada_franca" }],
        },
        {
          id: "n7_0_desde_llamas",
          type: "dialogue",
          text: "Saltar la catedral repetida y empujar el frente: fuego en la ciudad, cuchillas largas y alianzas de supervivientes.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true },
              { type: "flag", flag: "chapter07_route_santiago_en_llamas", equals: true },
            ],
          },
          nextSceneId: "n7_end",
          effects: [
            { type: "setFlag", flag: "chapter08_route_cuchillos_largos" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
        {
          id: "n7_0_desde_tirano",
          type: "dialogue",
          text: "Replegar fuerzas y plantar posición antes de que el Príncipe y la Corte te arranquen el nexo: pactos o traición cerrada.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true },
              { type: "flag", flag: "chapter07_route_ascenso_tirano", equals: true },
            ],
          },
          nextSceneId: "n7_end",
          effects: [
            { type: "setFlag", flag: "chapter08_route_pacto_judas" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
      ],
    },
    {
      id: "n7_1",
      chapterId: "chapter07",
      title: "7.1 · El descenso al osario",
      text: `Cripta de los Obispos. Escaleras de caracol de piedra gastada. Luz de velas.

Al final del pasillo espera una puerta de hierro con sello V. Si estás vinculado, tu cuerpo tiembla: la sangre te ordena arrodillarte.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_sangre", equals: true },
          text: "El Vínculo te castiga por cada paso hacia el secreto de tu Padre.",
        },
      ],
      options: [
        {
          id: "n7_1_will",
          type: "dialogue",
          text: "Forzar el giro de la llave pese a la agonía del vínculo.",
          requirement: { type: "none" },
          nextSceneId: "n7_2",
          effects: [{ type: "willpowerDelta", delta: -2 }, { type: "setFlag", flag: "puerta_abierta" }],
        },
        {
          id: "n7_1_occult",
          type: "skill",
          skill: "ocultismo",
          text: "Usar un ritual menor para engañar la cerradura mística.",
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "ocultismo", minLevel: 1 },
              { type: "flag", flag: "lore_cuarentena", equals: true },
            ],
          },
          nextSceneId: "n7_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "acceso_legitimo" }],
        },
        {
          id: "n7_1_fortitude",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Cruzar sangrando",
          text: "Resistir el castigo del vínculo por puro aguante.",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n7_2",
          effects: [{ type: "healthDamageDelta", delta: -1 }, { type: "setFlag", flag: "puerta_forzada" }],
        },
      ],
    },
    {
      id: "n7_2",
      chapterId: "chapter07",
      title: "7.2 · El recuerdo del muchacho",
      text: `Cámara secreta con luz roja tenue. En el centro, un sarcófago de cristal.

Dentro yace el muchacho del Mapocho, aún "vivo", conectado por tubos de plata que mezclan su sangre con la hiel.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "traicion_principe_vista", equals: true },
          text: "Comprendes la verdad: este joven es el ancla del Vínculo de Sangre de toda la ciudad.",
        },
      ],
      options: [
        {
          id: "n7_2_humanity",
          type: "dialogue",
          text: "Liberarlo y terminar con su tormento.",
          requirement: { type: "none" },
          nextSceneId: "n7_end",
          effects: [{ type: "humanityDelta", delta: 1 }, { type: "setFlag", flag: "vinculo_destruido" }],
        },
        {
          id: "n7_2_ambition",
          type: "dialogue",
          text: "Reclamar para ti el control del Vínculo.",
          requirement: { type: "flag", flag: "dueno_lastarria", equals: true },
          nextSceneId: "n7_end",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "usurpador_del_vinculo" }],
        },
        {
          id: "n7_2_medicine",
          type: "skill",
          skill: "medicina",
          text: "Estudiar el sistema para revertir la infección de hiel.",
          requirement: { type: "skill", skill: "medicina", minLevel: 1 },
          nextSceneId: "n7_end",
          effects: [{ type: "setFlag", flag: "cura_encontrada" }],
        },
      ],
    },
    {
      id: "n7_end",
      chapterId: "chapter07",
      title: "7.E · El despertar del gigante",
      text: `La Catedral tiembla. Un sonido sordo recorre los cimientos.

Tus acciones en la cripta disparan una alarma mística. Sales y ves Santa Lucía iluminado por fogatas: la guerra final comenzó.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true },
          text: "Viniste del colapso bajo la nave: el pulso del Mapocho ya no pasa por el cristal de 1814, sino por la calle y el miedo común.",
        },
        {
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          text: "Las luces se apagan y un grito psíquico de agonía atraviesa Santiago.",
        },
        {
          requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true },
          text: "Sientes poder inmenso y una diana mortal dibujada en tu espalda.",
        },
      ],
      options: [
        {
          id: "n7_end_knives",
          type: "dialogue",
          text: "Enfrentar a Doña Inés en la noche de cuchillos largos.",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "vinculo_destruido", equals: true },
              { type: "flag", flag: "ancla_muerta", equals: true },
            ],
          },
          visibilityRequirement: { type: "not", requirement: { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true } },
          nextSceneId: "n7_end",
          effects: [{ type: "setFlag", flag: "chapter08_route_cuchillos_largos" }, { type: "setFlag", flag: "chapter_pending_chapter08" }],
        },
        {
          id: "n7_end_savior",
          type: "dialogue",
          text: "Llevar la muestra a El Choro o a Gato antes de la Corte.",
          requirement: { type: "flag", flag: "cura_encontrada", equals: true },
          nextSceneId: "n7_end",
          effects: [{ type: "setFlag", flag: "chapter08_route_salvador" }, { type: "setFlag", flag: "chapter_pending_chapter08" }],
        },
        {
          id: "n7_end_judas",
          type: "dialogue",
          text: "Responder al contacto de Inés para un pacto peligroso.",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "usurpador_del_vinculo", equals: true },
              { type: "flag", flag: "diablerista_ancestral", equals: true },
            ],
          },
          visibilityRequirement: { type: "not", requirement: { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true } },
          nextSceneId: "n7_end",
          effects: [{ type: "setFlag", flag: "chapter08_route_pacto_judas" }, { type: "setFlag", flag: "chapter_pending_chapter08" }],
        },
        {
          id: "n7_end_default",
          type: "dialogue",
          text: "Continuar al Capítulo 8",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                { type: "flag", flag: "vinculo_destruido", equals: true },
                { type: "flag", flag: "ancla_muerta", equals: true },
                { type: "flag", flag: "cura_encontrada", equals: true },
                { type: "flag", flag: "usurpador_del_vinculo", equals: true },
                { type: "flag", flag: "diablerista_ancestral", equals: true },
                { type: "flag", flag: "chapter06_ancla_1814_colapsada", equals: true },
              ],
            },
          },
          nextSceneId: "n7_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter08" }],
        },
      ],
    },
  ],
};
