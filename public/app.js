// =============================================================================
// DOM
// =============================================================================
const thoughtInput = document.getElementById("thoughtInput");
const syncButton = document.getElementById("syncButton");
const statusEl = document.getElementById("status");
const localClock = document.getElementById("localClock");
const activeUsersLine = document.getElementById("activeUsersLine");
const topicLine = document.getElementById("topicLine");
const resultPanel = document.getElementById("resultPanel");
const syncLevelBadge = document.getElementById("syncLevelBadge");
const connectionLine = document.getElementById("connectionLine");
const perfectMatchBanner = document.getElementById("perfectMatchBanner");
const perfectMatchMeta = document.getElementById("perfectMatchMeta");
const submittedThoughtLine = document.getElementById("submittedThoughtLine");
const countLine = document.getElementById("countLine");
const emotionLine = document.getElementById("emotionLine");
const profilePanel = document.getElementById("profilePanel");
const profileTextEl = document.getElementById("profileText");
const profileConfidenceLine = document.getElementById("profileConfidenceLine");
const similarCountLine = document.getElementById("similarCountLine");
const similarList = document.getElementById("similarList");
const feedList = document.getElementById("feedList");
const resonanceLine = document.getElementById("resonanceLine");
const resonanceFill = document.getElementById("resonanceFill");
const stateLine = document.getElementById("stateLine");
const rankingLine = document.getElementById("rankingLine");
const profileLine = document.getElementById("profileLine");
const insightLine = document.getElementById("insightLine");
const predictionLine = document.getElementById("predictionLine");
const worldNowList = document.getElementById("worldNowList");
const worldEventLine = document.getElementById("worldEventLine");
const shareResultBtn = document.getElementById("shareResultBtn");
const shareFeedback = document.getElementById("shareFeedback");
const newTopicInput = document.getElementById("newTopicInput");
const createTopicBtn = document.getElementById("createTopicBtn");
const topicShareResult = document.getElementById("topicShareResult");
const copyTopicCodeBtn = document.getElementById("copyTopicCodeBtn");

// =============================================================================
// Constants
// =============================================================================
const EMOTION_EMOJIS = {
  ansiedad: "😰",
  duda: "🤔",
  soledad: "🫥",
  frustracion: "😤",
  cansancio: "😮‍💨",
  neutral: "🙂",
  positivo: "✨",
  dolor_fisico: "🤕",
};

const fallbackFeed = [
  { text: "necesito un cambio", emotion: "duda", matches: 807 },
  { text: "no puedo apagar la mente", emotion: "ansiedad", matches: 913 },
  { text: "hoy nada funciona", emotion: "frustracion", matches: 742 },
];

const STATES = [
  { name: "Observador", threshold: 0 },
  { name: "Receptor", threshold: 250 },
  { name: "Sintonizado", threshold: 650 },
  { name: "Amplificador", threshold: 1200 },
  { name: "Nodo", threshold: 2000 },
  { name: "Eco", threshold: 3200 },
];

const WORLD_THOUGHTS = [
  "quiero empezar de nuevo",
  "necesito dormir mejor",
  "me cuesta decidir",
  "algo grande está por cambiar",
  "siento ruido mental",
  "hoy quiero salir de la rutina",
  "quiero conectar con alguien",
  "estoy pensando en renunciar",
];

const EMOTION_INTERPRETATION = {
  ansiedad: "Tu mente está anticipando escenarios posibles.",
  duda: "Estás evaluando caminos antes de decidir.",
  soledad: "Tu sistema está pidiendo conexión o refugio.",
  frustracion: "Algo no está funcionando como esperabas.",
  cansancio: "Tu cuerpo y mente están pidiendo pausa.",
  positivo: "Estás en un estado de expansión.",
  neutral: "Estás en fase de observación y balance.",
  dolor_fisico: "Tu foco mental se mezcla con sensaciones corporales.",
};

const HISTORY_KEY = "synchro_history";
const PROFILE_KEY = "synchro_profile";
const RESONANCE_KEY = "synchro_resonance";

const UNIQUE_MESSAGES = [
  "Hoy eres el único pensando en esto.",
  "Idea singular detectada: hoy nadie más la expresó igual.",
  "Pensamiento único por ahora. Sigue explorando esa línea.",
];

