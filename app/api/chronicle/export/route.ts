import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ ok: true, message: "Implement server-side export to DB" });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

