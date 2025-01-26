import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logoContainer">
        <h1>Healthify</h1>
      </div>
      <div className="navLinks">
        <a href="#features">Features</a>
        <a href="#cta">Get the App</a>
        <a href="https://github.com">GitHub</a>
      </div>
    </nav>
  );
};

export default Navbar;