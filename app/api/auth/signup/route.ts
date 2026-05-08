import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { addUser, findUserByName } from "@/app/lib/users";
import { isValidSchreckPin, normalizeSchreckPin } from "@/lib/schreckPin";

const SIGNUP_RATE_WINDOW_MS = 10 * 60 * 1000;
const SIGNUP_MAX_ATTEMPTS = 6;
const signupRateBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = signupRateBuckets.get(ip);
  if (!bucket) return false;
  if (bucket.resetAt <= now) {
    signupRateBuckets.delete(ip);
    return false;
  }
  return bucket.count >= SIGNUP_MAX_ATTEMPTS;
}

function registerAttempt(ip: string): void {
  const now = Date.now();
  const bucket = signupRateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    signupRateBuckets.set(ip, { count: 1, resetAt: now + SIGNUP_RATE_WINDOW_MS });
    return;
  }
  signupRateBuckets.set(ip, { ...bucket, count: bucket.count + 1 });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Demasiados intentos. Intenta más tarde." }, { status: 429 });
  }

  try {
    const body = (await req.json()) as { name?: string; clan?: string; code?: string };
    const name = String(body.name ?? "").trim();
    const clan = String(body.clan ?? "").trim();
    const pin = normalizeSchreckPin(String(body.code ?? ""));

    if (!name || !pin) {
      registerAttempt(ip);
      return NextResponse.json({ ok: false, error: "Faltan nombre o PIN." }, { status: 400 });
    }

    if (name.length < 3 || name.length > 40) {
      registerAttempt(ip);
      return NextResponse.json({ ok: false, error: "El nombre debe tener entre 3 y 40 caracteres." }, { status: 400 });
    }

    if (!isValidSchreckPin(pin)) {
      registerAttempt(ip);
      return NextResponse.json(
        { ok: false, error: "La contraseña debe ser exactamente 6 dígitos numéricos." },
        { status: 400 },
      );
    }

    if (await findUserByName(name)) {
      registerAttempt(ip);
      return NextResponse.json({ ok: false, error: "Ese nombre ya está en uso." }, { status: 409 });
    }

    const hash = await bcrypt.hash(pin, 10);
    await addUser({
      id: randomUUID(),
      name,
      clan: clan || undefined,
      codeHash: hash,
      role: "player",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    registerAttempt(ip);
    const message = e instanceof Error ? e.message : "No se pudo crear la cuenta.";
    const status = /UPSTASH|disco|Redis/i.test(message) ? 503 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
