// Estado y reglas del juego. No toca el DOM.
export const EMPTY_STATE = {
  questionIndex: 0,
  questionId: null,
  questionTitle: "Esperando pregunta...",
  answers: [],
  teamA: { name: "Equipo A", score: 0 },
  teamB: { name: "Equipo B", score: 0 },
  strikes: 0,
  activeTeam: "A",
  pot: 0,
  status: "ready",
  updatedAt: Date.now()
};

export function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

export function calculatePot(answers = []) {
  return answers
    .filter(answer => answer.revelada)
    .reduce((total, answer) => total + Number(answer.puntos || 0), 0);
}

export function normalizeQuestion(docSnap) {
  const data = docSnap.data() || {};
  const respuestas = Array.isArray(data.respuestas) ? data.respuestas : [];

  return {
    id: docSnap.id,
    titulo: String(data.titulo || "Sin pregunta"),
    respuestas: respuestas.map(answer => ({
      texto: String(answer.texto || ""),
      puntos: Number(answer.puntos || 0),
      revelada: Boolean(answer.revelada)
    }))
  };
}

export function stateFromQuestion(question, index = 0, previous = null) {
  const base = previous ? cloneState(previous) : cloneState(EMPTY_STATE);

  base.questionIndex = index;
  base.questionId = question?.id ?? null;
  base.questionTitle = question?.titulo ?? "Sin pregunta";
  base.answers = (question?.respuestas ?? []).map(answer => ({
    texto: answer.texto,
    puntos: Number(answer.puntos || 0),
    revelada: Boolean(answer.revelada)
  }));
  base.strikes = 0;
  base.pot = calculatePot(base.answers);
  base.status = "playing";
  base.updatedAt = Date.now();

  return base;
}

export function revealAnswer(state, index) {
  const next = cloneState(state);
  if (!next.answers[index]) return next;
  next.answers[index].revelada = !next.answers[index].revelada;
  next.pot = calculatePot(next.answers);
  next.updatedAt = Date.now();
  return next;
}

export function setStrikes(state, value) {
  const next = cloneState(state);
  next.strikes = Math.max(0, Math.min(3, Number(value) || 0));
  next.updatedAt = Date.now();
  return next;
}

export function addStrike(state) {
  return setStrikes(state, state.strikes + 1);
}

export function setActiveTeam(state, team) {
  const next = cloneState(state);
  next.activeTeam = team === "B" ? "B" : "A";
  next.updatedAt = Date.now();
  return next;
}

export function awardPot(state, team) {
  const next = cloneState(state);
  const amount = calculatePot(next.answers);
  if (team === "B") next.teamB.score += amount;
  else next.teamA.score += amount;
  next.pot = 0;
  next.answers = next.answers.map(answer => ({ ...answer, revelada: false }));
  next.strikes = 0;
  next.updatedAt = Date.now();
  return next;
}

export function resetRound(state) {
  const next = cloneState(state);
  next.answers = next.answers.map(answer => ({ ...answer, revelada: false }));
  next.strikes = 0;
  next.pot = 0;
  next.updatedAt = Date.now();
  next.status = "playing";
  return next;
}

export function resetScores(state) {
  const next = cloneState(state);
  next.teamA.score = 0;
  next.teamB.score = 0;
  next.updatedAt = Date.now();
  return next;
}

export function revealAll(state) {
  const next = cloneState(state);
  next.answers = next.answers.map(answer => ({ ...answer, revelada: true }));
  next.pot = calculatePot(next.answers);
  next.updatedAt = Date.now();
  return next;
}

export function nextQuestion(state, questions) {
  if (!questions.length) return cloneState(state);
  const nextIndex = Math.min(state.questionIndex + 1, questions.length - 1);
  return stateFromQuestion(questions[nextIndex], nextIndex, state);
}

export function previousQuestion(state, questions) {
  if (!questions.length) return cloneState(state);
  const prevIndex = Math.max(state.questionIndex - 1, 0);
  return stateFromQuestion(questions[prevIndex], prevIndex, state);
}
