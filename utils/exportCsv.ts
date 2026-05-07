export function toCSV(rows: Record<string, unknown>[], headers?: string[]) {
  if (!rows || rows.length === 0) return "";
  const cols = headers ?? Object.keys(rows[0]);
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [cols.map(esc).join(",")].concat(rows.map((r) => cols.map((c) => esc(r[c])).join(",")));
  return lines.join("\n");
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

