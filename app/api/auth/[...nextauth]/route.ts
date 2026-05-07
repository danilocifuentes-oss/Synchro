import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findStoredUserByIdentifier } from "@/app/lib/users";

type ExternalUser = {
  id: string;
  name: string;
  clan?: string;
};

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

async function validateWithExternalAuth(code: string, ip: string): Promise<ExternalUser | null> {
  const endpoint = process.env.AUTH_VALIDATE_ENDPOINT;
  const serviceToken = process.env.AUTH_VALIDATE_TOKEN;
  if (!endpoint) return null;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
    body: JSON.stringify({ code, ip }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    ok?: boolean;
    user?: { id?: string; name?: string; clan?: string };
  };
  if (!data?.ok || !data.user?.id || !data.user?.name) return null;
  return { id: data.user.id, name: data.user.name, clan: data.user.clan };
}

const isProd = process.env.NODE_ENV === "production";
const authValidateEndpoint = process.env.AUTH_VALIDATE_ENDPOINT;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

function hasRequiredProdAuthEnv(): boolean {
  if (!isProd) return true;
  if (!nextAuthSecret) return false;
  if (!authValidateEndpoint) return false;
  return true;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "schrecknet",
      name: "SchreckNet",
      credentials: {
        identifier: { label: "Nombre o ID", type: "text", placeholder: "Nombre o UUID" },
        code: { label: "Código", type: "text", placeholder: "CRONISTA" },
      },
      async authorize(credentials, req) {
        const identifier = String(credentials?.identifier ?? "").trim();
        const codeNormalized = String(credentials?.code ?? "").trim().toUpperCase();
        const ip = getClientIp(req);
        if (!codeNormalized || isRateLimited(ip)) return null;
        if (!hasRequiredProdAuthEnv()) {
          console.error("[auth] Faltan variables requeridas en producción: NEXTAUTH_SECRET y/o AUTH_VALIDATE_ENDPOINT");
          return null;
        }

        if (identifier) {
          const localUser = findStoredUserByIdentifier(identifier);
          if (localUser && (await bcrypt.compare(codeNormalized, localUser.codeHash))) {
            clearRateLimit(ip);
            return {
              id: localUser.id,
              name: localUser.name,
              clan: localUser.clan,
              role: localUser.role ?? "player",
            } as unknown as {
              id: string;
              name: string;
              clan?: string;
              role?: string;
            };
          }
        }

        try {
          const externalUser = await validateWithExternalAuth(codeNormalized, ip);
          if (externalUser) {
            clearRateLimit(ip);
            return { id: externalUser.id, name: externalUser.name, clan: externalUser.clan } as unknown as {
              id: string;
              name: string;
              clan?: string;
            };
          }
        } catch {
          // Si el servicio externo falla, seguimos con fallback controlado.
        }

        // Fallback de desarrollo (desactívalo en producción dejando vacío SCHRECKNET_DEV_CODE).
        const devCode = !isProd ? String(process.env.SCHRECKNET_DEV_CODE ?? "").trim().toUpperCase() : "";
        if (!identifier && devCode && codeNormalized === devCode) {
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

