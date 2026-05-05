/**
 * Selección del motor LLM (solo servidor / env).
 * Usado por health, pulso-mundo y capacidades Nexo — no por el canal narrativo multijugador (desactivado).
 */

import { resolveGeminiApiKey } from "@/lib/geminiEnv";
import { isExternalLlmBlocked } from "@/lib/operatorRuntimeSettings";

export type LlmDriverId = "gemini" | "openai" | "internal";

function trimEnv(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v || undefined;
}

export function hasGeminiKey(): boolean {
  return Boolean(resolveGeminiApiKey());
}

export function hasOpenAiKey(): boolean {
  return Boolean(trimEnv("OPENAI_API_KEY"));
}

function normalizedProvider(): string {
  const p = trimEnv("NEXO_LLM_PROVIDER")?.toLowerCase();
  if (p === "gemini" || p === "openai" || p === "internal" || p === "auto") return p;
  return "auto";
}

function preferInAuto(): "gemini" | "openai" {
  const x = trimEnv("NEXO_LLM_PREFER")?.toLowerCase();
  return x === "openai" ? "openai" : "gemini";
}

export function resolveDriverChain(): LlmDriverId[] {
  if (isExternalLlmBlocked()) {
    return ["internal"];
  }
  return resolveDriverChainBase();
}

function resolveDriverChainBase(): LlmDriverId[] {
  const mode = normalizedProvider();
  const g = hasGeminiKey();
  const o = hasOpenAiKey();
  const pref = preferInAuto();

  const apisOrdered: LlmDriverId[] =
    pref === "gemini" ? (g && o ? ["gemini", "openai"] : g ? ["gemini"] : o ? ["openai"] : []) : o && g ? ["openai", "gemini"] : o ? ["openai"] : g ? ["gemini"] : [];

  if (mode === "internal") {
    return ["internal"];
  }

  if (mode === "gemini") {
    const chain: LlmDriverId[] = [];
    if (g) chain.push("gemini");
    if (o) chain.push("openai");
    chain.push("internal");
    return dedupe(chain);
  }

  if (mode === "openai") {
    const chain: LlmDriverId[] = [];
    if (o) chain.push("openai");
    if (g) chain.push("gemini");
    chain.push("internal");
    return dedupe(chain);
  }

  const chain: LlmDriverId[] = [...apisOrdered, "internal"];
  return dedupe(chain);
}

function dedupe(chain: LlmDriverId[]): LlmDriverId[] {
  const out: LlmDriverId[] = [];
  const seen = new Set<LlmDriverId>();
  for (const id of chain) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function describeDriverResolution(): {
  providerEnv: string;
  chain: LlmDriverId[];
  hasGemini: boolean;
  hasOpenAi: boolean;
  externalLlmBlocked: boolean;
} {
  return {
    providerEnv: normalizedProvider(),
    chain: resolveDriverChain(),
    hasGemini: hasGeminiKey(),
    hasOpenAi: hasOpenAiKey(),
    externalLlmBlocked: isExternalLlmBlocked(),
  };
}

export function openAiModel(): string {
  return trimEnv("OPENAI_MODEL") ?? "gpt-4o-mini";
}
