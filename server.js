const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const pool = require("./db");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const TOPICS = [
  "¿Qué te está pesando hoy, aunque no lo digas?",
  "¿Qué pensamiento vuelve una y otra vez esta semana?",
  "¿Qué necesitas soltar para respirar mejor?",
  "¿Qué te da miedo admitir ahora mismo?",
  "¿Qué cambio estás postergando?",
  "¿Qué parte de ti está pidiendo pausa?",
  "¿Qué te gustaría que alguien entendiera sin explicarlo?",
  "¿Qué te está dando esperanza últimamente?",
];

const INVITES_TTL_MS = 1000 * 60 * 60;
const invites = new Map();

const PRESENCE_TTL_MS = 1000 * 45;
const presence = new Map();

const TOPIC_TTL_MS = 1000 * 60 * 60 * 24;
const createdTopics = new Map();

const EMOTIONS = [
  "ansiedad",
  "duda",
  "soledad",
  "frustracion",
  "cansancio",
  "neutral",
  "positivo",
  "dolor_fisico",
];

const COUNTRY_CATALOG = [
  { code: "AR", label: "Argentina", flag: "🇦🇷" },
  { code: "MX", label: "México", flag: "🇲🇽" },
  { code: "CO", label: "Colombia", flag: "🇨🇴" },
  { code: "ES", label: "España", flag: "🇪🇸" },
  { code: "US", label: "Estados Unidos", flag: "🇺🇸" },
  { code: "BR", label: "Brasil", flag: "🇧🇷" },
  { code: "CL", label: "Chile", flag: "🇨🇱" },
  { code: "PE", label: "Perú", flag: "🇵🇪" },
  { code: "FR", label: "Francia", flag: "🇫🇷" },
  { code: "JP", label: "Japón", flag: "🇯🇵" },
];

function parseClientIP(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  const raw = forwarded || req.socket?.remoteAddress || "";
  return raw.replace(/^::ffff:/, "");
}

function hashStringToInt(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pickCountryDeterministic(ip) {
  const idx = hashStringToInt(ip) % COUNTRY_CATALOG.length;
  return COUNTRY_CATALOG[idx];
}

function pickCountryRandom() {
  return COUNTRY_CATALOG[Math.floor(Math.random() * COUNTRY_CATALOG.length)];
}

function looksPrivateIP(ip) {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.")
  );
}

function getCountryFromIP(ip) {
  if (!ip || looksPrivateIP(ip)) {
    return pickCountryRandom();
  }
  return pickCountryDeterministic(ip);
}

function pickCountryWithControlledNoise(ip) {
  const real = getCountryFromIP(ip);
  if (Math.random() < 0.1) {
    const noisy = pickCountryRandom();
    return noisy.code === real.code ? pickCountryRandom() : noisy;
  }
  return real;
}

function calculateSyncLevel(input, bestMatch) {
  const score = Number(bestMatch?.score || 0);
  const overlap = Number(bestMatch?.overlap || 0);
  const exactWordRatio = input.tokens.length ? overlap / input.tokens.length : 0;
  const createdAt = bestMatch?.created_at ? new Date(bestMatch.created_at).getTime() : null;
  const timeDiffMs = createdAt ? Math.max(0, Date.now() - createdAt) : null;

  const closeInTime = timeDiffMs != null && timeDiffMs <= 45_000;
  const veryCloseInTime = timeDiffMs != null && timeDiffMs <= 12_000;

  if (score >= 0.92 && exactWordRatio >= 0.85 && veryCloseInTime) {
    return { tier: "EPICO", message: "⚡ MATCH CASI PERFECTO", timeDiffMs };
  }
  if (score >= 0.78 && exactWordRatio >= 0.6 && closeInTime) {
    return { tier: "ORO", message: "Sincronía fuerte detectada", timeDiffMs };
  }
  if (score >= 0.55) {
    return { tier: "PLATA", message: "Varias mentes en la misma línea", timeDiffMs };
  }
  return { tier: "BRONCE", message: "Coincidencia lejana detectada", timeDiffMs };
}

