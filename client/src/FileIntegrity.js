import React, { useState } from "react";
import axios from "axios";

function FileIntegrity() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a file.");
      return;
    }
    setError("");
    setResponse("Loading...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5001/check_file_integrity", formData, { // Updated port to 5001
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
      <h1>File Integrity Monitoring</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-input">Upload File:</label>
        <input type="file" id="file-input" onChange={handleFileChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Check Integrity</button>
      </form>
      {response && (
        <div className="response">
          <h2>Analysis Result:</h2>
          {typeof response === 'string' ? (
            <p>{response}</p>
          ) : (
            <>
              <p>Total Anomalies: {response.total_anomalies || 0}</p>
              <pre>{JSON.stringify(response.anomalies, null, 2)}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default FileIntegrity;