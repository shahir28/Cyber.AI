
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container fade-in">
      <header className="header">
        <h1 className="main-title">CYBER.AI</h1>
        <p className="project-description">
          Advanced AI-Integrated Cybersecurity Threat Detection Platform. 
          Protect your digital assets with cutting-edge machine learning algorithms 
          for comprehensive security analysis and real-time threat detection.
        </p>
      </header>
      
      <nav className="navigation">
        <ul className="nav-links">
          <li>
            <Link to="/url-analysis" className="nav-link">
              <h3>🔗 URL Analysis</h3>
              <p>Detect phishing and malicious URLs using advanced ML models</p>
            </Link>
          </li>
          <li>
            <Link to="/log-analysis" className="nav-link">
              <h3>📋 Log Analysis</h3>
              <p>Analyze system logs for security anomalies and threats</p>
            </Link>
          </li>
          <li>
            <Link to="/file-integrity" className="nav-link">
              <h3>🛡️ File Integrity</h3>
              <p>Monitor and verify file integrity with hash analysis</p>
            </Link>
          </li>
          <li>
            <Link to="/image-analysis" className="nav-link">
              <h3>🖼️ Image Analysis</h3>
              <p>Forensic image analysis with metadata extraction</p>
            </Link>
          </li>
        </ul>
      </nav>
      
      <section className="features">
        <h2>Platform Features</h2>
        <ul>
          <li>Real-time Threat Detection</li>
          <li>Machine Learning-Powered Analysis</li>
          <li>Comprehensive Security Monitoring</li>
          <li>Advanced Forensic Capabilities</li>
          <li>Detailed Security Reports</li>
          <li>Enterprise-Grade Security</li>
        </ul>
      </section>
      
      <footer className="footer">
        <p>&copy; 2024 CYBER.AI - Advanced Cybersecurity Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
