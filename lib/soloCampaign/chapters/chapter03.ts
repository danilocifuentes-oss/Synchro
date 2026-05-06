import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Llegada a Mapocho sin banderas de parque ni Costanera (p. ej. ribera u otras salidas desde cap. 2). */
const reqLlegadaMapochoGenerica = {
  type: "all" as const,
  requirements: [
    { type: "not" as const, requirement: { type: "flag" as const, flag: "ruta_parque_interior", equals: true } },
    { type: "not" as const, requirement: { type: "flag" as const, flag: "llegada_vehiculo_corte", equals: true } },
  ],
};

export const chapter03: SoloChapter = {
  id: "chapter03",
  title:
    "Santiago en Cenizas · CRÓNICA VENTRUE (V3.1) · CAPÍTULO 3: EL ECO DE LA HIEL (BLOQUE 2/2)",
  description:
    "Nido bajo el Mapocho: el corazón de la Hiel y la víctima ritual; decisión táctica antes del regreso. Inés reconduce el encargo hacia la Biblioteca Nacional y el Capítulo 4.",
  startSceneId: "n3_0",
  scenes: [
    {
      id: "n3_0",
      chapterId: "chapter03",
      title: "[ESCENA 3.0]: LOS ANDENES DEL ABISMO",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "ruta_parque_interior", equals: true },
          text: "Por la salida marcada desde el Parque Forestal llegaste a pie: sentidos en alerta y el frío de la madrugada calándote en los huesos al cruzar la explanada vacía.",
        },
        {
          requirement: { type: "flag", flag: "llegada_vehiculo_corte", equals: true },
          text: "La Costanera te dejó con el sedán negro bajo penumbra hacia la calle Balmaceda; el motor enfría con un tic-tac metálico que marca el tiempo como un péndulo detrás del cristal.",
        },
        {
          requirement: reqLlegadaMapochoGenerica,
          text: "Completaste el último tramo por veredas y cordón ribereño; no hubo cortina de blindado pero el esqueleto de hierro de la estación igual se dibuja contra el cielo.",
        },
      ],
      text: `CONTEXTO: Explanada de la Estación Mapocho. 04:30 AM. Un viento gélido arrastra basura por el pavimento desierto.

NARRACIÓN: La Estación Mapocho frente a ti se yergue como una columna de hierro y cristal: gloria de otra época, eco vacío ahora.

El aire cambia respecto al centro. Metal oxidado y un dulzor podrido casi floral; la sangre que corre por tus venas te avisa antes que el pensamiento. ¡Es la Hiel! No sólo es suciedad, es un peso en el aire y un silencio que aumenta cuanto más te acercas a los accesos.

Las viejas puertas laterales de servicio están encadenadas; la llave de bronce que recibiste en el Palacio Bruna encaja sin forzar. Al girarla, el chirrido del cerrojo parece desvanecerse al instante, como si ese pasadizo que se abre ante ti lo engullera.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "observacion_previa_hiel", equals: true },
          text: "Lo que viste en la ribera no fue un espejismo: el mismo tono violeta impregna el aire estático de la explanada, como un presagio que se adelantó a tu llegada.",
        },
        {
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "mision_castigo", equals: true },
              { type: "flag", flag: "cap3_salida_a_pie", equals: true },
            ],
          },
          text: "La Corte no te envió con cortesía; la explanada te recibe sin escolta y el edificio se impone como veredicto.",
        },
      ],
      options: [
        {
          id: "n3_0_camino_abierto",
          type: "dialogue",
          text: `CAMINO ABIERTO: Avanzar hacia el interior siguiendo el hedor y las huellas más claras hacia el sector de carga, sin forzar un recorrido completo del perímetro.

PUENTE: Te basta media vuelta para entender el dibujo: la nave respira hacia un eje donde el hedor se concentra y el metal muestra roce reciente. Ajustas el paso, mano en la daga de plata, y dejas que el cuerpo elija el atajo menos expuesto.

CONSECUENCIA: El rastro confirma tensión reciente en el edificio: marcas de arrastre, metal rayado, silencio donde debería haber tránsito.

