// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJmPoKr_rSIESL8bJsRgQy9Oo0MtTKQnQ",
  authDomain: "bookwebsite-c0865.firebaseapp.com",
  projectId: "bookwebsite-c0865",
  storageBucket: "bookwebsite-c0865.appspot.com",
  messagingSenderId: "135936371391",
  appId: "1:135936371391:web:af96cab5ca82ba86c5340a",
  measurementId: "G-4L92GWDNBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
const db = initializeFirestore(app, {   experimentalForceLongPolling: true,   useFetchStreams: false, });
//const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, db }; 