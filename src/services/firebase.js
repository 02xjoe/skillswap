import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVNYoQIsfbirS34NngSU9hMB3qXEFeZNg",
  authDomain: "skillswap-851a4.firebaseapp.com",
  projectId: "skillswap-851a4",
  storageBucket: "skillswap-851a4.firebasestorage.app",
  messagingSenderId: "1026335408883",
  appId: "1:1026335408883:web:371384474a1e6f340aad86",
  measurementId: "G-F8L1V1SBSY"
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);