// Animaciones visuales pequeñas y reutilizables.
export function pulse(element) {
  if (!element) return;
  element.classList.remove("fx-pulse");
  void element.offsetWidth;
  element.classList.add("fx-pulse");
}

export function flash(element, className = "fx-flash") {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

export function animateNumber(element, from, to, duration = 450) {
  if (!element) return;
  const start = performance.now();
  const delta = to - from;

  function frame(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(from + delta * eased).toLocaleString("es-AR");
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function celebrate(element) {
  if (!element) return;
  element.classList.remove("victory");
  void element.offsetWidth;
  element.classList.add("victory");
}
