#!/bin/bash

# Local Development Setup Script for Chat Room Application
echo "🚀 Setting up Chat Room for local development..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION found. Please install Node.js 18 or higher."
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm $(pnpm --version) found"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build shared packages
echo "🏗️ Building shared packages..."
pnpm run build:shared

# Create environment files
echo "🔧 Creating environment files..."

# Backend environment file
cat > apps/server/.env << 'EOF'
# Backend Environment Configuration for Local Development

# Database Configuration (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/chatroom
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/chatroom

# Authentication (REQUIRED - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_development_jwt_secret_at_least_32_characters_long_example_key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Rate Limiting (Relaxed for development)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug

# WebRTC Configuration (Optional)
STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302

# Optional: Redis for caching (leave empty for development)
# REDIS_URL=redis://localhost:6379
EOF

# Frontend environment file
cat > apps/web/.env << 'EOF'
# Frontend Environment Configuration for Local Development

# Backend API Configuration (REQUIRED)
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001

# WebRTC Configuration
VITE_STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302

# App Configuration
VITE_APP_NAME=Chat Room (Local)
VITE_APP_VERSION=1.0.0-dev

# Environment
VITE_NODE_ENV=development
EOF

# Generate JWT secret
echo "🔐 Generating secure JWT secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Replace JWT_SECRET in backend .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/JWT_SECRET=your_development_jwt_secret_at_least_32_characters_long_example_key/JWT_SECRET=$JWT_SECRET/" apps/server/.env
else
    # Linux
    sed -i "s/JWT_SECRET=your_development_jwt_secret_at_least_32_characters_long_example_key/JWT_SECRET=$JWT_SECRET/" apps/server/.env
fi

echo "✅ Environment files created successfully!"

# Check MongoDB
echo "🗄️ Checking MongoDB..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is running and accessible"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "   Start it with: brew services start mongodb-community (macOS) or sudo systemctl start mongod (Linux)"
    fi
elif command -v mongo &> /dev/null; then
    if mongo --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is running and accessible"
    else
        echo "⚠️  MongoDB is installed but not running"
    fi
else
    echo "⚠️  MongoDB not found locally"
    echo "   Install with: brew install mongodb-community (macOS) or use MongoDB Atlas"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Ensure MongoDB is running:"
echo "   Local: brew services start mongodb-community (macOS)"
echo "   Or: sudo systemctl start mongod (Linux)"
echo "   Or: Use MongoDB Atlas cloud database"
echo ""
echo "2. Start development servers:"
echo "   pnpm dev"
echo ""
echo "3. Open your browser:"
echo "   Frontend: http://localhost:3000"
echo "   Backend Health: http://localhost:3001/health"
echo ""
echo "4. Test the application:"
echo "   - Register a new user"
echo "   - Login with your credentials"
echo "   - Create a test room"
echo ""
echo "For detailed instructions, see LOCAL_DEVELOPMENT.md"
