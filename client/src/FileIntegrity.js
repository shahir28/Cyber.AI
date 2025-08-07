
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
      <h1> File Integrity Monitoring</h1>
      
      <div className="model-description fade-in">
        <div className="description-card">
          <h2>🔐 Advanced File Tampering Detection</h2>
          <p>Our comprehensive file integrity system uses cryptographic hashing and behavioral analysis to detect unauthorized modifications, ensuring your critical files remain secure.</p>
          
          <div className="features-grid">
            <div className="feature-item">
              <h3>🎯 What Makes It Stand Out</h3>
              <ul>
                <li><strong>Multi-Hash Verification:</strong> Uses SHA-256 and MD5 for comprehensive checking</li>
                <li><strong>Baseline Learning:</strong> Establishes normal file behavior patterns</li>
                <li><strong>Real-time Monitoring:</strong> Instant detection of unauthorized changes</li>
                <li><strong>Forensic Analysis:</strong> Detailed change tracking and attribution</li>
              </ul>
            </div>
            
            <div className="feature-item">
              <h3>🔬 Protection Features</h3>
              <ul>
                <li>Cryptographic hash verification for tamper detection</li>
                <li>File permission and metadata monitoring</li>
                <li>Binary analysis for malware injection detection</li>
                <li>Historical change tracking and audit trails</li>
              </ul>
            </div>
          </div>
          
          <div className="tech-specs">
            <h3>⚡ Technical Specifications</h3>
            <div className="specs-grid">
              <span><strong>Hash Algorithms:</strong> SHA-256, MD5, CRC32</span>
              <span><strong>File Types:</strong> All formats supported</span>
              <span><strong>Max File Size:</strong> Up to 10GB per file</span>
              <span><strong>Detection Time:</strong> Real-time processing</span>
            </div>
          </div>
        </div>
      </div>
      
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
