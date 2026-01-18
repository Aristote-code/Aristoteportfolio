import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC23ljoq3uYb3bdMU-h2hzyJLPtYEU1StM",
  authDomain: "portfolio-366ac.firebaseapp.com",
  projectId: "portfolio-366ac",
  storageBucket: "portfolio-366ac.firebasestorage.app",
  messagingSenderId: "3008257157",
  appId: "1:3008257157:web:b0854a28f24a09d20dddec",
  measurementId: "G-HCCQNWVSE8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
