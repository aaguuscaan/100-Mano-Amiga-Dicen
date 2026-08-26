import { initializeApp } from "firebase/app";

import {
  getFirestore,
  doc,
  setDoc
} from "firebase/firestore";


// ======================================================
// FIREBASE
// ======================================================

const firebaseConfig = {
  apiKey: "AIzaSyDhy9gH6Nr33TKQYKhb4u5vBCPQmiJlyfI",
  authDomain: "mano-amiga-dicen.firebaseapp.com",
  projectId: "mano-amiga-dicen",
  storageBucket: "mano-amiga-dicen.firebasestorage.app",
  messagingSenderId: "116233416032",
  appId: "1:116233416032:web:ecc0f804d06d4bc620c205"
};


const app =
  initializeApp(firebaseConfig);


const db =
  getFirestore(app);


// ======================================================
// PREGUNTAS
// ======================================================

const preguntas = [
  {
    id: "p1",
    titulo: "En una palabra, San Martín fue…",
    respuestas: [
      { texto: "Libertador", puntos: 40, revelada: false },
      { texto: "Héroe", puntos: 26, revelada: false },
      { texto: "Prócer", puntos: 14, revelada: false },
      { texto: "Valiente", puntos: 8, revelada: false },
      { texto: "Chad", puntos: 6, revelada: false },
      { texto: "Salvador", puntos: 6, revelada: false }
    ]
  },

  {
    id: "p2",
    titulo: "¿En qué cruzó los Andes San Martín?",
    respuestas: [
      { texto: "Caballo", puntos: 58, revelada: false },
      { texto: "Mula", puntos: 26, revelada: false },
      { texto: "Burro", puntos: 6, revelada: false },
      { texto: "Auto", puntos: 4, revelada: false },
      { texto: "A pie", puntos: 3, revelada: false },
      { texto: "Camilla", puntos: 3, revelada: false }
    ]
  },

  {
    id: "p3",
    titulo: "¿Qué profesión tenía San Martín?",
    respuestas: [
      { texto: "Militar", puntos: 54, revelada: false },
      { texto: "General", puntos: 16, revelada: false },
      { texto: "Político", puntos: 12, revelada: false },
      { texto: "Abogado", puntos: 8, revelada: false },
      { texto: "Soldado", puntos: 6, revelada: false },
      { texto: "Profesor", puntos: 4, revelada: false }
    ]
  },

  {
    id: "p4",
    titulo: "¿Qué país liberó San Martín?",
    respuestas: [
      { texto: "Argentina", puntos: 38, revelada: false },
      { texto: "Perú", puntos: 30, revelada: false },
      { texto: "Chile", puntos: 24, revelada: false },
      { texto: "España", puntos: 4, revelada: false },
      { texto: "América", puntos: 2, revelada: false },
      { texto: "Cabo Verde", puntos: 2, revelada: false }
    ]
  },

  {
    id: "p5",
    titulo: "¿Cuál fue la mayor hazaña de San Martín?",
    respuestas: [
      { texto: "Cruce de los Andes", puntos: 68, revelada: false },
      { texto: "Liberar Perú", puntos: 18, revelada: false },
      { texto: "Batalla de San Lorenzo", puntos: 6, revelada: false },
      { texto: "Batalla de Chacabuco", puntos: 4, revelada: false },
      { texto: "Batalla de Maipú", puntos: 2, revelada: false },
      { texto: "Independencia de Chile", puntos: 2, revelada: false }
    ]
  },

  {
    id: "p6",
    titulo: "¿A qué edad cruzó los Andes?",
    respuestas: [
      { texto: "39 años", puntos: 60, revelada: false },
      { texto: "38 años", puntos: 24, revelada: false },
      { texto: "40 años", puntos: 6, revelada: false },
      { texto: "35 años", puntos: 4, revelada: false },
      { texto: "25 años", puntos: 3, revelada: false },
      { texto: "67 años", puntos: 3, revelada: false }
    ]
  },

  {
    id: "p7",
    titulo: "¿Cuánto tardó en cruzar los Andes?",
    respuestas: [
      { texto: "21 días", puntos: 52, revelada: false },
      { texto: "20 días", puntos: 20, revelada: false },
      { texto: "25 días", puntos: 12, revelada: false },
      { texto: "Un mes", puntos: 8, revelada: false },
      { texto: "3 meses", puntos: 5, revelada: false },
      { texto: "2 semanas", puntos: 3, revelada: false }
    ]
  },

  {
    id: "p8",
    titulo: "¿Qué religión practicaba San Martín?",
    respuestas: [
      { texto: "Católica", puntos: 74, revelada: false },
      { texto: "Ateísmo", puntos: 16, revelada: false },
      { texto: "Cristiana Evangélica", puntos: 4, revelada: false },
      { texto: "Masonería", puntos: 3, revelada: false },
      { texto: "Pastafarismo", puntos: 2, revelada: false },
      { texto: "Ninguna", puntos: 1, revelada: false }
    ]
  },

  {
    id: "p9",
    titulo: "¿Dónde descansan los restos de San Martín?",
    respuestas: [
      { texto: "Catedral Metropolitana", puntos: 62, revelada: false },
      { texto: "Buenos Aires", puntos: 14, revelada: false },
      { texto: "Catedral", puntos: 12, revelada: false },
      { texto: "Mausoleo", puntos: 6, revelada: false },
      { texto: "Francia", puntos: 3, revelada: false },
      { texto: "Capilla", puntos: 3, revelada: false }
    ]
  },

  {
    id: "p10",
    titulo: "¿Qué prócer acompañó a San Martín?",
    respuestas: [
      { texto: "Manuel Belgrano", puntos: 46, revelada: false },
      { texto: "Cabral", puntos: 20, revelada: false },
      { texto: "Bernardo O'Higgins", puntos: 18, revelada: false },
      { texto: "Las Heras", puntos: 8, revelada: false },
      { texto: "Miguel E. Soler", puntos: 4, revelada: false },
      { texto: "Güemes", puntos: 4, revelada: false }
    ]
  },

  {
    id: "p11",
    titulo: "¿Qué sueño de patria tenía San Martín?",
    respuestas: [
      { texto: "América libre", puntos: 38, revelada: false },
      { texto: "Independencia", puntos: 28, revelada: false },
      { texto: "Libertad", puntos: 18, revelada: false },
      { texto: "Patria Grande", puntos: 8, revelada: false },
      { texto: "América unida", puntos: 5, revelada: false },
      { texto: "País libre", puntos: 3, revelada: false }
    ]
  },

  {
    id: "p12",
    titulo: "¿Qué objeto llevaba San Martín a sus batallas?",
    respuestas: [
      { texto: "Sable", puntos: 48, revelada: false },
      { texto: "Espada", puntos: 26, revelada: false },
      { texto: "Caballo", puntos: 18, revelada: false },
      { texto: "Mula", puntos: 3, revelada: false },
      { texto: "Escarapela", puntos: 3, revelada: false },
      { texto: "Libertad", puntos: 2, revelada: false }
    ]
  },

  {
    id: "p13",
    titulo: "¿Cuántos soldados acompañaron a San Martín?",
    respuestas: [
      { texto: "5.000", puntos: 44, revelada: false },
      { texto: "5.400", puntos: 26, revelada: false },
      { texto: "5.423", puntos: 14, revelada: false },
      { texto: "1.500", puntos: 7, revelada: false },
      { texto: "1.000", puntos: 5, revelada: false },
      { texto: "6.000", puntos: 4, revelada: false }
    ]
  },

  {
    id: "p14",
    titulo: "San Martín es considerado un héroe por…",
    respuestas: [
      { texto: "Libertador", puntos: 36, revelada: false },
      { texto: "Valentía", puntos: 30, revelada: false },
      { texto: "Honor", puntos: 16, revelada: false },
      { texto: "Inteligente", puntos: 8, revelada: false },
      { texto: "Crack", puntos: 6, revelada: false },
      { texto: "Inmortal", puntos: 4, revelada: false }
    ]
  },

  {
    id: "p15",
    titulo: "¿Dónde vivió San Martín?",
    respuestas: [
      { texto: "Argentina", puntos: 52, revelada: false },
      { texto: "España", puntos: 24, revelada: false },
      { texto: "Francia", puntos: 14, revelada: false },
      { texto: "Corrientes", puntos: 4, revelada: false },
      { texto: "Yapeyú", puntos: 3, revelada: false },
      { texto: "Mendoza", puntos: 3, revelada: false }
    ]
  },

  {
    id: "p16",
    titulo: "¿Quién fue Remedios de Escalada?",
    respuestas: [
      { texto: "Esposa", puntos: 76, revelada: false },
      { texto: "Patriota", puntos: 14, revelada: false },
      { texto: "Hija", puntos: 6, revelada: false },
      { texto: "Amiga", puntos: 2, revelada: false },
      { texto: "Mujer", puntos: 1, revelada: false },
      { texto: "Compañera", puntos: 1, revelada: false }
    ]
  }
];


// ======================================================
// IMPORTAR
// ======================================================

async function importar() {

  console.log("");
  console.log("====================================");
  console.log("🚀 IMPORTANDO PREGUNTAS");
  console.log("====================================");
  console.log("");

  try {

    for (const pregunta of preguntas) {

      console.log(
        `📤 Guardando ${pregunta.id}...`
      );

      await setDoc(
        doc(
          db,
          "preguntas",
          pregunta.id
        ),
        {
          titulo: pregunta.titulo,
          respuestas: pregunta.respuestas
        }
      );

      console.log(
        `✅ ${pregunta.id} guardada correctamente`
      );
    }

    console.log("");
    console.log("====================================");
    console.log("🎉 IMPORTACIÓN COMPLETA");
    console.log("====================================");
    console.log("");
    console.log(
      `Total: ${preguntas.length} preguntas`
    );
    console.log("");

  } catch (error) {

    console.error("");
    console.error("====================================");
    console.error("❌ ERROR AL IMPORTAR");
    console.error("====================================");
    console.error("");

    console.error(error);

    console.error("");

    process.exit(1);
  }
}


importar();