from flask import Flask, request, jsonify
from flask_cors import CORS  # Add this import
import joblib
import pandas as pd
import re
import io
import numpy as np
import sys
import logging
import hashlib
from sklearn.preprocessing import StandardScaler
import os
from PIL import Image
from PIL.ExifTags import TAGS

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load models with error handling
try:
    log_analysis_model = joblib.load("models/log_analysis_model.pkl")
    file_integrity_model = joblib.load("models/file_integrity_model.pkl")
    url_phishing_model = joblib.load("models/url_phishing_model.pkl")
    url_vectorizer = joblib.load("models/url_vectorizer.pkl")
    image_analysis_model = joblib.load("models/image_analysis_model.pkl")
    logger.info("Models loaded successfully.")
except Exception as e:
    logger.error(f"Error loading models: {e}")
    sys.exit(1)

# Remove the scaler loading if it was previously added
# try:
#     scaler = joblib.load("models/scaler.pkl")
# except FileNotFoundError as e:
#     logger.error(f"Error loading scaler: {e}")
#     sys.exit(1)

def preprocess_url_matching(url):
    """
    Preprocess URL for matching by lowercasing and stripping trailing slashes and whitespace.
    """
    url = url.lower().strip().rstrip('/')
    return url

# Load the phishing_site_urls.csv dataset
try:
    phishing_urls_df = pd.read_csv('D:/cybernw/ml-model/phishing_site_urls.csv', on_bad_lines='skip')
    logger.info("Phishing URLs loaded successfully.")

    # Create a dictionary mapping preprocessed URLs to labels
    phishing_urls_dict = phishing_urls_df.set_index(
        phishing_urls_df['url'].apply(preprocess_url_matching)
    )['label'].to_dict()
except pd.errors.ParserError as e:
    logger.error(f"Error reading the CSV file: {e}")
    sys.exit(1)

# Define the same preprocess_url function
def preprocess_url(url):
    url = url.lower()
    url = re.sub(r'^https?:\/\/', '', url)
    url = re.sub(r'^www\.', '', url)
    return url

# Update expected features to match training
expected_features = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5']

# Define preprocess_log_data function
def preprocess_log_data(log_data):
    log_lines = log_data.strip().split('\n')
    log_entries = []
    
    # Updated pattern to match your log format
    log_pattern = r'^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+(\S+):\s+\[(\d+)\]\s+(.*)$'
    
    for line in log_lines:
        match = re.match(log_pattern, line)
        if match:
            timestamp, source, process, pid, message = match.groups()
            entry = {
                'timestamp': timestamp,
                'source': source,
                'process': process,
                'pid': pid,
                'message': message,
                # Use same feature names as training
                'feature1': len(message),  # Message length
                'feature2': len(re.findall(r'\b(?:error|critical|warning|fatal)\b', message.lower())),  # Severity keywords
                'feature3': len(re.findall(r'[A-Z]', message)),  # Uppercase letters
                'feature4': len(re.findall(r'[!@#$%^&*(),.?":{}|<>]', message)),  # Special characters
                'feature5': 1 if re.search(r'\b(?:unauthorized|failure|crash|error)\b', message.lower()) else 0  # Security keywords
            }
            log_entries.append(entry)
    
    if not log_entries:
        logger.warning("No log entries matched the expected format")
        
    return pd.DataFrame(log_entries)

# Revert the analyze_logs function to use IsolationForest
@app.route('/analyze_logs', methods=['POST'])
def analyze_logs():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Read log file content
        log_content = file.read().decode('utf-8')
        
        # Preprocess logs to extract messages
        logs_df = preprocess_log_data(log_content)
        messages = logs_df['message'].tolist()
        
        if not messages:
            return jsonify({'error': 'No log messages found'}), 400
        
        # Extract features for prediction
        X = logs_df[expected_features]
        
        # Scale features
        # X_scaled = scaler.transform(X)  # Remove scaling if not using scaler
        
        # Predict anomalies using IsolationForest
        predictions = log_analysis_model.predict(X)
        scores = log_analysis_model.decision_function(X)
        
        # Mark entries as anomalies where prediction is -1
        anomalies = []
        for idx, (pred, score) in enumerate(zip(predictions, scores)):
            if pred == -1:
                anomaly = {
                    'timestamp': logs_df.iloc[idx]['timestamp'],
                    'source': logs_df.iloc[idx]['source'],
                    'process': logs_df.iloc[idx]['process'],
                    'message': logs_df.iloc[idx]['message'],
                    'anomaly_score': float(-score)  # Convert score to anomaly score
                }
                anomalies.append(anomaly)

        return jsonify({
            'total_logs': len(logs_df),
            'total_anomalies': len(anomalies),
            'anomalies': anomalies
        })

    except Exception as e:
        logger.error(f"Error in analyze_logs: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/check_file_integrity', methods=['POST'])
def check_file_integrity():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Calculate file hash
        file_content = file.read()
        file_hash = hashlib.sha256(file_content).hexdigest()

        # For demonstration, we'll check if the hash exists in a dummy dataset
        # In a real scenario, you would compare against stored hashes
        dummy_hashes = {
            'existing_hash': '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
        }

        tampering_detected = "Yes" if file_hash not in dummy_hashes.values() else "No tampering detected"

        return jsonify({
            'file_hash': file_hash,
            'tampering_detected': tampering_detected
        })
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/detect_phishing', methods=['POST'])
def detect_phishing():
    try:
        data = request.json
        input_urls = data['urls']
        results = []

        for url in input_urls:
            preprocessed_url = preprocess_url_matching(url)
            if (preprocessed_url in phishing_urls_dict):
                label = phishing_urls_dict[preprocessed_url]
                label = 'bad' if label.lower() == 'bad' else 'good'
            else:
                url_features = url_vectorizer.transform([url])
                prediction = url_phishing_model.predict(url_features)[0]
                label = 'bad' if prediction == 1 else 'good'
            results.append({
                'url': url,
                'label': label
            })

        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in detect_phishing: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/preprocess_logs', methods=['POST'])
def preprocess_logs():
    try:
        log_data = request.data.decode('utf-8')
        logs_df = preprocess_log_data(log_data)
        return jsonify(logs_df.to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/analyze_image', methods=['POST'])
def analyze_image():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Initialize metadata as empty dict
        metadata = {}
        
        try:
            image = Image.open(file)
            
            if hasattr(image, '_getexif') and image._getexif() is not None:
                exif_data = image._getexif()
                for tag_id in exif_data:
                    tag = TAGS.get(tag_id, tag_id)
                    value = exif_data.get(tag_id)
                    if isinstance(value, bytes):
                        try:
                            value = value.decode()
                        except UnicodeDecodeError:
                            value = str(value)
                    metadata[str(tag)] = str(value)  # Ensure both key and value are strings
            
            if not metadata:
                metadata = {"info": "No EXIF metadata found in the image"}
                
        except Exception as img_error:
            logger.error(f"Error processing image metadata: {str(img_error)}")
            metadata = {"error": "Failed to process image metadata"}

        # Calculate image hash
        file.seek(0)
        image_content = file.read()
        image_hash = hashlib.sha256(image_content).hexdigest()

        return jsonify({
            'metadata': metadata,
            'image_hash': image_hash,
            'tampering_detected': "No tampering detected"
        })
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return jsonify({
            'metadata': {"error": "Failed to process image"},
            'image_hash': None,
            'tampering_detected': "Error during analysis"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Ensure Flask is running on port 5001