RESULTADO: setFlag: rastro_sangre_vástago | IR A [ESCENA 3.1]`,
          requirement: { type: "none" },
          nextSceneId: "n3_1",
          effects: [{ type: "setFlag", flag: "rastro_sangre_vástago" }],
        },
        {
          id: "n3_0_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Endurecer tu sistema para ignorar la náusea que provoca la Hiel y avanzar hacia el foco del hedor.

PUENTE: Al cruzar el umbral, la bruma púrpura se espesa. Los pulmones —innecesarios pero instintivos— se te cierran por reflejo. Aprietas la voluntad y conviertes el cuerpo en una columna de mármol que avanza entre la niebla tóxica sin titubear, empujando el mareo que derribaría a un mortal.

CONSECUENCIA: Atraviesas la nave principal con rapidez y llegas a las escaleras de servicio sin perder tiempo; el costo queda escrito en la fatiga de la voluntad.

RESULTADO: willpowerDelta: -1 | setFlag: resistencia_toxica | IR A [ESCENA 3.1]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n3_1",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "resistencia_toxica" }],
        },
        {
          id: "n3_0_sigilo",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN B [HABILIDAD: SIGILO]: Moverte por las pasarelas superiores de hierro para evitar rozar los fluidos del suelo.

PUENTE: Te encaramas por una escalera de incendios lateral. El cuerpo responde fluido —sombra entre vigas— y desde la techumbre ves cómo la losa brilla con una pátina aceitosa violácea, casi como si el hormigón respirara bajo ese barniz.

CONSECUENCIA: Dos figuras encapuchadas —vigías del Sabbat— mueven equipo junto al sector de boleterías antes de que te detecten.

RESULTADO: setFlag: observador_desde_las_sombras | IR A [ESCENA 3.1]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n3_1",
          effects: [{ type: "setFlag", flag: "observador_desde_las_sombras" }],
        },
        {
          id: "n3_0_perimetro_torre",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR · KIT TORRE]: Recorrer el perímetro de la nave con linterna táctica y buscar señales de forzamiento o de lucha reciente.

PUENTE: No avanzas a ciegas: el kit operativo que te fichó la Torre incluye haz y batería que aguantan el ambiente enfermizo. El haz parte la penumbra y encuentra huellas pesadas —militar o paramilitar— que se desvían hacia el sector de carga. Sigues el rastro con la mano en la empuñadura de la daga de plata; las sombras del techo saltan como si quisieran morder la luz.

CONSECUENCIA: El rastro confirma combate reciente: casquillos calientes aún olvidados y restos de piel que no cuadran con anatomía humana llana.

RESULTADO: setFlag: rastro_sangre_vástago | IR A [ESCENA 3.1]`,
          requirement: { type: "flag", flag: "agente_oficial", equals: true },
          nextSceneId: "n3_1",
          effects: [{ type: "setFlag", flag: "rastro_sangre_vástago" }],
        },
        {
          id: "n3_0_perimetro_sin_kit",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR · SIN KIT TORRE]: Recorrer el perímetro de la nave a la luz de faroles, reflejos en cristal roto y oído atento; buscar señales de forzamiento o de lucha reciente.

PUENTE: No cargas linterna militar: apuras la vista hasta donde el vapor del río y las luces de la ciudad dejan leer el suelo; escuchas el roce de una cadena antes de verla. Entre vigas y charcos, recoges el rastro de botas pesadas hacia el sector de carga. La mano va a la empuñadura de la daga de plata por reflejo.

CONSECUENCIA: El rastro confirma combate reciente: casquillos aún tibios y restos de piel que no cuadran con anatomía humana llana.

