import {
    getAuth
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.PLASMO_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.PLASMO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    databaseURL: "https://priceseekr-397015-default-rtdb.firebaseio.com/",
  };
  
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getDatabase(app);


