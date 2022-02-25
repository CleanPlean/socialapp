// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMS98yG9-KMy_U3xUDrAzVYxqvja0I2_g",
  authDomain: "socialapp-298522.firebaseapp.com",
  projectId: "socialapp-298522",
  storageBucket: "socialapp-298522.appspot.com",
  messagingSenderId: "367559535628",
  appId: "1:367559535628:web:f68baabd2fbaac85559229",
  measurementId: "G-KBCMSS1EMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app , firebaseConfig};