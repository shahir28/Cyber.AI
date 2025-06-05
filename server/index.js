const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');  // Add this line

const app = express();

app.use(cors());  // Add this line
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint for URL phishing detection
app.post('/detect_phishing', async (req, res) => {
  try {
    console.log('Received request for URL analysis:', req.body);
    
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls)) {
      throw new Error('Invalid or missing URLs array');
    }

    console.log('Sending request to Flask server...');
    const response = await axios.post(
      'http://localhost:5001/detect_phishing',
      { urls },
      { 
        timeout: 30000,  // Increased timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.data) {
      throw new Error('No data received from Flask server');
    }

    console.log('Received response from Flask server:', response.data);
    const results = response.data.map((prediction, index) => ({
      url: urls[index],
      label: prediction.label // Use the label directly from the response
    }));

    console.log('Sending response to client:', results);
    res.json(results);
  } catch (error) {
    console.error('Detailed error:', error);
    const errorMessage = error.response?.data?.error || 
                        error.message || 
                        'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

// Remove any additional comments or modifications related to CORS if unnecessary
// Ensure that the Flask server URL in axios requests matches the original configuration

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});