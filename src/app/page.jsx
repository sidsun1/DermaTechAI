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
    <div className="navLinks" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <a href="#features">Features</a>
      <a href="#scan" style={{ margin: '0 20px' }}>Upload a Scan</a>
      <a href="https://github.com/sidsun1/IrvineHacks">GitHub</a>
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
        <p>Track your health status in real-time and receive alerts for any potential risks. Sign up for regular reminders to checkup your skin condition.</p>
      </div>
      <div className="featureCard">
        <h3>Photography Tips</h3>
        <p>Ensure that your image is in good lighting and is centered on the intended focus. For anyone taking the image, be sure to take multiple images and at least one close up.</p>
      </div>
      <div className="featureCard">
        <h3>Proactive Wellness</h3>
        <p>Stay ahead of health issues with proactive wellness recommendations from our health chat bot. Ask questions and get all the information you need about your condition.</p>
      </div>
    </div>
  </section>
);

const UploadScan = ({ user }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if(!imageFile){
      alert("Please select an image to upload.");
      return;
    }
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64String = reader.result;

        try{
          await addDoc(collection(db, "uploads"), 
          {
            userId: user.uid,
            image: base64String,
          });

          alert("Image uploaded!");
        }
        catch (error){
          console.error("Error uploading image:", error);
        }
        finally{
          setUploading(false);
        }
      };
    }
    catch (error){
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };

  return (
    user && (
      <div id="scan" className="uploadScanContainer" style={{ textAlign: 'center' }}>
        <h2>Upload a Scan</h2>
        
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'block', margin: '10px auto' }} />
        
        {uploading ? (
          <p>Uploading...</p>
        ) : (
          <button onClick={handleUpload} className="uploadButton" style={{ display: 'block', margin: '10px auto' }}>Upload Image</button>
        )}
        
        {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px', margin: '10px auto', display: 'block' }} />}
      </div>
    )
  );
};



const App = () => {
  const user = useAuth();

  return (
    <div className="page">
      <Navbar />
      <Features />
      <HeroSection signInWithGoogle={signInWithGoogle} signOutUser={signOutUser} user={user} />
      {user && <UploadScan user={user} />}
    </div>
  );
};

export default App;