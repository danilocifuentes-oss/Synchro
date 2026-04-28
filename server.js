const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const pool = require("./db");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

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

async function saveThought(text, emotion, tokens) {
  await pool.query(
    "INSERT INTO thoughts (text, emotion, tokens) VALUES ($1, $2, $3)",
    [text, emotion, tokens]
  );
}

async function insertThought(text) {
  const tokens = tokenize(text);
  const emotion = classifyEmotion(text);
  const result = await pool.query(
    "INSERT INTO thoughts (text, emotion, tokens) VALUES ($1, $2, $3) RETURNING *",
    [text, emotion, tokens]
  );
  return result.rows[0];
}

async function getRealMatches(tokens) {
  const result = await pool.query(
    `
    SELECT text, emotion, tokens,
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
      const body = JSON.parse(rawBody);
      const input = body.text;

      if (!input || input.length < 4) {
        return sendJson(res, 400, { error: "Texto muy corto" });
      }

      const tokens = tokenize(input);
      const emotion = classifyEmotion(input);

      await saveThought(input, emotion, tokens);

      const matches = await getRealMatches(tokens);
      const realCount = countMatches(matches);

      const similarThoughts = matches
        .filter((m) => m.overlap > 0)
        .slice(0, 3)
        .map((m) => ({
          text: m.text,
          emotion: m.emotion,
          score: m.overlap,
        }));

      return sendJson(res, 200, {
        emotion,
        approxTodayCount: realCount,
        similarThoughts,
        recentFeed: matches.slice(0, 10).map((m) => ({
          text: m.text,
          emotion: m.emotion,
          matches: m.overlap,
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