function describeConnection(syncLevel, inputCountry, bestMatchCountry) {
  const seconds = syncLevel.timeDiffMs != null ? Math.max(1, Math.round(syncLevel.timeDiffMs / 1000)) : null;
  const timeLine = seconds ? `Alguien pensó esto hace ${seconds} segundos.` : "Esto está ocurriendo ahora.";
  const placeLine =
    inputCountry && bestMatchCountry && inputCountry.code !== bestMatchCountry.code
      ? "2 personas en distintos lugares coincidieron contigo."
      : "Esto está ocurriendo ahora.";
  if (syncLevel.tier === "EPICO" || syncLevel.tier === "ORO") {
    return `${timeLine} ${placeLine}`;
  }
  return timeLine;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function computeTokenSimilarity(aTokens, bTokens) {
  const a = Array.isArray(aTokens) ? aTokens : [];
  const b = Array.isArray(bTokens) ? bTokens : [];
  if (!a.length || !b.length) {
    return 0;
  }
  const aSet = new Set(a);
  const bSet = new Set(b);
  let intersection = 0;
  for (const t of aSet) {
    if (bSet.has(t)) intersection += 1;
  }
  const union = new Set([...aSet, ...bSet]).size;
  return union ? intersection / union : 0;
}

function computeMatchScore({ similarity, emotionMatch, intentMatch }) {
  const base = 0.7 * similarity + 0.2 * (emotionMatch ? 1 : 0) + 0.1 * (intentMatch ? 1 : 0);
  return Number(clamp01(base).toFixed(3));
}

function scoreMatch({ overlap, emotion, intent }, input) {
  const similarity = Number(overlap) / Math.max(1, input.tokens.length);
  const emotionMatch = Boolean(emotion && input.emotion && emotion === input.emotion);
  const intentMatch = Boolean(intent && input.intent && intent === input.intent);
  const score = computeMatchScore({ similarity, emotionMatch, intentMatch });
  return { score, similarity, emotionMatch, intentMatch };
}

function generateInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function cleanupInvites(nowMs) {
  for (const [code, invite] of invites.entries()) {
    if (!invite || nowMs - invite.createdAt > INVITES_TTL_MS) {
      invites.delete(code);
    }
  }
}

function cleanupPresence(nowMs) {
  for (const [clientId, lastSeenAt] of presence.entries()) {
    if (!lastSeenAt || nowMs - lastSeenAt > PRESENCE_TTL_MS) {
      presence.delete(clientId);
    }
  }
}

const STOPWORDS = new Set([
  "a", "al", "algo", "algun", "alguna", "algunas", "algunos", "ante", "como", "con",
  "contra", "cual", "cuando", "de", "del", "desde", "donde", "el", "ella", "ellas",
  "ellos", "en", "entre", "era", "eramos", "es", "esa", "esas", "ese", "eso", "esos",
  "esta", "estaba", "estaban", "estado", "estamos", "estan", "estar", "estas", "este",
  "esto", "estos", "fue", "ha", "han", "hasta", "hay", "la", "las", "le", "les", "lo",
  "los", "mas", "me", "mi", "mis", "mucho", "muy", "no", "nos", "nosotros", "nuestra",
  "nuestro", "o", "os", "para", "pero", "poco", "por", "porque", "que", "quien", "se",
  "si", "sin", "sobre", "son", "su", "sus", "tambien", "te", "tengo", "tenia", "ti",
  "tiene", "tienen", "todo", "tu", "un", "una", "uno", "unos", "y", "ya", "yo",
]);

const emotionKeywords = {
  ansiedad: ["miedo", "ansiedad", "nervioso", "preocupa", "fracaso", "inquieto", "panico"],
  duda: ["no se", "quizas", "tal vez", "indeciso", "confundido", "perdido", "direccion"],
  soledad: ["solo", "soledad", "nadie", "vacio", "aislado", "desconectado", "desaparecer"],
  frustracion: ["odio", "rabia", "harto", "mal", "insoportable", "bloqueado", "fallando", "no aguanto"],
  cansancio: ["cansado", "agotado", "sin energia", "no doy mas", "dormir", "fatiga"],
  neutral: ["normal", "ok", "bien", "tranquilo", "sin novedades", "estable"],
  positivo: ["feliz", "hermosa", "genial", "imparable", "agradecido", "motivado", "esperanza"],
  dolor_fisico: ["me duele", "dolor", "punzada", "migraña", "contractura", "lastima"],
};

const seedThoughts = [
  {
    text: "no sé qué hacer con mi vida",
    emotion: "duda",
    intensity: 0.8,
    baseCount: 1237,
    variants: ["me siento perdido", "no tengo dirección", "no sé para dónde voy"],
  },
  {
    text: "estoy cansado de todo",
    emotion: "cansancio",
    intensity: 0.85,
    baseCount: 1184,
    variants: ["ya no doy más", "todo me pesa", "no tengo energía para nada"],
  },
  {
    text: "quiero desaparecer un rato",
    emotion: "soledad",
    intensity: 0.9,
    baseCount: 973,
    variants: ["necesito apagarme", "quiero silencio total", "quiero irme lejos"],
  },
  {
    text: "siento que algo no encaja",
    emotion: "duda",
    intensity: 0.75,
    baseCount: 864,
    variants: ["hay algo fuera de lugar", "nada termina de sentirse bien", "no encajo"],
  },
  {
    text: "todo me está saliendo mal hoy",
    emotion: "frustracion",
    intensity: 0.78,
    baseCount: 742,
    variants: ["hoy nada funciona", "todo sale al revés", "estoy bloqueado todo el día"],
  },
  {
    text: "tengo una idea que no me deja dormir",
    emotion: "positivo",
    intensity: 0.7,
    baseCount: 519,
    variants: ["mi cabeza va a mil", "necesito crear algo", "quiero construir esto ya"],
  },
  {
    text: "siento que hoy puede ser un gran día",
    emotion: "positivo",
    intensity: 0.62,
    baseCount: 468,
    variants: ["me siento imparable", "hoy estoy encendido", "todo puede salir bien"],
  },
  {
    text: "y si todo sale mal",
    emotion: "ansiedad",
    intensity: 0.86,
    baseCount: 1006,
    variants: ["me preocupa equivocarme", "siento miedo del futuro", "y si fracaso"],
  },
  {
    text: "no puedo apagar la mente",
    emotion: "ansiedad",
    intensity: 0.83,
    baseCount: 913,
    variants: ["mi cabeza no descansa", "pienso demasiado", "no logro calmarme"],
  },
  {
    text: "necesito un cambio",
    emotion: "duda",
    intensity: 0.71,
    baseCount: 807,
    variants: ["quiero empezar de nuevo", "así no puedo seguir", "quiero moverme de lugar"],
  },
];

const allThoughtCandidates = seedThoughts.flatMap((seed) => {
  const variants = seed.variants.map((variant) => ({
    text: variant,
    emotion: seed.emotion,
    intensity: Math.max(0.4, seed.intensity - 0.08),
    baseCount: Math.max(90, Math.floor(seed.baseCount * 0.45)),
  }));

  return [
    {
      text: seed.text,
      emotion: seed.emotion,
      intensity: seed.intensity,
      baseCount: seed.baseCount,
    },
    ...variants,
  ];
});

const userThoughts = [];

function detectIntent(text) {
  const t = normalizeText(text);

  if (/jaja|xd|lol|jeje/.test(t)) return "humor";
  if (/puta|weon|culiao|pico|mierda/.test(t)) return "provocacion";

  if (
    /quiero|voy a|necesito|tengo que|debo|har[eé]/.test(t) ||
    /renunciar|dejar|terminar|cambiar|empezar/.test(t)
  ) {
    return "accion";
  }

  if (/amor|te quiero|te amo|hermoso|hermosa|beso|abrazo/.test(t)) return "afecto";

  if (t.length < 12) return "absurdo";

  if (/vida|muerte|sentido|existencia|existir|universo|dios|nada/.test(t)) return "existencial";

  if (/estoy harto|no aguanto|me duele|me pesa|no puedo|ya no doy/.test(t)) return "desahogo";

  return "reflexion";
}

async function ensureThoughtsSchema() {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS thoughts (id SERIAL PRIMARY KEY, text TEXT NOT NULL, emotion TEXT, intent TEXT, tokens TEXT[], country_code TEXT, created_at TIMESTAMPTZ DEFAULT NOW());"
  );
  await pool.query("ALTER TABLE thoughts ADD COLUMN IF NOT EXISTS emotion TEXT;");
  await pool.query("ALTER TABLE thoughts ADD COLUMN IF NOT EXISTS intent TEXT;");
  await pool.query("ALTER TABLE thoughts ADD COLUMN IF NOT EXISTS tokens TEXT[];");
  await pool.query("ALTER TABLE thoughts ADD COLUMN IF NOT EXISTS country_code TEXT;");
  await pool.query("ALTER TABLE thoughts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ;");
}

