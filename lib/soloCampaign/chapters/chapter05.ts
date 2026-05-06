import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Conocimiento místico del núcleo (Tratado / Ancla) — rutas nueva y legada cap. 5. */
const reqLoreAnclaOPrimogenito = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "conocimiento_del_ancla", equals: true },
    { type: "flag" as const, flag: "secreto_del_primogenito", equals: true },
  ],
};

/** Aliado institucional o tercera facción (Traje Gris). */
const reqAliadoInstitucionalOSastre = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "aliado_senescal_antiguo", equals: true },
    { type: "flag" as const, flag: "rastro_del_sastre_identificado", equals: true },
  ],
};

const reqRefugioLastarriaUrbano = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "coordenada_lastarria", equals: true },
    { type: "flag" as const, flag: "chapter05_route_nodo_catedral", equals: true },
    { type: "flag" as const, flag: "escape_subterraneo", equals: true },
    { type: "flag" as const, flag: "chapter05_route_renegado_biblioteca", equals: true },
    { type: "flag" as const, flag: "chapter05_route_refugio_ceniza", equals: true },
    { type: "flag" as const, flag: "alerta_biblioteca_activa", equals: true },
  ],
};

/** Acercamiento encubierto desde cap. 5.interludio — compatible con ruta Superviviente en plaza. */
const reqSigiloPlazaOClean = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "aproximacion_sigilosa_plaza", equals: true },
    { type: "flag" as const, flag: "escape_limpio_5", equals: true },
  ],
};

const reqTierraBuinViña = {
  type: "all" as const,
  requirements: [
    {
      type: "any" as const,
      requirements: [
        { type: "flag" as const, flag: "escape_por_fuerza", equals: true },
        { type: "flag" as const, flag: "chapter05_route_huida_periferia", equals: true },
        { type: "flag" as const, flag: "secreto_del_hermano", equals: true },
      ],
    },
    { type: "not" as const, requirement: reqRefugioLastarriaUrbano },
  ],
};

