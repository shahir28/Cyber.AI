import joblib
import pandas as pd
import re

# Load the IsolationForest model
model = joblib.load("models/log_analysis_model.pkl")

# Sample log messages
log_messages = [
    "System started successfully.",
    "Fatal error: unable to connect to database.",
    "User login failed due to invalid credentials.",
    "Scheduled maintenance at midnight.",
    "Unauthorized access attempt detected.",
    "Service running smoothly."
]

# Preprocess log messages to extract features
def preprocess_log_messages(log_messages):
    log_entries = []
    for message in log_messages:
        entry = {
            'feature1': len(message),
            'feature2': len(re.findall(r'\b(?:error|critical|warning|fatal)\b', message.lower())),
            'feature3': len(re.findall(r'[A-Z]', message)),
            'feature4': len(re.findall(r'[!@#$%^&*(),.?":{}|<>]', message)),
            'feature5': 1 if re.search(r'\b(?:unauthorized|failure|crash|error)\b', message.lower()) else 0
        }
        log_entries.append(entry)
    return pd.DataFrame(log_entries)

# Extract features
X = preprocess_log_messages(log_messages)

# Load scaler
scaler = joblib.load("models/scaler.pkl")
X_scaled = scaler.transform(X)

# Predict anomalies using IsolationForest
predictions = model.predict(X_scaled)

# Output results
for idx, (message, prediction) in enumerate(zip(log_messages, predictions)):
    print("-----")
    print(f"Line {idx + 1}: {message}")
    print(f"Anomaly Detected: {'Yes' if prediction == -1 else 'No'}")
    print("-----")