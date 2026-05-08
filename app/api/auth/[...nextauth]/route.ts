import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findStoredUserByIdentifier } from "@/app/lib/users";
import { isValidSchreckPin, normalizeSchreckPin } from "@/lib/schreckPin";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_ATTEMPTS = 8;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(reqLike: unknown): string {
  if (!reqLike || typeof reqLike !== "object") return "unknown";
  const req = reqLike as {
    headers?: Headers | Record<string, string | string[] | undefined>;
  };
  const headers = req.headers;
  if (!headers) return "unknown";

  if (typeof (headers as Headers).get === "function") {
    const h = headers as Headers;
    const fwd = h.get("x-forwarded-for") ?? h.get("x-real-ip");
    if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
    return "unknown";
  }

  const bag = headers as Record<string, string | string[] | undefined>;
  const fwd = bag["x-forwarded-for"] ?? bag["x-real-ip"];
  if (Array.isArray(fwd)) return fwd[0] ?? "unknown";
  return fwd ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const key = `auth:${ip}`;
  const bucket = rateBuckets.get(key);
  if (!bucket) return false;
  if (bucket.resetAt <= now) {
    rateBuckets.delete(key);
    return false;
  }
  return bucket.count >= RATE_MAX_ATTEMPTS;
}

function registerFail(ip: string): void {
  const now = Date.now();
  const key = `auth:${ip}`;
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }
  rateBuckets.set(key, { ...bucket, count: bucket.count + 1 });
}

function clearRateLimit(ip: string): void {
  rateBuckets.delete(`auth:${ip}`);
}

const isProd = process.env.NODE_ENV === "production";
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

/** En producción hace falta NEXTAUTH_SECRET para firmar JWT; el login contra cuentas es solo Redis/archivo local. */
function productionSecretsOk(): boolean {
  if (!isProd) return true;
  return Boolean(nextAuthSecret?.trim());
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "schrecknet",
      name: "SchreckNet",
      credentials: {
        identifier: { label: "Nombre o ID", type: "text", placeholder: "Nombre o UUID" },
        code: { label: "Contraseña", type: "text", placeholder: "123456" },
      },
      async authorize(credentials, req) {
        const identifier = String(credentials?.identifier ?? "").trim();
        const rawCode = String(credentials?.code ?? "").trim();
        const pinDigits = normalizeSchreckPin(rawCode);
        const codeNormalized = rawCode.toUpperCase();
        const ip = getClientIp(req);
        if (!rawCode || isRateLimited(ip)) return null;
        if (!productionSecretsOk()) {
          console.error("[auth] Producción sin NEXTAUTH_SECRET: no se puede firmar sesión.");
          return null;
        }

        async function matchLocal(hash: string): Promise<boolean> {
          if (isValidSchreckPin(pinDigits) && (await bcrypt.compare(pinDigits, hash))) return true;
          if (codeNormalized.length > 0 && (await bcrypt.compare(codeNormalized, hash))) return true;
          return false;
        }

        if (identifier) {
          const stored = await findStoredUserByIdentifier(identifier);
          if (stored && (await matchLocal(stored.codeHash))) {
            clearRateLimit(ip);
            return {
              id: stored.id,
              name: stored.name,
              clan: stored.clan,
              role: stored.role ?? "player",
            } as unknown as {
              id: string;
              name: string;
              clan?: string;
              role?: string;
            };
          }
        }

        const devCode = !isProd ? String(process.env.SCHRECKNET_DEV_CODE ?? "").trim().toUpperCase() : "";
        if (!identifier && devCode && (codeNormalized === devCode || pinDigits === devCode)) {
          clearRateLimit(ip);
          return {
            id: "dev-user",
            name: "Operador",
            clan: "Toreador",
            role: "player",
          } as unknown as {
            id: string;
            name: string;
            clan?: string;
            role?: string;
          };
        }

        registerFail(ip);
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        const ur = user as unknown as { role?: string };
        token.role = ur.role ?? "player";
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }
      const typed = token as unknown as { role?: string };
      const fromUserRole = token.user ? (token.user as unknown as { role?: string }).role : undefined;
      const role =
        typeof typed.role === "string"
          ? typed.role
          : typeof fromUserRole === "string"
            ? fromUserRole
            : "player";
      (session as unknown as { role: string }).role = role ?? "player";
      return session;
    },
  },
  secret: nextAuthSecret || "dev-secret",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
