import React, { useState } from "react";
import axios from "axios";

function ImageAnalysis() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an image file.");
      return;
    }
    setError("");
    setResponse("Loading...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5001/analyze_image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error occurred while processing.");
    }
  };

  return (
    <div>
      <h1>Forensic Image Analysis</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-input">Upload Image:</label>
        <input type="file" id="file-input" accept="image/*" onChange={handleFileChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Analyze Image</button>
      </form>
      {response && response !== "Error occurred while processing." && (
        <div className="response">
          <h2>Analysis Result:</h2>
          <div>
            <h3>Metadata (EXIF):</h3>
            {!response.metadata ? (
              <p>No metadata available</p>
            ) : typeof response.metadata === 'string' ? (
              <p>{response.metadata}</p>
            ) : (
              <div className="metadata-container">
                {Object.entries(response.metadata || {}).map(([key, value]) => (
                  <div key={key} className="metadata-item">
                    <strong>{key}:</strong> {value || 'N/A'}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3>Image Hash:</h3>
            <p>{response.image_hash || 'N/A'}</p>
          </div>
          <div>
            <h3>Tampering Detected:</h3>
            <p>{response.tampering_detected || 'N/A'}</p>
          </div>
        </div>
      )}
      {response === "Error occurred while processing." && (
        <div className="response">
          <h2>{response}</h2>
        </div>
      )}
    </div>
  );
}

// Add some CSS styles
const styles = `
.metadata-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}

.metadata-item {
  margin-bottom: 5px;
  padding: 5px;
  border-bottom: 1px solid #eee;
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ImageAnalysis;