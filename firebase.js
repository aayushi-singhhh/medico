// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "medico-65975.firebaseapp.com",
  projectId: "medico-65975",
  storageBucket: "medico-65975.appspot.com",
  messagingSenderId: "XXXXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
