import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Rutas desde cap. 5 que abren la trama dentro de la nave (bloque ancla). */
const reqRutaAnclaCatedral = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "chapter06_ruta_verdad_ancla", equals: true },
    { type: "flag" as const, flag: "chapter06_ruta_ambicion_ancla", equals: true },
    { type: "flag" as const, flag: "chapter06_ruta_superviviente_ancla", equals: true },
  ],
};

const reqRutaViñaSinAncla = {
  type: "all" as const,
  requirements: [
    { type: "flag" as const, flag: "chapter06_route_vina_silencio", equals: true },
    { type: "not" as const, requirement: reqRutaAnclaCatedral },
  ],
};

export const chapter06: SoloChapter = {
  id: "chapter06",
  title: "Santiago en Cenizas · CAPÍTULO 6: EL NODO DE LA CATEDRAL",
  description:
    "Bloque 1/2: nave y descenso a la cripta ancla cuando vienes por la ruta plaza; cadena paralela Viña preservada tras bandera de citación.",
  startSceneId: "n6_0",
  scenes: [
    {
      id: "n6_0",
      chapterId: "chapter06",
      title: "[ESCENA 6.0]: EL SILENCIO DE LAS NAVES / ENTRADA AL ACTO VI",
      text: `NARRACIÓN: El capítulo mueve tu sangre donde la crónica exige nuevo tablero — convite sellado viña contra la piedra viva donde 1814 aún marca el pulso.`,
      contextLeadInByState: [
        {
          requirement: reqRutaAnclaCatedral,
          text: `CONTEXTO: Interior de la Catedral Metropolitana de Santiago. Plaza de Armas. 01:15 AM.
NARRACIÓN: La atmósfera dentro de la Catedral es tan densa que se puede saborear.

El edificio no está vacío. Doña Inés y un destacamento de la Guardia de la Torre custodian el altar mayor. Bajo el suelo de mármol, las vibraciones de la Hiel son tan fuertes que hacen que tus colmillos duelan. Sientes el Ancla: un objeto o ser de inmenso poder místico que mantiene el Vínculo de Sangre de toda la ciudad.`,
        },
        {
          requirement: reqRutaViñaSinAncla,
          text: `Viña del Silencio, alrededores de Buin. Madrugada profunda. El aire huele a tierra mojada y lavanda.

Elena te conduce hasta una casona patronal: "Adentro, la sangre es más espesa que la política. No bebas nada que no sepas de dónde viene".`,
        },
        {
          requirement: {
            type: "all",
            requirements: [{ type: "not", requirement: reqRutaAnclaCatedral }, { type: "not", requirement: reqRutaViñaSinAncla }],
          },
          text: "Llegas al capítulo por un carril que ni selló citación vinícola ni asaltó plaza aún en banderas nuevas; el motor te avanza igual hacia consecuencias compartidas.",
        },
      ],
      flagAppends: [
        {
          flag: "conocimiento_del_ancla",
          text: "Los vitrales parecen susurrar nombres de vástagos olvidados.",
        },
        {
          flag: "guerra_abierta_principe",
          text: "El olor a incienso y cera fría te resulta insultante.",
        },
      ],
      contextVariantByState: [
        {
          requirement: {
            type: "all",
            requirements: [
              reqRutaViñaSinAncla,
              { type: "flag", flag: "secreto_del_hermano", equals: true },
            ],
          },
          text: "Llegas arrastrado por el pergamino antes que por la plaza: la viña fue casilla táctica antes del ancla público.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              reqRutaViñaSinAncla,
              { type: "not", requirement: { type: "flag", flag: "secreto_del_hermano", equals: true } },
            ],
          },
          text: "Entras tras citación del cordón ciudadano antes de que nadie mencione piedra sagrada abierta.",
        },
        {
          requirement: { type: "flag", flag: "fugitivo_corte", equals: true },
          text: "Si vienes con busca sobre el cuello, cada alfombra vieja puede esconder ejecutor nuevo.",
        },
        {
          requirement: { type: "flag", flag: "doble_agente", equals: true },
          text: "Si eres doble agente, sonrises con la Boca que cuenta viñetas distintas a cada testigo.",
        },
      ],
      options: [
        {
          id: "n6_0_cat_presencia",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Invocar tu majestad para sembrar la duda en los guardias de Inés antes de ser detectado.

PUENTE: Te ocultas tras una columna de granito. Proyectas una sensación de fatalidad inminente, un peso espiritual que sugiere que el tiempo del Príncipe ha terminado. Los guardias empiezan a mirarse entre sí; sus manos tiemblan sobre sus armas…

CONSECUENCIA: Debilitas la resolución de la guardia. En un combate posterior, dos de ellos desertarán o dudarán al disparar.

RESULTADO: willpowerDelta: -1 | setFlag: duda_en_la_guardia | IR A [ESCENA 6.1]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          visibilityRequirement: reqRutaAnclaCatedral,
          nextSceneId: "n6_cat_cripta",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "duda_en_la_guardia" }],
        },
        {
          id: "n6_0_cat_sigilo",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN B [HABILIDAD: SIGILO]: Infiltrarte por el triforio (galerías superiores) para llegar al altar sin ser visto.

PUENTE: Escalas por las molduras laterales con la agilidad de un depredador. Desde las alturas observas el despliegue de Inés. Notas que el Ancla está conectada a cuatro cables de cobre que bajan hacia la cripta arzobispal…

CONSECUENCIA: Identificas los puntos débiles del sistema místico sin alertar a los enemigos.

RESULTADO: setFlag: puntos_debiles_visto | IR A [ESCENA 6.1]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          visibilityRequirement: reqRutaAnclaCatedral,
          nextSceneId: "n6_cat_cripta",
          effects: [{ type: "setFlag", flag: "puntos_debiles_visto" }],
        },
        {
          id: "n6_0_cat_dialogo",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Caminar por el pasillo central y exigir una última audiencia con Inés.

PUENTE: No te ocultas. Tus pasos resuenan en el mármol. Inés se gira; su rostro de porcelana se contrae en una mueca de incredulidad. «Aún puedes elegir el bando correcto, Inés. El Príncipe se alimenta de nosotros, no solo de los humanos», dices con calma.

CONSECUENCIA: Ganas tiempo para que tus aliados (si tienes al Senescal o a Gato) se posicionen, pero quedas expuesto en el centro de la nave.

RESULTADO: setFlag: parlamento_bajo_tension | IR A [ESCENA 6.1]`,
          requirement: { type: "none" },
          visibilityRequirement: reqRutaAnclaCatedral,
          nextSceneId: "n6_cat_cripta",
          effects: [{ type: "setFlag", flag: "parlamento_bajo_tension" }],
        },
        {
          id: "n6_0_cat_hiel",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes sangre_corrupta, liberar un pulso de Hiel para apagar las luces y sembrar el caos.

PUENTE: Te concentras en el veneno de tus venas. Lo proyectas hacia el sistema eléctrico de la Catedral. Las luces estallan en una lluvia de chispas púrpuras y la oscuridad total —tu elemento— reclama el recinto.

CONSECUENCIA: Generas un pánico absoluto. Inés pierde el control de sus hombres, pero la corrupción de la Hiel drena tu humanidad.

RESULTADO: hungerDelta: +2 | humanityDelta: -1 | setFlag: caos_purpura | IR A [ESCENA 6.1]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          visibilityRequirement: reqRutaAnclaCatedral,
          nextSceneId: "n6_cat_cripta",
          effects: [
            { type: "hungerDelta", delta: 2 },
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "caos_purpura" },
          ],
        },
        {
          id: "n6_0_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: "Analizar la disposición de los invitados en el salón.",
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          visibilityRequirement: reqRutaViñaSinAncla,
          nextSceneId: "n6_v_brindis",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "mapa_politico_vina" }],
        },
        {
          id: "n6_0_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Vibración bajo el suelo",
          text: "Sentir las vibraciones del lugar.",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          visibilityRequirement: reqRutaViñaSinAncla,
          nextSceneId: "n6_v_brindis",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "secreto_bajo_vina" }],
        },
        {
          id: "n6_0_perspicacia_vina",
          type: "skill",
          skill: "perspicacia",
          text: "Buscar señales de Hiel en las copas de los invitados.",
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          visibilityRequirement: reqRutaViñaSinAncla,
          nextSceneId: "n6_v_brindis",
          effects: [{ type: "setFlag", flag: "elite_infectada" }],
        },
        {
          id: "n6_0_fachada_vina",
          type: "dialogue",
          text: "Dejarte llevar al salón actuando invitado: instinto antes que mapa político abierto.",
          requirement: { type: "none" },
          visibilityRequirement: reqRutaViñaSinAncla,
          nextSceneId: "n6_v_brindis",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "vina_entrada_fachada" }],
        },
        {
          id: "n6_0_fallback_cap6",
          type: "dialogue",
          text: "Saltar al tramo siguiente sin bifurcar viña/ancla nueva (cadena vieja hasta cierre abierto del capítulo).",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [{ type: "not", requirement: reqRutaAnclaCatedral }, { type: "not", requirement: reqRutaViñaSinAncla }],
          },
          nextSceneId: "n6_fallback_salida",
          effects: [],
        },
      ],
    },
    {
      id: "n6_cat_cripta",
      chapterId: "chapter06",
      title: "[ESCENA 6.1]: EL DESCENSO A LA CRIPTA",
      text: `CONTEXTO: La entrada a la cripta arzobispal, tras el altar.
NARRACIÓN: El conflicto ha estallado o se ha evitado momentáneamente. La puerta de la cripta, una pesada losa de bronce, está entreabierta. Un brillo violáceo emana desde las profundidades, acompañado de un sonido de succión rítmico, como un corazón gigante latiendo bajo la piedra.

Sin la llave tallada en medallón sagrado, vas a tener que romper otro tipo de cerradura; con ella, el hierro puede ceder sin anunciar tu descenso.`,
      flagAppends: [
        {
          flag: "llave_medallon_criptas",
          text: "Encajas la llave del medallón: el vástago obedece sin estruendo antes de pisar escalera.",
        },
      ],
      options: [
        {
          id: "n6_cat_dom_peon",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Ordenar a un guardia capturado que baje primero para activar cualquier trampa.

PUENTE: Atrapas a uno de los hombres de Inés en el caos. Tus ojos se clavan en los suyos: «Baja y despeja el camino. No te detengas hasta que tu corazón explote», ordenas con una frialdad absoluta.

CONSECUENCIA: Sacrificas a un peón para asegurar tu entrada, eliminando a los Guardianes Silenciosos (ghouls deformes) que custodiaban el primer nivel de la cripta.

RESULTADO: humanityDelta: -1 | setFlag: camino_despejado_peon | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n6_cat_ancla",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "camino_despejado_peon" }],
        },
        {
          id: "n6_cat_sabotaje_cobre",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: Si tienes puntos_debiles_visto, sabotear los cables de cobre antes de bajar.

PUENTE: Antes de descender, usas la daga de plata para cortar las conexiones de cobre que alimentan el Ancla. El brillo violáceo disminuye en intensidad y escuchas un grito inhumano proveniente de abajo…

CONSECUENCIA: Debilitas el poder místico del Príncipe en toda la ciudad. Los vástagos de Santiago sienten cómo su vínculo de sangre empieza a fracturarse.

RESULTADO: willpowerDelta: -1 | setFlag: vinculo_fracturado | IR A [BLOQUE 2]`,
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "perspicacia", minLevel: 1 },
              { type: "flag", flag: "puntos_debiles_visto", equals: true },
            ],
          },
          nextSceneId: "n6_cat_ancla",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "vinculo_fracturado" }],
        },
        {
          id: "n6_cat_bajar_daga",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Bajar con la daga en alto, preparado para cualquier horror físico.

PUENTE: Ignoras los riesgos sutiles. Bajas las escaleras de caracol con la determinación de un verdugo. La temperatura desciende drásticamente y el aire se vuelve metálico. Llegas al nivel de los sarcófagos mientras las sombras intentan atraparte…

CONSECUENCIA: Entras en combate directo con los guardianes de la cripta. Conservas tu integridad moral pero sufres daños físicos.

RESULTADO: daño físico (integridad) | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n6_cat_ancla",
          effects: [{ type: "healthDamageDelta", delta: 1 }],
        },
        {
          id: "n6_cat_senescal_frente",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - VIOLENCIA]: Si tienes al aliado_senescal_antiguo, dejar que él lidere el asalto.

