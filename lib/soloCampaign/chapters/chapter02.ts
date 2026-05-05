import type { SoloChapter } from "@/lib/soloCampaign/types";

export const chapter02: SoloChapter = {
  id: "chapter02",
  title: "Santiago en Cenizas · Capítulo 2 · La Corte de los Espejos Rotos",
  description: "Merced, Forestal y audiencia subterránea: protocolo, conspiración y bifurcación disidente.",
  startSceneId: "n2_0",
  scenes: [
    {
      id: "n2_0",
      chapterId: "chapter02",
      title: "2.0 · El rastro de sándalo y ozono",
      text: `CONTEXTO: Calle Merced, dirección al centro. El amanecer está a dos horas; el cielo de Santiago tiene un tono violeta industrial.

NARRACIÓN: El eco de tus pasos sobre el pavimento de Lastarria suena a poder reclamado. La sangre del muchacho del Mapocho te ha devuelto una lucidez gélida, pero el aroma del hombre del traje gris —sándalo y ozono— persiste en el aire como una provocación. Como Ventrue, sabes que en esta ciudad nada es azaroso: o eres el que mueve la pieza, o eres la pieza que están moviendo.`,
      options: [
        {
          id: "n2_0_perspicacia",
          type: "skill",
          skill: "perspicacia",
          text: "Analizar la sensación de ser observado mientras caminas.",
          requirement: { type: "skill", skill: "perspicacia", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "escolta_detectada" }],
        },
        {
          id: "n2_0_dominate_phone",
          type: "discipline",
          discipline: "dominate",
          disciplineTitle: "Llamada obligatoria",
          text: "Si tienes el teléfono espía, marcar el único número de la lista.",
          requirement: {
            type: "all",
            requirements: [
              { type: "discipline", discipline: "dominate", minLevel: 1 },
              { type: "flag", flag: "telefono_espia", equals: true },
            ],
          },
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "contacto_ines_previo" }],
        },
        {
          id: "n2_0_sigilo",
          type: "skill",
          skill: "sigilo",
          text: "Perder a posibles seguidores en los callejones de Lastarria.",
          requirement: { type: "skill", skill: "sigilo", minLevel: 1 },
          nextSceneId: "n2_1",
          effects: [{ type: "setFlag", flag: "llegada_invisible" }],
        },
        {
          id: "n2_0_directo",
          type: "dialogue",
          text: "Caminar directo hacia el centro, asumiendo el riesgo de ser carne visible.",
          requirement: { type: "none" },
          nextSceneId: "n2_1",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "llegada_expuesta_centro" }],
        },
      ],
    },
    {
      id: "n2_1",
      chapterId: "chapter02",
      title: "2.1 · El banco de Doña Inés",
      text: `Parque Forestal, frente al Bellas Artes. Un banco solitario bajo un plátano oriental.

Allí está ella. Doña Inés viste un traje que parece armadura de seda. "El Príncipe no tolera la impuntualidad, ni siquiera en los recién nacidos", dice sin mirarte.`,
      options: [
        {
          id: "n2_1_etiqueta",
          type: "skill",
          skill: "etiqueta",
          text: "Reverencia perfecta y disculpa formal.",
          requirement: { type: "skill", skill: "etiqueta", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [{ type: "willpowerDelta", delta: 1 }, { type: "setFlag", flag: "respeto_ines" }],
        },
        {
          id: "n2_1_intimidacion",
          type: "dialogue",
          text: "Cuestionar su derecho a vigilarte.",
          requirement: { type: "none" },
          nextSceneId: "n2_2",
          effects: [{ type: "setFlag", flag: "ines_desafiada" }],
        },
        {
          id: "n2_1_auspex",
          type: "discipline",
          discipline: "auspex",
          disciplineTitle: "Leer a Inés",
          text: "Intentar ver su aura antes de hablar.",
          requirement: { type: "discipline", discipline: "auspex", minLevel: 1 },
          nextSceneId: "n2_2",
          effects: [{ type: "hungerDelta", delta: 1 }, { type: "setFlag", flag: "secreto_ines_visto" }],
        },
      ],
    },
    {
      id: "n2_2",
      chapterId: "chapter02",
      title: "2.2 · La audiencia de los Espejos Rotos",
      text: `Subsuelo del Palacio Bruna. Sala circular cubierta de espejos antiguos.

El Príncipe te observa desde un trono de terciopelo. "Te dimos sangre de reyes para limpiar calles, no para jugar con ellas". Sobre la mesa: un sobre lacrado y una daga de plata.`,
      options: [
        {
          id: "n2_2_politica",
          type: "skill",
          skill: "politica",
          text: "Aceptar el sobre y jurar lealtad ante la Corte.",
          requirement: { type: "skill", skill: "politica", minLevel: 1 },
          nextSceneId: "n2_end",
          effects: [{ type: "setFlag", flag: "embajador_corte" }, { type: "setFlag", flag: "chapter_pending_chapter03" }],
        },
        {
          id: "n2_2_investigar_sello",
          type: "skill",
          skill: "investigacion",
          text: "Mostrar el frasco con sello de la Viña.",
          requirement: {
            type: "all",
            requirements: [
              { type: "skill", skill: "investigacion", minLevel: 1 },
              { type: "flag", flag: "sello_viña", equals: true },
            ],
          },
          nextSceneId: "n2_end",
          effects: [
            { type: "setFlag", flag: "conocedor_conspiracion" },
            { type: "setRoute", route: "r" },
            { type: "addStateTag", tag: "path_dissident" },
            { type: "setFlag", flag: "route_r_opened" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_2_presence_envite",
          type: "discipline",
          discipline: "presence",
          disciplineTitle: "Sostener el envite",
          text: "Sostener la mirada del Príncipe sin aceptar de inmediato.",
          requirement: { type: "discipline", discipline: "presence", minLevel: 1 },
          nextSceneId: "n2_end",
          effects: [
            { type: "willpowerDelta", delta: -2 },
            { type: "setFlag", flag: "mision_castigo" },
            { type: "setFlag", flag: "chapter_pending_chapter03" },
          ],
        },
        {
          id: "n2_2_negacion",
          type: "dialogue",
          text: "Dar media vuelta y rechazar servir a la Corte.",
          requirement: { type: "none" },
          nextSceneId: "n2_end",
          effects: [
            {
              type: "fatalOutcome",
              id: "fd_lese_majeste",
              title: "Lèse-majesté",
              body: "No alcanzas la puerta. El castigo cae en segundos y la Corte borra tu nombre de la noche.",
            },
          ],
        },
      ],
    },
    {
      id: "n2_end",
      chapterId: "chapter02",
      title: "2.E · Cierre del capítulo",
      text: `La Corte ya decidió cómo te va a usar. Tú decides qué harás con ese margen mínimo.`,
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
