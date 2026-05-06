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

/** Quedaste registrado como agente con vehículo posible: Torre + sin perfil “volátil” en Bruna. */
const reqAgenteVehiculoTorre = {
  type: "all" as const,
  requirements: [
    { type: "flag" as const, flag: "agente_oficial", equals: true },
    reqSinVolatileBruna,
  ],
};

/**
 * Briefing de campo de Inés (tras decidir logística). Explica mote de contacto y profundidad bajo la estación;
 * debe repetirse en cada variante exclusiva de salida porque el motor concatena texto base + variante.
 */
const N2_3_BRIEFING_INES_RIBERA = `Inés se detiene bajo el primer farol del sendero. Baja la voz; no mira hacia el palacio.

«Ten cuidado entre aquí y la estación. Hay quien monta resguardo en portales de museo, y hay sombras que no rendirán cuentas a la oficina de la Torre.» Hace una pausa y te mira de frente. «Si ves el Mapocho con vetas violetas en la superficie, no lo toques ni con la suela: es la Hiel filtrándose.»

Te aclara el vocabulario de abajo tierra—no es salón, es cloaca y plano de obra—: **El Choro** es el mote de quien te recibirá en los accesos bajo el lecho; no es nombre de registro, es cómo lo llaman quienes gatean túneles. Ese vástago conoce los **niveles**: mantenimiento del Metro, cámaras de drenaje y rejillas bajo la explanada, más abajo que el andén que ve el mortal, hasta lo que en esta misión se documenta como el Nido.

«Son palabras que el Príncipe dejó caer en la sala y yo te las repito con la mano en el timón, por si el viento se las llevó», murmura. «El Choro. Los niveles. Nada de agua violeta.» Luego se retira entre setos sin volver la cabeza, y el camino queda en tus manos.`;

