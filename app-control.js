import {
  db,
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
// REFERENCIAS FIREBASE
// ======================================================

// Estado de la partida:
//
// sessions
// └── acto-17-agosto
//
const stateRef = doc(
  db,
  "sessions",
  SESSION_ID
);


// Pregunta:
//
// sessions
// └── preguntas
//     ├── titulo
//     └── respuestas
//
const questionsRef = doc(
  db,
  "sessions",
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
// HELPER DOM
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

  next.pot =
    calculatePot(
      next.answers || []
    );

  next.updatedAt =
    Date.now();

  await setDoc(
    stateRef,
    next
  );
}


// ======================================================
// SUSCRIBIR FIREBASE
// ======================================================

function subscribe() {

  // ==================================================
  // ESTADO DE LA PARTIDA
  // ==================================================

  unsubscribeState =
    onSnapshot(

      stateRef,

      async snap => {

        try {

          if (snap.exists()) {

            state =
              snap.data();

          } else {

            state =
              emptyState();

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

      showError
    );


  // ==================================================
  // PREGUNTA
  // ==================================================

  unsubscribeQuestions =
    onSnapshot(

      questionsRef,

      snap => {

        try {

          console.log(
            "Documento sessions/preguntas:",
            snap.exists()
          );


          // ------------------------------------------
          // DOCUMENTO NO EXISTE
          // ------------------------------------------

          if (!snap.exists()) {

            questions = [];


            setFirebaseStatus(
              "❌ No existe el documento sessions/preguntas",
              "error"
            );


            renderQuestionList(
              [],
              0,
              selectQuestion
            );


            return;
          }


          // ------------------------------------------
          // DATOS DEL DOCUMENTO
          // ------------------------------------------

          const data =
            snap.data();


          console.log(
            "Datos de preguntas:",
            data
          );


          // ------------------------------------------
          // CONSTRUIR PREGUNTA
          // ------------------------------------------

          questions = [

            {
              id: "preguntas",

              titulo:
                data.titulo || "",

              respuestas:
                Array.isArray(
                  data.respuestas
                )
                  ? data.respuestas
                  : []
            }

          ];


          console.log(
            "Preguntas cargadas:",
            questions
          );


          // ------------------------------------------
          // STATUS
          // ------------------------------------------

          setFirebaseStatus(
            "🟢 1 pregunta cargada",
            "ok"
          );


          // ------------------------------------------
          // MOSTRAR LISTA
          // ------------------------------------------

          renderQuestionList(

            questions,

            state?.questionIndex ?? 0,

            selectQuestion
          );


          // ------------------------------------------
          // CARGAR AUTOMÁTICAMENTE
          // ------------------------------------------

          if (
            state &&
            !state.questionId
          ) {

            selectQuestion(
              0,
              true
            );
          }

        } catch (error) {

          showError(error);
        }
      },

      showError
    );
}


// ======================================================
// RENDER
// ======================================================

function render() {

  renderSharedState(
    state,
    {
      displayOnly: false
    }
  );


  renderQuestionList(

    questions,

    state?.questionIndex ?? 0,

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

  if (!questions[index]) {
    return;
  }


  const next =
    stateFromQuestion(

      questions[index],

      index,

      state
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
    addStrike(state);


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
    resetRound(state);


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
    resetScores(state);


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
    revealAll(state);


  await writeState(
    next
  );
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

  } catch (_) {}
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
    "Firebase error:",
    error
  );


  const code =
    error?.code ||
    "unknown";


  let message =
    `Firebase (${code})`;


  if (
    code ===
    "permission-denied"
  ) {

    message =
      "FIREBASE: permiso denegado. Las reglas de Firestore no permiten leer/escribir.";

  } else if (
    code ===
    "failed-precondition"
  ) {

    message =
      "FIREBASE: Firestore no está habilitado o falta una configuración del proyecto.";

  } else if (
    code ===
    "unavailable"
  ) {

    message =
      "FIREBASE: servicio no disponible. Revisá la conexión a Internet.";

  } else if (
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

  const board =
    $("board");


  if (board) {

const board = $("board");

if (board) {

  board.addEventListener(
    "click",
    event => {

      const slot =
        event.target.closest(
          ".answer-slot"
        );

      if (!slot) return;


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
        "Revelando respuesta:",
        index + 1,
        "índice real:",
        index
      );


      reveal(index);
    }
  );
}
}


  const btnStrike =
    $("btnStrike");

  if (btnStrike) {

    btnStrike.onclick =
      strike;
  }


  const btnClearStrikes =
    $("btnClearStrikes");

  if (btnClearStrikes) {

    btnClearStrikes.onclick =
      () => {

        if (!state) {
          return;
        }


        writeState({

          ...cloneState(state),

          strikes: 0
        });
      };
  }


  const btnActiveA =
    $("btnActiveA");

  if (btnActiveA) {

    btnActiveA.onclick =
      () => setTeam("A");
  }


  const btnActiveB =
    $("btnActiveB");

  if (btnActiveB) {

    btnActiveB.onclick =
      () => setTeam("B");
  }


  const btnAwardA =
    $("btnAwardA");

  if (btnAwardA) {

    btnAwardA.onclick =
      () => award("A");
  }


  const btnAwardB =
    $("btnAwardB");

  if (btnAwardB) {

    btnAwardB.onclick =
      () => award("B");
  }


  const btnRevealAll =
    $("btnRevealAll");

  if (btnRevealAll) {

    btnRevealAll.onclick =
      revealEverything;
  }


  const btnNext =
    $("btnNext");

  if (btnNext) {

    btnNext.onclick =
      goNext;
  }


  const btnPrevious =
    $("btnPrevious");

  if (btnPrevious) {

    btnPrevious.onclick =
      goPrevious;
  }


  const btnResetRound =
    $("btnResetRound");

  if (btnResetRound) {

    btnResetRound.onclick =
      resetCurrentRound;
  }


  const btnResetScores =
    $("btnResetScores");

  if (btnResetScores) {

    btnResetScores.onclick =
      resetAllScores;
  }


  const btnFullscreen =
    $("btnFullscreen");

  if (btnFullscreen) {

    btnFullscreen.onclick =
      fullscreen;
  }


  const btnVictory =
    $("btnVictory");

  if (btnVictory) {

    btnVictory.onclick = () => {

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