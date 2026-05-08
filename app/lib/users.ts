import "server-only";

import fs from "node:fs";
import path from "node:path";

import {
  isSchreckAuthUsersRedisConfigured,
  redisReadSchreckUsers,
  redisWriteSchreckUsers,
} from "@/lib/schreckAuthUsersRedis";

import type { StoredUser, StoredUserRole } from "@/lib/schreckStoredUserTypes";

export type { StoredUser, StoredUserRole };

const DB_PATH = path.join(process.cwd(), "data", "users.json");

function ensureFsDb(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), "utf8");
}

function readUsersFromFs(): StoredUser[] {
  ensureFsDb();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8")) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsersToFs(users: StoredUser[]): void {
  ensureFsDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf8");
}

async function writeUsersBlob(users: StoredUser[]): Promise<void> {
  if (isSchreckAuthUsersRedisConfigured()) {
    await redisWriteSchreckUsers(users);
    return;
  }
  try {
    writeUsersToFs(users);
  } catch {
    throw new Error(
      "No se pudo guardar en disco. En Vercel (serverless), configura UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN.",
    );
  }
}

/** Lista de usuarios (Redis si hay env; si no, JSON local en data/users.json). */
export async function readUsers(): Promise<StoredUser[]> {
  if (isSchreckAuthUsersRedisConfigured()) {
    return redisReadSchreckUsers();
  }
  return readUsersFromFs();
}

export async function findUserByName(name: string): Promise<StoredUser | null> {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return null;
  const users = await readUsers();
  return users.find((u) => u.name.trim().toLowerCase() === normalized) ?? null;
}

/** Coincide UUID exacto, nombre literal o nombre sin distinguir mayúsculas/minúsculas. */
export async function findStoredUserByIdentifier(identifier: string): Promise<StoredUser | null> {
  const id = identifier.trim();
  if (!id) return null;
  const users = await readUsers();
  const byUuid = users.find((u) => u.id === id);
  if (byUuid) return byUuid;
  const byExactName = users.find((u) => u.name.trim() === id);
  if (byExactName) return byExactName;
  return findUserByName(id);
}

export async function listUsers(): Promise<StoredUser[]> {
  return readUsers();
}

export async function addUser(user: StoredUser): Promise<void> {
  const users = await readUsers();
  users.push(user);
  await writeUsersBlob(users);
}
