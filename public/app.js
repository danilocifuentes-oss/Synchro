// app.js — SYNCHRO (UI métricas + educación + API /api/sync)

import { calculateSyncLevel } from "./syncLevel.js";

const thoughtInput = document.getElementById("thoughtInput");
const syncButton = document.getElementById("syncButton");
const statusEl = document.getElementById("status");
const resultPanel = document.getElementById("resultPanel");
const profileSidebar = document.getElementById("profileSidebar");

const submittedThoughtLine = document.getElementById("submittedThoughtLine");
const syncLevelBadge = document.getElementById("syncLevelBadge");
const perfectMatchBanner = document.getElementById("perfectMatchBanner");
const countLine = document.getElementById("countLine");
const emotionLine = document.getElementById("emotionLine");
const similarCountLine = document.getElementById("similarCountLine");
const similarList = document.getElementById("similarList");
const mentalBars = document.getElementById("mentalBars");

const EMOTION_MENTAL = {
  ansiedad: { activation: 78, valence: -38, clarity: 44, direction: -25, tension: 84, novelty: 42, social: 32 },
  duda: { activation: 56, valence: -22, clarity: 48, direction: -45, tension: 58, novelty: 50, social: 44 },
  soledad: { activation: 48, valence: -52, clarity: 55, direction: -60, tension: 62, novelty: 38, social: 28 },
  frustracion: { activation: 72, valence: -48, clarity: 52, direction: 15, tension: 76, novelty: 45, social: 40 },
  cansancio: { activation: 34, valence: -28, clarity: 40, direction: -30, tension: 48, novelty: 30, social: 35 },
  neutral: { activation: 50, valence: 5, clarity: 60, direction: -5, tension: 42, novelty: 45, social: 50 },
  positivo: { activation: 64, valence: 52, clarity: 66, direction: 40, tension: 32, novelty: 55, social: 58 },
  dolor_fisico: { activation: 55, valence: -40, clarity: 50, direction: -35, tension: 68, novelty: 35, social: 42 },
};

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function stableJitter(seed, salt) {
  let h = 2166136261;
  const s = String(seed) + String(salt ?? "");
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (Math.abs(h) % 21) - 10;
}

function inferMentalState({ emotion, intent, text = "", overlap = null, score = null }) {
  const base = EMOTION_MENTAL[emotion] || EMOTION_MENTAL.neutral;
  const juice = stableJitter(text, `${intent}|${emotion}|${overlap ?? ""}|${score ?? ""}`);
  const scoreN = typeof score === "number" ? score : null;
  const overlapN = typeof overlap === "number" ? overlap : null;

  let activation = base.activation + juice + (scoreN != null ? Math.round(scoreN * 12) : 0);
  let valence = base.valence + (juice % 9);
  let clarity = base.clarity - (overlapN != null && overlapN <= 1 ? 6 : 0) + (juice % 5);
  let direction = clamp(base.direction + (juice % 11), -100, 100);
  let tension = base.tension + (overlapN != null ? overlapN * 3 : 0) + (juice % 7);
  let novelty = base.novelty + (intent === "existencial" || intent === "reflexion" ? 14 : juice % 8);
  let social = base.social + (intent === "afecto" ? 18 : juice % 6);

  return {
    activation: clamp(activation, 0, 100),
    valence: clamp(valence, -100, 100),
    clarity: clamp(clarity, 0, 100),
    direction,
    tension: clamp(tension, 0, 100),
    novelty: clamp(novelty, 0, 100),
    social: clamp(social, 0, 100),
  };
}

function apiSyncToUiPayload(api, inputText) {
  const mentalState = inferMentalState({
    emotion: api.emotion,
    intent: api.intent,
    text: inputText,
  });

  const similarThoughts = (api.similarThoughts || []).map((item, i) => ({
    thought: item.text,
    mentalState: inferMentalState({
      emotion: item.emotion || "neutral",
      intent: item.intent || "reflexion",
      text: item.text || "",
      overlap: i + 1,
      score: item.score,
    }),
  }));

  return { input: inputText, mentalState, similarThoughts };
}

function hideLearnMoreSection() {
  const section = document.getElementById("learnMoreSection");
  if (!section) return;
  section.classList.add("hidden");
  section.classList.add("learn-more-collapsed");
}

function renderLearnMoreSection() {
  const container = document.getElementById("learnMoreContent");
  const section = document.getElementById("learnMoreSection");
  if (!container || !section) return;

  container.innerHTML = `
    <div class="learn-more-item">
      <h4>Energía</h4>
      <p>Fuerza e intensidad del pensamiento. Alta energía suele ir con urgencia o pasión.</p>
    </div>
    <div class="learn-more-item">
      <h4>Emoción</h4>
      <p>Inclinación positiva o negativa del mensaje (-100 a +100).</p>
    </div>
    <div class="learn-more-item">
      <h4>Claridad</h4>
      <p>Qué tan claro y entendible es lo que expresas.</p>
    </div>
    <div class="learn-more-item">
      <h4>Foco</h4>
      <p>Si estás centrado en ti mismo (interno) o en el mundo / otros (externo).</p>
    </div>
    <div class="learn-more-item">
      <h4>Tensión</h4>
      <p>Conflicto interno, frustración o urgencia emocional.</p>
    </div>
  `;

  section.classList.remove("hidden");
  section.classList.add("learn-more-collapsed");

  if (!section.dataset.learnToggleBound) {
    section.dataset.learnToggleBound = "1";
    section.addEventListener("click", () => {
      section.classList.toggle("learn-more-collapsed");
    });
  }
}

