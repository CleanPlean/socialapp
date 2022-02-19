import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAXbs8uBQYAL4ZeQDAwnQerlKuVWGRG1Xo",
    authDomain: "simplechat-32e5f.firebaseapp.com",
    projectId: "simplechat-32e5f",
    storageBucket: "simplechat-32e5f.appspot.com",
    messagingSenderId: "217957332184",
    appId: "1:217957332184:web:33ad4f8bc38bc33b4213ad"
  };
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
export { db, auth };