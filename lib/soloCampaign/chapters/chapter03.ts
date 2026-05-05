import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter03: SoloChapter = {
  id: "chapter03",
  title: "Santiago en Cenizas · Capítulo 3 · El Rastro de la Hiel (Logic V3 · Ventrue)",
  description: "Estación Mapocho, túneles, El Choro y corazón de la hiel con salidas ramificadas.",
  startSceneId: "n3_0",
  scenes: [
    {
      id: "n3_0",
      chapterId: "chapter03",
      title: "3.0 · Los andenes del abismo",
      text: `Entrada técnica de la Estación Mapocho. Medianoche. Olor a metal oxidado y agua estancada.

La orden es clara: localizar el origen de la hiel, una sustancia que está enfermando la sangre de la ciudad. El eco de tus pasos en el hormigón vacío suena a sentencia.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "embajador_corte", equals: true },
          text: "Llegas en vehículo oficial: para la Corte eres embajador funcional del orden.",
        },
        {
          requirement: { type: "flag", flag: "mision_castigo", equals: true },
          text: "Llegas por tu cuenta, sin escolta: castigo envuelto en misión.",
        },
      ],
      options: [
        {
          id: "n3_0_tecnologia",
          type: "skill",
          skill: "tecnologia",
          text: "Acceder a planos digitales antes de entrar.",
          requirement: { type: "skill", skill: "tecnologia", minLevel: 1 },
          nextSceneId: "n3_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "planos_secretos" }],
        },
        {
          id: "n3_0_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Rastro psíquico",
          text: "Rastrear la firma de la hiel desde la superficie.",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "n3_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "rastro_psiquico" }],
        },
        {
          id: "n3_0_apagon",
          type: "dialogue",
          text: "Usar influencia de infraestructura para cortar luces del sector.",
          requirement: {
            type: "flag",
            flag: "embajador_corte",
            equals: true,
          },
          nextSceneId: "n3_1",
          effects: [{ type: "setFlag", flag: "apagon_estacion" }],
        },
        {
          id: "n3_0_entrada_torpe",
          type: "dialogue",
          text: "Colarte por mantenimiento aun sin planos ni dones: pagar el descuido en sangre y tiempo.",
          requirement: { type: "none" },
          nextSceneId: "n3_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "entrada_mapocho_torpe" }],
        },
      ],
    },
    {
      id: "n3_1",
      chapterId: "chapter03",
      title: "3.1 · El encuentro con El Choro",
      text: `Túneles de desagüe bajo la estación. El agua te llega a los tobillos.

El Choro emerge de una tubería, barro y costras como armadura. "Un Rey en las cloacas", sisea. "¿Vienes a limpiar el río o a ahogarte en él?"`,
      options: [
        {
          id: "n3_1_diplomacia",
          type: "dialogue",
          text: "Ofrecer compensación por su ayuda.",
          requirement: { type: "none" },
          nextSceneId: "n3_2",
          effects: [{ type: "setFlag", flag: "alianza_nosferatu" }],
        },
        {
          id: "n3_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Habla o te rompes",
          text: "Forzarlo a revelar la ubicación del nido de hiel.",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n3_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "odio_nosferatu" }],
        },
        {
          id: "n3_1_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: "Notar que El Choro está herido por la misma sustancia.",
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n3_2",
          effects: [{ type: "setFlag", flag: "info_sabat" }],
        },
      ],
    },
    {
      id: "n3_2",
      chapterId: "chapter03",
      title: "3.2 · El corazón de la hiel",
      text: `Cámara de filtración antigua. Una costra negra brillante cubre una piscina estancada.

En el centro, una vástago encadenada gotea sangre hacia la hiel. "El pacto de 1814 se ha roto. El sol ya no nos protegerá."`,
      options: [
        {
          id: "n3_2_potence",
          type: "discipline",
          discipline: "potence",
          disciplineTitle: "Romper cadenas",
          text: "Liberarla de inmediato.",
          requirement: { type: "discipline", discipline: "potence", minLevel: 1 },
          nextSceneId: "n3_end",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "aliado_infectado" }],
        },
        {
          id: "n3_2_sacrificio",
          type: "dialogue",
          text: "Ejecutarla para detener la producción de hiel.",
          requirement: { type: "none" },
          nextSceneId: "n3_end",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "hiel_detenida" }],
        },
        {
          id: "n3_2_ocultismo",
          type: "skill",
          skill: "ocultismo",
          text: "Recolectar una muestra sin tocarla.",
          requirement: { type: "skill", skill: "ocultismo", minLevel: 1 },
          nextSceneId: "n3_end",
          effects: [{ type: "setFlag", flag: "arma_anti_ventrue" }],
        },
      ],
    },
    {
      id: "n3_end",
      chapterId: "chapter03",
      title: "3.E · El retorno a la superficie",
      text: `Sales a la Alameda con la ropa arruinada y la mente llena de grietas. Santiago duerme sin saber que sus cimientos están podridos.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "aliado_infectado", equals: true },
          text: "La vástago liberada cae en letargo, pero susurra un nombre: El Archivista.",
        },
        {
          requirement: { type: "flag", flag: "arma_anti_ventrue", equals: true },
          text: "El frasco en tu bolsillo quema: la hiel reacciona a tu linaje.",
        },
      ],
      options: [
        {
          id: "n3_end_ruta_medica",
          type: "dialogue",
          text: "Buscar refugio médico discreto antes de ver al Príncipe.",
          requirement: { type: "flag", flag: "aliado_infectado", equals: true },
          nextSceneId: "n3_end",
          effects: [{ type: "setFlag", flag: "chapter04_route_medica" }, { type: "setFlag", flag: "chapter_pending_chapter04" }],
        },
        {
          id: "n3_end_ruta_politica",
          type: "dialogue",
          text: "Regresar triunfante ante el Príncipe.",
          requirement: { type: "flag", flag: "hiel_detenida", equals: true },
          nextSceneId: "n3_end",
          effects: [{ type: "setFlag", flag: "chapter04_route_politica" }, { type: "setFlag", flag: "chapter_pending_chapter04" }],
        },
        {
          id: "n3_end_emboscada",
          type: "dialogue",
          text: "Salir al estacionamiento (te están esperando).",
          requirement: { type: "flag", flag: "odio_nosferatu", equals: true },
          nextSceneId: "n3_ambush",
        },
        {
          id: "n3_end_default",
          type: "dialogue",
          text: "Continuar al Capítulo 4",
          requirement: { type: "none" },
          visibilityRequirement: { type: "not", requirement: { type: "flag", flag: "odio_nosferatu", equals: true } },
          nextSceneId: "n3_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter04" }],
        },
      ],
    },
    {
      id: "n3_ambush",
      chapterId: "chapter03",
      title: "3.X · Emboscada inmediata",
      text: `El estacionamiento parece vacío hasta que tres sombras saltan desde los pilares. La venganza Nosferatu llega sin ceremonia.`,
      options: [
        {
          id: "n3_ambush_survive",
          type: "dialogue",
          text: "Sobrevivir como puedas y retirarte.",
          requirement: { type: "none" },
          nextSceneId: "n3_end",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "healthDamageDelta", delta: 2 }, { type: "setFlag", flag: "emboscada_superada" }, { type: "setFlag", flag: "chapter_pending_chapter04" }],
        },
        {
          id: "n3_ambush_fall",
          type: "dialogue",
          text: "Quedarte un segundo de más en campo abierto.",
          requirement: { type: "none" },
          nextSceneId: "n3_ambush",
          effects: [
            {
              type: "fatalOutcome",
              id: "fd_nosferatu_parking",
              title: "La deuda en el estacionamiento",
              body: "El odio de cloaca te alcanza antes de que puedas responder. Tu historia termina bajo el concreto húmedo de Mapocho.",
            },
          ],
        },
      ],
    },
  ],
};
