# 🖥️ LOCAL DEVELOPMENT & TESTING GUIDE

## 📋 Prerequisites

Before starting, ensure you have these installed:

- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **pnpm 8+** - Install with: `npm install -g pnpm`
- **MongoDB** - Local installation OR MongoDB Atlas account
- **Git** - For version control
- **VS Code** (recommended) - With TypeScript and ESLint extensions

### Quick Version Check
```bash
node --version    # Should show v18+ 
pnpm --version    # Should show 8+
git --version     # Any recent version
```

## 🗄️ DATABASE SETUP

### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Edition**:
   
   **Windows:**
   ```bash
   # Download from https://www.mongodb.com/try/download/community
   # OR using Chocolatey:
   choco install mongodb
   ```
   
   **macOS:**
   ```bash
   # Using Homebrew:
   brew tap mongodb/brew
   brew install mongodb-community
   ```
   
   **Linux (Ubuntu/Debian):**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB Service**:
   
   **Windows:**
   ```bash
   # Start as Windows service (if installed as service)
   net start MongoDB
   
   # OR run manually:
   "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```
   
   **macOS:**
   ```bash
   # Start as service:
   brew services start mongodb-community
   
   # OR run manually:
   mongod --config /usr/local/etc/mongod.conf
   ```
   
   **Linux:**
   ```bash
   # Start as service:
   sudo systemctl start mongod
   sudo systemctl enable mongod  # Auto-start on boot
   
   # OR run manually:
   mongod --dbpath /data/db
   ```

3. **Verify MongoDB is Running**:
   ```bash
   # Connect to MongoDB shell
   mongosh
   # You should see: "test>"
   # Type "exit" to quit
   ```

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free account and cluster (M0 - Free tier)
3. Create database user with read/write permissions
4. Add your IP to network access (or use 0.0.0.0/0 for development)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/chatroom`

## 🚀 PROJECT SETUP

### 1. Clone and Install Dependencies

```bash
# Navigate to your project directory
cd /path/to/chat-room

# Install all dependencies (this may take a few minutes)
pnpm install

# Verify installation
pnpm --version
```

### 2. Create Environment Files

Create environment files for both frontend and backend:

**Backend Environment (`apps/server/.env`):**
```bash
# Create environment file
touch apps/server/.env

# Add the following content:
```

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/chatroom
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/chatroom

# Authentication (REQUIRED - Generate secure secret)
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

# WebRTC Configuration (Optional for testing)
STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
```

**Frontend Environment (`apps/web/.env`):**
```bash
# Create environment file
touch apps/web/.env

# Add the following content:
```

```env
# Backend API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001

# WebRTC Configuration
VITE_STUN_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302

# App Configuration
VITE_APP_NAME=Chat Room (Local)
VITE_APP_VERSION=1.0.0-dev

# Environment
VITE_NODE_ENV=development
```

### 3. Generate Secure JWT Secret

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and replace JWT_SECRET in apps/server/.env
```

## 🏗️ BUILD SHARED PACKAGES

```bash
# Build shared packages first (required for development)
pnpm run build:shared

# Verify build completed successfully
ls -la packages/shared/dist/
# Should see compiled JavaScript files
```

## 🔧 DEVELOPMENT WORKFLOW

### Method 1: Run All Services Together (Recommended)

```bash
# Start all development servers simultaneously
pnpm dev

# This will start:
# - Backend server on http://localhost:3001
# - Frontend development server on http://localhost:3000
# - Type checking and hot reload for both
```

### Method 2: Run Services Separately

**Terminal 1 - Backend:**
```bash
# Start backend server
pnpm --filter @chat-room/server dev

# You should see:
# "🚀 Server running on port 3001"
# "✅ Database connected successfully"
```

**Terminal 2 - Frontend:**
```bash
# Start frontend development server
pnpm --filter @chat-room/web dev

# You should see:
# "Local: http://localhost:3000"
# "Network: http://192.168.x.x:3000"
```

**Terminal 3 - Shared Package (if making changes):**
```bash
# Watch for changes in shared package
pnpm --filter @chat-room/shared dev
```

## ✅ VERIFICATION & TESTING

### 1. Backend Health Check

```bash
# Test backend is running
curl http://localhost:3001/health

# Expected response:
# {"success":true,"message":"Server is healthy","timestamp":"...","uptime":...}
```

### 2. Database Connection

```bash
# Check MongoDB connection (if running locally)
mongosh chatroom --eval "db.stats()"

