import React, { useEffect, useState } from 'react'
import { auth } from './firebase'
import {signInWithGoogle, signOut} from './firebase'
import './App.css'

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  return () => unsubscribe();
}, []);
}


const App = () => {
  const user = useAuth();

  return (
    <div>
      {user ? (
        <div>
          <h3>Welcome, {user.displayName}</h3>
          <img src={user.photoURL} alt={user.displayName} />
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>Please sign in to continue.</p>
          <button onClick={signInWithGoogle}>Sign In with Google</button>
        </div>
      )}
    </div>
  );
};

export default App