"use client";

import React, { useEffect, useState } from "react";
import { NexoWrapper } from "@/components/NexoWrapper";
import TechnicalHud from "@/components/TechnicalHud";
import TerminalLogStream from "@/components/TerminalLogStream";
import useActionLogger from "@/hooks/useActionLogger";
import useWebSocket from "@/hooks/useWebSocket";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { useSettings } from "@/context/SettingsContext";
import { downloadCSV, toCSV } from "@/utils/exportCsv";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";

type Player = { id: string; name: string; clan?: string; online?: boolean };
type Scene = { id: string; title: string; description?: string };
type Widget = { id: string; title: string };

function WidgetShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sharp-border-inner rounded-md bg-[var(--panel)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-grotesk text-sm">{title}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SortableWidget({
  id,
  reduced,
  className,
  children,
}: {
  id: string;
  reduced: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: reduced ? "none" : transition,
  };
  return (
    <div ref={setNodeRef} style={style} className={className}>
      <div className="mb-2 cursor-grab text-[10px] uppercase tracking-[0.14em] text-neutral-500 active:cursor-grabbing" {...attributes} {...listeners}>
        Arrastra para reordenar
      </div>
      {children}
    </div>
  );
}

export default function CommandCenter() {
  const logger = useActionLogger({ endpoint: "/api/chronicle/log" });
  const sysReduced = usePrefersReducedMotion();
  const { settings } = useSettings();
  const effectiveReduced = settings.reducedMotionOverride == null ? sysReduced : settings.reducedMotionOverride;

  const [players, setPlayers] = useState<Player[]>([
    { id: "p1", name: "Ariadne", clan: "Toreador", online: true },
    { id: "p2", name: "K.", clan: "Nosferatu", online: false },
  ]);
  const [scenes] = useState<Scene[]>([
    { id: "s1", title: "Intro — La Llamada" },
    { id: "s2", title: "La Marca" },
  ]);
  const [activeScene, setActiveScene] = useState<string>(scenes[0]?.id ?? "");
  const [logLines, setLogLines] = useState<{ id: string; text: string }[]>([]);
  const [eventPayload, setEventPayload] = useState<string>('{"type":"ambush","intensity":2}');
  const [spawnResult, setSpawnResult] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "w-scenes", title: "Escenas" },
    { id: "w-spawn", title: "Spawn / Evento" },
    { id: "w-players", title: "Jugadores" },
    { id: "w-logs", title: "Chronicle Log" },
  ]);

  const sensors = useSensors(useSensor(PointerSensor));
  const wsUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/ws`
      : "";

  useEffect(() => {
    try {
      const buf = JSON.parse(localStorage.getItem("cronista_log_buffer") || "[]");
      const lines = (buf as Array<{ ts?: string; type?: string; payload?: unknown }>)
        .slice(-200)
        .map((e, i) => ({ id: `l${i}`, text: `${e.ts ?? ""} · ${e.type ?? "evento"} · ${JSON.stringify(e.payload ?? {})}` }));
      setLogLines(lines.reverse());
    } catch {
      // noop
    }
  }, []);

  useWebSocket(wsUrl, {
    onMessage: (data) => {
      if (!data || typeof data !== "object") return;
      const evt = data as { type?: string; payload?: Player | Record<string, unknown> };
      if (evt.type === "log") {
        const id = `${Date.now()}`;
        const text = `${new Date().toISOString()} · ${evt.type} · ${JSON.stringify(evt.payload ?? {})}`;
        setLogLines((s) => [{ id, text }, ...s].slice(0, 200));
      } else if (evt.type === "player" && evt.payload && typeof evt.payload === "object") {
        const payload = evt.payload as Player;
        setPlayers((prev) => {
          const exists = prev.find((p) => p.id === payload.id);
          if (exists) return prev.map((p) => (p.id === payload.id ? { ...p, ...payload } : p));
          return [payload, ...prev];
        });
      }
    },
    onOpen: () => logger.push("ws_connected", { ts: new Date().toISOString() }),
    onClose: () => logger.push("ws_disconnected", { ts: new Date().toISOString() }),
  });

  const pushLog = (type: string, payload: unknown) => {
    logger.push(type, payload);
    const id = `${Date.now()}`;
    const text = `${new Date().toISOString()} · ${type} · ${JSON.stringify(payload)}`;
    setLogLines((s) => [{ id, text }, ...s].slice(0, 200));
  };

  const handleSetActiveScene = (id: string) => {
    setActiveScene(id);
    pushLog("scene_set_active", { sceneId: id });
  };

  const handleSpawnEvent = async () => {
    try {
      const payload = JSON.parse(eventPayload);
      const data = { ok: true, spawnedId: `ev_${Date.now()}` };
      setSpawnResult(`Spawned ${data.spawnedId}`);
      pushLog("spawn_event", { payload, result: data });
    } catch (e) {
      setSpawnResult(`Error: ${String(e)}`);
    }
  };

  const handleKickPlayer = (id: string) => {
    setPlayers((p) => p.filter((x) => x.id !== id));
    pushLog("player_kick", { playerId: id });
  };

  const clearLogs = () => {
    localStorage.removeItem("cronista_log_buffer");
    setLogLines([]);
    pushLog("logs_cleared", {});
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = widgets.findIndex((w) => w.id === String(active.id));
    const newIndex = widgets.findIndex((w) => w.id === String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next: Widget[] = arrayMove(widgets, oldIndex, newIndex);
    setWidgets(next);
    pushLog("widgets_reordered", { from: oldIndex, to: newIndex, order: next.map((w) => w.id) });
  };

  const exportLogsCsv = () => {
    const rows = logLines.map((l) => {
      const parts = l.text.split(" · ");
      return { ts: parts[0] ?? "", type: parts[1] ?? "", payload: parts.slice(2).join(" · ") };
    });
    const csv = toCSV(rows, ["ts", "type", "payload"]);
    downloadCSV(`chronicle_logs_${Date.now()}.csv`, csv);
    pushLog("export_logs", { count: rows.length });
  };

  return (
    <NexoWrapper>
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-grotesk text-2xl">Command Center</h1>
            <div className="text-xs text-[var(--accent-muted)]">Panel narrador — widgets reordenables, realtime logs</div>
          </div>
          <div className="flex items-center gap-3">
            <TechnicalHud ansia={0} voluntad={{ current: 0, max: 1 }} daño={{ current: 0, max: 1 }} compact />
            <button type="button" onClick={() => pushLog("heartbeat", { ts: new Date().toISOString() })} className="rounded border px-3 py-2">
              Ping
            </button>
            <button type="button" onClick={exportLogsCsv} className="rounded border px-3 py-2">
              Export CSV
            </button>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={widgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {widgets.map((w) => (
                <SortableWidget key={w.id} id={w.id} reduced={effectiveReduced} className="lg:col-span-4">
                  {w.id === "w-scenes" ? (
                    <WidgetShell title={w.title}>
                      <div className="space-y-2">
                        {scenes.map((s) => (
                          <div key={s.id} className="flex items-center justify-between gap-3 rounded bg-[rgba(255,255,255,0.01)] p-2">
                            <div>
                              <div className="font-grotesk">{s.title}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleSetActiveScene(s.id)}
                                className={`rounded px-2 py-1 text-sm ${activeScene === s.id ? "bg-[var(--terminal)] text-black" : "border"}`}
                              >
                                Activar
                              </button>
                              <button type="button" onClick={() => pushLog("scene_edit", { sceneId: s.id })} className="rounded border px-2 py-1">
                                Editar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </WidgetShell>
                  ) : null}

                  {w.id === "w-spawn" ? (
                    <WidgetShell title={w.title}>
                      <textarea
                        value={eventPayload}
                        onChange={(e) => setEventPayload(e.target.value)}
                        className="w-full border border-[rgba(255,255,255,0.03)] bg-transparent p-2 font-mono text-sm text-[var(--terminal)]"
                        rows={4}
                      />
                      <div className="mt-2 flex gap-2">
                        <button type="button" onClick={handleSpawnEvent} className="rounded bg-[var(--neon)] px-3 py-2 text-black">
                          Spawn
                        </button>
                        <button type="button" onClick={() => setEventPayload("{}")} className="rounded border px-3 py-2">
                          Reset
                        </button>
                      </div>
                      {spawnResult ? <div className="mt-2 text-xs text-[var(--accent-muted)]">{spawnResult}</div> : null}
                    </WidgetShell>
                  ) : null}

                  {w.id === "w-players" ? (
                    <WidgetShell title={w.title}>
                      <div className="space-y-2">
                        {players.map((p) => (
                          <div key={p.id} className="flex items-center justify-between rounded bg-[rgba(255,255,255,0.01)] p-2">
                            <div>
                              <div className="font-grotesk">{p.name}</div>
                              <div className="text-xs text-[var(--accent-muted)]">
                                {p.clan} • {p.online ? "online" : "offline"}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => pushLog("player_message", { playerId: p.id, msg: "Aviso del narrador" })}
                                className="rounded border px-2 py-1"
                              >
                                Msg
                              </button>
                              <button type="button" onClick={() => handleKickPlayer(p.id)} className="rounded border px-2 py-1 text-[var(--crimson)]">
                                Kick
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </WidgetShell>
                  ) : null}

                  {w.id === "w-logs" ? (
                    <WidgetShell title={w.title}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs text-[var(--accent-muted)]">Últimos eventos</div>
                        <button type="button" onClick={clearLogs} className="rounded border px-2 py-1 text-xs">
                          Limpiar
                        </button>
                      </div>
                      <div className="max-h-72 overflow-auto">
                        <TerminalLogStream lines={logLines.map((l) => ({ id: l.id, text: l.text }))} />
                      </div>
                    </WidgetShell>
                  ) : null}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </NexoWrapper>
  );
}

