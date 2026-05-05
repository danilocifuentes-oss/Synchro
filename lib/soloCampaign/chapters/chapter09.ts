import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Ruta Cajón del Maipo / Glaciar Negro (puente desde cap. 8). */
const reqArcoCap9Glaciar = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "chapter09_route_trono_hielo", equals: true },
    { type: "flag" as const, flag: "chapter09_route_ascension_hiel", equals: true },
    { type: "flag" as const, flag: "chapter09_route_nuevo_amanecer_purpura", equals: true },
  ],
};

const reqFinalSacrificioHumanidad = {
  type: "all" as const,
  requirements: [
    { type: "humanityMin" as const, min: 7 },
    { type: "not" as const, requirement: { type: "flag" as const, flag: "diablerista_ancestral", equals: true } },
  ],
};

const reqFinalUsurpadorODiabler = {
  type: "any" as const,
  requirements: [
    { type: "flag" as const, flag: "usurpador_del_vinculo", equals: true },
    { type: "flag" as const, flag: "diablerista_ancestral", equals: true },
  ],
};

/** Nada de A/B/C/D encaja por banderas ni humanidad: cierre martyrial de emergencia. */
const reqFinalGlaciarFallback = {
  type: "all" as const,
  requirements: [
    reqArcoCap9Glaciar,
    {
      type: "not" as const,
      requirement: {
        type: "any" as const,
        requirements: [
          reqFinalSacrificioHumanidad,
          reqFinalUsurpadorODiabler,
          { type: "flag" as const, flag: "control_de_drones", equals: true },
          { type: "flag" as const, flag: "sangre_corrupta", equals: true },
        ],
      },
    },
  ],
};

export function resolveChapter09EntrySceneId(flags?: Record<string, boolean>): string {
  const f = flags ?? {};
  if (
    f.chapter09_route_trono_hielo ||
    f.chapter09_route_ascension_hiel ||
    f.chapter09_route_nuevo_amanecer_purpura
  ) {
    return "n9_hielo_0";
  }
  return "n9_0";
}

