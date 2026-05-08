import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Prólogo: llegada a Temuco (Araucanía). */
export const chapter00: SoloChapter = {
  id: "chapter0",
  title: "Prólogo: Llegada bajo el Diluvio",
  description:
    "La lluvia de la Araucanía te recibe. Un nuevo dominio, una nueva Bestia acechando en la oscuridad.",
  startSceneId: "pro_001",
  scenes: [
    {
      id: "pro_001",
      chapterId: "chapter0",
      title: "El Final del Camino",
      text:
        "La lluvia no caía; se desplomaba. Era como si el cielo de la Araucanía guardara deudas de sangre centenarias con la tierra y hubiera decidido cobrarlas todas esa noche. El viejo taxi reduce la velocidad al entrar en Temuco. Luces anaranjadas y blancas se reflejan en los charcos como venas abiertas sobre el asfalto gris. La Bestia se remueve con un gruñido silencioso ante la cercanía de la urbe.",
      contextLeadInByState: [
        {
          requirement: { type: "clan", clan: "gangrel" },
          text:
            "Sientes cómo la tierra húmeda tira de ti incluso desde dentro del vehículo. Las raíces antiguas ya susurran tu nombre en un idioma que casi comprendes.",
        },
        {
          requirement: { type: "clan", clan: "ventrue" },
          text:
            "Esta ciudad carece de verdadera estructura. Un dominio sin rey visible… o con un rey demasiado débil para merecer lealtad.",
        },
        {
          requirement: { type: "clan", clan: "toreador" },
          text:
            "Incluso bajo la lluvia, percibes la crudeza brutal de este lugar. Ninguna belleza refinada, solo barro y zinc oxidado.",
        },
        {
          requirement: { type: "clan", clan: "malkavian" },
          text: "La lluvia habla. No con palabras, sino con ritmos. Crac… crac… crac… como raíces rompiendo huesos.",
        },
      ],
      options: [
        {
          id: "pro001_a",
          type: "dialogue",
          text: "Preguntar al taxista por la Plaza Aníbal Pinto y un hotel discreto",
          requirement: { type: "none" },
          nextSceneId: "pro_002",
          effects: [
            { type: "setFlag", flag: "arrived_temuco" },
            { type: "hungerDelta", delta: 1 },
          ],
        },
        {
          id: "pro001_b",
          type: "discipline",
          discipline: "dominate",
          text: "Dominar al conductor para que te lleve a un lugar apartado sin hacer preguntas",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "pro_002",
          effects: [
            { type: "setFlag", flag: "masquerade_breach_low" },
            { type: "hungerDelta", delta: -1 },
          ],
        },
        {
          id: "pro001_c",
          type: "clan",
          clan: "gangrel",
          text: "Dejar que el instinto salvaje te guíe y bajar del taxi en las afueras",
          requirement: { type: "clan", clan: "gangrel" },
          nextSceneId: "pro_002",
          effects: [
            { type: "addStateTag", tag: "earth_affinity" },
            { type: "setFlag", flag: "first_feeding_wild" },
          ],
        },
        {
          id: "pro001_d",
          type: "skill",
          skill: "sigilo",
          text: "Bajar discretamente y moverte por callejones sin dejar rastro",
          requirement: { type: "skill", skill: "sigilo", minLevel: 2 },
          nextSceneId: "pro_002",
          effects: [{ type: "experienceDelta", delta: 10 }],
        },
      ],
    },
    {
      id: "pro_002",
      chapterId: "chapter0",
      title: "La Primera Sed",
      text:
        "La Bestia despierta con furia en tu pecho vacío. Llevas demasiado tiempo sin alimentarte. Temuco de noche es un laberinto silencioso y hostil. Un callejón oscuro, un trabajador nocturno empapado con chaleco reflectante… el olor de sangre caliente bajo la piel.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "first_feeding_wild", equals: true },
          text: "La lluvia y el barro parecen llamarte. La Bestia está más despierta que nunca.",
        },
      ],
      options: [
        {
          id: "pro002_a",
          type: "skill",
          skill: "persuasion",
          text: "Acercarte con palabras suaves y seducir a la presa sin violencia",
          requirement: { type: "skill", skill: "persuasion", minLevel: 2 },
          nextSceneId: "pro_003",
          effects: [
            { type: "hungerDelta", delta: -2 },
            { type: "humanityDelta", delta: 0 },
            { type: "setFlag", flag: "feeding_gentle" },
          ],
        },
        {
          id: "pro002_b",
          type: "skill",
          skill: "refriegas",
          text: "Cazar con brutalidad y rapidez (riesgo alto de Masquerade)",
          requirement: { type: "skill", skill: "refriegas", minLevel: 2 },
          nextSceneId: "pro_003",
          nextSceneIdOnFail: "pro_002_fail",
          effects: [
            { type: "hungerDelta", delta: -3 },
            { type: "setFlag", flag: "masquerade_breach_medium" },
            { type: "humanityDelta", delta: -1 },
          ],
        },
        {
          id: "pro002_c",
          type: "discipline",
          discipline: "obfuscate",
          text: "Usar Ofuscación para alimentarte sin ser visto",
          requirement: { type: "discipline", discipline: "obfuscate", minLevel: 2 },
          nextSceneId: "pro_003",
          effects: [
            { type: "hungerDelta", delta: -2 },
            { type: "setFlag", flag: "feeding_stealth" },
          ],
        },
        {
          id: "pro002_d",
          type: "clan",
          clan: "toreador",
          text: "Buscar una presa más hermosa y digna de tu atención",
          requirement: { type: "clan", clan: "toreador" },
          nextSceneId: "pro_002_toreador",
          effects: [{ type: "setFlag", flag: "feeding_aesthetic" }],
        },
      ],
    },
    {
      id: "pro_002_fail",
      chapterId: "chapter0",
      title: "La Sed Descontrolada",
      text:
        "La Bestia toma el control. El hombre muere con un grito ahogado por la lluvia. Un charco de sangre se mezcla con el agua. Alguien pudo haberte visto.",
      options: [
        {
          id: "pro002f_a",
          type: "dialogue",
          text: "Escapar rápidamente hacia el hotel",
          requirement: { type: "none" },
          nextSceneId: "pro_003",
          effects: [
            { type: "humanityDelta", delta: -2 },
            { type: "setFlag", flag: "masquerade_breach_high" },
          ],
        },
      ],
    },
    {
      id: "pro_002_toreador",
      chapterId: "chapter0",
      title: "La Presa Hermosa",
      text:
        "Encuentras a una joven que sale de un bar universitario. Su belleza cruda bajo la lluvia te atrae. El beso de la vitae es casi poético.",
      options: [
        {
          id: "pro002t_a",
          type: "dialogue",
          text: "Alimentarte con delicadeza y dejarla viva",
          requirement: { type: "none" },
          nextSceneId: "pro_003",
          effects: [
            { type: "hungerDelta", delta: -2 },
            { type: "humanityDelta", delta: 1 },
            { type: "setFlag", flag: "feeding_aesthetic" },
          ],
        },
      ],
    },
    {
      id: "pro_003",
      chapterId: "chapter0",
      title: "La Tarjeta Negra",
      text:
        "Regresas al hotel modesto. La habitación 307 huele a humedad antigua. Sobre la cama, perfectamente centrada, hay una tarjeta negra con letras plateadas: «Bienvenido a Temuco. La Corte sabe que estás aquí. No hagas que nos arrepintamos».",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "masquerade_breach_high", equals: true },
          text: "La Bestia aún ruge en tu interior. Sabes que tu llegada no ha pasado desapercibida.",
        },
      ],
      options: [
        {
          id: "pro003_a",
          type: "dialogue",
          text: "Descansar y prepararte mentalmente para la cita de mañana",
          requirement: { type: "none" },
          nextSceneId: "pro_004",
          effects: [
            { type: "setFlag", flag: "chapter_pending_chapter01" },
            { type: "hungerDelta", delta: 1 },
          ],
        },
        {
          id: "pro003_b",
          type: "skill",
          skill: "investigacion",
          text: "Examinar la habitación en busca de rastros del intruso",
          requirement: { type: "skill", skill: "investigacion", minLevel: 1 },
          nextSceneId: "pro_003_invest",
          effects: [{ type: "experienceDelta", delta: 15 }],
        },
        {
          id: "pro003_c",
          type: "discipline",
          discipline: "auspex",
          text: "Usar Auspex para percibir residuos psíquicos en la tarjeta",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "pro_003_psychic",
          effects: [{ type: "experienceDelta", delta: 20 }],
        },
      ],
    },
    {
      id: "pro_003_invest",
      chapterId: "chapter0",
      title: "Huellas en la Oscuridad",
      text:
        "Encuentras una huella húmeda de bota que no es tuya y un leve olor a cachemir. Alguien poderoso te vigiló.",
      options: [
        {
          id: "pro003i_a",
          type: "dialogue",
          text: "Guardar la información y descansar",
          requirement: { type: "none" },
          nextSceneId: "pro_004",
          effects: [
            { type: "setFlag", flag: "voss_suspect" },
            { type: "setFlag", flag: "chapter_pending_chapter01" },
          ],
        },
      ],
    },
    {
      id: "pro_003_psychic",
      chapterId: "chapter0",
      title: "Susurro de la Corte",
      text:
        "La tarjeta emite un eco frío: arrogancia aristocrática y una presencia femenina curiosa. La Corte ya tiene nombres para ti.",
      options: [
        {
          id: "pro003p_a",
          type: "dialogue",
          text: "Guardar la visión y descansar",
          requirement: { type: "none" },
          nextSceneId: "pro_004",
          effects: [
            { type: "setFlag", flag: "valeria_interest" },
            { type: "setFlag", flag: "voss_suspect" },
            { type: "setFlag", flag: "chapter_pending_chapter01" },
          ],
        },
      ],
    },
    {
      id: "pro_004",
      chapterId: "chapter0",
      title: "Fin del Prólogo",
      text:
        "La noche termina con la certeza de que Temuco ya te ha notado. La lluvia sigue cayendo, pero ahora sabes que no estás solo. La Bestia, la Corte y algo más antiguo en la tierra esperan tu próximo movimiento.",
      options: [],
    },
  ],
};
