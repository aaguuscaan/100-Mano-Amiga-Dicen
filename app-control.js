import {
  db,
  collection,
  doc,
  onSnapshot,
  setDoc
} from "./firebase.js";

import {
  cloneState,
  calculatePot,
  stateFromQuestion,
  revealAnswer,
  addStrike,
  setActiveTeam,
  awardPot,
  resetRound,
  resetScores,
  revealAll,
  nextQuestion,
  previousQuestion
} from "./game.js";

import {
  renderSharedState,
  renderQuestionList
} from "./ui.js";

import { initKeyboard } from "./keyboard.js";

import {
  playReveal,
  playError,
  playTurn,
  playWin
} from "./sounds.js";

import {
  celebrate
} from "./animations.js";


// ======================================================
// SESIÓN
// ======================================================

const SESSION_ID =
  new URLSearchParams(location.search).get("sesion") ||
  "acto-17-agosto";


// ======================================================
// FIREBASE
// ======================================================

const stateRef = doc(
  db,
  "sessions",
  SESSION_ID
);

const questionsRef = collection(
  db,
  "preguntas"
);


// ======================================================
// ESTADO LOCAL
// ======================================================

let state = null;

let questions = [];

let unsubscribeState = null;

let unsubscribeQuestions = null;


// ======================================================
// DOM
// ======================================================

const $ = id =>
  document.getElementById(id);


// ======================================================
// ESTADO VACÍO
// ======================================================

function emptyState() {

  return {

    questionIndex: 0,

    questionId: null,

    questionTitle:
      "Esperando preguntas de Firebase...",

    answers: [],

    teamA: {
      name: "Equipo A",
      score: 0
    },

    teamB: {
      name: "Equipo B",
      score: 0
    },

    strikes: 0,

    activeTeam: "A",

    pot: 0,

    status: "ready",

    updatedAt: Date.now()

  };
}


// ======================================================
// ESCRIBIR ESTADO
// ======================================================

async function writeState(next) {

  if (!next) {
    return;
  }

  const stateToWrite =
    cloneState(next);

  stateToWrite.pot =
    calculatePot(
      stateToWrite.answers || []
    );

  stateToWrite.updatedAt =
    Date.now();

  try {

    await setDoc(
      stateRef,
      stateToWrite
    );

    console.log(
      "💾 Estado guardado:",
      stateToWrite
    );

    setFirebaseStatus(
      `🟢 En vivo · ${questions.length} preguntas`,
      "success"
    );

  } catch (error) {

    showError(error);

  }
}


// ======================================================
// SUSCRIBIR FIREBASE
// ======================================================

function subscribe() {

  // ====================================================
  // ESTADO DE LA PARTIDA
  // ====================================================

  unsubscribeState =
    onSnapshot(

      stateRef,

      async snap => {

        try {

          if (snap.exists()) {

            state =
              snap.data();

            console.log(
              "🎮 Estado recibido desde Firestore:",
              state
            );

          } else {

            state =
              emptyState();

            console.log(
              "🆕 Creando estado inicial..."
            );

            await setDoc(
              stateRef,
              state
            );

          }

          render();

        } catch (error) {

          showError(error);

        }

      },

      error => {

        showError(error);

      }

    );


  // ====================================================
  // PREGUNTAS
  // ====================================================

  unsubscribeQuestions =
    onSnapshot(

      questionsRef,

      async snap => {

        try {

          questions =
            snap.docs.map(
              questionDoc => ({

                id:
                  questionDoc.id,

                ...questionDoc.data()

              })
            );


          // --------------------------------------------
          // ORDENAR PREGUNTAS
          // --------------------------------------------

          questions.sort(
            (a, b) => {

              const numberA =
                Number(
                  String(a.id)
                    .replace(/^p/, "")
                );

              const numberB =
                Number(
                  String(b.id)
                    .replace(/^p/, "")
                );

              return numberA - numberB;

            }
          );


          console.log(
            "🔥 PREGUNTAS RECIBIDAS:",
            questions
          );

          console.log(
            "📊 TOTAL DE PREGUNTAS:",
            questions.length
          );


          // --------------------------------------------
          // MOSTRAR LISTA
          // --------------------------------------------

          renderQuestionList(

            questions,

            state?.questionIndex ?? 0,

            selectQuestion

          );


          // --------------------------------------------
          // SI NO HAY PREGUNTA ACTIVA
          // --------------------------------------------

          if (

            state &&

            !state.questionId &&

            questions.length > 0

          ) {

            console.log(
              "🚀 No hay pregunta activa."
            );

            console.log(
              "🚀 Cargando la primera pregunta:",
              questions[0]
            );


            await selectQuestion(
              0,
              true
            );

          }


          // --------------------------------------------
          // ACTUALIZAR ESTADO VISUAL
          // --------------------------------------------

          setFirebaseStatus(

            `🟢 En vivo · ${questions.length} preguntas`,

            "success"

          );


          render();

        } catch (error) {

          showError(error);

        }

      },

      error => {

        showError(error);

      }

    );

}


