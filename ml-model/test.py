import joblib

import pandas as pd
import re

# Load models
url_phishing_model = joblib.load("models/url_phishing_model.pkl")
url_vectorizer = joblib.load("models/url_vectorizer.pkl")

# Preprocess log data
def preprocess_log_data(log_data):
    log_lines = log_data.strip().split('\n')
    log_entries = []
    for line in log_lines:
        parts = re.split(r'\s+', line, maxsplit=5)
        if len(parts) == 6:
            log_entries.append({
                'timestamp': f"{parts[0]} {parts[1]}",
                'source': parts[2],
                'kernel': parts[3],
                'pid': parts[4],
                'message': parts[5]
            })
    return pd.DataFrame(log_entries)

# Test URLs
test_urls = [
    "promoclub737.com/",
    "pubs.usgs.gov/ds/2005/127/",
    "www.apcf.pt/xmlrpc/DiaeNoite.html?perfil3435430=5",
    "horizonsgallery.com/js/bin/ssl1/_id/www.paypal.com/fr/cgi-bin/webscr/cmd=_registration-run/login.php?cmd=_login-run&dispatch=1471c4bdb044ae2be9e2fc3ec514b88b1471c4bdb044ae2be9e2fc3ec514b88b"
]

# Vectorize the URLs
url_features = url_vectorizer.transform(test_urls)

# Predict
predictions = url_phishing_model.predict(url_features)

# Print results
for url, prediction in zip(test_urls, predictions):
    print(f"URL: {url} - {'Bad (Phishing)' if prediction == 1 else 'Good (Safe)'}")
    