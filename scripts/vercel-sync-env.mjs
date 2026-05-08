#!/usr/bin/env node
/**
 * Sincroniza variables en Vercel (crear o actualizar, sin duplicar filas para el mismo key+target).
 *
 * Requisitos: Node 18+ (fetch nativo).
 *
 * Obligatorio en el entorno:
 *   VERCEL_TOKEN           — Account → Tokens en Vercel
 *   VERCEL_PROJECT_ID      — ID del proyecto (dashboard → Settings → General, o `vercel projects ls`)
 *
 * Opcional:
 *   VERCEL_TEAM_ID         — Si el proyecto es de un team; se añade como ?teamId= en la API
 *
 * Valores a subir (los que falten o estén vacíos se omiten con aviso):
 *   NEXTAUTH_SECRET
 *   NEXTAUTH_URL
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Uso:
 *   node scripts/vercel-sync-env.mjs
 *   node scripts/vercel-sync-env.mjs --gen-secret
 *   node scripts/vercel-sync-env.mjs --target production,preview
 *
 * Tras ejecutar: redeploy en Vercel para que el runtime coja los valores.
 */

import crypto from "node:crypto";

const API = "https://api.vercel.com/v10/projects";

const token = process.env.VERCEL_TOKEN?.trim();
const projectId = process.env.VERCEL_PROJECT_ID?.trim();
const teamId = process.env.VERCEL_TEAM_ID?.trim() ?? "";

const KEYS = [
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1 || i + 1 >= process.argv.length) return null;
  return process.argv[i + 1];
}

function parseTargets() {
  const raw = argValue("--target") ?? "production";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function teamQuery() {
  return teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
}

function targetSignature(t) {
  return [...new Set(t)].sort().join("\0");
}

function targetMatch(apiTarget, wanted) {
  const a = Array.isArray(apiTarget) ? apiTarget : [];
  return targetSignature(a) === targetSignature(wanted);
}

async function listEnvs() {
  const url = `${API}/${encodeURIComponent(projectId)}/env${teamQuery()}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Listar env falló HTTP ${res.status}: ${text}`);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Respuesta no JSON al listar env: ${text.slice(0, 200)}`);
  }
  return data.envs ?? [];
}

function findEnvId(envs, key, targets) {
  for (const e of envs) {
    if (e.key !== key) continue;
    if (targetMatch(e.target, targets)) return e.id;
  }
  return null;
}

async function createEnv(key, value, targets) {
  const url = `${API}/${encodeURIComponent(projectId)}/env${teamQuery()}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: targets,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Crear ${key} HTTP ${res.status}: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function patchEnv(envId, value) {
  const url = `${API}/${encodeURIComponent(projectId)}/env/${encodeURIComponent(envId)}${teamQuery()}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Actualizar env ${envId} HTTP ${res.status}: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function main() {
  if (!token || !projectId) {
    console.error("Faltan VERCEL_TOKEN o VERCEL_PROJECT_ID en el entorno.");
    process.exit(1);
  }

  const targets = parseTargets();
  if (targets.length === 0) {
    console.error("Sin targets válidos tras --target.");
    process.exit(1);
  }

  if (process.argv.includes("--gen-secret") && !process.env.NEXTAUTH_SECRET?.trim()) {
    process.env.NEXTAUTH_SECRET = crypto.randomBytes(32).toString("hex");
    console.error("[ok] NEXTAUTH_SECRET generado (valor no mostrado).");
  }

  const envs = await listEnvs();
  let changed = 0;

  for (const key of KEYS) {
    const value = process.env[key]?.trim() ?? "";
    if (!value) {
      console.warn(`[omitido] ${key} — sin valor en el entorno.`);
      continue;
    }

    const id = findEnvId(envs, key, targets);
    if (id) {
      await patchEnv(id, value);
      console.log(`[actualizado] ${key}`);
    } else {
      await createEnv(key, value, targets);
      console.log(`[creado] ${key}`);
      const again = await listEnvs();
      envs.length = 0;
      envs.push(...again);
    }
    changed += 1;
  }

  if (changed === 0) {
    console.error("Ninguna variable aplicada. Exporta valores o usa --gen-secret con NEXTAUTH_URL y Upstash.");
    process.exit(1);
  }

  console.error("\nListo. En Vercel: redeploy del último deployment o Deployments → Redeploy.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
