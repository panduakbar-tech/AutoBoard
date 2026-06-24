import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Kunci rahasia asli milik AutoBoard
const firebaseConfig = {
  apiKey: "AIzaSyDymyuZMRxRfU9NzK5X0ul9wnube_7zPaA",
  authDomain: "autoboard-3f48f.firebaseapp.com",
  projectId: "autoboard-3f48f",
  storageBucket: "autoboard-3f48f.firebasestorage.app",
  messagingSenderId: "853068058544",
  appId: "1:853068058544:web:15d639724fe0979e395075"
};

// Menyalakan Firebase
const app = initializeApp(firebaseConfig);

// Mengekspor fitur Autentikasi untuk dipakai di LoginScreen
export const auth = getAuth(app);