RESULTADO: setFlag: rastro_sangre_vástago | IR A [ESCENA 3.1]`,
          requirement: { type: "not", requirement: { type: "flag", flag: "agente_oficial", equals: true } },
          nextSceneId: "n3_1",
          effects: [{ type: "setFlag", flag: "rastro_sangre_vástago" }],
        },
        {
          id: "n3_0_sastre",
          type: "dialogue",
          text: `OPCIÓN E [RIESGO - INSTINTO]: Si tienes setFlag: secreto_del_sastre, desviarte para buscar marcas del Hombre del Traje en este lugar.

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
      title: "[ESCENA 3.1]: EL DESCENSO A LAS ENTRAÑAS",
      text: `CONTEXTO: Nivel subterráneo, bajo las vías del tren de carga. El agua del Mapocho se filtra por el techo de ladrillo.
NARRACIÓN: El camino te lleva a las entrañas de la estación. El rumor del viento cede a un goteo rítmico y pegajoso. El olor a Hiel aquí ya no es sólo ambiental —impregna tela y piel hasta volverse un tacto imaginario—.

En una cámara de ladrillo colonial una figura brota de una tubería con agilidad inhumana: El Choro. La piel es un mapa de cicatrices y pústulas que brillan con luz muerta en la oscuridad. Casi no hay ropa digna del nombre —sólo cuero mugriento pegado por la mugre—

«Un príncipe de seda en mi barro», sislea el Nosferatu, dientes de alfiler. «Hueles a Bruna. ¿Vienes a pudrirte con las ratas o traes algo que valga el olvido?».`,
      options: [
        {
          id: "n3_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Someter al Nosferatu a tu rango y ordenarle que te guíe al núcleo de la infección.

PUENTE: Das un paso al frente; tus ojos se clavan en los suyos con fuerza de vendaval. «Soy la voluntad de la Corte, y tú eres el guía. Camina o te convertiré en ceniza antes de que el agua toque el suelo», ordenas con la voz que borra la posibilidad de negarse.

CONSECUENCIA: El Choro tiembla; la voluntad se le quiebra. Te conducirá al «Nido», pero el odio hacia tu linaje y hacia la seda de la Torre queda sellado en su silencio.

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
          text: `OPCIÓN B [HABILIDAD: PERSUASIÓN]: Ofrecerle la daga de plata o una promesa de estatus a cambio de cooperación.

PUENTE: «El Príncipe te ignora, pero yo reconozco tu valor en este lugar», dices mostrando el pomo y el filo envainado de la plata —brillo frío que interrumpe el hedor—. «Ayúdame a limpiar esta Hiel y me aseguraré de que tu territorio sea respetado por la Torre como suelo soberano».

CONSECUENCIA: Ríe con amargura, pero la plata y la promesa lo tientan. Acepta el trato y te señala un atajo menos expuesto antes de llegar al calor fetido del verdadero pozo.

RESULTADO: setFlag: alianza_nosferatu | IR A [BLOQUE 2]`,
          requirement: { type: "skill", skill: "persuasion", minLevel: 1 },
          nextSceneId: "n3_2",
          effects: [{ type: "setFlag", flag: "alianza_nosferatu" }],
        },
        {
          id: "n3_1_dialogo",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Preguntar directamente por el origen de la Hiel y por las figuras encapuchadas.

PUENTE: «Vi el río y vi armados operando arriba. Habla; no tengo tiempo para teatro de alcantarilla», lanzas seco. El Nosferatu escupe al barro húmedo y remata señalando una compuerta recién sellada con cemento fresco —calor casi febril que vibra al paso—

CONSECUENCIA: Obtienes el mínimo útil para avanzar, pero no una advertencia clara sobre la red alquímica que arma la entrada al nido.

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
      text: `CONTEXTO: Cámara de filtración colonial, situada exactamente bajo el lecho del río Mapocho. El aire es una neblina púrpura que brilla con estática y el sonido del agua sobre tu cabeza es un rugido constante.
NARRACIÓN: El Choro (o tus propios instintos) te ha conducido hasta una estancia circular de ladrillo antiguo que no aparece en ningún mapa municipal. En el centro, una piscina de decantación ha sido convertida en un altar de pesadilla. La Hiel brota de las grietas del suelo como un lardo negro y viscoso, cubriendo las paredes.

Suspendida sobre la piscina por cadenas de plata, se encuentra una Vástago desconocida. Su piel está grabada con símbolos que sangran el fluido violáceo directamente al agua.`,
      flagAppends: [
        {
          flag: "observador_desde_las_sombras",
          text: "Al haber vigilado antes desde las sombras elevadas, reparas que bajo la prisionera hay tres recipientes de barro cocido marcados con el sello de 1814.",
        },
        {
          flag: "rastro_sangre_vástago",
          text: "El rastro de la nave encaja aquí sin artificio: esa mujer actúa como filtro alquímico —su sangre Ventrue es lo que purifica o corrompe la Hiel antes de canalizarla hacia el resto de la ciudad.",
        },
      ],
      options: [
        {
          id: "n3_2_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Sumergirte en la piscina para romper las cadenas y liberar a la prisionera a pesar del daño.

PUENTE: No hay tiempo para sutilezas. Te lanzas al fluido corrosivo. Sientes cómo la Hiel intenta penetrar tus poros, quemando tu piel muerta como ácido. Con un rugido de esfuerzo, usas tu fuerza potenciada para quebrar los eslabones de plata uno a uno, rescatando el cuerpo lánguido de la mujer antes de que el proceso sea irreversible.

CONSECUENCIA: Liberas a la prisionera, quien susurra una palabra antes de quedar en letargo: «Archivista». Tu cuerpo queda marcado por la Hiel, otorgándote una conexión sensorial con la infección.

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

PUENTE: Reconoces los patrones de flujo. No tocas el agua; usas la daga como un pararrayos místico. Trazas símbolos de clausura en el aire, obligando a la Hiel a retroceder hacia las profundidades de la tierra. El brillo púrpura se apaga bajo el filo de la plata, sellando el nexo.

CONSECUENCIA: Detienes la infección de la zona norte de forma inmediata. El Príncipe estará complacido por tu eficiencia técnica, pero has destruido pruebas valiosas sobre quién inició el ritual.

RESULTADO: willpowerDelta: -1 | setFlag: nexo_sellado | IR A [ESCENA 3.END]`,
          requirement: { type: "skill", skill: "ocultismo", minLevel: 1 },
          nextSceneId: "n3_end",
          effects: [{ type: "willpowerDelta", delta: -1 }, { type: "setFlag", flag: "nexo_sellado" }],
        },
        {
          id: "n3_2_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - ACCIÓN]: Drenar la piscina abriendo las compuertas coloniales con fuerza bruta.

PUENTE: Buscas el mecanismo de escape. Encuentras una palanca de hierro oxidada y, tras un esfuerzo mecánico brutal, logras que el fluido negro se vacíe hacia los túneles inferiores del alcantarillado profundo, lejos de la red de agua potable y del contacto con los mortales.

CONSECUENCIA: Saboteas el ritual del Sabat. La prisionera muere por la descompresión brusca del sistema, pero evitas que la ciudad sea envenenada esta noche.

RESULTADO: humanityDelta: -1 | setFlag: sabotaje_exitoso | IR A [ESCENA 3.END]`,
          requirement: { type: "none" },
          nextSceneId: "n3_end",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "sabotaje_exitoso" }],
        },
        {
          id: "n3_2_consumo_hiel",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Si tienes setFlag: resistencia_toxica, consumir una parte de la Hiel para entender su poder.

PUENTE: Un impulso oscuro te domina. Buscas control absoluto, incluso sobre el veneno. Llevas el fluido a tus labios. Sabor a ceniza, relámpagos y una memoria ajena de un Santiago ardiendo en el pasado inunda tu mente.

CONSECUENCIA: Tu sangre se altera permanentemente. Ganas una percepción distorsionada de la realidad que te permite ver rastros de Hiel en otros vástagos, pero tu Bestia se vuelve mucho más difícil de controlar.

RESULTADO: hungerDelta: +2 | humanityDelta: -1 | setFlag: sangre_corrupta | IR A [ESCENA 3.END]`,
          requirement: { type: "flag", flag: "resistencia_toxica", equals: true },
          nextSceneId: "n3_end",
          effects: [
            { type: "hungerDelta", delta: 2 },
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "sangre_corrupta" },
          ],
        },
      ],
    },
    {
      id: "n3_end",
      chapterId: "chapter03",
      title: "[ESCENA 3.END]: EL REGRESO A LA SUPERFICIE",
      text: `CONTEXTO: Salida lateral de la Estación Mapocho, frente al Mercado Central. 05:45 AM. Los primeros rayos del sol amenazan tras la Cordillera de los Andes.

NARRACIÓN: Sales de las entrañas de la tierra justo cuando los camiones de reparto empiezan a poblar la calle Balmaceda. Santiago parece ignorar que hace unos minutos, bajo sus pies, se decidía su destino biológico.

De las sombras del Mercado emerge de nuevo Doña Inés. Te observa con una mirada escrutadora buscando manchas de Hiel en el paño de tu traje. «Has cumplido», dice en un tono cortante. «Pero lo que has encontrado requiere una investigación más profunda. Hay una deuda pendiente en los libros de la ciudad. Debemos ir a la Biblioteca Nacional antes de que el sol reclame las calles».

Mapocho no deja paso neutro: o arrastras a la prisionera y eliges qué contar, o presentas un nexo sellado y subes en la Torre sin cariño, o la Hiel en sangre te persigue a la Biblioteca, o vuelves con papeles ordenados y la conciencia otra cosa.`,
      contextVariantByState: [
        {
          requirement: { type: "flag", flag: "marca_de_la_hiel", equals: true },
          text: "El ruido del tráfico te suena como gritos distorsionados: la marca de la Hiel canta bajo tu piel cuando el asfalto vibra.",
        },
        {
          requirement: { type: "flag", flag: "nexo_sellado", equals: true },
          text: "Sientes una fría satisfacción profesional: el sello quedó limpio en apariencia, aunque el silencio esconde nombres que ya no podrás exhibir.",
        },
        {
          requirement: { type: "flag", flag: "sangre_corrupta", equals: true },
          text: "El brillo en tus ojos no cuadra con la hora ni con el protocolo; Inés lo capta en un parpadeo y aprieta el paso hacia la sombra del edificio.",
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
