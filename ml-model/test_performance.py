import joblib
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import pandas as pd
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_url_phishing_model():
    logger.info("Testing URL Phishing Model Performance...")
    
    # Load model and vectorizer
    model = joblib.load("models/url_phishing_model.pkl")
    vectorizer = joblib.load("models/url_vectorizer.pkl")
    
    # Load test data
    test_urls = pd.read_csv('D:/cybernw/ml-model/phishing_site_urls.csv')
    X_test = test_urls['url'].values
    y_true = (test_urls['label'] == 'bad').astype(int)
    
    # Measure prediction time
    start_time = time.time()
    X_vectorized = vectorizer.transform(X_test)
    y_pred = model.predict(X_vectorized)
    prediction_time = time.time() - start_time
    
    # Calculate metrics
    accuracy = accuracy_score(y_true, y_pred)
    conf_matrix = confusion_matrix(y_true, y_pred)
    class_report = classification_report(y_true, y_pred)
    
    logger.info(f"\nURL Phishing Model Metrics:")
    logger.info(f"Accuracy: {accuracy:.4f}")
    logger.info(f"Average prediction time: {prediction_time/len(X_test):.4f} seconds per URL")
    logger.info(f"\nConfusion Matrix:\n{conf_matrix}")
    logger.info(f"\nClassification Report:\n{class_report}")

def test_log_analysis_model():
    logger.info("\nTesting Log Analysis Model Performance...")
    
    # Load model
    model = joblib.load("models/log_analysis_model.pkl")
    
    # Generate test data with known anomalies
    test_logs = [
        "System started normally",
        "Error: Database connection failed",
        "Critical: System crash detected",
        "User logged in successfully",
        "Warning: High CPU usage"
    ]
    
    # Measure prediction time
    start_time = time.time()
    predictions = model.predict(test_logs)
    prediction_time = time.time() - start_time
    
    # Count anomalies
    anomaly_count = sum(1 for pred in predictions if pred == -1)
    
    logger.info(f"\nLog Analysis Model Metrics:")
    logger.info(f"Number of logs analyzed: {len(test_logs)}")
    logger.info(f"Number of anomalies detected: {anomaly_count}")
    logger.info(f"Average prediction time: {prediction_time/len(test_logs):.4f} seconds per log")

def test_image_analysis_model():
    logger.info("\nTesting Image Analysis Model Performance...")
    
    # Load model
    model = joblib.load("models/image_analysis_model.pkl")
    
    # Test with sample image metadata
    sample_metadata = {
        "Make": "Canon",
        "Model": "EOS 5D",
        "DateTime": "2023:01:01 12:00:00"
    }
    
    # Measure processing time
    start_time = time.time()
    # Add your image analysis logic here
    processing_time = time.time() - start_time
    
    logger.info(f"\nImage Analysis Model Metrics:")
    logger.info(f"Processing time: {processing_time:.4f} seconds")

if __name__ == "__main__":
    try:
        test_url_phishing_model()
        test_log_analysis_model()
        test_image_analysis_model()
    except Exception as e:
        logger.error(f"Error during performance testing: {str(e)}")
