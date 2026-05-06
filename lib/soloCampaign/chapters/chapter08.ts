import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Entrada «cordillera / Maipo» tras el cierre de Bruna (tres banderas de puente desde cap. 7). */
const reqArcoCap8Cordillera = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "chapter08_route_aliento_andes", equals: true },
    { type: "flag" as const, flag: "chapter08_route_refugio_hierro", equals: true },
    { type: "flag" as const, flag: "chapter08_route_caceria_cota_mil", equals: true },
  ],
};

export function resolveChapter08EntrySceneId(flags?: Record<string, boolean>): string {
  const f = flags ?? {};
  if (
    f.chapter08_route_aliento_andes ||
    f.chapter08_route_refugio_hierro ||
    f.chapter08_route_caceria_cota_mil
  ) {
    return "n8_andes_0";
  }
  return "n8_0";
}

export const chapter08: SoloChapter = {
  id: "chapter08",
  title: "Santiago en Cenizas · Capítulo 8 · Cuchillos largos y aliento de los Andes",
  description:
    "Plaza y Santa Lucía para quien llega por la ciudad; huida por Las Condes y la estación hidroeléctrica para quien sube hacia la Fuente Madre.",
  startSceneId: "n8_0",
  scenes: [
    {
      id: "n8_andes_0",
      chapterId: "chapter08",
      title: "[ESCENA 8.0]: HUIDA DE LA CUNA DE CENIZAS",
      text: `CONTEXTO: Periferia este de Santiago, subiendo por Avenida Las Condes hacia el Cajón del Maipo. 05:00 AM.

NARRACIÓN: El Palacio Bruna es ahora una columna de humo negro en el espejo retrovisor. A medida que gana altura el trayecto, la presión parece calmar la Hiel en tus venas o en el aire mismo. El aire resulta más despojado; hacia la montaña el cielo lleva un resplandor violeta eléctrico que no pinta como aurora. El Príncipe no huyó solo para ocultarse; huyó hacia la Fuente Madre.`,
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "chapter08_route_refugio_hierro", equals: true },
          text: "Vas en un vehículo escoltado por lo que queda de guardia leal: el pacto en Merced pagó un carril de salida antes de que la plaza ardiera del todo.",
        },
        {
          requirement: { type: "flag", flag: "chapter08_route_caceria_cota_mil", equals: true },
          text: "Conduces un blindado que ruge en la subida, consciente de que los satélites del Hombre del Traje Gris pueden estar mapeando tu calor corporal como firma de ruta.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "chapter08_route_aliento_andes", equals: true },
              { type: "not", requirement: { type: "flag", flag: "chapter08_route_refugio_hierro", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "chapter08_route_caceria_cota_mil", equals: true } },
            ],
          },
          text: "El mapa cordillerano va al tablero: cada curva te acerca a marcas que ya viste en lacre y papeles de la Torre, el mismo blasón que el anillo de sello del soberano en Bruna.",
        },
      ],
      options: [
        {
          id: "n8_andes_0_auspex_emboscadas",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Auspex",
          text: `OPCIÓN A [DISCIPLINA: AUSPEX]: Sintonizar tus sentidos con las vibraciones de la montaña para detectar emboscadas.

PUENTE: Cierras los ojos mientras el coche serpentea. No sigues el motor sino el eco del granito: drones de alta frecuencia sobre los riscos y pulso contenido que delata francotiradores en antiguas galerías de la plata.

CONSECUENCIA: Anticipas un bloqueo en la ruta principal y desviar el convoy por un camino secundario de tierra antes de que el blindaje liquide el escape.

RESULTADO: willpowerDelta: -1 | setFlag: camino_secundario_despejado | IR A [ESCENA 8.1]`,
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          visibilityRequirement: reqArcoCap8Cordillera,
          nextSceneId: "n8_andes_1",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "camino_secundario_despejado" }],
        },
        {
          id: "n8_andes_0_conducir_bloqueo",
          type: "skill",
          skill: "conducir",
          text: `OPCIÓN B [HABILIDAD: CONDUCIR / ACCIÓN]: Forzar el motor para romper un bloqueo de la seguridad privada en el camino al Cajón.

PUENTE: Luces estroboscópicas y todoterrenos grises sellan el puente. No frenas: apoyas el blindaje como mazo de dos toneladas contra el flanco más débil de la barricada entre chispas y metal retorcido.

CONSECUENCIA: Atraviesas el bloqueo por fuerza bruta. El vehículo queda maltrecho pero dejas atrás por un tramo a quienes te cerraban el paso.

RESULTADO: healthDamageDelta: -1 | setFlag: bloqueo_roto_fuerza | IR A [ESCENA 8.1]`,
          requirement: { type: "skill", skill: "conducir", minLevel: 1 },
          visibilityRequirement: reqArcoCap8Cordillera,
          nextSceneId: "n8_andes_1",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "bloqueo_roto_fuerza" }],
        },
        {
          id: "n8_andes_0_accion_bloqueo",
          type: "dialogue",
          text: `OPCIÓN B [HABILIDAD: CONDUCIR / ACCIÓN]: Forzar el paso a pura embestida sin dominar el volante como especialista.

PUENTE: Luces estroboscópicas y todoterrenos grises sellan el puente. No frenas: empujas el chasis con instinto de supervivencia hasta abrir un boquete insuficiente para elegancia pero suficiente para seguir vivos.

CONSECUENCIA: Atraviesas el bloqueo por fuerza bruta. El vehículo queda maltrecho pero dejas atrás por un tramo a quienes te cerraban el paso.

RESULTADO: healthDamageDelta: -1 | setFlag: bloqueo_roto_fuerza | IR A [ESCENA 8.1]`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoCap8Cordillera,
              { type: "not", requirement: { type: "skill", skill: "conducir", minLevel: 1 } },
            ],
          },
          nextSceneId: "n8_andes_1",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "bloqueo_roto_fuerza" }],
        },
        {
          id: "n8_andes_0_sigilo_sendero",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - SIGILO]: Abandonar el vehículo y seguir el ascenso a pie por senderos de arrieros.

