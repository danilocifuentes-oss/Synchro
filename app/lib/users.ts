import "server-only";

import fs from "node:fs";
import path from "node:path";

export type StoredUserRole = "player" | "operator" | "admin" | "narrador";

export type StoredUser = {
  id: string;
  name: string;
  clan?: string;
  codeHash: string;
  role?: StoredUserRole;
};

const DB_PATH = path.join(process.cwd(), "data", "users.json");

function ensureDb(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), "utf8");
}

export function readUsers(): StoredUser[] {
  ensureDb();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8")) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf8");
}

export function findUserByName(name: string): StoredUser | null {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return null;
  return readUsers().find((u) => u.name.trim().toLowerCase() === normalized) ?? null;
}

/** Coincide UUID exacto, nombre literal o nombre sin distinguir mayúsculas/minúsculas. */
export function findStoredUserByIdentifier(identifier: string): StoredUser | null {
  const id = identifier.trim();
  if (!id) return null;
  const users = readUsers();
  const byUuid = users.find((u) => u.id === id);
  if (byUuid) return byUuid;
  const byExactName = users.find((u) => u.name.trim() === id);
  if (byExactName) return byExactName;
  return findUserByName(id);
}

export function listUsers(): StoredUser[] {
  return readUsers();
}

export function addUser(user: StoredUser): void {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}
