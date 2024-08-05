import firebase from 'firebase'

import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyDW7ONSg5yL4ZHXhMpJuH8SJEraySuqgO8",
  authDomain: "drop-firebase-a0e56.firebaseapp.com",
  projectId: "drop-firebase-a0e56",
  storageBucket: "drop-firebase-a0e56.appspot.com",
  messagingSenderId: "567200799139",
  appId: "1:567200799139:web:9b9d850f7de21738d92216"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
export default
{
    firebase,
    db
}