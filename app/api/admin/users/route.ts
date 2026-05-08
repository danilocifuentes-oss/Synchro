import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { listUsers } from "@/app/lib/users";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }

  const role =
    (session as unknown as { role?: string }).role ??
    ((session.user as unknown as { role?: string } | undefined)?.role ?? "player");

  if (role !== "admin" && role !== "narrador") {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  try {
    const users = (await listUsers()).map((u) => ({ id: u.id, name: u.name, clan: u.clan, role: u.role ?? "player" }));
    return NextResponse.json({ ok: true, users });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
