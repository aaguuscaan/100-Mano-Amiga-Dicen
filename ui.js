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

export function setText(id, value) {

  const element = $(id);

  if (!element) {
    return;
  }

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

  if (!state) {
    return;
  }


  console.log(
    "🎨 UI recibió estado:",
    state
  );


  // ==================================================
  // PREGUNTA
  // ==================================================

  setText(
    "questionTitle",
    state.questionTitle ||
      "Esperando pregunta..."
  );


  // ==================================================
  // EQUIPO A
  // ==================================================

  setText(
    "teamAName",
    state.teamA?.name ||
      "Equipo A"
  );


  setText(
    "teamAScore",
    Number(
      state.teamA?.score || 0
    ).toLocaleString("es-AR")
  );


  // ==================================================
  // EQUIPO B
  // ==================================================

  setText(
    "teamBName",
    state.teamB?.name ||
      "Equipo B"
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
      Array.isArray(state.answers)
        ? state.answers
        : []
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
  // STRIKES
  // ==================================================

  const strikes =
    $("strikes");


  if (strikes) {

    strikes.innerHTML = "";


    const totalStrikes =
      Math.max(
        0,
        Math.min(
          3,
          Number(state.strikes || 0)
        )
      );


    for (
      let i = 0;
      i < 3;
      i++
    ) {

      const item =
        document.createElement(
          "span"
        );


      item.className =
        "strike" +
        (
          i < totalStrikes
            ? " on"
            : ""
        );


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


  if (!board) {

    console.warn(
      "⚠️ No existe #board"
    );

    return;

  }


  // Limpiar tablero anterior

  board.innerHTML = "";


  // ==================================================
  // RESPUESTAS
  // ==================================================

  const answers =
    Array.isArray(state.answers)
      ? state.answers
      : [];


  console.log(
    "📦 UI renderizando respuestas:",
    answers
  );


  // ==================================================
  // CREAR CADA RESPUESTA
  // ==================================================

  answers.forEach(
    (answer, index) => {

      const slot =
        document.createElement(
          "article"
        );


      // ----------------------------------------------
      // CLASE PRINCIPAL
      // ----------------------------------------------

      slot.className =
        "answer-slot";


      // ----------------------------------------------
      // REVELADA
      // ----------------------------------------------

      if (
        answer &&
        answer.revelada === true
      ) {

        slot.classList.add(
          "revealed"
        );

      }


      // ----------------------------------------------
      // ÍNDICE
      // ----------------------------------------------

      slot.dataset.index =
        String(index);


      slot.dataset.answerNumber =
        String(index + 1);


      // ----------------------------------------------
      // Z-INDEX
      // ----------------------------------------------

      slot.style.position =
        "relative";

      slot.style.zIndex =
        String(100 + index);


      // =================================================
      // CONTENEDOR
      // =================================================

      const inner =
        document.createElement(
          "div"
        );


      inner.className =
        "answer-inner";


      // =================================================
      // FRENTE
      // =================================================

      const front =
        document.createElement(
          "div"
        );


      front.className =
        "answer-face answer-front";


      // Número

      const number =
        document.createElement(
          "span"
        );


      number.className =
        "answer-number";


      number.textContent =
        String(index + 1);


      // Texto RESPUESTA

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


      // =================================================
      // ATRÁS
      // =================================================

      const back =
        document.createElement(
          "div"
        );


      back.className =
        "answer-face answer-back";


      // -----------------------------------------------
      // TEXTO REAL DE FIRESTORE
      // -----------------------------------------------

      const text =
        document.createElement(
          "span"
        );


      text.className =
        "answer-text";


      const answerText =
        answer?.texto ?? "";


      console.log(
        `💬 Respuesta ${index + 1}:`,
        answerText
      );


      text.textContent =
        String(answerText);


      // -----------------------------------------------
      // PUNTOS
      // -----------------------------------------------

      const points =
        document.createElement(
          "strong"
        );


      const answerPoints =
        Number(
          answer?.puntos || 0
        );


      points.textContent =
        String(answerPoints);


      // -----------------------------------------------
      // ARMAR BACK
      // -----------------------------------------------

      back.appendChild(
        text
      );

      back.appendChild(
        points
      );


      // -----------------------------------------------
      // ARMAR INNER
      // -----------------------------------------------

      inner.appendChild(
        front
      );

      inner.appendChild(
        back
      );


      // -----------------------------------------------
      // ARMAR SLOT
      // -----------------------------------------------

      slot.appendChild(
        inner
      );


      // -----------------------------------------------
      // TOOLTIP
      // -----------------------------------------------

      if (!displayOnly) {

        slot.title =
          `Revelar respuesta ${index + 1}`;

      }


      // -----------------------------------------------
      // TABLERO
      // -----------------------------------------------

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


  if (!list) {
    return;
  }


  list.innerHTML = "";


  if (!Array.isArray(questions)) {
    return;
  }


  questions.forEach(
    (question, index) => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "question-item" +
        (
          index === currentIndex
            ? " selected"
            : ""
        );


      button.textContent =
        `${index + 1}. ${
          question?.titulo || "Sin pregunta"
        }`;


      button.addEventListener(
        "click",
        () => {

          console.log(
            "🖱️ Pregunta elegida:",
            index,
            question
          );


          onSelect(index);

        }
      );


      list.appendChild(
        button
      );

    }
  );

}