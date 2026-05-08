import { Redis } from "@upstash/redis";

import type { StoredUser } from "@/lib/schreckStoredUserTypes";

const KEY = "nexo:schrecknet:users:v1";

function redis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isSchreckAuthUsersRedisConfigured(): boolean {
  return redis() !== null;
}

const ROLES = new Set<string>(["player", "operator", "admin", "narrador"]);

function isStoredUserLike(u: unknown): u is StoredUser {
  if (!u || typeof u !== "object") return false;
  const x = u as Record<string, unknown>;
  return (
    typeof x.id === "string" &&
    typeof x.name === "string" &&
    typeof x.codeHash === "string" &&
    (x.clan === undefined || typeof x.clan === "string") &&
    (x.role === undefined || (typeof x.role === "string" && ROLES.has(x.role)))
  );
}

function parseUsers(raw: unknown): StoredUser[] {
  if (raw == null) return [];
  try {
    const data = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    if (!Array.isArray(data)) return [];
    return data.filter(isStoredUserLike);
  } catch {
    return [];
  }
}

export async function redisReadSchreckUsers(): Promise<StoredUser[]> {
  const r = redis();
  if (!r) return [];
  const raw = await r.get(KEY);
  return parseUsers(raw);
}

export async function redisWriteSchreckUsers(users: StoredUser[]): Promise<void> {
  const r = redis();
  if (!r) throw new Error("Redis no disponible.");
  await r.set(KEY, JSON.stringify(users));
}
