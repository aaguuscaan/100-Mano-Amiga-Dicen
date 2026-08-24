// Atajos del juego.
export function initKeyboard(actions) {
  window.addEventListener("keydown", event => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.repeat) return;

    const key = event.key.toLowerCase();

    if (/^[1-8]$/.test(key)) actions.reveal?.(Number(key) - 1);
    else if (key === "x") actions.strike?.();
    else if (key === "a") actions.awardA?.();
    else if (key === "b") actions.awardB?.();
    else if (key === "n") actions.next?.();
    else if (key === "p") actions.previous?.();
    else if (key === "r") actions.resetRound?.();
    else if (key === "f") actions.fullscreen?.();
    else if (key === "s") actions.resetScores?.();
  });
}