const INTERNATIONAL_SOURCES = [
  { code: "AR", flag: "🇦🇷", label: "Argentina" },
  { code: "MX", flag: "🇲🇽", label: "México" },
  { code: "CO", flag: "🇨🇴", label: "Colombia" },
  { code: "ES", flag: "🇪🇸", label: "España" },
  { code: "US", flag: "🇺🇸", label: "Estados Unidos" },
  { code: "BR", flag: "🇧🇷", label: "Brasil" },
  { code: "CL", flag: "🇨🇱", label: "Chile" },
  { code: "PE", flag: "🇵🇪", label: "Perú" },
  { code: "FR", flag: "🇫🇷", label: "Francia" },
  { code: "JP", flag: "🇯🇵", label: "Japón" },
];

const NEXT_PROMPTS = [
  "¿Solo tú lo estás pensando?",
  "¿Qué idea no has dicho en voz alta hoy?",
  "¿Qué pensamiento vuelve una y otra vez?",
  "¿Hay algo raro que no puedes sacarte de la cabeza?",
  "¿Qué intuición te está siguiendo hoy?",
  "¿Qué verdad te cuesta admitir ahora mismo?",
  "¿Qué emoción no has nombrado todavía?",
  "¿Qué pregunta te persigue hoy?",
];

const WORLD_REFRESH_MS = 4800;

// =============================================================================
// State
// =============================================================================
let cascadeTimer = null;
let cascadePool = [];
let cascadeIndex = 0;
let celebrationTimer = null;
let profileHistory = JSON.parse(localStorage.getItem("profileHistory") || "[]");
let worldNowTimer = null;
let shareFeedbackTimer = null;
let worldRefreshToken = 0;
let worldRefreshTimeout = null;
let lastSynchroMessage = "";
let currentTopic = "";
let lastSyncTier = "";
/** @type {null | { thought: string; countText: string; emotionText: string; similarText: string; profileText: string }} */
let lastShareSnapshot = null;

// =============================================================================
// Helpers
// =============================================================================
function readNumberStorage(key) {
  const parsed = Number(localStorage.getItem(key) || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getEmotionEmoji(emotion) {
  return EMOTION_EMOJIS[emotion] || "💭";
}

function pickNextPrompt() {
  return NEXT_PROMPTS[Math.floor(Math.random() * NEXT_PROMPTS.length)];
}

function getOrCreateClientId() {
  const key = "synchro_client_id";
  const existing = localStorage.getItem(key);
  if (existing) {
    return existing;
  }
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(key, id);
  return id;
}

function formatLocalClock(d = new Date()) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function refreshPresence() {
  if (!activeUsersLine) return;
  try {
    const clientId = getOrCreateClientId();
    const res = await fetch(`/api/presence?clientId=${encodeURIComponent(clientId)}`);
    const payload = await res.json();
    if (res.ok && typeof payload.activeUsers === "number") {
      activeUsersLine.textContent = `${payload.activeUsers} activos ahora`;
    }
  } catch {
    // ignore presence errors
  }
}

async function loadTopic() {
  if (!topicLine) return;
  try {
    const res = await fetch("/api/topics");
    const payload = await res.json();
    const topics = Array.isArray(payload.topics) ? payload.topics : [];
    if (res.ok && topics.length) {
      currentTopic = topics[Math.floor(Math.random() * topics.length)];
      topicLine.textContent = `Tópico: ${currentTopic}`;
    } else {
      currentTopic = "";
      topicLine.textContent = "";
    }
  } catch {
    currentTopic = "";
    topicLine.textContent = "";
  }
}

function getCurrentState(resonance) {
  let current = STATES[0];
  for (const state of STATES) {
    if (resonance >= state.threshold) {
      current = state;
    }
  }
  return current;
}

function getNextState(resonance) {
  for (const state of STATES) {
    if (resonance < state.threshold) {
      return state;
    }
  }
  return null;
}

function getResonanceGain(fakeCount, similarCount) {
  return Math.floor(fakeCount * 0.1 + similarCount * 5);
}

function updateResonance(fakeCount, similarCount) {
  const current = readNumberStorage(RESONANCE_KEY);
  const gain = getResonanceGain(fakeCount, similarCount);
  const updated = current + gain;
  localStorage.setItem(RESONANCE_KEY, String(updated));
  return { gain, updated };
}

function updateProfile(emotion) {
  const profile = readJsonStorage(PROFILE_KEY, {});
  profile[emotion] = (profile[emotion] || 0) + 1;
  writeJsonStorage(PROFILE_KEY, profile);
  return profile;
}

function updateHistory(entry) {
  const history = readJsonStorage(HISTORY_KEY, []);
  history.push(entry);
  const capped = history.slice(-80);
  writeJsonStorage(HISTORY_KEY, capped);
  return capped;
}

function getTopEmotion(profile) {
  let winner = "neutral";
  let max = 0;
  for (const [emotion, count] of Object.entries(profile)) {
    if (count > max) {
      max = count;
      winner = emotion;
    }
  }
  return winner;
}

// =============================================================================
// Profile logic
// =============================================================================
function updateProfileHistory(emotion) {
  profileHistory.push(emotion);
  if (profileHistory.length > 30) {
    profileHistory.shift();
  }
  localStorage.setItem("profileHistory", JSON.stringify(profileHistory));
}

function getEmotionalClimate(history) {
  const map = {
    ansiedad: "tensión",
    frustracion: "tensión",
    duda: "búsqueda",
    positivo: "conexión",
    neutral: "calma",
    cansancio: "fatiga",
    soledad: "desconexión",
    dolor_fisico: "fatiga",
  };
  const counts = {};
  for (const emotion of history) {
    const climate = map[emotion] || "calma";
    counts[climate] = (counts[climate] || 0) + 1;
  }
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), "calma");
}

