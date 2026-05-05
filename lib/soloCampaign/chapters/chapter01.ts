import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter01: SoloChapter = {
  id: "chapter01",
  title: "CAPÍTULO 1: EL BESO DEL MAPOCHO",
  description: "Despertar en Teatinos, centinela tras la imprenta, primer cobro junto al Mapocho y cita con la máscara.",
  startSceneId: "n1_0",
  scenes: [
    {
      id: "n1_0",
      chapterId: "chapter01",
      title: "[ESCENA 1.0]: EL DESPERTAR EN LA IMPRENTA",
      text: `CONTEXTO: Sótano de una vieja imprenta en calle Teatinos. 02:45 AM.
NARRACIÓN: El despertar no es un retorno gradual, sino un impacto. Tus ojos se abren a una oscuridad espesa, interrumpida solo por el parpadeo moribundo de un tubo fluorescente en el pasillo superior. El aire es denso; huele a tinta de periódico seca, a polvo de décadas y a ese rastro metálico y dulzón que tu nueva naturaleza identifica con una precisión aterradora: sangre vieja.

Te encuentras sobre un palé de madera, rodeado de resmas de papel amarillento. Tu ropa, un traje que costó más de lo que muchos ganan en un año, está arrugada pero intacta. En tu garganta arde un fuego químico, el residuo del frasco que un anciano te entregó en la calle Bandera antes de que el mundo se apagara. Como Ventrue, el desorden de este lugar es una ofensa personal. Un soberano no debería despertar en un osario industrial. El hambre es una aguja que cose tu estómago, pero antes de buscar sustento, tu mente exige orden.`,
      options: [
        {
          id: "n1_0_fortaleza",
          type: "discipline",
          discipline: "fortitude",
          disciplineTitle: "Fortaleza",
          text: `OPCIÓN A [DISCIPLINA: FORTALEZA]: Cerrar los ojos y forzar a tu cuerpo a ignorar el hambre para reconstruir tus memorias mediante la voluntad pura.

PUENTE: Te quedas inmóvil, tensando cada fibra de tu ser. El rugido de la Bestia en tu estómago se vuelve un susurro lejano mientras obligas a los fragmentos de la noche anterior a alinearse. El rostro del Príncipe, la firma del contrato, el frío del acero... todo encaja.

CONSECUENCIA: Recuperas el protocolo de etiqueta de la Corte y el nombre de tu Sire, lo que te dará ventaja política inmediata.

RESULTADO: willpowerDelta: +1 | setFlag: protocolo_corte | IR A [ESCENA 1.1]`,
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 1 },
          nextSceneId: "n1_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "protocolo_corte" }],
        },
        {
          id: "n1_0_investigacion",
          type: "skill",
          skill: "investigacion",
          text: `OPCIÓN B [HABILIDAD: INVESTIGACIÓN]: Registrar el sótano con frialdad analítica antes de abandonarlo.

PUENTE: Te incorporas y, con dedos enguantados, comienzas a registrar las cajas de cartón y las prensas oxidadas. No buscas una salida, buscas una explicación. Bajo una pila de periódicos de 1990, encuentras un pequeño frasco de vidrio oscuro con un sello de lacre rojo.

CONSECUENCIA: El sello muestra una "V" entrelazada con espinas. Reconoces la marca de una familia Ventrue caída en desgracia.

RESULTADO: setFlag: sello_viña_caida | IR A [ESCENA 1.1]`,
          requirement: { type: "skill", skill: "investigacion", minLevel: 1 },
          nextSceneId: "n1_1",
          effects: [{ type: "setFlag", flag: "sello_viña_caida" }],
        },
        {
          id: "n1_0_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO/ACCIÓN]: Sacudirte el polvo y subir las escaleras con la dignidad de quien es dueño del edificio.

PUENTE: Te pones en pie, ajustas los puños de tu camisa y te limpias la chaqueta. No importa dónde estés, un Ventrue siempre es el centro de la habitación. Subes los peldaños de madera, que crujen bajo tu peso muerto, buscando la salida hacia la calle Teatinos.

CONSECUENCIA: Sales a la calle rápidamente. No tienes pistas, pero conservas tu entereza mental para lo que viene.

RESULTADO: (Avance estándar) | IR A [ESCENA 1.1]`,
          requirement: { type: "none" },
          nextSceneId: "n1_1",
        },
        {
          id: "n1_0_instinto",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Dejar que la sed dicte tus movimientos y salir violentamente hacia la superficie.

PUENTE: El hambre es demasiado. La elegancia se pierde cuando la Bestia araña el interior de tus costillas. Subes las escaleras a gatas, tus uñas se clavan en la madera y empujas la puerta de salida con una fuerza que dobla el marco de metal.

CONSECUENCIA: Estás fuera, pero tus sentidos están embotados por la rabia. Has dejado rastro de tu fuerza inhumana.

RESULTADO: hungerDelta: +1 | humanityDelta: -1 | setFlag: rastro_fuerza_bruta | IR A [ESCENA 1.1]`,
          requirement: { type: "none" },
          nextSceneId: "n1_1",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "rastro_fuerza_bruta" },
          ],
        },
      ],
    },
    {
      id: "n1_1",
      chapterId: "chapter01",
      title: "[ESCENA 1.1]: EL CENTINELA TRAS EL CONTENEDOR",
      text: `CONTEXTO: Calle Teatinos, afuera de la imprenta. El alumbrado público arroja sombras largas sobre el asfalto mojado.
NARRACIÓN: El aire de Santiago, cargado de smog y frío cordillerano, te golpea. La calle está desierta, a excepción de un hombre andrajoso que se oculta tras un contenedor de basura a pocos metros. Intenta parecer un indigente buscando desperdicios, pero su postura es demasiado alerta, sus ojos se clavan en ti con una intensidad que no es de este mundo. Se toca el bolsillo del pecho, donde se adivina la forma de un dispositivo de comunicación. Alguien te estaba esperando.`,
      options: [
        {
          id: "n1_1_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Dominación",
          text: `OPCIÓN A [DISCIPLINA: DOMINACIÓN]: Atrapar su mirada desde la distancia y ordenarle que camine hacia ti.

PUENTE: No dices una palabra. Simplemente fijas tus ojos en los suyos. El hombre se tensa, sus pupilas se dilatan y, contra toda su voluntad, sus pies empiezan a moverse hacia la luz de la farola donde tú aguardas.

CONSECUENCIA: El hombre confiesa bajo trance que trabaja para un "hombre de traje gris" que paga por saber cuándo "despertaría el Rey".

RESULTADO: hungerDelta: +1 | setFlag: info_traje_gris | IR A [ESCENA 1.2]`,
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n1_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "info_traje_gris" }],
        },
        {
          id: "n1_1_sigilo",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN B [HABILIDAD: SIGILO / PERSPICACIA]: Rodear el contenedor por las sombras para sorprenderlo antes de que dé la alarma.

PUENTE: Te fundes con la oscuridad de los portales vecinos. Te mueves sin hacer ruido, aprovechando el paso de un camión de basura para cubrir tu avance. Apareces detrás de él justo cuando se disponía a hablar por su radio.

CONSECUENCIA: Le quitas el dispositivo de comunicación. Descubres que es una radio de frecuencia militar.

RESULTADO: setFlag: radio_militar | IR A [ESCENA 1.2]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n1_2",
          effects: [{ type: "setFlag", flag: "radio_militar" }],
        },
        {
          id: "n1_1_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Confrontarlo verbalmente con autoridad diplomática.

PUENTE: "¿Para quién trabajas? Elige bien tus palabras, mi paciencia se quedó en ese sótano", dices con una calma que hiela la sangre. El hombre se asusta ante tu porte y empieza a balbucear sobre una "deuda que debe cobrarse".

CONSECUENCIA: El hombre huye corriendo hacia la Alameda, pero deja caer una tarjeta de presentación: "Viña del Silencio".

RESULTADO: setFlag: tarjeta_viña | IR A [ESCENA 1.2]`,
          requirement: { type: "none" },
          nextSceneId: "n1_2",
          effects: [{ type: "setFlag", flag: "tarjeta_viña" }],
        },
        {
          id: "n1_1_violencia",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - VIOLENCIA]: Eliminar la amenaza de inmediato para asegurar tu anonimato.

PUENTE: No dejarás testigos de tu primer despertar. Te lanzas sobre él con la velocidad de un depredador. Tus manos se cierran sobre su cuello antes de que pueda gritar. El crujido de sus vértebras es la única respuesta que obtienes.

CONSECUENCIA: No hay alarma, pero ahora hay un cadáver de un mortal en tu punto de origen. La policía y la Camarilla investigarán.

RESULTADO: humanityDelta: -1 | setFlag: rastro_sangre_teatinos | IR A [ESCENA 1.2]`,
          requirement: { type: "none" },
          nextSceneId: "n1_2",
          effects: [{ type: "humanityDelta", delta: -1 }, { type: "setFlag", flag: "rastro_sangre_teatinos" }],
        },
      ],
    },
    {
      id: "n1_2",
      chapterId: "chapter01",
      title: "[ESCENA 1.2]: EL BANQUETE DEL RÍO",
      text: `CONTEXTO: Baranda del río Mapocho, cerca del Mercado Central. El agua corre turbia y rápida.
NARRACIÓN: El hambre ha dejado de ser un pinchazo para convertirse en un incendio. Necesitas sangre, y la necesitas ahora. Ves a un joven solitario apoyado en el puente de metal; fuma con la mirada perdida en el agua, ajeno a que la muerte lo observa. La moralidad es un lujo que tu condición actual no puede permitirse, pero como Ventrue, incluso la caza debe tener una estética.`,
      options: [
        {
          id: "n1_2_presencia",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Presencia",
          text: `OPCIÓN A [DISCIPLINA: PRESENCIA]: Usar tu magnetismo sobrenatural para que el joven se entregue a ti con devoción.

PUENTE: Te acercas y le pides fuego. Tu voz suena como terciopelo. El joven te mira y, de repente, no hay nadie más en el mundo para él. Se siente eufórico, entregándote su cuello con una sonrisa de ensueño mientras tus colmillos emergen.

CONSECUENCIA: Te alimentas de forma limpia. El joven recordará la noche como el mejor encuentro de su vida.

RESULTADO: hungerDelta: -2 | setFlag: beso_limpio | IR A [ESCENA 1.END]`,
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n1_cita_mascara",
          effects: [{ type: "hungerDelta", delta: -2 }, { type: "setFlag", flag: "beso_limpio" }],
        },
        {
          id: "n1_2_sigilo",
          type: "skill",
          skill: "sigilo",
          text: `OPCIÓN B [HABILIDAD: SIGILO]: Inmovilizarlo en las sombras bajo el puente y tomar lo que es tuyo por derecho.

PUENTE: Lo sigues cuando decide bajar hacia la orilla del río. Te mueves como una exhalación. Antes de que pueda girarse, tu brazo lo bloquea y tu boca se cierra sobre su yugular. Es una transacción rápida y eficiente.

CONSECUENCIA: Obtienes la sangre, pero el joven queda traumatizado y con heridas visibles que podrían atraer atención.

RESULTADO: hungerDelta: -2 | willpowerDelta: -1 | IR A [ESCENA 1.END]`,
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n1_cita_mascara",
          effects: [{ type: "hungerDelta", delta: -2 }, { type: "willpowerDelta", delta: -1 }],
        },
        {
          id: "n1_2_estandar",
          type: "dialogue",
          text: `OPCIÓN C [CAMINO ESTÁNDAR - DIÁLOGO]: Engañarlo con una historia de necesidad para llevarlo a un lugar discreto.

PUENTE: "Disculpa, me han asaltado hace un momento. ¿Podrías ayudarme a llegar a ese portal?", dices con una vulnerabilidad fingida. El joven accede. En la oscuridad del portal, el cazador revela su verdadera cara.

CONSECUENCIA: Sacias tu sed, pero la mentira deja un sabor amargo en tu conciencia.

RESULTADO: hungerDelta: -2 | IR A [ESCENA 1.END]`,
          requirement: { type: "none" },
          nextSceneId: "n1_cita_mascara",
          effects: [{ type: "hungerDelta", delta: -2 }],
        },
        {
          id: "n1_2_instinto",
          type: "dialogue",
          text: `OPCIÓN D [RIESGO - INSTINTO]: Drenarlo hasta que su corazón deje de latir para recuperar toda tu potencia.

PUENTE: El sabor es embriagador. No puedes detenerte. Ignoras sus espasmos. Bebes hasta que su pulso es un hilo y luego nada. El cuerpo cae al Mapocho con un chapoteo sordo.

CONSECUENCIA: Recuperas toda tu fuerza, pero has cometido un asesinato. La Bestia está satisfecha, pero tu alma es más oscura.

RESULTADO: hungerDelta: -3 | humanityDelta: -2 | setFlag: asesino_del_mapocho | IR A [ESCENA 1.END]`,
          requirement: { type: "none" },
          nextSceneId: "n1_cita_mascara",
          effects: [
            { type: "hungerDelta", delta: -3 },
            { type: "humanityDelta", delta: -2 },
            { type: "setFlag", flag: "asesino_del_mapocho" },
          ],
        },
      ],
    },
    {
      id: "n1_cita_mascara",
      chapterId: "chapter01",
      title: "[ESCENA 1.END]: LA CITA CON LA MÁSCARA",
      text: `CONTEXTO: Al final del puente, bajo la luz de un farol. Doña Inés te espera.
NARRACIÓN: El mundo parece más nítido ahora que la sangre corre por tus venas. Al final del puente, una mujer de una elegancia anacrónica te observa. Es Doña Inés, la mano derecha del Príncipe. Su ropa de sastre es impecable, ni una mota de polvo de Santiago se atreve a posarse sobre ella. "Has tardado en alimentarte", dice con una voz que corta el aire. "El Príncipe no es un hombre paciente. Sígueme al Palacio Bruna, tu verdadera noche comienza ahora".

BIFURCACIÓN DE ESTADO (Hacia Capítulo 2):

Si setFlag: beso_limpio: Inés te trata con cortesía diplomática. (Ruta del Embajador).

Si setFlag: rastro_sangre_teatinos o rastro_fuerza_bruta: Inés te mira con desprecio. "Eres un animal descuidado". (Ruta del Paria).

Si tienes setFlag: info_traje_gris: Tienes una opción de diálogo especial para cuestionar la lealtad del Príncipe. (Ruta de la Intriga).`,
      options: [
        {
          id: "n1_cita_paria",
          type: "dialogue",
          requirement: {
            type: "any",
            requirements: [
              { type: "flag", flag: "rastro_fuerza_bruta" },
              { type: "flag", flag: "rastro_sangre_teatinos" },
            ],
          },
          text: `Inés te mira con desprecio. "Eres un animal descuidado".

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
                    { type: "flag", flag: "rastro_fuerza_bruta" },
                    { type: "flag", flag: "rastro_sangre_teatinos" },
                  ],
                },
              },
              { type: "flag", flag: "beso_limpio" },
            ],
          },
          text: `Inés te trata con cortesía diplomática.

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
                    { type: "flag", flag: "rastro_fuerza_bruta" },
                    { type: "flag", flag: "rastro_sangre_teatinos" },
                  ],
                },
              },
              { type: "flag", flag: "info_traje_gris" },
              { type: "flag", flag: "beso_limpio", equals: false },
            ],
          },
          text: `Tienes margen para cuestionar la lealtad del Príncipe respecto al hombre de traje gris.

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
                    { type: "flag", flag: "rastro_fuerza_bruta" },
                    { type: "flag", flag: "rastro_sangre_teatinos" },
                  ],
                },
              },
              { type: "flag", flag: "beso_limpio", equals: false },
              { type: "flag", flag: "info_traje_gris", equals: false },
            ],
          },
          text: `Sigues a Inés hacia el Palacio Bruna; el tono es frío, sin la etiqueta del embajador ni la confrontación del paria.

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
