
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
      <h1>📊 Security Log Analysis</h1>
      
      <div className="model-description fade-in">
        <div className="description-card">
          <h2>🛡️ Intelligent Threat Detection in System Logs</h2>
          <p>Our state-of-the-art anomaly detection system uses unsupervised machine learning to identify suspicious patterns and potential security threats in your system logs.</p>
          
          <div className="features-grid">
            <div className="feature-item">
              <h3>🎯 What Makes It Stand Out</h3>
              <ul>
                <li><strong>Unsupervised Learning:</strong> Detects unknown attack patterns without prior training</li>
                <li><strong>Real-time Processing:</strong> Analyzes thousands of log entries per second</li>
                <li><strong>Contextual Analysis:</strong> Understands log patterns across different systems</li>
                <li><strong>Adaptive Learning:</strong> Continuously improves with new data</li>
              </ul>
            </div>
            
            <div className="feature-item">
              <h3>🔍 Detection Capabilities</h3>
              <ul>
                <li>Failed authentication attempts and brute force attacks</li>
                <li>Privilege escalation and unauthorized access</li>
                <li>System crashes and abnormal service behavior</li>
                <li>Network intrusion and data exfiltration patterns</li>
              </ul>
            </div>
          </div>
          
          <div className="tech-specs">
            <h3>⚡ Technical Specifications</h3>
            <div className="specs-grid">
              <span><strong>Algorithm:</strong> Isolation Forest with Custom Features</span>
              <span><strong>Processing Speed:</strong> 10K+ logs/second</span>
              <span><strong>Memory Usage:</strong> Optimized for large datasets</span>
              <span><strong>Supported Formats:</strong> Syslog, Apache, Nginx, Custom</span>
            </div>
          </div>
        </div>
      </div>
      
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
