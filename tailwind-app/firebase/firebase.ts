import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBHBQuZx4a6yUY2OASwXN3zRgqFdhaquI8",
    authDomain: "dualhacks-ade67.firebaseapp.com",
    projectId: "dualhacks-ade67",
    storageBucket: "dualhacks-ade67.appspot.com",
    messagingSenderId: "1012644923394",
    appId: "1:1012644923394:web:a638049f79696f5b893f1b",
    measurementId: "G-6SFM2338X4",
};

const app = initializeApp(firebaseConfig);

//If we need more add here.  Access using imports.
export const auth = getAuth(app);
export const firestore = getFirestore(app);