function getMentalEnergy(history) {
  const high = history.filter((emotion) => emotion === "positivo").length;
  const low = history.filter((emotion) => emotion === "cansancio" || emotion === "dolor_fisico").length;
  if (high > low && high > 2) {
    return "alta";
  }
  if (low > high) {
    return "baja";
  }
  return "media";
}

function getCognitiveStyle(history) {
  const map = {
    ansiedad: "rumiativo",
    duda: "analítico",
    positivo: "creativo",
    neutral: "observador",
    frustracion: "reactivo",
    cansancio: "práctico",
    soledad: "introspectivo",
    dolor_fisico: "práctico",
  };
  const scores = {};
  for (const emotion of history) {
    const style = map[emotion];
    if (style) {
      scores[style] = (scores[style] || 0) + 1;
    }
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 2).map((entry) => entry[0]).join("-") || "observador";
}

function getMentalRhythm(history) {
  const unique = new Set(history.slice(-5)).size;
  if (unique >= 4) {
    return "oscilante";
  }
  if (unique === 1) {
    return "estático";
  }
  if (unique === 2) {
    return "cíclico";
  }
  return "expansivo";
}

function getCurrentPsychState(history) {
  const last = history.slice(-3);
  if (last.includes("duda") && last.includes("positivo")) {
    return "exploración";
  }
  if (last.includes("cansancio") || last.includes("dolor_fisico")) {
    return "pausa";
  }
  if (last.includes("ansiedad")) {
    return "activación";
  }
  return "estabilidad";
}

function getProfileConfidence(history) {
  const n = history.length;
  if (n < 3) {
    return "baja";
  }
  if (n < 8) {
    return "media";
  }
  return "alta";
}

function generateProfileText(history) {
  const confidence = getProfileConfidence(history);

  if (confidence === "baja") {
    return "Aún estamos conociendo tu patrón mental. Escribe un poco más para detectar patrones reales.";
  }

  const climate = getEmotionalClimate(history);
  const energy = getMentalEnergy(history);
  const style = getCognitiveStyle(history);
  const rhythm = getMentalRhythm(history);
  const state = getCurrentPsychState(history);

  if (confidence === "media") {
    return `Empieza a aparecer un patrón: tendencia a ${climate}, energía ${energy}, estilo ${style}. Aún puede cambiar.`;
  }

  return `Tu mente se mueve en un clima de ${climate}. Energía ${energy}. Estilo ${style}. Ritmo ${rhythm}. Estado actual: ${state}.`;
}

function detectIntent(text) {
  const t = String(text || "").toLowerCase();

  if (/jaja|xd|lol|jeje/.test(t)) {
    return "humor";
  }
  if (/puta|weon|culiao|pico|mierda/.test(t)) {
    return "vulgar";
  }
  if (/amor|te quiero|hermoso/.test(t)) {
    return "afecto";
  }
  if (/quiero|voy a|necesito/.test(t)) {
    return "accion";
  }
  if (t.length < 6) {
    return "ambiguo";
  }

  return "reflexivo";
}