PUENTE: «Esto es lo que has esperado un siglo. Hazlo», dices. El Senescal se lanza a la oscuridad con una furia suicida, diezmando a los defensores de la cripta mientras avanzas por su estela de ceniza.

CONSECUENCIA: Limpias la cripta rápidamente, pero el Senescal muere en el proceso, dejándote solo frente al Ancla.

RESULTADO: setFlag: senescal_sacrificado | IR A [BLOQUE 2]`,
          requirement: { type: "flag", flag: "aliado_senescal_antiguo", equals: true },
          nextSceneId: "n6_cat_ancla",
          effects: [{ type: "setFlag", flag: "senescal_sacrificado" }],
        },
      ],
    },
    {
      id: "n6_cat_ancla",
      chapterId: "chapter06",
      title: "[ESCENA 6.2]: EL ANCLA DE 1814",
      text: `CONTEXTO: Cámara secreta bajo la cripta arzobispal. Las paredes de piedra están cubiertas por una red de capilares de cobre que pulsan con Hiel líquida.

NARRACIÓN: El aire aquí es casi líquido, cargado de una estática que eriza el vello de tu nuca. En el centro de la sala, dentro de un sarcófago de cristal reforzado con alquimia, no hay un objeto, sino un ser: la vástago primigenia. Es una Ventrue de la época de la Reconquista, mantenida en un estado de letargo eterno y agonía constante. Su sangre se drena y filtra por el sistema de cobre para alimentar el Vínculo de Sangre que mantiene la ciudad bajo el puño del Príncipe.`,
      flagAppends: [
        {
          flag: "vinculo_fracturado",
          text: "El sistema escupe chispas violetas y el ser tras el cristal abre los ojos, mirándote con una súplica silenciosa.",
        },
        {
          flag: "camino_despejado_peon",
          text: "El uniforme del guardia que enviabas delante yace disuelto junto a la entrada, consumido por la seguridad mística de la cámara.",
        },
      ],
      options: [
        {
          id: "n6_cat_ancla_fortitud",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Romper el sarcófago de cristal a mano para liberar a la primigenia.

PUENTE: Ignoras el dolor de las descargas místicas del cristal. Golpeas una y otra vez con una fuerza que fractura tus propios huesos hasta que el cristal estalla…

CONSECUENCIA: Liberas al Ancla. El vínculo de sangre de Santiago se rompe de golpe: cientos de vástagos recuperan el albedrío y la Corte se hunde en el caos.

RESULTADO: pérdida física severa | setFlag: vinculo_destruido | IR A [ESCENA 6.END]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n6_cat_cierre",
          effects: [{ type: "healthDamageDelta", delta: 2 }, { type: "setFlag", flag: "vinculo_destruido" }],
        },
        {
          id: "n6_cat_ancla_dom",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN B [DISCIPLINA: DOMINACIÓN]: Intentar suplantar al Príncipe y reclamar el control del sistema para ti.

PUENTE: No buscas destruir el sistema, sino heredarlo. Te conectas a los cables de cobre, dejas que la Hiel fluya por tus venas y proyectas tu voluntad sobre la primigenia. «Ahora yo soy tu voz. Yo soy Santiago», ruges por dentro…

CONSECUENCIA: No rompes el vínculo: lo desvías hacia ti. Te conviertes en el usurpador, con un poder inmenso y una corrupción que no te soltará.

RESULTADO: hungerDelta: +2 | humanityDelta: -2 | setFlag: usurpador_del_vinculo | IR A [ESCENA 6.END]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n6_cat_cierre",
          effects: [
            { type: "hungerDelta", delta: 2 },
            { type: "humanityDelta", delta: -2 },
            { type: "setFlag", flag: "usurpador_del_vinculo" },
          ],
        },
        {
          id: "n6_cat_ancla_daga",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Usar la daga de plata para una eutanasia mística y acabar con el sufrimiento del Ancla.

PUENTE: Entiendes que este horror no puede seguir. Clavas la daga de la Corte en el corazón de la mujer tras el cristal. La plata bendecida disuelve la magia oscura en un destello blanco que te ciega…

CONSECUENCIA: La primigenia muere en paz. El sistema de Hiel se colapsa; el Príncipe queda vulnerable y sin su fuente, y tú sales exhausto.

RESULTADO: willpowerDelta: -2 | setFlag: ancla_muerta | IR A [ESCENA 6.END]`,
          requirement: { type: "none" },
          nextSceneId: "n6_cat_cierre",
          effects: [{ type: "willpowerDelta", delta: -2 }, { type: "setFlag", flag: "ancla_muerta" }],
        },
        {
          id: "n6_cat_ancla_diablerie",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes sangre_corrupta, absorber la esencia de la primigenia para evolucionar.

PUENTE: La Bestia reconoce una fuente ancestral. Te alimentas de la vástago en letargo: no solo sangre, sino recuerdos de 1814 y potencia de linaje…

CONSECUENCIA: Cometes una diablerie mística. Tu poder sube de golpe, pero la marca del asesino queda en tu aura. Un grito ajeno empieza a repetirse en tu cabeza.

RESULTADO: hungerDelta: -5 | humanityDelta: -3 | setFlag: diablerista_ancestral | IR A [ESCENA 6.END]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n6_cat_cierre",
          effects: [
            { type: "hungerDelta", delta: -5 },
            { type: "humanityDelta", delta: -3 },
            { type: "setFlag", flag: "diablerista_ancestral" },
          ],
        },
      ],
    },
    {
      id: "n6_cat_cierre",
      chapterId: "chapter06",
      title: "[ESCENA 6.END]: EL COLAPSO DEL SUBSUELO",
      text: `CONTEXTO: La cámara empieza a derrumbarse. El sonido de la piedra cediendo resuena por toda la Catedral.

NARRACIÓN: El acto ya está hecho. Los cimientos de la soberanía de Santiago no volverán a ser los mismos. Escapas de la cripta justo antes de que el suelo se trague el altar mayor. Al salir a la Plaza de Armas, el aire de la noche es frío y ya no huele a Hiel. A lo lejos, el Palacio Bruna arde. La guerra civil de los vástagos ha comenzado.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          text: "Sientes un alivio psíquico masivo: el anillo colectivo acaba de soltarse del golpe.",
        },
        {
          requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true },
          text: "Una arrogancia oscura y nueva te sube a la cabeza: el nexo obedece tu pulso, no el del trono anterior.",
        },
        {
          requirement: { type: "flag", flag: "ancla_muerta", equals: true },
          text: "Conservaste el gesto limpio: no rompiste el vínculo a martillazos, lo apagaste con crueldad compasiva; la ciudad aún tiembla igual.",
        },
        {
          requirement: { type: "flag", flag: "diablerista_ancestral", equals: true },
          text: "Llevas dentro un eco de 1814 que no es tuyo; cada paso en la plaza suena doble.",
        },
      ],
      options: [
        {
          id: "n6_cat_cierre_ch7_llamas",
          type: "dialogue",
          text: "Capítulo 7 — Santiago en llamas: reunir supervivientes para el asalto final.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "vinculo_destruido", equals: true },
              { type: "flag", flag: "ancla_muerta", equals: true },
            ],
          },
          nextSceneId: "n6_cat_cierre",
          effects: [
            { type: "setFlag", flag: "mision_catedral" },
            { type: "setFlag", flag: "chapter07_route_santiago_en_llamas" },
            { type: "setFlag", flag: "chapter06_ancla_1814_colapsada" },
            { type: "setFlag", flag: "chapter_pending_chapter07" },
          ],
        },
        {
          id: "n6_cat_cierre_ch7_tirano",
          type: "dialogue",
          text: "Capítulo 7 — El ascenso del tirano: defender tu nuevo trono contra el Príncipe y los leales.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "usurpador_del_vinculo", equals: true },
              { type: "flag", flag: "diablerista_ancestral", equals: true },
            ],
          },
          nextSceneId: "n6_cat_cierre",
          effects: [
            { type: "setFlag", flag: "mision_catedral" },
            { type: "setFlag", flag: "chapter07_route_ascenso_tirano" },
            { type: "setFlag", flag: "chapter06_ancla_1814_colapsada" },
            { type: "setFlag", flag: "chapter_pending_chapter07" },
          ],
        },
      ],
    },
    {
      id: "n6_fallback_salida",
      chapterId: "chapter06",
      title: "6.X · Derivación desde capítulo anterior",
      text: `Tramo compacto hasta el enlace siguiente sin haber marcado plaza ni citación vinícola en las banderas recientes.`,
      options: [
        {
          id: "n6_fallback_pending",
          type: "dialogue",
          text: "Continuar al Capítulo 7 (pendiente línea causal fina sobre este carril).",
          requirement: { type: "none" },
          nextSceneId: "n6_fallback_salida",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
      ],
    },
    {
      id: "n6_v_brindis",
      chapterId: "chapter06",
      title: "6.1 · El brindis negro",
      text: `Comedor principal. Una mesa larga con una sola jarra de cristal negro al centro.

El Príncipe alza la voz: "Santiago necesita unidad, y la unidad requiere un sacrificio compartido". Elena te ofrece la copa.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "traicion_ines", equals: true },
          text: "Si conoces la traición de Inés, notas que Elena te observa con intensidad depredadora, esperando tu fallo.",
        },
      ],
      options: [
        {
          id: "n6_v_brindis_beber",
          type: "dialogue",
          text: "Beber la copa para mantener tu cobertura.",
          requirement: { type: "none" },
          nextSceneId: "n6_v_pacto",
          effects: [{ type: "setFlag", flag: "vinculo_sangre" }, { type: "willpowerDelta", delta: -2 }],
        },
        {
          id: "n6_v_brindis_persuasion",
          type: "dialogue",
          text: "Cuestionar el origen de la cosecha frente a todos.",
          requirement: { type: "none" },
          nextSceneId: "n6_v_pacto",
          effects: [{ type: "setFlag", flag: "disidente_publico" }],
        },
        {
          id: "n6_v_brindis_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Usted primero",
          text: "Obligar a otro invitado a beber primero.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "dominate", minLevel: 1 },
              { type: "flag", flag: "elite_infectada", equals: true },
            ],
          },
          nextSceneId: "n6_v_pacto",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "veneno_revelado" }],
        },
      ],
    },
    {
      id: "n6_v_pacto",
      chapterId: "chapter06",
      title: "6.2 · El pacto de las sombras",
      text: `Balcón de la viña. Vista a los campos oscuros.

El Príncipe te llama aparte: "El Sabat no es el problema. Lo que viene es la Gehena, y Santiago es el primer sello". Te entrega una llave de bronce.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "secreto_bajo_vina", equals: true },
          text: "La llave vibra en tu mano con la misma frecuencia del latido que sentiste bajo el suelo.",
        },
      ],
      options: [
        {
          id: "n6_v_pacto_investigar",
          type: "dialogue",
          text: "Preguntar por el Archivista y la llave.",
          requirement: { type: "none" },
          nextSceneId: "n6_v_fin",
          effects: [{ type: "setFlag", flag: "mision_catedral" }],
        },
        {
          id: "n6_v_pacto_politica",
          type: "skill",
          skill: "politica",
          text: "Exigir territorio propio a cambio de silencio.",
          requirement: { type: "skill", skill: "politica", minLevel: 1 },
          nextSceneId: "n6_v_fin",
          effects: [{ type: "setFlag", flag: "dueno_lastarria" }],
        },
        {
          id: "n6_v_pacto_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Cruzar el puente mental",
          text: "Usar el vínculo para leer la mente del Príncipe.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "auspex", minLevel: 1 },
              { type: "flag", flag: "vinculo_sangre", equals: true },
            ],
          },
          nextSceneId: "n6_v_fin",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "traicion_principe_vista" }],
        },
      ],
    },
    {
      id: "n6_v_fin",
      chapterId: "chapter06",
      title: "6.E · Hacia el corazón de la ciudad",
      text: `El coche te espera para volver al centro. El amanecer está a minutos.

Elena abre la puerta: "El tiempo de los secretos terminó. Ahora empieza el tiempo de la sangre".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "mision_catedral", equals: true },
          text: "La llave de bronce quema en tu bolsillo como una orden viva.",
        },
        {
          requirement: { type: "flag", flag: "vinculo_sangre", equals: true },
          text: "Sientes una necesidad física de complacer al Príncipe y eso te produce asco.",
        },
      ],
      options: [
        {
          id: "n6_v_fin_ch7_cat",
          type: "dialogue",
          text: "Ir hacia Plaza de Armas (misión de Catedral).",
          requirement: { type: "flag", flag: "mision_catedral", equals: true },
          nextSceneId: "n6_v_fin",
          effects: [{ type: "setFlag", flag: "chapter07_route_vinculo_quema" }, { type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
        {
          id: "n6_v_fin_ch7_reb",
          type: "dialogue",
          text: "Buscar a Gato para una alianza desesperada.",
          requirement: { type: "flag", flag: "traicion_principe_vista", equals: true },
          nextSceneId: "n6_v_fin",
          effects: [{ type: "setFlag", flag: "chapter07_route_rebelde" }, { type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
        {
          id: "n6_v_fin_ch7_escape",
          type: "dialogue",
          text: "Escapar de la guerra interna del Maipo.",
          requirement: { type: "flag", flag: "veneno_revelado", equals: true },
          nextSceneId: "n6_v_fin",
          effects: [{ type: "setFlag", flag: "chapter07_route_escape_maipo" }, { type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
        {
          id: "n6_v_fin_default",
          type: "dialogue",
          text: "Continuar al Capítulo 7",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                { type: "flag", flag: "mision_catedral", equals: true },
                { type: "flag", flag: "traicion_principe_vista", equals: true },
                { type: "flag", flag: "veneno_revelado", equals: true },
              ],
            },
          },
          nextSceneId: "n6_v_fin",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter07" }],
        },
      ],
    },
  ],
};
