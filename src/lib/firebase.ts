// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-116607902-d1c1c",
  "appId": "1:587904738366:web:0c5d09041a4a15f0d85d6f",
  "apiKey": "AIzaSyBnR0jPIlf3eCn0qurF7PHuQ3aCIzoqbLI",
  "authDomain": "studio-116607902-d1c1c.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "587904738366",
  "storageBucket": "studio-116607902-d1c1c.appspot.com"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