function generateSynchroResponse(text, emotion, history) {
  const intent = detectIntent(text);
  const confidence = getProfileConfidence(history);

  if (intent === "ambiguo") {
    return "Señal detectada, pero es difusa. Dale un poco más de forma.";
  }

  if (intent === "vulgar" || intent === "humor") {
    if (/\bpico\b/.test(String(text || "").toLowerCase())) {
      return "Frecuencia caótica detectada. Chile presente.";
    }
    return "Frecuencia caótica detectada. No eres el único pensando cosas raras.";
  }

  if (intent === "accion") {
    if (/renunci|dejar|terminar|cortar/.test(String(text || "").toLowerCase())) {
      return "Pensamiento de ruptura detectado. Alta recurrencia global.";
    }
    return "Hay intención de movimiento en tu mente. Algo se está gestando.";
  }

  if (intent === "afecto") {
    return "Se detecta una frecuencia emocional alta. Este tipo de pensamientos suele resonar fuerte.";
  }

  if (confidence === "baja") {
    return "Patrón mental registrado. Aún en observación.";
  }

  if (emotion === "cansancio" || /hambre|sueñ|dormir/.test(String(text || "").toLowerCase())) {
    return "Señal básica detectada. El cuerpo también piensa.";
  }

  return "Patrón mental registrado. Aún en observación.";
}