export const chapter02: SoloChapter = {
  id: "chapter02",
  title:
    "Santiago en Cenizas · CRÓNICA VENTRUE (V3.1) · CAPÍTULO 2: LA CORTE DE LOS ESPEJOS ROTOS (BLOQUE 2/2)",
  description:
    "Salón Dorado y encargo sobre Mapocho; salida por el Parque Forestal y el eje del río hasta la estación, de carne y hueso.",
  startSceneId: "n2_0",
  scenes: [
    {
      id: "n2_0",
      chapterId: "chapter02",
      title: "[ESCENA 2.0]: EL TRAYECTO AL PALACIO",
      text: `CONTEXTO: Calle Merced, barrio Lastarria. 03:50 AM. Subes desde el borde del río con Doña Inés; el Parque Forestal queda como promesa de sombra del otro lado de la manzana, pero primero manda el palacio.

NARRACIÓN: El trayecto es silencio medido: tacones y suela sobre empedrado que aún guarda olor a lluvia vieja. Las fachadas de aire europeo observan sin prisa; al acercarse a Bruna, la humedad del Mapocho cede al encerado de los pisos, al metal frío de torniquetes y al zumbido grave de cámaras que nadie finge ocultar.

En Merced con Estados Unidos, el Palacio Bruna se alza como un único cuerpo de piedra clara: verja de hierro, jardín recortado y luz que ya no es calle, sino protocolo.`,
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
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: [Verja · autoridad]: Adelantarte medio paso e imponer Presencia para que la verja ceda por instinto antes que por palabra o sello.

PUENTE: No esperas anuncio: tu campo empuja a los centinelas de bajo rango; sienten hueco en el estómago y apartan la mirada sin orden verbal. Inés te tolera el gesto sin corregirlo—anota el tiro.

CONSECUENCIA: Entras como quien ya ocupa un lugar en esta cohorte, no como invitado de paso; de aquí al salón, tu nombre viaja con una etiqueta distinta.

RESULTADO: willpowerDelta: +1 | setFlag: entrada_soberana | IR A [ESCENA 2.1]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "entrada_soberana" }],
        },
        {
          id: "n2_0_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: [Verja · lectura]: Recorrer con la mirada balcones, setos y ritmo de radios antes de cruzar el arco.

PUENTE: Bajo la lámpara de calle distingues capas: centinelas de la Camarilla, trajes civiles con cable en la oreja—mercenarios mortales—y un flanco oeste donde el muro y una salida de servicio dejan más sombra que cámara.

CONSECUENCIA: Guardas un mapa mental de huida; si la noche tuerce, ya sabes por dónde no pedir permiso.

RESULTADO: setFlag: vulnerabilidad_bruna_detectada | IR A [ESCENA 2.1]`,
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "vulnerabilidad_bruna_detectada" }],
        },
        {
          id: "n2_0_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ETIQUETA]: [Verja · protocolo]: Detenerte un paso atrás del arco de la entrada y esperar a que abran la verja—Inés cumple el ritual—antes de alzar la voz o reclamar paso.

PUENTE: Manos a la espalda, barbilla nivelada; los ghouls de entrada leen sumisión sin humillación. Inés alza el sello del Príncipe para que el mecanismo y la mirada cedan en el mismo orden que manda la casa.

CONSECUENCIA: Portería te archivo como «estable»: no confianza ciega, pero paso sin fricción hacia el vestíbulo.

RESULTADO: setFlag: etiqueta_validada | IR A [ESCENA 2.1]`,
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "etiqueta_validada" }],
        },
        {
          id: "n2_0_estandar",
          type: "dialogue",
          text: `OPCIÓN C — sin etiqueta entrenada: [Verja]: Detenerte en la verja y dejar que Inés abra el protocolo mientras tú mantienes compostura mínima: manos quietas, voz baja, sin provocar ni adular.

PUENTE: No exhibes el virtuosismo de quien dominó Etiqueta; tampoco desafías al personal. Dejas que Inés muestre la credencial del soberano y que el nombre del Príncipe haga el trabajo antes que tu lengua.

CONSECUENCIA: Entrada aceptada sin el refuerzo de confianza que da la etiqueta fina; los ghouls no te abren paso de rodillas, pero el umbral cede.

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
          text: `OPCIÓN D [RIESGO - INSTINTO]: [Verja · provocación]: Con el rastro de fuerza bruta aún pegado al mapa, golpear la mesa del detector y medir hasta dónde aguantan antes de que Inés cierre el protocolo.

PUENTE: «¿De veras creen que esto frena lo que traigo en sangre?», con una sonrisa que asoma colmillo sin ofrecer mordida. Los uniformes tensan manos; alguien ya escribe «volátil» sin pedirte nombre.

CONSECUENCIA: La audiencia será bajo doble luz: te observan como ejecutor, no como invitado.

RESULTADO: humanityDelta: -1 | setFlag: perfil_peligroso | IR A [ESCENA 2.1]`,
          requirement: { type: "flag", flag: "rastro_fuerza_bruta", equals: true },
          nextSceneId: "n2_1",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "perfil_peligroso" }],
        },
        {
          id: "n2_0_famenatural",
          type: "dialogue",
          text: `OPCIÓN E [RIESGO - INSTINTO]: [Verja · hambre a flor]: Llegar con la primera caza aún reciente en el cuerpo—paso firme, mirada demasiado quieta.

PUENTE: Los de portería intercambian seña; leen depredador antes que etiqueta. Inés no discute en voz alta: aprieta el protocolo para que no te disparen de envidia.

CONSECUENCIA: Tu ficha huele a bestia contenida, no a bravuconada; de aquí en adelante la Torre te vigila distinto.

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
      text: `CONTEXTO: Interior del Palacio Bruna. Vestíbulo alto, espejos enmarcados en oro mate y una escalinata de mármol que sube como promesa de juicio.

NARRACIÓN: Al cruzar el umbral, la ciudad queda detrás de vidrios gruesos. Sólo quedan el tic-tac de un reloj de pie y una música clásica baja, como etiqueta sonora. Los espejos devuelven tu silueta ya lavada de mortalidad común; la luz lateral trabaja para que la palidez parezca porte, no enfermedad.

Inés se detiene frente a un espejo de cuerpo entero y alisa un pliegue del pañuelo. «El Príncipe está en el Salón Dorado», dice sin volverse. «Aquí las paredes escuchan y los espejos archivan lo que reflejan. No mientas, salvo que tu mentira sea más presentable que la verdad».`,
      options: [
        {
          id: "n2_1_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Auspex",
          text: `OPCIÓN A [DISCIPLINA: AUSPEX]: [Espejos · oído]: Afilar Auspex y escuchar lo que el comedor cree es privado.

PUENTE: Cierras un instante los párpados; el murmullo se corta en hilos. Dos vástagos comparan presión en la Estación Mapocho y un «Traje Gris» que no cerró bien la cuenta.

CONSECUENCIA: Entras al salón sabiendo qué acicate ya está en el aire; el Príncipe tendrá menos sitio para sorprenderte.

RESULTADO: setFlag: oido_conversacion_mapocho | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [{ type: "setFlag", flag: "oido_conversacion_mapocho" }],
        },
        {
          id: "n2_1_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: `OPCIÓN B [HABILIDAD: ETIQUETA]: [Espejos · linaje enmarcado]: Leer la galería como manifiesto—quién cuelga, quién falta, quién fue borrado con cuidado.

PUENTE: Coronas coloniales mezcladas con títulos de salón más recientes; un hueco oval en la pared principal, polvo fresco en el zócalo.

CONSECUENCIA: El palacio ya cumplió una purga de retratos; quien gobierna mira el retrato vacío con la misma mecánica con la que te mirará a ti.

RESULTADO: setFlag: sospecha_purga_interna | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [{ type: "setFlag", flag: "sospecha_purga_interna" }],
        },
        {
          id: "n2_1_dialogo",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: [Espejos · tino]: Preguntar sin alzar la voz si hoy el soberano quiere hechos o teatro.

PUENTE: «¿Resultados o excusas, Inés?». Ella no sonríe: «Hoy quiere lealtad con nombre; lo demás escasea más que sangre limpia».

CONSECUENCIA: Llevas en la oreja el tono que el salón premia: obediencia visible antes que ingenio.

RESULTADO: (Avance estándar) | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n2_2",
        },
        {
          id: "n2_1_mancha",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: [Espejos · huella de Mapocho]: Si ya dejaste muerte bajo la estación, limpiar frente a ella la gota que el pañuelo no alcanzó.

PUENTE: El rojo en el nudillo late bajo la luz de los espejos; lo borras con calma, mirándola en el cristal sin disimular satisfacción.

CONSECUENCIA: Inés parpadea: te cataloga como herramienta afilada… y como quien podría volverse filo contra la mano que lo empuña.

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
      text: `CONTEXTO: Gran salón de audiencias. Ventanales altos al Parque Forestal; el Príncipe de Santiago, de pie junto a un piano de cola cerrado como tumba de marfil.

NARRACIÓN: Las hojas de la puerta pesan; el aire del salón se ordena solo para él. No hay trono: hay luz tenue, alfombra que absuelve el paso y un hombre de espaldas contando luces más allá del follaje. La habitación aprieta el pecho como si filtrara el oxígeno a placer—es el hábito de quien acostumbró a la ciudad a arrodillarse antes que tú nacieras de nuevo.

«Santiago es un cuerpo que exige equilibrio», dice sin volverse. «Y bajo el río Mapocho hay un nexo de infección que ya mancha la Mascarada y la sangre de los que juramos esta casa. Irás a la estación. Hallarás el origen de la Hiel y lo cerrarás». Sobre el mármol: un sobre lacrado y una daga de plata con runas que hieren la mirada.`,
      options: [
        {
          id: "n2_2_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: [Salón · desafío quieto]: Mantener los ojos arriba cuando él se gire; no ceder primero.

PUENTE: Su mirada pesa como mano en el cuello; el salón entero calla. Cuando el silencio va a romperse él asiente una fracción: «Tienes espinazo. No me falles».

CONSECUENCIA: Te ganas un respeto que se parece a miedo: útil esta noche, peligroso mañana.

RESULTADO: willpowerDelta: +1 | setFlag: respeto_principe | IR A [ESCENA 2.3]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n2_3",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "respeto_principe" }],
        },
        {
          id: "n2_2_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: [Salón · evidencia]: Fijarte en lacre, filo y huellas antes de tocar lo que él ofrece.

PUENTE: El sobre trae un roce violeta bajo el sello; la daga, aceite que no huele a limpieza de armario, sino a lo mismo que mancha el río.

CONSECUENCIA: Entiendes que el encargo no es solo «ir y matar suciedad»: alguien ya cargó la infección hasta esta mesa.

RESULTADO: setFlag: sospecha_principe | IR A [ESCENA 2.3]`,
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n2_3",
          effects: [{ type: "setFlag", flag: "sospecha_principe" }],
        },
        {
          id: "n2_2_dialogo_oficial",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: [Salón]: Aceptar el encargo con formula de lealtad—«consideradlo en marcha»—y tomar sobre y daga como emblemas del mandato.

PUENTE: «Vuestro deseo es el orden de esta ciudad», respondes con la mesura que el salón premia. Tomas lacre y filo frío; la plata marca la palma y no perdona titubeos.

CONSECUENCIA: La administración de la Torre en el Palacio Bruna te ficha como agente: credencial visible, acceso al estacionamiento de casa cuando tu evaluación lo permite, y trato de operativo que un invitado de paso no recibe.

RESULTADO: setFlag: agente_oficial | IR A [ESCENA 2.3]`,
          requirement: { type: "none" },
          nextSceneId: "n2_3",
          effects: [{ type: "setFlag", flag: "agente_oficial" }, { type: "setFlag", flag: "embajador_corte" }],
        },
        {
          id: "n2_2_traje_gris",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: [Salón · nombre en Teatinos]: Sacar a colación al de traje gris que apareció antes que la fila oficial—si ya lo viste en la calle.

PUENTE: «Antes de esta sala, un hombre de gris me saludó en Teatinos. ¿Habla también por vos, Majestad, o por otra mesa?». La pregunta no alza voz; sí mueve algo bajo la alfombra.

CONSECUENCIA: El soberano contrae el gesto; las luces titilan. Entiendes que el «Sastre» es nudo que el Príncipe no puede desatar en voz alta.

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
      title: "[ESCENA 2.3]: JARDÍN, GARAJE Y BRIEFING",
      text: `CONTEXTO: Jardines traseros del Palacio Bruna. 04:15 AM.

NARRACIÓN: Sales del salón con el sobre en el bolsillo y la daga donde corresponda. Inés te lleva por un pasillo lateral que huele a cera vieja y a cableado de seguridad; al abrirse la puerta, el jardín te golpea con frío, humedad y el rumor lejano del tráfico. Más allá de los setos, las luces de la ciudad perforan la bruma; aún estás en suelo del palacio, pero el aire ya es de calle.`,
      contextVariantByState: [
        {
          requirement: reqAgenteVehiculoTorre,
          text: `Inés no te manda solo a la verja: un corredor de servicio baja hasta un garaje anexo donde el olor a aceite y hormigón reemplaza al incienso del salón. Ahí espera un sedán oscuro con calco discreto de la Torre del Palacio Bruna; un ghoul de garaje mantiene el motor en ralentí sin mirarte a los ojos.

Inés te coloca en la palma el llavero—metal frío, medalla grabada con el sello de Bruna y tres llaves que identifican puerta, ignición y maletero. «Sube por Costanera o como te indique el callejero, pero el cordón de parada es frente al centro cultural y el paralelo del río; al terminar la noche, devuelve esto al garaje o tráemelo a mí y yo cierro la cuenta con ellos». El volante queda a un paso; todavía no has pisado acera.

${N2_3_BRIEFING_INES_RIBERA}`,
        },
        {
          requirement: { type: "not", requirement: reqAgenteVehiculoTorre },
          text: `Esta noche no hay vehículo a tu nombre: o no quedaste fichado como agente con logística de garaje, o portería y evaluación cortaron el acceso. Inés no dramatiza: desde el borde del jardín, donde el seto se abre hacia la verja del parque, te marca con el dedo el arco que sigue el encargo—Forestal, luego el eje del río hacia poniente—hasta que la estación se dibuje en hierro y vidrio.

${N2_3_BRIEFING_INES_RIBERA}`,
        },
      ],
      options: [
        {
          id: "n2_3_avance_mapocho",
          type: "dialogue",
          text: `OPCIÓN T [Transición]: [Hacia el trayecto]: Salir del perímetro del palacio y enfrentar el tramo urbano hasta la Estación Mapocho—con llaves en mano o sólo a pie, según te tocó.

PUENTE: Cruzas la línea donde el mármol y el protocolo ceden al asfalto; el encargo pesa en el bolsillo y las palabras de Inés en la oreja.

CONSECUENCIA: Lo de adentro quedó cerrado; lo de afuera exige decidir cómo recorrer la ciudad antes del alba.

RESULTADO: IR a [ESCENA 2.3.1 · Elección de ruta]`,
          requirement: { type: "none" },
          nextSceneId: "n2_3b",
        },
      ],
    },
    {
      id: "n2_3b",
      chapterId: "chapter02",
      title: "[ESCENA 2.3.1]: HACIA LA ESTACIÓN MAPOCHO",
      text: `CONTEXTO: Callejón y cordón del Parque Forestal; primera bocanada de ciudad sin manto de salón. 04:20 AM.

NARRACIÓN: Desde aquí hasta la Estación Mapocho el recorrido que todo mortal haría en taxi tú lo debes ganar a sangre y criterio: internar el Forestal donde los árboles rompen la línea de tiro de las cámaras, seguir el eje del río Mapocho hacia poniente, ir manzana a manzana sobre un agua que en esta hora huele a petróleo y a algo violeta que no debería estar en superficie. Nadie te deposita en la puerta como estrella invitada; quien te espera abajo del andén no va a preguntar si llegaste en sedán o en zapatos gastados—sólo si trajiste resultado.

Elige cómo cubrir ese tramo según tu ficha, tu equipo y lo que la noche te dejó sobre los hombros.`,
      options: [
        {
          id: "n2_3_parque_volatile_callejeo",
          type: "skill",
          skill: "callejeo",
          text: `[Parque · perfil marcado]: Internarte por el Forestal hacia el río, leyendo esquina y sombra aunque en Bruna te hayan etiquetado como riesgo.

PUENTE: Plátanos que amortiguan el paso; frente a museos, miradas de quienes pernoctan en portales y hambre de ghoul disfrazada de guardia improvisado. Nadie grita; algunos te siguen hasta el cordón y pierdes su línea en la Alameda.

CONSECUENCIA: Llegas al borde de Mapocho con tiempo a favor, pero la ciudad te tuvo en foco: cuando salgas del subsuelo, no habrá comitiva del palacio que tape tu retirada.

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
          text: `[Parque · sin callejero]: Seguir la línea verde que Inés te dibujó con el dedo, aun sin instinto urbano que afine cada cruce.

PUENTE: Follaje que te estrecha; frente al Bellas Artes y al centro cultural aparecen vacíos donde no calcular distancia. Una patrulla y un grupo en la vereda te miden en silencio; te dejan seguir porque aún no eres el titular de la noche.

CONSECUENCIA: Sigues entero y en hora, pero quien te observó desde arriba anotó dudas donde otra noche anotarían autoridad.

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
          text: `[Parque · Inés en el canal]: Atravesar el Forestal por senderos de sombra con el auricular cifrado: ella cruza contigo las sirenas y el olor a quemado.

PUENTE: Los plátanos amortiguan tres cruces feos al norte de la Alameda; el intercomunicador vibra tibio y su voz seca te ordena no frenar junto al agua violeta.

CONSECUENCIA: Llegas rápido con mano remota en el cuello del trayecto; aun así dejas firma en quien mapea la ciudad en paralelo a la Torre.

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
          text: `[Parque · pie estable + callejero]: Cortar el Forestal por dentro, esquivando el cordón entre Lastarria y el eje del río hacia Santa Rosa.

PUENTE: Follaje que traga farolas; museos que te miran por los portones. Una escaramuza breve con quien duerme en la acera te endurece la mandíbula antes del olor aceitoso del Mapocho.

CONSECUENCIA: Apareces junto al río sin motor de garaje; el último tramo no anuncia comitiva, sólo tu silueta cansada y puntual.

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
          text: `[Parque · Inés, sin callejero]: Empujar la misma ruta verde a paso forzado, con auricular y voz de Inés corrigiendo cruces.

PUENTE: Parterres, escaleras improvisadas, sirenas amortiguadas. Ella aprieta en el canal: «No llegues a la explanada con violeta en la suela».

CONSECUENCIA: Los giros te salen toscos, pero no bajas solo a la ribera: cada esquina la negocias con su latido en la oreja.

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
          text: `[Parque · expuesto]: Sacar pecho por sendas abiertas: el encargo no espera a que esta noche aprendas callejero.

PUENTE: Hombros al aire; jardín y vereda de museos con miradas, humo y párpados que suman tu nombre al aire sin saberlo.

CONSECUENCIA: Llegas al cordón del río con lo mínimo; la Torre no te pidió elegancia en sombra, sólo que cumplas antes del alba.

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
          text: `[Costanera · sedán del garaje]: Subir por Costanera Norte con el coche que la Torre dejó en llave: paralelar el río hasta el cordón con equipo a bordo.

PUENTE: Lastarria queda atrás en sombra; al costado, el Mapocho devuelve luces de neón como aceite, con violeta apenas latente bajo la cresta.

CONSECUENCIA: Ganas minutos y manos libres: el sedán del palacio delata autorización real, y lo que Inés mandó guardar sigue en el hueco bajo el asiento, seco.

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
          text: `[Costanera · sedán, conductor forzado]: Subir igual al cordón en el coche del garaje: el encargo no deja opción de quedarte quieto.

PUENTE: Volante duro; el GPS del tablero pelea contigo. Aun así paralelas el Mapocho y el violeta del cauce te roza el rabillo del ojo sin que puedas detenerte a estudiarlo.

CONSECUENCIA: Trayecto tosco pero cumplido: devuelves llaves y llegas al perímetro con la orden vigente, sin la suavidad de quien domina la mecánica.

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
          text: `[Ribera · pie castigado]: Pararse un segundo en la baranda del Mapocho: ya oíste en Bruna la presión bajo la estación y vas sin sedán.

PUENTE: Cemento frío bajo las manos; el cauce trae vetas violetas que laten más allá de basura y neón reflejado.

CONSECUENCIA: Entras a la estación con la nariz entrenada: cuando el contacto de cloaca te empuje hacia los niveles, reconocerás la Hiel antes de que te empape.

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
          text: `[Ribera · con Inés en el oído]: Ceder un minuto a la baranda antes de la entrada lateral: cerrar imagen del río con lo que oíste en el salón y con ella en el canal.

PUENTE: Superficie aceitosa; filamentos violetas tiran de la corriente como venas bajo piel muerta.

CONSECUENCIA: Bajas con la cabeza afilada: sabrás qué buscar en charcos y rejillas cuando El Choro te empuje al tubo, sin perder el hilo de su voz en la oreja.

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
          text: `[Ribera · pie estable]: Detenerte junto al agua antes del centro cultural, con lo que ya captaste en el salón sobre Mapocho.

PUENTE: Frío en muñecas; el rumor del cauce lleva el violeta que Inés mandó no rozar ni con la suela.

CONSECUENCIA: Cruzas hacia la estación sabiendo que lo de abajo no es cierre de línea por accidente: es la infección que el Príncipe te mandó a taponar.

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
      text: `Pasaste del salón dorado al aire del parque y al rumor del Mapocho. El Palacio Bruna quedó a tu espalda como escenario cerrado; delante, el esqueleto de hierro y vidrio de la estación. En la Torre ya archivaron tu nombre al margen del encargo: ahora toca el río, los niveles bajo la explanada y la Hiel que no perdona titubeos.`,
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
