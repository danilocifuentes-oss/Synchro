import type { SoloChapter } from "@/lib/soloCampaign/types";

const reqPerfilVolatileBruna = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "reputacion_animal", equals: true },
    { type: "flag" as const, flag: "perfil_peligroso", equals: true },
  ],
};

const reqSinVolatileBruna = { type: "not" as const, requirement: reqPerfilVolatileBruna };

const reqCallejeo1 = { type: "skill" as const, skill: "callejeo", minLevel: 1 };
const reqConducir1 = { type: "skill" as const, skill: "conducir", minLevel: 1 };
const reqNotCallejeo1 = { type: "not" as const, requirement: reqCallejeo1 };
const reqNotConducir1 = { type: "not" as const, requirement: reqConducir1 };

/** Pie estable: sin radio de Inés (agente, o sin respeto del Príncipe). */
const reqStableFootStd = {
  type: "all" as const,
  requirements: [
    reqSinVolatileBruna,
    {
      type: "any" as const,
      requirements: [
        { type: "flag" as const, flag: "agente_oficial", equals: true },
        { type: "flag" as const, flag: "respeto_principe", equals: false },
      ],
    },
  ],
};

/** Pie estable con intercomunicador: respeto sin logística de agente. */
const reqStableFootRadio = {
  type: "all" as const,
  requirements: [
    reqSinVolatileBruna,
    { type: "flag" as const, flag: "respeto_principe", equals: true },
    { type: "flag" as const, flag: "agente_oficial", equals: false },
  ],
};

