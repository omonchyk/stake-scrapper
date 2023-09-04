// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCIgAFp_00O7w5SUnWzmroBkrAOdhZI5fo',
  authDomain: 'stake-scrapper.firebaseapp.com',
  projectId: 'stake-scrapper',
  storageBucket: 'stake-scrapper.appspot.com',
  messagingSenderId: '913691830507',
  appId: '1:913691830507:web:ab0ef036428f7b1d8336ae',
  measurementId: 'G-FPZ0L96D0E',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
