
import firebaseConfig from "./api-key.js";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try{
    await signInWithPopup(auth, provider);
  }
  catch(error){
    console.error("Error signing in with Google:", error);
  }
};

const signOutUser = () => {
  signOut(auth).catch((error) => {
    console.error("Error signing out:", error);
  });
};

export { auth, signInWithGoogle, signOutUser, db };