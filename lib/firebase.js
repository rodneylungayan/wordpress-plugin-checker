// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAp1tmKfmPvK8-M0XzjNHSq98_KWM8Y4Oo",
  authDomain: "website-plugin-cheker.firebaseapp.com",
  projectId: "website-plugin-cheker",
  storageBucket: "website-plugin-cheker.firebasestorage.app",
  messagingSenderId: "632108652119",
  appId: "1:632108652119:web:1bfa9bfe1f99592bfdf512",
  measurementId: "G-EQX84QPK82"
};

// Prevent re-initialization during hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore (database)
export const db = getFirestore(app);

// Optional: Initialize analytics safely (only in browser)
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) getAnalytics(app);
  });
}
