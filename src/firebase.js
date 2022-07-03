import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1RnEy6gDcpRzu0g4X385GlK3Ks1jRDPc",
  authDomain: "todo-list-b7c4b.firebaseapp.com",
  databaseURL: "https://todo-list-b7c4b-default-rtdb.firebaseio.com",
  projectId: "todo-list-b7c4b",
  storageBucket: "todo-list-b7c4b.appspot.com",
  messagingSenderId: "464276019682",
  appId: "1:464276019682:web:86ce5cd1ab5c26642fc1bb"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
