
import React, { useState } from "react";
import axios from "axios";
import "./LogAnalysis.css";

function LogAnalysis() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a log file for analysis.");
      return;
    }
    
    setError("");
    setResponse(null);
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await axios.post("http://localhost:5001/analyze_logs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });
      
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResponse(res.data);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.error || "An unexpected error occurred during analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-analysis-container">
      <h1>Security Log Analysis</h1>
      
      <form onSubmit={handleSubmit} className="log-analysis-form fade-in">
        <label htmlFor="file-input">Upload Security Log File:</label>
        <input 
          type="file" 
          id="file-input" 
          onChange={handleFileChange}
          accept=".log,.txt"
          disabled={loading}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading || !file}>
          {loading ? 'Analyzing Logs...' : 'Analyze Security Logs'}
        </button>
      </form>
      
      {loading && <div className="spinner"></div>}
      
      {response && (
        <div className="response slide-up">
          <h2>Security Analysis Results</h2>
          <p className="status-good">
            <strong>Total Logs Processed:</strong> {response.total_logs}
          </p>
          <p className={response.total_anomalies > 0 ? 'status-danger' : 'status-good'}>
            <strong>Security Anomalies Detected:</strong> {response.total_anomalies}
          </p>
          
          {response.total_anomalies > 0 ? (
            <div>
              <h3>🚨 Security Threats Detected</h3>
              {response.anomalies.map((anomaly, index) => (
                <div key={index} className="anomaly-item">
                  <p><strong>Line Number:</strong> {anomaly.line_number}</p>
                  <p><strong>Threat Description:</strong> {anomaly.message}</p>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <div className="status-good">
              <h3>✅ No Security Threats Detected</h3>
              <p>Your log file appears to be clean with no suspicious activities detected.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LogAnalysis;
