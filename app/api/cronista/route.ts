import { NextResponse } from "next/server";

/** Nexo multijugador / manifest desactivado en esta build (solo campaña solitaria activa). */
export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "El canal de tiradas narradas del Nexo está desactivado en esta versión. Usa la campaña solitaria (hilo SOL).",
    },
    { status: 503 },
  );
}
