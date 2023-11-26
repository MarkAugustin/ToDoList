import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-selw7X49t1htc9r1lm4gp_EtOwN7QGs",
  authDomain: "todolist-25c48.firebaseapp.com",
  projectId: "todolist-25c48",
  storageBucket: "todolist-25c48.appspot.com",
  messagingSenderId: "769037962238",
  appId: "1:769037962238:web:386793b8b3a31748134eaf",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const tasksCollection = collection(db, "tasks");

export { db, tasksCollection };
