import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Capítulo 2 — Corte de los Espejos Rotos. Tono Ventrue: protocolo, tablero, paranoia del linaje del Trono. */
export const chapter02: SoloChapter = {
  id: "chapter02",
  title: "Santiago en Cenizas · Capítulo 2 · La Corte de los Espejos Rotos (linaje del Trono)",
  description:
    "Tras el Beso del Mapocho: Parque Forestal, Doña Inés y la audiencia bajo tierra —servicio, sobre lacrado y primer mandato.",
  startSceneId: "n2_1",
  scenes: [
    {
      id: "n2_1",
      chapterId: "chapter02",
      title: "2.1 · Parque Forestal · Sándalo y ozono",
      text: `El hambre ha remitido, pero la paranoia del Ventrue despierta. Has alimentado el cuerpo, pero has descuidado la seguridad. Santiago, desde las barandas del Parque Forestal, parece una red de luces diseñada para atrapar insectos, y tú eres un espécimen nuevo que ya ha sido catalogado. La figura del puente fue un aviso: en esta ciudad, incluso un heredero del Trono debe rendir cuentas.

Sacudes el barro de tus botas de cuero, indignado por haber tenido que descender al cauce del río para subsistir. La figura que te vigilaba ha desaparecido, pero el aire exhala un rastro inconfundible: sándalo y ozono. Es el perfume del poder que no necesita ser visto para dominar.`,
      options: [
        {
          id: "n2_1_compostura",
          type: "dialogue",
          text: "Mantener la compostura: caminar con la nuca alerta. Si alguien me midió desde arriba, debe encontrar una fachada de acero, no a un neonato asustado.",
          requirement: { type: "none" },
          nextSceneId: "n2_2",
          effects: [{ type: "setFlag", flag: "novel_ch2_forestal_alert" }],
        },
        {
          id: "n2_1_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Rastro invisible",
          text: "Abrir los sentidos para desmenuzar el hilo del perfume e identificar la firma de quien se atrevió a auditar mi primer Beso.",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch2_forestal_auspex_trace" },
          ],
        },
        {
          id: "n2_1_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: "Evaluar la vulnerabilidad: analizar los puntos ciegos del parque. Conozco mis rutas de escape antes de que la trampa se cierre.",
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch2_forestal_escape_map" },
          ],
        },
        {
          id: "n2_1_dominio",
          type: "dialogue",
          text: "Reafirmar el dominio: ignorar la presencia oculta y caminar como si el Parque Forestal fuera una extensión de mi propio despacho.",
          requirement: { type: "none" },
          nextSceneId: "n2_2",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch2_forestal_desk_stride" },
          ],
        },
      ],
    },
    {
      id: "n2_2",
      chapterId: "chapter02",
      title: "2.2 · El encuentro con Doña Inés",
      text: `—No te quedes ahí parado contemplando tu falta de juicio —dice una voz a tu espalda.

En un banco de madera, bajo un plátano oriental, una mujer de elegancia gélida te observa. Es Doña Inés, vestida con un traje de sastre que exhala una autoridad casi médica. Su palidez es mármol pulido bajo la luz de sodio. Para ti, representa el protocolo que respetas y temes.`,
      options: [
        {
          id: "n2_2_follow",
          type: "dialogue",
          text: "Aceptación del rango: escuchar y seguir. En la jerarquía de la noche, una invitación de Inés es un decreto.",
          requirement: { type: "none" },
          nextSceneId: "n2_5",
          effects: [{ type: "setFlag", flag: "novel_ch2_follow_ines" }],
        },
        {
          id: "n2_2_presence",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Sin debilidad visible",
          text: "Sostener la mirada con calma absoluta. Si voy a ser un recurso para la Corte, que sepan que mi voluntad es un activo caro.",
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n2_5",
          effects: [{ type: "setFlag", flag: "novel_ch2_presence_stand" }],
        },
        {
          id: "n2_2_dominate",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Pregunta obligatoria",
          text: "Forzarla a ser directa: «¿Quién me cita?». No tolero ser movido como peón sin conocer la mano que empuja.",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 1 },
          nextSceneId: "n2_5",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch2_dominate_question" },
          ],
        },
        {
          id: "n2_2_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: "Saludo formal: responder con la cortesía debida a una dignataria de la ciudad, estableciendo mi propio valor social.",
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          nextSceneId: "n2_5",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch2_formal_greeting" },
          ],
        },
      ],
    },
    {
      id: "n2_5",
      chapterId: "chapter02",
      title: "2.5 · La audiencia con el Príncipe",
      text: `Tras descender por galerías olvidadas, llegas a la Corte de los Espejos Rotos. Candelabros y espejos viejos devuelven una luz que no parece del mismo siglo que la ciudad arriba.

En un sillón de terciopelo espera el Príncipe de Santiago. No tiene cara de guerrero, sino de alto ejecutivo ancestral; sus anteojos de marco fino ocultan una mirada que ha visto caer imperios.

—Un nacimiento sin permiso —dice con una voz que llena la sala—. Una violación a la ley del silencio.

Doña Inés se detiene a tu lado, impasible. El aire huele a política cerrada y a tuberías antiguas.

—Tu vida cotiza en esta mesa ahora —continúa el Príncipe—. Tu primer encargo es simple: ve a la Estación Mapocho. Encuentra qué es lo que asusta a las ratas —o no pierdas tiempo buscando refugio antes del amanecer.

Te tiende un sobre lacrado con el sello de una corona de espinas.`,
      options: [
        {
          id: "n2_5_accept",
          type: "dialogue",
          text: "Reconocer el mandato: asentir y tomar el sobre. El servicio es el camino más rápido para recuperar mi estatus.",
          requirement: { type: "none" },
          nextSceneId: "n2_end",
          effects: [{ type: "setFlag", flag: "novel_ch2_mandate_accept" }],
        },
        {
          id: "n2_5_persuasion",
          type: "skill",
          skill: "persuasion",
          text: "Justificar el incidente: explicar que mi «nacimiento» en Bandera fue irregularidad del sistema, no rebelión.",
          requirement: { type: "skill", skill: "persuasion", minLevel: 1 },
          nextSceneId: "n2_end",
          effects: [
            { type: "willpowerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch2_justify_bandera" },
          ],
        },
        {
          id: "n2_5_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "El tablero verdadero",
          text: "Analizar la Corte: apartar un segundo el discurso del Príncipe para leer el aura de sus consejeros y saber quiénes son los rivales aquí.",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "n2_end",
          effects: [{ type: "setFlag", flag: "novel_ch2_descent_auspex" }],
        },
        {
          id: "n2_5_stoic",
          type: "dialogue",
          text: "Silencio estoico: no dar excusas ni pedir perdón. Asumo las consecuencias y espero mi momento para cobrarlas.",
          requirement: { type: "none" },
          nextSceneId: "n2_end",
          effects: [
            { type: "hungerDelta", delta: 1 },
            { type: "setFlag", flag: "novel_ch2_mandate_why" },
          ],
        },
      ],
    },
    {
      id: "n2_end",
      chapterId: "chapter02",
      title: "2.E · Política de los condenados",
      text: `Doña Inés te toma el brazo y te guía hasta la salida lateral sin pasacalles de más. Cruzas ante espejos manchados; en el último ves un hueco donde un hombre debería estar.

—Bienvenido a la política de los condenados —susurra sin volver la cabeza—. Intenta no morir dos veces esta misma noche.`,
      options: [
        {
          id: "n2_end_continue",
          type: "dialogue",
          text: "Continuar al Capítulo 3",
          requirement: { type: "none" },
          nextSceneId: "n2_end",
          effects: [{ type: "setFlag", flag: "chapter_pending_chapter03" }],
        },
      ],
    },
  ],
};