function renderMentalBars(state) {
  if (!mentalBars || !state) return;

  mentalBars.innerHTML = `
    <div class="bar-row" data-tooltip="Qué tan cargado de intensidad y urgencia está tu pensamiento">
      <span>Energía</span>
      <div class="bar"><div class="fill" style="width:${state.activation}%"></div></div>
      <span>${state.activation}</span>
    </div>
    <div class="bar-row" data-tooltip="Si tu pensamiento tiende hacia lo positivo o negativo">
      <span>Emoción</span>
      <div class="bar"><div class="fill valence" style="width:${(state.valence + 100) / 2}%"></div></div>
      <span>${state.valence > 0 ? "+" : ""}${state.valence}</span>
    </div>
    <div class="bar-row" data-tooltip="Qué tan claro y fácil de entender es tu mensaje">
      <span>Claridad</span>
      <div class="bar"><div class="fill" style="width:${state.clarity}%"></div></div>
      <span>${state.clarity}</span>
    </div>
    <div class="bar-row" data-tooltip="Si estás pensando más en ti mismo (interno) o en el mundo exterior">
      <span>Foco</span>
      <div class="bar"><div class="fill" style="width:${(state.direction + 100) / 2}%"></div></div>
      <span>${state.direction > 20 ? "Externo" : state.direction < -20 ? "Interno" : "Mixto"}</span>
    </div>
    <div class="bar-row" data-tooltip="Cuánto conflicto, urgencia o tensión emocional hay">
      <span>Tensión</span>
      <div class="bar"><div class="fill tension" style="width:${state.tension}%"></div></div>
      <span>${state.tension}</span>
    </div>
  `;

  renderLearnMoreSection();
}

function updateClock() {
  const now = new Date();
  const el = document.getElementById("localClock");
  if (el) el.textContent = now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}
setInterval(updateClock, 30000);
updateClock();

function showResult(data) {
  resultPanel?.classList.remove("hidden");
  profileSidebar?.classList.remove("hidden");

  submittedThoughtLine.textContent = `"${data.input || thoughtInput.value}"`;

  const syncInfo = calculateSyncLevel(data.mentalState, data.similarThoughts || []);

  syncLevelBadge.textContent = syncInfo.title;
  syncLevelBadge.style.backgroundColor = syncInfo.color;
  syncLevelBadge.style.color = "#0a0a0f";
  syncLevelBadge.style.padding = "8px 20px";
  syncLevelBadge.style.borderRadius = "9999px";
  syncLevelBadge.style.fontWeight = "600";

  if (syncInfo.level === "Nexus") {
    perfectMatchBanner?.classList.remove("hidden");
  } else {
    perfectMatchBanner?.classList.add("hidden");
  }

  const pct = typeof syncInfo.avgSimilarity === "number" ? syncInfo.avgSimilarity : 0;
  if (countLine) countLine.textContent = `${syncInfo.matchCount} mentes en resonancia ahora`;
  if (emotionLine)
    emotionLine.innerHTML = `Intensidad promedio: <strong>${pct}%</strong>`;

  if (data.mentalState) {
    renderMentalBars(data.mentalState);
  } else {
    hideLearnMoreSection();
    if (mentalBars) mentalBars.innerHTML = "";
  }

  if (similarCountLine) similarCountLine.textContent = `${syncInfo.matchCount} coincidencias detectadas`;
  similarList.innerHTML = "";

  const items = data.similarThoughts || [];
  if (items.length > 0) {
    items.slice(0, 5).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = typeof item === "string" ? item : item.thought ?? item;
      similarList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Aún no hay resonancias cercanas en este momento.";
    similarList.appendChild(li);
  }

  statusEl.textContent = `Conexión ${syncInfo.level} establecida`;
  statusEl.style.color = syncInfo.color;

  resultPanel?.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function handleSync() {
  const thought = thoughtInput.value.trim();
  if (!thought) {
    statusEl.textContent = "Escribe algo para sincronizar";
    statusEl.style.color = "#f87171";
    return;
  }
  if (thought.length < 4) {
    statusEl.textContent = "Escribe al menos 4 caracteres (requisito del servidor)";
    statusEl.style.color = "#f87171";
    return;
  }

  statusEl.textContent = "Buscando resonancia...";
  statusEl.style.color = "#c084fc";
  syncButton.disabled = true;

  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: thought }),
    });
    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      statusEl.textContent = typeof payload.error === "string" ? payload.error : "No se pudo sincronizar";
      statusEl.style.color = "#f87171";
      return;
    }

    showResult(apiSyncToUiPayload(payload, thought));
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Error al conectar con el colectivo";
    statusEl.style.color = "#f87171";
  } finally {
    syncButton.disabled = false;
  }
}

syncButton.addEventListener("click", handleSync);

thoughtInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSync();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("%cSYNCHRO — versión final mejorada", "color:#c084fc; font-weight:600");
  hideLearnMoreSection();
  setTimeout(() => {
    const activeEl = document.getElementById("activeUsersLine");
    if (activeEl) activeEl.textContent = `${Math.floor(Math.random() * 15) + 8} mentes activas ahora`;
  }, 600);
});
