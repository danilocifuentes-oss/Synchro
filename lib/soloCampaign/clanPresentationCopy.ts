import type { ClanId } from "@/lib/character";

/**
 * Subir cuando cambie el texto de la intro de clan; saves con versión menor vuelven a ver la pantalla en cap. 1.
 * La migración marca como `1` a quien tenía sólo `clan_intro_seen: true` (texto anterior), así `1 < 2` fuerza una pasada nueva.
 */
export const CHRONICLE_CLAN_PRESENTATION_CONTENT_VERSION = 2;

/**
 * Presentación diegética al abrir la crónica (cap. 1), en segunda persona.
 * Una frase corta por clan de ficha. Clanes fuera del selector vigente viven en
 * `CHRONICLE_CLAN_PRESENTATIONS_RESERVED` hasta que amplíemos `ClanId`.
 */
export const CHRONICLE_CLAN_PRESENTATIONS: Record<ClanId, string> = {
  brujah: `No pidas permiso para existir; sé el incendio que devore la tiranía de los antiguos.`,

  ventrue: `Toma el mando del tablero de cristal; en esta ciudad, la sangre es el dividendo del poder absoluto.`,

  malkavian: `Ríete de la Mascarada; tú eres el único que ve las grietas en el cristal de la realidad.`,

  toreador: `Convierte la agonía del neón en arte; si vamos a ser eternos, que sea bajo un éxtasis estético.`,

  nosferatu: `Gobierna desde el lodo y el secreto; la verdad más pura siempre se encuentra en la alcantarilla.`,

  tremere: `La sangre no es solo alimento, es el alfabeto con el que escribirás las leyes de la existencia.`,

  gangrel: `Abandona las luces del centro y escucha a la Bestia; el asfalto es solo una piel que pronto rasgarás.`,

  thin_blood: `Camina en el filo donde la sangre ya no juró linaje completo; el barrio cree verte humano hasta que deja de convenirle.`,

  caitiff: `Sin apellido que te ordene la noche; cada esquina te pide improvisar etiqueta antes de que el hambre decida por ti.`,

  other: `Linaje que aún no encaja en folklore listo; la ciudad te medirá igual —tú llegas antes del manual.`,
};

/** Clanes fuera de plataforma; mismas líneas autor. Enlazar a `ClanId` cuando existan en ficha/CODEX. */
export const CHRONICLE_CLAN_PRESENTATIONS_RESERVED = {
  lasombra: `No temas al abismo de la noche, pues tú eres la sombra que reclama el alma de Santiago.`,
  tzimisce: `Tu cuerpo es barro y tu refugio un templo; esculpe la carne hasta que no quede rastro de lo humano.`,
  banu_haqim: `Sé el verdugo silencioso; en una ciudad de pecadores, tú eres el único juez que importa.`,
  ministry: `Descubre el deseo oculto de cada alma y conviértete en la tentación que los hará libres.`,
  hecata: `La muerte es solo una puerta entreabierta; guarda los secretos de la familia y escucha el coro de los ausentes.`,
  ravnos: `Camina como un espejismo en el desierto de cemento; si te detienes, la verdad te destruirá.`,
} as const;

export type ReservedClanPresentationId = keyof typeof CHRONICLE_CLAN_PRESENTATIONS_RESERVED;

export function getChronicleClanPresentation(clan: ClanId): string {
  return CHRONICLE_CLAN_PRESENTATIONS[clan] ?? CHRONICLE_CLAN_PRESENTATIONS.other;
}
