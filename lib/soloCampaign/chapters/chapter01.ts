import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter01: SoloChapter = {
  id: "chapter01",
  title: "Santiago en Cenizas · CRÓNICA VENTRUE (V3.1) · CAPÍTULO 1: LA SENDA DE LA SANGRE",
  description:
    "V3.1: bloque 1 — imprenta y centinela (Teatinos); bloque 2 — trayecto al Mapocho, banquete en el puente, cita con Inés y bifurcación al cap. 2.",
  startSceneId: "n1_0",
  scenes: [
    {
      id: "n1_0",
      chapterId: "chapter01",
      title: "[ESCENA 1.0]: EL DESPERTAR EN LA IMPRENTA",
      text: `CONTEXTO: Sótano de una vieja imprenta en calle Teatinos. 02:45 AM. El aire está estancado, pesado por el olor a solventes químicos y el frío de la piedra subterránea.

NARRACIÓN: El despertar no es un proceso, es una ruptura. Tus ojos se abren a una oscuridad absoluta que, tras unos segundos de estática visual, comienza a definirse en tonos de gris ceniza. Te encuentras sobre un palé de madera astillada; el roce de tu traje de seda contra la superficie rústica es una bofetada a tu sensibilidad aristocrática. El aire huele a tinta de periódico seca de hace décadas y a ese rastro metálico punzante que tu nueva naturaleza identifica con una claridad eléctrica: sangre vieja, derramada y fría.`,
      options: [
        {
          id: "n1_0_intro_continue",
          type: "dialogue",
          text: `PASO [IMPRENTA]: Dejar que el cuerpo te diga quién ha vuelto.

PUENTE: Tratas de respirar y no llega oxígeno como antes: el pecho absorbe sólo frío que no llena pulmón, pero igual lo repites una y otra vez en silencio, como quien marca el compás antes de dirigir una sala vacía. Apoyas la palma en el palé, te impulsas a sentarte; los dedos encuentran tinta pegada entre las astillas y papel húmedo de humedad. El sótano deja de ser un manchón gris para volverse detalle por detalle —prensa a la derecha, cajones amontonados, un hilo largo que gotea de un depósito alto— hasta que algo más viejo que el miedo te obliga a sentir primero la quemadura seca detrás del paladar, y después el entrechocar lejano de tus dientes cuando aprietas mandíbula sin quererlo.

CONSECUENCIA: Ya no sólo ves el sótano: lo habitas desde el nuevo costo de tener boca y garganta que arden cuando la memoria intenta encajar con la última cara que juraste recordar antes del negro absoluto.

RESULTADO: IR A [ESCENA 1.0.1]`,
          requirement: { type: "none" },
          nextSceneId: "n1_0_1",
        },
      ],
    },
    {
      id: "n1_0_1",
      chapterId: "chapter01",
      title: "[ESCENA 1.0.1]: EL PESO DEL DESPERTAR",
      text: `En tu garganta persiste un incendio químico, el residuo del frasco que un anciano te entregó en la calle Bandera antes de que el mundo se borrara en un fundido a negro. El caos de este sótano te resulta una ofensa íntima, aunque todavía no puedas nombrar del todo por qué. Un soberano no debería despertar entre prensas oxidadas y moho. El hambre es una aguja que cose tus entrañas, un rugido sordo que exige ser callado, pero tu orgullo exige primero una estructura: ¿quién te ha puesto en esta situación y qué ha sido de tu linaje?`,
      options: [
        {
          id: "n1_0_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Cerrar los ojos y forzar a tu cuerpo a ignorar el hambre para reconstruir tus memorias mediante la voluntad pura.

PUENTE: Te quedas inmóvil, tensando cada fibra de tu ser hasta que tu piel parece mármol. El rugido de la Bestia se vuelve un susurro lejano mientras obligas a los fragmentos de la noche anterior a alinearse con una lógica implacable. El rostro del Príncipe, la firma del contrato en el Palacio Bruna, el frío del acero… todo encaja.

CONSECUENCIA: Recuperas el protocolo de etiqueta de la Corte y el nombre de tu sire. Sabes quién eres en la jerarquía, lo que te otorga una ventaja política inmediata ante cualquier subordinado.

RESULTADO: willpowerDelta: +1 | setFlag: protocolo_corte | IR A [ESCENA 1.1]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n1_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "protocolo_corte" }],
        },
        {
          id: "n1_0_investigacion",
          type: "skill",
          skill: "investigacion",
          text: `OPCIÓN B [HABILIDAD: INVESTIGACIÓN]: Registrar el sótano con frialdad analítica en busca de rastros físicos antes de abandonarlo.

PUENTE: Te incorporas con lentitud calculada. Ignoras el mareo y comienzas a registrar las cajas de cartón y las resmas de papel amarillento con dedos precisos. No buscas una salida, buscas la firma de tu anfitrión. Bajo un fajo de periódicos de 1990, encuentras un pequeño frasco de vidrio oscuro con un sello de lacre rojo intacto.

CONSECUENCIA: El sello muestra una «V» entrelazada con espinas. Reconoces la marca de «La Viña del Silencio», una propiedad vinculada a una familia Ventrue que se rumoreaba extinta.

RESULTADO: setFlag: sello_viña_caida | IR A [ESCENA 1.1]`,
          requirement: { type: "skill", skill: "investigacion", minLevel: 1 },
          nextSceneId: "n1_1",
          effects: [{ type: "setFlag", flag: "sello_viña_caida" }],
        },
        {
          id: "n1_0_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Incorporarte con dignidad y buscar la salida hacia la calle para recuperar el control del territorio.

PUENTE: Te pones en pie, ajustas los puños de tu camisa y te limpias el polvo de la chaqueta con un gesto automático. No importa la inmundicia del lugar; te niegas a ceder el centro de gravedad de la habitación. Subes los peldaños de madera, que crujen bajo tu peso muerto, buscando la salida hacia la calle Teatinos para evaluar la situación desde el asfalto.

CONSECUENCIA: Sales a la superficie con rapidez. No tienes pistas internas, pero tu compostura mental está intacta para enfrentar lo que sea que aguarde en la noche de Santiago.

RESULTADO: (Avance estándar) | IR A [ESCENA 1.1]`,
          requirement: { type: "none" },
          nextSceneId: "n1_1",
        },
        {
          id: "n1_0_instinto",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Ceder al pánico del hambre y salir violentamente hacia la superficie en busca de vida.

PUENTE: El hambre rompe tus diques morales. La elegancia se pierde cuando la Bestia araña el interior de tus costillas. Subes las escaleras a gatas, con una velocidad depredadora, y golpeas la puerta de salida con una fuerza que dobla el marco de metal antes de salir al aire nocturno.

CONSECUENCIA: Estás fuera, pero tus sentidos están embotados por la rabia. Has dejado un rastro de destrucción física que cualquier investigador de la Mascarada notará.

RESULTADO: hungerDelta: +1 | humanityDelta: -1 | setFlag: rastro_fuerza_bruta | IR A [ESCENA 1.1]`,
          requirement: { type: "none" },
          nextSceneId: "n1_1",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "rastro_fuerza_bruta" },
          ],
        },
      ],
    },
    {
      id: "n1_1",
      chapterId: "chapter01",
      title: "[ESCENA 1.1]: EL CENTINELA DE TEATINOS",
      text: `CONTEXTO: Calle Teatinos, afuera de la imprenta. 03:00 AM. El alumbrado público arroja sombras largas sobre el asfalto mojado. El smog de la capital se siente como una manta fría.

NARRACIÓN: El aire de Santiago te golpea. La calle está desierta, sumida en ese silencio artificial que solo existe cerca de los centros de poder. Sin embargo, a pocos metros, oculto tras un contenedor de basura metálico, un hombre andrajoso intenta pasar desapercibido. Finge buscar desperdicios, pero su postura es demasiado alerta; sus hombros están tensos y sus ojos, brillantes de una inteligencia que no es de un indigente, se clavan en ti. Se lleva la mano al bolsillo del pecho, donde se adivina la forma rectangular de un dispositivo de comunicación. Alguien ha estado vigilando el sótano, esperando que el «Rey» despertara.`,
      options: [
        {
          id: "n1_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Atrapar su mirada desde la distancia y ordenarle que camine hacia la luz para ser interrogado.

PUENTE: No dices una palabra. Simplemente fijas tus pupilas en las suyas, proyectando el peso de tu linaje a través del aire frío. El hombre se estremece, sus pupilas se dilatan y, contra toda su voluntad biológica, sus pies empiezan a moverse hacia ti. «Habla», susurras con una voz que anula su raciocinio.

CONSECUENCIA: El hombre confiesa bajo trance que trabaja para un «hombre de traje gris» que le paga por reportar tu salida exacta. Revela que hay otros como él en las calles aledañas.

RESULTADO: hungerDelta: +1 | setFlag: info_traje_gris | IR A [BLOQUE 2 / ESCENA 1.2]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n1_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "info_traje_gris" }],
        },
        {
          id: "n1_1_sigilo_perspicacia",
          type: "dialogue",
          text: `OPCIÓN B [HABILIDAD: SIGILO / PERSPICACIA]: Rodear el contenedor por las sombras para neutralizarlo antes de que dé la alarma.

PUENTE: Te fundes con la oscuridad de los portales de piedra de Teatinos. Te mueves sin hacer ruido, aprovechando el siseo de un camión a lo lejos para cubrir tu avance. Apareces detrás de él justo cuando se disponía a hablar por su radio. Tus dedos se cierran sobre el dispositivo antes de que pueda pulsar el botón.

CONSECUENCIA: Le arrebatas una radio de frecuencia militar encriptada. Tienes la herramienta para escuchar los movimientos de tus perseguidores.

RESULTADO: setFlag: radio_militar | IR A [BLOQUE 2 / ESCENA 1.2]`,
          requirement: {
            type: "any",
            requirements: [
              { type: "skill", skill: "sigilo", minLevel: 1 },
              { type: "skill", skill: "perspicacia", minLevel: 1 },
            ],
          },
          nextSceneId: "n1_2",
          effects: [{ type: "setFlag", flag: "radio_militar" }],
        },
        {
          id: "n1_1_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Confrontarlo directamente con la autoridad diplomática de tu casta.

PUENTE: «¿Para quién trabajas? Elige bien tus próximas palabras; mi paciencia se quedó en ese sótano», dices con una calma que hiela la sangre. El hombre, aterrado por tu porte y el magnetismo antinatural que desprendes, balbucea sobre una «deuda de sangre que debe cobrarse».

CONSECUENCIA: El hombre huye despavorido hacia la Alameda, pero en su huida deja caer una tarjeta de presentación con un borde dorado: «Viña del Silencio · Memoria histórica».

RESULTADO: setFlag: tarjeta_viña | IR A [BLOQUE 2 / ESCENA 1.2]`,
          requirement: { type: "none" },
          nextSceneId: "n1_2",
          effects: [{ type: "setFlag", flag: "tarjeta_viña" }],
        },
        {
          id: "n1_1_violencia",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - VIOLENCIA]: Eliminar al testigo de inmediato para asegurar que nadie reporte tu ubicación.

PUENTE: No vas a arriesgar tu anonimato por un mortal. Te lanzas sobre él con la velocidad de un rayo negro. Tus manos se cierran sobre su garganta; el crujido de sus vértebras es la única respuesta que obtienes. El cuerpo cae sin vida tras el contenedor mientras buscas rastro de información en sus bolsillos.

CONSECUENCIA: Has silenciado el informe, pero has dejado un cadáver en tu punto de origen. La policía y la Camarilla investigarán este desorden.

RESULTADO: humanityDelta: -1 | setFlag: rastro_sangre_teatinos | IR A [BLOQUE 2 / ESCENA 1.2]`,
          requirement: { type: "none" },
          nextSceneId: "n1_2",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "rastro_sangre_teatinos" }],
        },
      ],
    },
    {
      id: "n1_2",
      chapterId: "chapter01",
      title: "[ESCENA 1.2]: EL TRAYECTO HACIA EL RÍO",
      text: `CONTEXTO: Eje calle Teatinos hacia el norte, cruzando la zona de los ministerios y el Mercado Central. 03:15 AM.

NARRACIÓN: Dejas atrás la imprenta, caminando con una determinación que parece más vieja que esta noche. A medida que avanzas hacia el norte, el centro cívico de Santiago se vuelve más sombrío; las luces de vapor de sodio proyectan un tono enfermizo sobre las fachadas de granito. La adrenalina del despertar se disipa, dejando paso a una necesidad física que nunca sentiste como mortal: el Hambre. No es un vacío en el estómago, es una vibración en tus encías y una visión de túnel que transforma el color de los semáforos en el tono del plasma.

Al llegar a las inmediaciones del Mercado Central, el aire se vuelve más húmedo. El río Mapocho exhala un aliento de barro, metal y ciudad. Ves el Puente de los Carros, una estructura de hierro donde las sombras son lo suficientemente largas para ocultar un pecado. Allí, una figura solitaria fuma apoyada en la baranda, ignorando que se ha convertido en el centro del mundo para un depredador que necesita «calidad» para restaurar su linaje.`,
      options: [
        {
          id: "n1_2_auspex_perspicacia",
          type: "dialogue",
          text: `OPCIÓN A [DISCIPLINA: AUSPEX / PERSPICACIA]: Agudizar tus sentidos para evaluar la «pureza» de la sangre y comprobar que el entorno sea discreto.

PUENTE: Te detienes un instante y permites que tus pupilas se dilaten. No solo ves al joven; escuchas el ritmo melancólico de su corazón y el aroma dulce de una sangre que no ha sido contaminada por el estrés del día. Confirmas que no hay cámaras activas ni patrullas de Carabineros en este ángulo del puente.

CONSECUENCIA: La caza será perfecta. El conocimiento del entorno te permite moverte con una confianza absoluta y reduce el riesgo de ruptura de la Mascarada.

RESULTADO: setFlag: presa_perfecta | IR A [ESCENA 1.3]`,
          requirement: {
            type: "any",
            requirements: [
              { type: "discipline", discipline: "auspex", minLevel: 1 },
              { type: "skill", skill: "perspicacia", minLevel: 1 },
            ],
          },
          nextSceneId: "n1_3",
          effects: [{ type: "setFlag", flag: "presa_perfecta" }],
        },
        {
          id: "n1_2_sigilo_acercamiento",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN B [HABILIDAD: SIGILO]: Usar los puestos cerrados del mercado y la penumbra del puente para acercarte por la espalda sin ser detectado.

PUENTE: Te mueves como una exhalación, aprovechando el siseo del agua del río contra los pilares para enmascarar tus pasos. Saltas de sombra en sombra hasta que el calor corporal del joven es perceptible para tu piel gélida. Estás a un segundo de su yugular y él aún no ha soltado el humo de su cigarrillo.

CONSECUENCIA: Llegas a una posición de ataque sin que el joven perciba el cambio en el aire. Tienes el factor sorpresa para un beso fulminante.

RESULTADO: setFlag: aproximacion_invisible | IR A [ESCENA 1.3]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n1_3",
          effects: [{ type: "setFlag", flag: "aproximacion_invisible" }],
        },
        {
          id: "n1_2_estandar_presencia",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Caminar hacia él con paso firme y usar tu presencia social para no levantar sospechas.

PUENTE: No te escondes. Caminas por el centro del puente y ajustas la chaqueta. Pareces un ejecutivo tras una noche demasiado larga en la Bolsa de Comercio. Te detienes a un par de metros, buscando una excusa trivial —un fuego, una dirección— para acortar la distancia final.

CONSECUENCIA: Estableces contacto visual; el joven te lee como un igual en la escala social, lo que permite un acercamiento basado en la confianza antes de la captura.

RESULTADO: (Avance estándar) | IR A [ESCENA 1.3]`,
          requirement: { type: "none" },
          nextSceneId: "n1_3",
        },
        {
          id: "n1_2_instinto_bestia",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes rastro_fuerza_bruta, dejar que la Bestia elija el camino más corto, saltando la baranda del mercado.

PUENTE: El hambre rompe tu paciencia. En lugar de rodear por el paso peatonal, saltas un muro bajo y te deslizas hacia el joven con una velocidad antinatural. No buscas sutileza, buscas carne. El depredador sustituye al embajador.

CONSECUENCIA: El joven te ve llegar y el miedo acelera su corazón; el sabor se amarga con adrenalina. El forcejeo será ruidoso y poco estético.

RESULTADO: hungerDelta: +1 | setFlag: caza_violenta | IR A [ESCENA 1.3]`,
          requirement: { type: "flag", flag: "rastro_fuerza_bruta", equals: true },
          nextSceneId: "n1_3",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "caza_violenta" }],
        },
      ],
    },
    {
      id: "n1_3",
      chapterId: "chapter01",
      title: "[ESCENA 1.3]: EL BANQUETE DEL RÍO",
      text: `CONTEXTO: El Puente de los Carros, sobre el cauce del Mapocho. 03:25 AM.

NARRACIÓN: El joven se gira al notar tu proximidad, pero ya es tarde. El Hambre toma el mando absoluto. Incluso este acto primario de supervivencia se te impone como una lección de dominio. Sus ojos reflejan la luz de la calle y, por un instante, tu propia imagen: un monstruo vestido de gala.`,
      flagAppends: [
        {
          flag: "presa_perfecta",
          text: "Llevas el mapa auditivo del tramo clarificado: nadie debe interrumpir el ritual.",
        },
        {
          flag: "aproximacion_invisible",
          text: "Tu pie todavía no ha crujido en el metal; él respira tranquilo antes del umbral.",
        },
        {
          flag: "caza_violenta",
          text: "El pulso ya martilla bajo mandíbula; la sangre promete volumen pero poco refinamiento.",
        },
      ],
      options: [
        {
          id: "n1_3_presencia",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Envolverlo en fascinación para que el Beso sea una bendición y no un asalto.

PUENTE: «Tranquilo, solo necesito un momento de tu tiempo», susurras con una voz que suena a música antigua. El joven se queda paralizado, atrapado en un éxtasis que nubla su juicio. Se inclina y ofrece el cuello con una sonrisa de ensueño mientras tus colmillos se hunden.

CONSECUENCIA: Te alimentas casi sin resistencia. Él conserva euforia difusa más que memoria nítida del horror; la Mascarada se mantiene razonablemente intacta.

RESULTADO: hungerDelta: -2 | setFlag: beso_limpio | IR A [ESCENA 1.END]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n1_cita_mascara",
          effects: [{ type: "hungerDelta", delta: -2 }, { type: "setFlag", flag: "beso_limpio" }],
        },
        {
          id: "n1_3_fortaleza_o_accion",
          type: "dialogue",
          text: `OPCIÓN B [DISCIPLINA: FORTALEZA / ACCIÓN]: Inmovilizarlo con fuerza que anula cualquier intento de lucha y beber con rapidez.

PUENTE: Tus manos funcionan como grilletes sobre sus hombros. Lo sujetas contra la baranda; tus colmillos desgarran con eficiencia mientras sus pies patalean sobre el vacío del río. Es transacción de poder puro.

CONSECUENCIA: Sacias la sed rápido, pero quedan marcas brutales; él tambalea en shock físico al borde de la inconsciencia.

RESULTADO: hungerDelta: -2 | willpowerDelta: -1 | IR A [ESCENA 1.END]`,
          requirement: {
            type: "any",
            requirements: [
              { type: "discipline", discipline: "fortitude", minLevel: 1 },
              { type: "skill", skill: "refriegas", minLevel: 1 },
            ],
          },
          nextSceneId: "n1_cita_mascara",
          effects: [{ type: "hungerDelta", delta: -2 }, { type: "willpowerDelta", delta: -1 }],
        },
        {
          id: "n1_3_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Usar el engaño para llevarlo al pilar más oscuro antes de alimentarte.

PUENTE: «Me han asaltado hace un momento, ¿podrías ayudarme a ver si tengo una herida aquí?», mientes con maestría. Accede y entra en la sombra del portal del puente. Allí muestras tu verdadera cara y cobras tu diezmo.

CONSECUENCIA: Comes con relativa discreción, pero el regusto metálico de la manipulación contamina el sabor.

RESULTADO: hungerDelta: -2 | IR A [ESCENA 1.END]`,
          requirement: { type: "none" },
          nextSceneId: "n1_cita_mascara",
          effects: [{ type: "hungerDelta", delta: -2 }],
        },
        {
          id: "n1_3_instinto",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Beber hasta que el corazón se detenga y reclamar cada gota.

PUENTE: El primer trago rompe diques morales. No puedes parar. Oyes el último latido contra tu pecho muerto. El cuerpo queda flácil antes de resbalar hacia el agua turbia para borrar la evidencia.

CONSECUENCIA: Recuperas fuerza a costa total; la Bestia festeja un sacrificio humano completo.

RESULTADO: hungerDelta: -3 | humanityDelta: -2 | setFlag: asesino_del_mapocho | IR A [ESCENA 1.END]`,
          requirement: { type: "none" },
          nextSceneId: "n1_cita_mascara",
          effects: [
            { type: "hungerDelta", delta: -3 },
            { type: "humanityDelta", delta: -2 },
            { type: "setFlag", flag: "asesino_del_mapocho" },
          ],
        },
      ],
    },
    {
      id: "n1_cita_mascara",
      chapterId: "chapter01",
      title: "[ESCENA 1.END]: LA CITA CON LA MÁSCARA",
      text: `CONTEXTO: La salida del puente hacia la calle Balmaceda. 03:40 AM.

NARRACIÓN: Te limpias la comisura de los labios con un pañuelo de seda blanco que ahora luce una mancha carmesí. El mundo ya no es borroso; es nítido, vibrante y peligrosamente real. Al final del puente, bajo un farol que arroja luz amarillenta y temblorosa, una mujer de elegancia anacrónica te observa con los brazos cruzados. Es Doña Inés. Su mirada no juzga tu comida con asco público; exhibe una impaciencia aristocrática.

«Has demostrado que puedes sobrevivir en la calle, Embajador», dice con voz que corta el aire como un bisturí. «Pero sobrevivir es el talento de las ratas. El Príncipe requiere a alguien que sepa gobernar. El Palacio Bruna espera tu informe sobre el incidente de la imprenta. No lo hagas esperar más».

Antes de girar hacia Merced, se ajusta el guante: asoma un anillo de oro macizo con el blasón en relieve, el mismo diseño que estampa lacre en papeles mayores. No lo nombra; no hace falta: en Bruna eso es el anillo de sello del soberano, la mano que autoriza cuando la voz llega tarde.`,
      contextVariantByState: [
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "rastro_sangre_teatinos", equals: true },
              { type: "flag", flag: "rastro_fuerza_bruta", equals: true },
            ],
          },
          text: "Sus ojos endurecen el protocolo hasta filo: llevas pegado el olor de calle sangrienta sin red, y ella ya no oculta el desprecio.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "beso_limpio", equals: true },
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "rastro_sangre_teatinos", equals: true },
                    { type: "flag", flag: "rastro_fuerza_bruta", equals: true },
                  ],
                },
              },
            ],
          },
          text: "Aún con la prisa tirante, te concede el roce mínimo de cortesía diplomática antes de que el protocolo convierta el saludo en deber.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "info_traje_gris", equals: true },
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "rastro_sangre_teatinos", equals: true },
                    { type: "flag", flag: "rastro_fuerza_bruta", equals: true },
                  ],
                },
              },
            ],
          },
          text: "En la punta del idioma todavía pesa Teatinos: bastaría articular ese nombre entre dientes para que la sonrisa de la Corte se agriete antes de llegar al palacio.",
        },
      ],
      options: [
        {
          id: "n1_cita_paria",
          type: "dialogue",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "rastro_fuerza_bruta" },
              { type: "flag", flag: "rastro_sangre_teatinos" },
            ],
          },
          text: `Inés te mira con desprecio. "Eres un animal descuidado".

RESULTADO: IR A [CAPÍTULO 2: RUTA DEL PARIA]`,
          nextSceneId: "n1_end",
          effects: [
            { type: "addStateTag", tag: "ruta_cap2_paria" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
            { type: "setRoute", route: "w" },
          ],
        },
        {
          id: "n1_cita_embajador",
          type: "dialogue",
          requirement: {
            type: "all",
            requirements: [
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "rastro_fuerza_bruta" },
                    { type: "flag", flag: "rastro_sangre_teatinos" },
                  ],
                },
              },
              { type: "flag", flag: "beso_limpio" },
            ],
          },
          text: `Inés te trata con cortesía diplomática.

RESULTADO: IR A [CAPÍTULO 2: RUTA DEL EMBAJADOR]`,
          nextSceneId: "n1_end",
          effects: [
            { type: "addStateTag", tag: "ruta_cap2_embajador" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
            { type: "setRoute", route: "main" },
          ],
        },
        {
          id: "n1_cita_intriga",
          type: "dialogue",
          requirement: {
            type: "all",
            requirements: [
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "rastro_fuerza_bruta" },
                    { type: "flag", flag: "rastro_sangre_teatinos" },
                  ],
                },
              },
              { type: "flag", flag: "info_traje_gris" },
              { type: "flag", flag: "beso_limpio", equals: false },
            ],
          },
          text: `Tienes margen para cuestionar la lealtad del Príncipe respecto al hombre de traje gris.

RESULTADO: IR A [CAPÍTULO 2: RUTA DE LA INTRIGA]`,
          nextSceneId: "n1_end",
          effects: [
            { type: "addStateTag", tag: "ruta_cap2_intriga" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
            { type: "setRoute", route: "q" },
          ],
        },
        {
          id: "n1_cita_neutral",
          type: "dialogue",
          requirement: {
            type: "all",
            requirements: [
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "rastro_fuerza_bruta" },
                    { type: "flag", flag: "rastro_sangre_teatinos" },
                  ],
                },
              },
              { type: "flag", flag: "beso_limpio", equals: false },
              { type: "flag", flag: "info_traje_gris", equals: false },
            ],
          },
          text: `Sigues a Inés hacia el Palacio Bruna; el tono es frío, sin la etiqueta del embajador ni la confrontación del paria.

RESULTADO: IR A [CAPÍTULO 2]`,
          nextSceneId: "n1_end",
          effects: [
            { type: "addStateTag", tag: "ruta_cap2_neutral" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
            { type: "setRoute", route: "main" },
          ],
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
          text: "Continuar al Capítulo 2.",
          requirement: { type: "none" },
          nextSceneId: "n1_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter02" }],
        },
      ],
    },
  ],
};
