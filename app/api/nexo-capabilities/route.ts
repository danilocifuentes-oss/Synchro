import { NextResponse } from "next/server";

/**
 * Indica si el despliegue tiene claves de LLM para un futuro modo multijugador.
 * (No activa la narración automática en el cliente: eso se implementará aparte.)
 */
export async function GET() {
  const hasGemini = Boolean(
    process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim(),
  );
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
  return NextResponse.json(
    { llmReady: hasGemini || hasOpenAI },
    { headers: { "Cache-Control": "no-store" } },
  );
}