PUENTE: Cualquier motor es faro para quien observa desde arriba. Dejas el coche en una quebrada y te internas entre espinos y boscaje precordillerano, borrando tu firma térmica en la medida que el terreno permite.

CONSECUENCIA: Cierras el tramo menos expuesto electrónicamente, pero el esfuerzo bajo la pre-alba te escapa hambre con rapidez.

RESULTADO: hungerDelta: +2 | setFlag: aproximacion_infanteria | IR A [ESCENA 8.1]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          visibilityRequirement: reqArcoCap8Cordillera,
          nextSceneId: "n8_andes_1",
          effects: [{ type: "hungerDelta", delta: 2 }, { type: "setFlag", flag: "aproximacion_infanteria" }],
        },
        {
          id: "n8_andes_0_a_pie",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - SIGILO]: Abandonar el vehículo y rematar la subida a pie sin especialidad sigilosa.

PUENTE: Prefieres el follaje antes que el barrido electrónico. Subes pegado al suelo hasta donde el físico permite, consciente de que eres menos espectro que superviviente.

CONSECUENCIA: Reduces huella del motor a costa de un desgaste que te vuelve a reclamar sangre con prisa.

RESULTADO: hungerDelta: +2 | setFlag: aproximacion_infanteria | IR A [ESCENA 8.1]`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoCap8Cordillera,
              { type: "not", requirement: { type: "skill", skill: "sigilo", minLevel: 1 } },
            ],
          },
          nextSceneId: "n8_andes_1",
          effects: [{ type: "hungerDelta", delta: 2 }, { type: "setFlag", flag: "aproximacion_infanteria" }],
        },
      ],
    },
    {
      id: "n8_andes_1",
      chapterId: "chapter08",
      title: "[ESCENA 8.1]: LA ESTACIÓN DE BOMBEO MÍSTICO",
      text: `CONTEXTO: Una antigua central hidroeléctrica abandonada en la zona de San José de Maipo. Las turbinas emiten un zumbido que vibra en los dientes.

NARRACIÓN: Tuberías de acero bajan desde los glaciares; no llevan sólo agua. Tras el cristal, tanques criogénicos: Hiel en proceso, envasada en contenedores con el sello grabado de la Viña del Silencio —misma familia de signos que archivaste en lacres urbanos, aquí a escala industrial.

