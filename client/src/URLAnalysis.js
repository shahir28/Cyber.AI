import React, { useState } from "react";
import axios from "axios";
import "./URLAnalysis.css";

function URLAnalysis() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Please enter a URL to analyze.");
      return;
    }
    setError("");
    setResponse("Loading...");
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
      setResponse(result.label === 'bad' ? 'Bad (Phishing)' : 'Good (Safe)');
    } catch (error) {
      console.error("Detailed error:", error);
      setError("Failed to analyze URL. Please try again.");
      setResponse("");
    }
  };

  return (
    <div className="url-analysis-container">
      <h1>URL Analysis</h1>
      <form onSubmit={handleSubmit} className="url-analysis-form">
        <label htmlFor="text-input">Enter URL for Analysis:</label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your URL here..."
          rows="5"
          cols="50"
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Analyze</button>
      </form>
      {response && (
        <div className="response">
          <h2>Analysis Result:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default URLAnalysis;