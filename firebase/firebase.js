// Simplified firebase.js without storage
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBroN4UauSmJeK9_jT-uYlSH2-mYKmHA6g",
  authDomain: "lena-mohamed-app.firebaseapp.com",
  projectId: "lena-mohamed-app",
  storageBucket: "lena-mohamed-app.firebasestorage.app",
  messagingSenderId: "1011827507601",
  appId: "1:1011827507601:web:14970f6ba7175e9b7c9a30",
  measurementId: "G-700BBPNHMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services - only in browser environment
let analytics = null;
let db = null;
let auth = null;

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth, analytics };