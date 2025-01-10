import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmuIzKOQ1efOqNF-27jJ7-Nzl-a6ZYtZE",
  authDomain: "auth-a05dd.firebaseapp.com",
  projectId: "auth-a05dd",
  storageBucket: "auth-a05dd.firebasestorage.app",
  messagingSenderId: "381668098651",
  appId: "1:381668098651:web:e2e3a40a6a9c3a8f0bf57e",
  measurementId: "G-FERXFK60M4",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

auth.useDeviceLanguage();

export { auth, db };