export const chapter05: SoloChapter = {
  id: "chapter05",
  title: "Santiago en Cenizas · CAPÍTULO 5: SANGRE Y TIERRA",
  description:
    "Letargo, sobre negro del Traje Gris, interludio urbano ante la plaza y Horizonte de piedra que cierra Acto II hacia la Catedral-ancla.",
  startSceneId: "n5_0",
  scenes: [
    {
      id: "n5_0",
      chapterId: "chapter05",
      title: "[ESCENA 5.0]: EL ABRAZO DEL LETARGO",
      text: `CONTEXTO: El refugio elegido —piso franco en Lastarria o bodega en la Viña del Silencio—. 06:45 de la mañana. Quedan minutos antes de que el sol reclame Santiago.

NARRACIÓN: El mundo se vuelve blanco. No por nieve, sino por la intensidad de la luz que empieza a filtrarse por las rendijas. Tu cuerpo, herido por las balas de la biblioteca o agotado por el uso de Disciplinas, exige el sueño de los muertos. Te derrumbas sobre un colchón viejo o directamente sobre el suelo frío.

Antes de que la consciencia te abandone, los documentos robados —o las visiones de la Hiel— bailan en tu mente. El Tratado de 1814 no era un acuerdo de paz; era un sistema de alimentación.`,
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "chapter05_route_renegado_biblioteca", equals: true },
          text: "La sangre fresca en la hemeroteca vuelve a la cabeza: saliste por rutas donde la Torre cuenta cuerpo por cuerpo. Aprietas Lastarria o el primer techo disponible porque Inés tiene demasiadas formas de leer esa masacre contra ti.",
        },
        {
          requirement: { type: "flag", flag: "chapter05_route_huida_periferia", equals: true },
          text: "La salida por la fuerza te dejó señales en chaqueta y pulso alto. Cayó el cordón rápido: estás más cerca del polvo de Buin o del verdor de Viña que de la seguridad ceremonial del centro.",
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
        {
          requirement: { type: "flag", flag: "secreto_del_hermano", equals: true },
          text: "Te encuentras en un viñedo abandonado en las afueras de Buin; el aire huele a uva fermentada y tierra vieja. La ruta que abriste desde el papel te ha traído lejos del neón antes de tu próximo día.",
        },
      ],
      contextVariantByState: [
        {
          requirement: reqRefugioLastarriaUrbano,
          text: "En el sótano húmedo de Lastarria el agua gotea por tuberías viejas; cada gota suena a reloj mortal contando hacia el día.",
        },
        {
          requirement: reqTierraBuinViña,
          text: "En la bodega afuera del cordón, el olor a tierra seca y uva fermentada te envuelve mientras cierras una puerta de hierro que pesa como veredicto.",
        },
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
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Luchar contra el sopor del alba unos minutos extra para asegurar el perímetro.

PUENTE: Tus párpados pesan como plomo, pero obligas a tus nervios a responder una última vez. Revisas cerraduras, apilas cajas como barricada breve y dejas una salida de emergencia despejada antes de ceder al letargo.

CONSECUENCIA: Despiertas con sensación de que el refugio no se abrió solo; ganas margen defensivo ante visitas nocturnas.

RESULTADO: willpowerDelta: -1 | setFlag: refugio_asegurado | IR A [ESCENA 5.1]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n5_1",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "refugio_asegurado" }],
        },
        {
          id: "n5_0_ocultismo",
          type: "skill",
          skill: "ocultismo",
          text: `OPCIÓN B [HABILIDAD: LORE / OCULTISMO]: Dedicar tus últimos momentos de lucidez a memorizar un pasaje clave del Tratado.

PUENTE: El sol ya quema el exterior, pero tus ojos se clavan en el pergamino. Entre líneas en latín vulgar lees —o reconstruyes— la tesis: «El Ancla requiere la sangre del primogénito para que el Vínculo no se rompa». Entiendes que el Príncipe no es el autor del sistema, sino su guardián actual.

CONSECUENCIA: Guardas munición para chantajear al Príncipe o para liberar la ciudad en el clímax.

RESULTADO: setFlag: secreto_del_primogenito | IR A [ESCENA 5.1]`,
          requirement: { type: "skill", skill: "ocultismo", minLevel: 1 },
          nextSceneId: "n5_1",
          effects: [{ type: "setFlag", flag: "secreto_del_primogenito" }],
        },
        {
          id: "n5_0_descanso",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Dejarte caer y confiar en que el agotamiento repare el cuerpo durante el día.

PUENTE: No quedan fuerzas para más. Te envuelves en la chaqueta rasgada y cierras los ojos. El silencio de la muerte reclama mientras el tráfico matutino empieza a vibrar sobre tu cabeza.

CONSECUENCIA: Despiertas con heridas más llevaderas, sin ventaja estratégica extra.

RESULTADO: healthDamageDelta: +1 | IR A [ESCENA 5.1]`,
          requirement: { type: "none" },
          nextSceneId: "n5_1",
          effects: [{ type: "healthDamageDelta", delta: -1 }],
        },
      ],
    },
    {
      id: "n5_1",
      chapterId: "chapter05",
      title: "[ESCENA 5.1]: EL DESPERTAR DE LA NOCHE QUINTA",
      text: `CONTEXTO: El mismo refugio. 20:30. Santiago se hunde de nuevo en la oscuridad.
NARRACIÓN: Despiertas con un tirón seco en el estómago. El hambre ya no es molestia: es punzante. Tu sangre se siente delgada; necesitas nutrirte antes de lo que viene. Al incorporarte ves lo imposible: sobre una mesa cercana hay un sobre negro que no estaba cuando cerraste los ojos. Alguien entró durante el letargo.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "refugio_asegurado", equals: true },
          text: "El sobre viene clavado en la barricada improvisada como tarjeta de visita: quien entró registró tus defensas y las respetó lo bastante como para no moverlas.",
        },
        {
          requirement: { type: "not", requirement: { type: "flag", flag: "refugio_asegurado", equals: true } },
          text: "El sobre reposa sobre tu pecho cuando abres los ojos. Podrían haberte acabado con la misma facilidad; el mensaje no deja lugar a sutilezas.",
        },
        {
          requirement: { type: "flag", flag: "secreto_del_hermano", equals: true },
          text: "El papel del Hermano en tu bolsa late al compás del hambre: la ciudad no te va a esperar comedida.",
        },
        {
          requirement: { type: "flag", flag: "mapa_tuneles_catedral", equals: true },
          text: "Los trazos subterráneos que arrastras desde la Biblioteca encajan demasiado bien con lo que ese sobre pudiera anunciar sobre la piedra vieja.",
        },
      ],
      options: [
        {
          id: "n5_1_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Auspex",
          text: `OPCIÓN A [DISCIPLINA: AUSPEX]: Rastrear el aroma del intruso antes de abrir el sobre.

PUENTE: Inhalas hasta el borde racional del letargo tardío. No es Inés, ni el olor metálico de los ghouls de la Biblioteca: sándalo y ozono como bajo los portales de una imprenta en Teatinos. Es la firma que asocias con el Hombre del Traje Gris.

CONSECUENCIA: Confirmas que la tercera facción tiene tu posición y que, por ahora, parece tratarte como pie útil antes que como ceniza expeditable.

RESULTADO: setFlag: rastro_del_sastre_identificado | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "n5_2",
          effects: [{ type: "setFlag", flag: "rastro_del_sastre_identificado" }],
        },
        {
          id: "n5_1_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: Abrir el sobre con maniobra extrema y leer sólo después de aislar trampas evidentes.

PUENTE: Partes el lacre sin arrastrarlo hacia la piel. Dentro hay una fotografía de la Catedral Metropolitana con una marca escarlata sobre la entrada a catacumba y una frase escrita a mano: «El tiempo del Príncipe se agota. Elige bien tu corona».

CONSECUENCIA: Aseguras una ruta de infiltración directa antes de exponerte en plaza; el combate frontal queda aplazado mientras tanto.

RESULTADO: setFlag: mapa_catacumbas_regalo | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n5_2",
          effects: [{ type: "setFlag", flag: "mapa_catacumbas_regalo" }],
        },
        {
          id: "n5_1_cazar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Dejar el sobre intacto por ahora y salir a cazar para aplacar Hambre antes de mover piezas políticas.

PUENTE: Archivas el símbolo de la ciudad en tu retina y cierras el sobre sin leer cada detalle caligráfico; la prioridad primero sangre estable. Deslizarte por Lastarria o campo de Buin hasta hallar víctima aristocrática o, al menos, alimento que atrase a la Bestia.

CONSECUENCIA: Sangre nueva en tus venas, pero también ventana perdida frente al aviso contenido por el papel.

RESULTADO: hungerDelta: -2 | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n5_2",
          effects: [{ type: "hungerDelta", delta: -2 }],
        },
        {
          id: "n5_1_paranoia_corrupta",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes sangre_corrupta, destruir el sobre y acechar al mensajero.

PUENTE: La paranoia gana antes que la etiqueta diplomática; quemas el papel sintiendo el encogimiento de la esperanza en ceniza oscura del refugio. Te fundes en ángulos muertos esperando quién reclame segunda entrega entre dientes cerrados…

CONSECUENCIA: Ahuyenas posibles aliados con el mismo gesto que te blinda ante sorpresa inmediata.

RESULTADO: humanityDelta: -1 | setFlag: postura_paranoica | IR A [BLOQUE 2]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n5_2",
          effects: [
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "postura_paranoica" },
          ],
        },
      ],
    },
    {
      id: "n5_2",
      chapterId: "chapter05",
      title: "[ESCENA 5.2]: EL INTERLUDIO DE LAS SOMBRAS",
      text: `CONTEXTO: Exterior del refugio —Calle Villavicencio en Lastarria o desvío sobre el Camino a Buin—. 21:30. Santiago brilla bajo una capa de smog que filtra luces de neón.

NARRACIÓN: El contenido del sobre negro —leído en detalle o no— pesa en la cabeza. Te desplazas hacia el centro; la Catedral Metropolitana se dibuja como titán de piedra sobre el tiempo colonial.

Tu ruta fuerza cercanía al Palacio Bruna. Hay más camiones blindados privados del que marca un martes habitual; Vástagos de la Torre entrando y saliendo con prisa. El Príncipe ya echó cuenta: sea porque el Archivista habló o porque Mapocho fue sólo primer diente de engranaje.`,
      flagAppends: [
        {
          flag: "mapa_catacumbas_regalo",
          text: "La foto señala el callejón húmedo y el desnivel hacia catacumba sin cruzar la plaza a plena luz.",
        },
        {
          flag: "rastro_del_sastre_identificado",
          text: "El olor ozono‑sándalo queda pegado como declaración jurada: nadie llamó oficialmente pero el mensajero viene de esa facción de trajes impecables detrás del papel fino.",
        },
        {
          flag: "refugio_asegurado",
          text: "Tu barricada siguió en orden al despertar: quien pisó dentro lo hizo con demasiada seguridad incluso ante tu Fortaleza adormilada.",
        },
        {
          flag: "aliado_senescal_antiguo",
          text: "Despiertas con un croquis minucioso sobre la mesa: asedio, timings, ángulos ciegos del coro al sótano. El Senescal estuvo aquí antes de marcharse.",
        },
        {
          flag: "ubicacion_revelada_persecución",
          text: "Neumáticos frenan en seco contra el cemento fuera del refugio. La Corte tardó menos de lo cómodo en conectar tus huellas hasta aquí.",
        },
      ],
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "rastro_del_sastre_identificado", equals: true },
          text: "Un sedán gris mantiene distancia táctica paralela a tus pasos: mismo semáforo, mismo giro improvisado cuando esquivas el taco en Morandé.",
        },
        {
          requirement: { type: "flag", flag: "postura_paranoica", equals: true },
          text: "Cada bajo arco sobre la Merced podría esconder garganta de ejecutor cortés; incluso una sombra de turista lleva cara de censo de Torre hasta que pisas luz suficiente.",
        },
      ],
      options: [
        {
          id: "n5_2_callejeo_paralelo",
          type: "skill",
          skill: "callejeo",
          text: `OPCIÓN A [HABILIDAD: CALLEJEO]: Usar pasajes del centro —Paseo Huérfanos y conexiones comerciales— para flanquear desde el sur hasta la plaza.

PUENTE: Te mezclas entre mortales tarde‑turno entre vidrieras medio apagadas. Sorteas lente de seguridad cercana al Palacio y llegas a línea visual de Plaza de Armas sin firmar cara delante del protocolo público más obvio.

CONSECUENCIA: Quien observa desde la Torre no recibe foto clara antes de tiempo.

RESULTADO: setFlag: aproximacion_sigilosa_plaza | IR A [ESCENA 5.END]`,
          requirement: { type: "skill", skill: "callejeo", minLevel: 1 },
          nextSceneId: "n5_end",
          effects: [{ type: "setFlag", flag: "aproximacion_sigilosa_plaza" }, { type: "setFlag", flag: "escape_limpio_5" }],
        },
        {
          id: "n5_2_presencia_calle",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN B [DISCIPLINA: PRESENCIA]: Caminar visible por la calle principal como quien porta corona provisional.

PUENTE: No te ocultas. Pisas centro de vereda y la autoridad contenida proyecta campo silencioso: peatones apartan sin poder explicarlo. Quien lleve bandera corta desde la Torre lo duda medio segundo antes del protocolo cerrado sobre tu nombre.

CONSECUENCIA: Tu llegada es declaración de independencia o de guerra ceremonial; Doña Inés intercepta rutas antes de que marques entrada en mármol.

RESULTADO: willpowerDelta: +1 | setFlag: desafio_abierto_corte | IR A [ESCENA 5.END]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n5_end",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "desafio_abierto_corte" },
            { type: "setFlag", flag: "guerra_abierta_principe" },
          ],
        },
        {
          id: "n5_2_metro_catacumbas",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Si tienes mapa_catacumbas_regalo, buscar la rejilla de mantenimiento en el eje de Monjitas hacia el subsuelo común con la Catedral.

PUENTE: Evitas el tablero iluminado de la plaza. Fuerzas acceso con la daga de plata en el marco disimulado y desciendes hacia túneles donde el Metro se funde con cimiento colonial; charcos de Hiel estancada lamen botas y garganta.

CONSECUENCIA: El sol en la superficie deja de importar un tramo, pero el hambre sube un escalón en el intercambio.

RESULTADO: hungerDelta: +1 | setFlag: entrada_por_catacumbas | IR A [ESCENA 5.END]`,
          requirement: { type: "flag", flag: "mapa_catacumbas_regalo", equals: true },
          nextSceneId: "n5_end",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "entrada_por_catacumbas" }],
        },
        {
          id: "n5_2_transito_expuesto",
          type: "dialogue",
          text: `OPCIÓN D [CAMINO ESTÁNDAR - ACCIÓN]: Recorrer Merced y accesos directos sin técnica formal de callejeo ni brillo de Presencia.

PUENTE: Mides cada cruce con instinto puro: no tienes plan de pasaje ni mapa de catacumba. Llegas con la misma nerviosura que cualquier mortal apurado, pero tu sombra pesa distinto bajo el neón.

CONSECUENCIA: No ganas ventaja táctica clara; tampoco firmas un manifiesto abierto como con Presencia.

RESULTADO: (sin bandera de aproximación prioritaria) | IR A [ESCENA 5.END]`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              { type: "not", requirement: { type: "skill", skill: "callejeo", minLevel: 1 } },
              { type: "not", requirement: { type: "discipline", discipline: "presence", minLevel: 1 } },
              { type: "not", requirement: { type: "flag", flag: "mapa_catacumbas_regalo", equals: true } },
            ],
          },
          nextSceneId: "n5_end",
          effects: [],
        },
      ],
    },
    {
      id: "n5_end",
      chapterId: "chapter05",
      title: "[ESCENA 5.END]: EL HORIZONTE DE PIEDRA",
      text: `CONTEXTO: Plaza de Armas, frente a la Catedral Metropolitana. 23:45.
NARRACIÓN: Estás frente al objetivo declarado. La Catedral no es sólo arquitectura devota: es el corazón del Vínculo de Sangre que amarra a Santiago al Príncipe.

Un viento frío raspa la piedra y levanta hojas muertas contra la luz de faroles. La Guardia de la Torre bloquea puertas principales; el aire vibra con la misma electricidad púrpura que conociste bajo Mapocho. El Acto II termina en este umbral: al cruzarlo dejas de figurar como peón y pasas a nombre propio en el Tratado… o a otra línea de víctimas de 1814.

La puerta no se cruza igual según tu carga: verdad del Ancla y aliado te acercan al núcleo; guerra abierta te exige acero; llegada sigilosa, tiempo de medir; entrada por catacumbas, piedra antes que ceremonia. Fe, sangre y memoria convergen en este umbral.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "secreto_del_primogenito", equals: true },
          text: "Sabes que lo que aguarda dentro no es reliquia museada: es sangre de familia atada a un tormento que alimenta cordura de la Corte.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "conocimiento_del_ancla", equals: true },
              { type: "not", requirement: { type: "flag", flag: "secreto_del_primogenito", equals: true } },
            ],
          },
          text: "Tienes claro que el Ancla es la argolla simbiótica entre el linaje dominante del Príncipe y cada Ventrue menor que juró después.",
        },
        {
          requirement: { type: "flag", flag: "entrada_por_catacumbas", equals: true },
          text: "No miras el frontis desde la baldosa todavía: el mapa te dejó saborear Hiel bajo registro antes de nombrar la nave en público.",
        },
        {
          requirement: { type: "flag", flag: "aproximacion_sigilosa_plaza", equals: true },
          text: "Tu ángulo llegó por laterales: desde acá la procesión de guardias se lee como diagrama antes de que te exijan firmar postura.",
        },
        {
          requirement: { type: "flag", flag: "desafio_abierto_corte", equals: true },
          text: "Caminaste con corona prestada encendida: cada lente de seguridad felicitó la convocatoria antes de que llegues a texto de Inés.",
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
            requirements: [reqLoreAnclaOPrimogenito, reqAliadoInstitucionalOSastre],
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
          requirement: reqSigiloPlazaOClean,
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
                      requirements: [reqLoreAnclaOPrimogenito, reqAliadoInstitucionalOSastre],
                    },
                    { type: "flag", flag: "guerra_abierta_principe", equals: true },
                    reqSigiloPlazaOClean,
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
          text: "Ruta principal: avanzar al Capítulo 6 por el carril de supervivencia, leyendo terreno antes de comprometer corona.",
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
                      requirements: [reqLoreAnclaOPrimogenito, reqAliadoInstitucionalOSastre],
                    },
                    { type: "flag", flag: "guerra_abierta_principe", equals: true },
                    reqSigiloPlazaOClean,
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
                            requirements: [reqLoreAnclaOPrimogenito, reqAliadoInstitucionalOSastre],
                          },
                          { type: "flag", flag: "guerra_abierta_principe", equals: true },
                          reqSigiloPlazaOClean,
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
          nextSceneId: "n5_end",
          effects: [
            { type: "setFlag", flag: "chapter06_ruta_superviviente_ancla" },
            { type: "setFlag", flag: "chapter_pending_chapter06" },
          ],
        },
      ],
    },
  ],
};
