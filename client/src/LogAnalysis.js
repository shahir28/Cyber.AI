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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a log file.");
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
      });
      
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResponse(res.data);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-analysis-container">
      <h1>Log Analysis</h1>
      <form onSubmit={handleSubmit} className="log-analysis-form">
        <label htmlFor="file-input">Upload Log File:</label>
        <input type="file" id="file-input" onChange={handleFileChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Analyze</button>
      </form>
      {loading && <div className="spinner"></div>}
      {response && (
        <div className="response">
          <h2>Analysis Result:</h2>
          <p>Total Logs Analyzed: {response.total_logs}</p>
          <p>Anomalies Detected: {response.total_anomalies}</p>
          {response.total_anomalies > 0 ? (
            <div>
              <h3>Detected Anomalies:</h3>
              {response.anomalies.map((anomaly, index) => (
                <div key={index} className="anomaly-item">
                  <p><strong>Line Number:</strong> {anomaly.line_number}</p>
                  <p><strong>Message:</strong> {anomaly.message}</p>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <p>No anomalies detected in the log file.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default LogAnalysis;