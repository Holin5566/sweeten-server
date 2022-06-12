const { initializeApp } = require("firebase-admin/app");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_PROJECT + ".firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT,
  storageBucket: process.env.FIREBASE_PROJECT + ".appspot.com",
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig); // app

// firebase
//   .auth()
//   .createUserWithEmailAndPassword(email, password)
//   .then((userCredential) => {
//     // Signed in
//     var user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ..
//   });

// const db = getFirestore(app);
