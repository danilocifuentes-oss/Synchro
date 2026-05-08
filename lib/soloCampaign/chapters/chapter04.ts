import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Capítulo 4: Mateo, hueso que habla, voz de la tierra. */
export const chapter04: SoloChapter = {
  id: "chapter04",
  title: "Capítulo 4: Lo que la Lluvia Esconde",
  description:
    "El Gangrel Mateo y el hueso que habla. La tierra revela su voz.",
  startSceneId: "c4_001",
  scenes: [
    {
      id: "c4_001",
      chapterId: "chapter04",
      title: "Los Ojos del Bosque",
      text:
        "Tras aceptar refugio en el sótano del viñedo, Valeria conduce hacia el este, cerca de Villarrica. Los bosques nativos son tan antiguos que parecen recordar el principio de los tiempos. «El viejo se llama Mateo. Ya no es del todo uno de nosotros».",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "horror_witnessed", equals: true },
          text: "La imagen del torso devorado aún quema en tu mente.",
        },
        {
          requirement: { type: "flag", flag: "root_awakening", equals: true },
          text: "La raíz en tu pecho late más fuerte conforme te adentras en el bosque.",
        },
        {
          requirement: { type: "flag", flag: "root_merge", equals: true },
          text: "Algo bajo tu piel reconoce cada paso sobre la hojarasca.",
        },
        {
          requirement: { type: "flag", flag: "earth_affinity", equals: true },
          text: "Sientes la tierra como una presencia viva que los observa.",
        },
      ],
      options: [
        {
          id: "c4001_a",
          type: "dialogue",
          text: "Preguntar a Valeria más detalles sobre Mateo durante el trayecto",
          requirement: { type: "none" },
          nextSceneId: "c4_002",
          effects: [{ type: "setFlag", flag: "valeria_affection" }],
        },
        {
          id: "c4001_b",
          type: "discipline",
          discipline: "auspex",
          text: "Mantener Auspex activo para detectar amenazas en el bosque",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 2 },
          nextSceneId: "c4_002",
          effects: [{ type: "experienceDelta", delta: 25 }],
        },
      ],
    },
    {
      id: "c4_002",
      chapterId: "chapter04",
      title: "La Cabaña de Zinc",
      text:
        "Una cabaña de troncos y zinc aparece al final de un camino casi invisible. Una delgada columna de humo se pierde en la llovizna. Dos ojos amarillos con pupilas verticales brillan en la oscuridad.",
      options: [
        {
          id: "c4002_a",
          type: "dialogue",
          text: "Dejar que Valeria hable primero",
          requirement: { type: "none" },
          nextSceneId: "c4_003",
          effects: [{ type: "setFlag", flag: "mateo_neutral" }],
        },
        {
          id: "c4002_b",
          type: "clan",
          clan: "gangrel",
          text: "Saludar a Mateo con respeto feral, mostrando tu afinidad con la Bestia",
          requirement: { type: "clan", clan: "gangrel" },
          nextSceneId: "c4_003",
          effects: [{ type: "setFlag", flag: "mateo_respect" }],
        },
      ],
    },
    {
      id: "c4_003",
      chapterId: "chapter04",
      title: "El Hueso que Habla",
      text:
        "Mateo, encorvado y con piel como corteza, los invita a pasar. El interior huele a musgo, sangre seca y podredumbre. Saca un fragmento de hueso envuelto en trapos sucios: raíces blancas palpitan débilmente en su interior. «Esto era mi chiquillo».",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "mateo_respect", equals: true },
          text: "Mateo te mira con mayor interés.",
        },
      ],
      options: [
        {
          id: "c4003_a",
          type: "dialogue",
          text: "Tomar el hueso y enfrentar la visión",
          requirement: { type: "none" },
          nextSceneId: "c4_004",
          effects: [
            { type: "fragmentationDelta", delta: 2 },
            { type: "setFlag", flag: "root_merge" },
          ],
        },
        {
          id: "c4003_b",
          type: "discipline",
          discipline: "auspex",
          text: "Intentar leer el hueso sin tocarlo",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 3 },
          nextSceneId: "c4_004",
          effects: [
            { type: "experienceDelta", delta: 30 },
            { type: "setFlag", flag: "partial_vision" },
          ],
        },
        {
          id: "c4003_c",
          type: "clan",
          clan: "tremere",
          text: "Protegerte con un ritual menor antes de tocarlo",
          requirement: { type: "clan", clan: "tremere" },
          nextSceneId: "c4_004",
          effects: [
            { type: "fragmentationDelta", delta: 1 },
            { type: "setFlag", flag: "root_thrumming" },
          ],
        },
      ],
    },
    {
      id: "c4_004",
      chapterId: "chapter04",
      title: "La Voz de la Araucanía",
      text:
        "En el instante del contacto, el mundo se fractura. Raíces negras atraviesan tu carne muerta. Una voz sin edad susurra en tu cráneo: «No pertenecen aquí… la tierra los digerirá hasta que solo quede ceniza fértil». Caes de rodillas mientras raíces intentan abrirse paso bajo tu piel.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "partial_vision", equals: true },
          text: "La visión es menos devastadora, pero igual de aterradora.",
        },
        {
          requirement: { type: "flag", flag: "root_merge", equals: true },
          text: "La raíz en tu pecho responde con furia, ramificándose.",
        },
        {
          requirement: { type: "flag", flag: "root_awakening", equals: true },
          text: "Todo lo que sentiste en el sur se condensa en un solo grito mudo.",
        },
      ],
      options: [
        {
          id: "c4004_a",
          type: "dialogue",
          text: "Luchar contra la presencia y regresar a la realidad",
          requirement: { type: "none" },
          nextSceneId: "c4_005",
          effects: [{ type: "humanityDelta", delta: -2 }],
        },
        {
          id: "c4004_b",
          type: "discipline",
          discipline: "fortitude",
          text: "Usar Fortaleza para resistir la invasión",
          requirement: { type: "discipline", discipline: "fortitude", minLevel: 3 },
          nextSceneId: "c4_005",
          effects: [{ type: "experienceDelta", delta: 25 }],
        },
        {
          id: "c4004_c",
          type: "clan",
          clan: "malkavian",
          text: "Abrazar la locura y escuchar más profundamente",
          requirement: { type: "clan", clan: "malkavian" },
          nextSceneId: "c4_005",
          effects: [
            { type: "fragmentationDelta", delta: 2 },
            { type: "setFlag", flag: "root_merge" },
          ],
        },
      ],
    },
    {
      id: "c4_005",
      chapterId: "chapter04",
      title: "La Advertencia de Mateo",
      text:
        "Mateo te mira con respeto sombrío. «Ahora sabe tu sabor. Aléjense, antes de que la lluvia borre sus huellas para siempre». Al alejarse, siluetas hechas de ramas y sombra los observan desde el bosque.",
      options: [
        {
          id: "c4005_a",
          type: "dialogue",
          text: "Regresar al viñedo con Valeria en silencio",
          requirement: { type: "none" },
          nextSceneId: "c4_006",
          effects: [
            { type: "setFlag", flag: "chapter_pending_chapter05" },
            { type: "setFlag", flag: "marked_by_earth" },
          ],
        },
      ],
    },
    {
      id: "c4_006",
      chapterId: "chapter04",
      title: "Fin del Capítulo 4",
      text: "La Araucanía te ha marcado. La voz antigua ya conoce tu nombre.",
      options: [],
    },
  ],
};