// ======================================================
// RENDER
// ======================================================

function render() {

  if (!state) {
    return;
  }


  console.log(
    "🎨 RENDERIZANDO:",
    {
      questionId: state.questionId,
      questionIndex: state.questionIndex,
      questionTitle: state.questionTitle,
      answers: state.answers
    }
  );


  renderSharedState(

    state,

    {
      displayOnly: false
    }

  );


  renderQuestionList(

    questions,

    state.questionIndex ?? 0,

    selectQuestion

  );


  const sessionName =
    $("sessionName");


  if (sessionName) {

    sessionName.textContent =
      SESSION_ID;

  }

}


// ======================================================
// SELECCIONAR PREGUNTA
// ======================================================

async function selectQuestion(
  index,
  silent = false
) {

  console.log(
    "===================================="
  );

  console.log(
    "🎯 SELECCIONANDO PREGUNTA"
  );

  console.log(
    "ÍNDICE:",
    index
  );

  console.log(
    "TOTAL:",
    questions.length
  );


  if (!questions[index]) {

    console.error(
      "❌ No existe la pregunta:",
      index
    );

    return;

  }


  const question =
    questions[index];


  console.log(
    "📋 PREGUNTA SELECCIONADA:",
    question
  );


  console.log(
    "🆔 ID:",
    question.id
  );

  console.log(
    "❓ TÍTULO:",
    question.titulo
  );

  console.log(
    "💬 RESPUESTAS:",
    question.respuestas
  );


  const next =
    stateFromQuestion(

      question,

      index,

      state

    );


  console.log(
    "📝 NUEVO ESTADO:",
    next
  );


  await writeState(
    next
  );


  if (!silent) {

    playTurn();

  }

}


// ======================================================
// REVELAR RESPUESTA
// ======================================================

async function reveal(index) {

  if (

    !state ||

    !state.answers ||

    !state.answers[index]

  ) {

    console.warn(
      "⚠️ No se puede revelar:",
      index
    );

    return;

  }


  const wasRevealed =
    state.answers[index].revelada;


  const next =
    revealAnswer(

      state,

      index

    );


  await writeState(
    next
  );


  if (!wasRevealed) {

    playReveal();

  }

}


// ======================================================
// STRIKE
// ======================================================

async function strike() {

  if (!state) {
    return;
  }


  const next =
    addStrike(
      state
    );


  await writeState(
    next
  );


  playError();


  if (
    next.strikes >= 2
  ) {

    celebrate(
      $("gameStage")
    );

  }

}


// ======================================================
// DAR POZO
// ======================================================

async function award(team) {

  if (!state) {
    return;
  }


  const amount =
    calculatePot(
      state.answers || []
    );


  if (!amount) {

    console.warn(
      "⚠️ El pozo está vacío."
    );

    return;

  }


  const next =
    awardPot(

      state,

      team

    );


  await writeState(
    next
  );


  playWin();


  celebrate(
    $("gameStage")
  );

}


// ======================================================
// REINICIAR RONDA
// ======================================================

async function resetCurrentRound() {

  if (!state) {
    return;
  }


  const next =
    resetRound(
      state
    );


  await writeState(
    next
  );

}


// ======================================================
// REINICIAR PUNTAJES
// ======================================================

async function resetAllScores() {

  if (!state) {
    return;
  }


  const next =
    resetScores(
      state
    );


  await writeState(
    next
  );

}


// ======================================================
// SIGUIENTE PREGUNTA
// ======================================================

async function goNext() {

  if (

    !state ||

    !questions.length

  ) {

    return;

  }


  const next =
    nextQuestion(

      state,

      questions

    );


  await writeState(
    next
  );


  playTurn();

}


// ======================================================
// PREGUNTA ANTERIOR
// ======================================================

async function goPrevious() {

  if (

    !state ||

    !questions.length

  ) {

    return;

  }


  const next =
    previousQuestion(

      state,

      questions

    );


  await writeState(
    next
  );


  playTurn();

}


// ======================================================
// CAMBIAR EQUIPO
// ======================================================

async function setTeam(team) {

  if (!state) {
    return;
  }


  const next =
    setActiveTeam(

      state,

      team

    );


  await writeState(
    next
  );


  playTurn();

}


// ======================================================
// REVELAR TODO
// ======================================================

async function revealEverything() {

  if (!state) {
    return;
  }


  const next =
    revealAll(
      state
    );


  await writeState(
    next
  );


  playReveal();

}


// ======================================================
// FULLSCREEN
// ======================================================

async function fullscreen() {

  try {

    if (
      !document.fullscreenElement
    ) {

      await document
        .documentElement
        .requestFullscreen();

    } else {

      await document
        .exitFullscreen();

    }

  } catch (error) {

    console.warn(
      "No se pudo cambiar fullscreen:",
      error
    );

  }

}


// ======================================================
// STATUS FIREBASE
// ======================================================

