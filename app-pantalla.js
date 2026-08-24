import {
  db,
  doc,
  onSnapshot
} from "./firebase.js";

import {
  renderSharedState
} from "./ui.js";


// ======================================================
// SESIÓN
// ======================================================

const SESSION_ID =
  new URLSearchParams(location.search).get("sesion") ||
  "acto-17-agosto";


// ======================================================
// REFERENCIA AL ESTADO
// ======================================================
//
// El control escribe acá:
//
// sessions
// └── acto-17-agosto
//
// La pantalla solamente escucha este documento.
//

const stateRef = doc(
  db,
  "sessions",
  SESSION_ID
);


// ======================================================
// DOM
// ======================================================

const $ = id =>
  document.getElementById(id);


// ======================================================
// STATUS
// ======================================================

function setFirebaseStatus(
  message,
  type = ""
) {

  const box =
    $("firebaseStatus");

  if (!box) return;

  box.textContent =
    message;

  box.dataset.status =
    type;
}


// ======================================================
// ERROR
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
      "FIREBASE: permiso denegado. Revisá las reglas de Firestore.";

  } else if (
    code ===
    "failed-precondition"
  ) {

    message =
      "FIREBASE: Firestore no está habilitado.";

  } else if (
    code ===
    "unavailable"
  ) {

    message =
      "FIREBASE: servicio no disponible. Revisá Internet.";

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
// ESCUCHAR ESTADO DE LA PARTIDA
// ======================================================

function subscribe() {

  console.log(
    "Conectando pantalla a:",
    `sessions/${SESSION_ID}`
  );


  onSnapshot(

    stateRef,

    snap => {

      try {

        // ----------------------------------------------
        // EL DOCUMENTO NO EXISTE
        // ----------------------------------------------

        if (!snap.exists()) {

          console.warn(
            "No existe:",
            `sessions/${SESSION_ID}`
          );


          setFirebaseStatus(
            `⚠ Esperando al control · sessions/${SESSION_ID}`,
            "warning"
          );


          return;
        }


        // ----------------------------------------------
        // OBTENER ESTADO
        // ----------------------------------------------

        const state =
          snap.data();


        console.log(
          "Estado recibido en pantalla:",
          state
        );


        // ----------------------------------------------
        // RENDER
        // ----------------------------------------------

        renderSharedState(
          state,
          {
            displayOnly: true
          }
        );


        // ----------------------------------------------
        // CONEXIÓN OK
        // ----------------------------------------------

        setFirebaseStatus(
          "🟢 Conectado al control",
          "ok"
        );


      } catch (error) {

        showError(error);
      }
    },

    showError
  );
}


// ======================================================
// INICIAR
// ======================================================

subscribe();