// Import Firebase core
import { initializeApp } from "firebase/app";

// Import services you NEED
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your config (same as yours)
const firebaseConfig = {
  apiKey: "AIzaSyDlbmyDsMZ5g0K-j7FOjbHE5xBSladoqwc",
  authDomain: "kindlink-d7b60.firebaseapp.com",
  projectId: "kindlink-d7b60",
  storageBucket: "kindlink-d7b60.firebasestorage.app",
  messagingSenderId: "254531195441",
  appId: "1:254531195441:web:3588252427ffd9ffe27b10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);