async function saveThought(text, emotion, intent, tokens, countryCode) {
  await pool.query(
    "INSERT INTO thoughts (text, emotion, intent, tokens, country_code) VALUES ($1, $2, $3, $4, $5)",
    [text, emotion, intent, tokens, countryCode || null]
  );
}

async function insertThought(text) {
  const tokens = tokenize(text);
  const emotion = classifyEmotion(text);
  const intent = detectIntent(text);
  const country = pickCountryRandom();
  const result = await pool.query(
    "INSERT INTO thoughts (text, emotion, intent, tokens, country_code) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [text, emotion, intent, tokens, country.code]
  );
  return result.rows[0];
}

async function getRealMatches(tokens) {
  const result = await pool.query(
    `
    SELECT text, emotion, intent, tokens, country_code, created_at,
    (
      SELECT COUNT(*)
      FROM unnest(tokens) t
      WHERE t = ANY($1)
    ) as overlap
    FROM thoughts
    ORDER BY overlap DESC
    LIMIT 10;
    `,
    [tokens]
  );

  return result.rows;
}

function countMatches(matches) {
  return matches.filter((m) => m.overlap > 0).length;
}

function normalizeText(value) {
  const normalizedEnyeSafe = value
    .replace(/ñ/g, "__enie__")
    .replace(/Ñ/g, "__enie__");

  return normalizedEnyeSafe
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/__enie__/g, "ñ");
}

