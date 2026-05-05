import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter03: SoloChapter = {
  id: "chapter03",
  title: "Santiago en Cenizas · CAPÍTULO 3: EL ECO DE LA HIEL",
  description:
    "Estación Mapocho, el Nido bajo el río, la Hiel y el informe ante Doña Inés: rutas hacia el Capítulo 4.",
  startSceneId: "n3_0",
  scenes: [
    {
      id: "n3_0",
      chapterId: "chapter03",
      title: "[ESCENA 3.0]: LOS ANDENES DEL ABISMO",
      text: `CONTEXTO: Centro Cultural Estación Mapocho. 04:15 AM. Un viento gélido arrastra basura por la explanada desierta frente al río.
NARRACIÓN: La Estación Mapocho se yergue frente a ti como un esqueleto de hierro y cristal, un monumento a una gloria pasada que ahora solo alberga sombras y ecos. Si vienes como agente_oficial, el sedán negro queda estacionado en la penumbra, su motor emitiendo un tic-tac metálico mientras se enfría. Si tienes reputacion_animal, llegas con los zapatos manchados por el barro de las calles aledañas y los pulmones cargados de la polución del centro.

El aire aquí huele a metal oxidado y a algo más... una nota dulzona y podrida que hace que tu sangre hierva de advertencia. Es la Hiel. No es solo un contaminante; es una presencia que parece absorber el sonido de la ciudad. Las puertas de acceso lateral están encadenadas, pero el sobre del Príncipe contiene una llave de bronce que encaja perfectamente. Al girarla, el chirrido del metal suena como un lamento que resuena en la nave vacía de la estación, alertando a cualquier cosa que respire —o no— en su interior.`,
      contextVariantByState: [
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "embajador_corte", equals: true },
              { type: "flag", flag: "agente_oficial", equals: true },
              { type: "flag", flag: "cap3_sedan_blindado", equals: true },
            ],
          },
          text: "Llegada con logística de Corte visible: blindado apostado fuera del complejo.",
        },
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "mision_castigo", equals: true },
              { type: "flag", flag: "cap3_salida_a_pie", equals: true },
            ],
          },
          text: "Llegada desde el perímetro urbano: sin cortesía ni escolta; el edificio se impone igual.",
        },
      ],
      options: [
        {
          id: "n3_0_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Ignorar la náusea provocada por la Hiel y avanzar directamente hacia el foco del hedor en los niveles inferiores.

PUENTE: El aire se vuelve denso, casi sólido. Sientes que tus pulmones se contraen por reflejo ante la toxicidad. Tensas tu voluntad y endureces tu cuerpo, convirtiéndote en una estatua de mármol que camina entre la bruma púrpura sin vacilar...

CONSECUENCIA: Atraviesas la zona más contaminada rápidamente. Llegas a la sala de máquinas sin fatiga, pero el esfuerzo ha drenado parte de tu energía vital.

RESULTADO: willpowerDelta: -1 | setFlag: resistencia_toxica | IR A [ESCENA 3.1]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n3_1",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "resistencia_toxica" }],
        },
        {
          id: "n3_0_sigilo",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN B [HABILIDAD: SIGILO]: Moverte por las pasarelas superiores de hierro para evitar el contacto con los fluidos del suelo.

PUENTE: Te encaramas a una escalera de incendios oxidada. Tus movimientos son fluidos y silenciosos, una sombra entre las vigas de acero de la techumbre. Desde arriba, observas cómo el suelo de la estación brilla con una pátina aceitosa de color violáceo que parece moverse por sí misma...

CONSECUENCIA: Detectas a un grupo de figuras encapuchadas (Vástagos del Sabat) operando cerca de las vías antes de que ellos noten tu presencia.

RESULTADO: setFlag: observador_superior | IR A [ESCENA 3.1]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n3_1",
          effects: [{ type: "setFlag", flag: "observador_superior" }],
        },
        {
          id: "n3_0_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Usar la linterna de tu equipo para buscar señales de entrada forzada o ruidos sospechosos.

PUENTE: No te arriesgas a ciegas. El haz de luz corta la oscuridad, revelando huellas de botas pesadas que se dirigen hacia el sector de las antiguas boleterías. Sigues el rastro con la mano en la empuñadura de la daga de plata, cada sombra parece cobrar vida ante tu luz...

CONSECUENCIA: Avanzas con precaución. Encuentras un rastro de sangre fresca con un brillo fluorescente antinatural.

RESULTADO: setFlag: rastro_sangre_hiel | IR A [ESCENA 3.1]`,
          requirement: { type: "none" },
          nextSceneId: "n3_1",
          effects: [{ type: "setFlag", flag: "rastro_sangre_hiel" }],
        },
        {
          id: "n3_0_sastre",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes setFlag: secreto_del_sastre, desviarte para buscar marcas del Hombre del Traje en este lugar.

PUENTE: Ignoras la ruta lógica. Buscas algo que no encaje con la suciedad de la estación: una colilla de cigarrillo de marca cara, un aroma a sándalo. Encuentras una marca de tiza en un pilar: un círculo tachado con una fecha: 1814.

CONSECUENCIA: Confirmas la conexión histórica del Sastre con la ciudad. El tiempo se agota y el hambre empieza a punzar de nuevo por el esfuerzo.

RESULTADO: hungerDelta: +1 | setFlag: marca_1814 | IR A [ESCENA 3.1]`,
          requirement: {
            type: "all",
            requirements: [{ type: "flag", flag: "secreto_del_sastre", equals: true }],
          },
          nextSceneId: "n3_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "marca_1814" }],
        },
      ],
    },
    {
      id: "n3_1",
      chapterId: "chapter03",
      title: "[ESCENA 3.1]: EL ENCUENTRO CON EL CHORO",
      text: `CONTEXTO: Nivel subterráneo, bajo las vías de carga. El agua del Mapocho gotea desde el techo con un sonido rítmico.
NARRACIÓN: El descenso te lleva a las tripas de Santiago. El sonido de la ciudad es sustituido por un eco viscoso. En una cámara de ladrillo colonial, una figura emerge de una tubería de desagüe. Es El Choro. Su piel es una amalgama de cicatrices y pústulas que parecen brillar con una luz mortecina en la oscuridad. No viste ropa, sino jirones de cuero pegados a su cuerpo por la inmundicia.

"Un príncipe de seda en mi jardín de barro", sisea el Nosferatu, mostrando unos dientes afilados como agujas. "Hueles a Palacio Bruna... hueles a miedo perfumado. ¿Vienes a morir con las ratas o tienes algo que ofrecer a los que viven en la mierda?".`,
      options: [
        {
          id: "n3_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Someterlo a tu rango y ordenarle que te guíe al núcleo de la infección.

PUENTE: Das un paso al frente, tus ojos se clavan en los suyos. No hay rastro de duda en tu voz. "Soy la voluntad de la Corte, y tú eres la herramienta. Camina o te convertiré en ceniza antes de que el agua toque el suelo", ordenas con el peso de tu linaje.

CONSECUENCIA: El Nosferatu se estremece, su voluntad se quiebra ante la tuya. Te guiará, pero su odio hacia ti y hacia la Camarilla se vuelve absoluto.

RESULTADO: hungerDelta: +1 | setFlag: guia_esclavo | IR A [BLOQUE 2]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n3_2",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "guia_esclavo" },
            { type: "setFlag", flag: "odio_nosferatu" },
          ],
        },
        {
          id: "n3_1_persuasion",
          type: "skill",
          skill: "persuasion",
          text: `OPCIÓN B [HABILIDAD: PERSUASIÓN]: Ofrecerle una promesa de estatus o protección a cambio de su cooperación.

PUENTE: "El Príncipe te ignora, pero yo reconozco quién manda realmente bajo estos cimientos", dices manteniendo una distancia diplomática. "Ayúdame a limpiar esta Hiel y me aseguraré de que tu refugio sea respetado por la Torre".

CONSECUENCIA: El Choro ríe con amargura, pero acepta el trato. Tienes un aliado que conoce los atajos y las trampas del lugar.

RESULTADO: setFlag: alianza_nosferatu | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "persuasion", minLevel: 1 },
          nextSceneId: "n3_2",
          effects: [{ type: "setFlag", flag: "alianza_nosferatu" }],
        },
        {
          id: "n3_1_dialogo",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Preguntar directamente por el origen de la Hiel sin rodeos.

PUENTE: "Inés dijo que sabías por qué el río está cambiando. Habla. No tengo tiempo para juegos de alcantarilla", dices con una frialdad técnica. El Nosferatu escupe al suelo y señala hacia una compuerta sellada con cemento fresco...

CONSECUENCIA: Te da la información básica, pero no te advertirá de la emboscada que el Sabat ha preparado más adelante.

RESULTADO: (Avance estándar) | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n3_2",
        },
        {
          id: "n3_1_violencia",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - VIOLENCIA]: Atacar al Nosferatu para demostrar que no tienes paciencia para parlamentar.

PUENTE: No vas a negociar con un espía deforme. Te lanzas sobre él, estampándolo contra la pared de ladrillo con una fuerza que hace crujir su estructura. "¡Enséñame el nido ahora o te drenaré aquí mismo!".

CONSECUENCIA: Lo intimidas por la fuerza, pero quedas expuesto a un ataque sorpresa de sus "hermanos" ocultos en las tuberías superiores.

RESULTADO: healthDamageDelta: -1 | setFlag: enemigo_nosferatu | IR A [BLOQUE 2]`,
          requirement: { type: "none" },
          nextSceneId: "n3_2",
          effects: [{ type: "healthDamageDelta", delta: 1 }, { type: "setFlag", flag: "enemigo_nosferatu" }],
        },
      ],
    },
    {
      id: "n3_2",
      chapterId: "chapter03",
      title: "[ESCENA 3.2]: EL CORAZÓN DE LA INFECCIÓN",
      text: `CONTEXTO: Cámara de filtración colonial, situada exactamente bajo el lecho del río Mapocho. El aire es una neblina púrpura que brilla con estática.
NARRACIÓN: El Choro (o tus propios instintos) te ha conducido hasta una estancia circular de ladrillo antiguo que no aparece en ningún mapa municipal. En el centro, una piscina de decantación ha sido convertida en un altar de pesadilla. La Hiel brota de las grietas del suelo como un lardo negro y viscoso, cubriendo las paredes.

Suspendida sobre la piscina por cadenas de plata, se encuentra una Vástago desconocida. Su piel está grabada con símbolos que sangran el fluido violáceo directamente al agua.`,
      flagAppends: [
        {
          flag: "observador_superior",
          text: "Ya habías atisbado el detalle desde las pasarelas: bajo ella hay tres recipientes de barro cocido, marcados con el sello de 1814.",
        },
        {
          flag: "rastro_sangre_hiel",
          text: "Las pistas del rastro fluorescente encajan: esa sangre Ventrue actúa como filtro alquímico —purifica o corrompe la Hiel según el trazado del ritual.",
        },
      ],
      options: [
        {
          id: "n3_2_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Sumergirte en la piscina para romper las cadenas y liberar a la prisionera a pesar del daño.

PUENTE: No hay tiempo para sutilezas. Te lanzas al fluido corrosivo. Sientes cómo la hiel intenta penetrar tus poros, quemando tu piel muerta como ácido. Con un rugido de esfuerzo, usas tu fuerza potenciada para quebrar los eslabones de plata uno a uno...

CONSECUENCIA: Liberas a la prisionera, quien susurra una palabra antes de desmayarse: "Archivista". Tu cuerpo queda marcado por la hiel, otorgándote una conexión sensorial con la infección.

RESULTADO: healthDamageDelta: -2 | setFlag: marca_de_la_hiel | IR A [ESCENA 3.END]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n3_end",
          effects: [{ type: "healthDamageDelta", delta: 2 }, { type: "setFlag", flag: "marca_de_la_hiel" }],
        },
        {
          id: "n3_2_ocultismo",
          type: "skill",
          skill: "ocultismo",
          text: `OPCIÓN B [HABILIDAD: OCULTISMO]: Usar la daga de plata del Príncipe para realizar un contrarritual y sellar las grietas.

PUENTE: Reconoces los patrones de flujo. No tocas el agua; usas la daga como un pararrayos místico. Trazas símbolos de clausura en el aire, obligando a la hiel a retroceder hacia las profundidades de la tierra. El brillo púrpura se apaga bajo el filo de la plata...

CONSECUENCIA: Detienes la infección de la zona norte de forma permanente. El Príncipe estará complacido, pero has destruido pruebas valiosas.

RESULTADO: willpowerDelta: -1 | setFlag: nexo_sellado | IR A [ESCENA 3.END]`,
          requirement: { type: "skill", skill: "ocultismo", minLevel: 1 },
          nextSceneId: "n3_end",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "nexo_sellado" }],
        },
        {
          id: "n3_2_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Drenar la piscina abriendo las compuertas coloniales con fuerza bruta.

PUENTE: Buscas el mecanismo de escape. Encuentras una palanca de hierro oxidada y, tras un esfuerzo mecánico brutal, logras que el fluido negro se vacíe hacia los túneles inferiores del alcantarillado, lejos de la red de agua potable...

CONSECUENCIA: Saboteas el ritual del Sabat. La prisionera muere en el proceso, pero evitas que la ciudad sea envenenada esta noche.

RESULTADO: humanityDelta: -1 | setFlag: sabotaje_exitoso | IR A [ESCENA 3.END]`,
          requirement: { type: "none" },
          nextSceneId: "n3_end",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "sabotaje_exitoso" }],
        },
        {
          id: "n3_2_consumo_hiel",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Consumir una parte de la Hiel para entender su poder (sólo si tienes resistencia_toxica).

PUENTE: Un impulso oscuro te domina. Como Ventrue, buscas el control absoluto, incluso del veneno. Llevas el fluido a tus labios. Sabor a ceniza, relámpagos y una memoria ajena de un Santiago ardiendo en el pasado...

CONSECUENCIA: Tu sangre se altera. Ganas un eco de poder en una disciplina que no catalogas, pero tu Bestia se vuelve mucho más difícil de controlar.

RESULTADO: hungerDelta: +2 | humanityDelta: -1 | setFlag: sangre_corrupta | setFlag: eco_disciplina_extrana | IR A [ESCENA 3.END]`,
          requirement: { type: "flag", flag: "resistencia_toxica", equals: true },
          nextSceneId: "n3_end",
          effects: [
            { type: "hungerDelta", delta: 2 },
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "sangre_corrupta" },
            { type: "setFlag", flag: "eco_disciplina_extrana" },
          ],
        },
      ],
    },
    {
      id: "n3_end",
      chapterId: "chapter03",
      title: "[ESCENA 3.END]: EL REGRESO A LA SUPERFICIE",
      text: `CONTEXTO: Salida lateral de la Estación Mapocho, frente al Mercado Central. 05:45 AM. Los primeros rayos del sol amenazan tras la Cordillera.
NARRACIÓN: Sales de las entrañas de la tierra justo cuando los camiones de reparto empiezan a poblar las calles. Santiago parece ignorar que hace unos minutos, bajo sus pies, se decidía su destino.

Una figura te espera apoyada en tu coche (o en un farol si vienes a pie): Doña Inés. Te observa con una mirada escrutadora, buscando manchas de sangre o hiel en tu traje. "El informe, Embajador", dice con una brevedad cortante. "Y recuerda que lo que digas ahora determinará si desayunas en el Palacio o si te conviertes en el desayuno de otros".

BIFURCACIÓN DE SALIDA (LÓGICA PARA CAPÍTULO 4)
Si liberaste a la prisionera (marca_de_la_hiel): entregarla a la Corte o esconderla — Ruta del Archivista.
Si sellaste el nexo (nexo_sellado): estatus alto con el Príncipe, rastro de conspiración perdido — Ruta política.
Si consumiste la hiel (sangre_corrupta): Inés nota algo en ti — ocultar tu estado o arriesgar ejecución — Ruta del renegado.
Si sabotaje_exitoso: continuar sin ruta preferente hacia la Biblioteca.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "marca_de_la_hiel", equals: true },
          text: "Llevas la decisión encima: la prisionera respira, a medias, y el eco de la Hiel te susurra al oído como tráfico distorsionado.",
        },
        {
          requirement: { type: "flag", flag: "nexo_sellado", equals: true },
          text: "Notas una fría satisfacción profesional: el brillo púrpura quedó sepultado bajo capas de silencio y sello.",
        },
        {
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          text: "En el reflejo de un escaparate, tus ojos guardan un destello que no debería estar ahí. Inés lo vislumbra un instante.",
        },
      ],
      options: [
        {
          id: "n3_end_archivista_entrega",
          type: "dialogue",
          text: `Entregar a la prisionera a la Corte y rendir informe completo.

CONSECUENCIA: Inés asiente con un gesto cortante; el Palacio sabrá que ganaste campo, pero también que arrastras un testigo incómodo.

RESULTADO: Ruta Archivista (entrega) | Capítulo 4`,
          requirement: { type: "flag", flag: "marca_de_la_hiel", equals: true },
          nextSceneId: "n3_end",
          effects: [
            { type: "setFlag", flag: "archivista_entrega_corte" },
            { type: "setFlag", flag: "chapter04_route_medica" },
            { type: "setFlag", flag: "chapter_pending_chapter04" },
          ],
        },
        {
          id: "n3_end_archivista_oculta",
          type: "dialogue",
          text: `Mentir o eludir: esconder a la prisionera y dar un informe parcial.

CONSECUENCIA: Inés entrecierra los ojos; no te delatas del todo, pero la deuda queda flotando entre vosotros.

RESULTADO: Ruta Archivista (oculta) | Capítulo 4`,
          requirement: { type: "flag", flag: "marca_de_la_hiel", equals: true },
          nextSceneId: "n3_end",
          effects: [
            { type: "setFlag", flag: "archivista_prisionera_oculta" },
            { type: "setFlag", flag: "chapter04_route_medica" },
            { type: "setFlag", flag: "chapter_pending_chapter04" },
          ],
        },
        {
          id: "n3_end_politica",
          type: "dialogue",
          text: `Rendir el informe del nexo sellado: victoria limpia ante el Príncipe.

CONSECUENCIA: Inés aprueba sin sonreír; tu nombre sube en la escalera del Palacio mientras el rastro fino se enfría.

RESULTADO: Ruta política | Capítulo 4`,
          requirement: { type: "flag", flag: "nexo_sellado", equals: true },
          nextSceneId: "n3_end",
          effects: [
            { type: "setFlag", flag: "favor_principe_nexo" },
            { type: "setFlag", flag: "chapter04_route_politica" },
            { type: "setFlag", flag: "chapter_pending_chapter04" },
          ],
        },
        {
          id: "n3_end_renegado_ocultar",
          type: "dialogue",
          text: `Contener la Bestia y disimular: hablar de la misión sin mencionar el sabor de la Hiel.

CONSECUENCIA: Inés te deja pasar… por ahora. La sospecha queda clavada como una aguja.

RESULTADO: Ruta del renegado (oculto) | Capítulo 4`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n3_end",
          effects: [
            { type: "setFlag", flag: "renegado_hiel_oculto" },
            { type: "setFlag", flag: "chapter04_route_renegado" },
            { type: "setFlag", flag: "chapter_pending_chapter04" },
          ],
        },
        {
          id: "n3_end_renegado_ejecucion",
          type: "dialogue",
          text: `No disimular: dejar que vea lo que eres y desafiar la sentencia.

CONSECUENCIA: La Corte no perdona exhibiciones de corrupción a la luz del alba.

RESULTADO: Muerte definitiva`,
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          nextSceneId: "n3_end",
          effects: [
            {
              type: "fatalOutcome",
              id: "fd_ines_corrupcion_hiel",
              title: "Desayuno en el Palacio",
              body: "Inés no discute contigo en voz alta: señala, y el acero aparece antes que tu siguiente palabra. La crónica de Santiago sigue sin ti.",
            },
          ],
        },
        {
          id: "n3_end_sabotaje",
          type: "dialogue",
          text: `Rendir un informe frío del sabotaje: la ciudad a salvo, la prisionera perdida.

CONSECUENCIA: Inés asiente; el precio moral queda en tu columna, no en la suya.

RESULTADO: Capítulo 4 (sin ruta de favor)`,
          requirement: { type: "flag", flag: "sabotaje_exitoso", equals: true },
          nextSceneId: "n3_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter04" }],
        },
        {
          id: "n3_end_emboscada",
          type: "dialogue",
          text: "Salir al estacionamiento (te están esperando).",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "odio_nosferatu", equals: true },
              { type: "flag", flag: "enemigo_nosferatu", equals: true },
            ],
          },
          nextSceneId: "n3_ambush",
        },
        {
          id: "n3_end_default",
          type: "dialogue",
          text: "Continuar al Capítulo 4",
          requirement: { type: "none" },
          visibilityRequirement: {
            type: "all",
            requirements: [
              { type: "not", requirement: { type: "flag", flag: "odio_nosferatu", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "enemigo_nosferatu", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "marca_de_la_hiel", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "nexo_sellado", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "sabotaje_exitoso", equals: true } },
              { type: "not", requirement: { type: "flag", flag: "sangre_corrupta", equals: true } },
            ],
          },
          nextSceneId: "n3_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter04" }],
        },
      ],
    },
    {
      id: "n3_ambush",
      chapterId: "chapter03",
      title: "3.X · Emboscada inmediata",
      text: `El estacionamiento parece vacío hasta que tres sombras saltan desde los pilares. La venganza Nosferatu llega sin ceremonia.`,
      options: [
        {
          id: "n3_ambush_survive",
          type: "dialogue",
          text: "Sobrevivir como puedas y retirarte.",
          requirement: { type: "none" },
          nextSceneId: "n3_end",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "healthDamageDelta", delta: 2 }, { type: "setFlag", flag: "emboscada_superada" }, { type: "setFlag", flag: "chapter_pending_chapter04" }],
        },
        {
          id: "n3_ambush_fall",
          type: "dialogue",
          text: "Quedarte un segundo de más en campo abierto.",
          requirement: { type: "none" },
          nextSceneId: "n3_ambush",
          effects: [
            {
              type: "fatalOutcome",
              id: "fd_nosferatu_parking",
              title: "La deuda en el estacionamiento",
              body: "El odio de cloaca te alcanza antes de que puedas responder. Tu historia termina bajo el concreto húmedo de Mapocho.",
            },
          ],
        },
      ],
    },
  ],
};
