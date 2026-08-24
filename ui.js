// ======================================================
// UI COMPARTIDA ENTRE CONTROL Y PANTALLA
// ======================================================

import {
  calculatePot
} from "./game.js";


// ======================================================
// HELPER DOM
// ======================================================

const $ = id =>
  document.getElementById(id);


// ======================================================
// SET TEXT
// ======================================================

export function setText(
  id,
  value
) {

  const element =
    $(id);

  if (!element) return;

  element.textContent =
    value ?? "";
}


// ======================================================
// RENDER ESTADO COMPARTIDO
// ======================================================

export function renderSharedState(
  state,
  {
    displayOnly = false
  } = {}
) {

  if (!state) return;


  // ==================================================
  // PREGUNTA
  // ==================================================

  setText(
    "questionTitle",
    state.questionTitle ||
      "Esperando pregunta..."
  );


  // ==================================================
  // EQUIPOS
  // ==================================================

  setText(
    "teamAName",
    state.teamA?.name ||
      "Equipo A"
  );


  setText(
    "teamBName",
    state.teamB?.name ||
      "Equipo B"
  );


  setText(
    "teamAScore",
    Number(
      state.teamA?.score || 0
    ).toLocaleString("es-AR")
  );


  setText(
    "teamBScore",
    Number(
      state.teamB?.score || 0
    ).toLocaleString("es-AR")
  );


  // ==================================================
  // POZO
  // ==================================================

  const pot =
    calculatePot(
      state.answers || []
    );


  setText(
    "pot",
    pot.toLocaleString("es-AR")
  );


  // ==================================================
  // EQUIPO ACTIVO
  // ==================================================

  const teamA =
    $("teamA");

  const teamB =
    $("teamB");


  if (teamA) {

    teamA.classList.toggle(
      "active",
      state.activeTeam === "A"
    );
  }


  if (teamB) {

    teamB.classList.toggle(
      "active",
      state.activeTeam === "B"
    );
  }


  // ==================================================
  // ERRORES
  // ==================================================

  const strikes =
    $("strikes");


  if (strikes) {

    strikes.innerHTML = "";


    const totalStrikes =
      Number(
        state.strikes || 0
      );


    for (
      let i = 0;
      i < 3;
      i++
    ) {

      const item =
        document.createElement("span");


      item.className =
        `strike ${
          i < totalStrikes
            ? "on"
            : ""
        }`;


      item.textContent =
        "X";


      strikes.appendChild(
        item
      );
    }
  }


  // ==================================================
  // TABLERO
  // ==================================================

  const board =
    $("board");


  if (!board) return;


  board.innerHTML = "";


  const answers =
    Array.isArray(
      state.answers
    )
      ? state.answers
      : [];


  // ==================================================
  // CREAR RESPUESTAS
  // ==================================================

  answers.forEach(
    (answer, index) => {

      const slot =
        document.createElement(
          "article"
        );


      // ----------------------------------------------
      // CLASES
      // ----------------------------------------------

      slot.className =
        "answer-slot";


      if (
        answer?.revelada
      ) {

        slot.classList.add(
          "revealed"
        );
      }


      // ----------------------------------------------
      // ÍNDICE REAL
      // ----------------------------------------------
      //
      // MUY IMPORTANTE:
      //
      // El índice que usamos acá es EXACTAMENTE
      // el índice del array state.answers.
      //
      // 0 = respuesta 1
      // 1 = respuesta 2
      // 2 = respuesta 3
      // 3 = respuesta 4
      // 4 = respuesta 5
      //
      // ----------------------------------------------

      slot.dataset.index =
        String(index);


      // ----------------------------------------------
      // IDENTIFICADOR VISUAL
      // ----------------------------------------------

      slot.dataset.answerNumber =
        String(index + 1);


      // ----------------------------------------------
      // SEGURIDAD DE CLICK
      // ----------------------------------------------

      slot.style.position =
        "relative";


      slot.style.zIndex =
        String(100 + index);


      // ----------------------------------------------
      // CONTENIDO
      // ----------------------------------------------

      const inner =
        document.createElement(
          "div"
        );


      inner.className =
        "answer-inner";


      // ----------------------------------------------
      // CARA DELANTERA
      // ----------------------------------------------

      const front =
        document.createElement(
          "div"
        );


      front.className =
        "answer-face answer-front";


      const number =
        document.createElement(
          "span"
        );


      number.className =
        "answer-number";


      number.textContent =
        String(index + 1);


      const cover =
        document.createElement(
          "span"
        );


      cover.className =
        "answer-cover";


      cover.textContent =
        "RESPUESTA";


      front.appendChild(
        number
      );


      front.appendChild(
        cover
      );


      // ----------------------------------------------
      // CARA TRASERA
      // ----------------------------------------------

      const back =
        document.createElement(
          "div"
        );


      back.className =
        "answer-face answer-back";


      const text =
        document.createElement(
          "span"
        );


      text.className =
        "answer-text";


      text.textContent =
        answer?.texto ?? "";


      const points =
        document.createElement(
          "strong"
        );


      points.textContent =
        String(
          Number(
            answer?.puntos || 0
          )
        );


      back.appendChild(
        text
      );


      back.appendChild(
        points
      );


      // ----------------------------------------------
      // ARMAR CARTA
      // ----------------------------------------------

      inner.appendChild(
        front
      );


      inner.appendChild(
        back
      );


      slot.appendChild(
        inner
      );


      // ----------------------------------------------
      // TOOLTIP CONTROL
      // ----------------------------------------------

      if (!displayOnly) {

        slot.title =
          `Revelar respuesta ${
            index + 1
          }`;
      }


      // ----------------------------------------------
      // AGREGAR AL TABLERO
      // ----------------------------------------------

      board.appendChild(
        slot
      );
    }
  );


  // ==================================================
  // MODO PANTALLA
  // ==================================================

  document.body.classList.toggle(
    "display-only",
    displayOnly
  );
}


// ======================================================
// LISTA DE PREGUNTAS
// ======================================================

export function renderQuestionList(
  questions,
  currentIndex,
  onSelect
) {

  const list =
    $("questionList");


  if (!list) return;


  list.innerHTML = "";


  questions.forEach(
    (question, index) => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        `question-item ${
          index === currentIndex
            ? "selected"
            : ""
        }`;


      button.textContent =
        `${index + 1}. ${
          question.titulo
        }`;


      button.addEventListener(
        "click",
        () => {

          onSelect(index);
        }
      );


      list.appendChild(
        button
      );
    }
  );
}