// =============================================================================
// Simulation (client-side heuristics, world stream, cascade, perfect match)
// =============================================================================
function normalizeTextForSignals(value) {
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

function getPhraseCoincidenceBias(text) {
  const normalized = normalizeTextForSignals(text);
  const highMatchSignals = [
    "cansado",
    "ansiedad",
    "miedo",
    "solo",
    "soledad",
    "no se",
    "estres",
    "trabajo",
    "amor",
    "futuro",
    "dinero",
    "quiero cambiar",
  ];
  const lowMatchSignals = [
    "mi proyecto",
    "mi startup",
    "mi tesis",
    "mi gato",
    "mi perro",
    "mi jefe",
    "hoy en mi barrio",
    "hoy en mi ciudad",
  ];

  let score = 0;
  for (const signal of highMatchSignals) {
    if (normalized.includes(signal)) {
      score += 1;
    }
  }
  for (const signal of lowMatchSignals) {
    if (normalized.includes(signal)) {
      score -= 1;
    }
  }
  if (normalized.length > 90) {
    score -= 1;
  }
  return score;
}

function getFakeSyncCount(text) {
  const bias = getPhraseCoincidenceBias(text);
  const zeroChance = Math.min(0.5, Math.max(0.12, 0.28 - bias * 0.06));
  const zeroMode = Math.random() < zeroChance;
  if (zeroMode) {
    return 0;
  }
  const min = Math.max(40, 90 + bias * 120);
  const max = Math.max(min + 120, 1800 + bias * 380);
  return Math.floor(min + Math.random() * (max - min));
}

function getFakeSimilarCount(text) {
  const bias = getPhraseCoincidenceBias(text);
  const zeroChance = Math.min(0.46, Math.max(0.1, 0.24 - bias * 0.05));
  const zeroMode = Math.random() < zeroChance;
  if (zeroMode) {
    return 0;
  }
  const min = 1;
  const max = Math.max(4, 10 + bias * 3);
  return Math.floor(min + Math.random() * max);
}

function getWorldNowItems() {
  const shuffled = WORLD_THOUGHTS.map((text) => ({ text, score: Math.random() }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return shuffled.map((item) => {
    const min = Math.floor(60 + Math.random() * 300);
    const max = min + Math.floor(25 + Math.random() * 220);
    return { text: item.text, range: `${min}-${max}` };
  });
}

function pickWorldEvent() {
  const events = [
    "Ola de pensamiento detectada en esta frecuencia.",
    "Sincronía rara en 3 países en menos de 2 segundos.",
    "Pensamiento emergente global en ascenso.",
  ];
  return events[Math.floor(Math.random() * events.length)];
}

function pickCountryGroup() {
  const start = Math.floor(Math.random() * INTERNATIONAL_SOURCES.length);
  return [
    INTERNATIONAL_SOURCES[start % INTERNATIONAL_SOURCES.length],
    INTERNATIONAL_SOURCES[(start + 1) % INTERNATIONAL_SOURCES.length],
    INTERNATIONAL_SOURCES[(start + 2) % INTERNATIONAL_SOURCES.length],
  ];
}

function attachCountryToThoughts(thoughts) {
  const group = pickCountryGroup();
  return thoughts.map((thought, index) => ({
    ...thought,
    country: thought.country || group[index % group.length],
  }));
}

function maybeCreatePerfectMatchEvent(text, fakeCount, fakeSimilarCount) {
  const bias = getPhraseCoincidenceBias(text);
  if (fakeCount === 0 || fakeSimilarCount === 0) {
    return null;
  }
  const similarityIntentBoost = Math.min(0.18, Math.max(0, bias) * 0.04);
  const randomChance = 0.11 + similarityIntentBoost;
  if (Math.random() >= randomChance) {
    return null;
  }
  const simultaneityMs = Math.floor(300 + Math.random() * 1701);
  const country = INTERNATIONAL_SOURCES[Math.floor(Math.random() * INTERNATIONAL_SOURCES.length)];
  return { simultaneityMs, country };
}

function getMaxSimilarityScore(similarThoughts) {
  return similarThoughts.reduce((max, thought) => Math.max(max, thought.score || 0), 0);
}

function shouldShowUniqueMessage(payload) {
  const maxSimilarity = getMaxSimilarityScore(payload.similarThoughts || []);
  const count = Number(payload.approxTodayCount || 0);
  const lowSimilarity = maxSimilarity < 0.18;
  const sparseSignal = count < 180;
  return Math.random() < 0.36 && (lowSimilarity || sparseSignal);
}

function pickUniqueMessage() {
  return UNIQUE_MESSAGES[Math.floor(Math.random() * UNIQUE_MESSAGES.length)];
}

// =============================================================================
// UI — rendering & layout updates
// =============================================================================
function renderProfileInsights(fullText) {
  profileTextEl.style.opacity = "0";
  profileTextEl.replaceChildren();
  const sentences = fullText
    .split(". ")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : `${s}.`));

  for (const sentence of sentences) {
    const p = document.createElement("p");
    p.className = "profile-insight-line";
    p.textContent = sentence;
    profileTextEl.appendChild(p);
  }
  requestAnimationFrame(() => {
    profileTextEl.style.opacity = "1";
  });
}

function renderResonancePanel(resonance, gain) {
  const currentState = getCurrentState(resonance);
  const nextState = getNextState(resonance);
  const percentile = Math.min(99, Math.max(12, Math.floor(45 + Math.log10(resonance + 10) * 20)));

  resonanceLine.textContent = `Resonancia acumulada: ${resonance}`;
  stateLine.textContent = `Estado actual: ${currentState.name}`;
  rankingLine.textContent = `Estás más sincronizado que el ${percentile}% hoy · Resonancia +${gain}`;

  if (!nextState) {
    resonanceFill.style.width = "100%";
    return;
  }

  const range = nextState.threshold - currentState.threshold;
  const progress = Math.max(0, Math.min(1, (resonance - currentState.threshold) / range));
  resonanceFill.style.width = `${Math.floor(progress * 100)}%`;
}

function renderProfilePanel(profile, history) {
  const total = Object.values(profile).reduce((sum, value) => sum + value, 0);
  if (!total) {
    profileLine.textContent = "Tu patrón mental aparecerá después de tus primeras sincronizaciones.";
    insightLine.textContent = lastSynchroMessage || "Sigue escribiendo para revelar tu frecuencia dominante.";
    predictionLine.textContent = "";
    return;
  }

  const sorted = Object.entries(profile).sort((a, b) => b[1] - a[1]);
  const topThree = sorted.slice(0, 3).map(([emotion, count]) => {
    const pct = Math.round((count / total) * 100);
    return `${emotion} ${pct}%`;
  });

  const dominant = getTopEmotion(profile);
  profileLine.textContent = `Patrón mental actual: ${topThree.join(" · ")}`;
  insightLine.textContent =
    lastSynchroMessage ||
    EMOTION_INTERPRETATION[dominant] ||
    "Tu mente está generando un patrón propio.";

  if (history.length >= 6) {
    const latest = history.slice(-4).map((item) => item.emotion);
    const repeat = latest.filter((emotion) => emotion === dominant).length >= 2;
    predictionLine.textContent = repeat
      ? `Es probable que en las próximas horas vuelvas a ${dominant}.`
      : "Tu frecuencia está variando; podrías cambiar de foco pronto.";
  } else {
    predictionLine.textContent = "Aún estamos calibrando tu patrón de resonancia.";
  }
}

function renderWorldNow(options = {}) {
  const fade = options.fade === true && worldNowList.children.length > 0;
  const FADE_MS = 200;
  const token = (worldRefreshToken += 1);

  if (worldRefreshTimeout) {
    clearTimeout(worldRefreshTimeout);
    worldRefreshTimeout = null;
    worldNowList.classList.remove("is-refreshing");
  }

  const fillList = () => {
    worldRefreshTimeout = null;
    if (token !== worldRefreshToken) {
      worldNowList.classList.remove("is-refreshing");
      return;
    }
    const items = getWorldNowItems();
    worldNowList.replaceChildren();
    for (const item of items) {
      const li = document.createElement("li");
      li.textContent = `${item.text} · entre ${item.range} mentes activas`;
      worldNowList.appendChild(li);
    }
    worldEventLine.textContent = pickWorldEvent();
    worldNowList.classList.remove("is-refreshing");
  };

  if (fade) {
    worldNowList.classList.add("is-refreshing");
    worldRefreshTimeout = setTimeout(fillList, FADE_MS);
  } else {
    fillList();
  }
}

function clearPerfectMatchUI() {
  if (celebrationTimer) {
    clearTimeout(celebrationTimer);
    celebrationTimer = null;
  }
  perfectMatchBanner.classList.add("hidden");
  perfectMatchBanner.classList.remove("celebrate-pop");
  resultPanel.classList.remove("perfect-match-frame");
}

function triggerPerfectMatchUI(eventData) {
  perfectMatchMeta.textContent = `· ${eventData.simultaneityMs} ms · ${eventData.country.flag} ${eventData.country.label}`;
  perfectMatchBanner.classList.remove("hidden");
  perfectMatchBanner.classList.add("celebrate-pop");
  resultPanel.classList.add("perfect-match-frame");
  statusEl.textContent = "Match perfecto detectado. Sincronía celebrada.";
  celebrationTimer = setTimeout(() => {
    perfectMatchBanner.classList.remove("celebrate-pop");
    resultPanel.classList.remove("perfect-match-frame");
  }, 4200);
}

function renderFeed(items) {
  feedList.replaceChildren();
  const list = items.length ? items : fallbackFeed;
  let index = 0;
  for (const item of list) {
    const li = document.createElement("li");
    li.className = "feed-item";
    li.style.animationDelay = `${index * 0.06}s`;
    index += 1;
    li.innerHTML = `
      <div class="feed-top-row">
        <span class="feed-pill">${getEmotionEmoji(item.emotion)} ${item.emotion}</span>
        <button class="synchro-chat-btn" type="button" title="Ir a chat grupal Synchronicity (próximamente)">
          Synchronicity: entrar a chat grupal
        </button>
      </div>
      <div class="feed-text">${item.text} (${item.matches})</div>
    `;
    feedList.appendChild(li);
  }
  for (const button of feedList.querySelectorAll(".synchro-chat-btn")) {
    button.addEventListener("click", () => {
      statusEl.textContent = "Synchronicity chat grupal: disponible en una próxima versión.";
    });
  }
}

function stopCascade() {
  if (cascadeTimer) {
    clearTimeout(cascadeTimer);
    cascadeTimer = null;
  }
}

function pushCascadeThought(thought) {
  const li = document.createElement("li");
  li.className = "cascade-tab";
  const shouldShowCountry = lastSyncTier === "ORO" || lastSyncTier === "EPICO" || (thought.score || 0) >= 0.78;
  const country = thought.country || null;
  li.innerHTML = `
    <span class="cascade-emoji">${getEmotionEmoji(thought.emotion)}</span>
    <span class="cascade-text">${thought.text}</span>
    ${
      shouldShowCountry && country
        ? `<span class="country-pill" title="${country.label}">${country.flag} ${country.code}</span>`
        : ""
    }
  `;
  similarList.prepend(li);
  while (similarList.children.length > 8) {
    similarList.removeChild(similarList.lastChild);
  }
}

function scheduleCascade() {
  if (!cascadePool.length) {
    return;
  }
  const nextDelayMs = Math.floor(1300 + Math.random() * 2100);
  cascadeTimer = setTimeout(() => {
    const thought = cascadePool[cascadeIndex % cascadePool.length];
    cascadeIndex += 1;
    pushCascadeThought(thought);
    scheduleCascade();
  }, nextDelayMs);
}

function startCascade(similarThoughts, recentFeed) {
  stopCascade();
  similarList.replaceChildren();
  cascadeIndex = 0;
  const combined = [...similarThoughts, ...recentFeed]
    .map((item) => ({
      text: item.text,
      emotion: item.emotion || "duda",
      score: item.score || 0,
      country: item.country ? INTERNATIONAL_SOURCES.find((c) => c.code === item.country) : null,
    }))
    .filter((item) => item.text);
  const uniqueByText = new Map();
  for (const item of combined) {
    if (!uniqueByText.has(item.text)) {
      uniqueByText.set(item.text, item);
    }
  }
  cascadePool = attachCountryToThoughts(Array.from(uniqueByText.values()).slice(0, 16));
  if (!cascadePool.length) {
    cascadePool = attachCountryToThoughts(
      fallbackFeed.map((item) => ({ text: item.text, emotion: item.emotion }))
    );
  }
  for (let i = 0; i < Math.min(3, cascadePool.length); i += 1) {
    pushCascadeThought(cascadePool[i]);
    cascadeIndex += 1;
  }
  scheduleCascade();
}

function startWorldNowTicker() {
  if (worldNowTimer) {
    clearInterval(worldNowTimer);
  }
  worldNowTimer = setInterval(() => {
    renderWorldNow({ fade: true });
  }, WORLD_REFRESH_MS);
}

// =============================================================================
// Share (clipboard)
// =============================================================================
function buildShareText() {
  if (!lastShareSnapshot) {
    return "";
  }
  const { thought, countText, emotionText, similarText, profileText } = lastShareSnapshot;
  const parts = [
    "SYNCHRO",
    "",
    `Pensamiento: "${thought}"`,
    countText,
    emotionText,
    similarText,
  ];
  if (profileText) {
    parts.push("", `Perfil: ${profileText}`);
  }
  parts.push("", "— SYNCHRO (simulación)");
  return parts.join("\n");
}

function hideShareFeedbackSoon() {
  if (shareFeedbackTimer) {
    clearTimeout(shareFeedbackTimer);
  }
  shareFeedbackTimer = setTimeout(() => {
    shareFeedback.classList.add("hidden");
    shareFeedbackTimer = null;
  }, 2600);
}

async function handleShareResult() {
  const text = buildShareText();
  if (!text) {
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    shareFeedback.textContent = "Copiado al portapapeles.";
    shareFeedback.classList.remove("hidden");
    hideShareFeedbackSoon();
  } catch {
    shareFeedback.textContent = "No se pudo copiar. Prueba en HTTPS o permisos del navegador.";
    shareFeedback.classList.remove("hidden");
    hideShareFeedbackSoon();
  }
}

// =============================================================================
// Events & bootstrap
// =============================================================================
async function handleSync() {
  const text = thoughtInput.value.trim();
  if (text.length < 4) {
    statusEl.textContent = "Escribe al menos 4 caracteres.";
    return;
  }

  syncButton.disabled = true;
  statusEl.textContent = "Buscando resonancia...";
  clearPerfectMatchUI();
  const minDelay = new Promise((resolve) => setTimeout(resolve, 550));

  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, topic: currentTopic }),
    });
    const payload = await response.json();
    lastSyncTier = payload.syncLevel?.tier || "";
    if (syncLevelBadge) {
      const tier = payload.syncLevel?.tier || "BRONCE";
      syncLevelBadge.textContent = tier;
      syncLevelBadge.className = `sync-level-badge tier-${String(tier).toLowerCase()}`;
    }
    if (connectionLine) {
      connectionLine.textContent = payload.connectionLine || "";
    }

    await minDelay;
    if (!response.ok) {
      statusEl.textContent = payload.error || "No se pudo sincronizar ahora.";
      return;
    }

    const realCount = Number(payload.approxTodayCount || 0);
    const realSimilarCount = Array.isArray(payload.similarThoughts) ? payload.similarThoughts.length : 0;
    const hasNoMatches = realCount === 0 || realSimilarCount === 0;
    const perfectMatchEvent = maybeCreatePerfectMatchEvent(text, realCount, realSimilarCount);

    submittedThoughtLine.textContent = `Tu pensamiento: "${text}"`;
    if (hasNoMatches) {
      countLine.textContent = "¡Eres el único!";
    } else if (shouldShowUniqueMessage(payload)) {
      countLine.textContent = pickUniqueMessage();
    } else {
      countLine.textContent = `${realCount} personas pensaron algo similar hoy`;
    }
    emotionLine.textContent = `${getEmotionEmoji(payload.emotion)} Emoción detectada: ${payload.emotion}`;
    updateProfileHistory(payload.emotion);
    lastSynchroMessage = generateSynchroResponse(text, payload.emotion, profileHistory);
    insightLine.textContent = lastSynchroMessage;
    const profileText = generateProfileText(profileHistory);
    renderProfileInsights(profileText);
    profilePanel.classList.remove("hidden");
    if (profileConfidenceLine) {
      profileConfidenceLine.textContent = `Nivel de lectura: ${getProfileConfidence(profileHistory)}`;
    }
    similarCountLine.textContent = hasNoMatches
      ? "0 coincidencias por ahora"
      : `${realSimilarCount} coincidencias detectadas`;

    startCascade(payload.similarThoughts || [], payload.recentFeed || []);
    renderFeed(payload.recentFeed || []);
    resultPanel.classList.remove("hidden");

    lastShareSnapshot = {
      thought: text,
      countText: countLine.textContent,
      emotionText: emotionLine.textContent,
      similarText: similarCountLine.textContent,
      profileText,
    };
    shareResultBtn.disabled = false;

    const resonanceUpdate = updateResonance(realCount, realSimilarCount);
    const profile = updateProfile(payload.emotion);
    const history = updateHistory({
      thought: text,
      emotion: payload.emotion,
      fakeCount: realCount,
      fakeSimilarCount: realSimilarCount,
      timestamp: Date.now(),
    });
    renderResonancePanel(resonanceUpdate.updated, resonanceUpdate.gain);
    renderProfilePanel(profile, history);
    renderWorldNow({ fade: false });

    if (perfectMatchEvent) {
      setTimeout(() => {
        triggerPerfectMatchUI(perfectMatchEvent);
      }, perfectMatchEvent.simultaneityMs);
    }

    thoughtInput.value = "";
    thoughtInput.placeholder = pickNextPrompt();
    await loadTopic();
    if (!perfectMatchEvent) {
      statusEl.textContent = `${hasNoMatches ? "Pensamiento único detectado." : "Sincronización completada."} Escribe otra idea.`;
    }
  } catch (error) {
    await minDelay;
    statusEl.textContent = "Error de red. Intenta de nuevo.";
  } finally {
    syncButton.disabled = false;
  }
}

