
#!/bin/bash

echo "🚀 Setting up CYBER.AI Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
cd ../server && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

# Install ML service dependencies
echo "📦 Installing ML service dependencies..."
cd ../ml-model && pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install ML service dependencies"
    exit 1
fi

cd ..
echo "✅ Setup completed successfully!"
echo ""
echo "🎉 To start the development servers:"
echo "   Frontend: cd client && npm start"
echo "   Backend:  cd server && npm start" 
echo "   ML API:   cd ml-model && python app.py"
echo ""
echo "🌐 Access the application at http://localhost:3000"
