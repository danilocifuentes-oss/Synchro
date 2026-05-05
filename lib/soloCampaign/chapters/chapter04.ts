import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter04: SoloChapter = {
  id: "chapter04",
  title: "Santiago en Cenizas · CAPÍTULO 4: ARCHIVOS DESENTERRADOS",
  description:
    "Biblioteca Nacional, Archivista, emboscada de Inés en la hemeroteca y tres derroteros hacia el siguiente tramo de la crónica.",
  startSceneId: "n4_0",
  scenes: [
    {
      id: "n4_0",
      chapterId: "chapter04",
      title: "[ESCENA 4.0]: EL SANTUARIO DEL PAPEL",
      text: `CONTEXTO: Biblioteca Nacional de Chile, Alameda. 02:30 AM. El edificio neoclásico parece un mausoleo custodiado por estatuas que, bajo la luz de la luna, parecen juzgar a los transeúntes.
NARRACIÓN: La Biblioteca Nacional no es solo un depósito de libros; para la Camarilla de Santiago, es el archivo de sus pecados más antiguos.

El aroma a papel viejo, cera de abejas y madera de roble es casi asfixiante. El silencio es absoluto, interrumpido solo por el zumbido de los sistemas de climatización. Buscas la sección de "Incunables Coloniales", donde el nombre "Archivista" —mencionado por la prisionera o deducido de tus notas— cobra sentido.`,
      contextLeadInByState: [
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "nexo_sellado", equals: true },
              { type: "flag", flag: "chapter04_route_politica", equals: true },
            ],
          },
          text: "Entras por la puerta de servicios con una llave magnética oficial: la ruta del nexo sellado te ha valido logística de palacio, no teatro de cerco.",
        },
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "sangre_corrupta", equals: true },
              { type: "flag", flag: "chapter04_route_renegado", equals: true },
            ],
          },
          text: "Te has colado por una ventana del segundo piso, sintiendo que la Hiel en tus venas vibra en sintonía con el conocimiento oculto que duerme en los anaqueles.",
        },
      ],
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "chapter04_route_politica", equals: true },
          text: "La credencial pesa en el bolsillo: el Palacio devolvió orden a la superficie, pero el papel guarda lo que la Torre prefiere omitir.",
        },
        {
          requirement: { type: "flag", flag: "archivista_entrega_corte", equals: true },
          text: "Si entregaste a la vástago a la Corte, llegas con el peso visible de un rescate incompleto: el Archivista no puede ignorarte.",
        },
        {
          requirement: { type: "flag", flag: "archivista_prisionera_oculta", equals: true },
          text: "Si la guardaste oculta, cruzas el umbral solo con medio verdad en la lengua y la marca de Mapocho aún rozando tus sentidos.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "chapter04_route_medica", equals: true },
              { type: "not", requirement: { type: "flag", flag: "archivista_entrega_corte", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "archivista_prisionera_oculta", equals: true } },
            ],
          },
          text: "Si vienes de la ruta médica (sin bifurcación de Archivista explícita), te cuelas por ventilación con la cicatriz de la Hiel todavía pulsando.",
        },
        {
          requirement: { type: "flag", flag: "chapter04_route_renegado", equals: true },
          text: "Si vienes de la ruta del renegado, finges normalidad hasta la primera sombra bibliotecaria; por dentro la Bestia cuenta otra historia.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "sabotaje_exitoso", equals: true },
              { type: "not", requirement: { type: "flag", flag: "chapter04_route_medica", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "chapter04_route_politica", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "chapter04_route_renegado", equals: true } },
            ],
          },
          text: "Si vienes sin credencial dorada ni trato de médico pero con el sabotaje en el alma, el edificio te recibe igual: papel, polvo y pactos viejoimpresos.",
        },
      ],
      options: [
        {
          id: "n4_0_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Someter al guardia nocturno para que te guíe a la "Bóveda de los Excluidos".

PUENTE: Encuentras al vigilante en su ronda. Antes de que pueda alzar su linterna, atrapas su mirada. "No ves a nadie. Solo tienes un deseo: abrir la puerta del sótano tres y esperar afuera", ordenas con una voz que no admite réplica.

CONSECUENCIA: Accedes a la zona restringida sin activar alarmas, pero el guardia quedará con una cicatriz mental que podría ser detectada por otros.

RESULTADO: hungerDelta: +1 | setFlag: acceso_boveda_limpio | IR A [ESCENA 4.1]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n4_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "acceso_boveda_limpio" }],
        },
        {
          id: "n4_0_investigacion",
          type: "skill",
          skill: "investigacion",
          text: `OPCIÓN B [HABILIDAD: INVESTIGACIÓN]: Localizar el sistema de clasificación secreto oculto en el catálogo público.

PUENTE: Te sientas frente a los antiguos ficheros de madera. No buscas por autor, sino por patrones de perforaciones en las tarjetas. Descubres que ciertos libros de historia de 1814 forman una coordenada geográfica que apunta al subsuelo del edificio...

CONSECUENCIA: Descifras el código de los fundadores. Encuentras un pasadizo tras una estantería de Derecho Canónico.

RESULTADO: willpowerDelta: +1 | setFlag: codigo_1814_descifrado | IR A [ESCENA 4.1]`,
          requirement: { type: "skill", skill: "investigacion", minLevel: 1 },
          nextSceneId: "n4_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "codigo_1814_descifrado" }],
        },
        {
          id: "n4_0_forzar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Forzar la entrada al sótano usando la daga de plata como palanca.

PUENTE: No tienes tiempo para juegos mentales. Localizas la puerta reforzada que lleva a los archivos históricos. Usas la daga de la Corte para forzar el mecanismo. El metal místico corta el acero convencional con un chirrido que resuena en el ala este...

CONSECUENCIA: Entras, pero has activado una alerta silenciosa en el Palacio Bruna. Inés sabe que estás donde no deberías.

RESULTADO: setFlag: alerta_biblioteca_activa | IR A [ESCENA 4.1]`,
          requirement: { type: "none" },
          nextSceneId: "n4_1",
          effects: [{ type: "setFlag", flag: "alerta_biblioteca_activa" }],
        },
        {
          id: "n4_0_instinto_hiel",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Dejar que la sangre_corrupta te guíe por el rastro del "olor" de la verdad.

PUENTE: Cierras los ojos. La hiel en tu sistema empieza a pulsar. No ves las paredes; ves corrientes de energía oscura que fluyen hacia una habitación específica. Caminas en trance, derribando cualquier obstáculo que se interponga en tu línea recta hacia el origen.

CONSECUENCIA: Encuentras el archivo exacto, pero tu estado errático deja huellas de fluido púrpura en el suelo, imposibles de ocultar.

RESULTADO: hungerDelta: +1 | humanityDelta: -1 | setFlag: rastro_corrupto_biblioteca | IR A [ESCENA 4.1]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n4_1",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "rastro_corrupto_biblioteca" },
          ],
        },
      ],
    },
    {
      id: "n4_1",
      chapterId: "chapter04",
      title: "[ESCENA 4.1]: EL ARCHIVISTA DE LAS SOMBRAS",
      text: `CONTEXTO: Sala de Restauración de Documentos, subsuelo. Luz de tungsteno amarillenta y mesas llenas de pergaminos.
NARRACIÓN: En el centro de la habitación, un hombre delgado, con gafas de montura de hierro y una palidez que rivaliza con la tuya, trabaja febrilmente. Es el Archivista. No se asusta al verte; parece que te ha estado esperando desde hace décadas. Sobre su mesa descansa el Tratado de la Viña del Silencio, un documento firmado por los padres de la patria y los primeros Ventrue de Chile.

"La Hiel no es un accidente, Embajador", susurra sin despegar la vista del papel. "Es el diezmo. En 1814, Santiago compró su libertad al precio de convertir el Mapocho en un filtro. El Príncipe solo está intentando cobrar los intereses".`,
      options: [
        {
          id: "n4_1_presencia",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Intimidar al Archivista para que te entregue el documento original del Tratado.

PUENTE: Te yergues, permitiendo que tu sombra se alargue por las paredes llenas de libros. "No he venido a escuchar parábolas. Dame el documento original o haré que este edificio sea tu pira funeraria", amenazas con una autoridad que hace temblar las estanterías.

CONSECUENCIA: El Archivista te entrega un pergamino sellado con sangre pura. Revela que el Príncipe tiene un "Hermano" atrapado bajo la ciudad.

RESULTADO: setFlag: secreto_del_hermano | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n4_2",
          effects: [
            { type: "setFlag", flag: "secreto_del_hermano" },
            { type: "setFlag", flag: "lista_traidores" },
            { type: "setFlag", flag: "lore_cuarentena" },
            { type: "setFlag", flag: "novel_ch4_lineage_mapped" },
          ],
        },
        {
          id: "n4_1_persuasion",
          type: "skill",
          skill: "persuasion",
          text: `OPCIÓN B [HABILIDAD: PERSUASIÓN]: Convencerlo de que tú eres el único que puede detener lo que se ha desatado.

PUENTE: "El Príncipe me envió a limpiar el nexo, pero yo busco la cura, no solo el orden", dices con una sinceridad calculada. "Dime la verdad y te sacaré de este agujero antes de que Inés venga a silenciarte".

CONSECUENCIA: El Archivista confía en ti. Te revela que la Hiel es la sangre de un Antediluviano que duerme bajo el cerro Santa Lucía.

RESULTADO: setFlag: aliado_archivista | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "persuasion", minLevel: 1 },
          nextSceneId: "n4_2",
          effects: [
            { type: "setFlag", flag: "aliado_archivista" },
            { type: "setFlag", flag: "traicion_ines" },
            { type: "setFlag", flag: "lore_cuarentena" },
            { type: "setFlag", flag: "novel_ch4_lineage_mapped" },
          ],
        },
        {
          id: "n4_1_dialogo",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Preguntar por la relación entre el "Sello de 1814" y el "Hombre del Traje Gris".

PUENTE: "He visto marcas en la estación. Un círculo tachado. ¿Quién es el hombre que vigila mi despertar?", preguntas. El Archivista palidece. "Él es el Cobrador. El que no tiene nombre. Si él ha vuelto, el Tratado ya no vale nada".

CONSECUENCIA: Obtienes información sobre la tercera facción, pero el Archivista se niega a contarte más por puro terror.

RESULTADO: setFlag: info_el_cobrador | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n4_2",
          effects: [
            { type: "setFlag", flag: "info_el_cobrador" },
            { type: "setFlag", flag: "lore_cuarentena" },
            { type: "setFlag", flag: "novel_ch4_lineage_mapped" },
          ],
        },
        {
          id: "n4_1_violencia",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - VIOLENCIA]: Arrebatar el documento por la fuerza y registrar la oficina tú mismo.

