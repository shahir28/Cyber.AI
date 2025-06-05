from flask import Flask, request, jsonify
import joblib
import pandas as pd
import hashlib
import os
from sklearn.ensemble import IsolationForest

app = Flask(__name__)

# Ensure the models directory exists
os.makedirs('models', exist_ok=True)

# Load models
log_analysis_model = joblib.load("models/log_analysis_model.pkl")
file_integrity_model = joblib.load("models/file_integrity_model.pkl")
url_phishing_model = joblib.load("models/url_phishing_model.pkl")
url_vectorizer = joblib.load("models/url_vectorizer.pkl")

@app.route('/analyze_logs', methods=['POST'])
def analyze_logs():
    try:
        data = request.json
        logs = pd.DataFrame(data['logs'])
        features = logs.iloc[:, :-1]
        predictions = log_analysis_model.predict(features)
        anomalies = logs[predictions == -1]
        return jsonify({
            'total_anomalies': len(anomalies),
            'anomalies': anomalies.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'error': str(e)})

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

        # Create a DataFrame with the file hash
        file_data = pd.DataFrame({'hash': [file_hash]})

        # Predict anomalies
        predictions = file_integrity_model.predict(file_data)
        anomalies = file_data[predictions == -1]

        return jsonify({
            'total_anomalies': len(anomalies),
            'anomalies': anomalies.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/detect_phishing', methods=['POST'])
def detect_phishing():
    try:
        data = request.json
        urls = pd.DataFrame(data['urls'], columns=['url'])
        url_features = url_vectorizer.transform(urls['url'])
        predictions = url_phishing_model.predict(url_features)
        results = []
        for url, prediction in zip(urls['url'], predictions):
            result = {
                'url': url,
                'label': 'bad' if prediction == 1 else 'good'
            }
            results.append(result)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5001)