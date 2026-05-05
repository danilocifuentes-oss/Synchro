import { NextResponse } from "next/server";

/** Motor narrativo multijugador desactivado hasta nueva iteración. */
export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST() {
  return NextResponse.json(
    {
      error:
        "El narrador automático del Nexo está desactivado en esta versión. La mesa se centra en la campaña solitaria.",
    },
    { status: 503 },
  );
}
