import { NextResponse } from "next/server";
import { normalizeChronicleAnalytics, type ChronicleAnalyticsEvent } from "@/lib/analytics/chronicleAnalytics";

const RING_BUFFER_LIMIT = 1000;
const memoryBuffer: ChronicleAnalyticsEvent[] = [];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const event = normalizeChronicleAnalytics(body);
  if (!event) {
    return NextResponse.json({ ok: false, error: "invalid_event_shape" }, { status: 400 });
  }

  memoryBuffer.push(event);
  if (memoryBuffer.length > RING_BUFFER_LIMIT) memoryBuffer.splice(0, memoryBuffer.length - RING_BUFFER_LIMIT);

  // Collector mínimo: mantiene buffer en memoria y emite resumen en servidor.
  console.info("[chronicle-log]", event.type, event.ts);

  return NextResponse.json({ ok: true, accepted: true, knownType: event.meta.knownType });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    count: memoryBuffer.length,
    events: memoryBuffer.slice(-100),
  });
}

