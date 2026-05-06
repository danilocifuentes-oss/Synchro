import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Tramo urbano con logística de cuatro ruedas desde Mapocho (cap. 3). */
const reqTrayectoBibliotecaConVehiculo = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "cap3_sedan_blindado", equals: true },
    { type: "flag" as const, flag: "llegada_vehiculo_corte", equals: true },
  ],
};

export const chapter04: SoloChapter = {
  id: "chapter04",
  title:
    "Santiago en Cenizas · CRÓNICA VENTRUE (V3.1) · CAPÍTULO 4: ARCHIVOS DESENTERRADOS (BLOQUE 2/2)",
  description:
    "Trayecto a la Biblioteca y Archivista; emboscada de la «Limpieza» en hemeroteca; huida hacia Santa Lucía, Lastarria o periferia —salida táctica hacia el Capítulo 5.",
  startSceneId: "n4_0",
  scenes: [
    {
      id: "n4_0",
      chapterId: "chapter04",
      title: "[ESCENA 4.0]: EL TRAYECTO POR LA CALLE BANDERA",
      contextLeadInByState: [
        {
          requirement: reqTrayectoBibliotecaConVehiculo,
          text: "Aún tienes motor bajo mano: recorres Bandera y el costado de Ahumada con el sedán a mínimo, esquivando el alba que sube por el cerro como filo.",
        },
      ],
      text: `CONTEXTO: Eje Calle Bandera / Paseo Ahumada hacia la Alameda. 05:55 AM. El cielo empieza a teñirse de un azul profundo previo al alba.

NARRACIÓN: El trayecto desde el sector del Mercado Central hacia el corazón administrativo es una carrera contra el sol. Caminas cuando no hay otro recurso —o conduces hasta donde el cordón urbano permite estacionar— mientras los edificios gubernamentales proyectan sombras que parecen alargarse para atraparte antes de llegar al cruce con la Alameda y Mac Iver.

Doña Inés se separa de ti cerca de la Plaza de Armas. «Yo me encargo de que el Príncipe reciba un informe preliminar que te favorezca», susurra al oído. «Tú entra en la Biblioteca. Busca la sección de Incunables Coloniales. Si el nombre "Archivista" es real, estará ahí: protegiendo lo que esta ciudad prefiere olvidar». Se diluye entre la madrugada con la rutina del que lleva años moviendo fichas públicas antes del turno mortal.

Por fin te plantas ante la majestuosa fachada de la Biblioteca Nacional: neoclásico frío como mausoleo, estatuas en la cumbrera como juezas silenciosas de tu sangre.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "marca_de_la_hiel", equals: true },
          text: "Las luces de los semáforos te provocan una punzada detrás de los ojos, casi migrañosica; cada cruce hace sentir la calle más delgada, como si pudieras ver el esqueleto del asfalto entre la neblina violeta contenida.",
        },
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "archivista_entrega_corte", equals: true },
              { type: "flag", flag: "archivista_prisionera_oculta", equals: true },
            ],
          },
          text: "Lo de Mapocho te sigue a la zancada —la decisión sobre la vástago pesa igual que los pasos hacia Montt.",
        },
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "chapter04_route_politica", equals: true },
              { type: "flag", flag: "nexo_sellado", equals: true },
            ],
          },
          text: "La llave institucional y el sello del nexo brillan ante la ciudad despierta: la Corte abrió el camino oficial; el papel es lo que puede derribarte igual.",
        },
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "chapter04_route_renegado", equals: true },
              { type: "flag", flag: "sangre_corrupta", equals: true },
            ],
          },
          text: "Caminas erguido bajo glamour de disciplina contenida pero la corrupción en venas marca latidos que no siguen ritmo de semáforo.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "sabotaje_exitoso", equals: true },
              { type: "not", requirement: { type: "flag", flag: "marca_de_la_hiel", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "sangre_corrupta", equals: true } },
            ],
          },
          text: "El sabotaje en la estación dejó ceniza moral en tus manos antes de llegar aquí —el mármol de la escalinata igual te recibirá hueso contra hueso político.",
        },
      ],
      options: [
        {
          id: "n4_0_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Someter al guardia de la entrada lateral para que ignore tu presencia y te entregue su pase maestro.

PUENTE: Te acercas al vigilante que fuma en la puerta de servicio sobre calle Mac Iver. Atrapas su mirada antes de que pida identificación. «No estoy aquí. Solo tienes un deseo: entrar en la garita, cerrar los ojos y contar hasta mil», ordenas con el peso de siglos de mando.

CONSECUENCIA: Entras sin activar alarmas físicas. El guardia no recordará tu rostro, pero su mente quedará marcada por el trance.

RESULTADO: hungerDelta: +1 | setFlag: entrada_limpia_biblioteca | IR A [ESCENA 4.1]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n4_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "entrada_limpia_biblioteca" }],
        },
        {
          id: "n4_0_sigilo",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN B [HABILIDAD: SIGILO]: Infiltrarte por los andamios de restauración de la fachada este.

PUENTE: El ala este del edificio está bajo mantenimiento. Trepar por la estructura metálica y colarte por una ventana del segundo piso —mal sellada— te deposita en una sala de lectura vacía: estanterías hasta el techo, polvo de encuadernación y pasos que no dejan visita en planilla.

CONSECUENCIA: Evitas todo contacto humano en el perímetro. Para cámaras y rondas pareces un error de sombra, no un nombre en log.

RESULTADO: setFlag: infiltracion_fantasma | IR A [ESCENA 4.1]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n4_1",
          effects: [{ type: "setFlag", flag: "infiltracion_fantasma" }],
        },
        {
          id: "n4_0_etiqueta_corte",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ETIQUETA]: Usar tu identificación de «Consultor de Patrimonio» (otorgada por la Corte) para entrar de forma legal por el acceso principal.

PUENTE: Presentas el pase de consultor que emitió la Corte: alias creíble, sello que el mostrador reconoce. Los guardias registran la visita y te dejan pasar; el Salón de Honor amplifica tus pasos sobre mármol hasta el ascenso a lo restringido.

CONSECUENCIA: Entrada limpia en papel; si la noche se rompe, el nombre falso igual quedó en el libro de guardia.

RESULTADO: (Avance estándar) | IR A [ESCENA 4.1]`,
          requirement: { type: "none" },
          nextSceneId: "n4_1",
        },
      ],
    },
    {
      id: "n4_1",
      chapterId: "chapter04",
      title: "[ESCENA 4.1]: EL ARCHIVISTA DE LAS SOMBRAS",
      text: `CONTEXTO: Sección de Incunables y Manuscritos —subsuelo de la Biblioteca Nacional—. Luz de tungsteno amarillenta y olor a papel acidificado por el tiempo.

NARRACIÓN: Bajo tierra, lejos del alba, una oficina de restauración. Un hombre pálido bajo lámpara de escritorio, gafas de hierro: el Archivista. No alza la vista; lleva la cuenta de cuántos minutos tardaste desde Mapocho.

Sobre la mesa, el Tratado de la Viña del Silencio: pergamino amarillo, lacres viejos, la misma inquietud que la Hiel cuando la viste mal herida bajo el río.

«La sangre de los reyes siempre vuelve a la tierra», murmura él. «El Príncipe no quiere que limpies la estación, Embajador. Quiere que recuperes la llave de su propia cárcel».`,
      options: [
        {
          id: "n4_1_presencia",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Intimidar al Archivista para que revele la verdad oculta tras el Tratado de 1814.

PUENTE: Te yergues, permitiendo que tu sombra cubra la habitación. «No he venido a escuchar profecías de sótano. Explícame qué es el "Ancla" y por qué el Príncipe te teme», exiges con una autoridad que hace que los frascos de tinta sobre la mesa vibren.

CONSECUENCIA: El Archivista confiesa que el Príncipe es un prisionero de un pacto antiguo y que la Hiel es el «exceso» de un ritual de sangre que mantiene a Santiago bajo control.

RESULTADO: willpowerDelta: +1 | setFlag: verdad_del_pacto | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n4_2",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "verdad_del_pacto" },
            { type: "setFlag", flag: "conocimiento_del_ancla" },
            { type: "setFlag", flag: "secreto_del_hermano" },
            { type: "setFlag", flag: "lista_traidores" },
            { type: "setFlag", flag: "lore_cuarentena" },
            { type: "setFlag", flag: "novel_ch4_lineage_mapped" },
          ],
        },
        {
          id: "n4_1_investigacion",
          type: "skill",
          skill: "investigacion",
          text: `OPCIÓN B [HABILIDAD: INVESTIGACIÓN]: Analizar los documentos de la mesa por tu cuenta mientras él habla.

PUENTE: Ignoras su misticismo y centras la mirada en mapas desplegados. Los puntos de mayor concentración de Hiel dibujan un patrón que converge hacia la Catedral Metropolitana y una nota marginal nombra a un «Hermano de Sangre» sacrificado.

CONSECUENCIA: Obtienes coordenadas tácticas precisas; el nido en Mapocho fue sólo un filtro y el verdadero pivote territorial queda ante la Plaza de Armas.

RESULTADO: setFlag: coordenadas_catedral | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "investigacion", minLevel: 1 },
          nextSceneId: "n4_2",
          effects: [
            { type: "setFlag", flag: "coordenadas_catedral" },
            { type: "setFlag", flag: "conocimiento_del_ancla" },
            { type: "setFlag", flag: "mapa_tuneles_catedral" },
            { type: "setFlag", flag: "lore_cuarentena" },
            { type: "setFlag", flag: "novel_ch4_lineage_mapped" },
          ],
        },
        {
          id: "n4_1_dialogo",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Negociar su seguridad a cambio de la entrega de los documentos originales.

PUENTE: «Inés viene en camino. Si me entregas el Tratado original ahora, puedo asegurar que el Príncipe te perdone la vida», ofreces con pragmatismo. El Archivista te mira con lástima: «Nadie se salva de este contrato, joven Ventrue».

CONSECUENCIA: Te entrega una copia del Tratado, pero se guarda el original. Ganas un aliado temporal, pero te falta la prueba física definitiva.

RESULTADO: setFlag: aliado_archivista | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n4_2",
          effects: [
            { type: "setFlag", flag: "aliado_archivista" },
            { type: "setFlag", flag: "aliado_senescal_antiguo" },
            { type: "setFlag", flag: "lore_cuarentena" },
            { type: "setFlag", flag: "novel_ch4_lineage_mapped" },
          ],
        },
        {
          id: "n4_1_corrupta_1814",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes setFlag: sangre_corrupta, dejar que el veneno de tus venas «lea» la tinta del documento.

PUENTE: Tocas el pergamino. La Hiel en tu sistema reacciona y te inundan visiones —gritos amortiguados, hierro ceremonial y una Santiago colonial tomada por fuego—

CONSECUENCIA: Comprendes la naturaleza del Ancla, pero la visión te desorienta y la Bestia se agita ante la injusticia del pacto.

RESULTADO: humanityDelta: -1 | setFlag: vision_1814 | IR A [BLOQUE 2]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n4_2",
          effects: [
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "vision_1814" },
            { type: "setFlag", flag: "verdad_del_pacto" },
            { type: "setFlag", flag: "conocimiento_del_ancla" },
            { type: "setFlag", flag: "secreto_del_hermano" },
            { type: "setFlag", flag: "lore_cuarentena" },
            { type: "setFlag", flag: "novel_ch4_lineage_mapped" },
          ],
        },
      ],
    },
    {
      id: "n4_2",
      chapterId: "chapter04",
      title: "[ESCENA 4.2]: LA EMBOSCADA EN LOS ANAQUELES",
      text: `CONTEXTO: Pasillos de la Hemeroteca y Salón de Lectura de la Biblioteca Nacional. La iluminación de emergencia tiñe los anaqueles de un rojo tenue.

NARRACIÓN: El cristal de una claraboya revienta encima. No es policía de barrio: es Limpieza de la Corte, ghouls en negro táctico con silenciadores, bajando desde arriba.

La red del edificio se cierra; Inés no te mintió del todo en Plaza de Armas, pero le faltó decir que un testigo vivo molesta al Príncipe tanto como el secreto.

Salir ya, antes del taponamiento total o del sol tras Santa Lucía.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "infiltracion_fantasma", equals: true },
          text: "Como llegaste como infiltración fantasma, oyes primero la coordinación táctica antes de que el despliegue te localice contra la vista de un encuadre convencional de cámara.",
        },
        {
          requirement: { type: "flag", flag: "alerta_biblioteca_activa", equals: true },
          text: "Si arrastras alerta desde entradas forzadas o sensores disparados antes, irrumpen ya disparando contra la zona de la mesa donde estuvo el Archivista apenas segundos atrás.",
        },
      ],
      flagAppends: [
        {
          flag: "entrada_limpia_biblioteca",
          text: "Entraste limpio de registro inicial: ese margen cuenta cuando cruzas la hemeroteca bajo sirena táctica porque no aparecías en libro de guardia como visitante habitual.",
        },
        {
          flag: "aliado_archivista",
          text: "El Archivista, sin mover apenas la mandíbula, te señaló antes el montacargas de libros detrás del periódico decimonónico donde el papel hace barrera táctica igual que piedra apenas empujas el carro viejo contra el cerco nuevo.",
        },
      ],
      options: [
        {
          id: "n4_2_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Avanzar frontalmente por el pasillo central, usando los estantes metálicos como escudo.

PUENTE: No te escondes. Tu piel se endurece hasta adquirir la densidad del granito. Las balas de los ghouls impactan en ti, pero apenas logran rasgar el traje. Avanzas con una parsimonia aterradora, derribando los estantes pesados sobre los tiradores para abrirte camino hasta la salida hacia la Alameda.

CONSECUENCIA: Sales por la puerta principal después de atravesar la resistencia a quemarropa.

RESULTADO: healthDamageDelta: -1 | setFlag: escape_por_fuerza | IR A [ESCENA 4.END]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n4_end",
          effects: [
            { type: "healthDamageDelta", delta: 1 },
            { type: "setFlag", flag: "escape_por_fuerza" },
            { type: "setFlag", flag: "alerta_biblioteca_activa" },
            { type: "setFlag", flag: "traicion_ines" },
            { type: "setFlag", flag: "herida_escape" },
            { type: "setFlag", flag: "chapter05_needs_blood" },
          ],
        },
        {
          id: "n4_2_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN B [DISCIPLINA: DOMINACIÓN]: Ordenar al líder del equipo de asalto que se vuelva contra sus propios hombres.

PUENTE: Te parapetas tras un pilar de mármol. Cuando el líder ordena flanqueo, proyectas tu voluntad con un golpe mental. «Tus hombres son traidores del Sabat. ¡Elimínalos!», lanzas sin alzar la voz en el mundo físico pero con estruendo en la suya.

CONSECUENCIA: El caos sangriento te cubre la retirada: bajas por escaleras de servicio mientras los operativos se masacran entre sí en el pasillo de la Hemeroteca.

RESULTADO: hungerDelta: +1 | setFlag: masacre_biblioteca | IR A [ESCENA 4.END]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n4_end",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "masacre_biblioteca" },
            { type: "setFlag", flag: "alerta_biblioteca_activa" },
            { type: "setFlag", flag: "traicion_ines" },
            { type: "setFlag", flag: "chapter05_needs_blood" },
          ],
        },
        {
          id: "n4_2_montacargas",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Escapar por el montacargas de libros hacia el túnel de servicio ligado al Metro.

PUENTE: Sigues la indicación que te dio el Archivista —o tu memoria táctica cuando no hubo tiempo de palabras—. Entras en el hueco angosto del montacargas manual; caes en un sótano oscuro que enlaza túneles de drenaje antiguos y, desde ahí, pasillos de mantenimiento hacia la estación Santa Lucía.

CONSECUENCIA: Sales sin registrar huella ante los sistemas rutinarios del edificio, pero pierdes el contacto con el Archivista y debes abandonar parte del equipo pesado para no quedar trabado entre tubos y rejillas.

RESULTADO: setFlag: escape_subterraneo | IR A [ESCENA 4.END]`,
          requirement: { type: "none" },
          nextSceneId: "n4_end",
          effects: [
            { type: "setFlag", flag: "escape_subterraneo" },
            { type: "setFlag", flag: "traicion_ines" },
          ],
        },
      ],
    },
    {
      id: "n4_end",
      chapterId: "chapter04",
      title: "[ESCENA 4.END]: LA HUIDA AL REFUGIO",
      text: `CONTEXTO: Calles aledañas al Cerro Santa Lucía / barrio Lastarria. 06:15 de la mañana. La luz solar ya es una amenaza real en los tejados.

NARRACIÓN: Sales a la superficie por una alcantarilla o por una puerta de servicio apenas registrada. El aire de la mañana es peligrosamente nítido. Necesitas sombra y un lugar para entrar en letargo antes de que el sol termine de subir.`,
      contextVariantByState: [
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "verdad_del_pacto", equals: true },
              { type: "flag", flag: "coordenadas_catedral", equals: true },
            ],
          },
          text: "Lo que trajiste bajo plano vale más guardado vivo que ostentado sobre la mesa: Lastarria ofrece mezcla de rumor y alcantarilla antes del sol alto.",
        },
        {
          requirement: { type: "flag", flag: "masacre_biblioteca", equals: true },
          text: "Las hemerotecas siguen echando ceniza reputacional: cualquier ejecutor de Torre puede leerte como traidor si no cambias ritmo antes del próximo cerco institucional.",
        },
        {
          requirement: { type: "flag", flag: "escape_por_fuerza", equals: true },
          text: "Corres por la calle Mac Iver con el sol quemando la nuca hasta encontrar un vehículo, un portón entreabierto o un callejón que te conceda sombra unos minutos antes del amanecer completo.",
        },
        {
          requirement: { type: "flag", flag: "escape_subterraneo", equals: true },
          text: "Apareces en un patio interior en Lastarria; a pocas cuadras está el Palacio Bruna, pero también es territorio hostil donde la Corte marca presencia y el rumor corre rápido.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "aliado_archivista", equals: true },
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "escape_por_fuerza", equals: true },
                    { type: "flag", flag: "escape_subterraneo", equals: true },
                  ],
                },
              },
            ],
          },
          text: "La pista del piso franco en Villavicencio vuelve antes de que el sol reclame cada techo.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "not", requirement: { type: "flag", flag: "aliado_archivista", equals: true } },
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "escape_subterraneo", equals: true },
                    { type: "flag", flag: "escape_por_fuerza", equals: true },
                  ],
                },
              },
            ],
          },
          text: "Sin ese dato solo queda el trayecto largo bajo el alba hacia la Viña del Silencio afuera del cordón urbano.",
        },
        {
          requirement: { type: "flag", flag: "mapa_tuneles_catedral", equals: true },
          text: "Todavía llevas el mapa que conecta el archivo subterráneo con la traza hacia la Catedral.",
        },
      ],
      options: [
        {
          id: "n4_end_ruta_nodo",
          type: "dialogue",
          text: `Prioridad: esconder la información en Lastarria antes de que el sol te ate al centro.

CONSECUENCIA: Tomas el lateral hacia el siguiente tramo con la Catedral todavía como idea magnética sobre el material que conservas.

RESULTADO: chapter05_route_nodo_catedral | coordenada_lastarria | chapter_pending_chapter05`,
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "verdad_del_pacto", equals: true },
              { type: "flag", flag: "coordenadas_catedral", equals: true },
            ],
          },
          nextSceneId: "n4_end",
          effects: [
            { type: "setFlag", flag: "chapter05_route_nodo_catedral" },
            { type: "setFlag", flag: "coordenada_lastarria" },
            { type: "setFlag", flag: "chapter_pending_chapter05" },
          ],
        },
        {
          id: "n4_end_ruta_tierra",
          type: "dialogue",
          text: `Huir hacia la periferia Buin / Viña con el cuerpo marcado por la salida frontal.

CONSECUENCIA: Sangre y tierra quedan como marco antes de volver a mirar el centro desde lejos.

RESULTADO: chapter05_route_huida_periferia | chapter_pending_chapter05`,
          requirement: { type: "flag", flag: "escape_por_fuerza", equals: true },
          nextSceneId: "n4_end",
          effects: [
            { type: "setFlag", flag: "chapter05_route_huida_periferia" },
            { type: "setFlag", flag: "chapter_pending_chapter05" },
          ],
        },
        {
          id: "n4_end_ruta_renegado",
          type: "dialogue",
          text: `Ante la masacre en la hemeroteca, la Corte puede leerte como traidor si no cortas distancia con Inés.

CONSECUENCIA: Vas fugitivo hacia una sombra que no parezca celda institucional.

RESULTADO: chapter05_route_renegado_biblioteca | fugitivo_corte | chapter_pending_chapter05`,
          requirement: { type: "flag", flag: "masacre_biblioteca", equals: true },
          nextSceneId: "n4_end",
          effects: [
            { type: "setFlag", flag: "chapter05_route_renegado_biblioteca" },
            { type: "setFlag", flag: "fugitivo_corte" },
            { type: "setFlag", flag: "chapter_pending_chapter05" },
          ],
        },
        {
          id: "n4_end_ruta_refugio_legacy",
          type: "dialogue",
          text: `Refugio entre anarquistas del cordón: una alerta antigua en la Biblioteca te empujó lejos de credenciales limpias.

RESULTADO: chapter05_route_refugio_ceniza | fugitivo_corte | chapter_pending_chapter05`,
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "alerta_biblioteca_activa", equals: true },
              { type: "not", requirement: { type: "flag", flag: "masacre_biblioteca", equals: true } },
            ],
          },
          nextSceneId: "n4_end",
          effects: [
            { type: "setFlag", flag: "chapter05_route_refugio_ceniza" },
            { type: "setFlag", flag: "fugitivo_corte" },
            { type: "setFlag", flag: "alianza_anarquista" },
            { type: "setFlag", flag: "chapter_pending_chapter05" },
          ],
        },
        {
          id: "n4_end_ruta_vina_legacy",
          type: "dialogue",
          text: `Seguir el tirón del secreto del Hermano sin combate principal en la salida de la Alameda.

RESULTADO: chapter_pending_chapter05`,
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "secreto_del_hermano", equals: true },
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "verdad_del_pacto", equals: true },
                    { type: "flag", flag: "coordenadas_catedral", equals: true },
                    { type: "flag", flag: "escape_por_fuerza", equals: true },
                    { type: "flag", flag: "masacre_biblioteca", equals: true },
                  ],
                },
              },
            ],
          },
          nextSceneId: "n4_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter05" }],
        },
        {
          id: "n4_end_default",
          type: "dialogue",
          text: "Continuar al Capítulo 5 sin ruta prioritaria marcada en el briefing nuevo.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              { type: "not", requirement: { type: "flag", flag: "verdad_del_pacto", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "coordenadas_catedral", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "escape_por_fuerza", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "masacre_biblioteca", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "alerta_biblioteca_activa", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "secreto_del_hermano", equals: true } },
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
          effects: [
            { type: "setFlag", flag: "chapter05_special_ines_blackmail" },
            { type: "setFlag", flag: "doble_agente" },
          ],
        },
      ],
    },
  ],
};