function tokenize(value) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function overlapScore(aTokens, bTokens) {
  if (!aTokens.length || !bTokens.length) {
    return 0;
  }

  const bSet = new Set(bTokens);
  let common = 0;
  for (const token of aTokens) {
    if (bSet.has(token)) {
      common += 1;
    }
  }

  return common / Math.max(aTokens.length, bTokens.length);
}

function detectByRules(text) {
  const normalized = normalizeText(text);

  if (
    normalized.includes("me duele") ||
    normalized.includes("dolor") ||
    normalized.includes("punzada")
  ) {
    return "dolor_fisico";
  }

  if (normalized.includes("cansado") || normalized.includes("agotado") || normalized.includes("sin energia")) {
    return "cansancio";
  }

  if (normalized.includes("feliz") || normalized.includes("hermosa") || normalized.includes("genial")) {
    return "positivo";
  }

  if (normalized.includes("estoy solo") || normalized.includes("nadie me entiende")) {
    return "soledad";
  }

  return null;
}

function detectByKeywords(text) {
  const normalized = normalizeText(text);
  const scores = {};

  for (const emotion of EMOTIONS) {
    scores[emotion] = 0;
    const keywords = emotionKeywords[emotion] || [];
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        scores[emotion] += keyword.includes(" ") ? 2 : 1;
      }
    }
  }

  let winner = "neutral";
  let winnerScore = scores.neutral || 0;

  for (const emotion of EMOTIONS) {
    if (scores[emotion] > winnerScore) {
      winner = emotion;
      winnerScore = scores[emotion];
    }
  }

  return { emotion: winner, score: winnerScore };
}

