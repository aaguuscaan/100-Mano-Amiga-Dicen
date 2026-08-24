// Sonidos generados con Web Audio API: no requiere archivos externos.
let audioContext = null;

function getContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(frequency, duration, type = "sine", volume = 0.045, delay = 0) {
  try {
    const ctx = getContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration + 0.03);
  } catch (_) {
    // El navegador puede bloquear audio hasta una interacción del usuario.
  }
}

export function playReveal() {
  tone(440, 0.12, "triangle", 0.035);
  tone(660, 0.18, "triangle", 0.04, 0.08);
}

export function playError() {
  tone(180, 0.28, "sawtooth", 0.035);
}

export function playTurn() {
  tone(330, 0.12, "square", 0.025);
  tone(495, 0.16, "square", 0.025, 0.10);
}

export function playWin() {
  tone(523.25, 0.16, "triangle", 0.04);
  tone(659.25, 0.16, "triangle", 0.04, 0.12);
  tone(783.99, 0.32, "triangle", 0.045, 0.24);
}
