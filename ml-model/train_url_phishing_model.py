import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report
import os
import joblib
import re
import sys
from sklearn.model_selection import train_test_split

# Ensure the models directory exists
os.makedirs('models', exist_ok=True)

# Function to preprocess URLs consistently
def preprocess_url(url):
    url = url.lower()
    url = re.sub(r'^https?:\/\/', '', url)
    url = re.sub(r'^www\.', '', url)
    return url

# Load the dataset
try:
    dataset = pd.read_csv('D:/cybernw/ml-model/phishing_site_urls.csv', on_bad_lines='skip')
    print("Columns in the dataset:", dataset.columns)
except pd.errors.ParserError as e:
    print(f"Error reading the CSV file: {e}")
    sys.exit(1)

# Check if the expected columns are present
if 'url' not in dataset.columns or 'label' not in dataset.columns:
    print("Error: The dataset does not contain the required 'url' and 'label' columns.")
    sys.exit(1)

# Check the distribution of labels
print(dataset['label'].value_counts())

# Ensure the dataset is balanced
phishing = dataset[dataset['label'] == 'bad']
safe = dataset[dataset['label'] == 'good']

# Balance the dataset by undersampling the majority class
if len(phishing) > len(safe):
    phishing = phishing.sample(len(safe))
else:
    safe = safe.sample(len(phishing))

balanced_dataset = pd.concat([phishing, safe])

# Extract features and labels
urls = balanced_dataset['url'].apply(preprocess_url)
labels = balanced_dataset['label'].apply(lambda x: 1 if x == 'bad' else 0)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(urls, labels, test_size=0.2, random_state=42)

# Configure CountVectorizer to better handle URLs
vectorizer = CountVectorizer(analyzer='char_wb', ngram_range=(3, 5))
X_train_features = vectorizer.fit_transform(X_train)
X_test_features = vectorizer.transform(X_test)

# Train the model
model = MultinomialNB()
model.fit(X_train_features, y_train)

# Evaluate the model
predictions = model.predict(X_test_features)
print(classification_report(y_test, predictions))

# Save the model and vectorizer
joblib.dump(model, 'models/url_phishing_model.pkl')
joblib.dump(vectorizer, 'models/url_vectorizer.pkl')