function detectBySemanticFallback(text) {
  const tokens = tokenize(text);
  if (!tokens.length) {
    return "neutral";
  }

  const emotionSimilarity = {};
  for (const emotion of EMOTIONS) {
    emotionSimilarity[emotion] = 0;
  }

  for (const token of tokens) {
    for (const emotion of EMOTIONS) {
      const keywords = emotionKeywords[emotion] || [];
      for (const keyword of keywords) {
        const keywordTokens = tokenize(keyword);
        const similarity = overlapScore([token], keywordTokens);
        emotionSimilarity[emotion] += similarity;
      }
    }
  }

  let bestEmotion = "neutral";
  let bestScore = 0;
  for (const emotion of EMOTIONS) {
    if (emotionSimilarity[emotion] > bestScore) {
      bestEmotion = emotion;
      bestScore = emotionSimilarity[emotion];
    }
  }

  if (bestScore <= 0) {
    return "neutral";
  }

  return bestEmotion;
}

function classifyEmotion(text) {
  const byRules = detectByRules(text);
  if (byRules) {
    return byRules;
  }

  const byKeywords = detectByKeywords(text);
  if (byKeywords.emotion !== "neutral" || byKeywords.score > 0) {
    return byKeywords.emotion;
  }

  return detectBySemanticFallback(text);
}

function jitterCount(base) {
  const factor = 0.9 + Math.random() * 0.2;
  return Math.max(1, Math.floor(base * factor));
}

function getSimilarThoughts(input) {
  const inputTokens = tokenize(input);

  const enrichedCandidates = allThoughtCandidates.map((candidate) => {
    const score = overlapScore(inputTokens, tokenize(candidate.text));
    return {
      ...candidate,
      score,
    };
  });

  const strongest = enrichedCandidates
    .sort((a, b) => b.score - a.score || b.baseCount - a.baseCount)
    .slice(0, 3)
    .map((item) => ({
      text: item.text,
      emotion: item.emotion,
      score: Number(item.score.toFixed(3)),
    }));

  return strongest.length === 3
    ? strongest
    : allThoughtCandidates
        .sort((a, b) => b.baseCount - a.baseCount)
        .slice(0, 3)
        .map((item) => ({ text: item.text, emotion: item.emotion, score: 0 }));
}

function computeApproxCount(input, similar) {
  const tokens = tokenize(input);
  const tokenBonus = Math.max(0, tokens.length - 2) * 12;
  const similarityBoost = similar.reduce((sum, t) => sum + Math.floor(t.score * 240), 0);
  const seedBaseline = 220;
  return jitterCount(seedBaseline + tokenBonus + similarityBoost);
}

function getRecentFeed() {
  const seedFeed = allThoughtCandidates
    .slice()
    .sort((a, b) => b.baseCount - a.baseCount)
    .slice(0, 12)
    .map((item) => ({
      text: item.text,
      emotion: item.emotion,
      matches: jitterCount(item.baseCount),
      source: "seed",
    }));

  const realFeed = userThoughts
    .slice(-20)
    .reverse()
    .map((item) => ({
      text: item.text,
      emotion: item.emotion,
      matches: jitterCount(60 + item.tokens.length * 10),
      source: "real",
    }));

  return [...realFeed, ...seedFeed].slice(0, 20);
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

function serveStatic(req, res) {
  const parsed = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsed.pathname === "/" ? "/index.html" : parsed.pathname;

  if (pathname === "/syncLevel.js") {
    const rootSyncLevel = path.join(__dirname, "syncLevel.js");
    fs.readFile(rootSyncLevel, (err, data) => {
      if (err) {
        sendJson(res, 404, { error: "Not found" });
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/javascript; charset=utf-8",
      });
      res.end(data);
    });
    return;
  }

  const filePath = path.join(PUBLIC_DIR, pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    const extension = path.extname(filePath);
    const contentTypeMap = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
    };

    res.writeHead(200, {
      "Content-Type": contentTypeMap[extension] || "application/octet-stream",
    });
    res.end(data);
  });
}

