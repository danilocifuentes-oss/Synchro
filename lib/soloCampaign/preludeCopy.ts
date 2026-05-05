import type { ClanId } from "@/lib/character";

/** Incrementar cuando cambie el texto del preludio: quien tenga valor menor volverá a ver la cortina antes de clan. */
export const CHRONICLE_PRELUDE_CONTENT_VERSION = 7;

/** Preludio diegético común antes de la intro de clan; versión efectiva vs `chroniclePreludeSeenVersion` en el save. Narración en segunda persona (omnisciente → tú). */
export const CHRONICLE_PRELUDE_COMMON = `Santiago no es una ciudad, es un organismo de asfalto y smog que custodia secretos más antiguos que sus propios cimientos. Para los vivos, es un laberinto de ruido y deudas; para quienes habitan sus sombras, es un feudo gobernado por voluntades gélidas que mueven los hilos de la historia desde salones de mármol y alcantarillas de ladrillo.

En este rincón del mundo, la línea entre el hombre y la bestia se desvanece tras un solo rastro de sangre. Aquí, la inmortalidad no es un regalo, sino una condena que se sirve fría en una esquina cualquiera.

Tú, que acabas de abrir los ojos a esta nueva penumbra, debes entender que tu voluntad ya no te pertenece. Has entrado en un juego donde la sangre es la única moneda de valor y el silencio la única ley de supervivencia. Aprenderás pronto que, para sobrevivir al abismo de esta capital, no basta con esconderse de la luz; deberás convertirte en la oscuridad misma.

Bienvenido a Santiago. Tu noche acaba de empezar.`;
/** Un latigazo tonal por clan (solo los disponibles en solitario tienen entrada). */
export const CHRONICLE_PRELUDE_MASK_STINGER: Partial<Record<ClanId, string>> = {
  brujah:
    "Tu máscara es la furia bien vestida de motivos: algunos llaman desorden lo que para ti ya tenía fecha de vencimiento.",
  ventrue:
    "Tu máscara es agenda con membrete serio: otros ven cordialidad en la sala y apenas leen los pliegos donde alguien ya dejó escritas las cuotas futuras.",
  toreador:
    "Tu máscara necesita público incluso cuando no hay teatro—y si falta obra, encuentras suficiente hermosura rota para ocupar la escena.",
  malkavian:
    "Tu máscara ordena símbolos que los demás creen adorno: oyen preguntas sueltas cuando tú ya estás tres respuestas adelante o tres vueltas perdido.",
};
