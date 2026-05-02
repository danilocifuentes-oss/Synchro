// syncLevel.js — niveles de sincronía

export function calculateSyncLevel(ownMentalState, similarThoughts = []) {
  if (!ownMentalState || !similarThoughts || similarThoughts.length === 0) {
    return {
      level: "Eco",
      title: "ECO",
      subtitle: "Señal enviada",
      description: "Tu pensamiento viaja a través del colectivo.",
      color: "#64748b",
      intensity: 28,
      matchCount: 0,
      avgSimilarity: 0,
    };
  }

  const validMatches = similarThoughts.filter((match) => {
    if (!match.mentalState) return false;
    const similarity = calculateSimilarity(ownMentalState, match.mentalState);
    return similarity >= 52;
  });

  if (validMatches.length === 0) {
    return {
      level: "Eco",
      title: "ECO",
      subtitle: "Señal enviada",
      description: "Tu pensamiento viaja solo por ahora.",
      color: "#64748b",
      intensity: 32,
      matchCount: 0,
      avgSimilarity: 0,
    };
  }

  const totalSimilarity = validMatches.reduce((sum, match) => {
    return sum + calculateSimilarity(ownMentalState, match.mentalState);
  }, 0);

  const avgSimilarity = Math.round(totalSimilarity / validMatches.length);

  let levelData;

  if (avgSimilarity >= 88 && validMatches.length >= 3) {
    levelData = {
      level: "Nexus",
      title: "NEXUS",
      subtitle: "Conexión Excepcional",
      description: "Múltiples mentes vibran en perfecta sincronía.",
      color: "#67e8f9",
      intensity: 98,
    };
  } else if (avgSimilarity >= 78 || validMatches.length >= 3) {
    levelData = {
      level: "Sinapsis Colectiva",
      title: "SINAPSIS COLECTIVA",
      subtitle: "Red Neuronal Viva",
      description: "Tus pensamientos se entrelazan con otras conciencias.",
      color: "#c084fc",
      intensity: 87,
    };
  } else if (avgSimilarity >= 68) {
    levelData = {
      level: "Resonancia",
      title: "RESONANCIA",
      subtitle: "Vibración Compartida",
      description: "Estás profundamente conectado.",
      color: "#a855f7",
      intensity: 74,
    };
  } else if (avgSimilarity >= 56) {
    levelData = {
      level: "Armonía",
      title: "ARMONÍA",
      subtitle: "Alineación Emergente",
      description: "Comienzas a resonar con el colectivo.",
      color: "#22d3ee",
      intensity: 58,
    };
  } else {
    levelData = {
      level: "Eco",
      title: "ECO",
      subtitle: "Señal enviada",
      description: "Tu pensamiento viaja a través del éter.",
      color: "#64748b",
      intensity: 38,
    };
  }

  return { ...levelData, matchCount: validMatches.length, avgSimilarity };
}

function calculateSimilarity(stateA, stateB) {
  if (!stateA || !stateB) return 0;
  const diff =
    Math.abs(stateA.activation - stateB.activation) * 0.55 +
    Math.abs(stateA.valence - stateB.valence) * 0.45 +
    Math.abs(stateA.clarity - stateB.clarity) * 0.65 +
    Math.abs(stateA.direction - stateB.direction) * 0.55 +
    Math.abs(stateA.tension - stateB.tension) * 0.75 +
    Math.abs(stateA.novelty - stateB.novelty) * 0.5 +
    Math.abs(stateA.social - stateB.social) * 0.6;
  return Math.max(0, 100 - diff);
}
