"use client";

import { useCallback } from "react";

type LogEntry = {
  ts: string;
  type: string;
  payload: unknown;
};

type Options = {
  endpoint?: string;
  bufferKey?: string;
  maxEntries?: number;
};

export default function useActionLogger({
  endpoint = "/api/chronicle/log",
  bufferKey = "cronista_log_buffer",
  maxEntries = 500,
}: Options = {}) {
  const push = useCallback(
    (type: string, payload: unknown) => {
      const entry: LogEntry = { ts: new Date().toISOString(), type, payload };

      try {
        const raw = localStorage.getItem(bufferKey);
        const prev = raw ? (JSON.parse(raw) as LogEntry[]) : [];
        const next = [...prev, entry].slice(-maxEntries);
        localStorage.setItem(bufferKey, JSON.stringify(next));
      } catch {
        // No bloquear UI por fallos de almacenamiento local.
      }

      void fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      }).catch(() => {
        // Modo best-effort: si falla red/API, el buffer local queda como respaldo.
      });
    },
    [bufferKey, endpoint, maxEntries],
  );

  return { push };
}