async function handleCreateTopic() {
  if (!topicShareResult || !copyTopicCodeBtn) return;
  const topic = (newTopicInput?.value || "").trim();
  if (topic.length < 3) {
    topicShareResult.textContent = "Escribe un tópico (mínimo 3 caracteres).";
    copyTopicCodeBtn.classList.add("hidden");
    return;
  }
  try {
    const res = await fetch("/api/topic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const payload = await res.json();
    if (!res.ok) {
      topicShareResult.textContent = payload.error || "No se pudo crear el tópico.";
      copyTopicCodeBtn.classList.add("hidden");
      return;
    }
    topicShareResult.textContent = `Código: ${payload.shareCode} · topicId: ${payload.topicId}`;
    copyTopicCodeBtn.dataset.code = payload.shareCode;
    copyTopicCodeBtn.classList.remove("hidden");
  } catch {
    topicShareResult.textContent = "Error de red creando el tópico.";
    copyTopicCodeBtn.classList.add("hidden");
  }
}

async function handleCopyTopicCode() {
  const code = copyTopicCodeBtn?.dataset?.code || "";
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    if (topicShareResult) {
      topicShareResult.textContent = `Copiado: ${code}`;
    }
  } catch {
    if (topicShareResult) {
      topicShareResult.textContent = `No se pudo copiar. Código: ${code}`;
    }
  }
}

syncButton.addEventListener("click", handleSync);
shareResultBtn.addEventListener("click", handleShareResult);
if (createTopicBtn) {
  createTopicBtn.addEventListener("click", handleCreateTopic);
}
if (copyTopicCodeBtn) {
  copyTopicCodeBtn.addEventListener("click", handleCopyTopicCode);
}
thoughtInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    handleSync();
  }
});

renderFeed([]);
renderResonancePanel(readNumberStorage(RESONANCE_KEY), 0);
renderProfilePanel(readJsonStorage(PROFILE_KEY, {}), readJsonStorage(HISTORY_KEY, []));
renderWorldNow({ fade: false });
startWorldNowTicker();

if (localClock) {
  localClock.textContent = formatLocalClock();
  setInterval(() => {
    localClock.textContent = formatLocalClock();
  }, 1000);
}

loadTopic();
refreshPresence();
setInterval(refreshPresence, 12000);