En el centro de la sala de control está el Príncipe: conectado a una máquina, drenando sangre ancestral para estabilizar el ciclo. Parece un mártir demacrado más que soberano. Técnicos en trajes NBQ (protección nuclear-biológico-química) supervisan todo bajo la voz seca del Sastre —el Traje Gris—.`,
      contextVariantByState: [
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "mapas_de_la_cordillera", equals: true },
              { type: "flag", flag: "alianza_ines_final", equals: true },
            ],
          },
          text: "Mapa y último susurro de Inés convergen en este nodo; no llegaste por intuición única.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "mapas_de_la_cordillera", equals: true },
              { type: "not", requirement: { type: "flag", flag: "alianza_ines_final", equals: true } },
            ],
          },
          text: "Los puntos rojos que rescataste de Bruna perforaron hasta aquí antes que la intuición mortal.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "alianza_ines_final", equals: true },
              { type: "not", requirement: { type: "flag", flag: "mapas_de_la_cordillera", equals: true } },
            ],
          },
          text: "Fue la guía que Inés imprimió bajo fuego lo que cerró este camino sin plano en mano.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "chapter08_route_caceria_cota_mil", equals: true },
              { type: "not", requirement: { type: "flag", flag: "mapas_de_la_cordillera", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "alianza_ines_final", equals: true } },
            ],
          },
          text: "Sin mapa ni promesa de Inés, el rastro del convoy y del viaje que capturaste te empujó hasta el mismo corazón de la red.",
        },
      ],
      options: [
        {
          id: "n8_andes_1_domina_sobrecarga",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Apoderarte del jefe de ingenieros para que sobrecargue el sistema desde adentro.

PUENTE: Te deslizas por conductos de ventilación hasta tener línea sobre el técnico principal. «La presión es insuficiente. Abre todas las válvulas de alivio. Ahora». Camina vacío de voluntad consigo hacia la consola mientras el resto grita advertencias.

CONSECUENCIA: Una reacción en cadena agrieta tanques que no estaban pensados para tanta perturbación simultánea; la base tiembla bajo oleadas de fuerza mal estabilizada.

RESULTADO: hungerDelta: +1 | setFlag: sabotaje_hidroelectrico | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          visibilityRequirement: reqArcoCap8Cordillera,
          nextSceneId: "n8_andes_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "sabotaje_hidroelectrico" }],
        },
        {
          id: "n8_andes_1_perspicacia_valvula",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: Con mapas de la cordillera, identificar la válvula maestra que corta el suministro hacia Santiago.

PUENTE: No buscas pulverizar la planta: quieres secar la arteria hasta la ciudad. Localizas en la red impresa qué volante corta la conexión montaña–capital y lo giras al cierre, entre crujidos de metal y válvula vieja.

CONSECUENCIA: El Traje Gris pierde de golpe una moneda de cambio cara en Santiago; la presión institucional del Príncipe colapsa con el circuito físico que la alimentaba.

RESULTADO: willpowerDelta: -1 | setFlag: suministro_cortado | IR A [BLOQUE 2]`,
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "perspicacia", minLevel: 1 },
              { type: "flag", flag: "mapas_de_la_cordillera", equals: true },
            ],
          },
          visibilityRequirement: reqArcoCap8Cordillera,
          nextSceneId: "n8_andes_2",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "suministro_cortado" }],
        },
        {
          id: "n8_andes_1_asalto_principe",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Asaltar en seco para liberar al Príncipe y exigirle la verdad final.

PUENTE: Saltas desde la pasarela con acero trabajado. La violencia es quirúrgica contra guardias antes de alarmas coherentes; te plantas ante el soberano mártir mientras otros sensores siguen prendidos.

CONSECUENCIA: Lo tienes cara a cara, pero el anillo de seguridad del Traje Gris cierra contra tu posición.

RESULTADO: healthDamageDelta: -1 | setFlag: principe_capturado | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          visibilityRequirement: reqArcoCap8Cordillera,
          nextSceneId: "n8_andes_2",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "principe_capturado" }],
        },
      ],
    },
    {
      id: "n8_andes_2",
      chapterId: "chapter08",
      title: "[ESCENA 8.2]: EL PACTO DE LA MONTAÑA",
      text: `CONTEXTO: Sala de turbinas de la Central Maipo. El estruendo del agua se mezcla con las alarmas de presión.

NARRACIÓN: La planta está al borde del colapso. El Hombre del Traje Gris da un paso al frente, ajustándose los gemelos de plata mientras sus operativos alinean armas sobre tu pecho. No parece inmutarse; para él esto es un contratiempo logístico.

«El Príncipe era un romántico, Embajador. Creía que la Hiel era un secreto místico. Para nosotros, es el petróleo del siglo XXI», dice con una frialdad que intenta imponerse incluso sobre tu disciplina.

El Sastre te ofrece trato final: entregar al Príncipe y sumarte al consejo de administración de la nueva Viña, o quedarte para que la montaña te entierre.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "sabotaje_hidroelectrico", equals: true },
          text: "El vapor púrpura inunda la estancia hasta dejar apenas unos metros de visión clara.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "suministro_cortado", equals: true },
              { type: "not", requirement: { type: "flag", flag: "sabotaje_hidroelectrico", equals: true } },
            ],
          },
          text: "El corte del suministro hacia Santiago aún convive con presiones locas aquí arriba: la sala vibra como cuerda a punto de saltar.",
        },
        {
          requirement: { type: "flag", flag: "principe_capturado", equals: true },
          text: "A tu merced el anciano vástago balbucea sobre un «glaciar negro» que despierta más allá del muro de hielo.",
        },
      ],
      options: [
        {
          id: "n8_andes_2_presencia_operativos",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Usar tu Majestad para que los operativos del Sastre duden de su lealtad económica.

PUENTE: No negocias con intermediarios. Proyectas autoridad tan densa que los mercenarios sienten que el contrato arde con la planta. «Vuestro dinero muere aquí; la única salida medianamente humana es abrirme paso», sentencias.

CONSECUENCIA: Los operativos abren un pasillo hasta la plataforma de evacuación. El Sastre retrocede hacia penumbra dejando caer una promesa de auditoría sangrienta.

RESULTADO: willpowerDelta: -1 | setFlag: retirada_del_sastre | IR A [ESCENA 8.END]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          visibilityRequirement: reqArcoCap8Cordillera,
          nextSceneId: "n8_andes_end",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "retirada_del_sastre" }],
        },
        {
          id: "n8_andes_2_ocultismo_detonacion",
          type: "skill",
          skill: "ocultismo",
          text: `OPCIÓN B [HABILIDAD: OCULTISMO / ACCIÓN]: Canalizar tu sangre corrupta y la Hiel del ambiente para provocar una explosión mística.

PUENTE: Empujas la corrupción de tus venas contra turbinas ya al límite. El fluido púrpura reacciona y estalla en onda expansiva que levanta cuerpos contra el concreto. El techo cede ante la presión conjunta.

CONSECUENCIA: La planta de procesamiento queda inutilizada. El Sastre escapa en helicóptero; tú quedas malherido entre escombros mientras empieza a nevar.

RESULTADO: healthDamageDelta: -2 | setFlag: planta_destruida | IR A [ESCENA 8.END]`,
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "ocultismo", minLevel: 1 },
              { type: "flag", flag: "sangre_corrupta", equals: true },
            ],
          },
          visibilityRequirement: reqArcoCap8Cordillera,
          nextSceneId: "n8_andes_end",
          effects: [{ type: "healthDamageDelta", delta: 2 }, { type: "setFlag", flag: "planta_destruida" }],
        },
        {
          id: "n8_andes_2_accion_detonacion",
          type: "dialogue",
          text: `OPCIÓN B [HABILIDAD: OCULTISMO / ACCIÓN]: Detonar el nudo místico a sangre corrupta y pura fuerza de voluntad, sin ritual aprendido.

PUENTE: No tienes salmo preparado pero sí Hiel en la boca del estómago. La arrojas contra el bucle de la sala hasta que el sellado cede en estampido que tumba vigas y armas encima de todos.

CONSECUENCIA: La planta de procesamiento queda inutilizada. El Sastre escapa en helicóptero; tú quedas malherido entre escombros mientras empieza a nevar.

RESULTADO: healthDamageDelta: -2 | setFlag: planta_destruida | IR A [ESCENA 8.END]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoCap8Cordillera,
              { type: "not", requirement: { type: "skill", skill: "ocultismo", minLevel: 1 } },
            ],
          },
          nextSceneId: "n8_andes_end",
          effects: [{ type: "healthDamageDelta", delta: 2 }, { type: "setFlag", flag: "planta_destruida" }],
        },
        {
          id: "n8_andes_2_pacto_falso",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Aceptar el pacto del Sastre de boquilla para acercarte y matarlo.

PUENTE: «Parece que la lógica financiera se impone», dices bajando el arma visible. Caminas como quien va a firmar y, al ras de manos, desenvainas la daga de plata: el filo lame el aire justo cuando la guardia personal se interponen.

CONSECUENCIA: No liquidas al Sastre pero sí a su mano derecha; aprovechas el caos y subes hacia la ladera alta.

RESULTADO: setFlag: atentado_fallido_sastre | IR A [ESCENA 8.END]`,
          requirement: { type: "none" },
          visibilityRequirement: reqArcoCap8Cordillera,
          nextSceneId: "n8_andes_end",
          effects: [{ type: "setFlag", flag: "atentado_fallido_sastre" }],
        },
      ],
    },
    {
      id: "n8_andes_end",
      chapterId: "chapter08",
      title: "[ESCENA 8.END]: EL CAMINO AL GLACIAR NEGRO",
      text: `CONTEXTO: Cresta de montaña sobre la Central Maipo. 06:00 AM. El alba amenaza en franjas violetas.

NARRACIÓN: El conflicto dejó cicatriz de fuego en la cuesta. Santiago brilla abajo, ajena o casi a que su «vitalidad» acaba de ser saboteada o arrancada de raíz. La Hiel en esta altitud teje nubes bajas que regalan unos minutos más antes del sol. Frente a ti se abre la boca de hielo donde el linaje de ceniza empezó en 1814: queda cerrar el círculo.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "retirada_del_sastre", equals: true },
          text: "Luces de helicóptero suben hacia el Glaciar Negro en la cumbre: el Sastre no huyó lejos, se adelantó al ritual.",
        },
        {
          requirement: { type: "flag", flag: "planta_destruida", equals: true },
          text: "Un rugido de avalancha lejana confirma que la Fuente ya no duerme del todo.",
        },
      ],
      options: [
        {
          id: "n8_andes_end_cap9_trono_hielo",
          type: "dialogue",
          text: "Capítulo 9: El Trono de Hielo — el Príncipe aún respira bajo tu custodia; es la llave para sellar la Fuente.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoCap8Cordillera,
              { type: "flag", flag: "principe_capturado", equals: true },
            ],
          },
          nextSceneId: "n8_andes_end",
          effects: [
            { type: "setFlag", flag: "chapter09_route_trono_hielo" },
            { type: "setFlag", flag: "chapter_pending_chapter09" },
          ],
        },
        {
          id: "n8_andes_end_cap9_ascension",
          type: "dialogue",
          text: "Capítulo 9: La Ascensión de la Hiel — la Fuente Madre te reclama como a los suyos.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoCap8Cordillera,
              { type: "flag", flag: "sangre_corrupta", equals: true },
              { type: "not", requirement: { type: "flag", flag: "principe_capturado", equals: true } },
            ],
          },
          nextSceneId: "n8_andes_end",
          effects: [
            { type: "setFlag", flag: "chapter09_route_ascension_hiel" },
            { type: "setFlag", flag: "chapter_pending_chapter09" },
          ],
        },
        {
          id: "n8_andes_end_cap9_amanecer",
          type: "dialogue",
          text: "Capítulo 9: El Nuevo Amanecer Púrpura — enfrentar al Sastre y a la Fuente sin la llave del Príncipe.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoCap8Cordillera,
              { type: "not", requirement: { type: "flag", flag: "principe_capturado", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "sangre_corrupta", equals: true } },
            ],
          },
          nextSceneId: "n8_andes_end",
          effects: [
            { type: "setFlag", flag: "chapter09_route_nuevo_amanecer_purpura" },
            { type: "setFlag", flag: "chapter_pending_chapter09" },
          ],
        },
      ],
    },
    {
      id: "n8_0",
      chapterId: "chapter08",
      title: "8.0 · El umbral de la traición",
      text: `Portales de Plaza de Armas. Un viento extraño arrastra cenizas desde el Santa Lucía.

Dos camionetas negras bloquean las salidas. Doña Inés baja con una espada de duelo de brillo violáceo: "El Príncipe está decepcionado".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          text: "Sientes un vacío gélido en el pecho: la voz del Príncipe desapareció de tu mente.",
        },
        {
          requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true },
          text: "Una nueva arrogancia oscura te embriaga; ahora tú cargas el eco del nexo.",
        },
      ],
      options: [
        {
          id: "n8_0_celerity_ambush",
          type: "discipline",
          discipline: "celerity",
          disciplineTitle: "Emboscada fulminante",
          text: "Usar los portales para golpear primero.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "celerity", minLevel: 1 },
              { type: "flag", flag: "entrada_limpia", equals: true },
            ],
          },
          nextSceneId: "n8_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "duelo_singular" }],
        },
        {
          id: "n8_0_blackmail",
          type: "dialogue",
          text: "Intentar frenarla con la verdad sobre su traición.",
          requirement: { type: "flag", flag: "traicion_ines", equals: true },
          nextSceneId: "n8_1",
          effects: [{ type: "setFlag", flag: "tregua_ines" }],
        },
        {
          id: "n8_0_fortitude",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Aguante de mármol",
          text: "Resistir el envite inicial de los ejecutores.",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n8_1",
          effects: [{ type: "hungerDelta", delta: 2 }, { type: "healthDamageDelta", delta: -1 }],
        },
        {
          id: "n8_0_cuerpo_a_cuerpo",
          type: "dialogue",
          text: "Meterse en el tirón sin ventaja: pagar en carne lo que no pagas en dones.",
          requirement: { type: "none" },
          nextSceneId: "n8_1",
          effects: [{ type: "healthDamageDelta", delta: -2 }, { type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "plaza_desesperacion" }],
        },
      ],
    },
    {
      id: "n8_1",
      chapterId: "chapter08",
      title: "8.1 · El duelo de los reyes caídos",
      text: `Centro de Plaza de Armas, bajo la estatua ecuestre.

Inés ataca con una gracia imposible. El mundo se reduce al acero, el ozono y la distancia mínima entre su hoja y tu corazón.`,
      contextVariantByState: [
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "vinculo_sangre", equals: true },
              { type: "not", requirement: { type: "flag", flag: "vinculo_destruido", equals: true } },
            ],
          },
          text: "Tu cuerpo responde torpe: parte de ti aún se resiste a dañar la voz del Príncipe.",
        },
      ],
      options: [
        {
          id: "n8_1_potence",
          type: "discipline",
          discipline: "potence",
          disciplineTitle: "Quebrar su guardia",
          text: "Desarmar a Inés con un golpe seco.",
          requirement: { type: "discipline", discipline: "potence", minLevel: 1 },
          nextSceneId: "n8_2",
          effects: [{ type: "healthDamageDelta", delta: -1 }, { type: "setFlag", flag: "ines_vencida" }],
        },
        {
          id: "n8_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Nuevo soberano",
          text: "Ordenarle que se detenga y se arrodille.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "dominate", minLevel: 1 },
              { type: "flag", flag: "usurpador_del_vinculo", equals: true },
            ],
          },
          nextSceneId: "n8_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "ines_esclava" }],
        },
        {
          id: "n8_1_persuasion",
          type: "skill",
          skill: "persuasion",
          text: "Convencerla de que el Príncipe también la va a sacrificar.",
          requirement: { type: "skill", skill: "persuasion", minLevel: 1 },
          nextSceneId: "n8_2",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "ines_aliada_desesperada" }],
        },
        {
          id: "n8_1_pelea_sucia",
          type: "skill",
          skill: "pelea",
          text: "Quitarte la espada a empujones y rodillazos, sin elegancia de duelo.",
          requirement: { type: "skill", skill: "pelea", minLevel: 1 },
          nextSceneId: "n8_2",
          effects: [{ type: "healthDamageDelta", delta: -2 }, { type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "ines_vencida" }],
        },
        {
          id: "n8_1_supervivencia",
          type: "dialogue",
          text: "Sobrevivir al intercambio aunque pierdas elegancia: sangre en los adoquines.",
          requirement: { type: "none" },
          nextSceneId: "n8_2",
          effects: [{ type: "healthDamageDelta", delta: -3 }, { type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "ines_vencida" }],
        },
      ],
    },
    {
      id: "n8_2",
      chapterId: "chapter08",
      title: "8.2 · El cielo de Santiago arde",
      text: `La cima del Santa Lucía estalla en fuego fatuo azul y verde. Un terremoto abre grietas en el centro.

De entre humo y sirenas emerge Gato, operador anarquista del cordón y deudor incómodo de media ciudad: llega en una moto ensangrentada con la mirada rota por la urgencia.

"Es ahora o nunca. La ciudad se está hundiendo".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "cura_encontrada", equals: true },
          text: "Sabes que debes inyectar la muestra en el nexo del cerro antes de que la infección sea irreversible.",
        },
      ],
      options: [
        {
          id: "n8_2_leadership",
          type: "dialogue",
          text: "Reclutar restos de escolta para un asalto final al cerro.",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "ines_vencida", equals: true },
              { type: "flag", flag: "tregua_ines", equals: true },
            ],
          },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "gran_alianza" }],
        },
        {
          id: "n8_2_athletics",
          type: "skill",
          skill: "atletismo",
          text: "Cruzar la Alameda por tu cuenta entre fuego y barricadas.",
          requirement: { type: "skill", skill: "atletismo", minLevel: 1 },
          nextSceneId: "n8_end",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "asalto_solitario" }],
        },
        {
          id: "n8_2_investigation",
          type: "skill",
          skill: "investigacion",
          text: "Contactar familias Ventrue para retirar apoyo al Príncipe.",
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "investigacion", minLevel: 1 },
              { type: "flag", flag: "lista_traidores", equals: true },
            ],
          },
          nextSceneId: "n8_end",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "colapso_financiero" }],
        },
      ],
    },
    {
      id: "n8_end",
      chapterId: "chapter08",
      title: "8.E · El pie del cerro",
      text: `Terraza de Neptuno. El aire es casi irrespirable y tus colmillos duelen.

Arriba, en el Castillo Hidalgo, la silueta del Príncipe ya no parece humana: reclama Santiago como pira funeraria.`,
      options: [
        {
          id: "n8_end_trono_humo",
          type: "dialogue",
          text: "Liderar asalto frontal contra las manadas del Sabat.",
          requirement: { type: "flag", flag: "gran_alianza", equals: true },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "chapter09_route_trono_humo" }, { type: "setFlag", flag: "chapter_pending_chapter09" }],
        },
        {
          id: "n8_end_asesino",
          type: "dialogue",
          text: "Infiltrarte por los pasajes secretos del cerro.",
          requirement: { type: "flag", flag: "asalto_solitario", equals: true },
          visibilityRequirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "asalto_solitario", equals: true },
              { type: "not", requirement: { type: "flag", flag: "gran_alianza", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "ines_esclava", equals: true } },
            ],
          },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "chapter09_route_asesino" }, { type: "setFlag", flag: "chapter_pending_chapter09" }],
        },
        {
          id: "n8_end_venganza_seda",
          type: "dialogue",
          text: "Usar a Inés como escudo y arma contra el Príncipe.",
          requirement: { type: "flag", flag: "ines_esclava", equals: true },
          visibilityRequirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "ines_esclava", equals: true },
              { type: "not", requirement: { type: "flag", flag: "gran_alianza", equals: true } },
            ],
          },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "chapter09_route_venganza_seda" }, { type: "setFlag", flag: "chapter_pending_chapter09" }],
        },
        {
          id: "n8_end_default",
          type: "dialogue",
          text: "Ruta principal: continuar al Capítulo 9 por el ascenso directo, sin ventaja táctica especial.",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                { type: "flag", flag: "gran_alianza", equals: true },
                { type: "flag", flag: "asalto_solitario", equals: true },
                { type: "flag", flag: "ines_esclava", equals: true },
              ],
            },
          },
          nextSceneId: "n8_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter09" }],
        },
      ],
    },
  ],
};
