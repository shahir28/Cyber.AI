import pandas as pd
import joblib
import re
import logging
import os
from sklearn.ensemble import IsolationForest

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Define preprocess_log_data function (same as in app.py)
def preprocess_log_data(log_data):
    log_lines = log_data.strip().split('\n')
    log_entries = []
    
    # Use same pattern as in app.py
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
                # Use original feature names
                'feature1': len(message),  # Message length
                'feature2': len(re.findall(r'\b(?:error|critical|warning|fatal)\b', message.lower())),  # Severity keywords
                'feature3': len(re.findall(r'[A-Z]', message)),  # Uppercase letters
                'feature4': len(re.findall(r'[!@#$%^&*(),.?":{}|<>]', message)),  # Special characters
                'feature5': 1 if re.search(r'\b(?:unauthorized|failure|crash|error)\b', message.lower()) else 0  # Security keywords
            }
            log_entries.append(entry)
    
    return pd.DataFrame(log_entries)

# Define expected features globally with original names
expected_features = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5']

# Load and preprocess training data
try:
    with open(r"C:\Users\Shahir\Downloads\sys.log", 'r') as file:
        log_data = file.read()
    logger.info("Training logs loaded successfully.")
except FileNotFoundError as e:
    logger.error(f"Error loading training logs: {e}")
    exit(1)

logs_df = preprocess_log_data(log_data)
X_train = logs_df[expected_features]  # Use the correct feature names

# Log the updated training features statistics
logger.debug(f"Updated Training Features Summary:\n{X_train.describe()}")

# Train IsolationForest model
model = IsolationForest(n_estimators=100, contamination='auto', random_state=42)
model.fit(X_train)
joblib.dump(model, "models/log_analysis_model.pkl")
logger.info("IsolationForest model saved successfully")

# Create and save a dummy scaler
class DummyScaler:
    def transform(self, X):
        return X
    def fit_transform(self, X):
        return X

scaler = DummyScaler()
joblib.dump(scaler, "models/scaler.pkl")
logger.info("Dummy scaler saved successfully")