# Should show database statistics without errors
```

### 3. Frontend Access

1. Open browser to: http://localhost:3000
2. You should see the Chat Room homepage
3. Check browser console for any errors (F12 → Console)

### 4. Full Application Testing

**Test User Registration:**
1. Navigate to http://localhost:3000/register
2. Fill out the registration form:
   - Display Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Submit form
4. Should redirect to dashboard on success

**Test User Login:**
1. Navigate to http://localhost:3000/login
2. Use the credentials from registration
3. Should redirect to dashboard

**Test Room Creation:**
1. From dashboard, go to "Create Room"
2. Create a test room:
   - Name: "Test Room"
   - Description: "Testing local development"
   - Leave as public
   - Max participants: 10
3. Submit form
4. Should create room successfully

**Test Real-time Features:**
1. Open two browser windows/tabs
2. Login with different users in each
3. Join the same room
4. Test text chat (when implemented)
5. Check browser console for Socket.IO connection logs

## 🐛 TROUBLESHOOTING

### Common Issues & Solutions

**1. "Cannot connect to MongoDB"**
```bash
# Check if MongoDB is running
# Local MongoDB:
pgrep mongod  # Should return a process ID

# If not running, start it:
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB

# Check connection string in apps/server/.env
```

**2. "Port 3000/3001 already in use"**
```bash
# Find process using the port
lsof -i :3000  # or :3001
# Kill the process
kill -9 <PID>

# Or change port in environment files
```

**3. "Module not found" errors**
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild shared packages
pnpm run build:shared
```

**4. "CORS errors in browser"**
```bash
# Verify CORS_ORIGIN in apps/server/.env matches frontend URL
CORS_ORIGIN=http://localhost:3000

# Restart backend server after changes
```

**5. TypeScript compilation errors**
```bash
# Check TypeScript in all packages
pnpm type-check

# Fix any TypeScript errors before proceeding
```

**6. Socket.IO connection failed**
```bash
# Check browser console for WebSocket errors
# Verify VITE_WS_URL in apps/web/.env
VITE_WS_URL=http://localhost:3001

# Restart frontend dev server
```

## 🔍 MONITORING & DEBUGGING

### View Logs

**Backend Logs:**
```bash
# Backend logs are printed to terminal
# Look for:
# - Database connection status
# - API request logs
# - Socket.IO connection logs
# - Error messages
```

**Frontend Logs:**
```bash
# Open browser DevTools (F12)
# Check Console tab for:
# - API request/response logs
# - Socket.IO connection status
# - React component errors
# - Network errors
```

### Database Inspection

```bash
# Connect to MongoDB shell
mongosh chatroom

# View collections
show collections

# View users
db.users.find().pretty()

# View rooms
db.rooms.find().pretty()

# View messages
db.messages.find().pretty()
```

### API Testing with curl

```bash
# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","displayName":"Test User"}'

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test public rooms
curl http://localhost:3001/api/rooms
```

## 🧪 AUTOMATED TESTING

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @chat-room/server test
pnpm --filter @chat-room/web test

# Run tests with coverage
pnpm test:coverage

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Check code formatting
pnpm format:check

# Fix formatting
pnpm format
```

## 📊 PERFORMANCE MONITORING

### Development Tools

1. **React DevTools** - Install browser extension for React debugging
2. **Redux DevTools** - For Zustand state inspection
3. **Network Tab** - Monitor API calls and WebSocket messages
4. **Performance Tab** - Analyze frontend performance

### Key Metrics to Monitor

- **API Response Times** - Should be < 200ms for most endpoints
- **Database Queries** - Monitor slow queries in MongoDB logs
- **WebSocket Latency** - Real-time message delay
- **Memory Usage** - Both frontend and backend
- **Bundle Size** - Frontend JavaScript bundle size

## 🚀 PRODUCTION-READY TESTING

Before deploying, run these final checks:

```bash
# Build all packages
pnpm build

# Verify builds completed successfully
ls -la apps/web/dist/
ls -la apps/server/dist/

# Test production build locally
cd apps/server
npm start  # Should start with production settings

# In another terminal, serve frontend build
cd apps/web
npx serve dist  # Serves on http://localhost:3000
```

## 📝 NEXT STEPS

Once local development is working:

1. **Complete Core Features** - Implement remaining functionality
2. **Add Tests** - Write unit and integration tests
3. **Security Audit** - Review security configurations
4. **Performance Testing** - Load test with multiple users
5. **Deploy** - Follow deployment instructions

---

**🎉 Congratulations!** Your Chat Room application is now running locally and ready for development and testing!

For deployment instructions, see `DEPLOYMENT_INSTRUCTIONS.md`
