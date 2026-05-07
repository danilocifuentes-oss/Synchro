/** Inventario narrativo vacío: se poblará con las nuevas banderas de la próxima crónica. */
export const CHRONICLE_INVENTORY_BY_FLAG: readonly { flag: string; label: string }[] = [];

export function chronicleInventoryLines(flags: Record<string, boolean> | undefined): string[] {
  if (!flags) return [];
  const out: string[] = [];
  for (const { flag, label } of CHRONICLE_INVENTORY_BY_FLAG) {
    if (flags[flag] === true) out.push(label);
  }
  return out;
}
