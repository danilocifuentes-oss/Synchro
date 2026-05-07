export const KNOWN_ANALYTICS_EVENTS = [
  "codex_opened",
  "codex_closed",
  "codex_navigate",
  "codex_search",
  "character_saved",
  "character_save_failed",
  "identity_update",
  "status_replace",
  "apply_delta",
  "scene_set_active",
  "spawn_event",
  "player_kick",
  "export_logs",
  "widgets_reordered",
  "ws_connected",
  "ws_disconnected",
] as const;

export type KnownAnalyticsEvent = (typeof KNOWN_ANALYTICS_EVENTS)[number];

export type ChronicleAnalyticsEvent = {
  ts: string;
  type: string;
  payload: unknown;
  meta: {
    schemaVersion: 1;
    knownType: boolean;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeChronicleAnalytics(input: unknown): ChronicleAnalyticsEvent | null {
  if (!isRecord(input)) return null;
  const rawType = typeof input.type === "string" ? input.type.trim() : "";
  if (!rawType) return null;
  const ts = typeof input.ts === "string" && input.ts.trim() ? input.ts : new Date().toISOString();
  const payload = "payload" in input ? input.payload : null;
  return {
    ts,
    type: rawType,
    payload,
    meta: {
      schemaVersion: 1,
      knownType: (KNOWN_ANALYTICS_EVENTS as readonly string[]).includes(rawType),
    },
  };
}

