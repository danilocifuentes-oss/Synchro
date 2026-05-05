import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Arco nuevo: salida del colapso del cap. 6 hacia plaza / Palacio (ruta explícita cap. 6). */
const reqArcoPalacioPostAncla = {
  type: "all" as const,
  requirements: [
    { type: "flag" as const, flag: "chapter06_ancla_1814_colapsada", equals: true },
    {
      type: "any" as const,
      requirements: [
        { type: "flag" as const, flag: "chapter07_route_santiago_en_llamas", equals: true },
        { type: "flag" as const, flag: "chapter07_route_ascenso_tirano", equals: true },
      ],
    },
  ],
};

const reqLegadoSinColapsoCap6 = {
  type: "not" as const,
  requirement: { type: "flag" as const, flag: "chapter06_ancla_1814_colapsada", equals: true },
};

/** Arco plaza: llegaste al cierre sin mapas ni suministros ni pacto explícito con Inés tras 7.2. */
const reqArcoSinBifurcacion72 = {
  type: "all" as const,
  requirements: [
    reqArcoPalacioPostAncla,
    { type: "not" as const, requirement: { type: "flag" as const, flag: "mapas_de_la_cordillera", equals: true } },
    {
      type: "not" as const,
      requirement: { type: "flag" as const, flag: "suministros_reales_capturados", equals: true },
    },
    { type: "not" as const, requirement: { type: "flag" as const, flag: "alianza_ines_final", equals: true } },
  ],
};

