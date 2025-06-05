import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <h1 className="main-title">CYBER.AI</h1>
        <p className="project-description">
          Welcome to the AI-Integrated Cybersecurity Threat Detection System. Our platform provides advanced tools for URL Analysis, Log Analysis, Image Analysis ,File Integrity to detect potential security threats. Navigate through the options below to get started.
        </p>
      </header>
      <nav className="navigation">
        <ul className="nav-links">
          <li>
            <Link to="/url-analysis" className="nav-link">URL Analysis</Link>
          </li>
          <li>
            <Link to="/log-analysis" className="nav-link">Log Analysis</Link>
          </li>
          <li>
            <Link to="/file-integrity" className="nav-link">File Integrity</Link>
          </li>
        </ul>
      </nav>
      <section className="features">
        <h2>Features</h2>
        <ul>
          <li>Forensic Image Analysis</li>
          <li>URL Analysis</li>
          <li>Log Analysis</li>
          <li>File Integrity Monitoring</li>
          <li>Detailed reporting and alerts</li>
        </ul>
      </section>
      <footer className="footer">
        <p>&copy; 2024 AI-Integrated Cybersecurity Threat Detection System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;