'use client';

import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOutUser, db } from './firebase';
import { ReactTyped } from 'react-typed';
import './styles.css';

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

const Navbar = ({ user, signInWithGoogle, signOutUser }) => (
  <nav className="navbar">
    <div className="logoContainer">
      <h1>DermaTech AI</h1>
    </div>
    <div className="navLinks">
      <a href="#features">Features</a>
      <a href="#scan">Upload a Scan</a>
      <a href="https://github.com/sidsun1/IrvineHacks" target="_blank" rel="noopener noreferrer">GitHub</a>
      {user ? (
        <button className="signOutButton" onClick={signOutUser}>Sign Out</button>
      ) : (
        <button className="signInButton" onClick={signInWithGoogle}>Sign In</button>
      )}
    </div>
  </nav>
);

const HeroSection = () => (
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
  const [chatbotResponse, setChatbotResponse] = useState(null);

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
    if (!imageFile) {
        alert("Please select an image to upload.");
        return;
    }
    setUploading(true);
    setChatbotResponse(null);

    try {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];

            try {
                const response = await fetch('http://localhost:5000/process-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: base64String }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const data = await response.json();
                setChatbotResponse(data.history);
            } catch (fetchError) {
                console.error("Fetch Error:", fetchError);
                alert(`Error uploading image: ${fetchError.message}`);
            } finally {
                setUploading(false);
            }
        };
    } catch (error) {
        console.error("File reading error:", error);
        alert("Error processing the image file");
        setUploading(false);
    }
};

  return (
    user && (
      <div id="scan" className="uploadScanContainer" style={{ 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <h2>Upload a Scan</h2>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '5px' 
        }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          
          {!uploading ? (
            <button 
              onClick={handleUpload} 
              className="uploadButton"
              disabled={!imageFile}
            >
              Upload Image
            </button>
          ) : (
            <p>Uploading...</p>
          )}
        </div>
        
        {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '400px', 
              margin: '10px auto', 
              display: 'block' 
            }} 
          />
        )}
        
        {chatbotResponse && (
          <div className="chatbot-response" style={{ 
            marginTop: '20px', 
            backgroundColor: '#1cc0a7', 
            padding: '15px', 
            borderRadius: '8px', 
            color: 'white' 
          }}>
            <h3>Diagnosis: {chatbotResponse.diagnosis}</h3>
            <p>{chatbotResponse.information}</p>
          </div>
        )}
      </div>
    )
  );
};

const App = () => {
  const user = useAuth();

  return (
    <div className="page">
      <Navbar 
        user={user} 
        signInWithGoogle={signInWithGoogle} 
        signOutUser={signOutUser} 
      />
      <HeroSection />
      <Features />
      {user && <UploadScan user={user} />}
    </div>
  );
};

export default App;