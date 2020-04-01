import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBiGlCU7NeU5hZ65RFrs3_dpxBx9R7E-kI",
    authDomain: "budget-app-bf7db.firebaseapp.com",
    databaseURL: "https://budget-app-bf7db.firebaseio.com",
    projectId: "budget-app-bf7db",
    storageBucket: "budget-app-bf7db.appspot.com",
    messagingSenderId: "1037805686837",
    appId: "1:1037805686837:web:b7adc3744e10574251a17c",
    measurementId: "G-KFYHNW641G"
}

firebase.initializeApp(config);
firebase.analytics();
let db = firebase.firestore();

export default db;