import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Capítulo 1: Corte local (Temuco). */
export const chapter01: SoloChapter = {
  id: "chapter01",
  title: "Capítulo 1: La Corte de Zinc y Neón",
  description: "La Camarilla local te somete a juicio. El Príncipe decide si vives o eres ceniza.",
  startSceneId: "c1_001",
  scenes: [
    {
      id: "c1_001",
      chapterId: "chapter01",
      title: "El Heraldo de Gris",
      text:
        "La tarjeta negra pesa como plomo en tu mano. Sales a la noche bajo la llovizna persistente. En una esquina cerca de la fuente de la Plaza Aníbal Pinto, bajo una luminaria que agoniza, la presencia se materializa. Julián Voss, Ventrue de linaje impecable, te observa con ojos color ceniza.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "masquerade_breach_high", equals: true },
          text: "Voss ya sabe de tu caza descuidada. Su desprecio es casi palpable.",
        },
        {
          requirement: { type: "flag", flag: "voss_suspect", equals: true },
          text: "Reconoces el olor a cachemir de la huella en tu habitación.",
        },
      ],
      options: [
        {
          id: "c1001_a",
          type: "dialogue",
          text: "Mostrar humildad y aceptar la cita con el Príncipe",
          requirement: { type: "none" },
          nextSceneId: "c1_002",
          effects: [
            { type: "reputationDelta", delta: 2 },
            { type: "setFlag", flag: "prince_cautious" },
          ],
        },
        {
          id: "c1001_b",
          type: "discipline",
          discipline: "presence",
          text: "Usar Presencia para impresionar al heraldo",
          requirement: { type: "discipline", discipline: "presence", minLevel: 2 },
          nextSceneId: "c1_002",
          effects: [{ type: "setFlag", flag: "voss_respect" }],
        },
        {
          id: "c1001_c",
          type: "discipline",
          discipline: "dominate",
          text: "Intentar Dominar a Voss para que te deje en paz",
          requirement: { type: "discipline", discipline: "dominate", minLevel: 3 },
          nextSceneId: "c1_001_dominate",
          nextSceneIdOnFail: "c1_001_fail",
          effects: [{ type: "setFlag", flag: "voss_hostile" }],
        },
        {
          id: "c1001_d",
          type: "clan",
          clan: "brujah",
          text: "Desafiar su autoridad y exigir respeto",
          requirement: { type: "clan", clan: "brujah" },
          nextSceneId: "c1_001_fail",
          effects: [{ type: "setFlag", flag: "voss_hostile" }],
        },
      ],
    },
    {
      id: "c1_001_dominate",
      chapterId: "chapter01",
      title: "Intento de Dominación",
      text:
        "Tus palabras resuenan con poder ancestral. Voss titubea un instante, pero su voluntad es de acero viejo.",
      options: [
        {
          id: "c1001d_a",
          type: "dialogue",
          text: "Retirarte con dignidad",
          requirement: { type: "none" },
          nextSceneId: "c1_002",
          effects: [{ type: "humanityDelta", delta: -1 }],
        },
      ],
    },
    {
      id: "c1_001_fail",
      chapterId: "chapter01",
      title: "La Ira del Heraldo",
      text: "Voss te mira como a una rata. «Mañana te presentarás… o amanecerás en ceniza».",
      options: [
        {
          id: "c1001f_a",
          type: "dialogue",
          text: "Aceptar y marcharte",
          requirement: { type: "none" },
          nextSceneId: "c1_002",
          effects: [
            { type: "humanityDelta", delta: -1 },
            { type: "setFlag", flag: "voss_hostile" },
          ],
        },
      ],
    },
    {
      id: "c1_002",
      chapterId: "chapter01",
      title: "El Sanctasanctórum de los Olvidados",
      text:
        "La mansión colonial exhala decadencia y poder. Gules impecables custodian la entrada. En el salón principal, el Príncipe te espera en su trono de terciopelo. A su lado, Valeria, Primogénita Toreador, te observa con curiosidad felina.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "valeria_interest", equals: true },
          text: "Valeria ya parece conocerte. Sus ojos verdes brillan con interés.",
        },
        {
          requirement: { type: "flag", flag: "voss_hostile", equals: true },
          text: "Voss susurra al oído del Príncipe. La atmósfera es hostil.",
        },
      ],
      options: [
        {
          id: "c1002_a",
          type: "dialogue",
          text: "Explicar tu huida de la Segunda Inquisición con humildad",
          requirement: { type: "none" },
          nextSceneId: "c1_003",
          effects: [
            { type: "setFlag", flag: "prince_permission" },
            { type: "setFlag", flag: "valeria_affection" },
            { type: "setFlag", flag: "prince_reputation" },
          ],
        },
        {
          id: "c1002_b",
          type: "discipline",
          discipline: "auspex",
          text: "Leer las auras de la Corte antes de hablar",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 2 },
          nextSceneId: "c1_003",
          effects: [
            { type: "experienceDelta", delta: 20 },
            { type: "setFlag", flag: "court_secrets" },
          ],
        },
        {
          id: "c1002_c",
          type: "clan",
          clan: "ventrue",
          text: "Invocar tu propio linaje y exigir respeto como igual",
          requirement: { type: "clan", clan: "ventrue" },
          nextSceneId: "c1_002_ventrue",
          effects: [{ type: "setFlag", flag: "prince_respect" }],
        },
      ],
    },
    {
      id: "c1_002_ventrue",
      chapterId: "chapter01",
      title: "Orgullo Ventrue",
      text: "El Príncipe te evalúa con nuevos ojos. Tu linaje habla por ti.",
      options: [
        {
          id: "c1002v_a",
          type: "dialogue",
          text: "Continuar la conversación",
          requirement: { type: "none" },
          nextSceneId: "c1_003",
          effects: [
            { type: "reputationDelta", delta: 2 },
            { type: "setFlag", flag: "prince_reputation" },
          ],
        },
      ],
    },
    {
      id: "c1_003",
      chapterId: "chapter01",
      title: "Susurro de Valeria",
      text:
        "El Príncipe te concede permiso provisional: puedes alimentarte, pero no en el centro ni universidades. Valeria se acerca al marcharte y roza tu oído con labios fríos.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "valeria_affection", equals: true },
          text: "Su voz es más cálida de lo esperado.",
        },
      ],
      options: [
        {
          id: "c1003_a",
          type: "dialogue",
          text: "Aceptar su invitación al viñedo «Los Olvidados»",
          requirement: { type: "none" },
          nextSceneId: "c1_004",
          effects: [
            { type: "setFlag", flag: "valeria_invited" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
          ],
        },
        {
          id: "c1003_b",
          type: "dialogue",
          text: "Rechazar por lealtad al Príncipe",
          requirement: { type: "flag", flag: "prince_cautious", equals: true },
          nextSceneId: "c1_004",
          effects: [
            { type: "setFlag", flag: "valeria_distrust" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
          ],
        },
        {
          id: "c1003_c",
          type: "discipline",
          discipline: "presence",
          text: "Usar Presencia para seducir a Valeria",
          requirement: { type: "discipline", discipline: "presence", minLevel: 2 },
          nextSceneId: "c1_004",
          effects: [
            { type: "setFlag", flag: "valeria_affection" },
            { type: "setFlag", flag: "valeria_invited" },
            { type: "setFlag", flag: "chapter_pending_chapter02" },
          ],
        },
      ],
    },
    {
      id: "c1_004",
      chapterId: "chapter01",
      title: "Fin del Capítulo 1",
      text:
        "Sales de la mansión con un permiso frágil y la sensación de que la Corte —y algo más profundo en la tierra— ya te ha marcado. La lluvia sigue cayendo.",
      options: [],
    },
  ],
};
