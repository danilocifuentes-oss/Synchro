import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter01: SoloChapter = {
  id: "chapter01",
  title: "Santiago en Cenizas · Capítulo 1 · El Beso del Mapocho",
  description: "Despertar en la imprenta, primer umbral en Teatinos y decisión de ruta bajo presión.",
  startSceneId: "n1_0",
  scenes: [
    {
      id: "n1_0",
      chapterId: "chapter01",
      title: "1.0 · El despertar en la imprenta",
      text: `Sótano de Teatinos. Oscuridad total. Aroma a tinta seca y polvo colonial.

El silencio es lo primero que te golpea: un vacío absoluto donde debería estar el ritmo de tu corazón. Al incorporarte, el crujido de la madera bajo tu peso suena como un disparo. En tu garganta persiste un ardor químico: el recuerdo del frasco que un anciano te entregó en la calle Bandera.

Tu linaje Ventrue se rebela ante la inmundicia; un Rey no debería despertar en un osario de papel viejo.`,
      options: [
        {
          id: "n1_0_investigar",
          type: "skill",
          skill: "investigacion",
          text: "Registrar los restos de la imprenta buscando pistas.",
          requirement: { type: "skill", skill: "investigacion", minLevel: 1 },
          nextSceneId: "n1_1",
          effects: [
            { type: "setFlag", flag: "sello_viña" },
            { type: "setFlag", flag: "novel_ch1_teatinos_surface" },
          ],
        },
        {
          id: "n1_0_instinto",
          type: "dialogue",
          text: "El ardor en la garganta te exige salir de inmediato.",
          requirement: { type: "none" },
          nextSceneId: "n1_2",
          effects: [{ type: "hungerDelta", delta: 1 }],
        },
        {
          id: "n1_0_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Protocolo de linaje",
          text: "Forzar a tu mente a recordar el protocolo de tu linaje.",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n1_1",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "protocolo_corte" },
          ],
        },
        {
          id: "n1_0_negacion",
          type: "dialogue",
          text: "Quedarte inmóvil esperando que el amanecer te despierte de esta pesadilla.",
          requirement: { type: "none" },
          nextSceneId: "n1_0",
          effects: [
            {
              type: "fatalOutcome",
              id: "fd_teatinos_sun",
              title: "Cenizas en Teatinos",
              body: "Pasan los minutos. El frío se vuelve absoluto. Un rayo de luz blanca se filtra por la claraboya superior, y no trae alivio: trae fuego.",
            },
          ],
        },
      ],
    },
    {
      id: "n1_1",
      chapterId: "chapter01",
      title: "1.1 · El umbral de Teatinos",
      text: `Calle Teatinos, hora muerta. El aire huele a ozono y asfalto frío.

A pocos metros, oculto tras un contenedor, un hombre andrajoso te observa. No es un curioso: es un centinela.`,
      options: [
        {
          id: "n1_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Interrogatorio forzado",
          text: "Ordenarle que confiese quién lo envió.",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n1_3",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "rastro_traje_gris" }],
        },
        {
          id: "n1_1_presence",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Quiebre psicológico",
          text: "Dejar que tu porte aristocrático lo destruya por dentro.",
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n1_3",
          effects: [{ type: "setFlag", flag: "telefono_espia" }],
        },
        {
          id: "n1_1_avanzar",
          type: "dialogue",
          text: "Seguir sin interrogar: no darle a ese hombre más ventaja de la que ya tiene.",
          requirement: { type: "none" },
          nextSceneId: "n1_3",
          effects: [{ type: "willpowerDelta", delta: -1 }],
        },
      ],
    },
    {
      id: "n1_2",
      chapterId: "chapter01",
      title: "1.2 · Parque Forestal · Ruta de riesgo",
      text: `El Hambre te nubla. Un grupo de jóvenes late como un tambor abierto bajo la noche.`,
      options: [
        {
          id: "n1_2_brutal",
          type: "dialogue",
          text: "Alimentación brutal sobre el más rezagado.",
          requirement: { type: "none" },
          nextSceneId: "n1_2",
          effects: [
            {
              type: "fatalOutcome",
              id: "fd_mascarada_rota",
              title: "La Mascarada cae sobre tu cuello",
              body: "Una cámara captura el Beso completo. Doña Inés no negocia fugas de protocolo.",
            },
          ],
        },
        {
          id: "n1_2_autocontrol",
          type: "dialogue",
          text: "Buscar objetivo solitario y contener a la Bestia.",
          requirement: { type: "none" },
          nextSceneId: "n1_4",
          effects: [
            { type: "hungerDelta", delta: -2 },
            { type: "willpowerDelta", delta: -1 },
            { type: "setFlag", flag: "novel_ch1_feed_spare" },
          ],
        },
      ],
    },
    {
      id: "n1_3",
      chapterId: "chapter01",
      title: "1.3 · Puente del Mapocho · Punto de convergencia",
      text: `La paranoia Ventrue despierta. Sobre el puente hacia Recoleta, una silueta inmóvil: el hombre del traje gris.

Te observa, asiente como quien confirma una inversión, y camina hacia la oscuridad de Bellavista.`,
      options: [
        {
          id: "n1_3_follow_q",
          type: "dialogue",
          text: "Seguir al sujeto de traje gris.",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "rastro_traje_gris", equals: true },
              { type: "flag", flag: "telefono_espia", equals: true },
            ],
          },
          nextSceneId: "n1_end",
          effects: [
            { type: "setRoute", route: "q" },
            { type: "addStateTag", tag: "path_conspiracy" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
            { type: "setFlag", flag: "route_q_opened" },
          ],
        },
        {
          id: "n1_3_protocol_main",
          type: "dialogue",
          text: "Ignorar la provocación e ir a la Corte.",
          requirement: { type: "none" },
          nextSceneId: "n1_end",
          effects: [
            { type: "setRoute", route: "main" },
            { type: "addStateTag", tag: "path_protocol" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
          ],
        },
      ],
    },
    {
      id: "n1_4",
      chapterId: "chapter01",
      title: "1.4 · Callejón de autocontrol",
      text: `Aprietas el mando sobre la Bestia. Te alimentas sin espectáculo y vuelves al borde del río con la cabeza fría.`,
      options: [
        {
          id: "n1_4_to_convergence",
          type: "dialogue",
          text: "Ir al puente del Mapocho.",
          requirement: { type: "none" },
          nextSceneId: "n1_3",
        },
      ],
    },
    {
      id: "n1_end",
      chapterId: "chapter01",
      title: "1.E · Cierre del capítulo",
      text: `La decisión queda tomada. Santiago ya empezó a responderte según el camino elegido.`,
      options: [
        {
          id: "n1_end_continue_ch2",
          type: "dialogue",
          text: "Continuar al Capítulo 2",
          requirement: { type: "none" },
          nextSceneId: "n1_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter02" }],
        },
      ],
    },
  ],
};
