
# CYBER.AI - Advanced Cybersecurity Threat Detection Platform

A comprehensive AI-integrated cybersecurity platform featuring URL phishing detection, log analysis, file integrity checking, and image forensics analysis.

## 🚀 Features

- **URL Analysis**: AI-powered phishing detection using machine learning models
- **Log Analysis**: Security log monitoring and threat pattern recognition  
- **File Integrity**: Hash-based file verification and tamper detection
- **Image Analysis**: Digital forensics and metadata extraction

## 🏗️ Architecture

```
cybersecurity-platform/
├── client/          # React frontend (Port 3000)
├── server/          # Express.js backend API (Port 5001)
├── ml-model/        # Python ML services (Port 5000)
└── README.md
```

## 📋 Prerequisites

- **Node.js** (v16+ recommended)
- **Python** (v3.8+ recommended)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd cybersecurity-platform
```

### 2. Install Frontend Dependencies
```bash
cd client
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../server
npm install
```

### 4. Install ML Service Dependencies
```bash
cd ../ml-model
pip install -r requirements.txt
```

## 🚀 Running the Application

### Option 1: Start All Services Individually

**Terminal 1 - Frontend (React)**
```bash
cd client
npm start
# Runs on http://localhost:3000
```

**Terminal 2 - Backend (Express)**
```bash
cd server
npm start
# Runs on http://localhost:5001
```

**Terminal 3 - ML Service (Python)**
```bash
cd ml-model
python app.py
# Runs on http://localhost:5000
```

### Option 2: Development Scripts (if available)
```bash
# Install all dependencies
npm run install:all

# Start all services concurrently
npm run dev:all
```

## 🔧 API Endpoints

### Backend Server (Port 5001)
- `POST /detect_phishing` - URL phishing detection
- `POST /analyze_logs` - Security log analysis
- `POST /check_file_integrity` - File integrity verification
- `POST /analyze_image` - Image forensics analysis

### ML Service (Port 5000)
- Direct ML model inference endpoints
- Model training and retraining capabilities

## 🎨 Frontend

Built with React featuring:
- Modern glassmorphism UI design
- Responsive layout with CSS Grid/Flexbox
- Real-time analysis results
- Interactive charts and visualizations

## 🔐 Security Features

- **Phishing Detection**: Advanced ML algorithms for URL analysis
- **Log Monitoring**: Pattern recognition for security threats
- **File Verification**: SHA-256 hash-based integrity checking
- **Image Forensics**: EXIF data analysis and manipulation detection

## 📂 Project Structure

```
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   └── styles/
│   ├── package.json
│   └── README.md
├── server/
│   ├── index.js
│   └── package.json
├── ml-model/
│   ├── models/          # Pre-trained ML models
│   ├── app.py          # Flask API server
│   ├── requirements.txt
│   └── training scripts/
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

- Frontend uses React with modern hooks and functional components
- Backend uses Express.js with CORS enabled for cross-origin requests
- ML service uses Flask with scikit-learn models
- All services communicate via RESTful APIs

## 🐛 Troubleshooting

### Common Issues:
1. **Port conflicts**: Ensure ports 3000, 5000, 5001 are available
2. **CORS errors**: Backend includes CORS middleware for development
3. **Python dependencies**: Use pip install -r requirements.txt for ML service
4. **Node modules**: Run npm install in both client/ and server/ directories

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Deployment

For production deployment, this platform is optimized for Replit's deployment infrastructure with automatic scaling and monitoring capabilities.
