import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu51vQ_K6OniQwG7cpXopJtMqtigJag-E",
  authDomain: "baicaowellnesscentre-a6b2e.firebaseapp.com",
  projectId: "baicaowellnesscentre-a6b2e",
  storageBucket: "baicaowellnesscentre-a6b2e.firebasestorage.app",
  messagingSenderId: "310888224770",
  appId: "1:310888224770:web:08efdd2bcbb4ca89966f1b",
  measurementId: "G-CMQEV4HY4R",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
