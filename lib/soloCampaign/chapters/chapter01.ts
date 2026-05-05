import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter01: SoloChapter = {
  id: "chapter01",
  title: "CLAN: VENTRUE | CAPÍTULO 1: EL BESO DEL MAPOCHO",
  description: "Despertar en Teatinos, centinela en la calle y primer cobro junto al Mapocho.",
  startSceneId: "n1_0",
  scenes: [
    {
      id: "n1_0",
      chapterId: "chapter01",
      title: "[ESCENA 1.0]: EL DESPERTAR EN LA IMPRENTA",
      text: `CONTEXTO: Sótano de una vieja imprenta en calle Teatinos. Oscuridad casi total. El aire huele a tinta seca, moho y a algo metálico que reconoces como sangre vieja.

NARRACIÓN: El silencio es lo primero que te golpea; un vacío absoluto donde debería estar el ritmo de tu corazón. Al incorporarte, el crujido de la madera bajo tu peso suena como un disparo en la habitación vacía. En tu garganta persiste un ardor químico: el recuerdo del frasco que un anciano te entregó en la calle Bandera antes de que el mundo se borrara. Tu linaje Ventrue se rebela ante la inmundicia del suelo; un Rey no debería despertar entre cajas de cartón y ratas. El hambre es una garra que aprieta tus entrañas, pero tu orgullo exige entender quién te ha puesto en esta situación.`,
      options: [
        {
          id: "n1_0_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Forzar a tu mente a ignorar el hambre y el frío para concentrarte en el recuerdo del Abrazo.

PUENTE: Cierras los ojos y tensas tu voluntad. El dolor del hambre se vuelve un ruido de fondo mientras obligas a los fragmentos de memoria a encajar como piezas de un rompecabezas de mármol...

CONSECUENCIA: Recuperas el protocolo de emergencia de la Corte y el nombre de tu sire.

RESULTADO: willpowerDelta: +1 | setFlag: protocolo_corte | IR A [ESCENA 1.1]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n1_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "protocolo_corte" }],
        },
        {
          id: "n1_0_investigacion",
          type: "skill",
          skill: "investigacion",
          text: `OPCIÓN B [HABILIDAD: INVESTIGACIÓN]: Registrar meticulosamente el sótano buscando rastros físicos de tus "anfitriones".

PUENTE: Ignoras el malestar y obligas a tus manos a registrar el entorno. Tus dedos rozan el metal frío de las prensas hasta dar con un pequeño objeto de vidrio escondido bajo un palé...

CONSECUENCIA: Hallas el frasco vacío con un sello de lacre: una "V" entrelazada con espinas.

RESULTADO: setFlag: sello_viña | IR A [ESCENA 1.1]`,
          requirement: { type: "skill", skill: "investigacion", minLevel: 1 },
          nextSceneId: "n1_1",
          effects: [{ type: "setFlag", flag: "sello_viña" }],
        },
        {
          id: "n1_0_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Incorporarte con dignidad y buscar la salida hacia la calle para recuperar el control.

PUENTE: Te sacudes el polvo de la chaqueta con un gesto automático. No sabes qué ha pasado, pero no lo averiguarás en este agujero. Subes las escaleras con paso firme, buscando el aire de la noche...

CONSECUENCIA: Sales a la calle rápidamente, manteniendo tu compostura pero sin pistas sobre quién te dejó allí.

RESULTADO: (Avance estándar) | IR A [ESCENA 1.1]`,
          requirement: { type: "none" },
          nextSceneId: "n1_1",
        },
        {
          id: "n1_0_instinto",
          type: "dialogue",
          text: `OPCIÓN D [RÍSGO - INSTINTO]: Ceder al pánico del hambre y salir corriendo a la calle en busca de la primera fuente de vida.

PUENTE: La Bestia toma el control. No hay pensamientos, solo necesidad. Subes las escaleras a gatas, empujando la puerta con una fuerza inhumana que la saca de sus bisagras...

CONSECUENCIA: Sales a la calle en un estado semi-frenético, lo que te hace vulnerable a ser detectado.

RESULTADO: hungerDelta: +1 | humanityDelta: -1 | setFlag: rastro_violento | IR A [ESCENA 1.3]`,
          requirement: { type: "none" },
          nextSceneId: "n1_3",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "rastro_violento" },
          ],
        },
      ],
    },
    {
      id: "n1_1",
      chapterId: "chapter01",
      title: "[ESCENA 1.1]: EL CENTINELA DE TEATINOS",
      text: `CONTEXTO: Calle Teatinos, afuera de la imprenta. La noche es fría y el alumbrado público parpadea.

NARRACIÓN: El aire de Santiago te golpea la cara. A pocos metros, oculto tras un contenedor de basura, un hombre andrajoso te observa. No es un vagabundo común; su mirada es fija, profesional. Al notar que lo has visto, intenta fingir que busca comida, pero sus manos —demasiado limpias para su ropa— lo delatan. Es un centinela que ha estado esperando que la puerta de la imprenta se abriera.`,
      options: [
        {
          id: "n1_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Atrapar su mirada y ordenarle que confiese quién lo envió.

PUENTE: Te acercas con una lentitud depredadora. Tus ojos encuentran los suyos y el peso de tu linaje aplasta su voluntad como si fuera cristal...

CONSECUENCIA: El hombre confiesa que un "hombre de traje gris" le paga por vigilarte y reportar tu salida.

RESULTADO: hungerDelta: +1 | setFlag: info_traje_gris | IR A [ESCENA 1.3]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n1_3",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "info_traje_gris" }],
        },
        {
          id: "n1_1_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: `OPCIÓN B [HABILIDAD: PERSPICACIA]: Observar sus gestos y equipo antes de que pueda reaccionar.

PUENTE: Te detienes a una distancia prudente. Analizas la forma en que se toca el bolsillo del pecho: un bulto rectangular, probablemente un teléfono o una radio. No es un mendigo, es un informante...

CONSECUENCIA: Identificas que está transmitiendo tu posición en tiempo real.

RESULTADO: setFlag: vigilado_en_vivo | IR A [ESCENA 1.3]`,
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n1_3",
          effects: [{ type: "setFlag", flag: "vigilado_en_vivo" }],
        },
        {
          id: "n1_1_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Acercarte con calma y tratar de comprar su silencio o información.

PUENTE: Sacas tu billetera de cuero, esperando que el dinero mortal aún tenga valor. "Dime para quién trabajas y esta noche será la más afortunada de tu vida", dices con tono transaccional...

CONSECUENCIA: El hombre duda, acepta el dinero pero huye asustado, dándote solo un nombre a medias: "La Viña".

RESULTADO: setFlag: pista_viña | IR A [ESCENA 1.3]`,
          requirement: { type: "none" },
          nextSceneId: "n1_3",
          effects: [{ type: "setFlag", flag: "pista_viña" }],
        },
        {
          id: "n1_1_violencia",
          type: "dialogue",
          text: `OPCIÓN D [RÍSGO - VIOLENCIA]: Silenciar al testigo antes de que pueda dar la alarma.

PUENTE: No te arriesgarás a que un mortal arruine tu anonimato. Te lanzas sobre él con una velocidad que tu cuerpo humano nunca tuvo. Tus manos se cierran sobre su garganta...

CONSECUENCIA: Eliminas la amenaza, pero dejas un cadáver que la policía encontrará en breve.

RESULTADO: humanityDelta: -1 | setFlag: rastro_sangre | IR A [ESCENA 1.3]`,
          requirement: { type: "none" },
          nextSceneId: "n1_3",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "rastro_sangre" }],
        },
      ],
    },
    {
      id: "n1_3",
      chapterId: "chapter01",
      title: "[ESCENA 1.3]: EL BANQUETE DEL RÍO (PUNTO DE CONVERGENCIA)",
      text: `CONTEXTO: Baranda del río Mapocho, cerca del Mercado Central. Las luces de la ciudad se reflejan en el agua turbia.

NARRACIÓN: El hambre se ha vuelto un rugido insoportable. Ves a un joven solitario apoyado en el puente, fumando y mirando el cauce del río. Es la oportunidad perfecta. Debes decidir cómo realizar tu primer "cobro" como vástago. La forma en que te alimentes hoy definirá la fuerza de tu Bestia mañana.`,
      options: [
        {
          id: "n1_3_presencia",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Usar tu encanto sobrenatural para que el joven se acerque voluntariamente.

PUENTE: Emites un aura de confianza y magnetismo. El joven te mira y, sin saber por qué, se siente atraído hacia ti, bajando la guardia por completo...

CONSECUENCIA: Te alimentas sin violencia, dejando al joven en un estado de euforia, sin recuerdos traumáticos.

RESULTADO: hungerDelta: -2 | setFlag: beso_ventrue | IR A [ESCENA 1.END]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n1_cita_mascara",
          effects: [{ type: "hungerDelta", delta: -2 }, { type: "setFlag", flag: "beso_ventrue" }],
        },
        {
          id: "n1_3_sigilo",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN B [HABILIDAD: SIGILO]: Acecharlo desde las sombras y tomar lo que necesitas sin que sepa qué lo golpeó.

PUENTE: Te fundes con la oscuridad de los pilares del puente. Te mueves sin hacer ruido hasta quedar a su espalda. Un movimiento rápido, y tus colmillos encuentran su cuello...

CONSECUENCIA: Te alimentas rápidamente, pero el forcejeo deja marcas visibles.

RESULTADO: hungerDelta: -2 | willpowerDelta: -1 | IR A [ESCENA 1.END]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n1_cita_mascara",
          effects: [{ type: "hungerDelta", delta: -2 }, { type: "willpowerDelta", delta: -1 }],
        },
        {
          id: "n1_3_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Inventar una excusa para llevarlo a un callejón oscuro.

PUENTE: "Disculpa, ¿tienes fuego? Se me ha parado el coche ahí atrás y necesito ayuda", dices con tu mejor máscara de ciudadano en apuros. El joven, ingenuo, accede a seguirte...

CONSECUENCIA: Logras alimentarte en privado, aunque la culpa de la mentira persiste.

RESULTADO: hungerDelta: -2 | IR A [ESCENA 1.END]`,
          requirement: { type: "none" },
          nextSceneId: "n1_cita_mascara",
          effects: [{ type: "hungerDelta", delta: -2 }],
        },
        {
          id: "n1_3_instinto",
          type: "dialogue",
          text: `OPCIÓN D [RÍSGO - INSTINTO]: Beber hasta drenarlo por completo para recuperar toda tu fuerza.

PUENTE: El sabor de la sangre es demasiado bueno. No puedes detenerte. Ignoras sus espasmos y sus súplicas silenciosas mientras su corazón late por última vez...

CONSECUENCIA: Recuperas toda tu vitalidad, pero has cometido un asesinato innecesario.

RESULTADO: hungerDelta: -3 | humanityDelta: -2 | setFlag: asesino_de_mapocho | IR A [ESCENA 1.END]`,
          requirement: { type: "none" },
          nextSceneId: "n1_cita_mascara",
          effects: [
            { type: "hungerDelta", delta: -3 },
            { type: "humanityDelta", delta: -2 },
            { type: "setFlag", flag: "asesino_de_mapocho" },
          ],
        },
      ],
    },
    {
      id: "n1_cita_mascara",
      chapterId: "chapter01",
      title: "[ESCENA 1.END]: LA CITA CON LA MÁSCARA",
      text: `CONTEXTO: El joven yace en el suelo (vivo o muerto). El aire se vuelve gélido de repente.

NARRACIÓN: Te limpias la comisura de los labios. Al alzar la vista, ves a una mujer de una elegancia anacrónica esperándote al final del puente. Es Doña Inés. Su palidez es perfecta, su ropa de sastre impecable. Te observa con la mirada de quien examina una propiedad recién adquirida. "El Príncipe te espera en el Palacio Bruna", dice. "No hagas que se arrepienta de haberte dado una segunda oportunidad".

BIFURCACIÓN DE SALIDA:

Si setFlag: rastro_violento o rastro_sangre: Inés te mira con asco. "Eres un animal. Limpia tus huellas antes de que la Inquisición las encuentre". -> IR A [CAPÍTULO 2: RUTA DEL PARIA]

Si setFlag: beso_ventrue: Inés asiente levemente. "Al menos conservas el estilo de tu linaje. Sígueme". -> IR A [CAPÍTULO 2: RUTA DEL EMBAJADOR]

Si setFlag: info_traje_gris: Tienes la opción de preguntarle por el hombre del traje, lo que cambia su actitud a una más defensiva. -> IR A [CAPÍTULO 2: RUTA DE LA INTRIGA]`,
      options: [
        {
          id: "n1_cita_paria",
          type: "dialogue",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "rastro_violento" },
              { type: "flag", flag: "rastro_sangre" },
            ],
          },
          text: `Salida — RUTA DEL PARIA (prioridad si rastro_violento o rastro_sangre).

Inés te mira con asco. "Eres un animal. Limpia tus huellas antes de que la Inquisición las encuentre".

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
                    { type: "flag", flag: "rastro_violento" },
                    { type: "flag", flag: "rastro_sangre" },
                  ],
                },
              },
              { type: "flag", flag: "beso_ventrue" },
            ],
          },
          text: `Salida — RUTA DEL EMBAJADOR (si beso_ventrue y sin rastro_violento/rastro_sangre).

Inés asiente levemente. "Al menos conservas el estilo de tu linaje. Sígueme".

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
                    { type: "flag", flag: "rastro_violento" },
                    { type: "flag", flag: "rastro_sangre" },
                  ],
                },
              },
              { type: "flag", flag: "info_traje_gris" },
              { type: "flag", flag: "beso_ventrue", equals: false },
            ],
          },
          text: `Salida — RUTA DE LA INTRIGA (si info_traje_gris, sin violencia en Teatinos y sin beso_ventrue activo como prioridad de embajador).

Tienes la opción de preguntarle por el hombre del traje, lo que cambia su actitud a una más defensiva.

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
                    { type: "flag", flag: "rastro_violento" },
                    { type: "flag", flag: "rastro_sangre" },
                  ],
                },
              },
              { type: "flag", flag: "beso_ventrue", equals: false },
              { type: "flag", flag: "info_traje_gris", equals: false },
            ],
          },
          text: `Camino estándar hacia el Palacio Bruna (cuando ninguna de las bifurcaciones anteriores aplica por banderas).

Sigues a Inés hacia la cita; el tono es frío, pero sin la condena del paria ni la validación explícita del embajador.

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
