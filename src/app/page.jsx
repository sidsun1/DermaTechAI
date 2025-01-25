'use client';

import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOutUser } from './firebase'; // Firebase functions
import './styles.css'; // Global styles
import { ReactTyped } from 'react-typed';

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

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logoContainer">
        <h1>DermaTech AI</h1>
      </div>
      <div className="navLinks">
        <a href="#features">Features</a>
        <a href="#scan">Upload a Scan</a>
        <a href="https://github.com">GitHub</a>
      </div>
    </nav>
  );
};

const HeroSection = ({ signInWithGoogle, signOutUser, user }) => {
  return (
    <section id="hero" className="hero">
      <div className="typingContainer">
        <h1>
          <ReactTyped
            strings={[
              'Helping you stay healthy and secure.',
              'Explore ways to maintain your health.',
              'Monitor your health in real-time.',
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
};

const Features = () => {
  return (
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
};

const Main = ({ user, signInWithGoogle, signOutUser }) => {
  return (
    <main className="main">
      <HeroSection signInWithGoogle={signInWithGoogle} signOutUser={signOutUser} user={user} />
      <Features />
    </main>
  );
};

const App = () => {
  const user = useAuth();

  return (
    <div className="page">
      <Navbar />
      <Main user={user} signInWithGoogle={signInWithGoogle} signOutUser={signOutUser} />
    </div>
  );
};

export default App;