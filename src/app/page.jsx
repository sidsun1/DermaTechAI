'use client';

import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOutUser, db } from './firebase';
import { ReactTyped } from 'react-typed';
import './styles.css';
import { collection, addDoc } from "firebase/firestore";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return user;
};

const Navbar = () => (
  <nav className="navbar">
    <div className="logoContainer">
      <h1>DermaTech AI</h1>
    </div>
    <div className="navLinks">
      <a href="#features">Features</a>
      <a href="#scan">Upload a Scan</a>
      <a href="https://github.com/sidsun/IrvineHacks">GitHub</a>
    </div>
  </nav>
);

const HeroSection = ({ signInWithGoogle, signOutUser, user }) => (
  <section id="hero" className="hero">
    <div className="typingContainer">
      <h1>
        <ReactTyped
          strings={[
            'Helping you stay healthy and safe.',
            'Explore ways to maintain your health.',
            'Monitor your conditions in real-time.',
            'Be proactive about your wellness.'
          ]}
          typeSpeed={50}
          backSpeed={25}
          backDelay={1500}
          loop
        />
      </h1>
      {!user ? (
        <button className="signInButton" onClick={signInWithGoogle}>Sign In with Google</button>
      ) : (
        <button className="signOutButton" onClick={signOutUser}>Sign Out</button>
      )}
    </div>
  </section>
);

const Features = () => (
  <section id="features" className="features">
    <h2>Features</h2>
    <div className="cardsContainer">
      <div className="featureCard">
        <h3>Real-time Health Monitoring</h3>
        <p>Track your health status in real-time and receive alerts for any potential risks.</p>
      </div>
      <div className="featureCard">
        <h3>Health Tips</h3>
        <p>Get personalized health tips based on your data and goals.</p>
      </div>
      <div className="featureCard">
        <h3>Proactive Wellness</h3>
        <p>Stay ahead of health issues with proactive wellness recommendations.</p>
      </div>
    </div>
  </section>
);

const UploadScan = ({ user }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if(!imageFile){
      alert("Please select an image to upload.");
      return;
    }
    setUploading(true);

    try{
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64String = reader.result;

        try{
          const docRef = await addDoc(collection(db, "uploads"), {
            userId: user.uid,
            image: base64String,
          });

          alert("Image uploaded!");
        }
        catch(error){
          console.error("Error uploading image:", error);
        }
        finally{
          setUploading(false);
        }
      };
    }
    catch(error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };

  return (
    user && (
      <div id="scan" className="uploadScanContainer">
        <h2>Upload a Scan</h2>
        <input type="file" onChange={handleImageChange} />
        {uploading ? (
          <p>Uploading...</p>
        ) : (
          <button onClick={handleUpload} className="uploadButton">Upload Image</button>
        )}
      </div>
    )
  );
};

const App = () => {
  const user = useAuth();

  return (
    <div className="page">
      <Navbar />
      <HeroSection signInWithGoogle={signInWithGoogle} signOutUser={signOutUser} user={user} />
      <Features />
      {user && <UploadScan user={user} />}
    </div>
  );
};

export default App;