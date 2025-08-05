
import React, { useState } from "react";
import axios from "axios";

function FileIntegrity() {
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
      setError("Please upload a file for integrity checking.");
      return;
    }
    
    setError("");
    setResponse(null);
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await axios.post("http://localhost:5001/check_file_integrity", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });
      setResponse(res.data);
    } catch (error) {
      console.error("Error:", error);
      setError("Error occurred while processing file integrity check.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-analysis-container">
      <h1>🛡️ File Integrity Monitoring</h1>
      
      <form onSubmit={handleSubmit} className="log-analysis-form fade-in">
        <label htmlFor="file-input">Upload File for Integrity Check:</label>
        <input 
          type="file" 
          id="file-input" 
          onChange={handleFileChange}
          disabled={loading}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading || !file}>
          {loading ? 'Checking Integrity...' : 'Check File Integrity'}
        </button>
      </form>
      
      {loading && <div className="spinner"></div>}
      
      {response && (
        <div className="response slide-up">
          <h2>🔍 Integrity Analysis Results</h2>
          {typeof response === 'string' ? (
            <p className="status-good">{response}</p>
          ) : (
            <>
              <p className={response.total_anomalies > 0 ? 'status-danger' : 'status-good'}>
                <strong>Total Anomalies Detected:</strong> {response.total_anomalies || 0}
              </p>
              {response.total_anomalies > 0 && (
                <div>
                  <h3>⚠️ Integrity Issues Found</h3>
                  <div className="anomaly-item">
                    <pre style={{
                      background: 'var(--accent-bg)',
                      padding: '1rem',
                      borderRadius: '8px',
                      overflow: 'auto',
                      color: 'var(--primary-text)',
                      fontSize: '0.9rem',
                      lineHeight: '1.4'
                    }}>
                      {JSON.stringify(response.anomalies, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default FileIntegrity;
