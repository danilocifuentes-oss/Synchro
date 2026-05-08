import type { SoloChapter } from "@/lib/soloCampaign/types";

/** Rutas paralelas: Consejo mapuche, SI, ramas por clan y Malkavian. */
export const chapter08: SoloChapter = {
  id: "chapter08",
  title: "Sombras ocultas de la Araucanía",
  description: "Caminos ocultos y ramificaciones profundas por clan.",
  startSceneId: "side_001",
  scenes: [
    {
      id: "side_001",
      chapterId: "chapter08",
      title: "El Consejo Mapuche (Brujah / Gangrel)",
      text:
        "Kintun, Brujah con sangre mapuche, te recibe junto al fuego. «La Corte es solo otro colono. La tierra ya eligió su bando». En el claro o en fogatas más discretas, un grupo mixto de Cainitas y mortales mapuches arde con la misma pregunta: de qué lado caes.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "masquerade_breach_high", equals: true },
          text: "Han oído hablar de tu caza descuidada y te ven como posible aliado.",
        },
        {
          requirement: { type: "flag", flag: "earth_affinity", equals: true },
          text: "Kintun nota la savia en tu olor y se muestra intrigado.",
        },
      ],
      options: [
        {
          id: "side001_a",
          type: "dialogue",
          text: "Aliarte temporalmente con ellos contra el Príncipe",
          requirement: { type: "none" },
          nextSceneId: "side_002",
          effects: [{ type: "setFlag", flag: "anarch_alliance" }],
        },
        {
          id: "side001_b",
          type: "dialogue",
          text: "Rechazarlos y amenazar con informar a la Corte",
          requirement: { type: "none" },
          nextSceneId: "side_001_end",
          effects: [{ type: "setFlag", flag: "anarch_hostile" }],
        },
        {
          id: "side001_c",
          type: "clan",
          clan: "brujah",
          text: "Unirte a la rebelión con furia auténtica",
          requirement: { type: "clan", clan: "brujah" },
          nextSceneId: "side_001_end",
          effects: [
            { type: "setFlag", flag: "anarch_strong_alliance" },
            { type: "fragmentationDelta", delta: 1 },
            { type: "setFlag", flag: "root_thrumming" },
          ],
        },
        {
          id: "side001_gangrel",
          type: "clan",
          clan: "gangrel",
          text: "Cazar juntos bajo la luna y sellar alianza feral",
          requirement: { type: "clan", clan: "gangrel" },
          nextSceneId: "side_001_end",
          effects: [{ type: "setFlag", flag: "gangrel_earth_child" }],
        },
        {
          id: "side001_d",
          type: "dialogue",
          text: "Ofrecerles información sobre la Corte a cambio de refugio",
          requirement: { type: "none" },
          nextSceneId: "side_001_end",
          effects: [{ type: "setFlag", flag: "anarch_strong_alliance" }],
        },
      ],
    },
    {
      id: "side_001_end",
      chapterId: "chapter08",
      title: "Fuego a la espalda",
      text:
        "Los anarquistas reculan entre maldiciones suaves. La fogata queda atrás; la Corte no ha sabido aún nada, pero el bosque ya te juzga.",
      options: [
        {
          id: "side001end_a",
          type: "dialogue",
          text: "Retomar el rumbo antes de que amanezca",
          requirement: { type: "none" },
          nextSceneId: "side_005",
        },
      ],
    },
    {
      id: "side_002",
      chapterId: "chapter08",
      title: "La celda de la Segunda Inquisición",
      text:
        "Un informante mortal te revela una casa segura en Villarrica donde un equipo reducido de la Segunda Inquisición investiga desapariciones «vegetales».",
      options: [
        {
          id: "side002_a",
          type: "dialogue",
          text: "Eliminar al equipo discretamente",
          requirement: { type: "none" },
          nextSceneId: "side_002_end",
          effects: [
            { type: "setFlag", flag: "masquerade_breach_high" },
            { type: "experienceDelta", delta: 40 },
          ],
        },
        {
          id: "side002_b",
          type: "skill",
          skill: "persuasion",
          text: "Manipularlos para que ataquen a la Corte en tu lugar",
          requirement: { type: "skill", skill: "persuasion", minLevel: 3 },
          nextSceneId: "side_002_end",
          effects: [{ type: "setFlag", flag: "inquisition_diversion" }],
        },
      ],
    },
    {
      id: "side_002_end",
      chapterId: "chapter08",
      title: "Consecuencias secretas",
      text: "El bosque guarda silencio sobre lo que has hecho esta noche.",
      options: [
        {
          id: "side002e_a",
          type: "dialogue",
          text: "Seguir el rastro hacia la cabaña de Mateo",
          requirement: { type: "flag", flag: "marked_by_earth", equals: true },
          nextSceneId: "side_003",
        },
        {
          id: "side002e_b",
          type: "dialogue",
          text: "Descender otra vez al sótano del viñedo donde espera Valeria",
          requirement: { type: "flag", flag: "valeria_affection", equals: true },
          nextSceneId: "side_004",
        },
        {
          id: "side002e_tremere",
          type: "dialogue",
          text: "Responder al contacto del fugitivo Tremere",
          requirement: { type: "clan", clan: "tremere" },
          nextSceneId: "side_sec_tremere",
        },
        {
          id: "side002e_gangrel",
          type: "dialogue",
          text: "Dejarte llevar al llamado feral de Mateo en el bosque",
          requirement: { type: "clan", clan: "gangrel" },
          visibilityRequirement: { type: "flag", flag: "marked_by_earth", equals: true },
          nextSceneId: "side_sec_gangrel",
        },
        {
          id: "side002e_malk",
          type: "dialogue",
          text: "Dejar que la sinfonía vegetal rabiosamente te guíe",
          requirement: { type: "clan", clan: "malkavian" },
          nextSceneId: "side_malk_green",
        },
        {
          id: "side002e_toreador",
          type: "dialogue",
          text: "Aceptar la cita clandestina de Valeria en la galería",
          requirement: { type: "clan", clan: "toreador" },
          visibilityRequirement: { type: "flag", flag: "valeria_affection", equals: true },
          nextSceneId: "side_sec_toreador",
        },
        {
          id: "side002e_c",
          type: "dialogue",
          text: "Dar estas ramas paralelas por cerradas",
          requirement: { type: "none" },
          nextSceneId: "side_005",
        },
      ],
    },
    {
      id: "side_sec_tremere",
      chapterId: "chapter08",
      title: "El ritual olvidado",
      text:
        "Un Tremere renegado te ofrece un ritual mapuche-tremere híbrido para contener o dominar la raíz.",
      contextLeadInByState: [
        {
          requirement: { type: "clan", clan: "tremere" },
          text: "Tu sangre de hechicero reconoce el poder del ritual.",
        },
      ],
      options: [
        {
          id: "side_trem_t",
          type: "dialogue",
          text: "Realizar el ritual de contención",
          requirement: { type: "clan", clan: "tremere" },
          nextSceneId: "side_sec_tremere_end",
          effects: [
            { type: "fragmentationDelta", delta: -3 },
            { type: "experienceDelta", delta: 60 },
          ],
        },
      ],
    },
    {
      id: "side_sec_tremere_end",
      chapterId: "chapter08",
      title: "Sellos de savia y ceniza",
      text:
        "Los círculos arden bajo la lengua del ritual. Por un instante la raíz afloja… o se dobla a una voluntad más antigua que tú.",
      options: [
        {
          id: "side_trem_end_a",
          type: "dialogue",
          text: "Volver al silencio de la noche araucana",
          requirement: { type: "none" },
          nextSceneId: "side_005",
        },
      ],
    },
    {
      id: "side_sec_gangrel",
      chapterId: "chapter08",
      title: "La bestia salvaje",
      text:
        "Mateo te lleva a una ceremonia feral profunda en el bosque. La tierra ofrece un abrazo distinto… o una fusión total con lo que crece bajo la corteza.",
      contextLeadInByState: [
        {
          requirement: { type: "clan", clan: "gangrel" },
          text: "Tu sangre feral responde al paso de Mateo.",
        },
      ],
      options: [
        {
          id: "side_gang_g",
          type: "dialogue",
          text: "Aceptar la fusión con la tierra",
          requirement: { type: "clan", clan: "gangrel" },
          nextSceneId: "side_sec_gangrel_end",
          effects: [
            { type: "fragmentationDelta", delta: 4 },
            { type: "setFlag", flag: "root_merge" },
            { type: "setFlag", flag: "gangrel_earth_child" },
          ],
        },
      ],
    },
    {
      id: "side_sec_gangrel_end",
      chapterId: "chapter08",
      title: "Cuero y musgo",
      text:
        "Por un instante no sabes dónde terminas tú y dónde el hualle. El bosque respira con tu pecho.",
      options: [
        {
          id: "side_gang_end_a",
          type: "dialogue",
          text: "Recoger el hilo de la cordura antes del alba",
          requirement: { type: "none" },
          nextSceneId: "side_005",
        },
      ],
    },
    {
      id: "side_sec_toreador",
      chapterId: "chapter08",
      title: "La galería de sangre y savia",
      text:
        "Valeria te muestra su colección secreta: cuadros pintados con vitae y savia de Cainitas devorados. Belleza obscena que roza lo divino.",
      contextLeadInByState: [
        {
          requirement: { type: "clan", clan: "toreador" },
          text: "Tu alma de artista se estremece ante tanta perfección terrible.",
        },
      ],
      options: [
        {
          id: "side_tor_t",
          type: "dialogue",
          text: "Crear una obra maestra con ella, Vitae y raíces",
          requirement: { type: "clan", clan: "toreador" },
          visibilityRequirement: { type: "flag", flag: "valeria_affection", equals: true },
          nextSceneId: "side_sec_toreador_end",
          effects: [
            { type: "setFlag", flag: "valeria_affection" },
            { type: "fragmentationDelta", delta: 2 },
            { type: "setFlag", flag: "root_thrumming" },
            { type: "humanityDelta", delta: -1 },
          ],
        },
        {
          id: "side_tor_leave",
          type: "dialogue",
          text: "Mirar y marchar sin manchar el lienzo",
          requirement: { type: "clan", clan: "toreador" },
          nextSceneId: "side_005",
        },
      ],
    },
    {
      id: "side_sec_toreador_end",
      chapterId: "chapter08",
      title: "Museo de cicatrices",
      text:
        "El arte las fija en el tiempo: tú y ella como manchas en un lienzo que jamás debería haber visto la luz.",
      options: [
        {
          id: "side_tor_end_a",
          type: "dialogue",
          text: "Salir antes de que el vértigo se quede",
          requirement: { type: "none" },
          nextSceneId: "side_005",
        },
      ],
    },
    {
      id: "side_malk_green",
      chapterId: "chapter08",
      title: "La locura verde",
      text:
        "Las voces de la tierra se funden con las tuyas. Alguien de la Corte —o el eco de Mateo— te arrastra a un claro donde la realidad se rompe en patrones que solo tú ves.",
      contextLeadInByState: [
        {
          requirement: { type: "clan", clan: "malkavian" },
          text: "Las raíces cantan en el mismo idioma que tus demonios internos.",
        },
      ],
      options: [
        {
          id: "side_malk_prophet",
          type: "dialogue",
          text: "Abrazar la sinfonía vegetal y volverte profeta de la tierra",
          requirement: { type: "clan", clan: "malkavian" },
          nextSceneId: "side_malk_green_end",
          effects: [
            { type: "fragmentationDelta", delta: 5 },
            { type: "fragmentationDelta", delta: 3 },
            { type: "setFlag", flag: "root_merge" },
          ],
        },
      ],
    },
    {
      id: "side_malk_green_end",
      chapterId: "chapter08",
      title: "Coro de raíces",
      text:
        "Por un instante eres carne y crujido. Cuando el clarín interno calla, el bosque sigue moviéndose a tu ritmo.",
      options: [
        {
          id: "side_malk_end_a",
          type: "dialogue",
          text: "Volver antes de que el mundo eche raíces en tu lengua",
          requirement: { type: "none" },
          nextSceneId: "side_005",
        },
      ],
    },
    {
      id: "side_003",
      chapterId: "chapter08",
      title: "Visita secreta a Mateo",
      text:
        "Regresas solo a la cabaña de Mateo. El Gangrel te ofrece una segunda visión más profunda… a cambio de una ofrenda de Vitae.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "marked_by_earth", equals: true },
          text: "Mateo te reconoce como alguien tocado por la tierra.",
        },
      ],
      options: [
        {
          id: "side003_a",
          type: "dialogue",
          text: "Ofrecer tu sangre y profundizar el vínculo con la Araucanía",
          requirement: { type: "flag", flag: "marked_by_earth", equals: true },
          nextSceneId: "side_003_end",
          effects: [
            { type: "fragmentationDelta", delta: 5 },
            { type: "setFlag", flag: "root_merge" },
          ],
        },
      ],
    },
    {
      id: "side_003_end",
      chapterId: "chapter08",
      title: "Visión profunda",
      text:
        "La tierra te muestra un futuro posible: Temuco convertida en un bosque negro que se extiende hasta Santiago.",
      options: [
        {
          id: "side003end_a",
          type: "dialogue",
          text: "Volver del trance y seguir con lo tuyo",
          requirement: { type: "none" },
          nextSceneId: "side_005",
        },
      ],
    },
    {
      id: "side_004",
      chapterId: "chapter08",
      title: "Noche privada con Valeria (alta afinidad)",
      text:
        "En el sótano del viñedo, lejos de miradas, Valeria te busca de nuevo. Esta vez no hay urgencia política, solo deseo crudo y confesiones.",
      contextLeadInByState: [
        {
          requirement: { type: "flag", flag: "valeria_affection", equals: true },
          text: "Sus cicatrices y las tuyas se cruzan bajo la luz de una sola vela.",
        },
      ],
      options: [
        {
          id: "side004_a",
          type: "dialogue",
          text: "Entregarte sin reservas",
          requirement: { type: "flag", flag: "valeria_affection", equals: true },
          nextSceneId: "side_004_end",
          effects: [
            { type: "setFlag", flag: "valeria_affection" },
            { type: "fragmentationDelta", delta: 1 },
            { type: "setFlag", flag: "root_thrumming" },
            { type: "humanityDelta", delta: -1 },
          ],
        },
      ],
    },
    {
      id: "side_004_end",
      chapterId: "chapter08",
      title: "Susurro de amantes",
      text:
        "«Si la tierra nos quiere… que nos tome juntos», murmura ella. Un latido extra bajo la piel acompaña cada confesión.",
      options: [
        {
          id: "side004end_a",
          type: "dialogue",
          text: "Subir la escalera antes de que el alba filtre culpa",
          requirement: { type: "none" },
          nextSceneId: "side_005",
        },
      ],
    },
    {
      id: "side_005",
      chapterId: "chapter08",
      title: "Fin de las sombras ocultas",
      text:
        "Has caminado senderos que muy pocos Cainitas han sobrevivido para contar. El hilo principal sigue ahí fuera.",
      options: [],
    },
  ],
};
