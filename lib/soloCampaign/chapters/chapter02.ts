import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter02: SoloChapter = {
  id: "chapter02",
  title: "CLAN: VENTRUE | CAPÍTULO 2: LA CORTE DE LOS ESPEJOS ROTOS (BLOQUE 2/2)",
  description: "Palacio Bruna: umbral del poder, audiencia del Príncipe y salida hacia Mapocho (tramo cap. 3).",
  startSceneId: "n2_0",
  scenes: [
    {
      id: "n2_0",
      chapterId: "chapter02",
      title: "[ESCENA 2.0]: EL UMBRAL DEL PODER",
      text: `CONTEXTO: Fachada del Palacio Bruna, Parque Forestal. 03:45 AM.
NARRACIÓN: El Palacio Bruna se alza como un bastión de la Belle Époque en medio de un Santiago que se cae a pedazos. Doña Inés camina delante de ti; el rítmico golpeteo de sus tacones sobre el mármol suena como el segundero de un reloj que cuenta tus últimos minutos de libertad. En la entrada principal, dos centinelas de la Torre se tensan al verte llegar. Entrar aquí no es solo cruzar una puerta; es aceptar que eres una pieza en el tablero de un rey que no conoces.`,
      options: [
        {
          id: "n2_0_presencia",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Expandir tu autoridad innata para que los guardias retrocedan por instinto.

PUENTE: Te adelantas a Inés, proyectando una ola de comando gélido. No pides permiso; tu presencia exige paso. Los guardias, abrumados por un respeto instintivo que les hiela la sangre, se apartan y abren las puertas dobles con una urgencia casi servil.

CONSECUENCIA: Entras con el estatus de un soberano, ganando el respeto inmediato de la seguridad del Palacio.

RESULTADO: willpowerDelta: +1 | setFlag: entrada_soberana | IR A [ESCENA 2.1]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "entrada_soberana" }],
        },
        {
          id: "n2_0_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: `OPCIÓN B [HABILIDAD: ETIQUETA]: Realizar el saludo formal de la Camarilla para validar tu linaje.

PUENTE: Te detienes a la distancia exacta. Realizas una inclinación de cabeza medida, un gesto que en la alta política vástago significa "reconozco vuestro rango, pero recordad el mío". Es una danza de sutilezas que solo un Ventrue domina.

CONSECUENCIA: Inés asiente levemente, complacida de que no seas un ignorante. Los guardias se relajan.

RESULTADO: setFlag: etiqueta_validada | IR A [ESCENA 2.1]`,
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "etiqueta_validada" }],
        },
        {
          id: "n2_0_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Mantener una compostura profesional y esperar a que Inés haga las presentaciones.

PUENTE: No dices nada. Te mantienes un paso detrás de ella, observando el entorno con desapego. Eres el activo que ella ha recuperado; dejas que el protocolo siga su curso natural.

CONSECUENCIA: Pasas desapercibido como un activo bajo la tutela de Inés, lo que te da seguridad pero menos peso político inicial.

RESULTADO: (Avance estándar) | IR A [ESCENA 2.1]`,
          requirement: { type: "none" },
          nextSceneId: "n2_1",
        },
        {
          id: "n2_0_instinto",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Desafiar físicamente a los guardias para marcar territorio desde el inicio.

PUENTE: Te acercas demasiado a uno de los centinelas, dejando que el brillo de tus ojos delate a la Bestia. "Abre la puerta antes de que decida que tu sangre es más interesante que la audiencia", susurras.

CONSECUENCIA: Pasas por la fuerza del miedo, pero la seguridad del palacio te marca como una amenaza volátil.

RESULTADO: humanityDelta: -1 | setFlag: reputacion_animal | IR A [ESCENA 2.1]`,
          requirement: { type: "none" },
          nextSceneId: "n2_1",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "reputacion_animal" }],
        },
      ],
    },
    {
      id: "n2_1",
      chapterId: "chapter02",
      title: "[ESCENA 2.1]: LA AUDIENCIA CON EL PRÍNCIPE",
      text: `CONTEXTO: El Salón Dorado. Techos de triple altura con molduras bañadas en pan de oro. El Príncipe de Santiago está de pie frente a un ventanal que da al Parque Forestal.
NARRACIÓN: El aire en el salón es denso, cargado de una quietud artificial. El Príncipe se gira lentamente. Es un hombre que emana una autoridad gélida; su presencia es un peso físico que parece reducir el espacio vital de los demás. Te observa en silencio, evaluando si la inversión realizada en tu "despertar" dará frutos o si eres simplemente otro error que debe ser borrado.

"Santiago es un organismo que requiere equilibrio", dice con una voz que suena como el cierre de una caja fuerte. "Pero algo está pudriendo sus cimientos. Hay un nexo de infección en la Estación Mapocho que amenaza con romper la Mascarada y contaminar nuestra sangre. Tú irás allí. Encontrarás el origen de la Hiel y lo erradicarás". Sobre una mesa de mármol, descansa un sobre lacrado y una daga de plata con inscripciones de la Camarilla.`,
      options: [
        {
          id: "n2_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Sostener la mirada del Príncipe para medir la fuerza de su voluntad contra la tuya.

PUENTE: No bajas la cabeza. Tus ojos encuentran los suyos en un duelo silencioso de voluntades que hace que el aire de la sala parezca vibrar. Tras unos segundos de tensión insoportable, el Príncipe sonríe levemente. "Tienes espina dorsal. Úsala contra mis enemigos, no contra mí".

CONSECUENCIA: Ganas un respeto peligroso. El Príncipe sabe que no eres un peón fácil de manejar, pero te vigilará de cerca.

RESULTADO: willpowerDelta: +1 | setFlag: respeto_principe | IR A [ESCENA 2.2]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "respeto_principe" }],
        },
        {
          id: "n2_1_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: Analizar el sobre y el entorno para detectar segundas intenciones.

PUENTE: No tomas los objetos de inmediato. Observas la forma en que Inés evita mirar el sobre y cómo el Príncipe aprieta el puño al mencionar la Estación. Comprendes que no es solo una misión de limpieza; es una búsqueda de algo que el Príncipe ha perdido.

CONSECUENCIA: Obtienes una ventaja de información. Sospechas que la "infección" tiene un origen interno en la Corte.

RESULTADO: setFlag: sospecha_principe | IR A [ESCENA 2.2]`,
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [{ type: "setFlag", flag: "sospecha_principe" }],
        },
        {
          id: "n2_1_dialogo_oficial",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Aceptar el encargo con una promesa de eficiencia y lealtad.

PUENTE: "Consideradlo hecho, Majestad. El orden de Santiago es mi prioridad", respondes con la seguridad de tu casta. Tomas el sobre y la daga, sellando el pacto de servicio que te une a la corona de la ciudad.

CONSECUENCIA: Te conviertes formalmente en el Embajador de la Corte para esta misión. Ganas acceso a recursos de logística.

RESULTADO: setFlag: agente_oficial | IR A [ESCENA 2.2]`,
          requirement: { type: "none" },
          nextSceneId: "n2_2",
          effects: [{ type: "setFlag", flag: "agente_oficial" }, { type: "setFlag", flag: "embajador_corte" }],
        },
        {
          id: "n2_1_traje_gris",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes setFlag: info_traje_gris, mencionar al vigilante de Teatinos para desestabilizarlo.

PUENTE: "Un hombre de traje gris me dio la bienvenida antes que vuestra mano derecha, Príncipe. ¿Debo asumir que él también habla en vuestro nombre?", preguntas con un tono de sospecha que roza la insolencia.

CONSECUENCIA: El Príncipe palidece y las luces del salón parpadean. Te das cuenta de que el "Sastre" es una presencia que el Príncipe no controla.

RESULTADO: willpowerDelta: -1 | setFlag: secreto_del_sastre | IR A [ESCENA 2.2]`,
          requirement: {
            type: "all",
            requirements: [{ type: "flag", flag: "info_traje_gris", equals: true }],
          },
          nextSceneId: "n2_2",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "secreto_del_sastre" }],
        },
      ],
    },
    {
      id: "n2_2",
      chapterId: "chapter02",
      title: "[ESCENA 2.2]: LA PARTIDA HACIA LA NOCHE",
      text: `CONTEXTO: Patio trasero del Palacio Bruna. Inés te entrega las llaves de un vehículo o una dirección escrita.
NARRACIÓN: La audiencia ha terminado de forma abrupta. Sales al aire frío de la madrugada con la daga de plata pesando en tu cinturón. Inés te detiene antes de que subas al coche. "La Estación Mapocho no es solo un nido de ratas", advierte ella en un susurro. "Hay un Nosferatu llamado 'El Choro' que conoce los niveles inferiores. Es un animal, pero es el único que sabe por qué el agua del río Mapocho está cambiando de color. Encuéntralo antes de que el Sabbat lo haga".

BIFURCACIÓN DE SALIDA (LÓGICA PARA CAPÍTULO 3):

Si setFlag: agente_oficial: El Príncipe te otorga un sedán blindado. (Ventaja en movilidad).

Si setFlag: respeto_principe: Inés te entrega un intercomunicador directo con ella. (Acceso a pistas vía radio).

Si setFlag: reputacion_animal: Debes llegar a pie. Inés te entrega solo un mapa viejo. (Dificultad aumentada).`,
      options: [
        {
          id: "n2_2_precaria",
          type: "dialogue",
          text: `Inés te despide sin vehículo: solo mapa marcado y el aviso sobre El Choro.

RESULTADO: setFlag: cap3_salida_a_pie | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [{ type: "flag", flag: "reputacion_animal", equals: true }],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "cap3_salida_a_pie" },
            { type: "setFlag", flag: "mision_castigo" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_2_sedan",
          type: "dialogue",
          text: `El Príncipe cumple la logística: un sedán blindado te espera. Inés replica el aviso sobre El Choro y la Estación.

RESULTADO: setFlag: cap3_sedan_blindado | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "agente_oficial", equals: true },
              {
                type: "not",
                requirement: { type: "flag", flag: "reputacion_animal", equals: true },
              },
            ],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "cap3_sedan_blindado" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_2_radio",
          type: "dialogue",
          text: `Inés te pasa un intercomunicador cifrado. "No lo pierdas. Yo te corto los extremos cuando el callejón apeste a demonio".

RESULTADO: setFlag: cap3_radio_ines | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "respeto_principe", equals: true },
              {
                type: "not",
                requirement: { type: "flag", flag: "reputacion_animal", equals: true },
              },
              { type: "flag", flag: "agente_oficial", equals: false },
            ],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "cap3_radio_ines" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_2_standard",
          type: "dialogue",
          text: `Inés cierra sin favor especial: tienes dirección y la advertencia sobre El Choro; el resto lo resuelves tú.

RESULTADO: setFlag: cap3_salida_estandar | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [
              {
                type: "not",
                requirement: { type: "flag", flag: "reputacion_animal", equals: true },
              },
              { type: "flag", flag: "agente_oficial", equals: false },
              { type: "flag", flag: "respeto_principe", equals: false },
            ],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "cap3_salida_estandar" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
      ],
    },
    {
      id: "n2_end",
      chapterId: "chapter02",
      title: "2.E · Cierre del capítulo",
      text: `La Corte ya decidió cómo te va a usar. Tú decides qué harás con ese margen mínimo.`,
      options: [
        {
          id: "n2_end_continue",
          type: "dialogue",
          text: "Continuar al Capítulo 3",
          requirement: { type: "none" },
          nextSceneId: "n2_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter03" }],
        },
      ],
    },
  ],
};