export const chapter09: SoloChapter = {
  id: "chapter09",
  title: "Santiago en Cenizas · Capítulo 9 · Trono de Humo y Trono de Hielo",
  description:
    "Castillo Hidalgo desde la ciudad; descenso al Glaciar Negro cuando la crónica subió por la Fuente Madre desde Maipo.",
  startSceneId: "n9_0",
  scenes: [
    {
      id: "n9_hielo_0",
      chapterId: "chapter09",
      title: "[ESCENA 9.0]: EL CORAZÓN DE LA MONTAÑA",
      text: `CONTEXTO: Interior del Glaciar Negro, Cajón del Maipo. Catedral natural de hielo translúcido surcado por vetas violetas.

NARRACIÓN: El frío no es solo térmico; frena como una voluntad ajena la sangre en tus venas. Avanzas por un túnel cavado entre erosiones de Hiel líquida.

Al final se abre una bóveda colosal. En el centro, anclada en hielo milenario, la Fuente Madre: algo precolonial —cuarta generación o más viejo— cuyo sueño ordeñaron siglos para el Vínculo de Santiago.

El Traje Gris ya está allí instalando electrodos en la masa congelada, con drones que zumban como insectos.`,
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "chapter09_route_trono_hielo", equals: true },
          text: "Subiste tratando esta cámara como trono antes que como tumba: el pacto desde Bruna cerró hasta aquí.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "chapter09_route_ascension_hiel", equals: true },
              { type: "not", requirement: { type: "flag", flag: "chapter09_route_trono_hielo", equals: true } },
            ],
          },
          text: "Tu sangre corrupta marca el mismo tempo que las vetas violetas antes de verte a los ojos con la Fuente.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "chapter09_route_nuevo_amanecer_purpura", equals: true },
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "chapter09_route_trono_hielo", equals: true },
                    { type: "flag", flag: "chapter09_route_ascension_hiel", equals: true },
                  ],
                },
              },
            ],
          },
          text: "Sin la llave de la sangre ancestral a cuestas, cada paso cuesta tributo físico frente al tirón del glaciar antes de revelar la cámara.",
        },
      ],
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "principe_capturado", equals: true },
          text: "El Príncipe y su ADN viejo funcionan como contraseña táctil: el hielo se retira ante su paso con un reconocimiento ancestral.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "planta_destruida", equals: true },
              { type: "not", requirement: { type: "flag", flag: "principe_capturado", equals: true } },
            ],
          },
          text: "Sin ese ancla viva contra el tirón criogénico, abres trecho entre carámbanos de fuerza latente que lame tu vitalidad segundo a segundo.",
        },
      ],
      options: [
        {
          id: "n9_hielo_0_fort_equipo",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Atravesar el campo estático para destruir el equipo del Sastre.

PUENTE: Ignoras ráfagas de alta frecuencia de los drones. Tu marco Ventrue absorbe castigo hasta que aplastas servidores y consolas contra hielo eterno entre chispa y rechinar.

CONSECUENCIA: El Sastre pierde interfaz práctica contra la Fuente; la Hiel se descontrola en la cámara y el aire huele a tormenta psíquica naciente.

RESULTADO: healthDamageDelta: -1 | setFlag: tecnologia_sastre_destruida | IR A [ESCENA 9.1]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          visibilityRequirement: reqArcoCap9Glaciar,
          nextSceneId: "n9_hielo_1",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "tecnologia_sastre_destruida" }],
        },
        {
          id: "n9_hielo_0_domina_fuente",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN B [DISCIPLINA: DOMINACIÓN]: Ordenar a la Fuente Madre que despierte y purge intrusos.

PUENTE: Te aferras al latido del glaciar. No es discurso: es mandato linajudo. «Despierta. Reclama tu sangre. Expulsa parásitos», proyectas. El hielo gime y las vetas violetas despuntan hasta quemarte la retina.

CONSECUENCIA: La Fuente reacciona; una ola vaporiza seguridad cercana pero el rechazo fisura tus propios circuitos mentales.

RESULTADO: willpowerDelta: -2 | setFlag: despertar_de_la_fuente | IR A [ESCENA 9.1]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          visibilityRequirement: reqArcoCap9Glaciar,
          nextSceneId: "n9_hielo_1",
          effects: [{ type: "willpowerDelta", delta: -2 }, { type: "setFlag", flag: "despertar_de_la_fuente" }],
        },
        {
          id: "n9_hielo_0_daga_conductos",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Cortar con la daga de plata los conductos de succión contra el glaciar.

PUENTE: Tajas cables y manguitos sintéticos mientras el Sastre brama por «activos perdidos». La Hiel pura brota con presión, te empapa hasta embriagarte un instante en fuerza terrible y ajena.

CONSECUENCIA: Integridad del flujo devuelta a la Fuente, pero esa costra en la piel te ata al hielo. El Traje retrocede y alza un arma larga calibre guerra.

RESULTADO: setFlag: fluido_liberado | IR A [ESCENA 9.1]`,
          requirement: { type: "none" },
          visibilityRequirement: reqArcoCap9Glaciar,
          nextSceneId: "n9_hielo_1",
          effects: [{ type: "setFlag", flag: "fluido_liberado" }],
        },
      ],
    },
    {
      id: "n9_hielo_1",
      chapterId: "chapter09",
      title: "[ESCENA 9.1]: EL ENFRENTAMIENTO FINAL (FASE 1)",
      text: `CONTEXTO: Plataforma central de la caverna. Grietas escupen una luz violácea bajo tus pies hasta insinuar abismo debajo del hielo.

NARRACIÓN: El Traje Gris abandona la máscara corporativa. Pupilas vacías sugieren vástago, envase o algo peor desde la Viña global. «Santiago fue laboratorio», dice mientras arma un detonador térmico anclado al corazón del glaciar. «Si la Fuente no es nuestra, no será de nadie».`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "tecnologia_sastre_destruida", equals: true },
          text: "El arma del detonador parpadea error un segundo antes de recuperar ciclo —te ganas un tiempo fino antes del salto mortal.",
        },
        {
          requirement: { type: "flag", flag: "alianza_ines_final", equals: true },
          text: "Inés aparece por un lateral hendido, gastando sus últimas fuerzas contra los drones para frenarlos antes de volverse hacia ti.",
        },
      ],
      options: [
        {
          id: "n9_hielo_1_combate_duale",
          type: "skill",
          skill: "pelea",
          text: `OPCIÓN A [HABILIDAD: ACCIÓN / COMBATE]: Lanzarte a duelo a muerte para arrebatarle el detonador.

PUENTE: Garras, colmillos, Disciplinas sueltas: Tierra de Sangre marca cadencia mientras rozas el borde del abismo. Cada golpe resuena con millones arriba en Santiago bajo ceniza violeta.

CONSECUENCIA: Sangre cara a cara: lo hieres de peso pero él recupera pulsación suficiente para una detonación parcial; el macizo tiembla con furia nueva.

RESULTADO: healthDamageDelta: -1 | setFlag: sastre_herido | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "pelea", minLevel: 1 },
          visibilityRequirement: reqArcoCap9Glaciar,
          nextSceneId: "n9_hielo_2",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "sastre_herido" }],
        },
        {
          id: "n9_hielo_1_combate_nudo",
          type: "dialogue",
          text: `OPCIÓN A [HABILIDAD: ACCIÓN / COMBATE]: Cuerpo contra cuerpo sin coreografía felina pero con la misma apuesta mortal.

PUENTE: Te abalanzas igual de febril hasta pelear codos y pies por el comando del detonador mientras las grietas siguen agrandándose como una boca.

CONSECUENCIA: Ganas una franja de tiempo herido hasta los huesos; una carga parcial estruja el macizo igual que en el duelo hábil.

RESULTADO: healthDamageDelta: -1 | setFlag: sastre_herido | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoCap9Glaciar,
              { type: "not", requirement: { type: "skill", skill: "pelea", minLevel: 1 } },
            ],
          },
          nextSceneId: "n9_hielo_2",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "sastre_herido" }],
        },
        {
          id: "n9_hielo_1_presencia_drones",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN B [DISCIPLINA: PRESENCIA]: Reprogramar sobre la marcha la lealtad de los últimos drones hacia vos.

PUENTE: Proyectas mando suficiente para interferir los protocolos del Sastre. «Yo soy la fuente del mando. Reconozcan soberanía verdadera», estampas. Las plataformas giran contra su dueño antes de cubrir huecos con fuego cercano.

CONSECUENCIA: Dominas el espacio táctico; el Sastre se escapa dentro de niebla violeta guardando un último recurso antes de perder vista de él.

RESULTADO: setFlag: control_de_drones | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          visibilityRequirement: reqArcoCap9Glaciar,
          nextSceneId: "n9_hielo_2",
          effects: [{ type: "setFlag", flag: "control_de_drones" }],
        },
        {
          id: "n9_hielo_1_fusion_hielo",
          type: "dialogue",
          text: `OPCIÓN C [RIESGO - INSTINTO]: Fundir sangre corrupta con el glaciar para atacar desde todos los ángulos.

PUENTE: Dejas que la Hiel de tus arterias converse con lo negro y viejo detrás del cristal. Tu forma física se evapora en un cúmulo de cristales y sangre hasta recomponerte detrás del Sastre con un brazo en lanza oscura atravesándole el torso.

CONSECUENCIA: Ejecución técnica brillante pero la consciencia gélida y ajena empieza a morderte la orilla humana al ritmo ajeno que late abajo.

RESULTADO: humanityDelta: -2 | setFlag: ataque_desde_el_hielo | IR A [BLOQUE 2]`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          visibilityRequirement: reqArcoCap9Glaciar,
          nextSceneId: "n9_hielo_2",
          effects: [
            { type: "humanityDelta", delta: -2 },
            { type: "setFlag", flag: "ataque_desde_el_hielo" },
          ],
        },
      ],
    },
    {
      id: "n9_hielo_2",
      chapterId: "chapter09",
      title: "[ESCENA 9.2]: EL MOMENTO DE LA SINGULARIDAD",
      text: `CONTEXTO: El núcleo del Glaciar. El detonador del Sastre ha maltrecho la estructura y la Fuente Madre despierta o se derrumba: la presión mística aplasta hasta el pensamiento ordenado.

NARRACIÓN: El estruendo deja apenas silencios entre picos violentos.

Miles de metros más abajo, Santiago recibe ya el borde de una onda de choque psíquica: los vástagos en la ciudad se arrodillan o pierden cordura entre barrios en arrebato. Te quedan segundos antes de que el calor acumulado o el despertar total borren tu existencia.`,
      contextVariantByState: [
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "sastre_herido", equals: true },
              { type: "flag", flag: "ataque_desde_el_hielo", equals: true },
            ],
          },
          text: "El Traje Gris queda echado contra el hielo: la forma se licúa en un barro grisáceo donde la corporativa ya no tiene qué vestir ante la crudeza violeta.",
        },
        {
          requirement: {
            type: "all",
            requirements: [
              {
                type: "not",
                requirement: {
                  type: "any",
                  requirements: [
                    { type: "flag", flag: "sastre_herido", equals: true },
                    { type: "flag", flag: "ataque_desde_el_hielo", equals: true },
                  ],
                },
              },
              reqArcoCap9Glaciar,
            ],
          },
          text: "El Sastre aún mantiene vértigo y puntería donde el vapor no lo ahoga.",
        },
        {
          requirement: reqArcoCap9Glaciar,
          text: "El macizo resquebraja y algo ancestral asoma en el centro: ojos entre hielos milenarios que reflejan un futuro de ciudad en llamas violetas.",
        },
      ],
      options: [
        {
          id: "n9_hielo_2_final_martir",
          type: "dialogue",
          text: `OPCIÓN A [RUTA DEL SACRIFICIO · HUMANIDAD ALTA]: Usar la daga de plata y tu propia esencia para sellar la Fuente y limpiar la Hiel de Santiago.

PUENTE: Entiendes que la ciudad solo se salva si destruyes nexo y cuerpo a la vez. Clavas metal en el corazón del flujo y dejas que sangre Ventrue elegida por responsabilidad —no por ego— aisle el torrente hasta volverlo blanco. La corrupción púrpura se borra del hielo y del mapa arterial de la capital.

CONSECUENCIA: Tu nombre se apaga antes que el día; el vínculo de sangre ciudadano muere contigo en el silencio.

RESULTADO: FINAL 1: EL MÁRTIR DE LOS ANDES | setFlag: final_redencion`,
          requirement: reqFinalSacrificioHumanidad,
          visibilityRequirement: reqArcoCap9Glaciar,
          nextSceneId: "n9_hielo_epi",
          effects: [{ type: "setEnding", endingId: "endingB" }, { type: "setFlag", flag: "final_redencion" }],
        },
        {
          id: "n9_hielo_2_final_tirania",
          type: "dialogue",
          text: `OPCIÓN B [RUTA DEL PODER · USURPADOR/DIABLERISTA]: Devorar el núcleo de la Fuente y erigirte en soberano violeta sobre la cordillera.

PUENTE: No llegaste por caridad territorial. Saltas al centro vivo del glaciar y tragas incluso la Primigenia atrapada: la consciencia se te estira hasta cubrir crestas y cada gota vampírica bajo Santiago vibra ya como extensión tuya.

CONSECUENCIA: Sobrevives el eclipse térmico, pero ya no eres «solo» vampiro: eres geografía cruel con ambición lista para siglos fríos.

RESULTADO: FINAL 2: EL MONARCA PÚRPURA | setFlag: final_tirania`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [reqArcoCap9Glaciar, reqFinalUsurpadorODiabler],
          },
          nextSceneId: "n9_hielo_epi",
          effects: [{ type: "setEnding", endingId: "endingA" }, { type: "setFlag", flag: "final_tirania" }],
        },
        {
          id: "n9_hielo_2_final_arquitecto",
          type: "dialogue",
          text: `OPCIÓN C [RUTA DEL EQUILIBRIO · ESTRATEGIA]: Domar sistema y temperatura desde la tecnología que ya te obedece, con pacto nuevo sobre espaldas públicas del Príncipe o de Inés.

PUENTE: No destruyes todo: amortiguas ciclo térmico y caudales con red de drones aún enlazados a tus mandatos auditivos. Obligas a quien lleve corona vieja —o a tu aliada plateada si el soberano cayó antes— a rubricar tratado nuevo donde tú decides el gramaje de Hiel pura en la ciudad.

CONSECUENCIA: Paz de acero invernadero: prosperidad gélida bajo marca Viña donde la sombra ejecuta balance contable mejor que sermonario.

RESULTADO: FINAL 3: EL ARQUITECTO DEL SILENCIO | setFlag: final_estabilizacion`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoCap9Glaciar,
              { type: "flag", flag: "control_de_drones", equals: true },
            ],
          },
          nextSceneId: "n9_hielo_epi",
          effects: [{ type: "setEnding", endingId: "endingC" }, { type: "setFlag", flag: "final_estabilizacion" }],
        },
        {
          id: "n9_hielo_2_final_gehena",
          type: "dialogue",
          text: `OPCIÓN D [RUTA DEL CAOS · SANGRE CORRUPTA]: Dejar cumplir el detonador y regalar fuego violeta sobre el mundo.

PUENTE: La corrupción ya decidió antes de que abras la boca. Te apartas y dejas que la cuenta llegue a cero: el Glaciar Negro vomita una supernova hacia valle y mar; la Mascarada se rompe como vidrio viejo ante testigos masivos que ya no olvidarán mandíbulas en el noticiero.

CONSECUENCIA: Santiago es zona cero de un génesis vampírico ruidoso; huyes donde el día aún hiera menos mientras instituciones humanas se pudren de pánico.

RESULTADO: FINAL 4: EL HERALDO DE LA GEHENA | setFlag: final_caos`,
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              reqArcoCap9Glaciar,
              { type: "flag", flag: "sangre_corrupta", equals: true },
            ],
          },
          nextSceneId: "n9_hielo_epi",
          effects: [{ type: "setEnding", endingId: "endingD" }, { type: "setFlag", flag: "final_caos" }],
        },
        {
          id: "n9_hielo_2_final_martir_forzado",
          type: "dialogue",
          text: `OPCIÓN E [ÚLTIMO RECURSO]: Sin humanidad suficiente para el gesto soberano ni pactos marcados antes, igual clavas hierro antes de borrarte junto al nexo.

PUENTE: No tienes tiempo de filosofía cortés: prendes el hielo y tu torso como resistencia provisional hasta licuar la presión violeta antes de irte tras ella sin testigos.

RESULTADO: FINAL 1 (forzado): EL MÁRTIR DE LOS ANDES | setFlag: final_redencion`,
          requirement: { type: "none" },
          visibilityRequirement: reqFinalGlaciarFallback,
          nextSceneId: "n9_hielo_epi",
          effects: [{ type: "setEnding", endingId: "endingB" }, { type: "setFlag", flag: "final_redencion" }],
        },
      ],
    },
    {
      id: "n9_hielo_epi",
      chapterId: "chapter09",
      title: "[ESCENA FINAL]: EPÍLOGO",
      text: `CONTEXTO: Amanecer sobre la Cordillera de los Andes. 07:15 AM.

NARRACIÓN: El sol corona lentamente las cumbrías. Santiago destella lejos con la misma cuadrícula de luces que viste desde Bruna, pero la firma bajo tu piel ya no es la de la noche anterior: los archivos de la Biblioteca Nacional, el trono del Palacio Bruna y los túneles de la Estación Mapocho quedaron como cicatrices de una guerra que cerraste aquí arriba.

Un viento frío sube desde el sur. Ajustas la chaqueta: quizá por última vez, quizá para inaugurar un reinado que dure lo que duren el hielo, el negocio y la fe de quien firma después.

FIN DE LA CRÓNICA: VENTRUE · SANTIAGO EN CENIZAS.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "final_redencion", equals: true },
          text: "Tu pulso ya no acompaña el amanecer en la ladera: lo que queda es eco blanco en valle y vástagos que despiertan sin cadenas invisibles en la frente.",
        },
        {
          requirement: { type: "flag", flag: "final_tirania", equals: true },
          text: "Sigues de pie porque la cordillera ahora registra tus pasos antes que los del viento corporativo viejo.",
        },
        {
          requirement: { type: "flag", flag: "final_estabilizacion", equals: true },
          text: "El primer correo ejecutivo descendió antes que el día: agendas de distribución ordenada esperan firma violeta apenas bajes.",
        },
        {
          requirement: { type: "flag", flag: "final_caos", equals: true },
          text: "La niebla violeta llegó hasta el borde habitado; la ciudad abajo grita otros nombres que ya no son sólo humanos.",
        },
      ],
      options: [
        {
          id: "n9_hielo_epi_cerrar",
          type: "dialogue",
          text: "Cerrar la crónica Ventrue y volver al Nexo.",
          requirement: { type: "none" },
          visibilityRequirement: reqArcoCap9Glaciar,
          nextSceneId: "n9_hielo_epi",
          effects: [
            { type: "setFlag", flag: "chapter09_glaciar_bloque2_completo" },
            { type: "setFlag", flag: "novel_epilogue_complete" },
          ],
        },
      ],
    },
    {
      id: "n9_0",
      chapterId: "chapter09",
      title: "9.0 · La ascensión al Castillo Hidalgo",
      text: `Terraza del Castillo Hidalgo. El cielo es un remolino de nubes negras y relámpagos azules.

El Príncipe te espera rodeado por una presencia antigua que deforma el aire: "Has roto el sello. Santiago será el banquete de los Antiguos".`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "gran_alianza", equals: true },
          text: "Subes entre disparos y gritos de guerra de una alianza imposible.",
        },
        {
          requirement: { type: "flag", flag: "asalto_solitario", equals: true },
          text: "Subes solo, con las manos manchadas por hiel y polvo de estatua.",
        },
      ],
      options: [
        {
          id: "n9_0_liderazgo",
          type: "dialogue",
          text: "Ordenar el ataque coordinado.",
          requirement: { type: "flag", flag: "gran_alianza", equals: true },
          nextSceneId: "n9_1",
          effects: [{ type: "willpowerDelta", delta: 2 }, { type: "setFlag", flag: "brecha_abierta" }],
        },
        {
          id: "n9_0_dominate_letania",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Excomunión de traidores",
          text: "Anular el ritual recitando la lista de traidores.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "dominate", minLevel: 1 },
              { type: "flag", flag: "lista_traidores", equals: true },
            ],
          },
          nextSceneId: "n9_1",
          effects: [{ type: "hungerDelta", delta: 2 }, { type: "setFlag", flag: "ritual_debilitado" }],
        },
        {
          id: "n9_0_fortitude_nexo",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Cruzar fuego azul",
          text: "Lanzarte a las llamas para tocar el nexo.",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n9_1",
          effects: [{ type: "healthDamageDelta", delta: -3 }, { type: "setFlag", flag: "contacto_directo_nexo" }],
        },
        {
          id: "n9_0_ultimo_recurso",
          type: "dialogue",
          text: "Empujar el ritual a pura obstinación mortal, sin táctica ni discurso.",
          requirement: { type: "none" },
          nextSceneId: "n9_1",
          effects: [{ type: "willpowerDelta", delta: -2 }, { type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "brecha_tanteo" }],
        },
      ],
    },
    {
      id: "n9_1",
      chapterId: "chapter09",
      title: "9.1 · El último duelo de voluntades",
      text: `El centro del castillo se abre bajo tus pies: abajo, una ciudad de huesos.

El Príncipe blande una espada de sombra sólida. Esto ya no es solo acero: es quién tiene derecho a gobernar las cenizas.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          text: "Te mira con odio antiguo: cortaste la cadena que lo mantenía por encima de todos.",
        },
        {
          requirement: { type: "flag", flag: "usurpador_del_vinculo", equals: true },
          text: "Se ríe de tu ambición: \"Quieres mi corona, pero no su peso\".",
        },
      ],
      options: [
        {
          id: "n9_1_potence",
          type: "discipline",
          discipline: "potence",
          disciplineTitle: "Decapitar la tiranía",
          text: "Asestar un golpe final que quiebre su guardia.",
          requirement: { type: "discipline", discipline: "potence", minLevel: 1 },
          nextSceneId: "n9_2",
          effects: [{ type: "setFlag", flag: "principe_caido" }],
        },
        {
          id: "n9_1_majestad",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Majestad",
          text: "Reclamar soberanía absoluta frente al nexo.",
          requirement: { type: "discipline", discipline: "presence", minLevel: 2 },
          nextSceneId: "n9_2",
          effects: [{ type: "humanityDelta", delta: -2 }, { type: "setFlag", flag: "nuevo_principe_santiago" }],
        },
        {
          id: "n9_1_cura",
          type: "dialogue",
          text: "Inyectar la muestra en el corazón del ritual.",
          requirement: { type: "flag", flag: "cura_encontrada", equals: true },
          nextSceneId: "n9_2",
          effects: [{ type: "willpowerDelta", delta: -3 }, { type: "setFlag", flag: "santiago_purificada" }],
        },
        {
          id: "n9_1_potencia_bruta",
          type: "skill",
          skill: "pelea",
          text: "Golpear con todo lo humano que te queda: sin Potencia de linaje, solo furia y costilla rota.",
          requirement: { type: "skill", skill: "pelea", minLevel: 1 },
          nextSceneId: "n9_2",
          effects: [
            { type: "humanityDelta", delta: -1 },
            { type: "healthDamageDelta", delta: -2 },
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "principe_caido" },
          ],
        },
        {
          id: "n9_1_sin_dones",
          type: "dialogue",
          text: "Arrojarte al Príncipe sin disciplina de nobleza: morder, arrastrar, sobrevivir.",
          requirement: { type: "none" },
          nextSceneId: "n9_2",
          effects: [
            { type: "humanityDelta", delta: -1 },
            { type: "healthDamageDelta", delta: -2 },
            { type: "hungerDelta", delta: 2 },
            { type: "setFlag", flag: "principe_caido" },
          ],
        },
      ],
    },
    {
      id: "n9_2",
      chapterId: "chapter09",
      title: "9.2 · El amanecer negro",
      text: `El silencio cae sobre el cerro. Las llamas se apagan. El primer rayo asoma por la cordillera.

Has ganado, pero el precio está escrito en cenizas.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "nuevo_principe_santiago", equals: true },
          text: "Inés y Gato se arrodillan, esperando tu primera orden.",
        },
        {
          requirement: { type: "flag", flag: "santiago_purificada", equals: true },
          text: "Te quedas solo en las ruinas mientras el sol empieza a quemar.",
        },
      ],
      options: [
        {
          id: "n9_2_final_tirano",
          type: "dialogue",
          text: "Ejecutar disidentes y reconstruir la Corte bajo tu puño.",
          requirement: { type: "flag", flag: "nuevo_principe_santiago", equals: true },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingA" }, { type: "setFlag", flag: "final_trono_sangre" }],
        },
        {
          id: "n9_2_final_martir",
          type: "dialogue",
          text: "Entregar el control a los Anarquistas y desaparecer en el sol.",
          requirement: { type: "flag", flag: "vinculo_destruido", equals: true },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingB" }, { type: "setFlag", flag: "final_cenizas_libertad" }],
        },
        {
          id: "n9_2_final_estratega",
          type: "dialogue",
          text: "Mantener la fachada Camarilla y gobernar desde las sombras.",
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "doble_agente", equals: true },
              { type: "flag", flag: "santiago_purificada", equals: true },
            ],
          },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingC" }, { type: "setFlag", flag: "final_paz_sepulcros" }],
        },
        {
          id: "n9_2_final_victoria_sangrienta",
          type: "dialogue",
          text: "Imponer tu victoria a cuchillo: sin corona mística, pero con miedo suficiente para que obedezcan.",
          requirement: { type: "flag", flag: "principe_caido", equals: true },
          visibilityRequirement: {
            type: "not",
            requirement: {
              type: "any",
              requirements: [
                { type: "flag", flag: "nuevo_principe_santiago", equals: true },
                { type: "flag", flag: "vinculo_destruido", equals: true },
                { type: "flag", flag: "santiago_purificada", equals: true },
              ],
            },
          },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingA" }, { type: "setFlag", flag: "final_trono_sangre_bruta" }],
        },
        {
          id: "n9_2_final_purificacion_sola",
          type: "dialogue",
          text: "Caminar entre ruinas con la cura hecha efecto: entregar el relevo a quienes puedan sostener el caos.",
          requirement: {
            type: "all",
            requirements: [
              { type: "flag", flag: "santiago_purificada", equals: true },
              { type: "not", requirement: { type: "flag", flag: "doble_agente", equals: true } },
            ],
          },
          nextSceneId: "n9_end",
          effects: [{ type: "setEnding", endingId: "endingB" }, { type: "setFlag", flag: "final_cenizas_tras_cura" }],
        },
      ],
    },
    {
      id: "n9_end",
      chapterId: "chapter09",
      title: "9.E · Santiago después de la tormenta",
      text: `Las cámaras llaman "fenómeno geológico" a las ruinas del Santa Lucía.

Los vivos olvidan rápido. En sótanos y torres, tu nombre se susurra con miedo y reverencia.`,
      options: [
        {
          id: "n9_end_close",
          type: "dialogue",
          text: "Cerrar la ruta Ventrue.",
          requirement: { type: "none" },
          nextSceneId: "n9_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_epilogue" }],
        },
      ],
    },
  ],
};