function setFirebaseStatus(
  message,
  type = ""
) {

  const box =
    $("firebaseStatus");


  if (!box) {
    return;
  }


  box.textContent =
    message;


  box.dataset.status =
    type;

}


// ======================================================
// ERROR FIREBASE
// ======================================================

function showError(error) {

  console.error(
    "🔥 FIREBASE ERROR:",
    error
  );


  const code =
    error?.code ||
    "unknown";


  let message =
    `Firebase (${code})`;


  if (
    code === "permission-denied"
  ) {

    message =
      "FIREBASE: permiso denegado. Las reglas de Firestore no permiten leer/escribir.";

  }

  else if (
    code === "failed-precondition"
  ) {

    message =
      "FIREBASE: Firestore no está habilitado o falta configuración.";

  }

  else if (
    code === "unavailable"
  ) {

    message =
      "FIREBASE: servicio no disponible. Revisá Internet.";

  }

  else if (
    error?.message
  ) {

    message +=
      ` — ${error.message}`;

  }


  setFirebaseStatus(
    message,
    "error"
  );

}


// ======================================================
// BOTONES
// ======================================================

function bind() {

  // ====================================================
  // RESPUESTAS
  // ====================================================

  const board =
    $("board");


  if (board) {

    board.addEventListener(
      "click",
      event => {

        const slot =
          event.target.closest(
            ".answer-slot"
          );


        if (!slot) {
          return;
        }


        const index =
          Number(
            slot.dataset.index
          );


        if (
          !Number.isInteger(index)
        ) {

          return;

        }


        console.log(
          "🎯 Click respuesta:",
          index
        );


        reveal(index);

      }
    );

  }


  // ====================================================
  // STRIKE
  // ====================================================

  const btnStrike =
    $("btnStrike");


  if (btnStrike) {

    btnStrike.onclick =
      strike;

  }


  // ====================================================
  // LIMPIAR STRIKES
  // ====================================================

  const btnClearStrikes =
    $("btnClearStrikes");


  if (btnClearStrikes) {

    btnClearStrikes.onclick =
      async () => {

        if (!state) {
          return;
        }


        const next =
          cloneState(state);


        next.strikes = 0;


        await writeState(
          next
        );

      };

  }


  // ====================================================
  // EQUIPO A
  // ====================================================

  const btnActiveA =
    $("btnActiveA");


  if (btnActiveA) {

    btnActiveA.onclick =
      () => setTeam("A");

  }


  // ====================================================
  // EQUIPO B
  // ====================================================

  const btnActiveB =
    $("btnActiveB");


  if (btnActiveB) {

    btnActiveB.onclick =
      () => setTeam("B");

  }


  // ====================================================
  // POZO A
  // ====================================================

  const btnAwardA =
    $("btnAwardA");


  if (btnAwardA) {

    btnAwardA.onclick =
      () => award("A");

  }


  // ====================================================
  // POZO B
  // ====================================================

  const btnAwardB =
    $("btnAwardB");


  if (btnAwardB) {

    btnAwardB.onclick =
      () => award("B");

  }


  // ====================================================
  // REVELAR TODO
  // ====================================================

  const btnRevealAll =
    $("btnRevealAll");


  if (btnRevealAll) {

    btnRevealAll.onclick =
      revealEverything;

  }


  // ====================================================
  // SIGUIENTE
  // ====================================================

  const btnNext =
    $("btnNext");


  if (btnNext) {

    btnNext.onclick =
      goNext;

  }


  // ====================================================
  // ANTERIOR
  // ====================================================

  const btnPrevious =
    $("btnPrevious");


  if (btnPrevious) {

    btnPrevious.onclick =
      goPrevious;

  }


  // ====================================================
  // REINICIAR RONDA
  // ====================================================

  const btnResetRound =
    $("btnResetRound");


  if (btnResetRound) {

    btnResetRound.onclick =
      resetCurrentRound;

  }


  // ====================================================
  // REINICIAR PUNTAJES
  // ====================================================

  const btnResetScores =
    $("btnResetScores");


  if (btnResetScores) {

    btnResetScores.onclick =
      resetAllScores;

  }


  // ====================================================
  // FULLSCREEN
  // ====================================================

  const btnFullscreen =
    $("btnFullscreen");


  if (btnFullscreen) {

    btnFullscreen.onclick =
      fullscreen;

  }


  // ====================================================
  // VICTORIA
  // ====================================================

  const btnVictory =
    $("btnVictory");


  if (btnVictory) {

    btnVictory.onclick =
      () => {

        playWin();

        celebrate(
          $("gameStage")
        );

      };

  }

}


// ======================================================
// TECLADO
// ======================================================

initKeyboard({

  reveal,

  strike,

  awardA:
    () => award("A"),

  awardB:
    () => award("B"),

  next:
    goNext,

  previous:
    goPrevious,

  resetRound:
    resetCurrentRound,

  resetScores:
    resetAllScores,

  fullscreen

});


// ======================================================
// INICIAR
// ======================================================

bind();

subscribe();