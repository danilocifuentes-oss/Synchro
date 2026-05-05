import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter05: SoloChapter = {
  id: "chapter05",
  title: "Santiago en Cenizas · CAPÍTULO 5: SANGRE Y TIERRA",
  description:
    "Del refugio al horizonte de piedra: Catedral ancla, rutas Verdad/Ambición/Superviviente y cierre del Acto II.",
  startSceneId: "n5_0",
  scenes: [
    {
      id: "n5_0",
      chapterId: "chapter05",
      title: "[ESCENA 5.0]: EL REFUGIO TRAS LA TORMENTA",
      text: `CONTEXTO: Madrugada (casi el alba). El lugar varía según la resolución del Capítulo 4.
NARRACIÓN: El cielo sobre la cordillera empieza a clarear, una señal de muerte para los de tu clase.

Has sobrevivido a la Biblioteca, pero el documento que posees (o la información que robaste) es una bomba de tiempo. El Tratado de 1814 menciona una "fuente de vitalidad" bajo la Catedral de Santiago, vinculada directamente al linaje del Príncipe.`,
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "secreto_del_hermano", equals: true },
          text: "Te encuentras en un viñedo abandonado en las afueras de Buin; el aire huele a uva fermentada y tierra vieja. La ruta que abriste desde el papel te ha traído lejos del neón antes de tu próximo día.",
        },
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "chapter05_route_nodo_catedral", equals: true },
              { type: "flag", flag: "coordenada_lastarria", equals: true },
            ],
          },
          text: "Las coordenadas te encajaron un sótano de Lastarria: humedad, cable suelto y un olor químico bajo pintura reciente. Esperabas escondite, no oficina de nadie importante.",
        },
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "alerta_biblioteca_activa", equals: true },
              { type: "flag", flag: "chapter05_route_refugio_ceniza", equals: true },
            ],
          },
          text: "Estás en un sótano de Lastarria lleno de grafitis que parecen moverse en la penumbra: aquí nadie registra entrada a tiempo para la lista de la Corte.",
        },
      ],
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "fugitivo_corte", equals: true },
          text: "El pulso por busca y captura no deja espacio para el glamour: cada sombra lleva cara de ejecutor.",
        },
        {
          requirement: { type: "flag", flag: "doble_agente", equals: true },
          text: "Aun así cruzas mundos como quien porta dos máscaras sin que la suela del zapato reconozca el barro verdadero.",
        },
      ],
      options: [
        {
          id: "n5_0_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Resistir el letargo del alba para organizar tus siguientes movimientos antes de dormir.

PUENTE: Tu cuerpo exige el descanso de la tierra, pero obligas a tus nervios a mantenerse despiertos. Analizas el mapa robado —o el papel que aún llevas vivo en el bolso—, marcando los puntos de entrada a la Catedral mientras el primer rayo de sol quema la superficie fuera…

CONSECUENCIA: Ganas claridad táctica; el día siguiente lo encaras con menos improvisación.

RESULTADO: willpowerDelta: -1 | setFlag: planificacion_maestra | IR A [ESCENA 5.1]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n5_1",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "planificacion_maestra" }],
        },
        {
          id: "n5_0_ocultismo",
          type: "skill",
          skill: "ocultismo",
          text: `OPCIÓN B [HABILIDAD: LORE / OCULTISMO]: Estudiar el Tratado de 1814 para encontrar la debilidad mística del Príncipe.

PUENTE: Te encierras con los documentos. Descubres que el vínculo de sangre que une a la Corte de Santiago no es natural; fue creado mediante un sacrificio en la Catedral hace dos siglos. Si destruyes el "Ancla", el Príncipe pierde afianzamiento sobre sus subordinados.

CONSECUENCIA: Tomas el camino abierto por el derrocamiento místico cuando decidas empujarlo.

RESULTADO: setFlag: conocimiento_del_ancla | IR A [ESCENA 5.1]`,
          requirement: { type: "skill", skill: "ocultismo", minLevel: 1 },
          nextSceneId: "n5_1",
          effects: [{ type: "setFlag", flag: "conocimiento_del_ancla" }],
        },
        {
          id: "n5_0_contacto",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Contactar a un aliado —Inés o Gato— para negociar reingreso o seguridad.

PUENTE: Usas un teléfono desechable. Si llamas a Inés, insistes en una versión en la que la Corte perdió el orden en la Biblioteca no por tu culpa. Si llamas a Gato, ofreces papel o silencios a cambio de techo hasta el ocaso siguiente…

CONSECUENCIA: Recuperas vínculos con suministro y refugio, pero quien está al otro lado ya pudo marcar tus coordenadas.

RESULTADO: setFlag: apoyo_externo_negociado | IR A [ESCENA 5.1]`,
          requirement: { type: "none" },
          nextSceneId: "n5_1",
          effects: [{ type: "setFlag", flag: "apoyo_externo_negociado" }],
        },
        {
          id: "n5_0_purificacion",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Alimentarte de la sangre de la tierra —vid o animal cercano— para purificar la sangre corrupta.

PUENTE: Sientes la Hiel adosada al pulso. Te arrodillas y bebes donde la vida aún surge sin etiqueta aristocrática, buscando expulsar el violáceo con lo crudo que ofrece el campo o el cerco.

CONSECUENCIA: Tu sistema se aplana algo, pero la Bestia prueba algo que marca el orgullo Ventrue.

RESULTADO: hungerDelta: -1 | humanityDelta: -1 | setFlag: purificacion_parcial | IR A [ESCENA 5.1]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n5_1",
          effects: [
            { type: "hungerDelta", delta: -1 },
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "purificacion_parcial" },
          ],
        },
      ],
    },
    {
      id: "n5_1",
      chapterId: "chapter05",
      title: "[ESCENA 5.1]: LA SOMBRA EN EL VIÑEDO / EL SÓTANO",
      text: `CONTEXTO: El interior del refugio elegido. El silencio es roto por un sonido inesperado: pasos metálicos.
NARRACIÓN: No estás solo. Alguien ha seguido tu rastro, sorteando tus medidas de seguridad. De la penumbra emerge una figura que no esperabas: un vástago de aspecto antiguo, vestido con ropas militares del siglo XIX, pero con ojos modernos y calculadores. No es un simple enemigo: es superviviente del ritual de 1814.

"El Príncipe cree que el tiempo ha borrado sus crímenes", dice el extraño, mostrando una cicatriz en su cuello idéntica a la de la prisionera de la estación. "Pero la Hiel no olvida. Ella quiere volver a casa, y la Catedral es su puerta".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "secreto_del_hermano", equals: true },
          text: "El pergamino en tu bolso se calienta un instante: el visitante no hace ademán de quitártelo, pero ambos saben que ya comparten mapa.",
        },
        {
          requirement: { type: "flag", flag: "mapa_tuneles_catedral", equals: true },
          text: "Por instinto superpones el mapa que arrancaste con lo que él insinúa: las líneas concuerdan con un claustro bajo el coro.",
        },
      ],
      options: [
        {
          id: "n5_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Forzar al extraño a revelar su verdadera identidad y quién lo envía.

PUENTE: No aceptas intrusos. Tu voz resuena con autoridad hasta en las fibras viejas del refugio. "Nombre y mandante", exiges antes de dar un paso de más.

CONSECUENCIA: Habla como quien cargó cargas de ciudad: viejo Senescal, tiempo muerto oficialmente, vida contada sólo entre archivos cerrados.

RESULTADO: setFlag: aliado_senescal_antiguo | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n5_2",
          effects: [{ type: "setFlag", flag: "aliado_senescal_antiguo" }],
        },
        {
          id: "n5_1_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: Escuchar su historia y detectar si es una trampa de la Corte.

PUENTE: Mantienes la distancia. Cuando menciona la Catedral, sus dedos tiemblan; no llega perfil de ejecutor templado desde el sillón Bru.

CONSECUENCIA: Concluyes un pacto provisional: sobrevive quien coopere antes que obedezca como títere del Príncipe.

RESULTADO: setFlag: pacto_de_supervivencia | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n5_2",
          effects: [{ type: "setFlag", flag: "pacto_de_supervivencia" }],
        },
        {
          id: "n5_1_combate_declarado",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Prepararte para el combate y exigirle que se retire.

PUENTE: Desenvainas la daga de plata con la calma Ventrue convertida en límite. "Mi refugio. Sales o cerramos el ciclo aquí mismo", cortas. El otro retrocede… y deja un medallón pesado donde antes no había nada útil.

CONSECUENCIA: Mantienes soberanía en el lugar, pero pierdes un aliado potencial en el mismo intento.

RESULTADO: setFlag: llave_medallon_criptas | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n5_2",
          effects: [{ type: "setFlag", flag: "llave_medallon_criptas" }],
        },
        {
          id: "n5_1_paranoia_corrupta",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - VIOLENCIA]: Si tienes sangre_corrupta, atacar impulsado por la paranoia.

PUENTE: La Hiel traduce cualquier perfil alto como invasión. Te lanzas; el encuentro raspa pared y lata igual que en Mapocho.

CONSECUENCIA: Sangre nueva en el lugar; el intruso escapa raspado pero el rumor queda prendido ahí donde dormías.

RESULTADO: healthDamageDelta: -1 | setFlag: ubicacion_revelada_persecución | IR A [BLOQUE 2]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n5_2",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "ubicacion_revelada_persecución" }],
        },
      ],
    },
    {
      id: "n5_2",
      chapterId: "chapter05",
      title: "[ESCENA 5.2]: EL DESPERTAR DEL INTERLUDIO",
      text: `CONTEXTO: Interior del refugio. 08:00 PM. El sol se ha puesto y la sangre en tus venas vuelve a bullir.
NARRACIÓN: La noche cae sobre Santiago con un peso inusual.

La tregua del día ha terminado; la información que sacaste de la Biblioteca te convierte en el vástago más peligroso —o más valioso— de la ciudad. El Tratado de 1814 es claro: quien controle el ancla en la Catedral, afianza el vínculo de sangre sobre la región metropolitana.`,
      flagAppends: [
        {
          flag: "aliado_senescal_antiguo",
          text: "Despiertas con un croquis minucioso sobre la mesa: asedio, timings, ángulos ciegos del coro al sótano. El Senescal estuvo aquí antes de marcharse.",
        },
        {
          flag: "ubicacion_revelada_persecución",
          text: "Neumáticos frenan en seco contra el cemento fuera del refugio. La Corte tardó menos de lo cómodo en conectar tus huellas hasta aquí.",
        },
      ],
      options: [
        {
          id: "n5_2_presencia_parlamento",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Obligar al equipo de asalto a parlamentar antes del primer disparo.

PUENTE: Te plantas en el umbral bañado por un filo de luna. Obligas al grupo a dudar con el arma tensa antes de que gane el protocolo cerrado del Príncipe.

CONSECUENCIA: La lealtad baja arma o se fisura; algunos se retiran antes de ejecutar orden.

RESULTADO: willpowerDelta: +1 | setFlag: desercion_en_la_corte | IR A [ESCENA 5.END]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          visibilityRequirement: { type: "flag", flag: "ubicacion_revelada_persecución", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "desercion_en_la_corte" }],
        },
        {
          id: "n5_2_sigilo_escape",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN B [HABILIDAD: SIGILO]: Salir antes de que el perímetro selle del todo.

PUENTE: No discutes con la calle; leyes las sombras donde una cámara juraría que no hay nadie.

CONSECUENCIA: Mantienes anonimato y reservas fuerza física pensando en el asalto a la Catedral.

RESULTADO: setFlag: escape_limpio_5 | IR A [ESCENA 5.END]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "escape_limpio_5" }],
        },
        {
          id: "n5_2_medallon_drenaje",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Insertar llave_medallon_criptas y abrir el drenaje colonial hacia la piedra sagrada.

PUENTE: El mecanismo gime piedra contra piedra. El hueco apesta primero a barro vivo y luego a Hiel en charcos quietos.

CONSECUENCIA: Te mueves sin pelear esta franja en la superficie; pagas hambre y la humedad púrpura del subsuelo.

RESULTADO: hungerDelta: +1 | setFlag: ruta_subterranea_directa | IR A [ESCENA 5.END]`,
          requirement: { type: "flag", flag: "llave_medallon_criptas", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "ruta_subterranea_directa" }],
        },
        {
          id: "n5_2_purga_operativos",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - VIOLENCIA]: Con purificación parcial intacta, salir contra quien espere tras la puerta.

PUENTE: La Bestia no te arrastra, pero sí el juicio rápido que te inventás. El encuentro grita guerra abierta hasta el Palacio Bruna.

CONSECUENCIA: El mensaje llega igual que el ruido: el Embajador protocolario está muerto ante la Corte; el contendiente ha nacido.

RESULTADO: humanityDelta: -1 | setFlag: guerra_abierta_principe | IR A [ESCENA 5.END]`,
          requirement: { type: "flag", flag: "purificacion_parcial", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "guerra_abierta_principe" }],
        },
        {
          id: "n5_2_retirada_dialogo",
          type: "dialogue",
          text: `Huir antes de que cierre el cerco sin práctica formal de sigilo: calles, oxígeno y suerte encima.

RESULTADO: setFlag: escape_limpio_5 | IR A [ESCENA 5.END]`,
          requirement: { type: "none" },
          visibilityRequirement: { type: "not", requirement: { type: "skill", skill: "sigilo", minLevel: 1 } },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "escape_limpio_5" }],
        },
      ],
    },
    {
      id: "n5_end",
      chapterId: "chapter05",
      title: "[ESCENA 5.END]: EL HORIZONTE DE PIEDRA",
      text: `CONTEXTO: Mirador frente a la Plaza de Armas. La Catedral Metropolitana se alza como fortaleza de fe y piedra.
NARRACIÓN: Santiago arde en una calma tensa. La Catedral, el siguiente nodo, observa desde su altura. El Acto II de tu crónica tiende a cerrar aquí si no lo empujas tú mismo: la verdad de 1814 ya no cabe sólo en anaqueles.

BIFURCACIÓN LÓGICA PARA CAPÍTULO 6
Verdad: conocimiento_del_ancla + aliado_senescal_antiguo → entrar para destruir el vínculo.
Ambición: guerra_abierta_principe → entrar por el ancla.
Superviviente: escape_limpio_5 → infiltrarte y medir el tablero antes de mover ficha.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "conocimiento_del_ancla", equals: true },
          text: "Tienes claro que el Ancla es la argolla simbiótica entre el linaje dominante del Príncipe y cada Ventrue menor que juró después.",
        },
        {
          requirement: { type: "flag", flag: "desercion_en_la_corte", equals: true },
          text: "El perímetro del templo muestra menos manos efectivas que deberían: tus palabras siguen comiendo orden como polilla.",
        },
        {
          requirement: { type: "flag", flag: "fugitivo_corte", equals: true },
          text: "Sigues dentro de ficheros que nadie muestra en vitrina; la plaza puede ser bálsamo o trampilla según segundo.",
        },
        {
          requirement: { type: "flag", flag: "doble_agente", equals: true },
          text: "La doble hoja cobra cara: hasta el rumor de tus pasos cuenta doble ante quien espera resultado.",
        },
      ],
      options: [
        {
          id: "n5_end_ruta_verdad_ancla",
          type: "dialogue",
          text: `Ruta de la Verdad: infiltrarte decidido para destruir el Vínculo en el núcleo.

RESULTADO: chapter06_ruta_verdad_ancla | chapter_pending_chapter06`,
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "conocimiento_del_ancla", equals: true },
              { type: "flag", flag: "aliado_senescal_antiguo", equals: true },
            ],
          },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter06_ruta_verdad_ancla" }, { type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
        {
          id: "n5_end_ruta_ambicion_ancla",
          type: "dialogue",
          text: `Ruta de la Ambición: convertir tu declaración previa en toma física del ancla.

RESULTADO: chapter06_ruta_ambicion_ancla | chapter_pending_chapter06`,
          requirement: { type: "flag", flag: "guerra_abierta_principe", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter06_ruta_ambicion_ancla" }, { type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
        {
          id: "n5_end_ruta_superviviente_ancla",
          type: "dialogue",
          text: `Ruta del Superviviente: infiltrarte sin bandera antes de conocer ganador inicial.

RESULTADO: chapter06_ruta_superviviente_ancla | chapter_pending_chapter06`,
          requirement: { type: "flag", flag: "escape_limpio_5", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter06_ruta_superviviente_ancla" }, { type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
        {
          id: "n5_end_vina_documento",
          type: "dialogue",
          text: "Posponer golpe frontal: priorizar encuentro en Viña del Silencio con el rumor del Hermano como guía paralela.",
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "secreto_del_hermano", equals: true },
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    {
                      type: "all",
                      requirements: [
                        { type: "flag", flag: "conocimiento_del_ancla", equals: true },
                        { type: "flag", flag: "aliado_senescal_antiguo", equals: true },
                      ],
                    },
                    { type: "flag", flag: "guerra_abierta_principe", equals: true },
                    { type: "flag", flag: "escape_limpio_5", equals: true },
                  ],
                },
              },
            ],
          },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter06_route_vina_silencio" }, { type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
        {
          id: "n5_end_vina",
          type: "dialogue",
          text: "Ruta paralela plaza: reunión pactada tras alianza con el cordón anarquista — Viña primero.",
          requirement: { type: "flag", flag: "alianza_anarquista", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter06_route_vina_silencio" }, { type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
        {
          id: "n5_end_blood",
          type: "dialogue",
          text: "Ruta vieja urgente por sed o herida antes de cargar símbolos de ancla públicos.",
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
          text: "Ruta del ladronaje ligada a favores contra el Palacio tras el pacto informal con Gato.",
          requirement: { type: "flag", flag: "deuda_con_gato", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter06_route_ladron" }, { type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
        {
          id: "n5_end_default",
          type: "dialogue",
          text: "Capítulo 6 genérico: la crónica abre siguiente hito sin ancla etiquetado todavía en banderas nuevas.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    {
                      type: "all",
                      requirements: [
                        { type: "flag", flag: "conocimiento_del_ancla", equals: true },
                        { type: "flag", flag: "aliado_senescal_antiguo", equals: true },
                      ],
                    },
                    { type: "flag", flag: "guerra_abierta_principe", equals: true },
                    { type: "flag", flag: "escape_limpio_5", equals: true },
                    { type: "flag", flag: "alianza_anarquista", equals: true },
                    { type: "flag", flag: "herida_escape", equals: true },
                    { type: "flag", flag: "chapter05_needs_blood", equals: true },
                    { type: "flag", flag: "deuda_con_gato", equals: true },
                  ],
                },
              },
              {
                type: "not",
                requirement: {
                  type: "all",
                  requirements: [
                    { type: "flag", flag: "secreto_del_hermano", equals: true },
                    {
                      type: "not",
                      requirement: {
                        type: "any",
                        requirements: [
                          {
                            type: "all",
                            requirements: [
                              { type: "flag", flag: "conocimiento_del_ancla", equals: true },
                              { type: "flag", flag: "aliado_senescal_antiguo", equals: true },
                            ],
                          },
                          { type: "flag", flag: "guerra_abierta_principe", equals: true },
                          { type: "flag", flag: "escape_limpio_5", equals: true },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter06" }],
        },
      ],
    },
  ],
};
