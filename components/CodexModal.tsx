"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useActionLogger from "@/hooks/useActionLogger";
import { useCharacter } from "@/context/CharacterContext";

type Entry = { id: string; title: string; body?: string; tags?: string[] };

const SAMPLE_ENTRIES: Entry[] = [
  { id: "e1", title: "Glifos y disciplinas", body: "Descripcion de glifos...", tags: ["glifo", "disciplina"] },
  { id: "e2", title: "Rituales nocturnos", body: "Pasos del ritual...", tags: ["ritual"] },
  { id: "e3", title: "Registro de cronicas", body: "Como guardar cronicas...", tags: ["registro", "px"] },
  { id: "e4", title: "Reglas rapidas", body: "Resumen de mecanicas...", tags: ["reglas"] },
];

function buildHistoryKey(characterId?: string, characterName?: string): string {
  const id = characterId?.trim() || characterName?.trim() || "anon";
  return `codex_search_history:${id.toLowerCase()}`;
}

export default function CodexModal({ onClose, onNavigate }: { onClose: () => void; onNavigate?: () => void }) {
  const logger = useActionLogger({ endpoint: "/api/chronicle/log" });
  const { character } = useCharacter();
  const [q, setQ] = useState("");
  const [entries] = useState<Entry[]>(SAMPLE_ENTRIES);
  const [history, setHistory] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const historyKey = buildHistoryKey(character.identity.id, character.identity.nombre);

  const pushHistory = (term: string) => {
    const normalized = term.trim();
    if (!normalized) return;
    setHistory((prev) => {
      const deduped = [normalized, ...prev.filter((x) => x.toLowerCase() !== normalized.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem(historyKey, JSON.stringify(deduped));
      } catch {
        // noop
      }
      return deduped;
    });
  };

  useEffect(() => {
    logger.push("codex_opened", { ts: new Date().toISOString(), characterId: character.identity.id ?? null });
    try {
      const raw = localStorage.getItem(historyKey);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      if (Array.isArray(parsed)) setHistory(parsed.slice(0, 8));
    } catch {
      // noop
    }
  }, [character.identity.id, historyKey, logger]);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key !== "/") return;
      const target = ev.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTypingTarget) return;
      ev.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter((e) =>
      `${e.title} ${(e.tags ?? []).join(" ")} ${e.body ?? ""}`.toLowerCase().includes(term),
    );
  }, [q, entries]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/70"
          onClick={() => {
            logger.push("codex_closed", {});
            onClose();
          }}
          aria-label="Cerrar modal de Codex"
        />
        <motion.div
          initial={{ y: 12, scale: 0.99 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 12, scale: 0.99 }}
          transition={{ duration: 0.18 }}
          className="sharp-border-inner relative max-h-[80vh] w-[min(920px,94%)] overflow-auto rounded-md bg-[var(--panel)] p-6"
        >
          <header className="mb-4 flex items-center justify-between">
            <h3 className="font-grotesk text-lg">Codex V - Indice</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  logger.push("codex_navigate", { from: "modal" });
                  onNavigate?.();
                }}
                className="rounded border px-3 py-1"
              >
                Abrir pagina completa
              </button>
              <button
                type="button"
                onClick={() => {
                  logger.push("codex_closed", {});
                  onClose();
                }}
                className="rounded border px-3 py-1"
              >
                Cerrar
              </button>
            </div>
          </header>

          <div className="mb-4">
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pushHistory(q);
                  logger.push("codex_search", { query: q.trim() });
                }
              }}
              placeholder="Buscar en Codex... (pulsa / para enfocar)"
              className="w-full border border-[rgba(255,255,255,0.04)] bg-transparent p-2 font-mono"
            />
            {history.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {history.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQ(item)}
                    className="rounded border border-[rgba(255,255,255,0.08)] px-2 py-0.5 text-xs text-[var(--accent-muted)]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {results.map((r) => (
              <article key={r.id} className="rounded bg-[rgba(255,255,255,0.01)] p-3">
                <h4 className="font-grotesk">{r.title}</h4>
                <p className="mb-2 text-xs text-[var(--accent-muted)]">{(r.tags ?? []).join(" • ")}</p>
                <div className="line-clamp-4 text-sm font-mono text-[var(--terminal)]">{r.body}</div>
              </article>
            ))}
            {results.length === 0 ? (
              <div className="text-sm text-[var(--accent-muted)]">No se encontraron entradas para "{q}".</div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

