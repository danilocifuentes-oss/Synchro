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

const reqUmbralDesafioInes = {
  type: "all" as const,
  requirements: [
    reqRutaAnclaCatedral,
    { type: "flag" as const, flag: "desafio_abierto_corte", equals: true },
  ],
};

const reqUmbralLlegadaSigilosa = {
  type: "all" as const,
  requirements: [
    reqRutaAnclaCatedral,
    { type: "flag" as const, flag: "aproximacion_sigilosa_plaza", equals: true },
    { type: "not" as const, requirement: { type: "flag" as const, flag: "desafio_abierto_corte", equals: true } },
  ],
};

const reqUmbralAnclaSinMarcaLlegada = {
  type: "all" as const,
  requirements: [
    reqRutaAnclaCatedral,
    { type: "not" as const, requirement: { type: "flag" as const, flag: "desafio_abierto_corte", equals: true } },
    { type: "not" as const, requirement: { type: "flag" as const, flag: "aproximacion_sigilosa_plaza", equals: true } },
  ],
};

export const chapter06: SoloChapter = {
  id: "chapter06",
  title: "Santiago en Cenizas · CAPÍTULO 6: EL NODO DE LA CATEDRAL",
  description:
    "Secuencia continua desde plaza hasta la cámara del Ancla, colapso del subsuelo y bifurcación hacia Santiago en llamas o ascenso del tirano.",
  startSceneId: "n6_0",
  scenes: [
    {
      id: "n6_0",
      chapterId: "chapter06",
      title: "[ESCENA 6.0]: EL UMBRAL DE LA FE Y LA SANGRE",
      text: `Según cómo cerraste el capítulo anterior, hoy pisas la viña al sur del cordón o la nave donde 1814 aún pide cuenta en piedra.`,
      contextLeadInByState: [
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
          flag: "secreto_del_primogenito",
          text: "En las juntas entre arco y tímpano te vuelve la frase del Tratado sobre la sangre del primogénito: el edificio parece apoyarse más en acuerdo viejo que en cantería.",
        },
        {
          flag: "guerra_abierta_principe",
          text: "El olor a incienso y cera fría te resulta insultante.",
        },
      ],
      contextVariantByState: [
        {
          requirement: reqUmbralDesafioInes,
          text: `Si vienes con la bandera desafio_abierto_corte, las pesadas puertas de bronce muestran paso amplio y Doña Inés ocupa el eje del pasillo central rodeada de guardias cuya disciplina obliga a manos pegadas al arma.`,
        },
        {
          requirement: reqUmbralLlegadaSigilosa,
          text: `Si vienes por aproximacion_sigilosa_plaza, te deslizaste por una puerta lateral de madera menos vigilada y entraste en incienso rancio, penumbra de santos tallados y ecos que aplazan juicio.`,
        },
        {
          requirement: reqUmbralAnclaSinMarcaLlegada,
          text: `Tu llegada no pasó antes por ese escenario ostentoso ni por el boquete lateral disimulado: el umbral nave te recibe igual con el mismo campo magnético en los colmillos.`,
        },
        {
          requirement: reqRutaAnclaCatedral,
          text: `CONTEXTO: Atrio y naves laterales de la Catedral Metropolitana. 01:15 AM.

NARRACIÓN: La Catedral se alza como fortaleza de piedra que parece repeler el neón de afuera. El aire del atrio resulta espeso: un magnetismo hace latir los colmillos por instinto antes de orden.

El interior es caverna de mármol y oro gastado por siglos. Las columnas de granito muestran un revestimiento negro brillante que sube desde el suelo como enredaderas: Hiel casi limpio, vivo. El sistema de filtración que viste en la Estación Mapocho fue derivación menor; aquí late el centro del organismo.`,
        },
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
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Invocar tu autoridad para que la Guardia de la Torre dude de sus órdenes.

PUENTE: Te detienes en el centro de la nave. Proyectas fatalidad inminente, peso espiritual que insinúa fin de ciclo para el Príncipe. «No soy intruso: soy quien hereda lo que este edificio oculta. Apártense o queden como ceniza en un capítulo que ya no les pertenece», sentencias sin alzar la voz más de lo necesario.

CONSECUENCIA: La voluntad de varios guardias flaquea; dos bajan armas y te dejan avanzar hacia el altar sin disparo inmediato, pero Inés te fija como blanco prioritario.

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
          text: `OPCIÓN B [HABILIDAD: SIGILO]: Moverte por el triforio (galerías superiores) y observar el ritual desde las alturas.

PUENTE: Escalas molduras laterales hasta fundir sombra con estatuas petreas. Debajo del vitral miras desde galerías altas cómo una figura se alinea frente al altar mayor y vierte sangre sobre rejilla de cobre que pierde líquido violeta hacia hueco que huele a cripta.

CONSECUENCIA: Memorizas disposición de enemigos y nodos donde el vínculo ancla físicamente antes del asalto final.

RESULTADO: setFlag: vision_superior_ritual | IR A [ESCENA 6.1]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          visibilityRequirement: reqRutaAnclaCatedral,
          nextSceneId: "n6_cat_cripta",
          effects: [
            { type: "setFlag", flag: "vision_superior_ritual" },
            { type: "setFlag", flag: "puntos_debiles_visto" },
          ],
        },
        {
          id: "n6_0_cat_baptisterio",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Si tienes entrada_por_catacumbas, empujar desde abajo una losa hacia una capilla lateral del baptisterio.

PUENTE: El conducto técnico te escupe tras losa mohosa. Sales cubierto de polvo mineral y lámina de Hiel que prende al olfato Ventrue tras la línea de guardias antes de tiempo. El efecto sorpresa es tuyo; el perfume morado te marca frente a otro vástago.

CONSECUENCIA: Cortas perímetro ceremonial sin parlamentar antes; tensión física siguiente es inmediata.

RESULTADO: setFlag: flanqueo_desde_el_suelo | IR A [ESCENA 6.1]`,
          requirement: { type: "flag", flag: "entrada_por_catacumbas", equals: true },
          visibilityRequirement: reqRutaAnclaCatedral,
          nextSceneId: "n6_cat_cripta",
          effects: [{ type: "setFlag", flag: "flanqueo_desde_el_suelo" }],
        },
        {
          id: "n6_0_cat_residual",
          type: "dialogue",
          text: `OPCIÓN D [CAMINO ESTÁNDAR - ACCIÓN]: Avanzar sobre mármol sin Presencia destacada ni triforio ni trampilla previa marcada —apretar centro de nave en tensión diplomática mínima.

PUENTE: Tus pasos suenan igual que llevan semanas sonando dentro de esta cabeza hasta el cansancio. Inés registra llegada antes de que decidas táctica alta.

CONSECUENCIA: Mantienes exposición alta sin ventaja nueva de vigilancia desde arriba.

RESULTADO: setFlag: parlamento_bajo_tension | IR A [ESCENA 6.1]`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqRutaAnclaCatedral,
              { type: "not", requirement: { type: "discipline", discipline: "presence", minLevel: 1 } },
              { type: "not", requirement: { type: "skill", skill: "sigilo", minLevel: 1 } },
              { type: "not", requirement: { type: "flag", flag: "entrada_por_catacumbas", equals: true } },
            ],
          },
          nextSceneId: "n6_cat_cripta",
          effects: [{ type: "setFlag", flag: "parlamento_bajo_tension" }],
        },
        {
          id: "n6_0_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: `OPCIÓN A [HABILIDAD: ETIQUETA]: [Viña · lectura del salón]: Leer quién manda en la mesa sin abrir la boca todavía.

PUENTE: Orden de los lugares, tino en copas y quién mira antes al Príncipe. Dibujas un mapa: leales, cómplices, los que fingen no saber.

CONSECUENCIA: Entras al brindis con el tablero claro; menos sorpresas cuando la jarra negra llegue al centro.

RESULTADO: willpowerDelta: +1 | setFlag: mapa_politico_vina | IR A [El brindis negro]`,
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
          text: `OPCIÓN B [DISCIPLINA: AUSPEX]: [Viña · bajo tierra]: Soltar la vista y seguir el rumor bajo los pies.

PUENTE: No es sólo bodega: hay pulso profundo, casi de máquina o de sangre encerrada, alineada con la misma nota mala que oiste en Mapocho.

CONSECUENCIA: Confirmas que la viña no es anexo decorativo: es nodo del mismo sistema.

RESULTADO: hungerDelta: +1 | setFlag: secreto_bajo_vina | IR A [El brindis negro]`,
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          visibilityRequirement: reqRutaViñaSinAncla,
          nextSceneId: "n6_v_brindis",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "secreto_bajo_vina" }],
        },
        {
          id: "n6_0_perspicacia_vina",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN C [HABILIDAD: PERSPICACIA]: [Viña · copas]: Buscar Hiel o artificio en lo que beben los invitados.

PUENTE: Brillo violeta apenas, dedos demasiado quietos en los cristales. No todos vinieron a emborracharse de vino.

CONSECUENCIA: Identificas a los que ya traen el veneno en el cuerpo antes del pacto público.

RESULTADO: setFlag: elite_infectada | IR A [El brindis negro]`,
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          visibilityRequirement: reqRutaViñaSinAncla,
          nextSceneId: "n6_v_brindis",
          effects: [{ type: "setFlag", flag: "elite_infectada" }],
        },
        {
          id: "n6_0_fachada_vina",
          type: "dialogue",
          text: `OPCIÓN D [CAMINO ESTÁNDAR - ACCIÓN]: [Viña · fachada]: Entrar al salón como un invitado más, sin mapa ni dones.

PUENTE: Sonríes, saludas, dejas que te ubiquen. El costo es ir a ciega un tramo: la política te golpeará cuando ya estés dentro.

CONSECUENCIA: Menos ventaja táctica; más credibilidad de “cordero” hasta que la jarra del centro arme el drama.

RESULTADO: willpowerDelta: -1 | setFlag: vina_entrada_fachada | IR A [El brindis negro]`,
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
      title: "[ESCENA 6.1]: EL DESCENSO A LA VERDAD",
      text: `CONTEXTO: El altar mayor y umbral visible hacia la cripta arzobispal.
NARRACIÓN: El gesto anterior te dejó ante el altar. Un servidor con anillo de sello de la Torre —el relieve de Bruna hecho metal— se perdió hacia la violeta tras el coro; los murmullos dicen que el Príncipe ya bajó a la cámara del pacto.

Doña Inés queda como última cara visible antes del bronce. El suelo vibra con latido espeso casi líquido. La puerta hacia la cripta está entreabierta y escupe un fulgor violáceo que dibuja sombras incorrectas contra las bóvedas.`,
      flagAppends: [
        {
          flag: "duda_en_la_guardia",
          text: "Varios uniformes cortos de la Torre siguen dubitativos después de la nave; tu gesto aún trabaja dentro de esa grieta antes del bronce siguiente.",
        },
        {
          flag: "vision_superior_ritual",
          text: "Desde la galería ya trazaste dónde apuntaba la rejilla y quién ocupaba eje ceremonial: el descenso ahora es mapa cargado antes de pie.",
        },
        {
          flag: "flanqueo_desde_el_suelo",
          text: "El polvo y la lámina violeta siguen prendidos a la tela; otro vampiro cercano huele ese rastro antes de que tú ocupes sombra nueva.",
        },
        {
          flag: "llave_medallon_criptas",
          text: "Todavía cargas la llave del medallón: encaja mejor de lo cómodo como contrapeso ante el bronce apenas rozado en el borde nuevo.",
        },
        {
          flag: "mapa_catacumbas_regalo",
          text: "La nota gris marca accesos y respiradero; confirma que no estás en calle equivocada aun cuando el rumor subterráneo cambie tonalidad violeta contra metal.",
        },
      ],
      options: [
        {
          id: "n6_cat_domines",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Forzar a Doña Inés a reconocer que el Príncipe la está usando como amortiguador del ritual.

PUENTE: Avanzas hasta donde su espacio deja margen táctico y le clavas mirada antes de recurrir a etiqueta alta. Susurras algo que apenas ella debe oír: «No busca salvar Santiago; se alimenta de nosotros hasta vaciar la institución. Mírame y admite cómo te arrastra ese vínculo al abismo». El eco de nave lo amortigua bastante antes de llegar al oído de la ciudad mortal.

CONSECUENCIA: Inés vacila; no firma aliado abierto pero cede medio frente suficiente para que no enfrentes ese filo solo ante el hueco inicial.

RESULTADO: setFlag: neutralizacion_ines | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n6_cat_ancla",
          effects: [{ type: "setFlag", flag: "neutralizacion_ines" }],
        },
        {
          id: "n6_cat_sello_primogenito",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: Si tienes secreto_del_primogenito, recitar el nombre tabú ante runas vivas para colapsar mecanismo místico de la entrada.

PUENTE: Alto frente al bronce apenas separado marcas un instante inútil para respiración y pronuncias la orden silábica que la Biblioteca entregó entre líneas manchadas. Los grabados opacos chispean y se apagan por tramos; el metal gime como un resorte fuera de escala humana.

CONSECUENCIA: El hueco cede sin baño de sangre automático programado; quién espera abajo pierde un segundo de ventaja preparada.

RESULTADO: setFlag: sello_roto_con_nombre | IR A [BLOQUE 2]`,
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "perspicacia", minLevel: 1 },
              { type: "flag", flag: "secreto_del_primogenito", equals: true },
            ],
          },
          nextSceneId: "n6_cat_ancla",
          effects: [{ type: "setFlag", flag: "sello_roto_con_nombre" }],
        },
        {
          id: "n6_cat_daga_guardias",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Abrir paso físico ante último cordón usando daga cortesana sobre ghouls y armas cortas cercanas puerta bronce.

PUENTE: Se acaban los discursos antes de la piedra nueva. Mueves la plata donde el metal busca la carne defensora del protocolo institucional convertido en músculo híbrido. El tramo deja sangre nueva sobre el mármol y un grito apenas amortiguado por la bóveda.

CONSECUENCIA: Frontera queda despejada pero estruendo baja telegrama violeta antes de tiempo hacia sala interior y tu bolsa física muestra nueva merma antes de enfrentamiento mayor.

RESULTADO: healthDamageDelta: -1 | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n6_cat_ancla",
          effects: [{ type: "healthDamageDelta", delta: 1 }],
        },
        {
          id: "n6_cat_pulso_corrupto",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes sangre_corrupta, inyectar pulso vivo de tu Hiel dentro del tatuaje ceremonial del umbral mismo.

PUENTE: Las palmas encuentran frío antes de que discurra filosofía práctica sobre el metal. Permites que algo violeta y domado avance desde tus venas hacia la herrumbre institucional. El resultado no es abrir: es podrir el plano físico mismo hasta que un pigmento verdoso y negro deja un boquete irregular hacia lo que sigue.

CONSECUENCIA: Ganas acceso físico rápido a cambio de un tramo más de Humanidad gastada y otra marca del mismo veneno.

RESULTADO: humanityDelta: -1 | setFlag: acceso_corrupto | IR A [BLOQUE 2]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n6_cat_ancla",
          effects: [
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "acceso_corrupto" },
          ],
        },
        {
          id: "n6_cat_legacy_sabotaje",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN E [MARCA LEGADA]: Si llegaste antes con puntos_debiles_visto (sin nueva visión desde triforio), cortar alimentación de cobre visible antes del descenso.

PUENTE: La daga de plata encuentra punto débil que ya ubicaste antes de estar aquí mismo: planchas sangrantes violeta sueltan intensidad suficiente para que rumor del subsuelo se queje igual que animal herido institucional.

CONSECUENCIA: Santiago siente mismo pinchazo nuevo en vínculo aunque ceremonial siga vivo arriba todavía esperando siguiente movimiento físico grande.

RESULTADO: willpowerDelta: -1 | setFlag: vinculo_fracturado | IR A [BLOQUE 2]`,
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "perspicacia", minLevel: 1 },
              { type: "flag", flag: "puntos_debiles_visto", equals: true },
              {
                type: "not",
                requirement: { type: "flag", flag: "vision_superior_ritual", equals: true },
              },
            ],
          },
          nextSceneId: "n6_cat_ancla",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "vinculo_fracturado" }],
        },
      ],
    },
    {
      id: "n6_cat_ancla",
      chapterId: "chapter06",
      title: "[ESCENA 6.2]: LA CÁMARA DEL ANCLA",
      text: `CONTEXTO: Cámara secreta bajo la cripta arzobispal. Las paredes de piedra están cubiertas por una red de capilares de cobre que pulsan con Hiel líquida.

NARRACIÓN: El descenso por la escalera de caracol termina en una estancia que exhala un frío antinatural. El aire es denso, cargado de estática que hace brillar la Hiel con un pulso violáceo rítmico. En el centro, dentro de un sarcófago de cristal reforzado con alquimia colonial, yace la Vástago primigenia. No es reliquia: es un ser vivo —o lo que queda de uno—, una Ventrue de la época de la Reconquista en un letargo de agonía. Su sangre se drena y filtra por el cobre para alimentar el Vínculo que somete a la ciudad.

El Príncipe de Santiago te espera junto al cristal, con las manos manchadas de la misma sustancia que corrompe el río. «Es el precio del orden», dice con voz quebrada. «Sin este sacrificio, nuestra casta se devoraría a sí misma en una semana. Tú ya viste la verdad. Ahora decide si eres el verdugo o el nuevo carcelero».`,
      flagAppends: [
        {
          flag: "vinculo_fracturado",
          text: "El sistema escupe chispas violetas y el ser tras el cristal abre los ojos, mirándote con una súplica silenciosa.",
        },
        {
          flag: "camino_despejado_peon",
          text: "El uniforme del guardia que enviabas delante yace disuelto junto a la entrada, consumido por la seguridad mística de la cámara.",
        },
        {
          flag: "neutralizacion_ines",
          text: "Inés ocupó medio discurso y luego cedió física sin aplaudir: ese hueco marca tu ingreso antes de que el pacto revise lealtades con lapicero.",
        },
        {
          flag: "sello_roto_con_nombre",
          text: "El nombre impronunciable donde la Biblioteca te enseñó a leer cortó un trámite de sangre en bronce antes de tiempo; abajo perdieron medio pulso ritual preparado contra intrusión.",
        },
        {
          flag: "acceso_corrupto",
          text: "Lo que llamaste entrada es carcoma violeta institucional: el hueco apesta igual que cicatriz en metal vivo y te recuerda lo que decidiste cargar antes de llegar hasta el sarcófago.",
        },
      ],
      options: [
        {
          id: "n6_cat_ancla_fortitud",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Romper el sarcófago de cristal con tus propias manos para liberar a la primigenia de su tormento.

PUENTE: Ignoras las descargas místicas que saltan del cristal. Golpeas con fuerza que fractura hueso y disciplina hasta que el envase estalla. El fluido púrpura inunda el suelo y el Vínculo de Santiago se rompe con un grito psíquico que resuena en cada vástago con linaje bajo el pacto.

CONSECUENCIA: Liberas al Ancla y el sistema de la Corte colapsa al instante: noche de caos y libre albedrío, pero el Príncipe te cargará con todo el odio que aún le quede en el cuerpo.

RESULTADO: healthDamageDelta: -2 | setFlag: vinculo_destruido | IR A [ESCENA 6.END]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n6_cat_cierre",
          effects: [{ type: "healthDamageDelta", delta: 2 }, { type: "setFlag", flag: "vinculo_destruido" }],
        },
        {
          id: "n6_cat_ancla_dom",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN B [DISCIPLINA: DOMINACIÓN]: Intentar suplantar la voluntad del Príncipe y reclamar el control del sistema para ti.

PUENTE: No buscas destruir el orden, sino heredarlo. Te acercas al circuito de filtración y, con tu propia sangre, intentas sintonizar tu voluntad con la de la primigenia. «El Príncipe falló. Yo soy el nuevo cauce», ruges dentro del cráneo, obligando a los capilares de cobre a reconocer tu autoridad.

CONSECUENCIA: No rompes el vínculo: lo desvías hacia tu persona. Te conviertes en el Usurpador, con poder político enorme y un alma atada a la corrupción eterna de la Hiel.

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
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Usar la daga de plata para una eutanasia mística y cerrar el ciclo de 1814.

PUENTE: Entiendes que este horror es la raíz de la enfermedad de Santiago. Clavas la daga de la Corte en el corazón de quien yace tras el cristal. La plata bendita disuelve la magia en un destello blanco que devora la Hiel y apaga el latido del subsuelo.

CONSECUENCIA: La primigenia muere en paz; el sistema se apaga por completo y el Príncipe pierde fuente visible de poder. Tú quedas al borde del letargo moral y físico.

RESULTADO: willpowerDelta: -2 | setFlag: ancla_muerta | IR A [ESCENA 6.END]`,
          requirement: { type: "none" },
          nextSceneId: "n6_cat_cierre",
          effects: [{ type: "willpowerDelta", delta: -2 }, { type: "setFlag", flag: "ancla_muerta" }],
        },
        {
          id: "n6_cat_ancla_diablerie",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes sangre_corrupta, devorar la esencia de la primigenia para evolucionar.

PUENTE: La Bestia reconoce una fuente ancestral. No liberas ni gobiernas: consumes. Te alimentas directamente de la vástago en letargo en una diablerie mística que te vuelca siglos de recuerdos y potencia de sangre pavorosa.

CONSECUENCIA: Tu poder salta, pero la marca del asesino de almas queda en tu aura. El espíritu de la primigenia vuelve como voz de agonía constante en tu cabeza.

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
      text: `CONTEXTO: La cámara secreta bajo la Catedral. 02:45 AM. Las paredes empiezan a ceder.

NARRACIÓN: El acto ya se consumó. Los cimientos de la soberanía de Santiago han cambiado para siempre. El edificio sobre ti gime mientras el sistema místico que lo sostenía se desintegra. Escapas de la cripta justo antes de que el suelo se trague el altar mayor. En la Plaza de Armas, el aire de la noche es frío y ya no huele a Hiel. A lo lejos, el Palacio Bruna empieza a arder: el vacío de poder desata una guerra civil entre los vástagos de la capital.

Desde aquí la crónica sólo admite dos pulsos:  
si rompiste la cadena, tocará reunir fuerzas para sobrevivir al incendio político de Santiago;  
si tomaste el vínculo para ti, tocará defender un trono recién nacido contra todo lo que aún lo niega.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          text: "Un alivio psíquico masivo atraviesa plaza y ciudad como ola tardía: el anillo que oprimía vástagos acaba de soltarse.",
        },
        {
          requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true },
          text: "Una arrogancia oscura y nueva te embriaga mientras el Príncipe cae de rodillas, derrotado: el nexo obedece tu pulso antes que el nombre viejo.",
        },
        {
          requirement: { type: "flag", flag: "ancla_muerta", equals: true },
          text: "No rompiste el vínculo a martillo abierto; lo pagaste con eutanasia ritual: la ciudad tiembla igual, pero cargas gesto menos ruidoso en la memoria.",
        },
        {
          requirement: { type: "flag", flag: "diablerista_ancestral", equals: true },
          text: "En tu cabeza conviven dos latidos donde antes había uno; cada paso en la plaza devuelve eco que no iniciaste tú.",
        },
      ],
      options: [
        {
          id: "n6_cat_cierre_ch7_llamas",
          type: "dialogue",
          text: "Capítulo 7: Santiago en Llamas — reunir a los clanes para el asalto final al palacio.",
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
          text: "Capítulo 7: El Ascenso del Tirano — defender tu trono contra el Príncipe y los leales supervivientes.",
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

Elena, mayordoma mayor de la Viña del Silencio y mano ceremonial del Príncipe en esta ruta, sostiene la copa con una calma que no admite discusión.

El Príncipe alza la voz: "Santiago necesita unidad, y la unidad requiere un sacrificio compartido". Elena te ofrece el borde del pacto.`,
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
          effects: [
            { type: "setFlag", flag: "deuda_con_gato" },
            { type: "setFlag", flag: "chapter07_route_rebelde" },
            { type: "setFlag", flag: "chapter_pending_chapter07" },
          ],
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
