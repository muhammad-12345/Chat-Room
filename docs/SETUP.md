# Setup Guide

## Prerequisites

- Node.js 18+ 
- pnpm 8+
- MongoDB (local or Atlas)
- Git

## Quick Start

1. **Clone and Install**:
```bash
git clone <your-repo-url>
cd chat-room
pnpm install
```

2. **Environment Configuration** (See details below)

3. **Start Development**:
```bash
pnpm dev
```

## 🔧 Environment Configuration

### Backend Environment (`apps/server/.env`)

**Copy from `apps/server/.env.example` and configure:**

```env
# Database (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/chatroom
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/chatroom

# Authentication (REQUIRED)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# WebRTC Configuration
STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Frontend Environment (`apps/web/.env`)

**Copy from `apps/web/.env.example` and configure:**

```env
# Backend API Configuration (REQUIRED)
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001

# WebRTC Configuration
VITE_STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302

# App Configuration
VITE_APP_NAME=Chat Room
VITE_APP_VERSION=1.0.0

# Environment
VITE_NODE_ENV=development
```

## 🗄️ Database Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community
brew services start mongodb-community

# Use default connection string
MONGODB_URI=mongodb://localhost:27017/chatroom
```

### Option 2: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Add your IP to network access
4. Create database user
5. Get connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatroom
   ```

## 🔐 Security Configuration

### JWT Secret Generation
```bash
# Generate a secure JWT secret (minimum 32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Access Codes
- Private room access codes are automatically hashed with bcrypt
- No plaintext codes are stored in the database

## 🚀 Production Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Railway/Render)
1. Connect GitHub repo to Railway/Render
2. Set environment variables
3. Ensure WebSocket support is enabled
4. Deploy automatically on push to main

### Database (MongoDB Atlas)
1. Create production cluster
2. Configure network access for deployment platform
3. Update connection string in production environment

## 📁 Important Files to Configure

### Required Configuration Files:
- `apps/server/.env` - Backend environment variables
- `apps/web/.env` - Frontend environment variables

### Optional Configuration:
- `apps/server/logs/` - Create directory for production logs
- `.env` files in project root (if using Docker)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific app tests
pnpm --filter @chat-room/server test
pnpm --filter @chat-room/web test

# Type checking
pnpm type-check
```

## 🛠️ Development

```bash
# Start all services
pnpm dev

# Start specific services
pnpm --filter @chat-room/server dev
pnpm --filter @chat-room/web dev

# Build for production
pnpm build

# Lint and format
pnpm lint
pnpm format
```

## ⚠️ Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Check MongoDB is running locally
   - Verify connection string format
   - Check network access for Atlas

2. **CORS Errors**
   - Ensure `CORS_ORIGIN` matches frontend URL
   - Check both environment files

3. **Socket Connection Failed**
   - Verify `VITE_WS_URL` matches backend URL
   - Check JWT token is valid

4. **Build Errors**
   - Run `pnpm install` in project root
   - Check TypeScript configurations
   - Verify all environment variables are set
