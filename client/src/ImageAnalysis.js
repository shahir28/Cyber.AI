
import React, { useState } from "react";
import axios from "axios";

function ImageAnalysis() {
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
      setError("Please upload an image file for forensic analysis.");
      return;
    }
    
    setError("");
    setResponse(null);
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await axios.post("http://localhost:5001/analyze_image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      });
      setResponse(res.data);
    } catch (error) {
      console.error("Error:", error);
      setError("Error occurred while processing image analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-analysis-container">
      <h1>🖼️ Forensic Image Analysis</h1>
      
      <div className="model-description fade-in">
        <div className="description-card">
          <h2>🔍 Digital Forensics & Metadata Extraction</h2>
          <p>Our advanced image forensics system combines metadata analysis, steganography detection, and tampering identification to provide comprehensive digital evidence analysis.</p>
          
          <div className="features-grid">
            <div className="feature-item">
              <h3>🎯 What Makes It Stand Out</h3>
              <ul>
                <li><strong>EXIF Deep Analysis:</strong> Extracts and analyzes comprehensive metadata</li>
                <li><strong>Tampering Detection:</strong> Identifies digital manipulation and editing</li>
                <li><strong>Steganography Scanning:</strong> Detects hidden data within images</li>
                <li><strong>Chain of Custody:</strong> Maintains forensic integrity standards</li>
              </ul>
            </div>
            
            <div className="feature-item">
              <h3>🔬 Analysis Capabilities</h3>
              <ul>
                <li>Camera fingerprinting and device identification</li>
                <li>Timestamp verification and geolocation extraction</li>
                <li>Image manipulation detection (copy-move, splicing)</li>
                <li>Compression artifacts and quality analysis</li>
              </ul>
            </div>
          </div>
          
          <div className="tech-specs">
            <h3>⚡ Technical Specifications</h3>
            <div className="specs-grid">
              <span><strong>Supported Formats:</strong> JPEG, PNG, TIFF, RAW, HEIC</span>
              <span><strong>Hash Generation:</strong> SHA-256, MD5, Perceptual</span>
              <span><strong>Metadata Standards:</strong> EXIF, IPTC, XMP</span>
              <span><strong>Max Resolution:</strong> Up to 100MP images</span>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="log-analysis-form fade-in">
        <label htmlFor="file-input">Upload Image for Forensic Analysis:</label>
        <input 
          type="file" 
          id="file-input" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={loading}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading || !file}>
          {loading ? 'Analyzing Image...' : 'Analyze Image'}
        </button>
      </form>
      
      {loading && <div className="spinner"></div>}
      
      {response && response !== "Error occurred while processing." && (
        <div className="response slide-up">
          <h2>📊 Forensic Analysis Results</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>📋 Image Metadata (EXIF)</h3>
            {!response.metadata ? (
              <p className="status-warning">No metadata available</p>
            ) : typeof response.metadata === 'string' ? (
              <p className="status-good">{response.metadata}</p>
            ) : (
              <div className="anomaly-item">
                {Object.entries(response.metadata || {}).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong> {value || 'N/A'}
                  </p>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>🔒 Image Hash</h3>
            <div className="anomaly-item">
              <p style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {response.image_hash || 'N/A'}
              </p>
            </div>
          </div>
          
          <div>
            <h3>🔍 Tampering Detection</h3>
            <p className={response.tampering_detected === 'Yes' ? 'status-danger' : 'status-good'}>
              <strong>Status:</strong> {response.tampering_detected || 'N/A'}
            </p>
          </div>
        </div>
      )}
      
      {response === "Error occurred while processing." && (
        <div className="response">
          <div className="error">
            Failed to process image. Please ensure the file is a valid image format.
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageAnalysis;