export const chapter02: SoloChapter = {
  id: "chapter02",
  title:
    "Santiago en Cenizas · CRÓNICA VENTRUE (V3.1) · CAPÍTULO 2: LA CORTE DE LOS ESPEJOS ROTOS (BLOQUE 2/2)",
  description:
    "Salón Dorado y encargo de Mapocho; salida física por el Parque Forestal y el eje del río hacia la Estación Mapocho (sin teletransporte).",
  startSceneId: "n2_0",
  scenes: [
    {
      id: "n2_0",
      chapterId: "chapter02",
      title: "[ESCENA 2.0]: EL TRAYECTO AL PALACIO",
      text: `CONTEXTO: Calle Merced, Barrio Lastarria. 03:50 AM. Te desplazas desde el río hacia el Parque Forestal.

NARRACIÓN: El trayecto con Doña Inés es un ejercicio de silencio absoluto. Caminan por las calles empedradas de Lastarria, donde los edificios de estilo europeo parecen observar tu paso con elegancia indiferente. A medida que se acercan al Palacio Bruna, el aire cambia: la humedad del río es sustituida por el aroma a madera encerada y el ozono de los sistemas de seguridad de alta tecnología.

Al llegar a la esquina de Merced con Estados Unidos, el Palacio Bruna se alza como un bastión neoclásico, rodeado de una verja de hierro forjado que parece diseñada tanto para proteger como para encarcelar.`,
      flagAppends: [
        {
          flag: "beso_limpio",
          text: "Caminas con paso firme, sintiendo la sangre nutriendo tu compostura.",
        },
        {
          flag: "caza_violenta",
          text: "Inés mantiene una distancia prudente, como si caminara con un animal que aún no ha terminado de domar.",
        },
      ],
      options: [
        {
          id: "n2_0_presencia",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Proyectar un aura de autoridad absoluta para que los guardias de la verja retrocedan por instinto.

PUENTE: Te adelantas un paso a Inés antes de llegar a la puerta. No esperas a ser anunciado; dejas que tu presencia, cargada del peso de tu linaje, golpee a los centinelas de la Torre. Ellos, vástagos de bajo rango, sienten un vacío en el estómago y bajan la vista, abriendo el paso de inmediato.

CONSECUENCIA: Entras al recinto no como un invitado, sino como un dueño. Inés anota tu demostración de poder en su evaluación mental.

RESULTADO: willpowerDelta: +1 | setFlag: entrada_soberana | IR A [ESCENA 2.1]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "entrada_soberana" }],
        },
        {
          id: "n2_0_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: Observar el despliegue de seguridad para identificar las facciones presentes.

PUENTE: Mientras caminas, escaneas los balcones y las sombras del jardín. Notas que, además de los guardias de la Camarilla, hay hombres de traje moderno con audífonos militares: seguridad privada mortal. Comprendes que el Príncipe no confía solo en sus hermanos de sangre.

CONSECUENCIA: Detectas una vulnerabilidad en el flanco oeste del palacio. Esta información será útil si alguna vez necesitas salir sin permiso.

RESULTADO: setFlag: vulnerabilidad_bruna_detectada | IR A [ESCENA 2.1]`,
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "vulnerabilidad_bruna_detectada" }],
        },
        {
          id: "n2_0_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ETIQUETA]: Mantener el protocolo de invitado y dejar que Inés valide tu acceso.

PUENTE: Te detienes frente a la verja, permitiendo que Inés muestre un anillo con el sello del Príncipe. Mantienes una postura impecable, las manos tras la espalda, demostrando que conoces tu lugar en la jerarquía y que no eres un peligro para la paz de la Corte.

CONSECUENCIA: Te clasifican como un «sujeto estable». Ganas la confianza inicial de los ghouls de seguridad.

RESULTADO: setFlag: etiqueta_validada | IR A [ESCENA 2.1]`,
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "etiqueta_validada" }],
        },
        {
          id: "n2_0_estandar",
          type: "dialogue",
          text: `OPCIÓN C — sin etiqueta entrenada: Detenerte en la verja y dejar que Inés abra el protocolo mientras tú mantienes compostura mínima.

PUENTE: No exhibes virtuosismo de salón, pero tampoco provocas al personal. Quieres pasar sin humillar a nadie ni humillarte.

CONSECUENCIA: Entrada aceptada sin la etiqueta fina de la opción previa; sin bandera extra de confianza ghoul.

RESULTADO: (Avance estándar) | IR A [ESCENA 2.1]`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "not",
            requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          },
          nextSceneId: "n2_1",
        },
        {
          id: "n2_0_insolencia",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes rastro_fuerza_bruta, mostrarte insolente ante la seguridad para medir su reacción.

PUENTE: Al pasar por el detector de metales, golpeas la mesa de los guardias con desdén. «¿Realmente creen que estos juguetes pueden detener lo que llevo en la sangre?», preguntas con una sonrisa que muestra apenas un destello de colmillo.

CONSECUENCIA: Provocas una tensión inmediata. Los guardias anotan tu perfil como «volátil» y la seguridad se duplica durante tu audiencia.

RESULTADO: humanityDelta: -1 | setFlag: perfil_peligroso | IR A [ESCENA 2.1]`,
          requirement: { type: "flag", flag: "rastro_fuerza_bruta", equals: true },
          nextSceneId: "n2_1",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "perfil_peligroso" }],
        },
        {
          id: "n2_0_famenatural",
          type: "dialogue",
          text: `OPCIÓN E [RIESGO - INSTINTO]: Si tu primera caza fue un arrebato salvaje, llegar a la verja con el rastro del depredador aún en los ojos.

PUENTE: No finges compostura de salón: mantienes el paso firme y la mirada demasiado quieta. Los ghouls de entrada intercambian una seña; no les cabe duda de que eres «animal» hasta que Inés apriete el protocolo.

CONSECUENCIA: La Torre te cataloga como perfil volátil por hambre recién domada, no por insolencia declamada.

RESULTADO: setFlag: reputacion_animal | IR A [ESCENA 2.1]`,
          requirement: { type: "flag", flag: "caza_violenta", equals: true },
          visibilityRequirement: { type: "not", requirement: { type: "flag", flag: "rastro_fuerza_bruta", equals: true } },
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "reputacion_animal" }],
        },
      ],
    },
    {
      id: "n2_1",
      chapterId: "chapter02",
      title: "[ESCENA 2.1]: EL VESTÍBULO DE LOS ESPEJOS",
      text: `CONTEXTO: Interior del Palacio Bruna. El gran vestíbulo de entrada, rodeado de espejos dorados y escalinatas de mármol.

NARRACIÓN: Al cruzar el umbral, el mundo exterior desaparece. El ruido de Santiago es sustituido por el tic-tac de un reloj de pie y el murmullo lejano de música clásica. Los espejos de las paredes reflejan tu imagen, pero hay algo extraño: la iluminación está diseñada para que tu palidez no parezca una enfermedad, sino un atributo de nobleza.

Inés se detiene frente a un espejo de cuerpo entero para ajustar su pañuelo. «El Príncipe está en el Salón Dorado», dice sin mirarte. «Recuerda: aquí las paredes escuchan y los espejos guardan lo que reflejan. No mientas, a menos que tu mentira sea más bella que la verdad».`,
      options: [
        {
          id: "n2_1_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Auspex",
          text: `OPCIÓN A [DISCIPLINA: AUSPEX]: Agudizar tus oídos para captar las conversaciones de las habitaciones contiguas.

PUENTE: Cierras los ojos un segundo. El murmullo se vuelve nítido. Escuchas a dos vástagos en el comedor discutiendo sobre «la caída de la presión en la Estación Mapocho» y «el error del Traje Gris».

CONSECUENCIA: Obtienes información preliminar sobre la misión antes de que el Príncipe te hable. Tienes ventaja en el diálogo posterior.

RESULTADO: setFlag: oido_conversacion_mapocho | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [{ type: "setFlag", flag: "oido_conversacion_mapocho" }],
        },
        {
          id: "n2_1_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: `OPCIÓN B [HABILIDAD: ETIQUETA]: Analizar los retratos de las paredes para entender el linaje de la Corte actual.

PUENTE: Observas las pinturas. Reconoces a antiguos gobernantes de la época colonial mezclados con figuras modernas. Notas un espacio vacío en la pared principal, donde el cuadro parece haber sido removido recientemente.

CONSECUENCIA: Deduces que ha habido una purga reciente en la Corte. El Príncipe está paranoico.

RESULTADO: setFlag: sospecha_purga_interna | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [{ type: "setFlag", flag: "sospecha_purga_interna" }],
        },
        {
          id: "n2_1_dialogo",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Preguntar a Inés sobre el temperamento actual del Príncipe.

PUENTE: «¿Está de humor para resultados o para excusas, Inés?», preguntas con frialdad. Ella se gira y te mira fijamente: «Está de humor para lealtad, algo que escasea tanto como la sangre pura en estos días».

CONSECUENCIA: Inés te da una pista sobre cómo comportarte: la sumisión es mejor que la brillantez esta noche.

RESULTADO: (Avance estándar) | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n2_2",
        },
        {
          id: "n2_1_mancha",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes asesino_del_mapocho, limpiar una mancha de sangre residual frente a ella.

PUENTE: Notas una gota roja en tu puño que el pañuelo no alcanzó a quitar. La limpias lentamente mientras la miras a través del espejo, sin ocultar tu satisfacción. El mensaje es claro: eres eficiente, pero letal.

CONSECUENCIA: Inés siente una punzada de duda. Eres un arma que podría cortarle la mano a quien la empuñe.

RESULTADO: willpowerDelta: -1 | setFlag: advertencia_a_ines | IR A [BLOQUE 2]`,
          requirement: { type: "flag", flag: "asesino_del_mapocho", equals: true },
          nextSceneId: "n2_2",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "advertencia_a_ines" }],
        },
      ],
    },
    {
      id: "n2_2",
      chapterId: "chapter02",
      title: "[ESCENA 2.2]: EL SALÓN DORADO",
      text: `CONTEXTO: Gran salón de audiencias. Ventanales que dan al Parque Forestal. El Príncipe de Santiago está de pie junto a un piano de cola.

NARRACIÓN: Las puertas se abren con un suspiro de madera pesada. El Príncipe no te recibe en un trono; está de espaldas, observando las luces de la ciudad que titilan más allá del follaje del parque. La presión en la habitación es tal que parece que el oxígeno ha sido succionado. Es la majestad de un antiguo Ventrue.

«Santiago es un organismo que requiere equilibrio», dice sin girarse. «Pero algo está pudriendo sus cimientos. Hay un nexo de infección en la Estación Mapocho que amenaza con romper la Mascarada y contaminar nuestra sangre. Tú irás allí. Encontrarás el origen de la Hiel y lo erradicarás». Sobre una mesa de mármol, descansa un sobre lacrado y una daga de plata grabada con runas.`,
      options: [
        {
          id: "n2_2_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Sostener la mirada del Príncipe cuando se gire, midiendo tu voluntad contra la suya.

PUENTE: El Príncipe se vuelve; sus ojos son pozos de autoridad. No bajas la vista. El aire vibra en un duelo silencioso que se estira en segundos que parecen horas. Finalmente asiente levemente. «Tienes la espina dorsal que le falta a mis otros peones. No me falles».

CONSECUENCIA: Ganas un respeto peligroso. El Príncipe te ve como activo de alto nivel y, a la vez, como posible amenaza a largo plazo.

RESULTADO: willpowerDelta: +1 | setFlag: respeto_principe | IR A [ESCENA 2.3]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n2_3",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "respeto_principe" }],
        },
        {
          id: "n2_2_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: Analizar el sobre y la daga antes de aceptarlos para detectar segundas intenciones.

PUENTE: Te acercas a la mesa con parsimonia. El lacre del sobre delata una mancha mínima de aceite púrpura. La infección ya ha rozado el Palacio, o el soberano ha tocado el contagio con las manos antes de enviarte.

CONSECUENCIA: Ventaja informativa; la misión huele a encubrimiento además de saneamiento.

RESULTADO: setFlag: sospecha_principe | IR A [ESCENA 2.3]`,
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n2_3",
          effects: [{ type: "setFlag", flag: "sospecha_principe" }],
        },
        {
          id: "n2_2_dialogo_oficial",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Aceptar el encargo con promesa de eficiencia y lealtad.

PUENTE: «Vuestro deseo es el orden de esta ciudad. Consideradlo hecho», respondes con la elegancia de tu casta. Tomas sobre y daga; el frío de la plata se graba en palma.

CONSECUENCIA: Quedas registrado como agente formal de la Corte con logística inmediata tras acuerdo.

RESULTADO: setFlag: agente_oficial | IR A [ESCENA 2.3]`,
          requirement: { type: "none" },
          nextSceneId: "n2_3",
          effects: [{ type: "setFlag", flag: "agente_oficial" }, { type: "setFlag", flag: "embajador_corte" }],
        },
        {
          id: "n2_2_traje_gris",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes info_traje_gris, mencionar al vigilante de Teatinos para desestabilizarlo.

PUENTE: «Un hombre de traje gris me dio la bienvenida antes que vuestra mano derecha, Príncipe. ¿Debo asumir que él también habla en vuestro nombre?», preguntas con un tono de sospecha que roza la insolencia.

CONSECUENCIA: El Príncipe palidece y las luces del salón parpadean. Te das cuenta de que el «Sastre» es una presencia que el Príncipe no controla.

RESULTADO: willpowerDelta: -1 | setFlag: secreto_del_sastre | IR A [ESCENA 2.3]`,
          requirement: {
            type: "all",
            requirements: [{ type: "flag", flag: "info_traje_gris", equals: true }],
          },
          nextSceneId: "n2_3",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "secreto_del_sastre" }],
        },
      ],
    },
    {
      id: "n2_3",
      chapterId: "chapter02",
      title: "[ESCENA 2.3]: LA SALIDA AL PARQUE FORESTAL",
      text: `CONTEXTO: Jardines traseros del Palacio Bruna. 04:15 AM.

NARRACIÓN: Sales del salón con el sobre en el bolsillo. Inés te guía por un pasillo lateral que desemboca en el jardín trasero; el golpe del aire frío del Parque Forestal viene de frente con olor a humedad y tierra pisada.

El trayecto a la Estación Mapocho atraviesa el parque y luego sigue el eje del río hacia poniente.

Si la Corte te registró como agente oficial, te entrega las llaves de un sedán oscuro («llévalo hasta el cordón urbano frente al centro cultural; después te las cobro»). Si no, marca con el dedo una senda entre los árboles y te recuerda el encargo verbal del Príncipe.

«Ten cuidado en el trayecto», dice. «Entre aquí y la estación hay quien okupa portales y hay sombras que no responden a la Torre. Si ves el agua del Mapocho con brillo violeta, no la toques». Replica el nombre de «El Choro» y los niveles bajo tierra antes de perderte entre los setos.`,
      options: [
        {
          id: "n2_3_parque_volatile_callejeo",
          type: "skill",
          skill: "callejeo",
          text: `OPCIÓN A [HABILIDAD: CALLEJEO — SALIDA CASTIGADA]: Internarte en las sendas del parque pese al perfil que te ha cerrado la Corte en Bruna.

PUENTE: Los plátanos orientales absorben tus pasos. Cruzas rozando los museos, donde sintecho descolgados y ghouls hambrientos hacen de centinelas improvisados. Nadie grita —pero sí te siguen hasta el cordón antes de perderte tras la Alameda—.

CONSECUENCIA: Llegada rápida al entorno Mapocho bajo vigilancia urbana brutal; nadie blindó tu espalda para la vuelta.

RESULTADO: setFlag: ruta_parque_interior | setFlag: cap3_salida_a_pie | setFlag: mision_castigo | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [reqPerfilVolatileBruna, reqCallejeo1],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "ruta_parque_interior" },
            { type: "setFlag", flag: "cap3_salida_a_pie" },
            { type: "setFlag", flag: "mision_castigo" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_parque_volatile_basico",
          type: "dialogue",
          text: `OPCIÓN A [RIESGO · CAMINO CASTIGADO]: Cruzar los jardines hacia los senderos públicos sin oficio corto suficiente, contando sólo con el mapa verbal de Inés.

PUENTE: Te lanzas igual hacia los callejones verdes pero sin el instinto corto para evitar zonas densas frente al Bellas Artes y el centro cultural. Una patrulla y un grupo improvisado miden tu silueta antes de verte encaminar entre humo de fin de noches cerradas —te dejan rodar porque no eres objetivo público esta hora… todavía.

CONSECUENCIA: Sangre contenida pero pie forzado: Bruna registró quién eras al salir como quien tropieza antes de llegar como quien ejecuta órdenes.

RESULTADO: setFlag: ruta_parque_interior | setFlag: cap3_salida_a_pie | setFlag: mision_castigo | IR A [2.E · Cierre]`,
          requirement: reqPerfilVolatileBruna,
          visibilityRequirement: reqNotCallejeo1,
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "ruta_parque_interior" },
            { type: "setFlag", flag: "cap3_salida_a_pie" },
            { type: "setFlag", flag: "mision_castigo" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_parque_estable_radio",
          type: "skill",
          skill: "callejeo",
          text: `OPCIÓN A [HABILIDAD: CALLEJEO — RESPETO DEL PRÍNCIP]: Usar senderos ocultos bajo cobertura nocturna y mantener abierto el canal con Inés cuando el territorio empiece a oler fatal.

PUENTE: La sombra de los plátanos te salva tres cruces ante el reflejo de sirenas pegadas a la vereda norte de la Alameda. En la penumbra, un intercomunicador cifrado vibra tibio antes de llegar al río; una voz seca murmura un código de cortesía y te recuerda no detenerte junto al agua.

CONSECUENCIA: Ritmo rápido y red de soporte táctico —pero tus pasos igual dejan marca en quien estudia rutas paralelas.

RESULTADO: setFlag: ruta_parque_interior | setFlag: cap3_radio_ines | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [reqStableFootRadio, reqCallejeo1],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "ruta_parque_interior" },
            { type: "setFlag", flag: "cap3_radio_ines" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_parque_estable_std_callejeo",
          type: "skill",
          skill: "callejeo",
          text: `OPCIÓN A [HABILIDAD: CALLEJEO]: Atravesar el Parque Forestal por dentro para esquivar coches-policias cerrando la línea norte de Lastarria hacia Santa Rosa.

PUENTE: Memorizaste esquinas donde las sombras de los árboles se tragan farolas; cruzas el área museos sintiendo párpados vigilantes tras los portones. Una escaramuza amortiguada contra sintecho endurece tu mandíbula antes de aparecer ante el rumor del río aceitoso.

CONSECUENCIA: Llegaste sin logística militar visible; los centinelas de la ciudad notaron moverse algo… pero jamás ubicaron marca de Bruna hasta el último segundo.

RESULTADO: setFlag: ruta_parque_interior | setFlag: cap3_salida_estandar | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [reqStableFootStd, reqCallejeo1],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "ruta_parque_interior" },
            { type: "setFlag", flag: "cap3_salida_estandar" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_parque_estable_radio_incauto",
          type: "dialogue",
          text: `OPCIÓN A [RIESGO · PARQUE INCÓLUME CON RADIO DE INÉS]: Filar el mismo recorrido lento que quien lleva alas sin doblar bien —pero tienes auricular cifrado y el tiempo justo antes de llegar ribera abajo.

PUENTE: Te metes entre parterres y escaleras improvisadas oyendo chirridos de sirenas amortiguadas. Te encorvas bajo laureles y subes ante el Mapocho con polvo en gabardinas; pulsas canal de Inés: «No me arrastres violeta antes de estar en la explanada».

CONSECUENCIA: Ritmo menor que el verdadero especialista pero contacto fresco con la Cortesía en caliente.

RESULTADO: setFlag: ruta_parque_interior | setFlag: cap3_radio_ines | IR A [2.E · Cierre]`,
          requirement: reqStableFootRadio,
          visibilityRequirement: reqNotCallejeo1,
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "ruta_parque_interior" },
            { type: "setFlag", flag: "cap3_radio_ines" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_parque_estable_std_incauto",
          type: "dialogue",
          text: `OPCIÓN A [RIESGO · PARQUE ABIERTO]: Atravesar el parque de frente porque no llevas suficientes puntos urbanos pero Bruna necesita ejecutar igual.

PUENTE: Las sendas públicas exponen tus hombros; cruzas jardín y vereda norte de museos sintiendo párpados y olor a marihuana sintética. El río apesta más cerca porque la depresión urbana también es mapa.

CONSECUENCIA: Sobreviven pies y reputación porque la Orden cuenta contigo llegando —pero tus pasos están contados igual que los de otros peones antes.

RESULTADO: setFlag: ruta_parque_interior | setFlag: cap3_salida_estandar | IR A [2.E · Cierre]`,
          requirement: reqStableFootStd,
          visibilityRequirement: reqNotCallejeo1,
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "ruta_parque_interior" },
            { type: "setFlag", flag: "cap3_salida_estandar" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_costanera_conducir",
          type: "skill",
          skill: "conducir",
          text: `OPCIÓN B [HABILIDAD: CONDUCIR]: Tomar Costanera Norte con el blindado porque la Corte abrió techo institucional y quieres no perder equipo.

PUENTE: El sedán rasga últimas sombras Lastarria; subes contra el flujo antes de paralelismo río donde reflejos aceitosos muestran anuncios fantasmas tras agua violeta apenas latente antes del amanecer.

CONSECUENCIA: Ritmo rápido y equipo extra físico cargado dentro del espacio secreto tras asiento —tu llegada anunció presencia porque motores institucionales no son fantasmas bien hechos.

RESULTADO: setFlag: llegada_vehiculo_corte | setFlag: cap3_sedan_blindado | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "agente_oficial", equals: true },
              reqSinVolatileBruna,
              reqConducir1,
            ],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "llegada_vehiculo_corte" },
            { type: "setFlag", flag: "cap3_sedan_blindado" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_costanera_basico",
          type: "dialogue",
          text: `OPCIÓN B [ACCIÓN — CONDUCIR A OJO]: Pisar igual la Costanera con el sedán oficial aun cuando la ficha marca pocos puntos técnicos: el orden de Santiago no perdona llegar tarde antes que mal.

PUENTE: El volante rechina y el mapa digital de dashboard no coopera igual que tus instintos. Aun así paralelas el cordón norte del Mapocho con faros amortiguados: el violeta apenas roza tus retinas como amenaza contenida dentro del cauce.

CONSECUENCIA: Ritmo menor que verdadero especialista institucional —pero logística igual cierra ciclo porque Bruna marcó ese coche esperando tus llaves después.

RESULTADO: setFlag: llegada_vehiculo_corte | setFlag: cap3_sedan_blindado | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "agente_oficial", equals: true },
              reqSinVolatileBruna,
            ],
          },
          visibilityRequirement: reqNotConducir1,
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "llegada_vehiculo_corte" },
            { type: "setFlag", flag: "cap3_sedan_blindado" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_ribera_volatile",
          type: "dialogue",
          text: `OPCIÓN C [RIESGO - INSTINTO]: Si oíste en Bruna algo sobre Mapocho y la Hiel, detenerte un instante ante la ribera antes de colarte en la estación —incluso con la salida relegada que te marcó la Corte.

PUENTE: Te apoyas en la baranda de cemento junto al acceso lateral. El cauce trae sedimentos que forman vetas violetas; no parece sólo contaminación industrial, es orgánico y casi parece latir.

CONSECUENCIA: Observación inicial confirma infección mística contenida dentro de agua pública antes de tragarte sombras dentro del Nido mismo.

RESULTADO: willpowerDelta: +1 | setFlag: observacion_previa_hiel | setFlag: cap3_salida_a_pie | setFlag: mision_castigo | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [
              reqPerfilVolatileBruna,
              { type: "flag", flag: "oido_conversacion_mapocho", equals: true },
            ],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "observacion_previa_hiel" },
            { type: "setFlag", flag: "cap3_salida_a_pie" },
            { type: "setFlag", flag: "mision_castigo" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_ribera_estable_radio",
          type: "dialogue",
          text: `OPCIÓN C [RIESGO - INSTINTO]: Si arrastras lo que oíste en Bruna sobre Mapocho, desviarte un momento hacia la ribera antes de entrar por la lateral.

PUENTE: El agua refleja las luces con un brillo aceitoso y, bajo esa capa, vetas violetas siguen la corriente como si fueran filamentos vivos.

CONSECUENCIA: Ves la magnitud del problema antes de bajar al nido subterráneo; la certeza te afila la atención cuando toque leer superficies contaminadas después.

RESULTADO: willpowerDelta: +1 | setFlag: observacion_previa_hiel | setFlag: cap3_radio_ines | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [
              reqStableFootRadio,
              { type: "flag", flag: "oido_conversacion_mapocho", equals: true },
            ],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "observacion_previa_hiel" },
            { type: "setFlag", flag: "cap3_radio_ines" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_3_ribera_estable_std",
          type: "dialogue",
          text: `OPCIÓN C [RIESGO - INSTINTO]: Si ya tenías información sobre Mapocho desde Bruna, pausarte en la ribera antes de cruzar el perímetro abierto del centro cultural.

PUENTE: El frío del cemento te sube por las muñecas y el rumor del agua lleva ese tono violeta que Inés prohibió rozar con la punta del zapato.

CONSECUENCIA: Llegas a la explanada convencido de que lo que espera dentro no es un simple incidente ciudadano.

RESULTADO: willpowerDelta: +1 | setFlag: observacion_previa_hiel | setFlag: cap3_salida_estandar | IR A [2.E · Cierre]`,
          requirement: {
            type: "all",
            requirements: [
              reqStableFootStd,
              { type: "flag", flag: "oido_conversacion_mapocho", equals: true },
            ],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "observacion_previa_hiel" },
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
      text: `Pasaste del salón dorado al aire abierto del parque y al rumor del Mapocho. La Cortina del palacio ya quedó atrás frente al esqueleto de hierro que es Mapocho. La Corte ya decidió cómo te va a usar; te toca atravesar el nido.`,
      options: [
        {
          id: "n2_end_continue",
          type: "dialogue",
          text: "Continuar al Capítulo 3.",
          requirement: { type: "none" },
          nextSceneId: "n2_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter03" }],
        },
      ],
    },
  ],
};
