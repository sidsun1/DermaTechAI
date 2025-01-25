import firebaseConfig from "./api-key.js"
import firebase from "firebase/app";

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export default firebase