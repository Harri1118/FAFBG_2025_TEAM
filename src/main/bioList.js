import React from 'react';
import 'assets/css/main.css'; // Ensure this path is correct

const Biographies = () => {
  return (
    <div>
      {/* Header */}
      <a href="#menu" className="navPanelToggle">
        <span className="fa fa-bars"></span>
      </a>

      <header id="header" className="special">
        <h1>
          <strong><a href="index.html">ARCE:</a></strong> Albany Rural Cemetery Explorer
        </h1>
        <nav id="nav">
          <ul>
            <li><a href="index.html">home</a></li>
            <li><a href="graves.html">notable graves</a></li>
            <li><a href="explore.html">explore</a></li>
            <li><a href="about.html">about us</a></li>
          </ul>
        </nav>
      </header>

      <section id="banner">
        <h2>Burials represented in each themed tour</h2>
      </section>

      
    
    </div>
  );
};

export default Biographies;
