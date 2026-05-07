"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NexoWrapper } from "@/components/NexoWrapper";
import { isValidSchreckPin, normalizeSchreckPin, SCHRECKNET_PIN_DIGITS } from "@/lib/schreckPin";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [clan, setClan] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setMsg(null);
    const pin = normalizeSchreckPin(code);
    if (!name.trim()) {
      setMsg("Nombre de usuario obligatorio.");
      return;
    }
    if (!isValidSchreckPin(pin)) {
      setMsg(`Tu PIN debe ser exactamente ${SCHRECKNET_PIN_DIGITS} dígitos numéricos.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), clan: clan.trim(), code: pin }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setMsg(data.error ?? "No se pudo crear la cuenta.");
        return;
      }
      setMsg("Cuenta creada. Redirigiendo al login...");
      setTimeout(() => router.push("/auth/signin"), 700);
    } catch {
      setMsg("No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <NexoWrapper>
      <main className="flex min-h-screen items-center justify-center bg-[#050505] p-6 text-neutral-200">
        <section className="terminal-panel sharp-border-inner w-full max-w-md p-6 font-mono">
          <h1 className="font-grotesk text-lg text-[var(--terminal)]">Crear cuenta en SchreckNet</h1>
          <p className="mt-2 text-[11px] text-neutral-500">
            Define un nombre de usuario y un PIN de {SCHRECKNET_PIN_DIGITS} dígitos. Lo usarás igual en el login.
          </p>

          <form className="mt-6 space-y-3" onSubmit={submit}>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500" htmlFor="signup-name">
              Nombre de usuario
            </label>
            <input
              id="signup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-neutral-800 bg-black/60 px-2 py-2 text-[12px] focus:border-[var(--terminal)]/50 focus:outline-none"
              placeholder="Tu nombre"
              autoComplete="username"
            />

            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500" htmlFor="signup-clan">
              Clan (opcional)
            </label>
            <input
              id="signup-clan"
              value={clan}
              onChange={(e) => setClan(e.target.value)}
              className="w-full border border-neutral-800 bg-black/60 px-2 py-2 text-[12px] focus:border-[var(--terminal)]/50 focus:outline-none"
              placeholder="Toreador"
            />

            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500" htmlFor="signup-code">
              PIN ({SCHRECKNET_PIN_DIGITS} dígitos)
            </label>
            <input
              id="signup-code"
              type="password"
              inputMode="numeric"
              maxLength={SCHRECKNET_PIN_DIGITS}
              value={code}
              onChange={(e) => setCode(normalizeSchreckPin(e.target.value))}
              className="w-full border border-neutral-800 bg-black/60 px-2 py-2 text-[12px] tracking-[0.25em] focus:border-[var(--terminal)]/50 focus:outline-none"
              placeholder="123456"
              autoComplete="new-password"
            />

            {msg ? <p className="text-[11px] text-neutral-400">{msg}</p> : null}

            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={loading || !name.trim() || !isValidSchreckPin(code)}
                className="rounded border border-[var(--terminal)]/40 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--terminal)] disabled:opacity-60"
              >
                {loading ? "Creando..." : "Crear cuenta"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="rounded border border-neutral-700 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-300"
              >
                Volver al login
              </button>
            </div>
          </form>
        </section>
      </main>
    </NexoWrapper>
  );
}
