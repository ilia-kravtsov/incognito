import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEh28ViIkEc_tDdcYe_jTv8NV6XcCcoWs",
  authDomain: "messenger-bb2d4.firebaseapp.com",
  projectId: "messenger-bb2d4",
  storageBucket: "messenger-bb2d4.appspot.com",
  messagingSenderId: "763304629390",
  appId: "1:763304629390:web:b30d490fd33f17d4dce5df",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
