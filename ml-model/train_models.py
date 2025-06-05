import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
import re

# Dummy data for log analysis
log_data = pd.DataFrame({
    'feature1': [1, 2, 3, 4, 5],
    'feature2': [5, 4, 3, 2, 1],
    'label': [0, 0, 1, 0, 1]
})
log_features = log_data[['feature1', 'feature2']]
log_labels = log_data['label']
log_model = IsolationForest(n_estimators=100, contamination=0.2)
log_model.fit(log_features)
# Save feature names with the model
log_model.feature_names_in_ = log_features.columns
joblib.dump(log_model, 'models/log_analysis_model.pkl')

# Dummy data for file integrity monitoring
file_data = pd.DataFrame({
    'hash1': [0.1, 0.2, 0.3, 0.4, 0.5],
    'hash2': [0.5, 0.4, 0.3, 0.2, 0.1],
    'label': [0, 0, 1, 0, 1]
})
file_features = file_data[['hash1', 'hash2']]
file_labels = file_data['label']
file_model = IsolationForest(n_estimators=100, contamination=0.2)
file_model.fit(file_features)
joblib.dump(file_model, 'models/file_integrity_model.pkl')

# Function to preprocess URLs consistently
def preprocess_url(url):
    url = url.lower()
    url = re.sub(r'^https?:\/\/', '', url)
    url = re.sub(r'^www\.', '', url)
    return url

# Dummy data for URL phishing detection
url_data = pd.DataFrame({
    'url': ['http://example.com', 'http://phishing.com', 'http://safe.com'],
    'label': [0, 1, 0]
})
url_data['url'] = url_data['url'].apply(preprocess_url)
vectorizer = CountVectorizer(analyzer='char_wb', ngram_range=(3, 5))
url_features = vectorizer.fit_transform(url_data['url'])
url_labels = url_data['label']
url_model = MultinomialNB()
url_model.fit(url_features, url_labels)
# Save the trained model and vectorizer to the 'models' directory
joblib.dump(url_model, 'models/url_phishing_model.pkl')
joblib.dump(vectorizer, 'models/url_vectorizer.pkl')