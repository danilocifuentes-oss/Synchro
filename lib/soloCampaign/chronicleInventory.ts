/**
 * Etiquetas legibles para banderas de inventario / mandato en crónica solitaria.
 * Sólo se muestran entradas cuya bandera está activa en `progress.flags`.
 */
export const CHRONICLE_INVENTORY_BY_FLAG: readonly { flag: string; label: string }[] = [
  { flag: "agente_oficial", label: "Kit operativo Torre (linterna táctica, acceso garaje si aplica)" },
  { flag: "radio_militar", label: "Radio militar (frecuencia encriptada)" },
  { flag: "tarjeta_viña", label: "Tarjeta · Viña del Silencio" },
  { flag: "sello_viña_caida", label: "Frasco lacrado · marca Viña del Silencio" },
  { flag: "info_traje_gris", label: "Información · hombre de traje gris" },
  { flag: "secreto_del_sastre", label: "Pista · el Sastre / Traje gris" },
  { flag: "protocolo_corte", label: "Protocolo de la Corte interiorizado" },
];

export function chronicleInventoryLines(flags: Record<string, boolean> | undefined): string[] {
  if (!flags) return [];
  const out: string[] = [];
  for (const { flag, label } of CHRONICLE_INVENTORY_BY_FLAG) {
    if (flags[flag] === true) out.push(label);
  }
  return out;
}
