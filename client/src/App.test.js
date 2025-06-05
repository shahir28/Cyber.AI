import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import URLAnalysis from "./URLAnalysis";
import LogAnalysis from "./LogAnalysis";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/url-analysis">URL Analysis</Link>
            </li>
            <li>
              <Link to="/log-analysis">Log Analysis</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/url-analysis" element={<URLAnalysis />} />
          <Route path="/log-analysis" element={<LogAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;