export const chapter07: SoloChapter = {
  id: "chapter07",
  title: "Santiago en Cenizas · CAPÍTULO 7: EL DIES IRAE",
  description:
    "Plaza en llamas, Merced y Forestal, interior del Palacio Bruna en asfixia y cierre en la terraza ante la Viña y la cordillera.",
  startSceneId: "n7_0",
  scenes: [
    {
      id: "n7_0",
      chapterId: "chapter07",
      title: "[ESCENA 7.0]: PLAZA DE ARMAS EN LLAMAS",
      text: `CONTEXTO: Exterior de la Catedral Metropolitana. 03:30 AM. El humo de los incendios cercanos se mezcla con la neblina nocturna.

NARRACIÓN: Sales de la Catedral justo cuando las campanas de la torre principal emiten un tañido distorsionado y caen al vacío, estrellándose contra el pavimento. La Plaza de Armas es un caos: sirenas de bomberos a lo lejos, mortales huyendo en pánico y, en las sombras de los portales, el brillo de ojos que ya no temen tanto al castigo del Príncipe.

El alba deja de ser abstracta: tu próximo movimiento define la noche antes de que el sol ponga fin a esta guerra.`,
      contextLeadInByState: [
        {
          requirement: {
            type: "all",
            requirements: [
              reqArcoPalacioPostAncla,
              { type: "flag", flag: "chapter07_route_santiago_en_llamas", equals: true },
            ],
          },
          text: "El recorrido elegido en el colapso apunta a Santiago en llamas: la plaza es el primer campamento antes de Bruna.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              reqArcoPalacioPostAncla,
              { type: "flag", flag: "chapter07_route_ascenso_tirano", equals: true },
            ],
          },
          text: "El recorrido elegido en el colapso apunta al ascenso del tirano: el nexo nuevo pesa tan fuerte como el humo sobre la plaza.",
        },
      ],
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          text: "Los vástagos que patrullaban la zona están desorientados, con manos en la sien mientras el Vínculo de Sangre se deshace en sus venas.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "ancla_muerta", equals: true },
              { type: "not", requirement: { type: "flag", flag: "vinculo_destruido", equals: true } },
            ],
          },
          text: "El sistema no estalló solo por la fuerza bruta del cristal: el silencio ritual dejó el mismo vacío en la calle, con discusiones que suben de tono entre Clanes.",
        },
        {
          requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true },
          text: "Sientes cada mente cercana como un hilo que tira de tu consciencia: el poder es embriagador, pero la carga resulta asfixiante.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "diablerista_ancestral", equals: true },
              { type: "not", requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true } },
            ],
          },
          text: "Una segunda voz mal domada repite latidos ajenos bajo el cráneo; la plaza parece devolverte eco que no iniciaste tú.",
        },
      ],
      options: [
        {
          id: "n7_0_presencia_milicia",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Reunir a los vástagos desorientados de la plaza para formar una milicia bajo tu mando.

PUENTE: Te subes a los restos de una patrulla volcada. Proyectas tu Majestad no como un tirano, sino como el único faro de orden en medio del desastre. «El Príncipe os encadenó, pero yo os daré un propósito. ¡Al Palacio Bruna!», gritas. La multitud de vampiros errantes se detiene y, por miedo o admiración, se alinea detrás de ti.

CONSECUENCIA: Creas una fuerza de choque masiva: el asalto final al Palacio te favorece en números, pero te conviertes en el blanco principal de los francotiradores de la Corte.

RESULTADO: willpowerDelta: -1 | setFlag: ejercito_de_la_plaza | IR A [ESCENA 7.1]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          visibilityRequirement: reqArcoPalacioPostAncla,
          nextSceneId: "n7_1",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "ejercito_de_la_plaza" }],
        },
        {
          id: "n7_0_callejeo_sigilo_techos",
          type: "skill",
          skill: "callejeo",
          text: `OPCIÓN B [HABILIDAD: CALLEJEO / SIGILO]: Aprovechar el caos para infiltrarte hacia el Palacio Bruna por los techos.

PUENTE: No buscas liderar a la masa. Te lanzas hacia las cornisas de los edificios del Paseo Phillips, saltando de azotea en azotea mientras evitas las luces de los helicópteros de la policía que empiezan a sobrevolar el centro. Desde las alturas ves cómo las calles que llevan al Parque Forestal están bloqueadas por barricadas de la Guardia de la Torre.

CONSECUENCIA: Llegas al perímetro del Palacio sin haber gastado tanto recurso en combate callejero; observas las defensas finales del Príncipe desde una posición privilegiada.

RESULTADO: setFlag: observador_del_asedio | IR A [ESCENA 7.1]`,
          requirement: {
            type: "any",
            requirements: [
              { type: "skill", skill: "callejeo", minLevel: 1 },
              { type: "skill", skill: "sigilo", minLevel: 1 },
            ],
          },
          visibilityRequirement: reqArcoPalacioPostAncla,
          nextSceneId: "n7_1",
          effects: [{ type: "setFlag", flag: "observador_del_asedio" }],
        },
        {
          id: "n7_0_vehiculo",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Abrirte paso en coche si lo conservas o requisar uno para llegar al Palacio.

PUENTE: El tiempo cuenta. Atraviesas la plaza esquivando escombros y te haces con un vehículo abandonado. Conduces a toda velocidad por calle Monjitas, usando el coche como ariete contra patrullas menores que intentan mantener un perímetro alrededor de la zona diplomática.

CONSECUENCIA: Llegas rápido, pero el coche termina destrozado y tu entrada alerta a los defensores sobre tu posición exacta.

RESULTADO: healthDamageDelta: -1 | setFlag: llegada_violenta_final | IR A [ESCENA 7.1]`,
          requirement: { type: "none" },
          visibilityRequirement: reqArcoPalacioPostAncla,
          nextSceneId: "n7_1",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "llegada_violenta_final" }],
        },
        {
          id: "n7_0_arc_fallback",
          type: "dialogue",
          text: `Avanzar a pie junto al flujo de la multitud desbocada hacia Merced sin una pieza destacada en la táctica previa —sigues igual de expuesto ante la Torre.`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoPalacioPostAncla,
              { type: "not", requirement: { type: "discipline", discipline: "presence", minLevel: 1 } },
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "skill", skill: "callejeo", minLevel: 1 },
                    { type: "skill", skill: "sigilo", minLevel: 1 },
                  ],
                },
              },
            ],
          },
          nextSceneId: "n7_1",
          effects: [],
        },
        {
          id: "n7_0_legacy_sigilo",
          type: "skill",
          skill: "sigilo",
          text: "Evadir a los Vigilantes y entrar sin ser detectado.",
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          visibilityRequirement: reqLegadoSinColapsoCap6,
          nextSceneId: "n7_leg_osario",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "entrada_limpia" }],
        },
        {
          id: "n7_0_legacy_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Llaves maestras",
          text: "Forzar al sacristán a abrirte el camino.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "dominate", minLevel: 1 },
              { type: "flag", flag: "mision_castigo", equals: true },
            ],
          },
          visibilityRequirement: reqLegadoSinColapsoCap6,
          nextSceneId: "n7_leg_osario",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "llaves_maestras" }],
        },
        {
          id: "n7_0_legacy_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Venas bajo el altar",
          text: "Sentir el flujo de la Hiel bajo el altar mayor.",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          visibilityRequirement: reqLegadoSinColapsoCap6,
          nextSceneId: "n7_leg_osario",
          effects: [{ type: "setFlag", flag: "pacto_iglesia_revelado" }],
        },
        {
          id: "n7_0_legacy_entrada",
          type: "dialogue",
          text: "Cruzar la nave como quien no tiene nada que esconder: máxima exposición, mínima sutileza.",
          requirement: { type: "none" },
          visibilityRequirement: reqLegadoSinColapsoCap6,
          nextSceneId: "n7_leg_osario",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "catedral_entrada_franca" }],
        },
      ],
    },
    {
      id: "n7_1",
      chapterId: "chapter07",
      title: "[ESCENA 7.1]: EL PERÍMETRO DEL FORESTAL",
      text: `CONTEXTO: Intersección de calle Merced con el Parque Forestal, a una cuadra del Palacio Bruna.

NARRACIÓN: El Palacio Bruna arde. No es un incendio accidental: es una purga. Las llamas lamen ventanas neoclásicas mientras los últimos leales al Príncipe intentan contener a una turba de anarquistas y vástagos liberados que asedian el edificio.

En medio del caos divisas a Doña Inés. Está herida, apoyada contra una estatua del parque, empuñando su espada de plata con la mano temblorosa. Te mira llegar y, por primera vez, hay algo parecido a la súplica en sus ojos de cristal.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "ejercito_de_la_plaza", equals: true },
          text: "Tus hombres chocaron contra la guardia exterior en una lluvia de ceniza y acero antes de que el humo cerrara medio campo visual.",
        },
      ],
      options: [
        {
          id: "n7_1_domina_llave",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Ordenar a Inés que te entregue la llave maestra de las cámaras acorazadas del Palacio.

PUENTE: Te acercas con frialdad de ejecutor. «Se acabó, Inés. Dame la llave y jura lealtad al nuevo orden, o quédate aquí hasta que el sol te encuentre», ordenas. Tu voz resuena con tanta fuerza que ella, debilitada, entrega el dispositivo electrónico casi sin resistencia.

CONSECUENCIA: Obtienes acceso a los niveles inferiores del Palacio, donde el soberano guarda tesoros y rutas de escape.

RESULTADO: setFlag: llave_maestra_bruna | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          visibilityRequirement: reqArcoPalacioPostAncla,
          nextSceneId: "n7_2",
          effects: [{ type: "setFlag", flag: "llave_maestra_bruna" }],
        },
        {
          id: "n7_1_medicina_aliado",
          type: "skill",
          skill: "medicina",
          text: `OPCIÓN B [HABILIDAD: MEDICINA / HUMANIDAD]: Ayudar a Inés a cambio de que te guíe por una entrada secreta.

PUENTE: Usas tus conocimientos para cerrar sus heridas más graves. «No tiene por qué terminar así para ti», dices. Ella asiente con gratitud amarga y te señala un túnel de servicio oculto bajo la fuente de agua del parque que lleva directamente al despacho del Príncipe.

CONSECUENCIA: Ganas una aliada poderosa para el combate final y una ruta de infiltración segura.

RESULTADO: humanityDelta: +1 | setFlag: alianza_ines_final | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "medicina", minLevel: 1 },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoPalacioPostAncla,
              { type: "skill", skill: "medicina", minLevel: 1 },
            ],
          },
          nextSceneId: "n7_2",
          effects: [
            { type: "humanityDelta", delta: 1 },
            { type: "setFlag", flag: "alianza_ines_final" },
          ],
        },
        {
          id: "n7_1_humanidad_compasion",
          type: "dialogue",
          text: `OPCIÓN B [HABILIDAD: MEDICINA / HUMANIDAD]: Ayudar a Inés a cambio de que te guíe por una entrada secreta.

PUENTE: Sin formación clínica formal, igual arriesgas vitae para contener lo peor antes de que se desangre ante el mismo trono que os persigue. «No tiene por qué terminar así para ti», dices. Ella asiente con gratitud amarga y te señala un túnel de servicio oculto bajo la fuente de agua del parque que lleva directamente al despacho del Príncipe.

CONSECUENCIA: Ganas una aliada poderosa para el combate final y una ruta de infiltración segura.

RESULTADO: humanityDelta: +1 | setFlag: alianza_ines_final | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoPalacioPostAncla,
              {
                type: "not",
                requirement: { type: "skill", skill: "medicina", minLevel: 1 },
              },
            ],
          },
          nextSceneId: "n7_2",
          effects: [
            { type: "humanityDelta", delta: 1 },
            { type: "setFlag", flag: "alianza_ines_final" },
          ],
        },
        {
          id: "n7_1_asalto_directo",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Ignorar a Inés y lanzarte al asalto del portón principal.

PUENTE: No te detienes ante los caídos. Saltas la verja de hierro y te abres paso entre fuego y escombros. Tu objetivo es el Príncipe; atraviesas el jardín mientras las balas silban a tu alrededor.

CONSECUENCIA: Entras por la ruta más peligrosa y te enfrentas a la guardia de élite en el vestíbulo.

RESULTADO: healthDamageDelta: -1 | setFlag: asalto_porton_principal | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          visibilityRequirement: reqArcoPalacioPostAncla,
          nextSceneId: "n7_2",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "asalto_porton_principal" }],
        },
      ],
    },
    {
      id: "n7_2",
      chapterId: "chapter07",
      title: "[ESCENA 7.2]: EL PALACIO EN ASFIXIA",
      text: `CONTEXTO: Pasillos internos del Palacio Bruna. El aire está cargado de humo y el olor a ozono de los sistemas de seguridad quemados.

NARRACIÓN: El interior del Palacio es un laberinto de lujo en ruinas. No encuentras al Príncipe en su salón. En su lugar, el Palacio parece estar siendo vaciado. Documentos ardiendo, cajas fuertes abiertas y un rastro de Hiel líquida que gotea desde las molduras del techo. La infección que intentaste detener en la Catedral no ha desaparecido; se ha trasladado aquí, al centro administrativo de la ciudad.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "llave_maestra_bruna", equals: true },
          text: "Por la llave maestra los ascensores privados te dejaron en el ala este, lejos de los gritos de la batalla en el jardín.",
        },
        {
          requirement: { type: "flag", flag: "asalto_porton_principal", equals: true },
          text: "Tras el asalto al portón los pasillos están sembrados de ceniza de los defensores que cayeron antes de tu llegada.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "alianza_ines_final", equals: true },
              { type: "not", requirement: { type: "flag", flag: "llave_maestra_bruna", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "asalto_porton_principal", equals: true } },
            ],
          },
          text: "La ruta bajo la fuente te metió en los costados del edificio: humo cerrado pero sin el frente donde aún traban la guardia y la turba.",
        },
      ],
      options: [
        {
          id: "n7_2_auspex_azotea",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Auspex",
          text: `OPCIÓN A [DISCIPLINA: AUSPEX]: Rastrear la firma de sangre del Príncipe entre el caos del edificio.

PUENTE: Te concentras en lo térmico y la esencia de la sangre. No sigues el humo sino una estela de frío místico que trepa hacia la azotea. El Príncipe no parece huir hacia las profundidades: busca altura.

CONSECUENCIA: Encuentras ruta rápida por escaleras de servicio, evitando trampas explosivas en los pasillos principales.

RESULTADO: setFlag: rastro_hacia_la_azotea | IR A [ESCENA 7.END]`,
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          visibilityRequirement: reqArcoPalacioPostAncla,
          nextSceneId: "n7_end_arc",
          effects: [{ type: "setFlag", flag: "rastro_hacia_la_azotea" }],
        },
        {
          id: "n7_2_investigacion_mapas",
          type: "skill",
          skill: "investigacion",
          text: `OPCIÓN B [HABILIDAD: INVESTIGACIÓN]: Saquear los archivos privados del Príncipe antes de que el fuego los consuma.

PUENTE: Dejas pasar por un momento la persecución. Te lanzas a la caja fuerte del despacho. Rescatar un libro de contabilidad oculto y un mapa cordillerano con puntos marcados en rojo cuesta minutos cara al incendio. Entiendes que el Ancla de la Catedral fue solo uno entre muchos.

CONSECUENCIA: Obtienes información estratégica invaluable para más adelante; pierdes tiempo mientras la estructura se debilita arriba.

RESULTADO: setFlag: mapas_de_la_cordillera | IR A [ESCENA 7.END]`,
          requirement: { type: "skill", skill: "investigacion", minLevel: 1 },
          visibilityRequirement: reqArcoPalacioPostAncla,
          nextSceneId: "n7_end_arc",
          effects: [{ type: "setFlag", flag: "mapas_de_la_cordillera" }],
        },
        {
          id: "n7_2_convoy_ghouls",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Interceptar a un convoy de la Guardia de la Torre que intenta huir con un cargamento secreto.

PUENTE: Escuchas motores en el garaje subterráneo. Te lanzas por el hueco de la escalera y bloqueas la salida de una camioneta blindada. Tras un breve intercambio de fuego obligas a los ghoul a mostrar el cargamento: viales de sangre pura, fechados incluso hasta el siglo XIX.

CONSECUENCIA: Aseguras suministro de alta calidad y golpeas la logística del Príncipe, pero quedas atrapado en el subsuelo mientras lo alto del edificio se desmorona.

RESULTADO: hungerDelta: -3 | setFlag: suministros_reales_capturados | IR A [ESCENA 7.END]`,
          requirement: { type: "none" },
          visibilityRequirement: reqArcoPalacioPostAncla,
          nextSceneId: "n7_end_arc",
          effects: [
            { type: "hungerDelta", delta: -3 },
            { type: "setFlag", flag: "suministros_reales_capturados" },
          ],
        },
      ],
    },
    {
      id: "n7_end_arc",
      chapterId: "chapter07",
      title: "[ESCENA 7.END]: EL CIELO DE PLOMO",
      text: `CONTEXTO: Terraza superior del Palacio Bruna, con vista al Parque Forestal y al Museo de Bellas Artes. 04:30 AM.

NARRACIÓN: Llegas arriba. El viento de la madrugada azota tu rostro y trae el olor del incendio. Santiago, desde esta altura, parece una cuadrícula de luces que tiembla con la electricidad inestable.

De las sombras de la cúpula emerge una figura que no es el Príncipe sino el Hombre del Traje Gris. Te observa con una sonrisa gélida: «El Príncipe ya no está en el tablero, Embajador. Era solo el jardinero. Ahora los verdaderos dueños de la Viña vienen a reclamar la cosecha».

A lo lejos, hacia la cordillera, una luz púrpura tiñe los cerros: el Capítulo 7 cierra la caída de la Corte local y abre una amenaza a escala nacional.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "rastro_hacia_la_azotea", equals: true },
          text: "Divisas un helicóptero privado cerrando desde el este: no llega solo a rescatar al Príncipe. Viene a recoger algo o a alguien más urgente.",
        },
      ],
      options: [
        {
          id: "n7_end_arc_cap8_andes",
          type: "dialogue",
          text: "Capítulo 8: El Aliento de los Andes — seguir los puntos de extracción en los cerros con los mapas rescatados.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoPalacioPostAncla,
              { type: "flag", flag: "mapas_de_la_cordillera", equals: true },
            ],
          },
          nextSceneId: "n7_end_arc",
          effects: [
            { type: "setFlag", flag: "chapter08_route_aliento_andes" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
        {
          id: "n7_end_arc_cap8_cota",
          type: "dialogue",
          text: "Capítulo 8: Cacería en la Cota Mil — el Traje Gris ya envía recolectores; el cargamento marca tu posición.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoPalacioPostAncla,
              { type: "flag", flag: "suministros_reales_capturados", equals: true },
            ],
          },
          nextSceneId: "n7_end_arc",
          effects: [
            { type: "setFlag", flag: "chapter08_route_caceria_cota_mil" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
        {
          id: "n7_end_arc_cap8_maipo",
          type: "dialogue",
          text: "Capítulo 8: El Refugio del Hierro — Inés te susurra al oído dónde huyó el Príncipe: Cajón del Maipo.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoPalacioPostAncla,
              { type: "flag", flag: "alianza_ines_final", equals: true },
            ],
          },
          nextSceneId: "n7_end_arc",
          effects: [
            { type: "setFlag", flag: "chapter08_route_refugio_hierro" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
        {
          id: "n7_end_arc_cap8_llamas",
          type: "dialogue",
          text: "Capítulo 8: La Noche de los Cuchillos Largos — sin pista nueva, la calle donde empezaste la noche reclama orden o caos.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoSinBifurcacion72,
              { type: "flag", flag: "chapter07_route_santiago_en_llamas", equals: true },
            ],
          },
          nextSceneId: "n7_end_arc",
          effects: [
            { type: "setFlag", flag: "chapter08_route_cuchillos_largos" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
        {
          id: "n7_end_arc_cap8_judas",
          type: "dialogue",
          text: "Capítulo 8: Pactos y ejecutores — afianzar el nuevo orden ante leales rezagados del jardín viejo.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoSinBifurcacion72,
              { type: "flag", flag: "chapter07_route_ascenso_tirano", equals: true },
            ],
          },
          nextSceneId: "n7_end_arc",
          effects: [
            { type: "setFlag", flag: "chapter08_route_pacto_judas" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
        {
          id: "n7_end_arc_cap8_fallback",
          type: "dialogue",
          text: "Continuar — el siguiente capítulo queda marcado hasta que definamos ramas finas para tu rastro.",
          requirement: { type: "none" },
          visibilityRequirement: reqArcoSinBifurcacion72,
          nextSceneId: "n7_end_arc",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter08" }],
        },
      ],
    },
    {
      id: "n7_leg_osario",
      chapterId: "chapter07",
      title: "7.1 (legado): El descenso al osario",
      text: `Cripta de los Obispos. Escaleras de caracol de piedra gastada. Luz de velas.

Al final del pasillo espera una puerta de hierro con sello V. Si estás vinculado, tu cuerpo tiembla: la sangre te ordena arrodillarte.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_sangre", equals: true },
          text: "El Vínculo te castiga por cada paso hacia el secreto de tu Padre.",
        },
      ],
      options: [
        {
          id: "n7_leg_osario_will",
          type: "dialogue",
          text: "Forzar el giro de la llave pese a la agonía del vínculo.",
          requirement: { type: "none" },
          nextSceneId: "n7_leg_mapocho",
          effects: [{ type: "willpowerDelta", delta: -2 }, { type: "setFlag", flag: "puerta_abierta" }],
        },
        {
          id: "n7_leg_osario_occult",
          type: "skill",
          skill: "ocultismo",
          text: "Usar un ritual menor para engañar la cerradura mística.",
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "ocultismo", minLevel: 1 },
              { type: "flag", flag: "lore_cuarentena", equals: true },
            ],
          },
          nextSceneId: "n7_leg_mapocho",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "acceso_legitimo" }],
        },
        {
          id: "n7_leg_osario_fort",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Cruzar sangrando",
          text: "Resistir el castigo del vínculo por puro aguante.",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n7_leg_mapocho",
          effects: [{ type: "healthDamageDelta", delta: -1 }, { type: "setFlag", flag: "puerta_forzada" }],
        },
      ],
    },
    {
      id: "n7_leg_mapocho",
      chapterId: "chapter07",
      title: "7.2 (legado): El recuerdo del muchacho",
      text: `Cámara secreta con luz roja tenue. En el centro, un sarcófago de cristal.

Dentro yace el muchacho del Mapocho, aún "vivo", conectado por tubos de plata que mezclan su sangre con la Hiel.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "traicion_principe_vista", equals: true },
          text: "Comprendes la verdad: este joven es el ancla del Vínculo de Sangre de toda la ciudad.",
        },
      ],
      options: [
        {
          id: "n7_leg_mapocho_humanidad",
          type: "dialogue",
          text: "Liberarlo y terminar con su tormento.",
          requirement: { type: "none" },
          nextSceneId: "n7_end",
          effects: [{ type: "humanityDelta", delta: 1 }, { type: "setFlag", flag: "vinculo_destruido" }],
        },
        {
          id: "n7_leg_mapocho_ambicion",
          type: "dialogue",
          text: "Reclamar para ti el control del Vínculo.",
          requirement: { type: "flag", flag: "dueno_lastarria", equals: true },
          nextSceneId: "n7_end",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "usurpador_del_vinculo" }],
        },
        {
          id: "n7_leg_mapocho_medic",
          type: "skill",
          skill: "medicina",
          text: "Estudiar el sistema para revertir la infección de Hiel.",
          requirement: { type: "skill", skill: "medicina", minLevel: 1 },
          nextSceneId: "n7_end",
          effects: [{ type: "setFlag", flag: "cura_encontrada" }],
        },
      ],
    },
    {
      id: "n7_end",
      chapterId: "chapter07",
      title: "7.E · Cierre del capítulo y puente",
      text: `La ciudad no vuelve a la calma institucional de antes: cualquier rumor siguiente ya nace desde la calle, el fuego y el pacto.`,
      contextVariantByState: [
        {
          requirement: reqArcoPalacioPostAncla,
          text: "El puente nuevo desde la Cámara del Ancla dejó la Torre menor y la plaza mayor al mismo nivel de rumor.",
        },
        {
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          text: "Un grito psíquico o un silencio hueco marca el mismo quiebre donde obedecieron sin preguntar.",
        },
        {
          requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true },
          text: "El poder llega cargado de diana: cada sombra nueva quiere reclamar hueco institucional.",
        },
      ],
      options: [
        {
          id: "n7_end_knives",
          type: "dialogue",
          text: "Continuar como ruta Santiago en llamas (legado previo al colapso del capítulo 6).",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "vinculo_destruido", equals: true },
              { type: "flag", flag: "ancla_muerta", equals: true },
            ],
          },
          visibilityRequirement: reqLegadoSinColapsoCap6,
          nextSceneId: "n7_end",
          effects: [
            { type: "setFlag", flag: "chapter08_route_cuchillos_largos" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
        {
          id: "n7_end_salvador",
          type: "dialogue",
          text: "Llevar la muestra a aliados antes de que la Corte cierre cerco (legado).",
          requirement: { type: "flag", flag: "cura_encontrada", equals: true },
          nextSceneId: "n7_end",
          effects: [
            { type: "setFlag", flag: "chapter08_route_salvador" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
        {
          id: "n7_end_judas",
          type: "dialogue",
          text: "Seguir pacto tirano desde legado anterior al colapso del capítulo 6.",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "usurpador_del_vinculo", equals: true },
              { type: "flag", flag: "diablerista_ancestral", equals: true },
            ],
          },
          visibilityRequirement: reqLegadoSinColapsoCap6,
          nextSceneId: "n7_end",
          effects: [
            { type: "setFlag", flag: "chapter08_route_pacto_judas" },
            { type: "setFlag", flag: "chapter_pending_chapter08" },
          ],
        },
        {
          id: "n7_end_arco_actual_listo",
          type: "dialogue",
          text: "Las banderas hacia el capítulo siguiente ya fueron marcadas en el último paso táctico.",
          requirement: { type: "none" },
          visibilityRequirement: reqArcoPalacioPostAncla,
          nextSceneId: "n7_end",
          effects: [],
        },
        {
          id: "n7_end_default",
          type: "dialogue",
          text: "Continuar al capítulo siguiente (marcador genérico).",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                reqArcoPalacioPostAncla,
                { type: "flag", flag: "cura_encontrada", equals: true },
              ],
            },
          },
          nextSceneId: "n7_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter08" }],
        },
      ],
    },
  ],
};
