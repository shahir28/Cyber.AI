
import React, { useState } from "react";
import axios from "axios";
import "./URLAnalysis.css";

function URLAnalysis() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Please enter a URL to analyze.");
      return;
    }
    
    setError("");
    setLoading(true);
    setResponse("Analyzing URL...");
    
    try {
      console.log('Sending URL for analysis:', trimmedText);
      const res = await axios.post(
        "http://localhost:5000/detect_phishing",
        { urls: [trimmedText] },
        { 
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      console.log('Received response:', res.data);
      const result = res.data[0];
      setResponse(result.label === 'bad' ? '🚫 Bad (Phishing Detected)' : '✅ Good (Safe URL)');
    } catch (error) {
      console.error("Detailed error:", error);
      setError("Failed to analyze URL. Please check your connection and try again.");
      setResponse("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-analysis-container">
      <h1>URL Security Analysis</h1>
      
      <form onSubmit={handleSubmit} className="url-analysis-form fade-in">
        <label htmlFor="text-input">Enter URL for Security Analysis:</label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com or paste suspicious URL here..."
          rows="6"
          disabled={loading}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze URL'}
        </button>
      </form>
      
      {response && (
        <div className="response slide-up">
          <h2>Security Analysis Result</h2>
          <p className={response.includes('Good') ? 'status-good' : response.includes('Bad') ? 'status-danger' : ''}>
            {response}
          </p>
        </div>
      )}
    </div>
  );
}

export default URLAnalysis;