async function handleSync(req, res) {
  let rawBody = "";

  req.on("data", (chunk) => {
    rawBody += chunk;
  });

  req.on("end", async () => {
    try {
      await ensureThoughtsSchema();
      const body = JSON.parse(rawBody || "{}");
      const input = typeof body.text === "string" ? body.text : "";
      const topic = typeof body.topic === "string" ? body.topic : "";

      if (!input || input.length < 4) {
        return sendJson(res, 400, { error: "Texto muy corto" });
      }

      const tokens = tokenize(input);
      const emotion = classifyEmotion(input);
      const intent = detectIntent(input);
      const ip = parseClientIP(req);
      const inputCountry = pickCountryWithControlledNoise(ip);

      await saveThought(input, emotion, intent, tokens, inputCountry.code);

      const matches = await getRealMatches(tokens);
      const inputMeta = { tokens, emotion, intent };
      const scoredMatches = matches.map((m) => ({
        ...m,
        ...scoreMatch(m, inputMeta),
      }));
      scoredMatches.sort((a, b) => b.score - a.score || b.overlap - a.overlap);
      const realCount = scoredMatches.filter((m) => m.overlap > 0).length;
      const bestMatch = scoredMatches.find((m) => m.overlap > 0) || null;
      const bestMatchCountry = bestMatch?.country_code
        ? COUNTRY_CATALOG.find((c) => c.code === bestMatch.country_code) || null
        : null;
      const syncLevel = calculateSyncLevel(inputMeta, bestMatch);
      const connectionLine = describeConnection(syncLevel, inputCountry, bestMatchCountry);

      const similarThoughts = scoredMatches
        .filter((m) => m.overlap > 0)
        .slice(0, 3)
        .map((m) => ({
          text: m.text,
          emotion: m.emotion,
          intent: m.intent,
          country: m.country_code || null,
          score: m.score,
        }));

      return sendJson(res, 200, {
        emotion,
        intent,
        country: inputCountry.code,
        topic: topic || null,
        syncLevel,
        connectionLine,
        approxTodayCount: realCount,
        similarThoughts,
        recentFeed: scoredMatches.slice(0, 10).map((m) => ({
          text: m.text,
          emotion: m.emotion,
          intent: m.intent,
          country: m.country_code || null,
          matches: m.overlap,
          score: m.score,
        })),
      });
    } catch (err) {
      return sendJson(res, 500, { error: "Error interno." });
    }
  });
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/sync") {
    handleSync(req, res);
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/topics") {
    sendJson(res, 200, { topics: TOPICS });
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/presence") {
    const clientId = (parsed.searchParams.get("clientId") || "").slice(0, 80);
    const now = Date.now();
    cleanupPresence(now);
    if (clientId) {
      presence.set(clientId, now);
    }
    sendJson(res, 200, { activeUsers: presence.size });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/topic") {
    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk;
    });
    req.on("end", async () => {
      try {
        const body = JSON.parse(rawBody || "{}");
        const topic = typeof body.topic === "string" ? body.topic.trim() : "";
        if (!topic || topic.length < 3) {
          sendJson(res, 400, { error: "Tópico inválido." });
          return;
        }
        const topicId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        const shareCode = `SYN-${Math.floor(1000 + Math.random() * 9000)}`;
        createdTopics.set(topicId, { topicId, topic, shareCode, createdAt: Date.now() });
        sendJson(res, 200, { topicId, shareCode });
      } catch (error) {
        console.error(error);
        sendJson(res, 500, { error: "Error interno." });
      }
    });
    return;
  }

  if (req.method === "GET" && parsed.pathname.startsWith("/topic/")) {
    const topicId = parsed.pathname.split("/")[2] || "";
    const entry = createdTopics.get(topicId);
    if (!entry || Date.now() - entry.createdAt > TOPIC_TTL_MS) {
      sendJson(res, 404, { error: "Tópico no encontrado." });
      return;
    }
    sendJson(res, 200, { topicId: entry.topicId, topic: entry.topic, shareCode: entry.shareCode, thoughts: [] });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/invite") {
    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk;
    });
    req.on("end", async () => {
      try {
        cleanupInvites(Date.now());
        const body = JSON.parse(rawBody || "{}");
        const text = typeof body.text === "string" ? body.text.trim() : "";
        const topic = typeof body.topic === "string" ? body.topic.trim() : "";
        if (!text || text.length < 3) {
          sendJson(res, 400, { error: "Texto inválido." });
          return;
        }

        const tokens = tokenize(text);
        const emotion = classifyEmotion(text);
        const intent = detectIntent(text);

        let code = generateInviteCode();
        while (invites.has(code)) {
          code = generateInviteCode();
        }

        invites.set(code, {
          code,
          text,
          topic: topic || null,
          tokens,
          emotion,
          intent,
          createdAt: Date.now(),
        });

        sendJson(res, 200, {
          code,
          emotion,
          intent,
          topic: topic || null,
          expiresInSec: Math.floor(INVITES_TTL_MS / 1000),
        });
      } catch (error) {
        console.error(error);
        sendJson(res, 500, { error: "Error interno." });
      }
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/compare") {
    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk;
    });
    req.on("end", async () => {
      try {
        cleanupInvites(Date.now());
        const body = JSON.parse(rawBody || "{}");
        const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
        const text = typeof body.text === "string" ? body.text.trim() : "";

        if (!code) {
          sendJson(res, 400, { error: "Falta code." });
          return;
        }

        const invite = invites.get(code);
        if (!invite) {
          sendJson(res, 404, { error: "Código inválido o expirado." });
          return;
        }

        if (!text || text.length < 3) {
          sendJson(res, 400, { error: "Texto inválido." });
          return;
        }

        const tokens = tokenize(text);
        const emotion = classifyEmotion(text);
        const intent = detectIntent(text);
        const similarity = computeTokenSimilarity(invite.tokens, tokens);
        const emotionMatch = invite.emotion === emotion;
        const intentMatch = invite.intent === intent;
        const matchScore = computeMatchScore({ similarity, emotionMatch, intentMatch });

        sendJson(res, 200, {
          code,
          matchScore,
          emotion: { a: invite.emotion, b: emotion, match: emotionMatch },
          intent: { a: invite.intent, b: intent, match: intentMatch },
          similarity,
          topic: invite.topic,
        });
      } catch (error) {
        console.error(error);
        sendJson(res, 500, { error: "Error interno." });
      }
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/thoughts") {
    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk;
    });
    req.on("end", async () => {
      try {
        const body = JSON.parse(rawBody || "{}");
        const text = typeof body.text === "string" ? body.text.trim() : "";
        if (!text) {
          sendJson(res, 400, { error: "El campo text es obligatorio." });
          return;
        }
        const row = await insertThought(text);
        sendJson(res, 200, row);
      } catch (error) {
        console.error(error);
        sendJson(res, 500, { error: "Error guardando." });
      }
    });
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      service: "synchro-mvp",
      seedCandidates: allThoughtCandidates.length,
      savedThoughts: userThoughts.length,
    });
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/test-db") {
    pool
      .query("SELECT NOW()")
      .then((result) => {
        sendJson(res, 200, result.rows);
      })
      .catch((error) => {
        console.error(error);
        sendJson(res, 500, { error: "Error conectando a la DB" });
      });
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  sendJson(res, 404, { error: "Ruta no encontrada." });
});

server.listen(PORT, () => {
  console.log(`SYNCHRO MVP running on http://localhost:${PORT}`);
});
