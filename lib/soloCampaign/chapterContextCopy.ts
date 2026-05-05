/** Texto contextual común antes de la narrativa de cada capítulo (clave = `chapterId`). */

export type SoloChapterContextBlock = {
  /** Subir cuando cambie el texto: quien guarde una versión menor volverá a ver el contexto antes de ese capítulo. */
  contentVersion: number;
  /** Línea breve sobre el hueco tipo “Contexto • Capítulo 2”. */
  label: string;
  /** Narración omnisciente en segunda persona (tú), dirigida al protagonista. */
  body: string;
};

/**
 * Capítulos con bloque previo (“contexto”).
 * chapter01 sólo usa preludio de crónica + intro de clan; no requiere entrada aquí salvo que se decida igual.
 */
export const SOLO_CHAPTER_CONTEXT_REGISTRY: Partial<Record<string, SoloChapterContextBlock>> = {
  chapter02: {
    contentVersion: 4,
    label: "Contexto · después del Mapocho",
    body: `El hambre ha remitido, pero la paranoia del Ventrue despierta: alimentaste el cuerpo y descuidaste la seguridad. Santiago, desde las barandas del Parque Forestal, parece una red de luces para atrapar insectos; tú ya fuiste catalogado. La figura del puente fue aviso: incluso un heredero del Trono debe rendir cuentas.

Santiago mantiene su máscara de tráfico y rutina, pero para ti la noche cambió de idioma. Una voz sin nombre está a punto de citarte —y la etiqueta lo llamará decreto.`,
  },
  chapter03: {
    contentVersion: 3,
    label: "Contexto · rastro de la hiel",
    body: `La Corte de los Espejos Rotos te dio una orden que no admite demora: bajar a la Estación Mapocho y seguir un rastro que ni los habituales del Príncipe quieren tocar.

Doña Inés ya te lo dejó claro: no eres invitado, eres herramienta. El sobre lacrado no trae teoría, solo trabajo sucio y margen mínimo de error.

Bajo el hierro de la estación te espera una verdad incómoda: en esta ciudad, la política de la sangre siempre termina en alcantarilla.`,
  },
  chapter04: {
    contentVersion: 3,
    label: "Contexto · del barro al archivo",
    body: `Cumpliste el encargo en los túneles, pero la victoria dejó sabor a ceniza. Cazar a uno de los suyos para proteger un orden que te considera desechable cambió el pulso interno.

La siguiente pista no está en un cadáver ni en una guarida: está en papel viejo, mapas coloniales y nombres que todavía mandan desde edificios de vidrio.

Si quieres entender por qué todo se está quebrando, tendrás que leer el pacto que sostiene Santiago desde antes de que se llamara Santiago.`,
  },
  chapter05: {
    contentVersion: 3,
    label: "Contexto · neón y barricada",
    body: `Los archivos te mostraron que la ciudad no es moderna: es un feudo antiguo maquillado de democracia. Y justo cuando esa verdad se asienta, la calle revienta.

Plaza Italia arde con humo, rabia y cámaras encendidas. Para alguien como tú, una multitud excitada no es solo ruido social: es hambre multiplicada.

Esta no es una noche de teoría; es elegir qué parte de ti manda cuando todo alrededor está en combustión.`,
  },
  chapter06: {
    contentVersion: 3,
    label: "Contexto · invitación de seda",
    body: `Lo de la Alameda dejó huella: la calle te vio actuar, y la Corte también. En el poder inmortal, cada gesto “moral” se interpreta como costo político.

La respuesta llega en formato elegente: papel grueso, olor a lavanda y una cita sin opción real de rechazo en la Viña del Silencio.

Allí no se discute supervivencia; se negocian cadenas.`,
  },
  chapter07: {
    contentVersion: 3,
    label: "Contexto · ecos de Nod",
    body: `La copa negra te dejó algo más que náusea: visiones. Hay recuerdos que no son tuyos golpeando detrás de los ojos.

Mientras el Príncipe te quiere como embajador funcional, Gato te marca otro camino: bajar donde no llegan los rascacielos ni la narrativa oficial.

En las profundidades, la pregunta deja de ser quién manda hoy; pasa a ser qué está despertando.`,
  },
  chapter08: {
    contentVersion: 3,
    label: "Contexto · santuario marcado",
    body: `Después del Archivista, la ciudad ya no se parece a sí misma. Cada esquina parece una costura mal hecha sobre algo mucho más viejo y hambriento.

Buscas refugio en Teatinos, pero el olor te recibe antes que la puerta: sangre fresca, metal caliente y mensaje de guerra.

Cuando marcan la casa, te marcan al cuerpo. Y cuando el cuerpo queda marcado, se acaba la neutralidad.`,
  },
  chapter09: {
    contentVersion: 3,
    label: "Contexto · la cadena en la sangre",
    body: `Perdiste el refugio y ganaste un espejo brutal: ahora sabes cómo te ven ambos bandos. El Sabat te quiere roto. El Príncipe te quiere útil.

En la periferia con Gato aparece la palabra exacta para tu malestar: Vínculo. No lealtad; química de obediencia.

Romper esa cadena no es discurso; es hambre, costo humano y decisiones que dejan marca.`,
  },
  epilogue: {
    contentVersion: 3,
    label: "Contexto · después de la caída",
    body: `La confrontación final no apaga la ciudad ni limpia la sangre de tus manos. Solo redefine el lugar que ocupas en el tablero.

Santiago sigue funcionando para los vivos: transporte, oficinas, pantallas, olvido. Debajo, la guerra de los condenados continúa como si nada hubiese terminado.

El epílogo no cierra la noche; la convierte en hábito.`,
  },
};

export function getSoloChapterContextBlock(chapterId: string): SoloChapterContextBlock | null {
  return SOLO_CHAPTER_CONTEXT_REGISTRY[chapterId] ?? null;
}

export function isSoloChapterContextDismissed(
  progress: SoloChapterContextDismissable,
  chapterId: string,
): boolean {
  const block = getSoloChapterContextBlock(chapterId);
  if (!block) return true;
  const seen = progress.chapterContextSeen?.[chapterId] ?? 0;
  return seen >= block.contentVersion;
}

/** Subconjunto tipado sólo para comprobar el guardado sin importar SoloProgress completo. */
export type SoloChapterContextDismissable = {
  chapterContextSeen?: Record<string, number>;
};
