import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter09: SoloChapter = {
  id: "chapter09",
  title: "Santiago en Cenizas · Capítulo 9 · El Trono de Humo (enfrentamiento final)",
  description: "Asalto al Castillo Hidalgo, duelo de voluntad y cierre final de la ruta Ventrue.",
  startSceneId: "n9_0",
  scenes: [
    {
      id: "n9_0",
      chapterId: "chapter09",
      title: "9.0 · La ascensión al Castillo Hidalgo",
      text: `Terraza del Castillo Hidalgo. El cielo es un remolino de nubes negras y relámpagos azules.

El Príncipe te espera rodeado por una presencia antigua que deforma el aire: "Has roto el sello. Santiago será el banquete de los Antiguos".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "gran_alianza", equals: true },
          text: "Subes entre disparos y gritos de guerra de una alianza imposible.",
        },
        {
          requirement: { type: "flag", flag: "asalto_solitario", equals: true },
          text: "Subes solo, con las manos manchadas por hiel y polvo de estatua.",
        },
      ],
      options: [
        {
          id: "n9_0_liderazgo",
          type: "dialogue",
          text: "Ordenar el ataque coordinado.",
          requirement: { type: "flag", flag: "gran_alianza", equals: true },
          nextSceneId: "n9_1",
          effects: [{ type: "willpowerDelta", delta: 2 }, { type: "setFlag", flag: "brecha_abierta" }],
        },
        {
          id: "n9_0_dominate_letania",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Excomunión de traidores",
          text: "Anular el ritual recitando la lista de traidores.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "dominate", minLevel: 1 },
              { type: "flag", flag: "lista_traidores", equals: true },
            ],
          },
          nextSceneId: "n9_1",
          effects: [{ type: "hungerDelta", delta: 2 }, { type: "setFlag", flag: "ritual_debilitado" }],
        },
        {
          id: "n9_0_fortitude_nexo",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Cruzar fuego azul",
          text: "Lanzarte a las llamas para tocar el nexo.",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n9_1",
          effects: [{ type: "healthDamageDelta", delta: -3 }, { type: "setFlag", flag: "contacto_directo_nexo" }],
        },
        {
          id: "n9_0_ultimo_recurso",
          type: "dialogue",
          text: "Empujar el ritual a pura obstinación mortal, sin táctica ni discurso.",
          requirement: { type: "none" },
          nextSceneId: "n9_1",
          effects: [{ type: "willpowerDelta", delta: -2 }, { type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "brecha_tanteo" }],
        },
      ],
    },
    {
      id: "n9_1",
      chapterId: "chapter09",
      title: "9.1 · El último duelo de voluntades",
      text: `El centro del castillo se abre bajo tus pies: abajo, una ciudad de huesos.

El Príncipe blande una espada de sombra sólida. Esto ya no es solo acero: es quién tiene derecho a gobernar las cenizas.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          text: "Te mira con odio antiguo: cortaste la cadena que lo mantenía por encima de todos.",
        },
        {
          requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true },
          text: "Se ríe de tu ambición: \"Quieres mi corona, pero no su peso\".",
        },
      ],
      options: [
        {
          id: "n9_1_potence",
          type: "discipline",
          discipline: "potence",
          disciplineTitle: "Decapitar la tiranía",
          text: "Asestar un golpe final que quiebre su guardia.",
          requirement: { type: "discipline", discipline: "potence", minLevel: 1 },
          nextSceneId: "n9_2",
          effects: [{ type: "setFlag", flag: "principe_caido" }],
        },
        {
          id: "n9_1_majestad",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Majestad",
          text: "Reclamar soberanía absoluta frente al nexo.",
          requirement: { type: "discipline", discipline: "presence", minLevel: 2 },
          nextSceneId: "n9_2",
          effects: [{ type: "humanityDelta", delta: -2 }, { type: "setFlag", flag: "nuevo_principe_santiago" }],
        },
        {
          id: "n9_1_cura",
          type: "dialogue",
          text: "Inyectar la muestra en el corazón del ritual.",
          requirement: { type: "flag", flag: "cura_encontrada", equals: true },
          nextSceneId: "n9_2",
          effects: [{ type: "willpowerDelta", delta: -3 }, { type: "setFlag", flag: "santiago_purificada" }],
        },
        {
          id: "n9_1_potencia_bruta",
          type: "skill",
          skill: "pelea",
          text: "Golpear con todo lo humano que te queda: sin Potencia de linaje, solo furia y costilla rota.",
          requirement: { type: "skill", skill: "pelea", minLevel: 1 },
          nextSceneId: "n9_2",
          effects: [
            { type: "humanityDelta", delta: -1 },
            { type: "healthDamageDelta", delta: -2 },
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "principe_caido" },
          ],
        },
        {
          id: "n9_1_sin_dones",
          type: "dialogue",
          text: "Arrojarte al Príncipe sin disciplina de nobleza: morder, arrastrar, sobrevivir.",
          requirement: { type: "none" },
          nextSceneId: "n9_2",
          effects: [
            { type: "humanityDelta", delta: -1 },
            { type: "healthDamageDelta", delta: -2 },
            { type: "hungerDelta", delta: 2 },
            { type: "setFlag", flag: "principe_caido" },
          ],
        },
      ],
    },
    {
      id: "n9_2",
      chapterId: "chapter09",
      title: "9.2 · El amanecer negro",
      text: `El silencio cae sobre el cerro. Las llamas se apagan. El primer rayo asoma por la cordillera.

Has ganado, pero el precio está escrito en cenizas.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "nuevo_principe_santiago", equals: true },
          text: "Inés y Gato se arrodillan, esperando tu primera orden.",
        },
        {
          requirement: { type: "flag", flag: "santiago_purificada", equals: true },
          text: "Te quedas solo en las ruinas mientras el sol empieza a quemar.",
        },
      ],
      options: [
        {
          id: "n9_2_final_tirano",
          type: "dialogue",
          text: "Ejecutar disidentes y reconstruir la Corte bajo tu puño.",
          requirement: { type: "flag", flag: "nuevo_principe_santiago", equals: true },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingA" }, { type: "setFlag", flag: "final_trono_sangre" }],
        },
        {
          id: "n9_2_final_martir",
          type: "dialogue",
          text: "Entregar el control a los Anarquistas y desaparecer en el sol.",
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingB" }, { type: "setFlag", flag: "final_cenizas_libertad" }],
        },
        {
          id: "n9_2_final_estratega",
          type: "dialogue",
          text: "Mantener la fachada Camarilla y gobernar desde las sombras.",
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "doble_agente", equals: true },
              { type: "flag", flag: "santiago_purificada", equals: true },
            ],
          },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingC" }, { type: "setFlag", flag: "final_paz_sepulcros" }],
        },
        {
          id: "n9_2_final_victoria_sangrienta",
          type: "dialogue",
          text: "Imponer tu victoria a cuchillo: sin corona mística, pero con miedo suficiente para que obedezcan.",
          requirement: { type: "flag", flag: "principe_caido", equals: true },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                { type: "flag", flag: "nuevo_principe_santiago", equals: true },
                { type: "flag", flag: "vinculo_destruido", equals: true },
                { type: "flag", flag: "santiago_purificada", equals: true },
              ],
            },
          },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingA" }, { type: "setFlag", flag: "final_trono_sangre_bruta" }],
        },
        {
          id: "n9_2_final_purificacion_sola",
          type: "dialogue",
          text: "Caminar entre ruinas con la cura hecha efecto: entregar el relevo a quienes puedan sostener el caos.",
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "santiago_purificada", equals: true },
              { type: "not", requirement: { type: "flag", flag: "doble_agente", equals: true } },
            ],
          },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingB" }, { type: "setFlag", flag: "final_cenizas_tras_cura" }],
        },
      ],
    },
    {
      id: "n9_end",
      chapterId: "chapter09",
      title: "9.E · Santiago después de la tormenta",
      text: `Las cámaras llaman "fenómeno geológico" a las ruinas del Santa Lucía.

Los vivos olvidan rápido. En sótanos y torres, tu nombre se susurra con miedo y reverencia.`,
      options: [
        {
          id: "n9_end_close",
          type: "dialogue",
          text: "Cerrar la ruta Ventrue.",
          requirement: { type: "none" },
          nextSceneId: "n9_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_epilogue" }],
        },
      ],
    },
  ],
};