PUENTE: No confías en las palabras de un viejo loco. Lo apartas de un empujón y empiezas a saquear los cajones. Encuentras un mapa de la red de túneles que conecta la Biblioteca con la Catedral de Santiago.

CONSECUENCIA: Obtienes la ruta de escape y el siguiente punto del nexo, pero el Archivista logra activar una alarma de pánico manual.

RESULTADO: humanityDelta: -1 | setFlag: mapa_tuneles_catedral | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n4_2",
          effects: [
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "mapa_tuneles_catedral" },
            { type: "setFlag", flag: "lore_cuarentena" },
            { type: "setFlag", flag: "novel_ch4_lineage_mapped" },
            { type: "setFlag", flag: "lista_traidores" },
          ],
        },
      ],
    },
    {
      id: "n4_2",
      chapterId: "chapter04",
      title: "[ESCENA 4.2]: LA EMBOSCADA EN LOS ANAQUELES",
      text: `CONTEXTO: Pasillos de la Hemeroteca, Biblioteca Nacional. La iluminación de emergencia baña los estantes de un rojo tenue.
NARRACIÓN: El conocimiento tiene un precio. Justo cuando te dispones a abandonar la sala del Archivista, las puertas de roble de la salida principal se bloquean. Un equipo de operativos de la Corte —ghouls de élite bajo el mando directo de Inés— entra por los tragaluces superiores.`,
      flagAppends: [
        {
          flag: "alerta_biblioteca_activa",
          text: "La alerta que disparaste al forzar el sótano ya hizo su trabajo: están en posición de tiro antes de que completes el giro.",
        },
        {
          flag: "aliado_archivista",
          text: "El Archivista, sin alzar la voz, te señala con la barbilla un montacargas de libros oculto detrás de una fila de periódicos del siglo XIX.",
        },
      ],
      options: [
        {
          id: "n4_2_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Avanzar frontalmente a través del fuego cruzado para forzar la salida.

PUENTE: No te escondes. Tu piel se vuelve tan dura como la piedra del edificio. Las balas de los operativos rebotan en tu traje mientras caminas hacia ellos con una parsimonia aterradora, usando los estantes metálicos como escudos móviles...

CONSECUENCIA: Logras salir por la puerta principal tras eliminar a los guardias en combate cercano.

RESULTADO: healthDamageDelta: -1 | setFlag: escape_por_fuerza | IR A [ESCENA 4.END]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n4_end",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "escape_por_fuerza" }],
        },
        {
          id: "n4_2_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN B [DISCIPLINA: DOMINACIÓN]: Ordenar a los operativos que se ataquen entre ellos aprovechando la confusión.

PUENTE: Te ocultas en la penumbra. Esperas a que el líder del equipo dé la orden de avance y proyectas tu voluntad sobre él. "Tus hombres son traidores. Elimínalos", susurras con una potencia que anula su raciocinio...

CONSECUENCIA: Creas una distracción sangrienta que te permite escabullirte mientras los ghouls se masacran entre sí.

RESULTADO: hungerDelta: +1 | setFlag: masacre_biblioteca | IR A [ESCENA 4.END]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n4_end",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "masacre_biblioteca" }],
        },
        {
          id: "n4_2_montacargas",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN / SIGILO]: Usar el montacargas de libros para descender a los túneles de servicio.

PUENTE: Sigues la indicación del Archivista o tu propio instinto. Te deslizas por el estrecho hueco del montacargas justo cuando las granadas aturdidoras estallan en la sala. Caes en un sótano lleno de tuberías de vapor y humedad...

CONSECUENCIA: Escapas sin ser visto, pero pierdes el rastro del Archivista, quien queda a merced de la Corte.

RESULTADO: setFlag: escape_subterraneo | IR A [ESCENA 4.END]`,
          requirement: { type: "none" },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "escape_subterraneo" }],
        },
        {
          id: "n4_2_colapso_hiel",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Usar la sangre_corrupta para "sentir" las debilidades estructurales del techo y provocar un derrumbe.

PUENTE: La Hiel en tus venas vibra. Golpeas un pilar de carga con una fuerza que no es tuya. El techo cede, sepultando a los perseguidores bajo toneladas de escombros y tomos históricos...

CONSECUENCIA: Bloqueas la persecución permanentemente, pero destruyes gran parte de la historia que venías a proteger.

RESULTADO: humanityDelta: -1 | setFlag: destruccion_archivos | IR A [ESCENA 4.END]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n4_end",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "destruccion_archivos" }],
        },
      ],
    },
    {
      id: "n4_end",
      chapterId: "chapter04",
      title: "[ESCENA 4.END]: LA CIUDAD BAJO LA CIUDAD",
      text: `CONTEXTO: Salida de alcantarillado que desemboca cerca de la Iglesia de San Francisco. 04:45 AM.
NARRACIÓN: Estás fuera del edificio, pero ya no estás en la superficie de Santiago. Te encuentras en un punto de no retorno.

Has dejado de ser un simple ejecutor para convertirte en alguien que conoce el pecado original de la ciudad. El sol está cerca, y necesitas un refugio que no sea controlado por el Príncipe.

BIFURCACIÓN DE SALIDA (CRÓNICA)
documento del Hermano → Capítulo 5 Sangre y tierra; la Viña en datos queda tras el tramo siguiente.
alerta biblioteca → busca y captura, refugio anarquista (chapter05_route_refugio_ceniza).
aliado_archivista → mensaje / nodo Lastarria–Catedral (chapter05_route_nodo_catedral).`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "secreto_del_hermano", equals: true },
          text: "El documento que arrebataste o negociaste vibra con una energía que tira de ti hacia la Catedral y, al mismo tiempo, hacia la idea de la Viña del Silencio como próximo tablero.",
        },
        {
          requirement: { type: "flag", flag: "mapa_tuneles_catedral", equals: true },
          text: "El mapa que arrancaste a la fuerza de la oficina calza con esta boca de túnel: sabes dónde no estarán las patrullas de Inés, al menos unos minutos.",
        },
        {
          requirement: { type: "flag", flag: "escape_por_fuerza", equals: true },
          text: "El eco del combate en la hemeroteca te sigue en los tímpanos; saliste por arriba, no por el honor.",
        },
        {
          requirement: { type: "flag", flag: "masacre_biblioteca", equals: true },
          text: "Detrás de ti, el silencio vuelve demasiado pronto: el precio de la distracción pesa en el aire.",
        },
        {
          requirement: { type: "flag", flag: "escape_subterraneo", equals: true },
          text: "El vapor te ha devuelto a la ciudad bajo la ciudad; el Archivista quedó arriba, solo con Inés.",
        },
        {
          requirement: { type: "flag", flag: "destruccion_archivos", equals: true },
          text: "Bajo el polvo imaginado de siglos, una verdad queda enterrada contigo: elegiste bloquear la Corte con escombros, no con argumentos.",
        },
      ],
      options: [
        {
          id: "n4_end_ruta_vina",
          type: "dialogue",
          text: `Seguir el tirón del documento antes que el día te ate a otro altar: sangre y tierra en Buin antes de la siguiente escala.

CONSECUENCIA: Tomas el primer tramo tras la Biblioteca bajo otro tipo de cobijo; lo que sigue será el Arco Sangre y tierra del capítulo siguiente.

RESULTADO: chapter_pending_chapter05`,
          requirement: { type: "flag", flag: "secreto_del_hermano", equals: true },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter05" }],
        },
        {
          id: "n4_end_ruta_refugio_ceniza",
          type: "dialogue",
          text: `Meterse en la fricción de la ciudad: refugio con los anarquistas (busca y captura de la Corte).

CONSECUENCIA: Inés te ha puesto nombre en lista; solo el humo de la barricada disimula tu sombra.

RESULTADO: chapter05_route_refugio_ceniza | fugitivo_corte | chapter_pending_chapter05`,
          requirement: { type: "flag", flag: "alerta_biblioteca_activa", equals: true },
          nextSceneId: "n4_end",
          effects: [
            { type: "setFlag", flag: "chapter05_route_refugio_ceniza" },
            { type: "setFlag", flag: "fugitivo_corte" },
            { type: "setFlag", flag: "chapter_pending_chapter05" },
          ],
        },
        {
          id: "n4_end_ruta_nodo_catedral",
          type: "dialogue",
          text: `Abrir el mensaje anónimo: coordenada en Lastarria, nodo hacia la Catedral.

CONSECUENCIA: El Archivista te alcanza en el aire digital antes de que Inés selle el centro.

RESULTADO: chapter05_route_nodo_catedral | coordenada_lastarria | chapter_pending_chapter05`,
          requirement: { type: "flag", flag: "aliado_archivista", equals: true },
          nextSceneId: "n4_end",
          effects: [
            { type: "setFlag", flag: "chapter05_route_nodo_catedral" },
            { type: "setFlag", flag: "coordenada_lastarria" },
            { type: "setFlag", flag: "chapter_pending_chapter05" },
          ],
        },
        {
          id: "n4_end_default",
          type: "dialogue",
          text: "Huir por la trama general de la ciudad: continuar al Capítulo 5 (sin ruta prioritaria).",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              { type: "not", requirement: { type: "flag", flag: "secreto_del_hermano", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "alerta_biblioteca_activa", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "aliado_archivista", equals: true } },
            ],
          },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter05" }],
        },
        {
          id: "n4_end_unlock_special",
          type: "dialogue",
          text: "Guardar la carta para chantajear a Doña Inés.",
          requirement: { type: "flag", flag: "traicion_ines", equals: true },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "chapter05_special_ines_blackmail" }],
        },
      ],
    },
  ],
};
