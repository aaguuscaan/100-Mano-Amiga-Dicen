import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhy9gH6Nr33TKQYKhb4u5vBCPQmiJlyfI",
  authDomain: "mano-amiga-dicen.firebaseapp.com",
  projectId: "mano-amiga-dicen",
  storageBucket: "mano-amiga-dicen.firebasestorage.app",
  messagingSenderId: "116233416032",
  appId: "1:116233416032:web:ecc0f804d06d4bc620c205"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp
};